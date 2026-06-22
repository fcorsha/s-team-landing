/* form.js · Make webhook + WhatsApp redirect */

var WEBHOOK_URL = 'https://hook.eu1.make.com/4pb3mm85r29ve3az7ij3cuws0j7dtbrk';
var WA_URL      = 'https://wa.me/972504999444?text=%D7%94%D7%99%D7%99%20%D7%9E%D7%99%D7%A7%D7%99%2C%20%D7%9E%D7%99%D7%9C%D7%90%D7%AA%D7%99%20%D7%98%D7%95%D7%A4%D7%A1%20%D7%95%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%92%D7%99%D7%A9%20%D7%9E%D7%95%D7%A2%D7%9E%D7%93%D7%95%D7%AA';

/* ---- ולידציה ---- */
function validatePhone(v) { return /^[0-9\-\+\s]{9,15}$/.test(v.trim()); }
function validateAge(v)   { var n = parseInt(v, 10); return !isNaN(n) && n >= 21 && n <= 60; }

/* ---- שליחה כללית ---- */
function submitToMake(data, onSuccess, onError) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(function(r) { return r.ok ? r.json().catch(function(){ return {}; }) : Promise.reject(r.status); })
    .then(function(json) { onSuccess(json && json.whatsapp_url ? json.whatsapp_url : WA_URL); })
    .catch(function()   { onSuccess(WA_URL); }); /* גם בשגיאה — שולחים לוואטסאפ */
}

function redirectToWA(url) {
  setTimeout(function() { window.location.href = url; }, 1800);
}

/* ============================================
   טופס Hero מהיר
   ============================================ */
(function () {
  var form      = document.getElementById('hero-application-form');
  var submitBtn = document.getElementById('hf-submit');
  var successEl = document.getElementById('hf-success');
  var errorEl   = document.getElementById('hf-error-msg');
  if (!form) return;

  function setErr(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
    var input = document.getElementById(id.replace('-error', ''));
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    var ok = true;
    var name    = document.getElementById('hf-name').value.trim();
    var phone   = document.getElementById('hf-phone').value.trim();
    var region  = document.getElementById('hf-region').value;
    var consent = document.getElementById('hf-consent').checked;

    setErr('hf-name-error',    name.length < 2          ? 'נא להזין שם מלא'          : ''); if (name.length < 2)          ok = false;
    setErr('hf-phone-error',   !validatePhone(phone)    ? 'נא להזין מספר תקין'        : ''); if (!validatePhone(phone))    ok = false;
    setErr('hf-region-error',  !region                  ? 'נא לבחור אזור'             : ''); if (!region)                  ok = false;
    setErr('hf-consent-error', !consent                 ? 'נדרשת הסכמה'               : ''); if (!consent)                 ok = false;
    return ok;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.hf-submit-text').hidden = true;
    submitBtn.querySelector('.hf-submit-loading').hidden = false;
    errorEl.hidden = true;

    var data = {
      name:      document.getElementById('hf-name').value.trim(),
      phone:     document.getElementById('hf-phone').value.trim(),
      region:    document.getElementById('hf-region').value,
      experience:'אין',
      weapon_license: false,
      source:    'hero-form',
      timestamp: new Date().toISOString()
    };

    submitToMake(data, function(waUrl) {
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      redirectToWA(waUrl);
    });
  });
})();

/* ============================================
   טופס מפורט
   ============================================ */
(function () {
  var form      = document.getElementById('full-application-form');
  var submitBtn = document.getElementById('ff-submit');
  var successEl = document.getElementById('ff-success');
  var errorEl   = document.getElementById('ff-error-msg');
  if (!form) return;

  function setErr(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
    var input = document.getElementById(id.replace('-error', ''));
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    var ok = true;
    var name    = document.getElementById('ff-name').value.trim();
    var phone   = document.getElementById('ff-phone').value.trim();
    var age     = document.getElementById('ff-age').value;
    var region  = document.getElementById('ff-region').value;
    var consent = document.getElementById('ff-consent').checked;

    setErr('ff-name-error',    name.length < 2        ? 'נא להזין שם מלא'       : ''); if (name.length < 2)        ok = false;
    setErr('ff-phone-error',   !validatePhone(phone)  ? 'נא להזין מספר תקין'     : ''); if (!validatePhone(phone))  ok = false;
    setErr('ff-age-error',     !validateAge(age)      ? 'גיל חייב להיות 21–60'   : ''); if (!validateAge(age))      ok = false;
    setErr('ff-region-error',  !region                ? 'נא לבחור אזור'          : ''); if (!region)                ok = false;
    setErr('ff-consent-error', !consent               ? 'נדרשת הסכמה'            : ''); if (!consent)               ok = false;
    return ok;
  }

  /* ולידציה בזמן אמת */
  ['ff-name','ff-phone','ff-age','ff-region','ff-consent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',   validate);
    el.addEventListener('change', validate);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.ff-submit-text').hidden = true;
    submitBtn.querySelector('.ff-submit-loading').hidden = false;
    errorEl.hidden = true;

    var data = {
      name:           document.getElementById('ff-name').value.trim(),
      phone:          document.getElementById('ff-phone').value.trim(),
      age:            parseInt(document.getElementById('ff-age').value, 10),
      region:         document.getElementById('ff-region').value,
      experience:     document.getElementById('ff-experience').value,
      weapon_license: document.getElementById('ff-weapon').checked,
      source:         'full-form',
      timestamp:      new Date().toISOString()
    };

    submitToMake(data, function(waUrl) {
      form.querySelectorAll('input,select,button').forEach(function(el){ el.disabled = true; });
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      redirectToWA(waUrl);
    });
  });
})();
