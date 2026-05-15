/* ══════════════════════════════════════════════════════════════
   PAYMENT_MODAL.JS — MountainDZ
   Add AFTER boutique_logic.js:
   <script src="payment_modal.js"></script>

   Features:
   ✅ Beautiful payment modal (Visa / CIB Dahbiya / CCP)
   ✅ Real card type detection (Visa, Mastercard, CIB)
   ✅ Luhn algorithm validation
   ✅ Expiry & CVV validation
   ✅ Card flip animation on CVV focus
   ✅ Animated card preview (live update)
   ✅ Saves order to MDZ after payment
   ✅ Success animation → opens Mes Commandes
══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   INJECT MODAL HTML + CSS once
───────────────────────────────────────── */
function _injectPaymentModal() {
  if (document.getElementById('paymentOverlay')) return;

  /* CSS */
  const style = document.createElement('style');
  style.textContent = `
    #paymentOverlay {
      position:fixed;inset:0;
      background:rgba(4,10,24,.82);
      backdrop-filter:blur(14px);
      -webkit-backdrop-filter:blur(14px);
      z-index:4000;
      display:none;
      align-items:center;
      justify-content:center;
      padding:16px;
    }
    #paymentOverlay.open { display:flex; }

    .pay-modal {
      background:linear-gradient(160deg,rgba(13,28,55,.98) 0%,rgba(8,16,34,.99) 100%);
      border:1px solid rgba(255,255,255,.12);
      border-radius:26px;
      width:min(520px,100%);
      max-height:94vh;
      overflow-y:auto;
      box-shadow:0 32px 100px rgba(0,0,0,.70);
      animation:paySlideUp .35s cubic-bezier(.34,1.56,.64,1);
      scrollbar-width:none;
    }
    .pay-modal::-webkit-scrollbar { display:none; }
    @keyframes paySlideUp {
      from { opacity:0; transform:translateY(40px) scale(.96); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }

    /* ── Header ── */
    .pay-header {
      padding:24px 28px 0;
      display:flex;
      align-items:center;
      justify-content:space-between;
    }
    .pay-header-left { display:flex; align-items:center; gap:12px; }
    .pay-header-icon {
      width:46px;height:46px;border-radius:14px;
      background:rgba(59,139,250,.15);
      border:1px solid rgba(59,139,250,.30);
      display:grid;place-items:center;font-size:1.4rem;flex-shrink:0;
    }
    .pay-header-title  { font-size:1.1rem;font-weight:800;color:#fff; }
    .pay-header-sub    { font-size:.80rem;color:rgba(255,255,255,.45);margin-top:2px; }
    .pay-close-btn {
      width:34px;height:34px;border-radius:50%;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      color:#fff;cursor:pointer;
      display:grid;place-items:center;font-size:1rem;
      flex-shrink:0;transition:background .2s;
    }
    .pay-close-btn:hover { background:rgba(255,255,255,.18); }

    /* ── Amount banner ── */
    .pay-amount-banner {
      margin:20px 28px 0;
      background:rgba(59,139,250,.10);
      border:1px solid rgba(59,139,250,.25);
      border-radius:14px;
      padding:14px 18px;
      display:flex;align-items:center;justify-content:space-between;
    }
    .pay-amount-label { font-size:.80rem;color:rgba(255,255,255,.50);font-weight:600; }
    .pay-amount-value { font-size:1.5rem;font-weight:800;color:#fff; }
    .pay-amount-items { font-size:.75rem;color:rgba(255,255,255,.35);margin-top:2px; }

    /* ── Method tabs ── */
    .pay-methods {
      display:flex;gap:8px;padding:20px 28px 0;
    }
    .pay-method-btn {
      flex:1;padding:11px 8px;border-radius:12px;
      border:1.5px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.05);
      color:rgba(255,255,255,.55);
      font-family:inherit;font-size:.82rem;font-weight:700;
      cursor:pointer;transition:all .22s;
      display:flex;flex-direction:column;align-items:center;gap:5px;
    }
    .pay-method-btn .pm-icon { font-size:1.3rem; }
    .pay-method-btn:hover { border-color:rgba(255,255,255,.30);color:#fff; }
    .pay-method-btn.active {
      background:rgba(59,139,250,.18);
      border-color:#3b8bfa;color:#fff;
      box-shadow:0 4px 18px rgba(59,139,250,.20);
    }
    .pay-method-btn.active.dahbiya {
      background:rgba(245,200,66,.14);
      border-color:#f5c842;
      box-shadow:0 4px 18px rgba(245,200,66,.18);
    }
    .pay-method-btn.active.ccp {
      background:rgba(46,168,79,.14);
      border-color:#2ea84f;
      box-shadow:0 4px 18px rgba(46,168,79,.18);
    }

    /* ── Card Preview ── */
    .pay-card-scene {
      margin:20px 28px 0;
      perspective:1000px;
    }
    .pay-card-flip {
      width:100%;height:180px;
      position:relative;
      transform-style:preserve-3d;
      transition:transform .6s cubic-bezier(.4,0,.2,1);
    }
    .pay-card-flip.flipped { transform:rotateY(180deg); }
    .pay-card-face, .pay-card-back {
      position:absolute;inset:0;border-radius:18px;
      backface-visibility:hidden;-webkit-backface-visibility:hidden;
      padding:22px 24px;
      display:flex;flex-direction:column;
    }
    .pay-card-face {
      background:linear-gradient(135deg,#1a3a6b 0%,#0d1f3c 60%,#162c52 100%);
      border:1px solid rgba(255,255,255,.15);
      box-shadow:0 12px 40px rgba(0,0,0,.50);
      justify-content:space-between;
    }
    .pay-card-face.visa-style {
      background:linear-gradient(135deg,#1a237e 0%,#1565c0 100%);
    }
    .pay-card-face.mastercard-style {
      background:linear-gradient(135deg,#b71c1c 0%,#c62828 60%,#4a148c 100%);
    }
    .pay-card-face.dahbiya-style {
      background:linear-gradient(135deg,#f9a825 0%,#e65100 60%,#b71c1c 100%);
    }
    .pay-card-face.ccp-style {
      background:linear-gradient(135deg,#1b5e20 0%,#2e7d32 100%);
    }
    .pay-card-back {
      background:linear-gradient(135deg,#1a237e 0%,#0d1f3c 100%);
      transform:rotateY(180deg);
      border:1px solid rgba(255,255,255,.10);
    }

    .pay-card-top    { display:flex;align-items:flex-start;justify-content:space-between; }
    .pay-card-chip   { width:38px;height:28px;border-radius:5px;background:linear-gradient(135deg,#ffd54f,#f9a825);opacity:.90; }
    .pay-card-network{ font-size:1.5rem;line-height:1; }
    .pay-card-number {
      font-size:1.18rem;font-weight:600;color:#fff;letter-spacing:.18em;
      font-family:'Courier New',monospace;text-align:center;
      text-shadow:0 1px 4px rgba(0,0,0,.40);
    }
    .pay-card-bottom { display:flex;justify-content:space-between;align-items:flex-end; }
    .pay-card-lbl    { font-size:.60rem;color:rgba(255,255,255,.50);margin-bottom:3px; letter-spacing:.08em;text-transform:uppercase; }
    .pay-card-val    { font-size:.88rem;color:#fff;font-weight:600;letter-spacing:.05em; }

    /* back */
    .pay-card-stripe {
      position:absolute;top:36px;left:0;right:0;height:44px;
      background:rgba(0,0,0,.65);
    }
    .pay-card-cvv-wrap {
      position:absolute;top:92px;right:24px;left:24px;
    }
    .pay-card-cvv-lbl { font-size:.62rem;color:rgba(255,255,255,.50);margin-bottom:4px; }
    .pay-card-cvv-box {
      background:#fff;border-radius:5px;height:36px;
      display:flex;align-items:center;padding:0 12px;
    }
    .pay-card-cvv-stars { color:#1a237e;font-family:'Courier New',monospace;font-size:1rem;letter-spacing:.2em; }
    .pay-card-back-logo {
      position:absolute;bottom:20px;right:24px;font-size:.72rem;
      color:rgba(255,255,255,.40);
    }

    /* ── Form ── */
    .pay-form { padding:20px 28px 28px; display:flex; flex-direction:column; gap:14px; }
    .pay-form-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
    .pay-fg { display:flex;flex-direction:column;gap:5px; }
    .pay-fg label {
      font-size:.75rem;font-weight:700;color:rgba(255,255,255,.55);
      letter-spacing:.04em;text-transform:uppercase;
    }
    .pay-fg input, .pay-fg select {
      padding:11px 14px;
      border:1.5px solid rgba(255,255,255,.14);
      border-radius:11px;
      background:rgba(255,255,255,.06);
      color:#fff;
      font-family:'Courier New',monospace;
      font-size:.96rem;
      outline:none;
      transition:border-color .2s, background .2s, box-shadow .2s;
    }
    .pay-fg input::placeholder { color:rgba(255,255,255,.25); font-family:inherit; }
    .pay-fg input:focus {
      border-color:#3b8bfa;
      background:rgba(255,255,255,.10);
      box-shadow:0 0 0 3px rgba(59,139,250,.15);
    }
    .pay-fg input.valid   { border-color:#2ea84f; }
    .pay-fg input.invalid { border-color:#e74c3c; }
    .pay-fg .pay-input-hint {
      font-size:.70rem;color:rgba(255,255,255,.30);margin-top:2px;
    }
    .pay-fg .pay-input-hint.err { color:#ff8a7a; }

    /* card network badge on number field */
    .pay-number-wrap { position:relative; }
    .pay-card-type-badge {
      position:absolute;right:12px;top:50%;transform:translateY(-50%);
      font-size:1.1rem;
    }
    .pay-number-wrap input { padding-right:44px; }

    /* ── CCP info block ── */
    .pay-ccp-info {
      background:rgba(46,168,79,.10);border:1px solid rgba(46,168,79,.25);
      border-radius:14px;padding:16px 18px;
      font-size:.85rem;color:rgba(255,255,255,.70);line-height:1.7;
    }
    .pay-ccp-info strong { color:#6ee89a; }
    .pay-ccp-rib {
      font-family:'Courier New',monospace;font-size:.88rem;
      background:rgba(0,0,0,.25);border-radius:8px;padding:8px 12px;
      color:#fff;letter-spacing:.08em;margin-top:8px;
    }

    /* ── Security badges ── */
    .pay-security {
      display:flex;align-items:center;justify-content:center;gap:16px;
      padding:0 28px 20px;flex-wrap:wrap;
    }
    .pay-sec-badge {
      display:flex;align-items:center;gap:5px;
      font-size:.72rem;color:rgba(255,255,255,.35);
    }

    /* ── Submit ── */
    .pay-submit-wrap { padding:0 28px 28px; }
    .pay-submit-btn {
      width:100%;padding:15px;
      background:linear-gradient(135deg,#2ea84f,#27ae60);
      border:none;border-radius:14px;
      color:#fff;font-size:1rem;font-weight:700;
      font-family:inherit;cursor:pointer;
      transition:opacity .2s,transform .18s;
      box-shadow:0 4px 22px rgba(46,168,79,.40);
      display:flex;align-items:center;justify-content:center;gap:10px;
    }
    .pay-submit-btn:hover { opacity:.90;transform:translateY(-2px); }
    .pay-submit-btn:disabled { opacity:.45;cursor:not-allowed;transform:none; }
    .pay-submit-btn.loading { pointer-events:none; }

    /* ── Success overlay ── */
    .pay-success {
      display:none;
      flex-direction:column;align-items:center;justify-content:center;
      padding:56px 28px;text-align:center;
    }
    .pay-success.show { display:flex; }
    .pay-success-ring {
      width:90px;height:90px;border-radius:50%;
      background:rgba(46,168,79,.15);border:3px solid #2ea84f;
      display:grid;place-items:center;font-size:2.5rem;
      margin-bottom:20px;
      animation:successPop .5s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes successPop {
      from{transform:scale(0) rotate(-30deg);opacity:0;}
      to  {transform:scale(1) rotate(0);opacity:1;}
    }
    .pay-success h3 { font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:10px; }
    .pay-success p  { font-size:.90rem;color:rgba(255,255,255,.55);line-height:1.6;max-width:320px; }
    .pay-success-id {
      font-family:'Courier New',monospace;
      background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
      border-radius:10px;padding:8px 16px;margin:14px 0;
      color:#7db8ff;font-size:.85rem;letter-spacing:.06em;
    }
  `;
  document.head.appendChild(style);

  /* HTML */
  const wrap = document.createElement('div');
  wrap.id        = 'paymentOverlay';
  wrap.innerHTML = `
  <div class="pay-modal" id="payModal" onclick="event.stopPropagation()">

    <!-- Success screen (hidden until paid) -->
    <div class="pay-success" id="paySuccess">
      <div class="pay-success-ring">✓</div>
      <h3>Paiement confirmé !</h3>
      <p>Votre commande a été enregistrée avec succès. Vous recevrez une confirmation bientôt.</p>
      <div class="pay-success-id" id="paySuccessId">CMD-XXXXXXXX</div>
      <p id="paySuccessDetail" style="font-size:.80rem;color:rgba(255,255,255,.40);"></p>
    </div>

    <!-- Form screen -->
    <div id="payForm">
      <!-- Header -->
      <div class="pay-header">
        <div class="pay-header-left">
          <div class="pay-header-icon">💳</div>
          <div>
            <div class="pay-header-title">Paiement sécurisé</div>
            <div class="pay-header-sub">Cryptage SSL 256-bit · MountainDZ</div>
          </div>
        </div>
        <button class="pay-close-btn" onclick="closePaymentModal()">✕</button>
      </div>

      <!-- Amount -->
      <div class="pay-amount-banner">
        <div>
          <div class="pay-amount-label">Montant total</div>
          <div class="pay-amount-items" id="payItemsLabel"></div>
        </div>
        <div class="pay-amount-value" id="payAmountValue">0 DA</div>
      </div>

      <!-- Payment methods -->
      <div class="pay-methods">
        <button class="pay-method-btn active visa" onclick="selectPayMethod('visa',this)">
          <span class="pm-icon">💳</span>Carte Visa
        </button>
        <button class="pay-method-btn dahbiya" onclick="selectPayMethod('dahbiya',this)">
          <span class="pm-icon">🟡</span>Carte Dahbiya
        </button>
        <button class="pay-method-btn ccp" onclick="selectPayMethod('ccp',this)">
          <span class="pm-icon">🏦</span>Virement CCP
        </button>
      </div>

      <!-- Card preview (hidden for CCP) -->
      <div class="pay-card-scene" id="payCardScene">
        <div class="pay-card-flip" id="payCardFlip">
          <!-- FRONT -->
          <div class="pay-card-face visa-style" id="payCardFront">
            <div class="pay-card-top">
              <div class="pay-card-chip"></div>
              <div class="pay-card-network" id="cardNetworkIcon">💳</div>
            </div>
            <div class="pay-card-number" id="cardNumberDisplay">•••• •••• •••• ••••</div>
            <div class="pay-card-bottom">
              <div>
                <div class="pay-card-lbl">Titulaire</div>
                <div class="pay-card-val" id="cardNameDisplay">VOTRE NOM</div>
              </div>
              <div>
                <div class="pay-card-lbl">Expire</div>
                <div class="pay-card-val" id="cardExpiryDisplay">MM/AA</div>
              </div>
            </div>
          </div>
          <!-- BACK -->
          <div class="pay-card-back">
            <div class="pay-card-stripe"></div>
            <div class="pay-card-cvv-wrap">
              <div class="pay-card-cvv-lbl">CVV</div>
              <div class="pay-card-cvv-box">
                <span class="pay-card-cvv-stars" id="cardCvvDisplay">•••</span>
              </div>
            </div>
            <div class="pay-card-back-logo" id="cardBackNetwork">VISA</div>
          </div>
        </div>
      </div>

      <!-- Card form -->
      <div class="pay-form" id="payCardForm">
        <div class="pay-fg">
          <label>Numéro de carte</label>
          <div class="pay-number-wrap">
            <input type="text" id="payCardNumber" maxlength="19"
              placeholder="0000 0000 0000 0000"
              oninput="onCardNumberInput(this)"
              autocomplete="cc-number"/>
            <span class="pay-card-type-badge" id="payCardTypeBadge">💳</span>
          </div>
          <span class="pay-input-hint" id="cardNumberHint"></span>
        </div>
        <div class="pay-fg">
          <label>Nom du titulaire</label>
          <input type="text" id="payCardName" maxlength="26"
            placeholder="PRENOM NOM"
            oninput="onCardNameInput(this)"
            style="font-family:inherit;text-transform:uppercase;"
            autocomplete="cc-name"/>
        </div>
        <div class="pay-form-row">
          <div class="pay-fg">
            <label>Date d'expiration</label>
            <input type="text" id="payCardExpiry" maxlength="5"
              placeholder="MM/AA"
              oninput="onCardExpiryInput(this)"
              autocomplete="cc-exp"/>
            <span class="pay-input-hint" id="cardExpiryHint"></span>
          </div>
          <div class="pay-fg">
            <label>CVV / CVC</label>
            <input type="text" id="payCardCvv" maxlength="4"
              placeholder="•••"
              oninput="onCardCvvInput(this)"
              onfocus="flipCard(true)"
              onblur="flipCard(false)"
              autocomplete="cc-csc"/>
            <span class="pay-input-hint" id="cardCvvHint"></span>
          </div>
        </div>
      </div>

      <!-- CCP info (hidden by default) -->
      <div class="pay-form" id="payCcpForm" style="display:none;">
        <div class="pay-ccp-info">
          <strong>📋 Virement CCP Algérie</strong><br>
          Effectuez un virement postal vers le compte MountainDZ.
          Votre commande sera confirmée dès réception du virement (24–48h).
          <div class="pay-ccp-rib">CCP : 0010 0456 7890 1234 12</div>
          <div style="margin-top:8px;font-size:.78rem;color:rgba(255,255,255,.40);">
            Indiquez votre numéro de commande dans la référence du virement.
          </div>
        </div>
        <div class="pay-fg">
          <label>Nom complet (confirmé)</label>
          <input type="text" id="payCcpName" placeholder="Votre nom complet"
            style="font-family:inherit;" oninput="validateCcpForm()"/>
        </div>
        <div class="pay-fg">
          <label>Numéro de compte CCP (optionnel)</label>
          <input type="text" id="payCcpNum" placeholder="Ex: 0001 2345 6789"
            oninput="validateCcpForm()"/>
        </div>
      </div>

      <!-- Security -->
      <div class="pay-security">
        <span class="pay-sec-badge">🔒 SSL 256-bit</span>
        <span class="pay-sec-badge">🛡️ 3D Secure</span>
        <span class="pay-sec-badge">✅ PCI DSS</span>
        <span class="pay-sec-badge">🇩🇿 Satim certifié</span>
      </div>

      <!-- Submit -->
      <div class="pay-submit-wrap">
        <button class="pay-submit-btn" id="paySubmitBtn" onclick="processPayment()">
          🔒 Payer <span id="paySubmitAmount"></span>
        </button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(wrap);

  wrap.addEventListener('click', e => { if(e.target===wrap) closePaymentModal(); });
}

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let _payMethod   = 'visa';
let _payCart     = [];
let _payTotal    = 0;
let _payCallback = null;

/* ─────────────────────────────────────────
   OPEN / CLOSE
───────────────────────────────────────── */
function openPaymentModal(cartItems, totalAmount, onSuccess) {
  _injectPaymentModal();
  _payCart     = cartItems || [];
  _payTotal    = totalAmount || 0;
  _payCallback = onSuccess || null;

  // Reset UI
  document.getElementById('paySuccess').classList.remove('show');
  document.getElementById('payForm').style.display = '';
  _payMethod = 'visa';
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.pay-method-btn.visa')?.classList.add('active');
  _showMethodForm('visa');
  _resetCardPreview();
  _clearInputs();

  // Set amount
  const fmtAmt = _payTotal.toLocaleString('fr-DZ') + ' DA';
  document.getElementById('payAmountValue').textContent  = fmtAmt;
  document.getElementById('paySubmitAmount').textContent = fmtAmt;
  document.getElementById('payItemsLabel').textContent   =
    _payCart.length + ' article' + (_payCart.length > 1 ? 's' : '');

  document.getElementById('paymentOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Auto-fill name from logged-in user
  const user = typeof MDZ !== 'undefined' ? MDZ.getUser() : null;
  if (user && user.prenom) {
    const nameInput = document.getElementById('payCardName');
    if (nameInput) {
      nameInput.value = (user.prenom + ' ' + (user.nom||'')).toUpperCase().trim();
      document.getElementById('cardNameDisplay').textContent = nameInput.value || 'VOTRE NOM';
    }
  }
}

function closePaymentModal() {
  const el = document.getElementById('paymentOverlay');
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ─────────────────────────────────────────
   METHOD SELECTION
───────────────────────────────────────── */
function selectPayMethod(method, btn) {
  _payMethod = method;
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _showMethodForm(method);
}

function _showMethodForm(method) {
  const cardScene = document.getElementById('payCardScene');
  const cardForm  = document.getElementById('payCardForm');
  const ccpForm   = document.getElementById('payCcpForm');
  const front     = document.getElementById('payCardFront');

  if (method === 'ccp') {
    cardScene.style.display = 'none';
    cardForm.style.display  = 'none';
    ccpForm.style.display   = '';
  } else {
    cardScene.style.display = '';
    cardForm.style.display  = '';
    ccpForm.style.display   = 'none';
    // Style card face for method
    front.className = 'pay-card-face ' + (method === 'dahbiya' ? 'dahbiya-style' : 'visa-style');
    document.getElementById('cardNetworkIcon').textContent =
      method === 'dahbiya' ? '🟡' : '💳';
    document.getElementById('cardBackNetwork').textContent =
      method === 'dahbiya' ? 'CIB' : 'VISA';
  }
  validateForm();
}

/* ─────────────────────────────────────────
   CARD NUMBER INPUT  (format + Luhn)
───────────────────────────────────────── */
function onCardNumberInput(input) {
  let raw = input.value.replace(/\D/g,'').slice(0,16);
  // Format in groups of 4
  input.value = raw.replace(/(.{4})/g,'$1 ').trim();

  // Display on card
  const display = raw.padEnd(16,'•').replace(/(.{4})/g,'$1 ').trim();
  document.getElementById('cardNumberDisplay').textContent = display;

  // Detect card type
  const type = _detectCardType(raw);
  _updateCardTypeUI(type, input);

  // Validate
  const hint = document.getElementById('cardNumberHint');
  if (raw.length === 16) {
    if (_luhn(raw)) {
      input.className = 'valid';
      hint.textContent = '✓ Numéro valide';
      hint.className   = 'pay-input-hint';
    } else {
      input.className = 'invalid';
      hint.textContent = '✗ Numéro invalide';
      hint.className   = 'pay-input-hint err';
    }
  } else {
    input.className  = '';
    hint.textContent = raw.length > 0 ? `${raw.length}/16 chiffres` : '';
    hint.className   = 'pay-input-hint';
  }
  validateForm();
}

function _detectCardType(num) {
  if (/^4/.test(num))                    return 'visa';
  if (/^5[1-5]/.test(num))              return 'mastercard';
  if (/^6/.test(num))                   return 'cib';   // CIB / Dahbiya starts with 6
  if (/^3[47]/.test(num))               return 'amex';
  return 'unknown';
}

function _updateCardTypeUI(type, input) {
  const icons = {
    visa:'💳', mastercard:'🔵', cib:'🟡', amex:'🟩', unknown:'💳'
  };
  const networkText = {
    visa:'VISA', mastercard:'MC', cib:'CIB', amex:'AMEX', unknown:''
  };
  document.getElementById('payCardTypeBadge').textContent     = icons[type]   || '💳';
  document.getElementById('cardNetworkIcon').textContent      = icons[type]   || '💳';
  document.getElementById('cardBackNetwork').textContent      = networkText[type] || '';

  // Update card face style
  const front = document.getElementById('payCardFront');
  front.className = 'pay-card-face ' +
    (type==='cib'        ? 'dahbiya-style' :
     type==='mastercard' ? 'mastercard-style' :
                           'visa-style');
}

/* Luhn algorithm */
function _luhn(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/* ─────────────────────────────────────────
   NAME INPUT
───────────────────────────────────────── */
function onCardNameInput(input) {
  input.value = input.value.toUpperCase();
  const display = document.getElementById('cardNameDisplay');
  display.textContent = input.value || 'VOTRE NOM';
  validateForm();
}

/* ─────────────────────────────────────────
   EXPIRY INPUT
───────────────────────────────────────── */
function onCardExpiryInput(input) {
  let raw = input.value.replace(/\D/g,'');
  if (raw.length >= 3) raw = raw.slice(0,2) + '/' + raw.slice(2,4);
  input.value = raw;

  document.getElementById('cardExpiryDisplay').textContent = raw || 'MM/AA';

  const hint = document.getElementById('cardExpiryHint');
  if (raw.length === 5) {
    const [mm, yy] = raw.split('/');
    const now  = new Date();
    const expM = parseInt(mm);
    const expY = 2000 + parseInt(yy);
    if (expM < 1 || expM > 12) {
      input.className = 'invalid';
      hint.textContent = '✗ Mois invalide'; hint.className = 'pay-input-hint err';
    } else if (expY < now.getFullYear() || (expY === now.getFullYear() && expM < now.getMonth()+1)) {
      input.className = 'invalid';
      hint.textContent = '✗ Carte expirée'; hint.className = 'pay-input-hint err';
    } else {
      input.className = 'valid';
      hint.textContent = '✓ Date valide'; hint.className = 'pay-input-hint';
    }
  } else {
    input.className  = '';
    hint.textContent = '';
  }
  validateForm();
}

/* ─────────────────────────────────────────
   CVV INPUT + CARD FLIP
───────────────────────────────────────── */
function onCardCvvInput(input) {
  const raw = input.value.replace(/\D/g,'');
  input.value = raw;
  document.getElementById('cardCvvDisplay').textContent = '•'.repeat(raw.length) || '•••';

  const hint = document.getElementById('cardCvvHint');
  const len  = raw.length;
  if (len >= 3) {
    input.className = 'valid';
    hint.textContent = '✓'; hint.className = 'pay-input-hint';
  } else if (len > 0) {
    input.className  = '';
    hint.textContent = `${len}/3`; hint.className = 'pay-input-hint';
  } else {
    input.className  = '';
    hint.textContent = '';
  }
  validateForm();
}

function flipCard(toBack) {
  const flip = document.getElementById('payCardFlip');
  if (flip) flip.classList.toggle('flipped', toBack);
}

/* ─────────────────────────────────────────
   VALIDATE FORM → enable/disable submit
───────────────────────────────────────── */
function validateForm() {
  const btn = document.getElementById('paySubmitBtn');
  if (!btn) return;
  let ok = false;

  if (_payMethod === 'ccp') {
    const name = document.getElementById('payCcpName')?.value.trim();
    ok = name && name.length >= 3;
  } else {
    const num    = document.getElementById('payCardNumber')?.value.replace(/\s/g,'') || '';
    const name   = document.getElementById('payCardName')?.value.trim()  || '';
    const expiry = document.getElementById('payCardExpiry')?.value        || '';
    const cvv    = document.getElementById('payCardCvv')?.value           || '';
    ok = num.length === 16 && _luhn(num) &&
         name.length >= 2  &&
         expiry.length === 5 &&
         document.getElementById('payCardExpiry')?.className === 'valid' &&
         cvv.length >= 3;
  }
  btn.disabled = !ok;
}

function validateCcpForm() { validateForm(); }

/* ─────────────────────────────────────────
   PROCESS PAYMENT
───────────────────────────────────────── */
function processPayment() {
  const btn = document.getElementById('paySubmitBtn');
  if (!btn || btn.disabled) return;

  // Simulate processing
  btn.disabled  = true;
  btn.classList.add('loading');
  btn.innerHTML = '<span style="animation:spin .8s linear infinite;display:inline-block">⏳</span> Traitement en cours…';

  if (!document.getElementById('mdzSpinStyle')) {
    const s = document.createElement('style');
    s.id = 'mdzSpinStyle';
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  setTimeout(async () => {
    // Save order
    let orderId = 'CMD-' + Date.now();
    if (typeof MDZ !== 'undefined') {
      const user = MDZ.getUser();
      const articles = _payCart.map(item => ({
        nom  : item.product?.name || item.nom || 'Article',
        img  : item.product?.img  || item.img || '',
        taille: item.size || '',
        qte  : item.qty  || 1,
        mode : item.isRent ? 'location' : 'achat',
        prix : item.isRent
          ? (typeof getRentTotal === 'function'
              ? getRentTotal(item.product, item.rentDays) * item.qty
              : 0).toLocaleString('fr-DZ') + ' DA'
          : ((item.product?.price || 0) * (item.qty||1)).toLocaleString('fr-DZ') + ' DA'
      }));

      const methodLabels = { visa:'Carte Visa', dahbiya:'Carte Dahbiya (CIB)', ccp:'Virement CCP' };
      const order = await MDZ.addOrder({
        utilisateur    : user ? user.email : 'invité',
        articles,
        total          : _payTotal.toLocaleString('fr-DZ') + ' DA',
        methodePaiement: methodLabels[_payMethod] || _payMethod,
        statut         : 'Confirmée'
      });
      orderId = order.id;
    }

    // Show success
    document.getElementById('payForm').style.display = 'none';
    document.getElementById('paySuccessId').textContent = orderId;
    document.getElementById('paySuccessDetail').textContent =
      'Méthode : ' + (_payMethod === 'ccp' ? 'Virement CCP' :
                      _payMethod === 'dahbiya' ? 'Carte Dahbiya' : 'Carte Visa') +
      ' · ' + _payTotal.toLocaleString('fr-DZ') + ' DA';
    document.getElementById('paySuccess').classList.add('show');

    // Call the onSuccess callback (clears cart etc.)
    if (typeof _payCallback === 'function') _payCallback(orderId);

    // Auto-close + open dashboard after 2.8s
    setTimeout(() => {
      closePaymentModal();
      if (typeof openAccountDashboard === 'function')
        openAccountDashboard('commandes');
    }, 2800);

  }, 2000); // 2 second "processing" simulation
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function _resetCardPreview() {
  document.getElementById('cardNumberDisplay').textContent = '•••• •••• •••• ••••';
  document.getElementById('cardNameDisplay').textContent   = 'VOTRE NOM';
  document.getElementById('cardExpiryDisplay').textContent = 'MM/AA';
  document.getElementById('cardCvvDisplay').textContent    = '•••';
  document.getElementById('cardNetworkIcon').textContent   = '💳';
  document.getElementById('payCardFlip')?.classList.remove('flipped');
  const front = document.getElementById('payCardFront');
  if (front) front.className = 'pay-card-face visa-style';
}

function _clearInputs() {
  ['payCardNumber','payCardName','payCardExpiry','payCardCvv','payCcpName','payCcpNum']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.className = ''; }
    });
  ['cardNumberHint','cardExpiryHint','cardCvvHint'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.className = 'pay-input-hint'; }
  });
  const btn = document.getElementById('paySubmitBtn');
  if (btn) {
    btn.disabled  = true;
    btn.classList.remove('loading');
    btn.innerHTML = '🔒 Payer <span id="paySubmitAmount">' + _payTotal.toLocaleString('fr-DZ') + ' DA</span>';
  }
}

/* ─────────────────────────────────────────
   PATCH checkout() in boutique_logic.js
   Replace the cart checkout with payment modal
───────────────────────────────────────── */
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

};
