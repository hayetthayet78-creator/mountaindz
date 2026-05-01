/* ══════════════════════════════════════════════════════════════
   API-CONNECTOR.JS — MountainDZ
   Connects all frontend pages to the real backend database.

   USAGE: Replace <script src="auth.js"> with:
   <script src="api-connector.js"></script>

   The connector provides the SAME MDZ object and requireAuth()
   function as auth.js, so all existing page code keeps working.
   Data now goes to/from the real SQLite database via the API.
══════════════════════════════════════════════════════════════ */

'use strict';

const API_URL = (
  window.location.protocol === 'file:'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`
);

// ══════════════════════════════════════════════════════════
//  MDZ OBJECT — same interface as auth.js but uses real API
// ══════════════════════════════════════════════════════════
const MDZ = {

  /* ── Token ── */
  getToken()  { return localStorage.getItem('mdz_token'); },
  setToken(t) { localStorage.setItem('mdz_token', t); },
  clearToken(){ localStorage.removeItem('mdz_token'); },

  /* ── User (cached in localStorage for speed) ── */
  getUser()   { try { return JSON.parse(localStorage.getItem('mdz_user_cache')) || null; } catch { return null; } },
  setUser(u)  { localStorage.setItem('mdz_user_cache', JSON.stringify(u)); },
  clearUser() { localStorage.removeItem('mdz_user_cache'); localStorage.removeItem('mdz_token'); },
  isLoggedIn(){ return !!MDZ.getToken() && !!MDZ.getUser(); },

  /* ── API fetch helper ── */
  async fetch(path, options = {}) {
    const token = MDZ.getToken();
    const res   = await fetch(API_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return res;
  },

  /* ── REGISTER ── */
  async register(prenom, nom, email, password, telephone) {
    const res  = await MDZ.fetch('/auth/register', {
      method: 'POST',
      body  : { prenom, nom, email, password, telephone }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inscription');
    MDZ.setToken(data.token);
    MDZ.setUser(data.user);
    updateNavForAuth();
    return data.user;
  },

  /* ── LOGIN ── */
  async login(email, password) {
    const res  = await MDZ.fetch('/auth/login', {
      method: 'POST',
      body  : { email, password }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Identifiants incorrects');
    MDZ.setToken(data.token);
    MDZ.setUser(data.user);
    updateNavForAuth();
    return data.user;
  },

  /* ── LOGOUT ── */
  logout() {
    MDZ.clearUser();
    window.location.href = 'accueil.html';
  },

  /* ── RESERVATIONS ── */
  async addReservation(r) {
    try {
      const res = await MDZ.fetch('/reservations', {
        method: 'POST',
        body  : {
          type       : r.type        || 'activite',
          titre      : r.titre       || '',
          lieu       : r.lieu        || '',
          date_debut : r.dateReservation ? r.dateReservation.split('→')[0].trim() : '',
          date_fin   : r.dateReservation && r.dateReservation.includes('→')
                         ? r.dateReservation.split('→')[1].trim() : '',
          personnes  : r.personnes   || 1,
          prix_total : r.prix        || '',
          icon       : r.icon        || '📅',
          details    : r
        }
      });
      const data = await res.json();
      // Also save locally for offline display
      _localAddReservation({ ...r, id: 'RES-' + data.id, date: new Date().toISOString() });
      return data;
    } catch (e) {
      console.warn('API unavailable, saving locally:', e.message);
      const local = { ...r, id: 'RES-' + Date.now(), date: new Date().toISOString() };
      _localAddReservation(local);
      return local;
    }
  },

  async getReservations() {
    try {
      const res  = await MDZ.fetch('/reservations');
      const data = await res.json();
      // Format to match dashboard modal format
      return data.map(r => ({
        id            : 'RES-' + r.id,
        titre         : r.titre,
        icon          : r.icon || '📅',
        dateReservation: r.date_debut + (r.date_fin ? ' → ' + r.date_fin : ''),
        lieu          : r.lieu,
        personnes     : r.personnes,
        prix          : r.prix_total,
        statut        : r.statut,
        type          : r.type,
        date          : r.created_at
      }));
    } catch {
      return _localGetReservations();
    }
  },

  /* ── COMMANDES ── */
  async addOrder(o) {
    try {
      const res = await MDZ.fetch('/commandes', {
        method: 'POST',
        body  : {
          articles        : o.articles || [],
          total           : o.total    || '',
          methode_paiement: o.methodePaiement || 'Carte',
          adresse_livraison: ''
        }
      });
      const data = await res.json();
      const order = { ...o, id: 'CMD-' + data.id, date: new Date().toISOString() };
      _localAddOrder(order);
      return order;
    } catch (e) {
      console.warn('API unavailable, saving locally:', e.message);
      const order = { ...o, id: 'CMD-' + Date.now(), date: new Date().toISOString() };
      _localAddOrder(order);
      return order;
    }
  },

  async getOrders() {
    try {
      const res  = await MDZ.fetch('/commandes');
      const data = await res.json();
      return data.map(c => ({
        id              : 'CMD-' + c.id,
        articles        : c.articles,
        total           : c.total,
        methodePaiement : c.methode_paiement,
        statut          : c.statut,
        date            : c.created_at,
        utilisateur     : c.client_email
      }));
    } catch {
      return _localGetOrders();
    }
  },

  /* ── FAVOURITES ── */
  async toggleFavourite(item) {
    try {
      const res  = await MDZ.fetch('/favoris/toggle', {
        method: 'POST',
        body  : { item_id: item.id, item_type: item.type, nom: item.nom, img: item.img }
      });
      const data = await res.json();
      return data.added;
    } catch {
      return _localToggleFavourite(item);
    }
  },

  async getFavourites() {
    try {
      const res  = await MDZ.fetch('/favoris');
      return await res.json();
    } catch {
      return _localGetFavourites();
    }
  },

  isFavourite(id, type) {
    const favs = _localGetFavourites();
    return favs.some(f => String(f.item_id) === String(id) && f.item_type === type);
  },

  /* ── WEATHER (unchanged from auth.js) ── */
  weatherCache: {},
  async getWeather(lat, lon, locationName) {
    const key = `${lat},${lon}`;
    if (MDZ.weatherCache[key] && Date.now() - MDZ.weatherCache[key].ts < 600000)
      return MDZ.weatherCache[key].data;
    try {
      const url  = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`;
      const res  = await fetch(url);
      const json = await res.json();
      const c    = json.current;
      const data = {
        temp      : Math.round(c.temperature_2m) + '°C',
        tempNum   : Math.round(c.temperature_2m),
        humidity  : c.relative_humidity_2m + '%',
        wind      : Math.round(c.wind_speed_10m) + ' km/h',
        icon      : _wmoIcon(c.weather_code),
        condition : _wmoLabel(c.weather_code),
        loc       : locationName || key
      };
      MDZ.weatherCache[key] = { ts: Date.now(), data };
      return data;
    } catch {
      return { temp:'N/A', humidity:'N/A', wind:'N/A', icon:'🌤️', condition:'Données indisponibles', loc: locationName };
    }
  },

  stationCoords: {
    'Tikejda'     : { lat: 36.37, lon: 3.67  },
    'Tikjda'      : { lat: 36.37, lon: 3.67  },
    'Chéria'      : { lat: 35.28, lon: 8.30  },
    'Tala Guilef' : { lat: 36.50, lon: 4.10  },
    'Babor'       : { lat: 36.52, lon: 5.48  },
    'Chélia'      : { lat: 35.29, lon: 6.62  },
    'Djurdjura'   : { lat: 36.46, lon: 4.10  },
    'Chréa'       : { lat: 36.43, lon: 2.89  },
    'Théniet El Had': { lat: 35.85, lon: 2.01 }
  },

  getAvailability: async function(activityKey, locationName) {
    const coords = MDZ.stationCoords[locationName];
    let weather  = null;
    if (coords) weather = await MDZ.getWeather(coords.lat, coords.lon, locationName);
    const existing = (await MDZ.getReservations()).filter(r =>
      r.type === 'activite' && r.lieu === locationName
    ).length;
    const maxPlaces = 15;
    const taken     = Math.min(existing + _pseudoRandom(activityKey + locationName, 2, 8), maxPlaces);
    const remaining = maxPlaces - taken;
    let weatherNote = null;
    if (weather) {
      const wc = weather.condition.toLowerCase();
      if (wc.includes('orage') || wc.includes('verglaç'))
        return { statut:'indispo', placesRestantes:0, note:'⛈️ Conditions météo dangereuses — activité suspendue', weather };
      if (['ski','Snowboard','raquettes'].includes(activityKey) && weather.tempNum > 5)
        weatherNote = '⚠️ Températures douces — enneigement limité';
      if (activityKey === 'parapente' && parseInt(weather.wind) > 35)
        return { statut:'indispo', placesRestantes:0, note:'💨 Vents trop forts — vol annulé', weather };
    }
    const statut = remaining === 0 ? 'complet' : remaining <= 3 ? 'limite' : 'disponible';
    return { statut, placesRestantes: remaining, note: weatherNote, weather };
  }
};

