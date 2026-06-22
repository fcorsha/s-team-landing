/* main.js · לוגיקה כללית */

/* --- באנר עוגיות --- */
(function () {
  const banner  = document.getElementById('cookie-banner');
  const btnOk   = document.getElementById('cookie-accept');
  const btnNo   = document.getElementById('cookie-decline');

  if (!banner) return;

  // אם כבר הסכים – מסתיר מיד
  if (localStorage.getItem('cookie-consent')) {
    banner.classList.add('hidden');
    return;
  }

  function closeBanner(val) {
    localStorage.setItem('cookie-consent', val);
    banner.classList.add('hidden');
  }

  btnOk.addEventListener('click', () => closeBanner('accepted'));
  btnNo.addEventListener('click', () => closeBanner('declined'));
})();


/* --- ניווט חלק לכפתור CTA בהירו --- */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // העברת פוקוס לאחר גלילה (נגישות)
    setTimeout(function () { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }, 600);
  });
});
