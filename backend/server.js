// ══════════════════════════════════════════════════════════
//  MOUNTAINDZ BACKEND — server.js
//  Stack: Node.js + Express + SQLite (no cloud needed)
//  Run:   node server.js
//  API:   http://localhost:3000
// ══════════════════════════════════════════════════════════

const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = 'mountaindz_jwt_secret_2026'; // change in production!

function safeParseArticles(articlesRaw) {
  if (!articlesRaw) return [];
  try {
    const parsed = JSON.parse(articlesRaw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: '*' })); // allow your HTML files to call the API
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(express.static(path.join(__dirname, '..'), { index: false })); // serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'accueil.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// ── Database ────────────────────────────────────────────
const db = new Database('./mountaindz.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ══════════════════════════════════════════════════════════
//  CREATE TABLES (runs once on first start)
// ══════════════════════════════════════════════════════════
db.exec(`

  -- USERS
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom      TEXT    NOT NULL,
    nom         TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    telephone   TEXT,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'client',  -- 'client' | 'admin'
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  -- RESERVATIONS (activités + hébergements + restaurants)
  CREATE TABLE IF NOT EXISTS reservations (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type         TEXT    NOT NULL,   -- 'activite' | 'hebergement' | 'restaurant' | 'formation'
    titre        TEXT    NOT NULL,
    lieu         TEXT,
    date_debut   TEXT,
    date_fin     TEXT,
    personnes    INTEGER DEFAULT 1,
    prix_total   TEXT,
    statut       TEXT    DEFAULT 'confirmé',  -- 'confirmé'|'annulé'|'en_attente'
    icon         TEXT    DEFAULT '📅',
    details      TEXT,               -- JSON blob for extra fields
    created_at   TEXT    DEFAULT (datetime('now'))
  );

  -- COMMANDES (boutique)
  CREATE TABLE IF NOT EXISTS commandes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    articles         TEXT    NOT NULL,  -- JSON array
    total            TEXT    NOT NULL,
    methode_paiement TEXT    DEFAULT 'Carte',
    statut           TEXT    DEFAULT 'En préparation',  -- 'En préparation'|'Expédiée'|'Livrée'|'Annulée'
    adresse_livraison TEXT,
    created_at       TEXT    DEFAULT (datetime('now'))
  );

  -- FAVORIS
  CREATE TABLE IF NOT EXISTS favoris (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id    TEXT    NOT NULL,   -- product id or activity key
    item_type  TEXT    NOT NULL,   -- 'article' | 'activite' | 'hebergement'
    nom        TEXT,
    img        TEXT,
    saved_at   TEXT    DEFAULT (datetime('now')),
    UNIQUE(user_id, item_id, item_type)
  );

  -- MESSAGES CONTACT
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom     TEXT NOT NULL,
    nom        TEXT,
    email      TEXT NOT NULL,
    telephone  TEXT,
    sujet      TEXT,
    message    TEXT NOT NULL,
    lu         INTEGER DEFAULT 0,   -- 0 = non lu, 1 = lu
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- CANDIDATURES EMPLOI
  CREATE TABLE IF NOT EXISTS candidatures (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom     TEXT NOT NULL,
    nom        TEXT,
    email      TEXT NOT NULL,
    telephone  TEXT,
    poste      TEXT NOT NULL,
    message    TEXT,
    statut     TEXT DEFAULT 'reçue',  -- 'reçue'|'en_examen'|'acceptée'|'refusée'
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- PRODUITS (boutique — optionnel pour admin CRUD)
  CREATE TABLE IF NOT EXISTS produits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nom         TEXT    NOT NULL,
    categorie   TEXT,
    prix        INTEGER NOT NULL,
    prix_location INTEGER,
    stock       INTEGER DEFAULT 0,
    img         TEXT,
    description TEXT,
    actif       INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- HEBERGEMENTS
  CREATE TABLE IF NOT EXISTS hebergements (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nom         TEXT    NOT NULL,
    type        TEXT,              -- 'hotel'|'chalet'|'tente'
    localisation TEXT,
    prix_nuit   INTEGER NOT NULL,
    rating      REAL    DEFAULT 0,
    img         TEXT,
    description TEXT,
    actif       INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- ACTIVITES
  CREATE TABLE IF NOT EXISTS activites (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nom           TEXT  NOT NULL,
    categorie     TEXT,             -- 'ski'|'randonnee'|'parapente' etc.
    saison        TEXT,
    prix          INTEGER NOT NULL,
    prix_location INTEGER,
    disponibilite TEXT    DEFAULT 'disponible',
    places_max    INTEGER DEFAULT 15,
    img           TEXT,
    description   TEXT,
    actif         INTEGER DEFAULT 1,
    created_at    TEXT DEFAULT (datetime('now'))
  );

`);

// ── Seed default admin if not exists ────────────────────
const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get('admin@mountaindz.com');
if (!adminExists) {
  const hashed = bcrypt.hashSync('Admin2026!', 10);
  db.prepare(`INSERT INTO users (prenom,nom,email,password,role)
              VALUES (?,?,?,?,?)`).run('Admin', 'MountainDZ', 'admin@mountaindz.com', hashed, 'admin');
  console.log('✅ Admin créé: admin@mountaindz.com / Admin2026!');
}

// ══════════════════════════════════════════════════════════
//  AUTH MIDDLEWARE
// ══════════════════════════════════════════════════════════
function authRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
}