// ══════════════════════════════════════════════════════════
//  LOCAL STORAGE FALLBACK (when API is offline)
// ══════════════════════════════════════════════════════════
function _localGetReservations()  { try { return JSON.parse(localStorage.getItem('mdz_reservations')||'[]'); } catch { return []; } }
function _localAddReservation(r)  { const l = _localGetReservations(); l.unshift(r); localStorage.setItem('mdz_reservations', JSON.stringify(l)); }
function _localGetOrders()        { try { return JSON.parse(localStorage.getItem('mdz_orders')||'[]');        } catch { return []; } }
function _localAddOrder(o)        { const l = _localGetOrders(); l.unshift(o); localStorage.setItem('mdz_orders', JSON.stringify(l)); }
function _localGetFavourites()    { try { return JSON.parse(localStorage.getItem('mdz_favourites')||'[]');    } catch { return []; } }
function _localToggleFavourite(item) {
  const list = _localGetFavourites();
  const idx  = list.findIndex(f => String(f.item_id) === String(item.id) && f.item_type === item.type);
  if (idx >= 0) { list.splice(idx, 1); localStorage.setItem('mdz_favourites', JSON.stringify(list)); return false; }
  else { list.unshift({ item_id: item.id, item_type: item.type, nom: item.nom, img: item.img }); localStorage.setItem('mdz_favourites', JSON.stringify(list)); return true; }
}

