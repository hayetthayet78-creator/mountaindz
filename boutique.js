/* ══════════════════════════════════════
   BOUTIQUE.JS — Version Finale
   ✅ Gender dropdown window (far right, inline with search)
   ✅ Filtres : saison, genre, catégorie, recherche, tri
   ✅ Cartes enrichies : rating, genre, tailles, prix achat/location
   ✅ Boutons Acheter / Louer / Réserver à l'avance sur chaque carte
   ✅ Panneau détail complet
   ✅ Modal Réservation à l'avance
   ✅ Panier panneau latéral
   ✅ Packs activités
   ✅ Écoles & Formations
══════════════════════════════════════ */

/* ══════════════════════════════════════
   DATA — PRODUITS
══════════════════════════════════════ */
const products = [
  {
    id: 1, name: "Skis Rossignol Hero Elite", category: "ski", gender: "homme", promo: false,
    price: 38500, oldPrice: null, rating: 4.9, isNew: true,
    img: 'https://tse3.mm.bing.net/th/id/OIP.ofTNp0xHQ_NMha7COEMu8AHaHa',
    badge: "Nouveau",
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 1800, rentCaution: 10000,
    activities: [
      { key: "ski", icon: "⛷️", name: "Ski alpin", price: "2 500 DA / jour" }
    ],
    desc: "Ski polyvalent haute performance pour pistes tracées. Carbone renforcé, finition topsheet mat. Idéal pour les massifs algériens.",
    sizes: ["155cm","160cm","165cm","170cm"],
    colors: ["#e74c3c","#2c3e50","#f39c12"],
    colorNames: ["Rouge","Noir","Orange"],
    stock: 6,
    features: ["Carbone renforcé","Rocker avant","Noyau bois allégé","Compatible fixations standard","Spatule relevée","Finition mat premium"]
  },
  {
    id: 2, name: "Casque Ski Salomon Pioneer", category: "ski", gender: "all", promo: false,
    price: 12500, oldPrice: null, rating: 4.8, isNew: false,
    img: 'https://media.intersport.fr/is/image/intersportfr/0118002ENS_Q1',
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 600, rentCaution: 3000,
    activities: [
      { key: "ski", icon: "⛷️", name: "Ski alpin", price: "2 500 DA / jour" },
      { key: "Snowboard", icon: "🏂", name: "Snowboard", price: "2 200 DA / jour" }
    ],
    desc: "Casque de ski homologué CE. Ventilation réglable, doublure chaude, fermeture magnétique. Protection maximale sur les pistes.",
    sizes: ["S","M","L","XL"],
    colors: ["#2c3e50","#fff","#e74c3c","#3498db"],
    colorNames: ["Noir","Blanc","Rouge","Bleu"],
    stock: 12,
    features: ["Homologué CE EN1077","Ventilation active réglable","Doublure amovible lavable","Fermeture magnétique","Compatible masque","Poids 380g"]
  },
  {
    id: 3, name: "Chaussures Ski Atomic Hawx", category: "ski", gender: "femme", promo: false,
    price: 22000, oldPrice: null, rating: 4.7, isNew: false,
    img: 'https://contents.mediadecathlon.com/p2264122/k$0806b33c54541fc51c1f56f9d665f677/sq/chaussure-de-ski-900-gw-femme.jpg',
    badge: null,
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 900, rentCaution: 6000,
    activities: [
      { key: "ski", icon: "⛷️", name: "Ski alpin", price: "2 500 DA / jour" }
    ],
    desc: "Chaussures de ski femme, flex 90, liner anatomique chaud, boucles micro-réglables. Confort toute la journée.",
    sizes: ["36","37","38","39","40"],
    colors: ["#8e44ad","#2c3e50","#e74c3c"],
    colorNames: ["Violet","Noir","Rouge"],
    stock: 8,
    features: ["Flex 90 adapté femme","Liner anatomique chaud","Boucles micro-réglables","Semelle Grilamid","Largeur 98mm","Coque bimatière"]
  },
  {
    id: 4, name: "Combinaison Ski Enfant", category: "ski", gender: "enfant", promo: false,
    price: 16500, oldPrice: null, rating: 4.8, isNew: true,
    img: 'https://contents.mediadecathlon.com/s959511/k$b261b99635caefad45f9b9e6473067c6/1180x0/500pt500/987xcr1000/Bien-entretenir-et-reparer-votre-combinaison-de-ski-enfant.png',
    badge: "Nouveau",
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 700, rentCaution: 5000,
    activities: [
      { key: "ski", icon: "⛷️", name: "Ski alpin", price: "2 500 DA / jour" },
      { key: "Snow", icon: "🛷", name: "Snow tubing", price: "800 DA / heure" }
    ],
    desc: "Combinaison one-piece imperméable pour enfants. Chaud, respirant, avec bretelles ajustables. Parfaite pour une journée au ski.",
    sizes: ["4ans","6ans","8ans","10ans","12ans"],
    colors: ["#3498db","#e74c3c","#2ecc71"],
    colorNames: ["Bleu","Rouge","Vert"],
    stock: 10,
    features: ["Imperméable 10 000mm","Respirant 5 000g","Bretelles ajustables","Capuche amovible","Coutures soudées","Genoux renforcés"]
  },
  {
    id: 5, name: "Snowboard Burton Custom", category: "snowboard", gender: "homme", promo: false,
    price: 52000, oldPrice: null, rating: 5.0, isNew: false,
    img: 'https://www.tradeinn.com/f/14098/140980232/burton-custom-camber-snowboard.webp',
    badge: null,
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 2200, rentCaution: 15000,
    activities: [
      { key: "Snowboard", icon: "🏂", name: "Snowboard", price: "2 200 DA / jour" }
    ],
    desc: "Table all-mountain légendaire, camber classique, noyau Dragonfly pour réactivité maximale. Le choix des pros.",
    sizes: ["152cm","155cm","158cm","161cm"],
    colors: ["#e74c3c","#2c3e50","#f39c12"],
    colorNames: ["Rouge","Noir","Orange"],
    stock: 5,
    features: ["Noyau Dragonfly","Camber classique","Fibre de carbone","Renforts titanium","Base sintered","Sandwich biaxial"]
  },
  {
    id: 6, name: "Boots Snowboard Vans Infuse", category: "snowboard", gender: "femme", promo: false,
    price: 19500, oldPrice: null, rating: 4.6, isNew: true,
    img: 'https://images.evo.com/imgp/700/254005/1143007/capita-mercury-snowboard-union-force-snowboard-bindings-vans-infuse-snowboard-boots-2026-.jpg',
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 850, rentCaution: 6000,
    activities: [
      { key: "Snowboard", icon: "🏂", name: "Snowboard", price: "2 200 DA / jour" }
    ],
    desc: "Boots confortables avec zone de flex progressive, liner chaud, semelle Waffle antidérapante. Confort et contrôle parfaits.",
    sizes: ["36","37","38","39","40","41"],
    colors: ["#8e44ad","#2c3e50","#fff"],
    colorNames: ["Violet","Noir","Blanc"],
    stock: 9,
    features: ["Flex progressif 4/10","Liner UltraCush","Semelle Waffle","Laçage traditionnel","Mémoire de forme","Résistant froid -20°C"]
  },
  {
    id: 7, name: "Chaussures Rando Salomon X Ultra 4", category: "randonnee", gender: "homme", promo: false,
    price: 21000, oldPrice: null, rating: 4.9, isNew: false,
    img: 'https://gzhls.at/pix/69/66/69668b52b3678a24-n.webp',
    badge: null,
    seasons: ["ete","printemps"],
    rentable: false,
    activities: [
      { key: "randonnee", icon: "🏔️", name: "Randonnée montagne", price: "1 500 DA / journée" },
      { key: "Escalade",  icon: "🧗", name: "Escalade", price: "2 000 DA / session" }
    ],
    desc: "Chaussures de randonnée légères, semelle Contagrip, protection Gore-Tex. Adhérence parfaite sur tous les terrains.",
    sizes: ["40","41","42","43","44","45"],
    colors: ["#2c3e50","#7f8c8d","#27ae60"],
    colorNames: ["Noir","Gris","Kaki"],
    stock: 15,
    features: ["Membrane Gore-Tex","Semelle Contagrip","Tige mi-montante","Embout renforcé","OrthoLite intérieur","Laçage rapide"]
  },
  {
    id: 8, name: "Sac à Dos Osprey Atmos 65L", category: "randonnee", gender: "all", promo: true,
    price: 32000, oldPrice: 42000, rating: 4.8, isNew: false,
    img: 'https://img.thelasthunt.com/https%3A%2F%2Fs3.amazonaws.com%2Fsyncpigeon%2Falti_prod%2Fimages%2Fosp-renn6557_melon-orange.jpg?w=1080&q=75',
    badge: "−24%",
    seasons: ["ete","printemps","hiver"],
    rentable: true, rentPricePerDay: 1200, rentCaution: 10000,
    activities: [
      { key: "randonnee", icon: "🏔️", name: "Randonnée montagne", price: "1 500 DA / journée" },
      { key: "Camping", icon: "⛺", name: "Camping en nature", price: "900 DA / nuit" }
    ],
    desc: "Sac de randonnée 65L, suspension AirSpeed, poche hydratation compatible, ceinture anatomique. Confort sur plusieurs jours.",
    sizes: ["S/M","M/L"],
    colors: ["#2ecc71","#e74c3c","#2c3e50"],
    colorNames: ["Vert","Rouge","Noir"],
    stock: 6,
    features: ["Suspension AirSpeed","65 litres","Poche hydratation 3L","Ceinture anatomique","Housse pluie incluse","Accès latéral"]
  },
  {
    id: 9, name: "Tente MSR Hubba Hubba 2P", category: "camping", gender: "all", promo: false,
    price: 45000, oldPrice: null, rating: 4.8, isNew: false,
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    rentable: true, rentPricePerDay: 1800, rentCaution: 15000,
    seasons: ["ete","printemps"],
    activities: [
      { key: "Camping", icon: "⛺", name: "Camping en nature", price: "900 DA / nuit" }
    ],
    desc: "Tente 2 personnes ultralégère, double paroi, résistante aux intempéries, montage rapide en 10 minutes.",
    sizes: ["2 personnes"],
    colors: ["#e67e22","#2c3e50"],
    colorNames: ["Orange","Gris"],
    stock: 4,
    features: ["Double paroi","Poids 1.72kg","Résistant tempêtes","Montage 10 min","Tissu 30D ripstop","Vestibule intégré"]
  },
  {
    id: 10, name: "Baudrier Escalade Petzl Sama", category: "escalade", gender: "femme", promo: false,
    price: 9500, oldPrice: null, rating: 4.8, isNew: false,
    img: "https://res.cloudinary.com/ekoweb/image/upload/s--NU4tZLGW--/f_auto,h_600,q_auto:eco,w_600/v1/products/9-86990/views/9-86990_harnais-sama-gris_c021ba_01",
    badge: null,
    seasons: ["printemps","ete"],
    rentable: true, rentPricePerDay: 400, rentCaution: 3000,
    activities: [
      { key: "Escalade", icon: "🧗", name: "Escalade", price: "2 000 DA / session" }
    ],
    desc: "Baudrier femme polyvalent, pont ventral renforcé, réglage fin, certifié UIAA. Confort optimal pour l'escalade sportive.",
    sizes: ["XS","S","M","L"],
    colors: ["#8e44ad","#2c3e50","#e74c3c"],
    colorNames: ["Violet","Noir","Rouge"],
    stock: 10,
    features: ["Certifié UIAA","Pont ventral renforcé","Réglage fin","Porte-matériel inclus","Doublure EVA","Poids 320g"]
  },
  {
    id: 11, name: "VTT Scott Genius 900", category: "vtt", gender: "homme", promo: false,
    price: 185000, oldPrice: null, rating: 4.9, isNew: true,
    img: 'https://tse3.mm.bing.net/th/id/OIP.YOV3U4sstulRqgVG4hH4hwHaEe',
    badge: "Nouveau",
    seasons: ["ete","printemps"],
    rentable: true, rentPricePerDay: 6500, rentCaution: 50000,
    activities: [
      { key: "VTT", icon: "🚵", name: "VTT", price: "1 800 DA / journée" }
    ],
    desc: "VTT tout-suspendu carbone, fourche Fox 34, freins Shimano 4 pistons, 29 pouces. Performances trail exceptionnelles.",
    sizes: ["S","M","L","XL"],
    colors: ["#2c3e50","#e74c3c","#f39c12"],
    colorNames: ["Noir","Rouge","Orange"],
    stock: 3,
    features: ["Cadre carbone HMX","Fourche Fox 34","Freins Shimano XT","Transmission Shimano 12v","Roues 29 pouces","Suspension Twinloc"]
  },
  {
    id: 12, name: "Veste de ski Gore-Tex Pro", category: "vetements", gender: "homme", promo: false,
    price: 18500, oldPrice: null, rating: 4.9, isNew: false,
    img: "https://images.snowleader.com/cdn-cgi/image/f=auto,fit=scale-down,q=85/https://images.snowleader.com/media/catalog/product/cache/1/image/0dc2d03fe217f8c83829496872af24a0/N/O/NORR01669_01_202404260447.jpg",
    badge: "Bestseller",
    seasons: ["hiver"],
    rentable: true, rentPricePerDay: 800, rentCaution: 5000,
    activities: [
      { key: "ski",       icon: "⛷️", name: "Ski alpin",  price: "2 500 DA / jour" },
      { key: "Snowboard", icon: "🏂",  name: "Snowboard", price: "2 200 DA / jour" }
    ],
    desc: "Veste technique imperméable Gore-Tex 3 couches. Coutures soudées, respirabilité maximale pour les conditions extrêmes.",
    sizes: ["XS","S","M","L","XL","XXL"],
    colors: ["#1a3a6b","#2a2a2a","#c0392b","#27ae60"],
    colorNames: ["Navy","Noir","Rouge","Vert"],
    stock: 8,
    features: ["Gore-Tex 3 couches","Coutures soudées","Capuche amovible","Poches intérieures","Ventilation axillaire","Ceinture ajustable"]
  },
  {
    id: 13, name: "Veste Softshell Randonnée", category: "vetements", gender: "femme", promo: false,
    price: 7900, oldPrice: null, rating: 4.6, isNew: true,
    img: "https://www.offthetracks.eu/cdn/shop/files/veste-impermeable-femme-randonnee-softshell-noir-notos.webp?v=1736243956&width=493",
    badge: "Nouveau",
    seasons: ["ete","printemps"],
    rentable: false,
    activities: [
      { key: "randonnee", icon: "🏔️", name: "Randonnée montagne", price: "1 500 DA / journée" },
      { key: "Escalade",  icon: "🧗",  name: "Escalade", price: "2 000 DA / session" }
    ],
    desc: "Veste softshell légère et respirante. Coupe-vent avec traitement DWR. Parfaite pour les conditions de mi-saison.",
    sizes: ["XS","S","M","L","XL","XXL"],
    colors: ["#27ae60","#2c3e50","#8e44ad","#e67e22"],
    colorNames: ["Vert forêt","Noir","Violet","Orange"],
    stock: 9,
    features: ["Softshell 3 couches","Traitement DWR","Capuche intégrée","Poches ventrales","Manches préformées","Poids 420g"]
  },
  {
    id: 14, name: "Gants de ski Reusch Premium", category: "accessoires", gender: "all", promo: false,
    price: 3400, oldPrice: null, rating: 4.7, isNew: false,
    img: "https://images.hardloop.fr/1058586-large_default/reusch-down-spirit-gtx-gants-ski-homme.jpg?w=auto&h=auto&q=80",
    badge: null,
    seasons: ["hiver"],
    rentable: false,
    activities: [
      { key: "ski",       icon: "⛷️", name: "Ski alpin",  price: "2 500 DA / jour" },
      { key: "raquettes", icon: "🥾", name: "Raquettes",  price: "1 200 DA / journée" }
    ],
    desc: "Gants imperméables avec isolation Thinsulate 3M 40g. Compatibles écran tactile. Paume cuir synthétique renforcée.",
    sizes: ["S","M","L","XL"],
    colors: ["#2c3e50","#c0392b","#1a3a6b"],
    colorNames: ["Noir","Rouge","Navy"],
    stock: 18,
    features: ["Thinsulate 40g","Membrane imperméable","Cuir synthétique","Écran tactile","Velcro ajustable","Lavable 30°"]
  },
  {
    id: 15, name: "Lunettes Julbo Sherpa", category: "accessoires", gender: "all", promo: true,
    price: 5600, oldPrice: 7200, rating: 4.8, isNew: false,
    img: "https://m.media-amazon.com/images/I/41CtxP2mn8L._AC_SX679_.jpg",
    badge: "−22%",
    seasons: ["hiver","ete","printemps"],
    rentable: false,
    activities: [
      { key: "ski",       icon: "⛷️", name: "Ski alpin",          price: "2 500 DA / jour" },
      { key: "randonnee", icon: "🏔️", name: "Randonnée montagne", price: "1 500 DA / journée" }
    ],
    desc: "Lunettes de montagne avec verres Spectron 4 UV400. Protection 97% lumière visible. Monture TR90 incassable.",
    sizes: ["Taille unique"],
    colors: ["#2c3e50","#c0392b","#1a3a6b"],
    colorNames: ["Noir","Rouge","Navy"],
    stock: 7,
    features: ["Verres Spectron 4","UV400 certifié","Monture TR90","Écrans latéraux","Nez ajustable","Étui rigide inclus"]
  },
  {
    id: 16, name: "Chaussettes Mérinos Icebreaker", category: "accessoires", gender: "all", promo: false,
    price: 1800, oldPrice: null, rating: 4.7, isNew: false,
    img: "https://images.hardloop.fr/773888-large_default/icebreaker-merino-hike-plus-ultralight-crew-chaussettes-en-laine-merinos-femme.jpg?w=auto&h=auto&q=80",
    badge: null,
    seasons: ["hiver","ete","printemps"],
    rentable: false,
    activities: [
      { key: "randonnee", icon: "🏔️", name: "Randonnée montagne", price: "1 500 DA / journée" },
      { key: "ski",       icon: "⛷️", name: "Ski alpin",          price: "2 500 DA / jour" }
    ],
    desc: "Chaussettes en laine mérinos naturelle. Régulation thermique bi-saison, anti-odeur certifié. Confort toute la journée.",
    sizes: ["S (36-38)","M (39-41)","L (42-44)","XL (45-47)"],
    colors: ["#7f8c8d","#2c3e50","#c0392b"],
    colorNames: ["Gris","Noir","Rouge"],
    stock: 30,
    features: ["100% laine mérinos","Régulation thermique","Anti-odeur naturel","Renfort talon/avant-pied","Sans couture orteil","Lavable machine froide"]
  }
];

