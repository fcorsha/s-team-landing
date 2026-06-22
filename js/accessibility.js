/* accessibility.js */
(function () {
  var sizes   = ['', 'text-lg', 'text-xl'];
  var current = 0;
  var saved   = localStorage.getItem('a11y-text-size');
  if (saved && sizes.indexOf(saved) > -1) {
    current = sizes.indexOf(saved);
    if (saved) document.body.classList.add(saved);
  }

  var btn = document.getElementById('a11y-text-btn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    if (sizes[current]) document.body.classList.remove(sizes[current]);
    current = (current + 1) % sizes.length;
    if (sizes[current]) document.body.classList.add(sizes[current]);
    localStorage.setItem('a11y-text-size', sizes[current] || '');
  });

  /* cookie banner keyboard trap */
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') document.getElementById('cookie-decline').click();
    });
  }
})();