// ══════════════════════════════════════════════════════════
//  AUTH GUARD — same as auth.js
// ══════════════════════════════════════════════════════════
function requireAuth(actionLabel) {
  if (MDZ.isLoggedIn()) return true;
  showAuthRequiredModal(actionLabel);
  return false;
}

function showAuthRequiredModal(actionLabel) {
  if (!document.getElementById('authRequiredOverlay')) {
    const el = document.createElement('div');
    el.innerHTML = `
    <div id="authRequiredOverlay" onclick="closeAuthRequired()" style="
      position: fixed; inset: 0; background: rgba(6, 14, 30, 0.85);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px;
      animation: fadeIn 0.3s ease;">
      
      <div onclick="event.stopPropagation()" style="
        background: rgba(13, 28, 55, 0.6);
        backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 28px;
        padding: 48px 40px;
        max-width: 420px; width: 100%;
        box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        text-align: center;
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Outfit', sans-serif;">
        
        <div style="
          width: 72px; height: 72px; margin: 0 auto 24px;
          background: rgba(59, 139, 250, 0.1);
          border: 1px solid rgba(59, 139, 250, 0.3);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #3b8bfa; box-shadow: 0 0 30px rgba(59, 139, 250, 0.2);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        
        <h3 style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 12px; letter-spacing: -0.01em;">Accès restreint</h3>
        <p id="authReqMsg" style="font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; font-weight: 300;"></p>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button onclick="window.location.href='signin.html'" style="
            width: 100%; padding: 14px; background: #3b8bfa; border: none; border-radius: 14px;
            color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: inherit;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            box-shadow: 0 8px 24px rgba(59, 139, 250, 0.25); transition: all 0.3s ease;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Se connecter
          </button>
          
          <button onclick="window.location.href='signin.html?tab=register'" style="
            width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px;
            color: #fff; font-size: 1rem; font-weight: 500; cursor: pointer; font-family: inherit;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.3s ease;"
            onmouseover="this.style.background='rgba(255,255,255,0.1)'"
            onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Créer un compte
          </button>
          
          <button onclick="closeAuthRequired()" style="
            background: none; border: none; color: #94a3b8; font-size: 0.9rem;
            cursor: pointer; padding: 10px; font-family: inherit; font-weight: 500;
            margin-top: 8px; transition: color 0.2s ease;"
            onmouseover="this.style.color='#fff'"
            onmouseout="this.style.color='#94a3b8'">
            Annuler
          </button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(el.firstElementChild);
  }
  document.getElementById('authReqMsg').textContent =
    `Connectez-vous ou créez un compte gratuit pour ${actionLabel || 'effectuer cette action'}.`;
  document.getElementById('authRequiredOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAuthRequired() {
  const el = document.getElementById('authRequiredOverlay');
  if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
}

// ══════════════════════════════════════════════════════════
//  NAV UPDATE
// ══════════════════════════════════════════════════════════
function updateNavForAuth() {
  const user = MDZ.getUser();
  const label = document.querySelector('.btn-account');
  if (!label || !user) return;
  const textNode = [...label.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (textNode) textNode.textContent = ` ${user.prenom || user.email.split('@')[0]} `;
  const dd = document.getElementById('accountDropdown');
  if (dd && !dd.querySelector('.btn-logout')) {
    const btn = document.createElement('button');
    btn.className = 'btn-logout';
    btn.style.cssText = `
      display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
      padding:11px;background:rgba(231,76,60,.15);border:1px solid rgba(231,76,60,.30);
      border-radius:50px;color:#ff8a7a;font-size:.88rem;font-weight:700;cursor:pointer;
      font-family:inherit;margin-top:8px;`;
    btn.innerHTML = '🚪 Se déconnecter';
    btn.onclick = () => MDZ.logout();
    dd.appendChild(btn);
    const connectBtn = dd.querySelector('.btn-connect');
    const newClient  = dd.querySelector('.dropdown-new-client');
    if (connectBtn) connectBtn.style.display = 'none';
    if (newClient)  newClient.style.display  = 'none';
  }
}

// ══════════════════════════════════════════════════════════
//  ACCOUNT DASHBOARD MODAL (same as auth.js)
// ══════════════════════════════════════════════════════════
function openAccountDashboard(tab) {
  if (!requireAuth('accéder à votre espace personnel')) return;
  if (!document.getElementById('dashOverlay')) _injectDashboard();
  _showDashTab(tab || 'reservations');
  document.getElementById('dashOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAccountDashboard() {
  const el = document.getElementById('dashOverlay');
  if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
}

function _injectDashboard() {
  const el = document.createElement('div');
  el.id = 'dashOverlay';
  el.onclick = function(e){ if(e.target===this) closeAccountDashboard(); };
  el.style.cssText = `position:fixed;inset:0;background:rgba(5,14,30,.75);backdrop-filter:blur(10px);z-index:3000;display:none;align-items:center;justify-content:center;padding:16px;`;
  el.innerHTML = `
    <div onclick="event.stopPropagation()" style="background:linear-gradient(160deg,rgba(13,28,55,.97),rgba(8,18,36,.99));border:1px solid rgba(255,255,255,.13);border-radius:24px;width:min(680px,100%);max-height:88vh;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.6);overflow:hidden;">
      <div style="padding:22px 28px 0;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <div style="font-size:1.15rem;font-weight:800;color:#fff;">👤 Mon Espace Personnel</div>
          <button onclick="closeAccountDashboard()" style="width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-size:1rem;display:grid;place-items:center;">✕</button>
        </div>
        <div style="display:flex;gap:6px;border-bottom:1px solid rgba(255,255,255,.10);padding-bottom:0;">
          ${[{id:'reservations',label:'📅 Réservations'},{id:'commandes',label:'🛒 Commandes'},{id:'favoris',label:'❤️ Favoris'}].map(t=>`
            <button id="dashTab_${t.id}" onclick="_showDashTab('${t.id}')" style="padding:10px 18px;border:none;border-radius:10px 10px 0 0;background:transparent;color:rgba(255,255,255,.50);font-size:.88rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;border-bottom:3px solid transparent;margin-bottom:-1px;">${t.label}</button>
          `).join('')}
        </div>
      </div>
      <div id="dashBody" style="flex:1;overflow-y:auto;padding:24px 28px 28px;"><div id="dashContent"></div></div>
    </div>`;
  document.body.appendChild(el);
}

async function _showDashTab(tab) {
  ['reservations','commandes','favoris'].forEach(t => {
    const btn = document.getElementById('dashTab_' + t);
    if (!btn) return;
    if (t === tab) { btn.style.color='#fff'; btn.style.borderBottomColor='#3b8bfa'; btn.style.background='rgba(59,139,250,.10)'; }
    else { btn.style.color='rgba(255,255,255,.50)'; btn.style.borderBottomColor='transparent'; btn.style.background='transparent'; }
  });
  const content = document.getElementById('dashContent');
  if (!content) return;
  content.innerHTML = '<div style="text-align:center;padding:32px;color:rgba(255,255,255,.40);">⏳ Chargement…</div>';

  if (tab === 'reservations') {
    const list = await MDZ.getReservations();
    content.innerHTML = list.length ? list.map(r=>`
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:16px 18px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="font-size:1rem;font-weight:700;color:#fff;">${r.icon||'📅'} ${r.titre}</div>
          <span style="font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:50px;background:${r.statut==='confirmé'?'rgba(46,168,79,.20)':'rgba(59,139,250,.15)'};color:${r.statut==='confirmé'?'#6ee89a':'#7db8ff'};">${r.statut||'Confirmé'}</span>
        </div>
        <div style="font-size:.82rem;color:rgba(255,255,255,.50);display:flex;gap:16px;flex-wrap:wrap;">
          ${r.dateReservation?`<span>📅 ${r.dateReservation}</span>`:''}
          ${r.lieu?`<span>📍 ${r.lieu}</span>`:''}
          ${r.personnes?`<span>👥 ${r.personnes} pers.</span>`:''}
          ${r.prix?`<span>💰 ${r.prix}</span>`:''}
        </div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.28);margin-top:6px;">${r.id} · ${new Date(r.date).toLocaleDateString('fr-FR')}</div>
      </div>`).join('') : _dashEmpty('📅','Aucune réservation','Vos réservations apparaîtront ici.');
  }
  else if (tab === 'commandes') {
    const list = await MDZ.getOrders();
    content.innerHTML = list.length ? list.map(o=>`
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:16px 18px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:1rem;font-weight:700;color:#fff;">🛒 ${o.id}</div>
          <span style="font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:50px;background:rgba(46,168,79,.20);color:#6ee89a;">${o.statut||'En cours'}</span>
        </div>
        ${(o.articles||[]).map(a=>`
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <img src="${a.img||''}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;" onerror="this.style.display='none'">
            <div style="flex:1;"><div style="font-size:.86rem;font-weight:600;color:#fff;">${a.nom||''}</div><div style="font-size:.75rem;color:rgba(255,255,255,.45);">${a.taille||''} ${a.mode==='location'?'📅 Location':'🛒 Achat'} · Qté ${a.qte||1}</div></div>
            <div style="font-size:.88rem;font-weight:700;color:#3b8bfa;">${a.prix||''}</div>
          </div>`).join('')}
        <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);font-size:.88rem;">
          <span style="color:rgba(255,255,255,.40);">${new Date(o.date).toLocaleDateString('fr-FR')}</span>
          <span style="font-weight:800;color:#fff;">Total : ${o.total}</span>
        </div>
      </div>`).join('') : _dashEmpty('🛒','Aucune commande','Vos achats apparaîtront ici.');
  }
  else if (tab === 'favoris') {
    const list = await MDZ.getFavourites();
    content.innerHTML = list.length
      ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">${list.map(f=>`
          <div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden;cursor:pointer;" onclick="window.location.href='${(f.item_type||f.type)==='activite'?'index.html':'boutique.html'}'">
            <div style="height:100px;background:url('${f.img||f.img}') center/cover no-repeat;"></div>
            <div style="padding:10px 12px;"><div style="font-size:.86rem;font-weight:700;color:#fff;margin-bottom:4px;">${f.nom||''}</div><div style="font-size:.72rem;color:rgba(255,255,255,.45);">${(f.item_type||f.type)==='activite'?'🏔️ Activité':'🛒 Article'}</div></div>
          </div>`).join('')}</div>`
      : _dashEmpty('❤️','Aucun favori','Ajoutez des favoris depuis les pages activités ou boutique.');
  }
}