function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
    next();
  });
}

// ══════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { prenom, nom, email, password, telephone } = req.body;
  if (!prenom || !email || !password) return res.status(400).json({ error: 'Champs manquants' });
  if (password.length < 6) return res.status(400).json({ error: 'Mot de passe trop court' });

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (prenom,nom,email,password,telephone) VALUES (?,?,?,?,?)'
  ).run(prenom, nom || '', email, hashed, telephone || '');

  const user = { id: result.lastInsertRowid, prenom, nom: nom || '', email, role: 'client' };
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Champs manquants' });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password))
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const user = { id: row.id, prenom: row.prenom, nom: row.nom, email: row.email, role: row.role };
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

// POST /api/auth/google/mock
app.post('/api/auth/google/mock', (req, res) => {
  const { email, prenom, nom } = req.body;
  if (!email || !prenom) return res.status(400).json({ error: 'Champs manquants' });

  let row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!row) {
    const hashed = bcrypt.hashSync(Math.random().toString(36).slice(-8), 10);
    const result = db.prepare(
      'INSERT INTO users (prenom,nom,email,password,telephone) VALUES (?,?,?,?,?)'
    ).run(prenom, nom || '', email, hashed, '');
    row = { id: result.lastInsertRowid, prenom, nom: nom || '', email, role: 'client' };
  }

  const user = { id: row.id, prenom: row.prenom, nom: row.nom, email: row.email, role: row.role };
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

// GET /api/auth/me
app.get('/api/auth/me', authRequired, (req, res) => {
  const row = db.prepare('SELECT id,prenom,nom,email,telephone,role,created_at FROM users WHERE id=?').get(req.user.id);
  res.json(row);
});

// ══════════════════════════════════════════════════════════
//  RESERVATIONS
// ══════════════════════════════════════════════════════════

// POST /api/reservations  — save from any page
app.post('/api/reservations', authRequired, (req, res) => {
  const { type, titre, lieu, date_debut, date_fin, personnes, prix_total, icon, details } = req.body;
  if (!type || !titre) return res.status(400).json({ error: 'type et titre requis' });

  const result = db.prepare(`
    INSERT INTO reservations (user_id,type,titre,lieu,date_debut,date_fin,personnes,prix_total,icon,details)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `).run(req.user.id, type, titre, lieu || '', date_debut || '', date_fin || '',
    personnes || 1, prix_total || '', icon || '📅', JSON.stringify(details || {}));

  res.json({ id: result.lastInsertRowid, message: 'Réservation enregistrée' });
});

// GET /api/reservations — user's own
app.get('/api/reservations', authRequired, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM reservations WHERE user_id=? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json(rows);
});

// DELETE /api/reservations/:id
app.delete('/api/reservations/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM reservations WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  res.json({ message: 'Réservation supprimée' });
});

// ══════════════════════════════════════════════════════════
//  COMMANDES
// ══════════════════════════════════════════════════════════

app.post('/api/commandes', authRequired, (req, res) => {
  const { articles, total, methode_paiement, adresse_livraison } = req.body;
  if (!articles || !total) return res.status(400).json({ error: 'articles et total requis' });

  const result = db.prepare(`
    INSERT INTO commandes (user_id,articles,total,methode_paiement,adresse_livraison)
    VALUES (?,?,?,?,?)
  `).run(req.user.id, JSON.stringify(articles), total, methode_paiement || 'Carte', adresse_livraison || '');

  res.json({ id: result.lastInsertRowid, message: 'Commande enregistrée' });
});

app.get('/api/commandes', authRequired, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM commandes WHERE user_id=? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json(rows.map(r => ({ ...r, articles: safeParseArticles(r.articles) })));
});

// ══════════════════════════════════════════════════════════
//  FAVORIS
// ══════════════════════════════════════════════════════════

app.post('/api/favoris/toggle', authRequired, (req, res) => {
  const { item_id, item_type, nom, img } = req.body;
  const existing = db.prepare(
    'SELECT id FROM favoris WHERE user_id=? AND item_id=? AND item_type=?'
  ).get(req.user.id, item_id, item_type);

  if (existing) {
    db.prepare('DELETE FROM favoris WHERE id=?').run(existing.id);
    res.json({ added: false });
  } else {
    db.prepare('INSERT INTO favoris (user_id,item_id,item_type,nom,img) VALUES (?,?,?,?,?)')
      .run(req.user.id, item_id, item_type, nom || '', img || '');
    res.json({ added: true });
  }
});

app.get('/api/favoris', authRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM favoris WHERE user_id=? ORDER BY saved_at DESC').all(req.user.id);
  res.json(rows);
});

// ══════════════════════════════════════════════════════════
//  MESSAGES CONTACT
// ══════════════════════════════════════════════════════════

