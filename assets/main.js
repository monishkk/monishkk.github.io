/* Portfolio — theme inversion, reveal-on-scroll, nav scroll-spy.
   Reveal + spy run off a single throttled scroll handler rather than
   IntersectionObserver: if anything about it fails, content stays visible. */
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

  /* ---- collect targets -------------------------------------- */
  var blocks = [].slice.call(document.querySelectorAll('.sec, .hero__fig'));
  var links = [].slice.call(document.querySelectorAll('.rail__list a'));

  var spyPairs = links.map(function (link) {
    return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
  }).filter(function (p) { return p.section; });

  /* Hidden state is applied by script only, so a JS failure can never
     leave the page invisible. */
  blocks.forEach(function (b) { b.classList.add('reveal'); });

  /* Blocks are removed from this list as they are shown. A list rather than a
     counter: settle() strips the marker classes once the entrance has played,
     so any "have I already shown this?" test based on those classes would go
     on matching the same block again. */
  var pending = blocks.slice();

  function settle(el) {
    setTimeout(function () {
      el.classList.remove('reveal');
      el.classList.remove('is-in');
    }, 900);
  }

  function update() {
    var vh = window.innerHeight;

    for (var i = pending.length - 1; i >= 0; i--) {
      var b = pending[i];
      // No lower bound: after a reload restores the scroll position, blocks
      // above the viewport must show immediately, not wait for a scroll up.
      if (b.getBoundingClientRect().top < vh * 0.92) {
        b.classList.add('is-in');
        pending.splice(i, 1);
        // Once the entrance has had time to play, drop the classes so the
        // element's visibility no longer depends on a transition that a
        // non-compositing tab may have left half-finished.
        settle(b);
      }
    }

    if (spyPairs.length) {
      var active = spyPairs[0];
      for (var j = 0; j < spyPairs.length; j++) {
        if (spyPairs[j].section.getBoundingClientRect().top <= vh * 0.34) {
          active = spyPairs[j];
        }
      }
      // At the very bottom the last section may never cross the line.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        active = spyPairs[spyPairs.length - 1];
      }
      for (var k = 0; k < spyPairs.length; k++) {
        spyPairs[k].link.classList.toggle('is-active', spyPairs[k] === active);
      }
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(run);
    // Backstop: a tab that never composites gets no animation frames, which
    // would otherwise leave `ticking` stuck true and wedge the handler.
    setTimeout(run, 120);
  }
  function run() {
    if (!ticking) return;
    ticking = false;
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  // Covers a restored scroll position on reload, and bfcache back-navigation
  // where neither frames nor fresh timers are guaranteed to run.
  window.addEventListener('pageshow', onScroll);

  // Above-the-fold blocks animate in on the next frame. The timer is a
  // failsafe for tabs that never composite (a background tab gets no
  // animation frames), so content is never left stuck at opacity 0.
  window.requestAnimationFrame(update);
  setTimeout(update, 400);
}());
