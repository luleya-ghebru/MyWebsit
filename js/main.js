/* =========================================================
   main.js - site-wide interactivity
   1. Scroll-reveal animation   2. FAQ accordion
   3. Image pop-up (lightbox)          4. Google Maps store switcher
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

  /* ---------- 3. Image pop-up (lightbox) ----------
     Click any picture in the page content to see it larger.
     Gallery pictures can be browsed with the arrows; other pictures open on their own. */
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
  const prevBtn = box.querySelector('.lightbox-prev');
  const nextBtn = box.querySelector('.lightbox-next');
  let items = [];       // the pictures that can be browsed right now
  let current = 0;
  let opener = null;

  function show(index) {
    current = (index + items.length) % items.length;   // wraps around at both ends
    bigImg.src = items[current].src;
    bigImg.alt = items[current].alt;
    caption.textContent = items[current].caption;
  }
  function openBox(list, index, from) {
    items = list;
    opener = from;
    show(index);
    prevBtn.hidden = nextBtn.hidden = list.length < 2;   // arrows only when there is more than one picture
    box.classList.add('open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }
  function closeBox() {
    box.classList.remove('open');
    if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('no-scroll');
    if (opener) opener.focus();
  }

  /* One click listener for the whole page, so pictures built later by JavaScript (product cards) work too */
  document.addEventListener('click', e => {
    const galleryBtn = e.target.closest('.gallery-item');
    const img = galleryBtn ? galleryBtn.querySelector('img') : e.target.closest('img');
    if (!img || box.contains(img) || !img.closest('main, .modal-dialog')) return;

    if (galleryBtn) {
      const buttons = Array.from(document.querySelectorAll('.gallery-item'));
      const list = buttons.map(b => ({ src: b.dataset.full, alt: b.querySelector('img').alt, caption: b.dataset.caption }));
      openBox(list, buttons.indexOf(galleryBtn), galleryBtn);
    } else {
      openBox([{ src: img.currentSrc || img.src, alt: img.alt, caption: img.alt }], 0, img);
    }
  });

  closeBtn.addEventListener('click', closeBox);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', e => { if (e.target === box) closeBox(); });   // click on the dark background
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') closeBox();
    else if (e.key === 'ArrowLeft' && items.length > 1) show(current - 1);
    else if (e.key === 'ArrowRight' && items.length > 1) show(current + 1);
    else if (e.key === 'Tab') trapFocus(box, e);
  });

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