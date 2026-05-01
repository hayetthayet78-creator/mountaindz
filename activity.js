'use strict';

/* ══════════════════════════════════════
   ACTIVITY.JS — MountainDZ (FINAL)
══════════════════════════════════════ */

const activities = {
  ski: {
    name: "Ski alpin", icon: "⛷️", season: "Hiver ❄️",
    price: "2 500 DA / jour", priceNum: 2500,
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    desc: "Dévalez les pistes enneigées des montagnes algériennes avec des équipements modernes et des moniteurs certifiés.",
    disponibilite: { statut: "disponible", placesRestantes: 12, prochaineCreneau: "Demain, 08h30", duree: "Journée complète (8h)", niveaux: ["Débutant", "Intermédiaire", "Avancé"] },
    locations: [
      { name: "Chéria",      region: "Blida",  altitude: "1 200 m", tag: "Station principale", pin: "📍" },
      { name: "Tikejda",     region: "Bouira", altitude: "1 478 m", tag: "Recommandé",          pin: "📍" },
      { name: "Tala Guilef", region: "Bouira", altitude: "1 600 m", tag: "Accessible",           pin: "📍" },
    ],
    meteo: [
      { loc: "Chéria",      icon: "🌨️", condition: "Neige légère", temp: "-2°C", vent: "15 km/h", humidite: "78%" },
      { loc: "Tikejda",     icon: "❄️",  condition: "Enneigé",      temp: "-5°C", vent: "22 km/h", humidite: "85%" },
      { loc: "Tala Guilef", icon: "🌤️", condition: "Nuageux",       temp: "-1°C", vent: "10 km/h", humidite: "70%" },
    ],
    includes: ["Location de skis et chaussures","Moniteur certifié inclus (1ère heure)","Accès aux remontées mécaniques","Casque de protection fourni","Assurance activité incluse"]
  },
  randonnee: {
    name: "Randonnée en montagne", icon: "🏔️", season: "Été ☀️",
    price: "1 500 DA / journée", priceNum: 1500,
    img: "images/randonnée.jpg",
    desc: "Parcourez des sentiers balisés à travers les massifs algériens avec des guides locaux expérimentés.",
    disponibilite: { statut: "disponible", placesRestantes: 12, prochaineCreneau: "Samedi, 7h00", duree: "4h à 6h", niveaux: ["Tous niveaux", "Débutants acceptés"] },
    locations: [
      { name: "Babor",     region: "Jijel / Sétif", altitude: "2 004 m", tag: "Sommet iconic",   pin: "📍" },
      { name: "Chélia",    region: "Khenchela",      altitude: "2 328 m", tag: "Point culminant", pin: "📍" },
      { name: "Djurdjura", region: "Tizi Ouzou",     altitude: "2 308 m", tag: "Populaire",       pin: "📍" },
    ],
    meteo: [
      { loc: "Babor",     icon: "⛅", condition: "Partiellement nuageux", temp: "14°C", vent: "12 km/h", humidite: "62%" },
      { loc: "Chélia",    icon: "☀️", condition: "Ensoleillé",            temp: "11°C", vent: "18 km/h", humidite: "48%" },
      { loc: "Djurdjura", icon: "🌤️",condition: "Beau temps",            temp: "16°C", vent: "9 km/h",  humidite: "55%" },
    ],
    includes: ["Guide local certifié","Carte topographique du sentier","Ravitaillement en eau potable","Kit premiers secours","Transport aller-retour inclus"]
  },
  parapente: {
    name: "Parapente", icon: "🪂", season: "Été ☀️",
    price: "4 500 DA / vol", priceNum: 4500,
    img: "https://i.pinimg.com/736x/cf/5d/e3/cf5de35a2153ce40b47de40f1fcc77a6.jpg",
    desc: "Survolez les vallées et massifs algériens depuis les hauteurs dans un vol biplace avec un instructeur certifié.",
    disponibilite: { statut: "limite", placesRestantes: 2, prochaineCreneau: "Demain, 6h00", duree: "15min à 30min (vol)", niveaux: ["Tous niveaux", "Débutants acceptés"] },
    locations: [
      { name: "Babor", region: "Jijel / Sétif", altitude: "2 004 m", tag: "Site idéal",      pin: "📍" },
      { name: "Chréa", region: "Blida",          altitude: "1 486 m", tag: "Vue panoramique", pin: "📍" },
    ],
    meteo: [
      { loc: "Babor", icon: "☀️", condition: "Idéal pour voler", temp: "17°C", vent: "14 km/h", humidite: "50%" },
      { loc: "Chréa", icon: "🌤️",condition: "Vent favorable",   temp: "20°C", vent: "16 km/h", humidite: "45%" },
    ],
    includes: ["Vol biplace avec instructeur certifié","Équipement complet (harnais, casque)","Briefing sécurité avant le vol","Photos et vidéo du vol incluses","Assurance vol incluse"]
  },
  Snowboard: {
    name: "Snowboard", icon: "🏂", season: "Hiver ❄️",
    price: "2 200 DA / jour", priceNum: 2200,
    img: "https://i.pinimg.com/736x/f5/cf/df/f5cfdf6600baa49331da70f9154adc9f.jpg",
    desc: "Dévalez les pistes enneigées des montagnes algériennes avec des équipements modernes et des moniteurs certifiés.",
    disponibilite: { statut: "disponible", placesRestantes: 0, prochaineCreneau: "Demain, 08h30", duree: "2h à 3h", niveaux: ["Débutant", "Intermédiaire", "Avancé"] },
    locations: [
      { name: "Chéria", region: "Blida",  altitude: "1 200 m", tag: "Station principale", pin: "📍" },
      { name: "Tikejda", region: "Bouira", altitude: "1 478 m", tag: "Recommandé",          pin: "📍" },
      { name: "Babor",  region: "Sétif",  altitude: "2 004 m", tag: "Accessible",           pin: "📍" },
    ],
    meteo: [
      { loc: "Chéria", icon: "🌨️", condition: "Neige légère", temp: "-1°C", vent: "15 km/h", humidite: "78%" },
      { loc: "Tikejda", icon: "❄️",  condition: "Enneigé",      temp: "-5°C", vent: "22 km/h", humidite: "85%" },
      { loc: "Babor",  icon: "🌤️", condition: "Nuageux",       temp: "-1°C", vent: "10 km/h", humidite: "70%" },
    ],
    includes: ["Location de snowboard et chaussures","Moniteur certifié inclus (1ère heure)","Accès aux remontées mécaniques","Casque de protection fourni","Assurance activité incluse"]
  },
  Snow: {
    name: "Snow tubing", icon: "🛷", season: "Hiver ❄️",
    price: "800 DA / heure", priceNum: 800,
    img: "https://i.pinimg.com/avif/1200x/c1/db/a2/c1dba296c02a038d42d86aac4aee54ad.avf",
    desc: "Une activité amusante pour toute la famille – glissez sur des bouées géantes en toute sécurité.",
    disponibilite: { statut: "disponible", placesRestantes: 15, prochaineCreneau: "Tous les jours", duree: "1h à 2h", niveaux: ["Tous niveaux"] },
    locations: [
      { name: "Tikejda", region: "Bouira", altitude: "1 478 m", tag: "Station principale", pin: "📍" },
      { name: "Chéria", region: "Blida",  altitude: "1 200 m", tag: "Recommandé",          pin: "📍" },
      { name: "Babor",  region: "Sétif",  altitude: "2 004 m", tag: "Accessible",           pin: "📍" },
    ],
    meteo: [
      { loc: "Tikejda", icon: "❄️",  condition: "Enneigé",      temp: "-5°C", vent: "22 km/h", humidite: "85%" },
      { loc: "Chéria", icon: "🌨️", condition: "Neige légère", temp: "-1°C", vent: "15 km/h", humidite: "78%" },
      { loc: "Babor",  icon: "🌤️", condition: "Nuageux",       temp: "-1°C", vent: "10 km/h", humidite: "70%" },
    ],
    includes: ["Location de bouée géante","Moniteur de sécurité sur place","Accès illimité à la piste","Casque de protection fourni","Assurance activité incluse"]
  },
  raquettes: {
    name: "Randonnée en raquettes", icon: "🥾", season: "Hiver ❄️",
    price: "1 200 DA / journée", priceNum: 1200,
    img: "https://www.cherifaistesvalises.com/wp-content/uploads/2022/12/shutterstock_2155591235.jpg",
    desc: "Explorez les forêts et sommets enneigés à votre rythme, en pleine nature silencieuse.",
    disponibilite: { statut: "disponible", placesRestantes: 8, prochaineCreneau: "Ce weekend", duree: "3h", niveaux: ["Débutants", "Intermédiaire"] },
    locations: [
      { name: "Chéria", region: "Blida",  altitude: "1 200 m", tag: "Station principale", pin: "📍" },
      { name: "Tikejda", region: "Bouira", altitude: "1 478 m", tag: "Recommandé",          pin: "📍" },
      { name: "Babor",  region: "Sétif",  altitude: "2 004 m", tag: "Accessible",           pin: "📍" },
    ],
    meteo: [
      { loc: "Chéria", icon: "🌨️", condition: "Neige légère", temp: "1°C",  vent: "15 km/h", humidite: "78%" },
      { loc: "Tikejda", icon: "❄️",  condition: "Enneigé",      temp: "-2°C", vent: "22 km/h", humidite: "85%" },
      { loc: "Babor",  icon: "🌤️", condition: "Nuageux",       temp: "-2°C", vent: "10 km/h", humidite: "70%" },
    ],
    includes: ["Location de raquettes et bâtons","Guide local certifié","Carte du sentier incluse","Kit premiers secours","Assurance activité incluse"]
  },
  Camping: {
    name: "Camping en nature", icon: "⛺", season: "Été ☀️",
    price: "900 DA / nuit", priceNum: 900,
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    desc: "Passez la nuit sous les étoiles dans des espaces aménagés en plein cœur de la montagne.",
    disponibilite: { statut: "limite", placesRestantes: 3, prochaineCreneau: "Ce weekend", duree: "1 nuit minimum", niveaux: ["Tous niveaux"] },
    locations: [
      { name: "Babor", region: "Jijel / Sétif", altitude: "2 004 m", tag: "Site naturel",    pin: "📍" },
      { name: "Chréa", region: "Blida",          altitude: "1 486 m", tag: "Vue panoramique", pin: "📍" },
    ],
    meteo: [
      { loc: "Babor", icon: "☀️", condition: "Idéal pour camper", temp: "17°C", vent: "14 km/h", humidite: "50%" },
      { loc: "Chréa", icon: "🌤️",condition: "Nuit fraîche",      temp: "15°C", vent: "10 km/h", humidite: "55%" },
    ],
    includes: ["Tente et équipement de camping","Sac de couchage fourni","Kit repas du soir inclus","Gardien du camp sur place","Assurance séjour incluse"]
  },
  VTT: {
    name: "VTT (vélo tout terrain)", icon: "🚵", season: "Été ☀️",
    price: "1 800 DA / journée", priceNum: 1800,
    img: "https://i.pinimg.com/736x/7f/66/bb/7f66bbf6d294272cc60259aa281ec1dd.jpg",
    desc: "Des pistes balisées pour tous les niveaux, avec location de vélos et casques inclus.",
    disponibilite: { statut: "limite", placesRestantes: 5, prochaineCreneau: "Demain, 8h00", duree: "2h à 4h", niveaux: ["Intermédiaire", "Confirmé"] },
    locations: [
      { name: "Babor", region: "Jijel / Sétif", altitude: "2 004 m", tag: "Site idéal",      pin: "📍" },
      { name: "Chréa", region: "Blida",          altitude: "1 486 m", tag: "Vue panoramique", pin: "📍" },
    ],
    meteo: [
      { loc: "Babor", icon: "☀️", condition: "Idéal pour rouler", temp: "17°C", vent: "14 km/h", humidite: "50%" },
      { loc: "Chréa", icon: "🌤️",condition: "Vent favorable",    temp: "20°C", vent: "16 km/h", humidite: "45%" },
    ],
    includes: ["Location VTT et casque","Carte des pistes balisées","Kit réparation vélo","Guide accompagnateur","Assurance activité incluse"]
  },
  Escalade: {
    name: "Escalade", icon: "🧗", season: "Printemps 🌸",
    price: "2 000 DA / session", priceNum: 2000,
    img: "https://initiation-escalade.fr/wp-content/uploads/2025/08/escalade-grimpe-en-tete-saut-roland-1280x960.jpg",
    desc: "Affrontez les falaises naturelles des massifs algériens sous la supervision de moniteurs diplômés d'État.",
    disponibilite: { statut: "disponible", placesRestantes: 10, prochaineCreneau: "Demain, 07h00", duree: "Demi-journée (4h) ou journée (8h)", niveaux: ["Débutant", "Intermédiaire", "Avancé"] },
    locations: [
      { name: "Babor",     region: "Jijel / Sétif", altitude: "2 004 m", tag: "Falaises naturelles", pin: "📍" },
      { name: "Chéria",    region: "Blida",          altitude: "1 200 m", tag: "Site rocher",         pin: "📍" },
      { name: "Djurdjura", region: "Tizi Ouzou",     altitude: "2 308 m", tag: "Voies classiques",    pin: "📍" },
    ],
    meteo: [
      { loc: "Babor",     icon: "🌤️", condition: "Beau temps frais",  temp: "13°C", vent: "10 km/h", humidite: "55%" },
      { loc: "Chéria",    icon: "☀️",  condition: "Ensoleillé",         temp: "18°C", vent: "8 km/h",  humidite: "42%" },
      { loc: "Djurdjura", icon: "⛅",  condition: "Légèrement nuageux", temp: "12°C", vent: "14 km/h", humidite: "60%" },
    ],
    includes: ["Matériel complet (corde, baudrier, chaussons)","Moniteur diplômé d'État","Initiation aux techniques de sécurité","Casque et magnésie fournis","Assurance escalade incluse"]
  },
  Cheval: {
    name: "Balade à cheval", icon: "🐴", season: "Printemps 🌸",
    price: "2 800 DA / 2h", priceNum: 2800,
    img: "https://i.pinimg.com/1200x/1a/02/4a/1a024a6142f81cf96b1fb03b6cfee5e4.jpg",
    desc: "Traversez des prairies fleuries, des forêts de cèdres et des sentiers montagneux à dos de cheval.",
    disponibilite: { statut: "limite", placesRestantes: 4, prochaineCreneau: "Aujourd'hui, 15h00", duree: "2h ou 4h selon la formule", niveaux: ["Tous niveaux", "Débutants acceptés"] },
    locations: [
      { name: "Babor",  region: "Jijel / Sétif", altitude: "2 004 m", tag: "Prairie idéale", pin: "📍" },
      { name: "Tikejda", region: "Bouira", altitude: "1 478 m", tag: "Forêt de cèdres",  pin: "📍" },
      { name: "Chréa",  region: "Blida",  altitude: "1 486 m", tag: "Sentiers boisés",  pin: "📍" },
    ],
    meteo: [
      { loc: "Babor",  icon: "☀️",  condition: "Ensoleillé, idéal",  temp: "19°C", vent: "7 km/h",  humidite: "40%" },
      { loc: "Tikejda", icon: "🌤️", condition: "Frais et agréable",   temp: "14°C", vent: "9 km/h",  humidite: "52%" },
      { loc: "Chréa",  icon: "⛅",  condition: "Légèrement nuageux", temp: "17°C", vent: "11 km/h", humidite: "48%" },
    ],
    includes: ["Cheval et équipement d'équitation fournis","Moniteur cavalier accompagnateur","Casque et gilet de protection","Initiation aux bases de l'équitation","Assurance activité incluse"]
  }
};

