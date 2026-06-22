/* accessibility.js */
(function () {

  var SIZES       = ['', '112%', '125%'];
  var SIZE_LABELS = ['רגיל', 'גדול', 'ענק'];
  var current     = 0;

  function applyTextSize(idx) {
    document.documentElement.style.fontSize = SIZES[idx] || '';
    localStorage.setItem('a11y-text-size', idx);
    var btn = document.getElementById('a11y-text-btn');
    if (btn) {
      var lbl = btn.querySelector('.a11y-option-label');
      if (lbl) lbl.textContent = 'גודל טקסט: ' + SIZE_LABELS[idx];
      btn.setAttribute('aria-label', 'גודל טקסט: ' + SIZE_LABELS[idx] + ' — לחץ לשינוי');
      btn.classList.toggle('active', idx > 0);
    }
  }

  var savedIdx = parseInt(localStorage.getItem('a11y-text-size'), 10);
  if (!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < SIZES.length) {
    current = savedIdx;
  }
  applyTextSize(current);

  var textBtn = document.getElementById('a11y-text-btn');
  if (textBtn) {
    textBtn.addEventListener('click', function () {
      current = (current + 1) % SIZES.length;
      applyTextSize(current);
    });
  }

  /* --- High contrast --- */
  var contrastOn = localStorage.getItem('a11y-contrast') === '1';
  if (contrastOn) document.body.classList.add('high-contrast');

  var contrastBtn = document.getElementById('a11y-contrast-btn');
  if (contrastBtn) {
    contrastBtn.classList.toggle('active', contrastOn);
    contrastBtn.setAttribute('aria-pressed', contrastOn ? 'true' : 'false');
    contrastBtn.addEventListener('click', function () {
      contrastOn = !contrastOn;
      document.body.classList.toggle('high-contrast', contrastOn);
      localStorage.setItem('a11y-contrast', contrastOn ? '1' : '');
      contrastBtn.classList.toggle('active', contrastOn);
      contrastBtn.setAttribute('aria-pressed', contrastOn ? 'true' : 'false');
    });
  }

  /* --- No animations --- */
  var animOff = localStorage.getItem('a11y-no-anim') === '1';
  if (animOff) document.body.classList.add('no-animations');

  var animBtn = document.getElementById('a11y-anim-btn');
  if (animBtn) {
    animBtn.classList.toggle('active', animOff);
    animBtn.setAttribute('aria-pressed', animOff ? 'true' : 'false');
    animBtn.addEventListener('click', function () {
      animOff = !animOff;
      document.body.classList.toggle('no-animations', animOff);
      localStorage.setItem('a11y-no-anim', animOff ? '1' : '');
      animBtn.classList.toggle('active', animOff);
      animBtn.setAttribute('aria-pressed', animOff ? 'true' : 'false');
    });
  }

  /* --- Panel toggle --- */
  var toggleBtn = document.getElementById('a11y-toggle-btn');
  var panel     = document.getElementById('a11y-panel');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (!isOpen) {
        var firstOption = panel.querySelector('.a11y-option');
        if (firstOption) firstOption.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }
      if (!panel.hidden) {
        var opts = Array.from(panel.querySelectorAll('.a11y-option[id]'));
        var focused = document.activeElement;
        var idx = opts.indexOf(focused);
        if (e.key === 'ArrowDown' || e.key === 'Tab' && !e.shiftKey) {
          if (idx >= 0 && idx < opts.length - 1) { e.preventDefault(); opts[idx + 1].focus(); }
        }
        if (e.key === 'ArrowUp' || e.key === 'Tab' && e.shiftKey) {
          if (idx > 0) { e.preventDefault(); opts[idx - 1].focus(); }
        }
      }
    });

    document.addEventListener('click', function (e) {
      var widget = document.getElementById('a11y-widget');
      if (!panel.hidden && widget && !widget.contains(e.target)) {
        panel.hidden = true;
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Cookie banner Escape --- */
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var dec = document.getElementById('cookie-decline');
        if (dec) dec.click();
      }
    });
  }

  /* --- Reset button --- */
  var resetBtn = document.getElementById('a11y-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      current = 0;
      applyTextSize(0);
      contrastOn = false;
      document.body.classList.remove('high-contrast');
      localStorage.removeItem('a11y-contrast');
      if (contrastBtn) { contrastBtn.classList.remove('active'); contrastBtn.setAttribute('aria-pressed', 'false'); }
      animOff = false;
      document.body.classList.remove('no-animations');
      localStorage.removeItem('a11y-no-anim');
      if (animBtn) { animBtn.classList.remove('active'); animBtn.setAttribute('aria-pressed', 'false'); }
    });
  }

})();