/* ══════════════════════════════════════
   DATA — PACKS
══════════════════════════════════════ */
const packs = [
  {
    id: "pack-ski",
    badge: "Pack Hiver",
    badgeClass: "",
    title: "Pack Ski Complet",
    subtitle: "Tout l'équipement pour dévaler les pistes algériennes en toute sécurité.",
    items: ["Skis Rossignol Hero Elite", "Casque Salomon Pioneer", "Veste de ski Gore-Tex Pro", "Gants Reusch Premium"],
    productIds: [1, 2, 12, 14],
    totalOriginal: 72900,
    totalPack: 59000
  },
  {
    id: "pack-randonnee",
    badge: "Pack Été",
    badgeClass: "pack-season-badge",
    title: "Pack Randonnée Été",
    subtitle: "Les essentiels pour conquérir les sentiers des massifs algériens.",
    items: ["Chaussures Salomon X Ultra 4", "Sac Osprey Atmos 65L", "Veste Softshell Randonnée", "Chaussettes Mérinos Icebreaker"],
    productIds: [7, 8, 13, 16],
    totalOriginal: 62700,
    totalPack: 52000
  },
  {
    id: "pack-snowboard",
    badge: "Pack Hiver",
    badgeClass: "",
    title: "Pack Snowboard & Glisse",
    subtitle: "Sensations garanties sur les pentes enneigées avec ce pack freestyle.",
    items: ["Snowboard Burton Custom", "Boots Vans Infuse", "Casque Salomon Pioneer", "Lunettes Julbo Sherpa"],
    productIds: [5, 6, 2, 15],
    totalOriginal: 79600,
    totalPack: 65000
  }
];