// ── Helper disponibilité ──────────────────────────────────
function getStatutInfo(statut, places) {
  if (statut === "disponible") return { label: "Disponible", color: "#2ea84f", bg: "rgba(46,168,79,0.12)", icon: "✅" };
  if (statut === "limite")     return { label: `Plus que ${places} place${places > 1 ? 's' : ''} !`, color: "#e07d10", bg: "rgba(224,125,16,0.12)", icon: "⚠️" };
  return { label: "Complet", color: "#c0392b", bg: "rgba(192,57,43,0.12)", icon: "❌" };
}

// ══════════════════════════════════════════════
//  PANNEAU DÉTAIL
// ══════════════════════════════════════════════
let _currentActivity = null;

function openDetail(id) {
  const a = activities[id];
  if (!a) return;
  _currentActivity = a;

  document.getElementById('detailImg').src               = a.img;
  document.getElementById('detailImg').alt               = a.name;
  document.getElementById('detailSeason').textContent    = a.season;
  document.getElementById('detailName').textContent      = a.name;
  document.getElementById('detailPriceHero').textContent = a.price;
  document.getElementById('detailDesc').textContent      = a.desc;
  document.getElementById('detailPanel').scrollTop       = 0;

  const dispo = a.disponibilite;
  const info  = getStatutInfo(dispo.statut, dispo.placesRestantes);

  document.getElementById('dispoBlock').innerHTML = `
    <div class="dispo-row">
      <span class="dispo-badge" style="color:${info.color};background:${info.bg};">${info.icon} ${info.label}</span>
      <span class="dispo-places">🗓️ Prochain créneau : <strong>${dispo.prochaineCreneau}</strong></span>
    </div>
    <div class="dispo-row dispo-row--small">
      <span>⏱️ Durée : <strong>${dispo.duree}</strong></span>
      <span>🎯 Niveaux : <strong>${dispo.niveaux.join(', ')}</strong></span>
    </div>`;

  document.getElementById('locationsGrid').innerHTML = a.locations.map(l => `
    <div class="location-card">
      <div class="location-pin">${l.pin}</div>
      <div class="location-name">${l.name}</div>
      <div class="location-region">${l.region}</div>
      <div class="location-altitude">⛰️ Altitude : ${l.altitude}</div>
      <span class="location-tag">${l.tag}</span>
    </div>`).join('');

  document.getElementById('meteoCards').innerHTML = a.meteo.map(m => `
    <div class="meteo-card">
      <div class="meteo-left">
        <div class="meteo-icon-wrap">${m.icon}</div>
        <div>
          <div class="meteo-loc-name">${m.loc}</div>
          <div class="meteo-condition">${m.condition}</div>
        </div>
      </div>
      <div class="meteo-right">
        <div class="meteo-temp">${m.temp}</div>
        <div class="meteo-details">
          <span>💨 ${m.vent}</span>
          <span>💧 ${m.humidite}</span>
        </div>
      </div>
    </div>`).join('');

  document.getElementById('includesList').innerHTML = a.includes.map(i => `<li>${i}</li>`).join('');

  const btn = document.getElementById('btnReserver');
  const baseStyle = `font-family:'Segoe UI',Arial,sans-serif;font-size:1rem;font-weight:700;color:#fff;
    border:none;outline:none;padding:16px 24px;border-radius:14px;width:100%;display:block;
    text-align:center;margin-top:8px;cursor:pointer;transition:background 0.25s,transform 0.2s;`;

  if (dispo.statut === 'complet') {
    btn.setAttribute('style', baseStyle + 'background:#95a5a6;cursor:not-allowed;');
    btn.textContent  = "❌ Complet – Liste d'attente";
    btn.onmouseover  = null;
    btn.onmouseout   = null;
    btn.onclick      = null;
  } else {
    btn.setAttribute('style', baseStyle + 'background:#3b8bfa;box-shadow:0 4px 24px rgba(59,139,250,0.40);');
    btn.textContent  = 'Réserver cette activité →';
    btn.onmouseover  = function() { this.style.background = '#2a75e8'; this.style.transform = 'translateY(-2px)'; };
    btn.onmouseout   = function() { this.style.background = '#3b8bfa'; this.style.transform = 'translateY(0)'; };
    btn.onclick      = function() { openReservation(a); };
  }

  // Load real weather async
  _loadRealWeather(id, a);

  document.getElementById('overlay').classList.add('open');
  document.getElementById('detailPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function _loadRealWeather(id, a) {
  const meteoContainer = document.getElementById('meteoCards');
  if (!meteoContainer) return;

  const results = await Promise.allSettled(
    a.locations.map(loc => {
      const coords = MDZ.stationCoords[loc.name];
      return coords ? MDZ.getWeather(coords.lat, coords.lon, loc.name) : Promise.resolve(null);
    })
  );

  meteoContainer.innerHTML = a.locations.map((loc, i) => {
    const w = results[i].status === 'fulfilled' ? results[i].value : null;
    if (!w) {
      const m = a.meteo[i] || {};
      return _meteoCardHTML(loc.name, m.icon||'🌤️', m.condition||'N/A', m.temp||'N/A', m.vent||'N/A', m.humidite||'N/A', false);
    }
    return _meteoCardHTML(loc.name, w.icon, w.condition, w.temp, w.wind, w.humidity, true);
  }).join('');

  _updateAvailabilityBlock(id, a);
}

function _meteoCardHTML(name, icon, condition, temp, wind, humidity, isReal) {
  return `
    <div class="meteo-card">
      <div class="meteo-left">
        <div class="meteo-icon-wrap">${icon}</div>
        <div>
          <div class="meteo-loc-name">${name}</div>
          <div class="meteo-condition">${condition}${isReal ? ' <span style="font-size:.65rem;opacity:.5;">🔴 live</span>' : ''}</div>
        </div>
      </div>
      <div class="meteo-right">
        <div class="meteo-temp">${temp}</div>
        <div class="meteo-details">
          <span>💨 ${wind}</span>
          <span>💧 ${humidity}</span>
        </div>
      </div>
    </div>`;
}

async function _updateAvailabilityBlock(activityKey, activity) {
  const dispoBlock = document.getElementById('dispoBlock');
  if (!dispoBlock || !activity.locations[0]) return;

  const avail       = await MDZ.getAvailability(activityKey, activity.locations[0].name);
  const staticDispo = activity.disponibilite;
  const statut      = avail.statut === 'indispo' ? 'complet' : avail.statut;
  const places      = avail.placesRestantes;

  const infoMap = {
    disponible: { label: 'Disponible',                              color: '#2ea84f', bg: 'rgba(46,168,79,.12)',   icon: '✅' },
    limite:     { label: `Plus que ${places} place${places>1?'s':''}!`, color: '#e07d10', bg: 'rgba(224,125,16,.12)', icon: '⚠️' },
    complet:    { label: 'Complet',                                 color: '#c0392b', bg: 'rgba(192,57,43,.12)',   icon: '❌' }
  };
  const info = infoMap[statut] || infoMap.disponible;

  const btn = document.getElementById('btnReserver');
  if (btn && (statut === 'complet' || avail.statut === 'indispo')) {
    btn.style.background = '#95a5a6';
    btn.style.cursor     = 'not-allowed';
    btn.textContent      = avail.note || "❌ Complet – Liste d'attente";
    btn.onclick          = null;
  }

  dispoBlock.innerHTML = `
    <div class="dispo-row">
      <span class="dispo-badge" style="color:${info.color};background:${info.bg};">${info.icon} ${info.label}</span>
      <span class="dispo-places">🗓️ Prochain créneau : <strong>${staticDispo.prochaineCreneau}</strong></span>
    </div>
    <div class="dispo-row dispo-row--small">
      <span>⏱️ Durée : <strong>${staticDispo.duree}</strong></span>
      <span>🎯 Niveaux : <strong>${staticDispo.niveaux.join(', ')}</strong></span>
    </div>
    ${avail.note ? `<div class="dispo-row" style="color:#ffd166;font-size:.82rem;">⚠️ ${avail.note}</div>` : ''}
    <div style="font-size:.70rem;color:rgba(255,255,255,.30);margin-top:2px;">🔴 Disponibilité et météo en temps réel</div>`;
}

function closeDetail() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('detailPanel').classList.remove('open');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════
//  MODAL RÉSERVATION
// ══════════════════════════════════════════════
let _resGuests = 1;

function openReservation(activity) {
  // AUTH GUARD — redirect to signin if not logged in
  if (!requireAuth('réserver cette activité')) return;

  _currentActivity = activity;
  _resGuests = 1;

  document.getElementById('resIcon').textContent  = activity.icon || '🏔️';
  document.getElementById('resTitle').textContent = activity.name;
  document.getElementById('resSub').textContent   = activity.price + ' · ' + activity.season;

  const dispo = activity.disponibilite;
  const info  = getStatutInfo(dispo.statut, dispo.placesRestantes);
  const bar   = document.getElementById('resDispo');
  bar.style.background = info.bg;
  bar.style.color      = info.color;
  bar.innerHTML = `${info.icon} <strong>${info.label}</strong> &nbsp;·&nbsp; ⏱️ ${dispo.duree} &nbsp;·&nbsp; 🗓️ Prochain créneau : <strong>${dispo.prochaineCreneau}</strong>`;

  document.getElementById('resMeteoStrip').innerHTML = activity.meteo.map((m, i) => `
    <div class="res-meteo-chip ${i === 0 ? 'active' : ''}" onclick="selectMeteoChip(this,'${m.loc}')">
      <div class="res-meteo-chip-icon">${m.icon}</div>
      <div class="res-meteo-chip-info">
        <div class="res-meteo-chip-loc">${m.loc}</div>
        <div class="res-meteo-chip-temp">${m.temp} · ${m.vent}</div>
        <div class="res-meteo-chip-cond">${m.condition}</div>
      </div>
    </div>`).join('');

  document.getElementById('resLoc').innerHTML =
    '<option value="">Choisir une localisation</option>' +
    activity.locations.map(l => `<option value="${l.name}">${l.name} — ${l.region} (${l.altitude})</option>`).join('');

  document.getElementById('resCount').textContent = '1';
  ['resNom','resTel','resEmail','resMsg'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('resNiveau').value = '';
  document.getElementById('resLoc').value    = '';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('resDate').min   = today;
  document.getElementById('resDate').value = '';

  // Auto-fill name from logged-in user
  const user = MDZ.getUser();
  if (user && user.prenom) {
    document.getElementById('resNom').value = (user.prenom + ' ' + (user.nom || '')).trim();
  }

  const sub = document.getElementById('resSubmit');
  if (dispo.statut === 'complet') {
    sub.disabled    = true;
    sub.textContent = '❌ Activité complète';
  } else {
    sub.disabled    = false;
    sub.textContent = '✅ Confirmer la réservation';
  }

  updateResPrice();

  // Load real weather for chips
  _loadWeatherChips(activity);

  document.getElementById('resModal').querySelector('.res-modal-body').scrollTop = 0;
  document.getElementById('resOverlay').classList.add('open');
  document.getElementById('resModal').classList.add('open');
}

async function _loadWeatherChips(activity) {
  const chips = document.querySelectorAll('.res-meteo-chip');
  activity.locations.forEach(async (loc, i) => {
    const coords = MDZ.stationCoords[loc.name];
    if (!coords || !chips[i]) return;
    const w = await MDZ.getWeather(coords.lat, coords.lon, loc.name);
    if (!w) return;
    const chip = chips[i];
    const iconEl = chip.querySelector('.res-meteo-chip-icon');
    const tempEl = chip.querySelector('.res-meteo-chip-temp');
    const condEl = chip.querySelector('.res-meteo-chip-cond');
    if (iconEl) iconEl.textContent = w.icon;
    if (tempEl) tempEl.textContent = w.temp + ' · ' + w.wind;
    if (condEl) condEl.textContent = w.condition;
  });
}

function closeReservation() {
  document.getElementById('resOverlay').classList.remove('open');
  document.getElementById('resModal').classList.remove('open');
}

function selectMeteoChip(el, locName) {
  document.querySelectorAll('.res-meteo-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const sel = document.getElementById('resLoc');
  for (const opt of sel.options) { if (opt.value === locName) { sel.value = locName; break; } }
  updateResPrice();
}

function updateMeteoForLoc() {
  const chosen = document.getElementById('resLoc').value;
  document.querySelectorAll('.res-meteo-chip').forEach(chip => {
    chip.classList.toggle('active', chip.querySelector('.res-meteo-chip-loc').textContent === chosen);
  });
  updateResPrice();
}

function updateResPrice() {
  if (!_currentActivity) return;
  const total = _currentActivity.priceNum * _resGuests;
  document.getElementById('rpActivity').textContent     = _currentActivity.price;
  document.getElementById('rpParticipants').textContent = `${_resGuests} × ${_currentActivity.priceNum.toLocaleString('fr-DZ')} DA`;
  document.getElementById('rpTotal').textContent        = `${total.toLocaleString('fr-DZ')} DA`;
}

document.getElementById('resInc').addEventListener('click', () => {
  if (_resGuests < 20) _resGuests++;
  document.getElementById('resCount').textContent = _resGuests;
  updateResPrice();
});
document.getElementById('resDec').addEventListener('click', () => {
  if (_resGuests > 1) _resGuests--;
  document.getElementById('resCount').textContent = _resGuests;
  updateResPrice();
});

async function submitReservation(e) {
  e.preventDefault();
  if (!requireAuth('confirmer cette réservation')) return;

  const name = document.getElementById('resNom')?.value.trim();
  const tel  = document.getElementById('resTel')?.value.trim();
  const date = document.getElementById('resDate')?.value;
  const loc  = document.getElementById('resLoc')?.value;

  if (!name || !tel || !date) {
    showToast('⚠️', 'Champs manquants', 'Veuillez remplir le nom, téléphone et la date.');
    return;
  }

  if (_currentActivity) {
    await MDZ.addReservation({
      titre          : _currentActivity.name,
      icon           : _currentActivity.icon || '🏔️',
      dateReservation: date,
      lieu           : loc || (_currentActivity.locations[0] ? _currentActivity.locations[0].name : ''),
      personnes      : parseInt(document.getElementById('resCount')?.textContent) || 1,
      prix           : document.getElementById('rpTotal')?.textContent || _currentActivity.price,
      statut         : 'confirmé',
      type           : 'activite'
    });
  }

  closeReservation();
  closeDetail();
  document.body.style.overflow = '';

  const toast = document.getElementById('resToast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  setTimeout(() => openAccountDashboard('reservations'), 1500);
}

// ── ESC key ──
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('resModal').classList.contains('open')) closeReservation();
  else closeDetail();
});

// ══════════════════════════════════════════════
//  ACCOUNT DROPDOWN
// ══════════════════════════════════════════════
function toggleAccountDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('accountDropdown');
  const btn      = document.getElementById('accountWrap').querySelector('.btn-account');
  const isOpen   = dropdown.classList.contains('open');
  if (isOpen) {
    closeAccountDropdown();
  } else {
    btn.classList.add('open');
    dropdown.classList.add('open');
  }
}

