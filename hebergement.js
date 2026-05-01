/* ══════════════════════════════════════
   HEBERGEMENT.JS — FIXED
   Works with both auth.js and api-connector.js
══════════════════════════════════════ */

'use strict';

/* ── Header scroll ── */
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─────────────────────────────────────────
   ACCOUNT DROPDOWN
───────────────────────────────────────── */
function toggleAccountDropdown(e) {
  e.stopPropagation();
  const btn      = document.getElementById('accountWrap')?.querySelector('.btn-account');
  const dropdown = document.getElementById('accountDropdown');
  if (!btn || !dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) { closeAccountDropdown(); }
  else { btn.classList.add('open'); dropdown.classList.add('open'); }
}

function closeAccountDropdown() {
  document.getElementById('accountWrap')?.querySelector('.btn-account')?.classList.remove('open');
  document.getElementById('accountDropdown')?.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const wrap = document.getElementById('accountWrap');
  if (wrap && !wrap.contains(e.target)) closeAccountDropdown();
});

/* ─────────────────────────────────────────
   WIRE DROPDOWN LINKS → dashboard modal
───────────────────────────────────────── */
function wireDashboardLinks() {
  document.querySelectorAll('.dropdown-link').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text.includes('réservation')) {
      link.href = '#';
      link.onclick = (e) => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('reservations'); };
    }
    if (text.includes('commande')) {
      link.href = '#';
      link.onclick = (e) => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('commandes'); };
    }
    if (text.includes('favori')) {
      link.href = '#';
      link.onclick = (e) => { e.preventDefault(); closeAccountDropdown(); openAccountDashboard('favoris'); };
    }
  });
}