function _dashEmpty(icon, title, msg) {
  return `<div style="text-align:center;padding:48px 20px;"><div style="font-size:3rem;margin-bottom:14px;">${icon}</div><div style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px;">${title}</div><div style="font-size:.88rem;color:rgba(255,255,255,.45);">${msg}</div></div>`;
}

// ══════════════════════════════════════════════════════════
//  WEATHER HELPERS
// ══════════════════════════════════════════════════════════
function _wmoIcon(code) {
  if(code===0)return'☀️';if(code<=2)return'🌤️';if(code<=3)return'☁️';
  if(code<=48)return'🌫️';if(code<=57)return'🌧️';if(code<=67)return'🌧️';
  if(code<=77)return'❄️';if(code<=82)return'🌦️';if(code<=86)return'🌨️';return'⛈️';
}
function _wmoLabel(code) {
  if(code===0)return'Ciel dégagé';if(code<=2)return'Partiellement nuageux';
  if(code<=3)return'Couvert';if(code<=48)return'Brouillard';if(code<=55)return'Bruine';
  if(code<=65)return'Pluie';if(code<=77)return'Neige';if(code<=82)return'Averses';
  if(code<=86)return'Averses de neige';return'Orage';
}
function _pseudoRandom(seed,min,max){let h=0;for(let i=0;i<seed.length;i++)h=(Math.imul(31,h)+seed.charCodeAt(i))|0;return min+Math.abs(h)%(max-min+1);}

