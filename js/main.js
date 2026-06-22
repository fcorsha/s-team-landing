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

/* --- Header scroll --- */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

/* --- Fade-in (Intersection Observer) --- */
(function () {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  els.forEach(function(el) { io.observe(el); });
})();

/* --- Counter animation --- */
(function () {
  var counters = document.querySelectorAll('.count-num');
  if (!counters.length) return;

  function animateCount(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1400;
    var start    = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      /* ease-out cubic */
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el) { io.observe(el); });
})();

/* --- Smooth scroll for anchors (offset for fixed header) --- */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var headerH = (document.querySelector('.site-header') || { offsetHeight: 0 }).offsetHeight;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});
