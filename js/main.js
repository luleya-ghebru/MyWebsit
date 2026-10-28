/* =========================================================
   main.js - site-wide interactivity
   1. Scroll-reveal animation   2. FAQ accordion
   3. Gallery lightbox          4. Interactive Leaflet map
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

  /* ---------- 4. Interactive map (contact page) - Leaflet + OpenStreetMap ---------- */
  const mapEl = document.getElementById('map');
  if (mapEl) {
    if (typeof L === 'undefined') {
      mapEl.textContent = 'The map could not be loaded. Please use the addresses listed above.';
      return;
    }

    const stores = [
      { name: 'LG Store - Sandton',   address: '123 Rivonia Road, Sandton, Johannesburg, 2196', tel: '011 000 0000', lat: -26.1076, lng: 28.0567 },
      { name: 'LG Store - Cape Town', address: '45 Bree Street, Cape Town City Centre, 8001',   tel: '021 000 0000', lat: -33.9230, lng: 18.4210 }
    ];

    const map = L.map('map', { scrollWheelZoom: false });   // wheel zoom off so the page can still scroll
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = stores.map(store => {
      /* The popup is built from DOM elements, so no HTML is injected from strings */
      const popup = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = store.name;
      const addr = document.createElement('p');
      addr.textContent = store.address;
      const tel = document.createElement('p');
      tel.textContent = 'Tel: ' + store.tel;
      const dir = document.createElement('a');
      dir.href = 'https://www.openstreetmap.org/directions?to=' + store.lat + '%2C' + store.lng;
      dir.textContent = 'Get directions';
      dir.target = '_blank';
      dir.rel = 'noopener noreferrer';
      popup.append(title, addr, tel, dir);

      return L.marker([store.lat, store.lng], { title: store.name, alt: store.name }).addTo(map).bindPopup(popup);
    });

    const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });          // starts by showing both stores

    document.querySelectorAll('.map-buttons [data-store]').forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.store;
        if (target === 'all') {
          map.closePopup();
          map.flyToBounds(bounds, { padding: [40, 40] });
        } else {
          const store = stores[Number(target)];
          map.flyTo([store.lat, store.lng], 15);
          markers[Number(target)].openPopup();
        }
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
})();