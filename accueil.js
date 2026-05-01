// ══════════════════════════════════════════════
//  ACCOUNT DROPDOWN
// ══════════════════════════════════════════════
function toggleAccountDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('accountDropdown');
  const btn = document.getElementById('accountWrap').querySelector('.btn-account');
  const isOpen = dropdown.classList.contains('open');
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
    const match = (card.getAttribute('onclick') || '').match(/openDetail\(['"](\w+)['"]\)/);
    if (!match) return;
    const actKey = match[1];
    const act = activities[actKey];
    if (!act) return;

    const isFav = MDZ.isFavourite(actKey, 'activite');
    const btn = document.createElement('button');
    btn.className = 'fav-btn-act';
    btn.innerHTML = isFav ? '❤️' : '🤍';
    btn.style.cssText = `position:absolute;top:10px;right:10px;
      background:rgba(8,18,36,.70);backdrop-filter:blur(6px);
      border:1px solid rgba(255,255,255,.18);border-radius:50%;
      width:32px;height:32px;display:grid;place-items:center;
      cursor:pointer;font-size:.95rem;z-index:5;transition:transform .2s;`;

    btn.onclick = async function (e) {
      e.stopPropagation();
      if (!requireAuth('ajouter aux favoris')) return;
      const added = await MDZ.toggleFavourite({ id: actKey, type: 'activite', nom: act.name, img: act.img });
      this.innerHTML = added ? '❤️' : '🤍';
      this.style.transform = 'scale(1.3)';
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