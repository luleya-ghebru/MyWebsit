/* =========================================================
   products.js - product data + dynamic product listing
   Used on: index.html (featured products), pages/products.html
            (search, filter, sort, quick-view modal) and
            pages/enquiry.html (prices/availability for replies).
   Prices are example figures in South African rand (ZAR).
   ========================================================= */

/* Category photos - one image per category (file names are SEO-friendly) */
const CATEGORY_IMAGES = {
  'Televisions':         { src: 'assets/tv.jpg',   alt: 'LG televisions on display in the showroom' },
  'Fridges & Freezers':  { src: 'assets/fridge.webp',   alt: 'LG fridge freezers on display in the showroom' },
  'Washing Machines':    { src: 'assets/washing ma.webp',  alt: 'LG washing machines on display in the showroom' },
  'Air Conditioning':    { src: 'assets/air condition.png',   alt: 'LG split air conditioning unit' },
  'Small Appliances':    { src: 'assets/Small LG kitchen and home appliances on a counter.jpg', alt: 'Small LG kitchen and home appliances' }
};

const CATEGORIES = Object.keys(CATEGORY_IMAGES);

/* The product list. "stock" is the number of units available. */
const PRODUCTS = [
  { id: 1,  name: 'LG UHD 43" 4K Smart TV',            category: 'Televisions',        price: 7999,  stock: 12, featured: true,
    description: 'A sharp 4K picture and the webOS smart platform at an entry-level price.',
    features: ['43-inch 4K UHD screen', 'webOS smart platform', 'Built-in streaming apps'] },
  { id: 2,  name: 'LG QNED 55" 4K Smart TV',           category: 'Televisions',        price: 13999, stock: 8,
    description: 'Bright, colour-rich QNED display that suits both lounges and bright rooms.',
    features: ['55-inch QNED display', 'Quantum Dot colour', 'Game-ready HDMI inputs'] },
  { id: 3,  name: 'LG OLED evo 65" 4K Smart TV',       category: 'Televisions',        price: 34999, stock: 3,
    description: 'Perfect blacks and cinema-quality contrast from a self-lit OLED panel.',
    features: ['65-inch OLED evo panel', 'Dolby Vision and Dolby Atmos', 'Slim wall-mount design'] },
  { id: 4,  name: 'LG 315L Top Freezer Fridge',        category: 'Fridges & Freezers', price: 8499,  stock: 10, featured: true,
    description: 'A family-sized fridge with an inverter compressor for quiet, efficient cooling.',
    features: ['315 litre capacity', 'Inverter compressor', 'Door cooling'] },
  { id: 5,  name: 'LG 461L Side-by-Side Fridge Freezer', category: 'Fridges & Freezers', price: 18999, stock: 4,
    description: 'Generous fridge and freezer space side by side, with an external water dispenser.',
    features: ['461 litre capacity', 'Water dispenser', 'Multi air flow cooling'] },
  { id: 6,  name: 'LG 600L InstaView Door-in-Door Fridge', category: 'Fridges & Freezers', price: 39999, stock: 0,
    description: 'Knock twice on the glass panel to see inside without opening the door.',
    features: ['600 litre capacity', 'InstaView glass panel', 'Smart diagnosis'] },
  { id: 7,  name: 'LG 8kg Front Load Washing Machine', category: 'Washing Machines',   price: 8999,  stock: 9, featured: true,
    description: 'A reliable front loader with a direct-drive motor and steam wash options.',
    features: ['8kg wash capacity', 'Direct Drive motor', 'Steam cycle'] },
  { id: 8,  name: 'LG 13kg AI DD Front Load Washing Machine', category: 'Washing Machines', price: 15999, stock: 5,
    description: 'Large-capacity washer that adjusts the wash motion to suit each fabric.',
    features: ['13kg wash capacity', 'AI fabric sensing', 'Wi-Fi control'] },
  { id: 9,  name: 'LG 9kg Top Load Washing Machine',   category: 'Washing Machines',   price: 7499,  stock: 2,
    description: 'A top loader that handles bulky loads and is simple to use.',
    features: ['9kg wash capacity', 'Smart inverter motor', 'Quick wash programme'] },
  { id: 10, name: 'LG 9000 BTU Inverter Split Air Conditioner', category: 'Air Conditioning', price: 7999, stock: 7,
    description: 'Quiet cooling and heating for bedrooms and small offices.',
    features: ['9000 BTU', 'Inverter technology', 'Cooling and heating'] },
  { id: 11, name: 'LG 12000 BTU Dual Inverter Split Air Conditioner', category: 'Air Conditioning', price: 9999, stock: 6, featured: true,
    description: 'Dual inverter compressor that reaches the set temperature quickly and saves power.',
    features: ['12000 BTU', 'Dual inverter compressor', 'Wi-Fi control'] },
  { id: 12, name: 'LG 18000 BTU Dual Inverter Split Air Conditioner', category: 'Air Conditioning', price: 15499, stock: 3,
    description: 'Strong, efficient cooling for large lounges and open-plan spaces.',
    features: ['18000 BTU', 'Dual inverter compressor', 'Air purifying filter'] },
  { id: 13, name: 'LG NeoChef 23L Microwave Oven',     category: 'Small Appliances',   price: 1999,  stock: 15,
    description: 'Even heating and easy-clean interior for everyday cooking and reheating.',
    features: ['23 litre capacity', 'Smart Inverter heating', 'Easy-clean interior'] },
  { id: 14, name: 'LG CordZero Cordless Stick Vacuum', category: 'Small Appliances',   price: 6999,  stock: 5,
    description: 'A lightweight cordless vacuum with a washable filter and long battery life.',
    features: ['Cordless design', 'Removable battery', 'Washable filter'] }
];