function ensureMobileHeaderStyles() {
  if (document.getElementById('mdzMobileHeaderStyles')) return;
  const style = document.createElement('style');
  style.id = 'mdzMobileHeaderStyles';
  style.textContent = `
@media (max-width: 900px) {
  .site-header .mobile-menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08);
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
  }
  .site-header .mobile-menu-btn svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
  }
  .site-header .header-inner {
    position: relative;
  }
  .site-header .nav-main {
    position: absolute;
    left: 12px;
    right: 12px;
    top: calc(100% + 8px);
    transform: translateY(-8px) scale(0.98);
    transform-origin: top center;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 8px;
    border-radius: 14px;
    background: linear-gradient(160deg, rgba(13,28,55,0.97) 0%, rgba(8,18,36,0.99) 100%);
    border: 1px solid rgba(255,255,255,0.14);
    box-shadow: 0 16px 40px rgba(0,0,0,0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
    z-index: 1200;
  }
  .site-header.mobile-nav-open .nav-main {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }
  .site-header .nav-main a {
    font-size: 0.95rem !important;
    padding: 10px 12px !important;
    border-radius: 9px;
  }
  .site-header .nav-main a::after {
    display: none;
  }
  .site-header .nav-main a:hover,
  .site-header .nav-main a.active {
    background: rgba(59,139,250,0.18);
  }
  .site-header .nav-right .btn-reserve {
    display: none !important;
  }
}
@media (min-width: 901px) {
  .site-header .mobile-menu-btn {
    display: none !important;
  }
}
`;
  document.head.appendChild(style);
}