const rentDurations = [
  { days: 1,  label: "1 jour",    multiplier: 1.00 },
  { days: 3,  label: "3 jours",   multiplier: 0.90 },
  { days: 7,  label: "7 jours",   multiplier: 0.80 },
  { days: 14, label: "14 jours",  multiplier: 0.70 }
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
let cart             = [];
let currentCategory  = 'tous';
let currentSeason    = 'toutes';
let currentGender    = 'all';
let currentProduct   = null;
let currentQty       = 1;
let selectedSize     = null;
let selectedColor    = null;
let currentMode      = 'buy';
let selectedRentDays = 1;
let resCurrentItem   = null;
let resCurrentMode   = 'vente';

/* ══════════════════════════════════════
   SCROLL HEADER
══════════════════════════════════════ */
const siteHeader = document.getElementById('site-header');
const topbar     = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
    if (topbar) topbar.classList.add('hidden');
  } else {
    siteHeader.classList.remove('scrolled');
    if (topbar) topbar.classList.remove('hidden');
  }
}, { passive: true });

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function fmt(n) { return n.toLocaleString('fr-DZ') + ' DA'; }

function getCatLabel(cat) {
  const map = {
    ski:'⛷️ Ski', snowboard:'🏂 Snowboard', randonnee:'🥾 Randonnée',
    vetements:'🧥 Vêtements', accessoires:'🎒 Accessoires',
    camping:'⛺ Camping', escalade:'🧗 Escalade', vtt:'🚵 VTT'
  };
  return map[cat] || cat;
}

function getGenderLabel(g) {
  const map = { homme:'👨 Homme', femme:'👩 Femme', enfant:'👦 Enfant', all:'👤 Mixte' };
  return map[g] || '👤 Mixte';
}

function getSeasonInfo(seasons) {
  if (!seasons || seasons.length === 0) return null;
  const all3 = seasons.includes('hiver') && seasons.includes('ete') && seasons.includes('printemps');
  if (all3) return null;
  if (seasons.includes('hiver') && !seasons.includes('ete') && !seasons.includes('printemps'))
    return { label: '❄️ Hiver', cls: 'hiver' };
  if (seasons.includes('ete') && !seasons.includes('hiver'))
    return { label: '☀️ Été', cls: 'ete' };
  if (seasons.includes('printemps') && !seasons.includes('hiver'))
    return { label: '🌸 Printemps', cls: 'printemps' };
  return null;
}

function getRentTotal(product, days) {
  const dur = rentDurations.find(d => d.days === days) || rentDurations[0];
  return Math.round(product.rentPricePerDay * days * dur.multiplier);
}

/* ══════════════════════════════════════
   GENDER DROPDOWN WINDOW
══════════════════════════════════════ */
function toggleGenderWindow(e) {
  e.stopPropagation();
  const btn      = document.getElementById('genderTriggerBtn');
  const dropdown = document.getElementById('genderWindowDropdown');
  const isOpen   = dropdown.classList.contains('open');
  if (isOpen) {
    closeGenderWindow();
  } else {
    btn.classList.add('open');
    dropdown.classList.add('open');
  }
}