/* ---------- Helper functions (also used by forms.js) ---------- */

function formatPrice(amount) {
  return 'R ' + amount.toLocaleString('en-ZA');
}

/* Turns a stock number into a label and a CSS class */
function stockInfo(product) {
  if (product.stock === 0) return { text: 'Out of stock - order on request', cls: 'stock-out' };
  if (product.stock <= 3) return { text: 'Low stock - only ' + product.stock + ' left', cls: 'stock-low' };
  return { text: 'In stock', cls: 'stock-in' };
}

/* Small helper that creates an element with optional class and text.
   textContent is used (not innerHTML) so text is never read as HTML. */
function makeEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Builds one product card.
   options.imgPrefix  - path to the site root ("" or "../")
   options.linkPrefix - path to the pages folder ("pages/" or "")
   options.onView     - function to open the modal (products page only) */
function createProductCard(product, options) {
  const photo = CATEGORY_IMAGES[product.category];
  const stock = stockInfo(product);
  const card = makeEl('article', 'product-card');

  const img = document.createElement('img');
  img.src = options.imgPrefix + photo.src;
  img.alt = photo.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 280;
  img.height = 160;
  card.appendChild(img);

  card.appendChild(makeEl('h3', '', product.name));
  card.appendChild(makeEl('p', 'product-category', product.category));
  card.appendChild(makeEl('p', 'price', formatPrice(product.price)));
  card.appendChild(makeEl('p', 'stock ' + stock.cls, stock.text));

  if (options.onView) {
    const btn = makeEl('button', 'btn btn-secondary', 'Quick View');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Quick view: ' + product.name);
    btn.addEventListener('click', () => options.onView(product, btn));
    card.appendChild(btn);
  } else {
    const a = makeEl('a', 'btn btn-secondary', 'View Details');
    a.href = options.linkPrefix + 'products.html?q=' + encodeURIComponent(product.name);
    card.appendChild(a);
  }
  return card;
}

/* ---------- Home page: featured products ---------- */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  PRODUCTS.filter(p => p.featured).forEach(p => {
    grid.appendChild(createProductCard(p, { imgPrefix: '', linkPrefix: 'pages/' }));
  });
}

/* ---------- Products page: search, filter, sort and modal ---------- */
function initProductPage() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const search = document.getElementById('search');
  const filter = document.getElementById('filter');
  const sort = document.getElementById('sort');
  const inStock = document.getElementById('in-stock');
  const reset = document.getElementById('reset-filters');
  const count = document.getElementById('result-count');
  const none = document.getElementById('no-results');

  /* Fill the category dropdown from the data so it never goes out of date */
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filter.appendChild(opt);
  });

  /* Pre-select filters when arriving from a link such as products.html?category=Televisions */
  const params = new URLSearchParams(window.location.search);
  if (CATEGORIES.includes(params.get('category'))) filter.value = params.get('category');
  if (params.get('q')) search.value = params.get('q');

  function update() {
    const term = search.value.trim().toLowerCase();
    const list = PRODUCTS.filter(p => {
      const text = (p.name + ' ' + p.category + ' ' + p.description).toLowerCase();
      return (filter.value === 'all' || p.category === filter.value)
        && (!inStock.checked || p.stock > 0)
        && text.includes(term);
    });

    if (sort.value === 'low') list.sort((a, b) => a.price - b.price);
    else if (sort.value === 'high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => a.name.localeCompare(b.name));

    grid.replaceChildren();
    list.forEach(p => grid.appendChild(createProductCard(p, { imgPrefix: '../', linkPrefix: '', onView: openModal })));
    count.textContent = 'Showing ' + list.length + ' of ' + PRODUCTS.length + ' products';
    none.hidden = list.length > 0;
  }

  [search, filter, sort, inStock].forEach(c => c.addEventListener('input', update));
  reset.addEventListener('click', () => {
    search.value = '';
    filter.value = 'all';
    sort.value = 'name';
    inStock.checked = false;
    update();
    search.focus();
  });

  /* ----- Quick-view modal ----- */
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');
  let lastOpener = null;

  function openModal(p, opener) {
    const photo = CATEGORY_IMAGES[p.category];
    const stock = stockInfo(p);
    lastOpener = opener;
    document.getElementById('modal-image').src = '../' + photo.src;
    document.getElementById('modal-image').alt = photo.alt;
    document.getElementById('modal-title').textContent = p.name;
    document.getElementById('modal-category').textContent = p.category;
    document.getElementById('modal-price').textContent = formatPrice(p.price);
    document.getElementById('modal-description').textContent = p.description;
    const stockEl = document.getElementById('modal-stock');
    stockEl.textContent = stock.text;
    stockEl.className = 'stock ' + stock.cls;
    const list = document.getElementById('modal-features');
    list.replaceChildren();
    p.features.forEach(f => list.appendChild(makeEl('li', '', f)));
    document.getElementById('modal-enquire').href =
      'enquiry.html?category=' + encodeURIComponent(p.category) + '&product=' + encodeURIComponent(p.name);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastOpener) lastOpener.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });   // click on dark backdrop
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab' && window.LGStore) window.LGStore.trapFocus(modal, e);
  });

  update();
}

renderFeatured();
initProductPage();