/* Portfolio — theme inversion and nav scroll-spy.
   Deliberately does not gate content visibility on anything: no reveal-on-
   scroll, no opacity managed from script. If this file fails to load, throws,
   or never gets an animation frame, the page still reads normally. */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORE = 'mk-theme';

  /* ---- theme ------------------------------------------------ */
  var toggle = document.getElementById('themeToggle');

  // Dark is the default; the light attribute is the opt-in override.
  function apply(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'false' : 'true');
      toggle.querySelector('.rail__themetext').textContent =
        theme === 'light' ? 'Invert' : 'Paper';
    }
  }

  var stored = null;
  try { stored = localStorage.getItem(STORE); } catch (e) { /* private mode */ }
  apply(stored === 'light' ? 'light' : 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem(STORE, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---- scroll-spy ------------------------------------------- */
  var links = [].slice.call(document.querySelectorAll('.rail__list a'));

  var pairs = links.map(function (link) {
    return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
  }).filter(function (p) { return p.section; });

  if (!pairs.length) return;

  function update() {
    var vh = window.innerHeight;
    var active = pairs[0];

    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i].section.getBoundingClientRect().top <= vh * 0.34) {
        active = pairs[i];
      }
    }
    // At the very bottom the last section may never cross the line.
    if (vh + window.scrollY >= document.body.scrollHeight - 4) {
      active = pairs[pairs.length - 1];
    }

    for (var k = 0; k < pairs.length; k++) {
      pairs[k].link.classList.toggle('is-active', pairs[k] === active);
    }
  }

  var ticking = false;
  function run() {
    if (!ticking) return;
    ticking = false;
    update();
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(run);
    // Backstop: a tab that never composites gets no animation frames, which
    // would otherwise leave `ticking` stuck true and wedge the handler.
    setTimeout(run, 120);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  window.addEventListener('pageshow', onScroll);

  update();
}());