function closeGenderWindow() {
  const btn      = document.getElementById('genderTriggerBtn');
  const dropdown = document.getElementById('genderWindowDropdown');
  if (btn)      btn.classList.remove('open');
  if (dropdown) dropdown.classList.remove('open');
}

// Close gender window on outside click
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('genderWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeGenderWindow();
  }
});

/* ══════════════════════════════════════
   RENDER PACKS
══════════════════════════════════════ */
function renderPacks() {
  const grid = document.getElementById('packsGrid');
  grid.innerHTML = packs.map(pack => {
    const saving  = pack.totalOriginal - pack.totalPack;
    const savePct = Math.round((saving / pack.totalOriginal) * 100);
    return `
    <div class="pack-card" onclick="addPackToCart('${pack.id}')">
      <span class="pack-top-badge ${pack.badgeClass}">${pack.badge}</span>
      <div class="pack-title">${pack.title}</div>
      <div class="pack-subtitle">${pack.subtitle}</div>
      <ul class="pack-items-list">
        ${pack.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <div class="pack-price-footer">
        <div class="pack-price-left">
          <div class="pack-price-old">${fmt(pack.totalOriginal)}</div>
          <div class="pack-price-new">${fmt(pack.totalPack)}</div>
        </div>
        <span class="pack-saving-badge">−${savePct}% · ${fmt(saving)}</span>
      </div>
      <button class="btn-pack">🛒 Ajouter le pack →</button>
    </div>`;
  }).join('');
}

function addPackToCart(packId) {
  const pack = packs.find(p => p.id === packId);
  if (!pack) return;
  pack.productIds.forEach(pid => {
    const product = products.find(p => p.id === pid);
    if (!product) return;
    const key = `pack-${packId}-${pid}`;
    if (!cart.find(i => i.key === key)) {
      cart.push({ key, product, qty: 1, size: product.sizes[0], color: product.colors[0], isRent: false, rentDays: null, packLabel: pack.title });
    }
  });
  updateCartBadge();
  showToast('📦', 'Pack ajouté !', `${pack.title} — ${pack.productIds.length} articles ajoutés au panier.`);
}

/* ══════════════════════════════════════
   RENDER PRODUCTS
══════════════════════════════════════ */
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  document.getElementById('resultsCount').textContent = list.length + ' produit' + (list.length > 1 ? 's' : '');

  if (list.length === 0) {
    grid.innerHTML = `<div class="no-results"><div style="font-size:3rem;margin-bottom:12px">🔍</div><p>Aucun produit trouvé</p><small>Essayez une autre recherche ou catégorie</small></div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const seasonInfo  = getSeasonInfo(p.seasons);
    const actTags     = p.activities && p.activities.length > 0
      ? `<div class="prod-activity-tags">${p.activities.slice(0,2).map(a => `<span class="prod-act-tag">${a.icon} ${a.name}</span>`).join('')}</div>`
      : '';
    const sizesPreview = p.sizes.slice(0,4).map(s => `<span class="prod-size-chip">${s}</span>`).join('');

    const rentBtn = p.rentable
      ? `<button class="btn-card-rent" onclick="event.stopPropagation(); quickRent(${p.id})">📅 Louer ${fmt(p.rentPricePerDay)}/j</button>`
      : '';

    const bottomBadge = p.stock <= 5
      ? `<span class="prod-stock-warn">⚠️ Plus que ${p.stock} en stock</span>`
      : (p.rentable ? `<span class="prod-rent-tag">📅 Location dispo</span>` : '');

    return `
    <div class="product-card" onclick="openProdDetail(${p.id})">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'">
        ${p.badge ? `<span class="prod-badge ${p.promo ? 'badge-promo' : 'badge-new'}">${p.badge}</span>` : ''}
        <span class="prod-rating-badge">⭐ ${p.rating}</span>
        ${seasonInfo ? `<span class="prod-season-tag ${seasonInfo.cls}">${seasonInfo.label}</span>` : bottomBadge}
      </div>
      <div class="prod-body">
        <div class="prod-top-meta">
          <span class="prod-cat-tag">${getCatLabel(p.category)}</span>
          <span class="prod-gender-tag">${getGenderLabel(p.gender)}</span>
        </div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc-short">${p.desc}</div>
        <div class="prod-sizes-preview">${sizesPreview}</div>
        <div class="prod-price-row">
          <span class="prod-price">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="prod-old-price">${fmt(p.oldPrice)}</span>` : ''}
        </div>
        ${p.rentable ? `<div class="prod-rent-price">📅 Location dès ${fmt(p.rentPricePerDay)}/jour</div>` : ''}
        ${actTags}
        <div class="prod-colors-preview">
          ${p.colors.slice(0,4).map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
        </div>
        <div class="card-actions">
          <button class="btn-card-buy" onclick="event.stopPropagation(); quickBuy(${p.id})">🛒 Acheter</button>
          ${rentBtn}
        </div>
        <button class="btn-card-reserve" onclick="event.stopPropagation(); openReservation(${p.id})">📅 Réserver à l'avance</button>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   FILTER / SORT
══════════════════════════════════════ */
function filterProducts() {
  const q    = document.getElementById('searchInput').value.toLowerCase();
  const sort = document.getElementById('sortSelect')?.value || 'default';

  let list = products.filter(p => {
    const matchCat    = currentCategory === 'tous' ? true
      : currentCategory === 'promo' ? p.promo
      : p.category === currentCategory;
    const matchSeason = currentSeason === 'toutes' ? true
      : p.seasons && p.seasons.includes(currentSeason);
    const matchGender = currentGender === 'all' ? true
      : p.gender === currentGender || p.gender === 'all';
    const matchQ = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || getCatLabel(p.category).toLowerCase().includes(q);
    return matchCat && matchSeason && matchGender && matchQ;
  });

  if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'promo')      list.sort((a,b) => (b.promo?1:0) - (a.promo?1:0));

  renderProducts(list);
}

function setCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.ftag').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterProducts();
}

function setSeason(season, btn) {
  currentSeason = season;
  document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProducts();
}

function setGender(gender, btn) {
  currentGender = gender;
  // Update active state on dropdown items
  document.querySelectorAll('.gwd-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Update the trigger button label
  const labels = { all: 'Genre', homme: 'Homme', femme: 'Femme', enfant: 'Enfant' };
  const labelEl = document.getElementById('genderTriggerLabel');
  if (labelEl) labelEl.textContent = labels[gender] || 'Genre';
  filterProducts();
  closeGenderWindow();
}

/* ══════════════════════════════════════
   DETAIL PANEL
══════════════════════════════════════ */
function openProdDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProduct   = p;
  currentQty       = 1;
  selectedSize     = p.sizes[0];
  selectedColor    = p.colors[0];
  currentMode      = 'buy';
  selectedRentDays = 1;

  document.getElementById('prodImg').src          = p.img;
  document.getElementById('prodCat').textContent  = getCatLabel(p.category);
  document.getElementById('prodName').textContent = p.name;
  document.getElementById('prodDesc').textContent = p.desc;
  document.getElementById('prodPriceHero').textContent =
    fmt(p.price) + (p.oldPrice ? `  (était ${fmt(p.oldPrice)})` : '');

  document.getElementById('prodRating').textContent  = `⭐ ${p.rating}`;
  document.getElementById('prodGender').textContent  = getGenderLabel(p.gender);

  const modeSection = document.getElementById('modeSection');
  if (p.rentable) {
    modeSection.style.display = '';
    resetModeUI('buy');
  } else {
    modeSection.style.display = 'none';
    currentMode = 'buy';
  }

  const actSection = document.getElementById('activityLinkSection');
  if (p.activities && p.activities.length > 0) {
    actSection.style.display = '';
    document.getElementById('activityLinksGrid').innerHTML = p.activities.map(a => `
      <a class="activity-link-card" href="index.html#activites">
        <div class="act-link-icon">${a.icon}</div>
        <div class="act-link-info">
          <div class="act-link-name">${a.name}</div>
          <div class="act-link-sub">Dès ${a.price} · Voir et réserver</div>
        </div>
        <span class="act-link-arrow">›</span>
      </a>`).join('');
  } else {
    actSection.style.display = 'none';
  }

  const ss = document.getElementById('sizeSection');
  if (p.sizes.length === 1 && p.sizes[0] === 'Taille unique') {
    ss.style.display = 'none';
  } else {
    ss.style.display = '';
    document.getElementById('sizeGrid').innerHTML = p.sizes.map((s,i) =>
      `<button class="size-btn ${i===0?'active':''}" onclick="selectSize('${s}',this)">${s}</button>`
    ).join('');
  }

  document.getElementById('colorGrid').innerHTML = p.colors.map((c,i) => `
    <div class="color-option ${i===0?'active':''}" onclick="selectColor('${c}',this)" title="${p.colorNames[i]}">
      <span class="color-swatch" style="background:${c}"></span>
      <span class="color-label">${p.colorNames[i]}</span>
    </div>`).join('');

  document.getElementById('qtyCount').textContent = '1';
  document.getElementById('qtyStock').textContent = `${p.stock} en stock`;
  document.getElementById('prodFeatures').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

  updateProdTotal();

  document.getElementById('prodPanel').scrollTop = 0;
  document.getElementById('prodOverlay').classList.add('open');
  document.getElementById('prodPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProdDetail() {
  document.getElementById('prodOverlay').classList.remove('open');
  document.getElementById('prodPanel').classList.remove('open');
  document.body.style.overflow = '';
}

function selectSize(s, btn) {
  selectedSize = s;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectColor(c, el) {
  selectedColor = c;
  document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(delta) {
  if (!currentProduct) return;
  currentQty = Math.max(1, Math.min(currentProduct.stock, currentQty + delta));
  document.getElementById('qtyCount').textContent = currentQty;
  updateProdTotal();
}

function resetModeUI(mode) {
  currentMode = mode;
  const buyBtn  = document.getElementById('modeBuyBtn');
  const rentBtn = document.getElementById('modeRentBtn');
  const rentOpt = document.getElementById('rentOptions');
  if (mode === 'buy') {
    buyBtn.classList.add('active'); rentBtn.classList.remove('active');
    rentOpt.style.display = 'none';
    document.getElementById('btnAddCart').textContent = '🛒 Ajouter au panier';
  } else {
    rentBtn.classList.add('active'); buyBtn.classList.remove('active');
    rentOpt.style.display = '';
    document.getElementById('btnAddCart').textContent = '📅 Ajouter la location';
    if (currentProduct) {
      document.getElementById('durationGrid').innerHTML = rentDurations.map((d,i) => {
        const total = getRentTotal(currentProduct, d.days);
        return `<button class="dur-btn ${i===0?'active':''}" onclick="selectRentDuration(${d.days},this)">${d.label}<br><small style="font-size:0.70rem;opacity:0.75">${fmt(total)}</small></button>`;
      }).join('');
      document.getElementById('rentCaution').textContent = fmt(currentProduct.rentCaution);
    }
  }
}

function setMode(mode) {
  resetModeUI(mode);
  updateProdTotal();
}

function selectRentDuration(days, btn) {
  selectedRentDays = days;
  document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateProdTotal();
}

function updateProdTotal() {
  if (!currentProduct) return;
  const ptDurRow = document.getElementById('ptDurationRow');
  let unitPrice, totalPrice;

  if (currentMode === 'rent') {
    const total = getRentTotal(currentProduct, selectedRentDays);
    const dur   = rentDurations.find(d => d.days === selectedRentDays) || rentDurations[0];
    unitPrice   = currentProduct.rentPricePerDay;
    totalPrice  = total * currentQty;
    ptDurRow.style.display = '';
    document.getElementById('ptDuration').textContent =
      dur.label + (dur.multiplier < 1 ? ` (−${Math.round((1-dur.multiplier)*100)}%)` : '');
  } else {
    unitPrice  = currentProduct.price;
    totalPrice = unitPrice * currentQty;
    ptDurRow.style.display = 'none';
  }

  document.getElementById('ptUnit').textContent  = fmt(unitPrice) + (currentMode === 'rent' ? '/jour' : '');
  document.getElementById('ptQty').textContent   = currentQty;
  document.getElementById('ptTotal').textContent = fmt(totalPrice);
}

/* ══════════════════════════════════════
   CART
══════════════════════════════════════ */
function addToCartFromPanel() {
  if (!currentProduct) return;
  addToCart(currentProduct, currentQty, selectedSize, selectedColor, currentMode === 'rent', currentMode === 'rent' ? selectedRentDays : null);
  closeProdDetail();
}

function quickBuy(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  addToCart(p, 1, p.sizes[0], p.colors[0], false, null);
}

function quickRent(id) {
  const p = products.find(x => x.id === id);
  if (!p || !p.rentable) return;
  addToCart(p, 1, p.sizes[0], p.colors[0], true, 1);
}

function addToCart(product, qty, size, color, isRent, rentDays) {
  const key      = `${product.id}-${size}-${color}-${isRent ? 'rent-' + rentDays : 'buy'}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.push({ key, product, qty, size, color, isRent, rentDays, packLabel: null });
  }
  updateCartBadge();
  const label = isRent ? `Location ${rentDays} jour(s)` : 'Achat';
  showToast('🛒', 'Ajouté au panier !', `${product.name} — ${label}`);
}

