/* =========================================================
   main.js - site-wide interactivity
   1. Scroll-reveal animation   2. FAQ accordion
   3. Gallery lightbox          4. Google Maps store switcher
   Patterns adapted from MDN Web Docs (n.d.) and the W3C
   WAI-ARIA Authoring Practices (n.d.) - see README references.
   ========================================================= */
(function () {
  'use strict';

  /* Keeps keyboard focus inside a pop-up (modal / lightbox) while it is open */
  function trapFocus(container, event) {
    const focusable = container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  window.LGStore = { trapFocus: trapFocus };   // shared with products.js

  /* ---------- 1. Scroll-reveal: sections fade in once as they enter the screen ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);          // animate only once
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));   // very old browsers: just show everything
  }

  /* ---------- 2. Accordion (FAQ) ---------- */
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));   // tells screen readers the state
      item.classList.toggle('open', !isOpen);                   // CSS animates the answer open/closed
    });
  });

  /* ---------- 3. Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (galleryItems.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>' +
      '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(box);

    const bigImg = box.querySelector('img');
    const caption = box.querySelector('figcaption');
    const closeBtn = box.querySelector('.lightbox-close');
    let current = 0;
    let opener = null;

    function show(index) {
      current = (index + galleryItems.length) % galleryItems.length;   // wraps around at both ends
      const item = galleryItems[current];
      bigImg.src = item.dataset.full;
      bigImg.alt = item.querySelector('img').alt;
      caption.textContent = item.dataset.caption;
    }
    function open(index) {
      opener = document.activeElement;
      show(index);
      box.classList.add('open');
      document.body.classList.add('no-scroll');
      closeBtn.focus();
    }
    function close() {
      box.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (opener) opener.focus();
    }

    galleryItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
    closeBtn.addEventListener('click', close);
    box.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    box.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'Tab') trapFocus(box, e);
    });
  }

  /* ---------- 4. Google Maps embed (contact page) ---------- */
  /* Each button holds the embed link of one store in its data-map attribute */
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame) {
    const mapButtons = document.querySelectorAll('.map-buttons [data-map]');
    mapButtons.forEach(button => {
      button.addEventListener('click', () => {
        mapFrame.src = button.dataset.map;                         // load the chosen store
        mapFrame.title = 'Map showing ' + button.dataset.name;     // keeps the title accurate for screen readers
        mapButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      });
    });
  }
})();