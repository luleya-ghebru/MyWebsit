/* =========================================================
   main.js - shared interactive features used on every page
   1. Scroll-reveal animation   2. Back-to-top button
   3. Accordion (FAQ)           4. Gallery lightbox
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  initScrollReveal();
  initBackToTop();
  initAccordions();
  initLightbox();
});

/* ---- 1. Scroll reveal: fades sections in as they enter the screen ----
   Uses the IntersectionObserver API (MDN Web Docs, n.d.a). */
function initScrollReveal() {
  var sections = document.querySelectorAll('main section');
  // If the browser is old, simply show everything.
  if (!('IntersectionObserver' in window)) { return; }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(function (section) {
    section.classList.add('reveal'); // added by JS so no-JS users still see content
    observer.observe(section);
  });
}

/* ---- 2. Back-to-top button: created with the DOM, shown after scrolling ---- */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top of page');
  btn.textContent = '\u2191'; // up arrow
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    // show the button once the visitor has scrolled 300px
    btn.classList.toggle('show', window.scrollY > 300);
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- 3. Accordion: one panel open at a time, keyboard accessible ----
   Follows the WAI-ARIA accordion pattern (W3C, n.d.). */
function setPanel(trigger, open) {
  var panel = document.getElementById(trigger.getAttribute('aria-controls'));
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  // max-height animates from 0 to the real content height
  panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
}

function initAccordions() {
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    var triggers = accordion.querySelectorAll('.accordion-trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var wasOpen = trigger.getAttribute('aria-expanded') === 'true';
        triggers.forEach(function (t) { setPanel(t, false); }); // close all
        if (!wasOpen) { setPanel(trigger, true); }               // open clicked one
      });
    });
  });
}

/* ---- 4. Gallery lightbox: click an image to enlarge it ----
   Arrow keys = previous/next, Esc = close, click outside = close. */
function initLightbox() {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (items.length === 0) { return; } // page has no gallery

  // Build the overlay once with the DOM and reuse it for every image.
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous image">&#10094;</button>' +
    '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="lightbox-next" aria-label="Next image">&#10095;</button>';
  document.body.appendChild(overlay);

  var bigImg = overlay.querySelector('img');
  var caption = overlay.querySelector('figcaption');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var prevBtn = overlay.querySelector('.lightbox-prev');
  var nextBtn = overlay.querySelector('.lightbox-next');
  var current = 0;
  var lastFocused = null;

  function show(index) {
    // the % maths makes the gallery loop round at both ends
    current = (index + items.length) % items.length;
    var thumb = items[current].querySelector('img');
    bigImg.src = thumb.src;
    bigImg.alt = thumb.alt;
    caption.textContent = thumb.alt + ' (' + (current + 1) + ' of ' + items.length + ')';
  }
  function open(index) {
    lastFocused = document.activeElement; // remember where focus was
    show(index);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // stop page scrolling behind
    closeBtn.focus();
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) { lastFocused.focus(); } // return focus for keyboard users
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { close(); } // clicked the dark background
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) { return; }
    if (e.key === 'Escape') { close(); }
    if (e.key === 'ArrowLeft') { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }
    if (e.key === 'Tab') { // keep keyboard focus inside the dialog
      var buttons = [closeBtn, prevBtn, nextBtn];
      var idx = buttons.indexOf(document.activeElement);
      e.preventDefault();
      buttons[(idx + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
    }
  });
}