// LG Store - Part 3 interactivity.
// One file for every page: each block only runs if its elements exist.
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Helpers ---------- */
  const money = n => 'R ' + n.toLocaleString('en-ZA');
  // Escape user text before putting it into innerHTML (basic security)
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const phoneOk = v => /^0\d{9}$/.test(v.replace(/\s/g, '')); // 10-digit SA number
  const val = id => document.getElementById(id).value;

  // Show/clear an error under a field; returns true when the field is valid
  function setError(id, msg) {
    document.getElementById(id).classList.toggle('invalid', !!msg);
    document.getElementById(id + '-error').textContent = msg || '';
    return !msg;
  }

  /* ---------- 1. Scroll-reveal animation (CSS transition + IntersectionObserver) ---------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  function reveal(list) { list.forEach(el => { el.classList.add('reveal'); observer.observe(el); }); }
  reveal(document.querySelectorAll('.category-card, .team-member, .location-card, .faq-item, .gallery-grid img'));

  /* ---------- 2. Dynamic products with search, filter and sort (products.html) ---------- */
  const grid = document.getElementById('product-grid');
  if (grid) {
    const products = [
      { name: 'LG OLED 55" Smart TV', cat: 'Televisions', price: 12999, stock: 'In stock', img: 'tv.jpg' },
      { name: 'LG QNED 65" 4K TV', cat: 'Televisions', price: 15499, stock: 'Low stock', img: 'tv.jpg' },
      { name: 'LG LED 43" Smart TV', cat: 'Televisions', price: 6999, stock: 'In stock', img: 'tv.jpg' },
      { name: 'LG Side-by-Side Fridge 600L', cat: 'Fridges & Freezers', price: 17999, stock: 'In stock', img: 'fridge.webp' },
      { name: 'LG Top-Freezer Fridge 420L', cat: 'Fridges & Freezers', price: 9499, stock: 'In stock', img: 'fridge.webp' },
      { name: 'LG Front Loader Washer 9kg', cat: 'Washing Machines', price: 7299, stock: 'In stock', img: 'washing ma.webp' },
      { name: 'LG Top Loader Washer 12kg', cat: 'Washing Machines', price: 10499, stock: 'Order-in', img: 'washing ma.webp' },
      { name: 'LG Inverter Split Aircon 12000 BTU', cat: 'Air Conditioning', price: 8999, stock: 'In stock', img: 'air condition.png' },
      { name: 'LG Inverter Split Aircon 18000 BTU', cat: 'Air Conditioning', price: 12499, stock: 'Low stock', img: 'air condition.png' },
      { name: 'LG NeoChef Microwave 42L', cat: 'Small Appliances', price: 1199, stock: 'In stock', img: 'Small LG kitchen and home appliances.jpg' }
    ];
    const search = document.getElementById('search');
    const filter = document.getElementById('filter');
    const sort = document.getElementById('sort');
    const count = document.getElementById('result-count');

    function render() {
      const term = search.value.trim().toLowerCase();
      let list = products.filter(p =>
        (filter.value === 'all' || p.cat === filter.value) && p.name.toLowerCase().includes(term));
      if (sort.value === 'low') list.sort((a, b) => a.price - b.price);
      else if (sort.value === 'high') list.sort((a, b) => b.price - a.price);
      else list.sort((a, b) => a.name.localeCompare(b.name));

      grid.innerHTML = ''; // clear, then rebuild the cards with DOM manipulation
      list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `<img src="../assets/${p.img}" alt="${esc(p.name)}" loading="lazy">
          <h3>${esc(p.name)}</h3><p>${esc(p.cat)}</p>
          <p class="price">${money(p.price)}</p><p class="stock">${p.stock}</p>`;
        grid.appendChild(card);
      });
      count.textContent = list.length ? `Showing ${list.length} product(s)` : 'No products match your search.';
    }
    [search, filter, sort].forEach(el => el.addEventListener('input', render));
    render();
  }

  /* ---------- 3. Accordion FAQ (products.html) ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.nextElementSibling.hidden = open;
    });
  });

  /* ---------- 4. Gallery lightbox (about.html) ---------- */
  const pics = document.querySelectorAll('.gallery-grid img');
  if (pics.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt=""><p></p>';
    document.body.appendChild(box);
    const big = box.querySelector('img'), cap = box.querySelector('p');
    const close = () => box.classList.remove('open');
    pics.forEach(img => img.addEventListener('click', () => {
      big.src = img.src; big.alt = img.alt; cap.textContent = img.alt;
      box.classList.add('open');
    }));
    box.addEventListener('click', e => { if (e.target !== big) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- 5. Interactive Leaflet map with two stores (contact.html) ---------- */
  const mapEl = document.getElementById('map');
  if (mapEl && window.L) {
    const stores = [
      { name: 'LG Store - Sandton', lat: -26.1076, lng: 28.0567, addr: '123 Rivonia Road, Sandton' },
      { name: 'LG Store - Cape Town', lat: -33.9249, lng: 18.4241, addr: '45 Bree Street, Cape Town' }
    ];
    const map = L.map('map').setView([stores[0].lat, stores[0].lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    stores.forEach(s => L.marker([s.lat, s.lng]).addTo(map).bindPopup(`<strong>${s.name}</strong><br>${s.addr}`));
    document.querySelectorAll('[data-store]').forEach(btn =>
      btn.addEventListener('click', () => { const s = stores[btn.dataset.store]; map.flyTo([s.lat, s.lng], 14); }));
  }

  /* ---------- 6. Enquiry form: validate, send (AJAX), show cost + availability ---------- */
  const enq = document.getElementById('enquiry-form');
  if (enq) {
    enq.addEventListener('submit', async e => {
      e.preventDefault();
      const qty = +val('quantity');
      const ok = [
        setError('full-name', val('full-name').trim().length >= 2 ? '' : 'Enter your full name (min 2 characters).'),
        setError('email', emailOk(val('email')) ? '' : 'Enter a valid email address.'),
        setError('phone', phoneOk(val('phone')) ? '' : 'Enter a 10-digit phone number, e.g. 0821234567.'),
        setError('enquiry-type', val('enquiry-type') ? '' : 'Please choose an enquiry type.'),
        setError('product-category', val('product-category') ? '' : 'Please choose a category.'),
        setError('quantity', qty >= 1 && qty <= 50 ? '' : 'Quantity must be between 1 and 50.'),
        setError('message', val('message').trim().length >= 10 ? '' : 'Message must be at least 10 characters.')
      ];
      if (ok.includes(false)) return;

      const prices = { tv: 6999, fridge: 9499, washer: 7299, aircon: 8999, 'small-appliance': 1199 };
      const stock = {
        tv: 'In stock, delivery in 2-3 working days', fridge: 'In stock, delivery in 2-3 working days',
        washer: 'Limited stock, delivery in 3-5 working days', aircon: 'Order-in, 5-7 working days',
        'small-appliance': 'In stock, collect in store today'
      };
      const type = val('enquiry-type'), cat = val('product-category');
      const catName = document.getElementById('product-category').selectedOptions[0].text;
      let cost;
      if (type === 'repair') cost = 'A repair call-out fee of R 450 applies (credited if we do the repair).';
      else if (type === 'warranty') cost = 'Warranty assessments are free with your proof of purchase.';
      else {
        const install = type === 'installation';
        cost = `Estimated starting cost for ${qty} x ${esc(catName)}: ${money(prices[cat] * qty + (install ? 650 * qty : 0))}${install ? ' (includes installation)' : ''}.`;
      }

      const out = document.getElementById('enquiry-response');
      out.className = 'form-success show';
      out.textContent = 'Sending your enquiry...';
      try { // AJAX: asynchronous POST to a free test API
        await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: val('full-name'), email: val('email'), type, cat, qty })
        });
      } catch (err) { /* offline: still show the response below */ }
      const method = enq.querySelector('input[name="contact-method"]:checked').value;
      out.innerHTML = `<strong>Thank you, ${esc(val('full-name'))}!</strong><br>${cost}<br>
        Availability: ${stock[cat]}.<br>We will contact you by ${method} on ${esc(val('phone'))}.`;
      enq.reset();
    });
  }

  /* ---------- 7. Contact form: validate, then build an email (mailto) ---------- */
  const con = document.getElementById('contact-form');
  if (con) {
    con.addEventListener('submit', e => {
      e.preventDefault();
      const ok = [
        setError('c-full-name', val('c-full-name').trim().length >= 2 ? '' : 'Enter your full name.'),
        setError('c-email', emailOk(val('c-email')) ? '' : 'Enter a valid email address.'),
        setError('c-phone', !val('c-phone') || phoneOk(val('c-phone')) ? '' : 'Phone must be 10 digits.'),
        setError('c-subject', val('c-subject') ? '' : 'Please choose a message type.'),
        setError('c-message', val('c-message').trim().length >= 10 ? '' : 'Message must be at least 10 characters.')
      ];
      if (ok.includes(false)) return;

      const to = 'info@lgstore.co.za'; // recipient stated in the code
      const typeText = document.getElementById('c-subject').selectedOptions[0].text;
      const subject = `[${typeText}] Message from ${val('c-full-name')}`;
      const body = `Name: ${val('c-full-name')}\nEmail: ${val('c-email')}\nPhone: ${val('c-phone') || 'n/a'}\nType: ${typeText}\n\n${val('c-message')}`;
      const link = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const out = document.getElementById('contact-response');
      out.className = 'form-success show';
      out.innerHTML = `Your email is ready. <a href="${link}">Click here to send it</a> if your email app did not open.`;
      window.location.href = link;
    });
  }
});