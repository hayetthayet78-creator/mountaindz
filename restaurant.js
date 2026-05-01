/* ============================================
   MountainDZ — Restaurant & Café Page JS
   FIXED: header scroll, hamburger crash, dropdown
   ============================================ */

'use strict';

// ===== NAVBAR SCROLL — uses site-header (matches other pages) =====
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== PARTICLE GENERATOR =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * -15}s;
      opacity: ${Math.random() * 0.3};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== SEASON MOOD SWITCHER =====
const moods = document.querySelectorAll('.mood');
const seasonContents = document.querySelectorAll('.season-inner');

moods.forEach(mood => {
  mood.addEventListener('click', () => {
    const season = mood.dataset.season;
    moods.forEach(m => m.classList.remove('active'));
    mood.classList.add('active');
    seasonContents.forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById(`${season}-content`);
    if (targetContent) targetContent.classList.add('active');
  });
});

// ===== FILTER TABS =====
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.card');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const cardsGrid = document.getElementById('cardsGrid');

let activeFilter = 'all';
let activeSortKey = 'price-asc';

function updateResultsCount(count) {
  if (resultsCount) {
    resultsCount.textContent = `${count} établissement${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}`;
  }
}

function applyFiltersAndSort() {
  let visible = 0;
  const allCards = Array.from(cards);

  allCards.forEach(card => {
    const type = card.dataset.type;
    const show = activeFilter === 'all' || type === activeFilter;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  const visibleCards = allCards.filter(c => !c.classList.contains('hidden'));
  visibleCards.sort((a, b) => {
    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);
    const ratingA = parseFloat(a.dataset.rating);
    const ratingB = parseFloat(b.dataset.rating);
    if (activeSortKey === 'price-asc')  return priceA - priceB;
    if (activeSortKey === 'price-desc') return priceB - priceA;
    if (activeSortKey === 'rating')     return ratingB - ratingA;
    return 0;
  });

  visibleCards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.07}s`;
    card.style.animation = 'none';
    requestAnimationFrame(() => { card.style.animation = ''; });
    cardsGrid.appendChild(card);
  });

  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  updateResultsCount(visible);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    applyFiltersAndSort();
  });
});

// ===== SORT BUTTONS =====
const sortBtns = document.querySelectorAll('.sort-btn');
sortBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sortBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSortKey = btn.dataset.sort;
    applyFiltersAndSort();
  });
});

// ===== SEARCH BUTTON =====
const searchBtn = document.getElementById('searchBtn');
const typeSelect = document.getElementById('typeSelect');
const gastroSelect = document.getElementById('gastroSelect');

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const typeVal = typeSelect ? typeSelect.value : 'all';
    const gastroVal = gastroSelect ? gastroSelect.value : 'all';

    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
    searchBtn.style.opacity = '0.8';

    setTimeout(() => {
      searchBtn.innerHTML = '<i class="fas fa-search"></i> Rechercher';
      searchBtn.style.opacity = '1';

      let count = 0;
      cards.forEach(card => {
        const type = card.dataset.type;
        const gastro = card.dataset.gastro;
        const typeMatch   = typeVal   === 'all' || type  === typeVal;
        const gastroMatch = gastroVal === 'all' || gastro === gastroVal;
        const show = typeMatch && gastroMatch && (activeFilter === 'all' || type === activeFilter);
        card.classList.toggle('hidden', !show);
        if (show) count++;
      });

      if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
      updateResultsCount(count);

      const listingsSection = document.querySelector('.listings-section');
      if (listingsSection) listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  });
}

// ===== BOOKING MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const toast        = document.getElementById('toast');

function getLocalDateInputValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function openModal(restaurantName) {
  if (!modalOverlay) return;
  if (modalTitle) modalTitle.textContent = restaurantName;
  const dateInput = modalOverlay.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.min = getLocalDateInputValue();
    // If an old date was left in the field, clear it.
    if (dateInput.value && dateInput.value < dateInput.min) dateInput.value = '';
  }
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function showToast() {
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

document.querySelectorAll('.btn-card').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const name = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    openModal(name);
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

const confirmBtn = document.querySelector('.btn-modal-confirm');
if (confirmBtn) {
  confirmBtn.addEventListener('click', () => {
    const inputs = modalOverlay.querySelectorAll('input[type="text"], input[type="date"]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
        setTimeout(() => input.style.borderColor = '', 2000);
      }
    });
    const dateInput = modalOverlay.querySelector('input[type="date"]');
    if (dateInput && dateInput.value) {
      const selected = new Date(dateInput.value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        dateInput.style.borderColor = '#ef4444';
        valid = false;
        setTimeout(() => dateInput.style.borderColor = '', 2000);
      }
    }
    if (!valid) return;
    closeModal();
    setTimeout(showToast, 300);
  });
}

// ===== KEYBOARD CLOSE =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalOverlay && modalOverlay.classList.contains('open')) closeModal();
    closeAccountDropdown();
  }
});

// ===== HERO PARALLAX =====
const heroBg = document.querySelector('.restau-hero-bg');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight && heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.25}px) scale(1.05)`;
  }
}, { passive: true });

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const text = stat.textContent;
    const isPercent = text.includes('%');
    const hasPlus = text.includes('+');
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    if (!num) return;
    let current = 0;
    const increment = num / 50;
    const timer = setInterval(() => {
      current = Math.min(current + increment, num);
      stat.textContent = Math.floor(current) + (hasPlus ? '+' : '') + (isPercent ? '%' : '');
      if (current >= num) clearInterval(timer);
    }, 30);
  });
}

const expSection = document.querySelector('.experience-section');
if (expSection) {
  const expObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      expObserver.disconnect();
    }
  }, { threshold: 0.3 });
  expObserver.observe(expSection);
}

