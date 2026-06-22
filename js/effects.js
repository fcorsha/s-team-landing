/* effects.js — visual enhancements */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     1. SCROLL PROGRESS BAR
  ────────────────────────────────────────── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  window.addEventListener('scroll', function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
  }, { passive: true });

  /* ──────────────────────────────────────────
     2. HERO FLOATING PARTICLES
  ────────────────────────────────────────── */
  if (!reduced) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var cvs = document.createElement('canvas');
      cvs.setAttribute('aria-hidden', 'true');
      cvs.className = 'hero-canvas';
      hero.insertBefore(cvs, hero.firstChild);
      var ctx = cvs.getContext('2d');
      var pts = [];
      var W = 0, H = 0;

      function resize() {
        W = cvs.width  = hero.offsetWidth;
        H = cvs.height = hero.offsetHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      for (var i = 0; i < 65; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.6 + 0.3,
          vx: (Math.random() - .5) * .22,
          vy: (Math.random() - .5) * .22,
          a: Math.random() * .4 + .07
        });
      }

      var running = true;
      function tick() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        for (var j = 0; j < pts.length; j++) {
          var p = pts[j];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200,168,75,' + p.a + ')';
          ctx.fill();
          p.x = (p.x + p.vx + W) % W;
          p.y = (p.y + p.vy + H) % H;
        }
        requestAnimationFrame(tick);
      }
      tick();

      new MutationObserver(function () {
        running = !document.body.classList.contains('no-animations');
        if (running) tick();
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* ──────────────────────────────────────────
     3. 3D CARD TILT
  ────────────────────────────────────────── */
  if (!reduced) {
    document.querySelectorAll('.benefit-card, .domain-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        if (document.body.classList.contains('no-animations')) return;
        var r  = card.getBoundingClientRect();
        var dx = ((e.clientX - r.left) / r.width  - .5) * 2;
        var dy = ((e.clientY - r.top)  / r.height - .5) * 2;
        card.style.transition = 'box-shadow .1s';
        card.style.transform  = 'perspective(700px) rotateY(' + (dx * 7) + 'deg) rotateX(' + (-dy * 5) + 'deg) translateZ(10px)';
        card.style.boxShadow  = '0 24px 56px rgba(0,0,0,.18), 0 0 0 1.5px rgba(200,168,75,.18)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .45s ease, box-shadow .45s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
      });
    });
  }

  /* ──────────────────────────────────────────
     4. BUTTON RIPPLE
  ────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('no-animations')) return;
    var btn = e.target.closest('.btn');
    if (!btn) return;
    var r  = btn.getBoundingClientRect();
    var sz = Math.max(r.width, r.height) * 2.2;
    var x  = e.clientX - r.left - sz / 2;
    var y  = e.clientY - r.top  - sz / 2;
    var rp = document.createElement('span');
    rp.setAttribute('aria-hidden', 'true');
    rp.className = 'btn-ripple';
    rp.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + x + 'px;top:' + y + 'px;';
    btn.appendChild(rp);
    setTimeout(function () { if (rp.parentNode) rp.parentNode.removeChild(rp); }, 700);
  });

  /* ──────────────────────────────────────────
     5. HERO PARALLAX ON SCROLL
  ────────────────────────────────────────── */
  if (!reduced) {
    var heroText = document.querySelector('.hero-text');
    var heroForm = document.querySelector('.hero-form-wrap');
    if (heroText) {
      window.addEventListener('scroll', function () {
        if (document.body.classList.contains('no-animations')) return;
        var y = window.scrollY;
        if (y > 700) return;
        heroText.style.transform = 'translateY(' + (y * .07) + 'px)';
        if (heroForm) heroForm.style.transform = 'translateY(' + (y * .035) + 'px)';
      }, { passive: true });
    }
  }

  /* ──────────────────────────────────────────
     6. TRUST TAGS — staggered entrance
  ────────────────────────────────────────── */
  var tags = document.querySelectorAll('.trust-tag');
  if (tags.length) {
    tags.forEach(function (tag, idx) {
      tag.style.opacity  = '0';
      tag.style.transform = 'translateY(16px) scale(.92)';
    });
    var tagIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      tags.forEach(function (tag, idx) {
        setTimeout(function () {
          tag.style.transition = 'opacity .4s ease, transform .4s cubic-bezier(.22,.68,0,1.2)';
          tag.style.opacity    = '1';
          tag.style.transform  = 'none';
        }, idx * 60);
      });
      tagIO.disconnect();
    }, { threshold: .2 });
    tagIO.observe(tags[0].closest('.trust-tags') || tags[0]);
  }

  /* ──────────────────────────────────────────
     7. SECTION TITLE UNDERLINE — animate width
  ────────────────────────────────────────── */
  document.querySelectorAll('.section-header').forEach(function (header) {
    var title = header.querySelector('.section-title');
    if (!title) return;
    title.classList.add('title-anim');
    var hIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      title.classList.add('title-anim--in');
      hIO.disconnect();
    }, { threshold: .5 });
    hIO.observe(header);
  });

  /* ──────────────────────────────────────────
     8. HERO ENTRANCE — hand off from fade-in to CSS keyframes
  ────────────────────────────────────────── */
  var heroBlock = document.querySelector('.hero-text');
  if (heroBlock) {
    heroBlock.classList.remove('fade-in');
    heroBlock.style.opacity = '';
    heroBlock.style.transform = '';
  }
  var hfWrap = document.querySelector('.hero-form-wrap');
  if (hfWrap) {
    hfWrap.classList.remove('fade-in');
    hfWrap.style.opacity = '';
    hfWrap.style.transform = '';
    if (!reduced) {
      setTimeout(function () { hfWrap.classList.add('hero-form-glow'); }, 900);
    }
  }

})();