/* ─────────────────────────────────────────
   FILTER TABS
───────────────────────────────────────── */
function setFilter(type, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  let visible = 0;
  document.querySelectorAll('.heb-card').forEach(card => {
    const show = type === 'tous' || card.dataset.type === type;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  const rc = document.getElementById('resultsCount');
  if (rc) rc.textContent = visible + ' hébergement' + (visible > 1 ? 's' : '');
}

/* ─────────────────────────────────────────
   SEARCH BUTTON
───────────────────────────────────────── */
document.getElementById('searchBtn')?.addEventListener('click', function () {
  this.innerHTML = '⏳ Recherche…';
  setTimeout(() => {
    this.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> Rechercher`;
    document.getElementById('hebergements')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 800);
});

/* ─────────────────────────────────────────
   DEFAULT DATES
───────────────────────────────────────── */
(function() {
  const today = new Date(), plus5 = new Date();
  plus5.setDate(today.getDate() + 5);
  const fmt = d => d.toISOString().split('T')[0];
  const set = (id, val, min) => { const el = document.getElementById(id); if (el) { el.value = val; if (min) el.min = min; } };
  set('searchArrival',  fmt(today));
  set('searchDeparture',fmt(plus5));
  set('hebArrival',     fmt(today),  fmt(today));
  set('hebDeparture',   fmt(plus5),  fmt(today));
})();

/* ─────────────────────────────────────────
   BOOKING PANEL
───────────────────────────────────────── */
let _hebPrice = 0, _hebTitle = '';

function openHebModal(btn) {
  if (typeof requireAuth === 'function' && !requireAuth('réserver cet hébergement')) return;
  _hebPrice = parseInt(btn.dataset.price, 10);
  _hebTitle = btn.dataset.title;

  const amenities = JSON.parse(btn.dataset.amenities || '[]');
  const info      = JSON.parse(btn.dataset.info      || '[]');

  document.getElementById('hebModalImg').src              = btn.dataset.img;
  document.getElementById('hebModalImg').alt              = _hebTitle;
  document.getElementById('hebModalLocation').textContent = btn.dataset.location;
  document.getElementById('hebModalTitle').textContent    = _hebTitle;
  document.getElementById('hebModalRating').textContent   = btn.dataset.rating;
  document.getElementById('hebPricePerNight').textContent = _hebPrice.toLocaleString('fr-DZ') + ' DZD / nuit';

  document.getElementById('hebModalAmenities').innerHTML = amenities.map(a =>
    `<div class="heb-amenity-item"><span class="heb-amenity-icon">${a.charAt(0)}</span><span>${a.slice(2)}</span></div>`
  ).join('');
  document.getElementById('hebModalInfo').innerHTML = info.map(i =>
    `<div class="heb-info-item">${i}</div>`
  ).join('');

  if (typeof MDZ !== 'undefined') {
    const user = MDZ.getUser();
    if (user?.prenom) {
      const el = document.getElementById('hebName');
      if (el) el.value = (user.prenom + ' ' + (user.nom || '')).trim();
    }
  }

  updateHebTotal();
  document.getElementById('hebPanel').scrollTop = 0;
  document.getElementById('hebOverlay').classList.add('open');
  document.getElementById('hebPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeHebModal() {
  document.getElementById('hebOverlay')?.classList.remove('open');
  document.getElementById('hebPanel')?.classList.remove('open');
  document.body.style.overflow = '';
}

function updateHebTotal() {
  const arr = document.getElementById('hebArrival')?.value;
  const dep = document.getElementById('hebDeparture')?.value;
  if (!arr || !dep) return;
  const nights = Math.max(1, Math.round((new Date(dep) - new Date(arr)) / 86400000));
  const total  = _hebPrice * nights;
  document.getElementById('hebNightsLabel').textContent = nights + ' nuit' + (nights > 1 ? 's' : '');
  document.getElementById('hebNightsCount').textContent = nights + ' × ' + _hebPrice.toLocaleString('fr-DZ') + ' DZD';
  document.getElementById('hebTotal').textContent       = total.toLocaleString('fr-DZ') + ' DZD';
}

document.getElementById('hebArrival')?.addEventListener('change',   updateHebTotal);
document.getElementById('hebDeparture')?.addEventListener('change', updateHebTotal);

async function confirmHebReservation() {
  if (typeof requireAuth === 'function' && !requireAuth('confirmer cette réservation')) return;
  const name = document.getElementById('hebName')?.value.trim();
  const arr  = document.getElementById('hebArrival')?.value;
  const dep  = document.getElementById('hebDeparture')?.value;

  if (!name || !arr || !dep) { _showHebToast('⚠️ Veuillez remplir le nom et les dates.'); return; }

  const nights = Math.max(1, Math.round((new Date(dep) - new Date(arr)) / 86400000));
  const total  = _hebPrice * nights;

  if (typeof MDZ !== 'undefined') {
    await MDZ.addReservation({
      titre: _hebTitle, icon: '🏡',
      dateReservation: arr + ' → ' + dep,
      lieu: document.getElementById('hebModalLocation')?.textContent || '',
      personnes: (document.getElementById('hebGuests')?.value || '2').replace(/\D.*/, ''),
      prix: total.toLocaleString('fr-DZ') + ' DZD',
      statut: 'confirmé', type: 'hebergement'
    });
  }

  closeHebModal();

  const toast = document.getElementById('hebToast');
  if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 5000); }

  setTimeout(() => {
    if (typeof openAccountDashboard === 'function') openAccountDashboard('reservations');
  }, 1400);
}

/* ─────────────────────────────────────────
   ATTACH & INIT
───────────────────────────────────────── */
document.querySelectorAll('.btn-heb-reserve').forEach(btn => {
  btn.addEventListener('click', () => openHebModal(btn));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeHebModal(); closeAccountDropdown(); }
});

function _showHebToast(msg) {
  const t = document.getElementById('hebToast');
  if (!t) return;
  const s = t.querySelector('strong'); if (s) s.textContent = msg;
  const p = t.querySelector('p');      if (p) p.textContent = '';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* DOM READY — run after auth.js has set up MDZ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof updateNavForAuth === 'function') updateNavForAuth();
  /* Small delay so auth.js DOMContentLoaded fires first */
  setTimeout(wireDashboardLinks, 150);
});