function closeAccountDropdown() {
  document.getElementById('accountWrap')?.querySelector('.btn-account')?.classList.remove('open');
  document.getElementById('accountDropdown')?.classList.remove('open');
}

document.addEventListener('click', e => {
  const wrap = document.getElementById('accountWrap');
  if (wrap && !wrap.contains(e.target)) closeAccountDropdown();
});

// ══════════════════════════════════════════════
//  FAVOURITE BUTTONS
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  _addActivityFavButtons();
  const section = document.getElementById('activites');
  if (section) new MutationObserver(_addActivityFavButtons).observe(section, { childList: true, subtree: true });
});

function _addActivityFavButtons() {
  document.querySelectorAll('.activity-card').forEach(card => {
    if (card.querySelector('.fav-btn-act')) return;
    const imgWrap = card.querySelector('.card-img');
    if (!imgWrap) return;
    const match  = (card.getAttribute('onclick') || '').match(/openDetail\(['"](\w+)['"]\)/);
    if (!match) return;
    const actKey = match[1];
    const act    = activities[actKey];
    if (!act) return;

    const isFav = MDZ.isFavourite(actKey, 'activite');
    const btn   = document.createElement('button');
    btn.className   = 'fav-btn-act';
    btn.innerHTML   = isFav ? '❤️' : '🤍';
    btn.style.cssText = `position:absolute;top:10px;right:10px;
      background:rgba(8,18,36,.70);backdrop-filter:blur(6px);
      border:1px solid rgba(255,255,255,.18);border-radius:50%;
      width:32px;height:32px;display:grid;place-items:center;
      cursor:pointer;font-size:.95rem;z-index:5;transition:transform .2s;`;

    btn.onclick = async function(e) {
      e.stopPropagation();
      if (!requireAuth('ajouter aux favoris')) return;
      const added = await MDZ.toggleFavourite({ id: actKey, type: 'activite', nom: act.name, img: act.img });
      this.innerHTML        = added ? '❤️' : '🤍';
      this.style.transform  = 'scale(1.3)';
      setTimeout(() => this.style.transform = 'scale(1)', 200);
    };
    imgWrap.style.position = 'relative';
    imgWrap.appendChild(btn);
  });
}

// ── showToast helper (if not defined elsewhere) ──
function showToast(icon, title, msg) {
  const toast = document.getElementById('resToast');
  if (!toast) return;
  const s = toast.querySelector('strong');
  const p = toast.querySelector('p');
  const i = toast.querySelector('span');
  if (i) i.textContent = icon;
  if (s) s.textContent = title;
  if (p) p.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}