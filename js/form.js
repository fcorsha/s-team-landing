/* form.js · ולידציה ושליחת טופס מועמדות */

/* ===== URL של Make Webhook ===== */
/* להחליף בURL האמיתי אחרי יצירת התרחיש ב-Make */
var WEBHOOK_URL = 'REPLACE_WITH_MAKE_WEBHOOK_URL';

/* URL ברירת מחדל לוואטסאפ אם ה-webhook לא מחזיר אחד */
var WA_FALLBACK  = 'https://wa.me/972504999444?text=%D7%94%D7%99%D7%99%20%D7%9E%D7%99%D7%A7%D7%99%2C%20%D7%9E%D7%99%D7%9C%D7%90%D7%AA%D7%99%20%D7%98%D7%95%D7%A4%D7%A1%20%D7%91%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%92%D7%99%D7%A9%20%D7%9E%D7%95%D7%A2%D7%9E%D7%93%D7%95%D7%AA%20%D7%9C%D7%9E%D7%90%D7%91%D7%98%D7%97';

(function () {
  var form      = document.getElementById('application-form');
  var submitBtn = document.getElementById('submit-btn');
  var successEl = document.getElementById('form-success-msg');
  var errorEl   = document.getElementById('form-error-msg');

  if (!form) return;

  /* --- ולידציה --- */
  function validateField(id, check, errMsg) {
    var el  = document.getElementById(id);
    var err = document.getElementById(id + '-error');
    if (!el) return true;
    var ok = check(el);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.textContent = ok ? '' : errMsg;
    return ok;
  }

  function validate() {
    var ok = true;
    ok = validateField('name',    function(e){ return e.value.trim().length >= 2; },       'נא להזין שם מלא') && ok;
    ok = validateField('phone',   function(e){ return /^[0-9\-\+\s]{9,15}$/.test(e.value.trim()); }, 'נא להזין מספר טלפון תקין') && ok;
    ok = validateField('age',     function(e){ var n = parseInt(e.value,10); return !isNaN(n) && n >= 21 && n <= 60; }, 'גיל חייב להיות בין 21 ל-60') && ok;
    ok = validateField('region',  function(e){ return e.value !== ''; },                   'נא לבחור אזור מגורים') && ok;
    ok = validateField('consent', function(e){ return e.checked; },                        'נדרשת הסכמה לקבלת יצירת קשר') && ok;
    return ok;
  }

  /* ולידציה בזמן אמת (blur) */
  ['name','phone','age','region','consent'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', validate);
    if (el && el.type !== 'checkbox' && el.type !== 'select-one') {
      el.addEventListener('blur', validate);
    }
  });

  /* --- שליחה --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = {
      name:           document.getElementById('name').value.trim(),
      phone:          document.getElementById('phone').value.trim(),
      age:            parseInt(document.getElementById('age').value, 10),
      region:         document.getElementById('region').value,
      experience:     document.getElementById('experience').value,
      weapon_license: document.getElementById('weapon_license').checked,
      timestamp:      new Date().toISOString()
    };

    /* --- UI: מצב טעינה --- */
    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').hidden = true;
    submitBtn.querySelector('.submit-loading').hidden = false;
    errorEl.hidden = true;

    /* אם עוד אין webhook URL אמיתי — מדלגים ישירות לוואטסאפ */
    if (WEBHOOK_URL === 'REPLACE_WITH_MAKE_WEBHOOK_URL') {
      handleSuccess(WA_FALLBACK);
      return;
    }

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function(res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function(json) {
        /* Make יחזיר { whatsapp_url: "..." } */
        var waUrl = (json && json.whatsapp_url) ? json.whatsapp_url : WA_FALLBACK;
        handleSuccess(waUrl);
      })
      .catch(function() {
        /* במקרה של שגיאה — עדיין מפנים לוואטסאפ */
        handleSuccess(WA_FALLBACK);
      });
  });

  function handleSuccess(waUrl) {
    form.querySelectorAll('input,select,button').forEach(function(el){ el.disabled = true; });
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function() { window.location.href = waUrl; }, 2200);
  }

})();
