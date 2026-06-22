/* accessibility.js */
(function () {

  /* --- Text size --- */
  var sizes   = ['', 'text-lg', 'text-xl'];
  var current = 0;
  var savedSize = localStorage.getItem('a11y-text-size');
  if (savedSize && sizes.indexOf(savedSize) > -1) {
    current = sizes.indexOf(savedSize);
    if (savedSize) document.body.classList.add(savedSize);
  }

  var textBtn = document.getElementById('a11y-text-btn');
  if (textBtn) {
    if (sizes[current]) textBtn.classList.add('active');
    textBtn.addEventListener('click', function () {
      if (sizes[current]) document.body.classList.remove(sizes[current]);
      current = (current + 1) % sizes.length;
      if (sizes[current]) document.body.classList.add(sizes[current]);
      localStorage.setItem('a11y-text-size', sizes[current] || '');
      textBtn.classList.toggle('active', !!sizes[current]);
    });
  }

  /* --- High contrast --- */
  var contrastBtn = document.getElementById('a11y-contrast-btn');
  var contrastOn  = localStorage.getItem('a11y-contrast') === '1';
  if (contrastOn) document.body.classList.add('high-contrast');
  if (contrastBtn) {
    if (contrastOn) contrastBtn.classList.add('active');
    contrastBtn.addEventListener('click', function () {
      contrastOn = !contrastOn;
      document.body.classList.toggle('high-contrast', contrastOn);
      localStorage.setItem('a11y-contrast', contrastOn ? '1' : '');
      contrastBtn.classList.toggle('active', contrastOn);
    });
  }

  /* --- No animations --- */
  var animBtn = document.getElementById('a11y-anim-btn');
  var animOff = localStorage.getItem('a11y-no-anim') === '1';
  if (animOff) document.body.classList.add('no-animations');
  if (animBtn) {
    if (animOff) animBtn.classList.add('active');
    animBtn.addEventListener('click', function () {
      animOff = !animOff;
      document.body.classList.toggle('no-animations', animOff);
      localStorage.setItem('a11y-no-anim', animOff ? '1' : '');
      animBtn.classList.toggle('active', animOff);
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
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
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
      if (e.key === 'Escape') document.getElementById('cookie-decline').click();
    });
  }

})();
