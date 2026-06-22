/* main.js */

/* --- Cookie banner --- */
(function () {
  var banner = document.getElementById('cookie-banner');
  var ok     = document.getElementById('cookie-accept');
  var no     = document.getElementById('cookie-decline');
  if (!banner) return;
  if (localStorage.getItem('cookie-consent')) { banner.classList.add('hidden'); return; }
  function close(v) { localStorage.setItem('cookie-consent', v); banner.classList.add('hidden'); }
  ok.addEventListener('click', function(){ close('accepted'); });
  no.addEventListener('click', function(){ close('declined'); });
})();

/* --- Header scroll effect --- */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* --- Fade-in on scroll (Intersection Observer) --- */
(function () {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { io.observe(el); });
})();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var offset = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});
