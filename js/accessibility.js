/* accessibility.js · כפתור הגדלת טקסט + עזרי נגישות */

(function () {
  /* --- הגדלת טקסט --- */
  var sizes   = ['', 'text-lg', 'text-xl'];
  var current = 0;
  var saved   = localStorage.getItem('a11y-text-size');
  if (saved && sizes.indexOf(saved) > -1) {
    current = sizes.indexOf(saved);
    document.body.classList.add(saved);
  }

  /* יוצר כפתור הגדלה קבוע */
  var btn = document.createElement('button');
  btn.setAttribute('aria-label', 'הגדלת גודל טקסט');
  btn.setAttribute('title', 'הגדלת גודל טקסט');
  btn.className = 'a11y-text-btn';
  btn.innerHTML = '<span aria-hidden="true">A+</span>';
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    if (sizes[current]) document.body.classList.remove(sizes[current]);
    current = (current + 1) % sizes.length;
    if (sizes[current]) document.body.classList.add(sizes[current]);
    localStorage.setItem('a11y-text-size', sizes[current] || '');
  });

  /* סגנון כפתור (מינימלי, ללא תלות ב-CSS חיצוני) */
  var style = document.createElement('style');
  style.textContent = '.a11y-text-btn{position:fixed;top:50%;left:0;transform:translateY(-50%);z-index:8000;background:#1A3A5C;color:#fff;border:none;border-radius:0 6px 6px 0;padding:10px 8px;font-size:14px;font-weight:700;cursor:pointer;writing-mode:horizontal-tb;opacity:.8;} .a11y-text-btn:hover{opacity:1;}';
  document.head.appendChild(style);

  /* --- ניהול פוקוס בדיאלוג (cookie banner) --- */
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.getElementById('cookie-decline').click();
      }
    });
  }

})();