function updateCartBadge() {
  const total = cart.reduce((s,i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent  = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function openCart() {
  renderCart();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCart() {
  const empty  = document.getElementById('cartEmpty');
  const items  = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    empty.style.display  = '';
    items.innerHTML      = '';
    footer.style.display = 'none';
    return;
  }

  empty.style.display  = 'none';
  footer.style.display = '';

  items.innerHTML = cart.map((item, idx) => {
    const lineTotal = item.isRent
      ? getRentTotal(item.product, item.rentDays) * item.qty
      : item.product.price * item.qty;
    const metaExtras = item.isRent
      ? `<span class="cart-rent-badge">📅 Location ${item.rentDays}j</span>` : '';
    const packExtra = item.packLabel
      ? `<span style="font-size:0.68rem;color:rgba(255,255,255,0.35)">📦 ${item.packLabel}</span>` : '';
    return `
    <div class="cart-item">
      <img src="${item.product.img}" alt="${item.product.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-meta">
          ${item.size !== 'Taille unique' ? `<span>${item.size}</span>` : ''}
          <span class="cart-item-color" style="background:${item.color}"></span>
          ${metaExtras}${packExtra}
        </div>
        <div class="cart-item-price">${fmt(lineTotal)}</div>
      </div>
      <div class="cart-item-ctrl">
        <button class="qty-btn small" onclick="cartQty(${idx},-1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn small" onclick="cartQty(${idx},1)">+</button>
        <button class="cart-remove" onclick="cartRemove(${idx})">🗑️</button>
      </div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s,i) => s + (i.isRent ? getRentTotal(i.product, i.rentDays) * i.qty : i.product.price * i.qty), 0);
  const shipping = subtotal >= 5000 ? 'Gratuite' : '500 DA';
  const total    = subtotal + (subtotal >= 5000 ? 0 : 500);

  document.getElementById('cartSubtotal').textContent = fmt(subtotal);
  document.getElementById('cartShipping').textContent = shipping;
  document.getElementById('cartTotal').textContent    = fmt(total);
}

function cartQty(idx, delta) {
  cart[idx].qty = Math.max(1, Math.min(cart[idx].product.stock, cart[idx].qty + delta));
  updateCartBadge();
  renderCart();
}

function cartRemove(idx) {
  cart.splice(idx, 1);
  updateCartBadge();
  renderCart();
}

function checkout() {
  cart = [];
  updateCartBadge();
  closeCart();
  showToast('🎉', 'Commande confirmée !', 'Nous vous contacterons sous 24h pour la livraison.');
}

/* ══════════════════════════════════════
   RESERVATION MODAL
══════════════════════════════════════ */
function openReservation(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  resCurrentItem = p;
  resCurrentMode = 'vente';

  document.getElementById('resIcon').textContent  = getCatLabel(p.category).split(' ')[0];
  document.getElementById('resTitle').textContent = p.name;
  document.getElementById('resSub').textContent   = fmt(p.price) + (p.rentable ? ` · Location ${fmt(p.rentPricePerDay)}/j` : '');

  document.getElementById('resName').value  = '';
  document.getElementById('resTel').value   = '';
  document.getElementById('resEmail').value = '';
  document.getElementById('resDate').value  = '';
  document.getElementById('resMsg').value   = '';
  document.getElementById('resDays').value  = 1;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('resDate').min = today;

  const rentModeBtn = document.getElementById('resRentBtn');
  rentModeBtn.style.display = p.rentable ? '' : 'none';
  document.getElementById('resDaysGroup').style.display = 'none';

  document.getElementById('resBuyBtn').classList.add('active');
  document.getElementById('resRentBtn').classList.remove('active');

  updateResPrice();

  document.getElementById('resModal').querySelector('.res-modal-body').scrollTop = 0;
  document.getElementById('resOverlay').classList.add('open');
  document.getElementById('resModal').classList.add('open');
}

function openReservationModal() {
  if (!currentProduct) return;
  closeProdDetail();
  setTimeout(() => openReservation(currentProduct.id), 50);
}

function closeReservationModal() {
  document.getElementById('resOverlay').classList.remove('open');
  document.getElementById('resModal').classList.remove('open');
}

function setResMode(mode) {
  resCurrentMode = mode;
  document.getElementById('resBuyBtn').classList.toggle('active', mode === 'vente');
  document.getElementById('resRentBtn').classList.toggle('active', mode === 'location');
  document.getElementById('resDaysGroup').style.display = mode === 'location' ? '' : 'none';
  updateResPrice();
}

function updateResPrice() {
  if (!resCurrentItem) return;
  const days  = parseInt(document.getElementById('resDays').value) || 1;
  let price;
  if (resCurrentMode === 'location' && resCurrentItem.rentable) {
    price = resCurrentItem.rentPricePerDay * days;
    document.getElementById('rpArticle').textContent = `${fmt(resCurrentItem.rentPricePerDay)}/j × ${days} j`;
  } else {
    price = resCurrentItem.price;
    document.getElementById('rpArticle').textContent = 'Achat';
  }
  document.getElementById('rpTotal').textContent = fmt(price);
}

document.getElementById('resDays').addEventListener('input', updateResPrice);

function submitReservation() {
  const name = document.getElementById('resName').value.trim();
  const tel  = document.getElementById('resTel').value.trim();
  const date = document.getElementById('resDate').value;

  if (!name || !tel || !date) {
    showToast('⚠️', 'Champs manquants', 'Veuillez remplir le nom, téléphone et la date.');
    return;
  }
  closeReservationModal();
  showToast('✅', 'Réservation confirmée !', `Merci ${name} ! Nous vous contacterons bientôt.`);
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(icon, title, msg) {
  document.getElementById('toastIcon').textContent  = icon;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent   = msg;
  const t = document.getElementById('orderToast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ══════════════════════════════════════
   AUTH STUB
══════════════════════════════════════ */
function openAuthModal() {
  showToast('👤', 'Mon compte', 'Fonctionnalité disponible bientôt !');
}

/* ══════════════════════════════════════
   ESC KEY
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeGenderWindow();
  if (document.getElementById('resModal').classList.contains('open'))      closeReservationModal();
  else if (document.getElementById('ecoleResModal').classList.contains('open')) closeEcoleModal();
  else if (document.getElementById('prodPanel').classList.contains('open'))     closeProdDetail();
  else if (document.getElementById('cartPanel').classList.contains('open'))     closeCart();
});

/* ══════════════════════════════════════
   ÉCOLES & FORMATIONS
══════════════════════════════════════ */
const ecoles = [
  {
    id: "e1",
    nom: "École de Ski Débutants",
    niveau: "debutant",
    activite: "⛷️ Ski alpin",
    icon: "⛷️",
    img: "https://www.skinewgen.com/wp-content/uploads/2024/09/Beginner-Ski-Lessons-4-1024x512.webp",
    desc: "Apprenez les bases du ski alpin avec nos moniteurs certifiés. Parfait pour les adultes n'ayant jamais chaussé des skis. Sécurité et progression garanties.",
    duree: "3 jours",
    niveau_label: "🟢 Débutant",
    niveau_class: "niveau-debutant",
    includes: ["Moniteur certifié ESF", "Location matériel incluse", "Casque fourni", "Assurance activité"],
    prix: 7500,
    prixLabel: "/ personne",
    prochaine: "15 jan 2026",
    places: 8,
    featured: false
  },
  {
    id: "e2",
    nom: "Stage Snowboard Freestyle",
    niveau: "intermediaire",
    activite: "🏂 Snowboard",
    icon: "🏂",
    img: "https://evolution2.com/media/cache/cover/2020/12/7877-1746677.jpg",
    desc: "Maîtrisez les figures de base du freestyle sur les pentes algériennes. Sauts, rotations et style — un stage intensif de 5 jours avec vidéo-analyse.",
    duree: "5 jours",
    niveau_label: "🔵 Intermédiaire",
    niveau_class: "niveau-intermediaire",
    includes: ["Coach certifié", "Vidéo-analyse quotidienne", "Accès snow park", "Snack inclus"],
    prix: 12000,
    prixLabel: "/ personne",
    prochaine: "20 jan 2026",
    places: 5,
    featured: false
  },
  {
    id: "e3",
    nom: "Formation Moniteur Ski — Certification",
    niveau: "avance",
    activite: "⛷️ Ski alpin",
    icon: "🏅",
    img: "https://ublo-file-manager.stargraf.com/assets/esfnet/730_304/esf22-ga-01-pb-01-0042%20(1).JPG",
    desc: "Obtenez votre certification de moniteur de ski algérien. Formation intensive de 10 jours incluant pédagogie, technique avancée et gestion de groupe.",
    duree: "10 jours",
    niveau_label: "🔴 Avancé",
    niveau_class: "niveau-avance",
    includes: ["Certification officielle", "Matériel pédagogique", "Hébergement inclus", "Accès illimité pistes"],
    prix: 35000,
    prixLabel: "/ personne",
    prochaine: "05 fév 2026",
    places: 3,
    featured: true
  },
  {
    id: "e4",
    nom: "Mini-Ski Enfants (6–12 ans)",
    niveau: "enfant",
    activite: "⛷️ Ski alpin",
    icon: "👦",
    img: "https://ublo-file-manager.stargraf.com/assets/esfnet/1050w/esf19-11-nl-0028-1.jpg",
    desc: "Initiation au ski pour les enfants de 6 à 12 ans. Encadrement bienveillant, groupes de 4 maximum, matériel adapté. Vos enfants vont adorer la neige !",
    duree: "2 jours",
    niveau_label: "👦 Enfants",
    niveau_class: "niveau-enfant",
    includes: ["Moniteur spécialisé enfants", "Location matériel enfant", "Casque + protèges", "Goûter inclus"],
    prix: 4500,
    prixLabel: "/ enfant",
    prochaine: "Tous les weekends",
    places: 12,
    featured: false
  },
  {
    id: "e5",
    nom: "Stage Randonnée & Survie en Montagne",
    niveau: "intermediaire",
    activite: "🏔️ Randonnée",
    icon: "🏔️",
    img: "https://www.stage-survie-nature.com/_media/img/xlarge/stage-extreme-1.webp",
    desc: "Apprenez les techniques de randonnée alpine, lecture de carte, météo montagne et gestion des situations d'urgence. Stage pratique dans les massifs algériens.",
    duree: "4 jours",
    niveau_label: "🔵 Intermédiaire",
    niveau_class: "niveau-intermediaire",
    includes: ["Guide certifié BAFA", "Cartes topographiques", "Kit premiers secours", "Bivouac une nuit"],
    prix: 9000,
    prixLabel: "/ personne",
    prochaine: "Mar–Avr 2026",
    places: 10,
    featured: false
  },
  {
    id: "e6",
    nom: "Initiation Escalade — Falaises Naturelles",
    niveau: "debutant",
    activite: "🧗 Escalade",
    icon: "🧗",
    img: "https://initiation-escalade.fr/wp-content/uploads/2025/08/escalade-grimpe-en-tete-saut-roland-1280x960.jpg",
    desc: "Découvrez l'escalade sur les falaises naturelles de Babor et Djurdjura. Technique de base, sécurité, nœuds et assurage. Aucune expérience requise.",
    duree: "1 jour",
    niveau_label: "🟢 Débutant",
    niveau_class: "niveau-debutant",
    includes: ["Moniteur diplômé d'État", "Matériel complet fourni", "Initiation nœuds", "Assurance incluse"],
    prix: 3500,
    prixLabel: "/ personne",
    prochaine: "Avr–Mai 2026",
    places: 8,
    featured: false
  }
];

let currentEcoleTab  = 'tous';
let currentEcoleItem = null;
let ecoleGuestCount  = 1;

function renderEcoles() {
  const grid = document.getElementById('ecolesGrid');
  if (!grid) return;

  const filtered = currentEcoleTab === 'tous'
    ? ecoles
    : ecoles.filter(e => e.niveau === currentEcoleTab);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><div style="font-size:3rem;margin-bottom:12px">🎓</div><p>Aucune formation dans ce niveau</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(e => {
    const placesClass = e.places <= 3 ? 'urgente' : '';
    const placesLabel = e.places <= 3
      ? `⚠️ Plus que ${e.places} place${e.places > 1 ? 's' : ''} !`
      : `${e.places} places disponibles`;

    return `
    <div class="ecole-card ${e.featured ? 'featured' : ''}">
      ${e.featured ? '<div class="ecole-vip-ribbon">⭐ VIP</div>' : ''}
      <div class="ecole-img-wrap">
        ${e.img ? `<img src="${e.img}" alt="${e.nom}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=ecole-icon-zone>${e.icon}</div>'">` : `<div class="ecole-icon-zone">${e.icon}</div>`}
        <span class="ecole-niveau-badge ${e.niveau_class}">${e.niveau_label}</span>
        <span class="ecole-duree-badge">⏱️ ${e.duree}</span>
        <span class="ecole-activite-tag">${e.activite}</span>
      </div>
      <div class="ecole-body">
        <div class="ecole-name">${e.nom}</div>
        <div class="ecole-desc">${e.desc}</div>
        <ul class="ecole-includes">
          ${e.includes.map(inc => `<li>${inc}</li>`).join('')}
        </ul>
        <div class="ecole-next-session">
          📅 Prochaine session : <strong>${e.prochaine}</strong>
        </div>
        <div class="ecole-prix-row">
          <div class="ecole-prix">${e.prix.toLocaleString('fr-DZ')} DA<br><small>${e.prixLabel}</small></div>
          <span class="ecole-places ${placesClass}">${placesLabel}</span>
        </div>
        <button class="btn-ecole" onclick="openEcoleModal('${e.id}')">
          📅 Réserver ce cours →
        </button>
      </div>
    </div>`;
  }).join('');
}

function setEcoleTab(tab, btn) {
  currentEcoleTab = tab;
  document.querySelectorAll('.ecole-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEcoles();
}

function openEcoleModal(ecoleId) {
  const e = ecoles.find(x => x.id === ecoleId);
  if (!e) return;
  currentEcoleItem = e;
  ecoleGuestCount  = 1;

  document.getElementById('ecoleResIcon').textContent  = e.icon;
  document.getElementById('ecoleResTitle').textContent = e.nom;
  document.getElementById('ecoleResSub').textContent   = e.duree + ' · ' + e.niveau_label;

  document.getElementById('ecoleResName').value    = '';
  document.getElementById('ecoleResTel').value     = '';
  document.getElementById('ecoleResEmail').value   = '';
  document.getElementById('ecoleResDate').value    = '';
  document.getElementById('ecoleResMsg').value     = '';
  document.getElementById('ecoleResNiveau').value  = '';
  document.getElementById('ecoleResStation').value = '';
  document.getElementById('ecoleGuestCount').textContent = '1';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ecoleResDate').min = today;

  updateEcolePrice();

  document.getElementById('ecoleResModal').querySelector('.res-modal-body').scrollTop = 0;
  document.getElementById('ecoleResOverlay').classList.add('open');
  document.getElementById('ecoleResModal').classList.add('open');
}

function closeEcoleModal() {
  document.getElementById('ecoleResOverlay').classList.remove('open');
  document.getElementById('ecoleResModal').classList.remove('open');
}

function changeEcoleGuests(delta) {
  ecoleGuestCount = Math.max(1, Math.min(20, ecoleGuestCount + delta));
  document.getElementById('ecoleGuestCount').textContent = ecoleGuestCount;
  updateEcolePrice();
}

function updateEcolePrice() {
  if (!currentEcoleItem) return;
  const total = currentEcoleItem.prix * ecoleGuestCount;
  document.getElementById('ecolePrixFormation').textContent    = currentEcoleItem.prix.toLocaleString('fr-DZ') + ' DA';
  document.getElementById('ecolePrixParticipants').textContent = `${ecoleGuestCount} × ${currentEcoleItem.prix.toLocaleString('fr-DZ')} DA`;
  document.getElementById('ecolePrixTotal').textContent        = total.toLocaleString('fr-DZ') + ' DA';
}

function submitEcoleReservation() {
  const name = document.getElementById('ecoleResName').value.trim();
  const tel  = document.getElementById('ecoleResTel').value.trim();
  const date = document.getElementById('ecoleResDate').value;

  if (!name || !tel || !date) {
    showToast('⚠️', 'Champs manquants', 'Veuillez remplir le nom, téléphone et la date.');
    return;
  }
  closeEcoleModal();
  showToast('🎓', 'Formation réservée !', `Merci ${name} ! Votre inscription à "${currentEcoleItem.nom}" est confirmée.`);
}

/* ══════════════════════════════════════
   ACCOUNT DROPDOWN
══════════════════════════════════════ */
function toggleAccountDropdown(e) {
  e.stopPropagation();
  const btn      = document.getElementById('accountWrap').querySelector('.btn-account');
  const dropdown = document.getElementById('accountDropdown');
  const isOpen   = dropdown.classList.contains('open');

  closeCart && closeCart();

  if (isOpen) {
    closeAccountDropdown();
  } else {
    btn.classList.add('open');
    dropdown.classList.add('open');
  }
}

function closeAccountDropdown() {
  const btn      = document.getElementById('accountWrap')?.querySelector('.btn-account');
  const dropdown = document.getElementById('accountDropdown');
  if (btn)      btn.classList.remove('open');
  if (dropdown) dropdown.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const wrap = document.getElementById('accountWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeAccountDropdown();
  }
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderEcoles();
renderPacks();
filterProducts();
updateCartBadge();
/* ══════════════════════════════════════════════════════════════
   BOUTIQUE_LOGIC.JS
   Add AFTER boutique.js:  <script src="boutique_logic.js"></script>
   Adds:
   ✅ Auth guard on every buy / rent / reserve / checkout action
   ✅ Checkout saves real order to MDZ.addOrder()
   ✅ Reservation saves to MDZ.addReservation()
   ✅ Favourite toggle on product cards
   ✅ Real weather in reservation modal location select
══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   PATCH: wrap every action that needs auth
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Patch quickBuy ── */
  const _origQuickBuy = window.quickBuy;
  window.quickBuy = function(id) {
    if (!requireAuth('acheter cet article')) return;
    _origQuickBuy(id);
  };

  /* ── Patch quickRent ── */
  const _origQuickRent = window.quickRent;
  window.quickRent = function(id) {
    if (!requireAuth('louer cet article')) return;
    _origQuickRent(id);
  };

  /* ── Patch openReservation ── */
  const _origOpenRes = window.openReservation;
  window.openReservation = function(productId) {
    if (!requireAuth('réserver cet article')) return;
    _origOpenRes(productId);
  };

  /* ── Patch addToCartFromPanel ── */
  const _origAddCart = window.addToCartFromPanel;
  window.addToCartFromPanel = function() {
    if (!requireAuth('ajouter au panier')) return;
    _origAddCart();
  };

  /* ── Patch openEcoleModal ── */
  const _origEcole = window.openEcoleModal;
  window.openEcoleModal = function(id) {
    if (!requireAuth('réserver cette formation')) return;
    _origEcole(id);
  };

  /* ── Patch checkout → saves real order ── */
  window.checkout = function() {
  if (typeof requireAuth === 'function' && !requireAuth('passer une commande')) return;
  if (!cart || !cart.length) return;

  const subtotal = cart.reduce((s, i) => {
    if (typeof getRentTotal === 'function' && i.isRent)
      return s + getRentTotal(i.product, i.rentDays) * i.qty;
    return s + (i.product?.price || 0) * i.qty;
  }, 0);
  const total = subtotal + (subtotal >= 5000 ? 0 : 500);

  openPaymentModal(
    cart.slice(), // snapshot
    total,
    function(orderId) {
      // onSuccess: clear cart
      cart = [];
      if (typeof updateCartBadge === 'function') updateCartBadge();
      if (typeof closeCart === 'function') closeCart();
      if (typeof showToast === 'function')
        showToast('🎉', 'Commande confirmée !', `${orderId} — Retrouvez-la dans Mes Commandes.`);
    }
  );


    // Auto-open dashboard on commandes tab after short delay
    setTimeout(() => openAccountDashboard('commandes'), 1200);
  };

  /* ── Patch submitReservation (boutique) → saves ── */
  const _origSubmitRes = window.submitReservation;
  window.submitReservation = function() {
    if (!requireAuth('confirmer cette réservation')) return;
    const name = document.getElementById('resName')?.value.trim();
    const tel  = document.getElementById('resTel')?.value.trim();
    const date = document.getElementById('resDate')?.value;
    if (!name || !tel || !date) {
      showToast('⚠️', 'Champs manquants', 'Veuillez remplir le nom, téléphone et la date.');
      return;
    }
    if (resCurrentItem) {
      MDZ.addReservation({
        titre         : resCurrentItem.name,
        icon          : '🛒',
        dateReservation: date,
        lieu          : 'Boutique',
        personnes     : 1,
        prix          : document.getElementById('rpTotal')?.textContent || '',
        statut        : 'confirmé',
        type          : 'boutique'
      });
    }
    closeReservationModal();
    showToast('✅', 'Réservation confirmée !', `Retrouvez-la dans Mon Compte → Mes Réservations.`);
    setTimeout(() => openAccountDashboard('reservations'), 1200);
  };

  /* ── Patch submitEcoleReservation → saves ── */
  const _origEcoleSubmit = window.submitEcoleReservation;
  window.submitEcoleReservation = function() {
    if (!requireAuth('confirmer cette réservation')) return;
    const name = document.getElementById('ecoleResName')?.value.trim();
    const tel  = document.getElementById('ecoleResTel')?.value.trim();
    const date = document.getElementById('ecoleResDate')?.value;
    if (!name || !tel || !date) {
      showToast('⚠️', 'Champs manquants', 'Veuillez remplir le nom, téléphone et la date.');
      return;
    }
    if (currentEcoleItem) {
      MDZ.addReservation({
        titre         : currentEcoleItem.nom,
        icon          : currentEcoleItem.icon || '🎓',
        dateReservation: date,
        lieu          : document.getElementById('ecoleResStation')?.value || 'Station à confirmer',
        personnes     : ecoleGuestCount,
        prix          : document.getElementById('ecolePrixTotal')?.textContent || '',
        statut        : 'confirmé',
        type          : 'formation',
        activiteKey   : 'formation'
      });
    }
    closeEcoleModal();
    showToast('🎓', 'Formation réservée !', 'Retrouvez-la dans Mon Compte → Mes Réservations.');
    setTimeout(() => openAccountDashboard('reservations'), 1200);
  };

  /* ── Add heart/favourite buttons to product cards (MutationObserver) ── */
  _addFavButtons();
  const observer = new MutationObserver(_addFavButtons);
  const grid = document.getElementById('productsGrid');
  if (grid) observer.observe(grid, { childList: true });

  /* ── Real weather in reservation modal location select ── */
  const resLocSelect = document.getElementById('ecoleResStation');
  if (resLocSelect) {
    resLocSelect.addEventListener('change', async function() {
      const loc    = this.value.replace(/\s*\(.*\)/, '').trim(); // strip "(Bouira)" etc
      const coords = MDZ.stationCoords[loc];
      if (!coords) return;
      const w = await MDZ.getWeather(coords.lat, coords.lon, loc);
      _showResWeatherBadge('ecoleResModal', w);
    });
  }
});

/* ── Inject favourite hearts on product cards ── */
function _addFavButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    if (card.querySelector('.fav-btn')) return; // already added
    const imgWrap = card.querySelector('.prod-img-wrap');
    if (!imgWrap) return;

    // Get product id from onclick
    const onclick = card.getAttribute('onclick') || '';
    const match   = onclick.match(/openProdDetail\((\d+)\)/);
    if (!match) return;
    const pid = parseInt(match[1]);
    const prod = (typeof products !== 'undefined') ? products.find(p => p.id === pid) : null;
    if (!prod) return;

    const isFav = MDZ.isFavourite(pid, 'article');
    const btn   = document.createElement('button');
    btn.className   = 'fav-btn';
    btn.dataset.pid = pid;
    btn.innerHTML   = isFav ? '❤️' : '🤍';
    btn.title       = isFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
    btn.style.cssText = `
      position:absolute;bottom:10px;left:10px;
      background:rgba(8,18,36,.70);backdrop-filter:blur(6px);
      border:1px solid rgba(255,255,255,.18);border-radius:50%;
      width:32px;height:32px;display:grid;place-items:center;
      cursor:pointer;font-size:1rem;z-index:3;
      transition:transform .2s,background .2s;`;
    btn.onclick = function(e) {
      e.stopPropagation();
      if (!requireAuth('ajouter aux favoris')) return;
      const added = MDZ.toggleFavourite({
        id: pid, type: 'article',
        nom: prod.name, img: prod.img
      });
      this.innerHTML = added ? '❤️' : '🤍';
      this.title     = added ? 'Retirer des favoris' : 'Ajouter aux favoris';
      this.style.transform = 'scale(1.3)';
      setTimeout(() => this.style.transform = 'scale(1)', 200);
      if (typeof showToast === 'function')
        showToast(added ? '❤️' : '🤍', added ? 'Ajouté aux favoris' : 'Retiré des favoris', prod.name);
    };
    imgWrap.appendChild(btn);
  });
}

/* ── Show a small weather badge inside a modal ── */
function _showResWeatherBadge(modalId, w) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  let badge = modal.querySelector('.res-weather-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'res-weather-badge';
    badge.style.cssText = `
      display:flex;align-items:center;gap:10px;
      background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
      border-radius:12px;padding:10px 14px;margin:8px 0 14px;font-size:.83rem;`;
    const body = modal.querySelector('.res-modal-body');
    const firstLabel = body && body.querySelector('.res-section-label');
    if (firstLabel) body.insertBefore(badge, firstLabel.nextSibling);
    else if (body)  body.prepend(badge);
  }
  badge.innerHTML = `
    <span style="font-size:1.4rem;">${w.icon}</span>
    <div>
      <div style="font-weight:700;color:#fff;">${w.loc} — ${w.temp} · ${w.condition}</div>
      <div style="color:rgba(255,255,255,.45);">💨 ${w.wind} &nbsp;💧 ${w.humidity}</div>
    </div>`;
}