app.post('/api/messages', (req, res) => { // public — no auth needed
  const { prenom, nom, email, telephone, sujet, message } = req.body;
  if (!prenom || !email || !message) return res.status(400).json({ error: 'Champs manquants' });

  db.prepare('INSERT INTO messages (prenom,nom,email,telephone,sujet,message) VALUES (?,?,?,?,?,?)')
    .run(prenom, nom || '', email, telephone || '', sujet || '', message);
  res.json({ message: 'Message envoyé' });
});

// ══════════════════════════════════════════════════════════
//  CANDIDATURES EMPLOI
// ══════════════════════════════════════════════════════════

app.post('/api/candidatures', (req, res) => { // public
  const prenom = (req.body?.prenom || '').trim();
  const nom = (req.body?.nom || '').trim();
  const email = (req.body?.email || '').trim();
  const telephone = (req.body?.telephone || '').trim();
  const poste = (req.body?.poste || '').trim();
  const message = (req.body?.message || '').trim();
  if (!prenom || !email || !poste) return res.status(400).json({ error: 'Champs manquants' });

  const result = db.prepare('INSERT INTO candidatures (prenom,nom,email,telephone,poste,message) VALUES (?,?,?,?,?,?)')
    .run(prenom, nom, email, telephone, poste, message);
  res.json({ message: 'Candidature envoyée', id: result.lastInsertRowid });
});

// ══════════════════════════════════════════════════════════
//  ADMIN ROUTES — dashboard data
// ══════════════════════════════════════════════════════════

// GET /api/admin/stats
app.get('/api/admin/stats', adminRequired, (req, res) => {
  res.json({
    users: db.prepare("SELECT COUNT(*) as n FROM users WHERE role='client'").get().n,
    reservations: db.prepare('SELECT COUNT(*) as n FROM reservations').get().n,
    commandes: db.prepare('SELECT COUNT(*) as n FROM commandes').get().n,
    messages_nonlus: db.prepare('SELECT COUNT(*) as n FROM messages WHERE lu=0').get().n,
    candidatures: db.prepare('SELECT COUNT(*) as n FROM candidatures').get().n,
    revenu_total: db.prepare("SELECT SUM(CAST(REPLACE(REPLACE(total,' DA',''),' ','') AS INTEGER)) as s FROM commandes WHERE statut != 'Annulée'").get().s || 0,
  });
});

// GET /api/admin/users
app.get('/api/admin/users', adminRequired, (req, res) => {
  const rows = db.prepare('SELECT id,prenom,nom,email,telephone,role,created_at FROM users ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/admin/reservations
app.get('/api/admin/reservations', adminRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT r.*, u.prenom||' '||u.nom as client_nom, u.email as client_email
    FROM reservations r LEFT JOIN users u ON r.user_id=u.id
    ORDER BY r.created_at DESC LIMIT 200
  `).all();
  res.json(rows);
});

// PATCH /api/admin/reservations/:id
app.patch('/api/admin/reservations/:id', adminRequired, (req, res) => {
  const { statut } = req.body;
  db.prepare('UPDATE reservations SET statut=? WHERE id=?').run(statut, req.params.id);
  res.json({ message: 'Mis à jour' });
});

// GET /api/admin/commandes
app.get('/api/admin/commandes', adminRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, u.prenom||' '||u.nom as client_nom, u.email as client_email
    FROM commandes c LEFT JOIN users u ON c.user_id=u.id
    ORDER BY c.created_at DESC LIMIT 200
  `).all();
  res.json(rows.map(r => ({ ...r, articles: safeParseArticles(r.articles) })));
});

// PATCH /api/admin/commandes/:id
app.patch('/api/admin/commandes/:id', adminRequired, (req, res) => {
  const { statut } = req.body;
  db.prepare('UPDATE commandes SET statut=? WHERE id=?').run(statut, req.params.id);
  res.json({ message: 'Mis à jour' });
});

// GET /api/admin/messages
app.get('/api/admin/messages', adminRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.json(rows);
});

// PATCH /api/admin/messages/:id/lu
app.patch('/api/admin/messages/:id/lu', adminRequired, (req, res) => {
  db.prepare('UPDATE messages SET lu=1 WHERE id=?').run(req.params.id);
  res.json({ message: 'Marqué comme lu' });
});

// GET /api/admin/candidatures
app.get('/api/admin/candidatures', adminRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM candidatures ORDER BY created_at DESC').all();
  res.json(rows);
});

// PATCH /api/admin/candidatures/:id
app.patch('/api/admin/candidatures/:id', adminRequired, (req, res) => {
  const { statut } = req.body;
  db.prepare('UPDATE candidatures SET statut=? WHERE id=?').run(statut, req.params.id);
  res.json({ message: 'Mis à jour' });
});

// ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏔️  MountainDZ API running → http://localhost:${PORT}`);
  console.log(`📊  Dashboard          → http://localhost:${PORT}/dashboard`);
  console.log(`🔑  Admin login        → admin@mountaindz.com / Admin2026!\n`);
});