function initMobileHeaderMenu() {
  const header = document.querySelector('.site-header');
  const inner = header?.querySelector('.header-inner');
  const nav = inner?.querySelector('.nav-main');
  if (!header || !inner || !nav) return;
  if (inner.querySelector('.mobile-menu-btn')) return;

  ensureMobileHeaderStyles();

  const button = document.createElement('button');
  button.className = 'mobile-menu-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Ouvrir le menu');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
      <line x1="4" y1="7" x2="20" y2="7"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="17" x2="20" y2="17"></line>
    </svg>
  `;

  const navRight = inner.querySelector('.nav-right');
  if (navRight) inner.insertBefore(button, navRight);
  else inner.appendChild(button);

  const closeMenu = () => header.classList.remove('mobile-nav-open');

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    header.classList.toggle('mobile-nav-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initMobileHeaderMenu();
  updateNavForAuth();

  // Wire dashboard links in dropdown
  document.querySelectorAll('.dropdown-link').forEach(link => {
    const text = link.textContent.trim();
    if (text.includes('réservation')) {
      link.href = '#';
      link.onclick = e => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('reservations'); };
    }
    if (text.includes('commande')) {
      link.href = '#';
      link.onclick = e => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('commandes'); };
    }
    if (text.includes('favori')) {
      link.href = '#';
      link.onclick = e => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('favoris'); };
    }
  });
});

// CSS keyframes
if (!document.getElementById('mdzAuthStyles')) {
  const s = document.createElement('style');
  s.id = 'mdzAuthStyles';
  s.textContent = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(s);
}