// ===== INITIAL RENDER =====
applyFiltersAndSort();

/* ══════════════════════════════════════
   ACCOUNT DROPDOWN
══════════════════════════════════════ */

function toggleAccountDropdown(e) {
  e.stopPropagation();
  const btn      = document.getElementById('accountWrap') && document.getElementById('accountWrap').querySelector('.btn-account');
  const dropdown = document.getElementById('accountDropdown');
  if (!btn || !dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeAccountDropdown();
  } else {
    btn.classList.add('open');
    dropdown.classList.add('open');
  }
}

function closeAccountDropdown() {
  const btn      = document.getElementById('accountWrap') && document.getElementById('accountWrap').querySelector('.btn-account');
  const dropdown = document.getElementById('accountDropdown');
  if (btn)      btn.classList.remove('open');
  if (dropdown) dropdown.classList.remove('open');
}

// ✅ Close on outside click
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('accountWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeAccountDropdown();
  }
});
/* ══════════════════════════════════════════════════════════════
   RESTAURANT_LOGIC.JS
   Add AFTER restaurant.js: <script src="restaurant_logic.js"></script>
   Adds:
   ✅ Auth guard on table reservation
   ✅ Saves reservation to MDZ.addReservation()
   ✅ Real weather badge shown when station selected
══════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Patch openModal — auth guard ── */
  const _origOpen = window.openModal;
  window.openModal = function(restaurantName) {
    if (!requireAuth('réserver une table')) return;
    _origOpen(restaurantName);
    _injectWeatherStrip();
  };

  /* ── Patch confirm button → saves reservation ── */
  const confirmBtn = document.querySelector('.btn-modal-confirm');
  if (confirmBtn) {
    // Replace existing listener by cloning
    const fresh = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(fresh, confirmBtn);

    fresh.addEventListener('click', () => {
      if (!requireAuth('confirmer cette réservation')) return;

      const modalOverlay = document.getElementById('modalOverlay');
      const inputs = modalOverlay.querySelectorAll('input[type="text"], input[type="date"]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          valid = false;
          setTimeout(() => input.style.borderColor = '', 2000);
        }
      });
      const dateInput = modalOverlay.querySelector('input[type="date"]');
      if (dateInput && dateInput.value) {
        const selected = new Date(dateInput.value + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          dateInput.style.borderColor = '#ef4444';
          valid = false;
          setTimeout(() => dateInput.style.borderColor = '', 2000);
        }
      }
      if (!valid) return;

      const name  = modalOverlay.querySelector('input[type="text"]')?.value.trim();
      const date  = modalOverlay.querySelector('input[type="date"]')?.value;
      const time  = modalOverlay.querySelector('select')?.value || '';
      const pax   = modalOverlay.querySelector('input[type="number"]')?.value || 2;
      const resto = document.getElementById('modalTitle')?.textContent || 'Restaurant';

      MDZ.addReservation({
        titre         : resto,
        icon          : '🍽️',
        dateReservation: date + (time ? ' à ' + time : ''),
        lieu          : _extractStation(resto),
        personnes     : parseInt(pax),
        prix          : '—',
        statut        : 'confirmé',
        type          : 'restaurant'
      });

      if (typeof closeModal === 'function') closeModal();
      setTimeout(() => {
        if (typeof showToast === 'function')
          showToast('🍽️', 'Table réservée !', 'Retrouvez-la dans Mon Compte → Mes Réservations.');
        setTimeout(() => openAccountDashboard('reservations'), 1200);
      }, 300);
    });
  }
});

/* Extract station name from restaurant card location */
function _extractStation(restaurantName) {
  // Try to find the card with matching h3 and read its location
  const cards = document.querySelectorAll('.card');
  for (const card of cards) {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === restaurantName.trim()) {
      const loc = card.querySelector('.card-location');
      return loc ? loc.textContent.replace(/[^a-zA-ZÀ-ÿ ,]/g, '').trim() : restaurantName;
    }
  }
  return restaurantName;
}

/* Inject live weather strip into booking modal */
async function _injectWeatherStrip() {
  const modal = document.getElementById('modalOverlay');
  if (!modal) return;
  if (modal.querySelector('.res-weather-strip')) return;

  // Find selected restaurant's station from the modal title
  const restoName = document.getElementById('modalTitle')?.textContent || '';
  const stationRaw = _extractStation(restoName);

  // Try to match to a known station
  const stationKey = Object.keys(MDZ.stationCoords).find(k =>
    stationRaw.toUpperCase().includes(k.toUpperCase())
  );
  if (!stationKey) return;

  const strip = document.createElement('div');
  strip.className = 'res-weather-strip';
  strip.style.cssText = `
    display:flex;align-items:center;gap:10px;
    background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);
    border-radius:12px;padding:10px 14px;margin:0 0 16px;font-size:.83rem;
    color:#fff;`;
  strip.innerHTML = `<span style="opacity:.5">⏳ Météo en cours...</span>`;

  const form = modal.querySelector('.modal-form');
  if (form) form.insertBefore(strip, form.firstChild);

  const w = await MDZ.getWeather(
    MDZ.stationCoords[stationKey].lat,
    MDZ.stationCoords[stationKey].lon,
    stationKey
  );
  strip.innerHTML = `
    <span style="font-size:1.4rem;">${w.icon}</span>
    <div>
      <div style="font-weight:700;">${w.loc} — ${w.temp} · ${w.condition}</div>
      <div style="color:rgba(255,255,255,.45);">💨 ${w.wind} &nbsp;💧 ${w.humidity} &nbsp;<span style="font-size:.65rem;opacity:.5;">🔴 live</span></div>
    </div>`;
}