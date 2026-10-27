/* =========================================================
   products.js - dynamic product listing + search/filter/sort
   Products are stored in an array and rendered into the page
   with JavaScript (DOM manipulation). Prices are illustrative:
   change them to match the budget/research from Part 1.
   ========================================================= */
var products = [
  { name: 'LG 43" 4K Smart TV',            category: 'tv',     price: 6999,  image: '../assets/lg-oled-television.jpg',            alt: 'LG 4K Smart TV on a stand',               description: 'Sharp 4K picture with webOS and built-in streaming apps.' },
  { name: 'LG 55" QNED 4K Smart TV',       category: 'tv',     price: 12999, image: '../assets/lg-oled-television.jpg',            alt: 'LG QNED television in a living room',     description: 'Bright QNED panel with Dolby Vision for movies and sport.' },
  { name: 'LG 65" OLED evo Smart TV',      category: 'tv',     price: 29999, image: '../assets/lg-oled-television.jpg',            alt: 'LG OLED television with a slim design',   description: 'Perfect blacks and a 120Hz panel for gaming.' },
  { name: 'LG 427L Top-Freezer Fridge',    category: 'fridge', price: 9499,  image: '../assets/lg-double-door-fridge.webp',        alt: 'LG top-freezer fridge in a kitchen',      description: 'Inverter cooling with Smart Diagnosis and door cooling.' },
  { name: 'LG 600L Side-by-Side Fridge',   category: 'fridge', price: 24999, image: '../assets/lg-double-door-fridge.webp',        alt: 'LG side-by-side fridge freezer',          description: 'Large family capacity with water dispenser and InstaView.' },
  { name: 'LG 8kg Front-Loader Washer',    category: 'washer', price: 7299,  image: '../assets/lg-front-loader-washing-machine.webp', alt: 'LG 8kg front-loading washing machine', description: 'AI Direct Drive with six motion care for gentle washing.' },
  { name: 'LG 13kg Steam Washer',          category: 'washer', price: 12999, image: '../assets/lg-front-loader-washing-machine.webp', alt: 'LG 13kg steam washing machine',        description: 'Steam wash reduces allergens and wrinkles.' },
  { name: 'LG 12000 BTU Inverter Split',   category: 'aircon', price: 8999,  image: '../assets/lg-split-air-conditioner.png',      alt: 'LG split-type inverter air conditioner',  description: 'Dual inverter compressor for quiet, efficient cooling.' },
  { name: 'LG 18000 BTU Inverter Split',   category: 'aircon', price: 12499, image: '../assets/lg-split-air-conditioner.png',      alt: 'LG 18000 BTU split air conditioning unit', description: 'Cools larger rooms and small commercial spaces.' },
  { name: 'LG 20L NeoChef Microwave',      category: 'small',  price: 1199,  image: '../assets/lg-small-kitchen-appliances.jpg',   alt: 'LG NeoChef microwave oven',               description: 'Smart Inverter even heating with easy-clean interior.' },
  { name: 'LG 42L Smart Inverter Microwave', category: 'small', price: 2999, image: '../assets/lg-small-kitchen-appliances.jpg',   alt: 'LG large smart inverter microwave',       description: 'Large capacity with grill function for family cooking.' }
];

var categoryNames = {
  tv: 'Televisions', fridge: 'Fridges & Freezers', washer: 'Washing Machines',
  aircon: 'Air Conditioning', small: 'Small Appliances'
};

/* Format a number as South African Rand, e.g. 6999 -> "R 6 999" */
function formatPrice(n) {
  return 'R ' + n.toLocaleString('en-ZA').replace(/\u00a0/g, ' ');
}

/* Read the search box, category and sort controls and return the matching products */
function getFilteredProducts() {
  var term = document.getElementById('product-search').value.trim().toLowerCase();
  var category = document.getElementById('category-filter').value;
  var sort = document.getElementById('sort-by').value;

  // filter(): keep products whose name/description contains the search term
  var list = products.filter(function (p) {
    var matchesText = (p.name + ' ' + p.description + ' ' + categoryNames[p.category])
      .toLowerCase().indexOf(term) !== -1;
    var matchesCategory = category === 'all' || p.category === category;
    return matchesText && matchesCategory;
  });

  // sort(): order the remaining products
  if (sort === 'price-asc')  { list.sort(function (a, b) { return a.price - b.price; }); }
  if (sort === 'price-desc') { list.sort(function (a, b) { return b.price - a.price; }); }
  if (sort === 'name')       { list.sort(function (a, b) { return a.name.localeCompare(b.name); }); }
  return list;
}

/* Build one product card with DOM methods (textContent is safer than innerHTML) */
function createCard(p) {
  var card = document.createElement('article');
  card.className = 'product-card';

  var img = document.createElement('img');
  img.src = p.image;
  img.alt = p.alt;
  img.loading = 'lazy';

  var info = document.createElement('div');
  info.className = 'product-info';

  var h3 = document.createElement('h3');
  h3.textContent = p.name;
  var desc = document.createElement('p');
  desc.textContent = p.description;
  var price = document.createElement('p');
  price.className = 'price';
  price.textContent = formatPrice(p.price);

  // link passes the category to the enquiry form so it is pre-selected
  var link = document.createElement('a');
  link.className = 'btn btn-secondary';
  link.href = 'enquiry.html?category=' + p.category + '&product=' + encodeURIComponent(p.name);
  link.textContent = 'Enquire about this';

  info.appendChild(h3);
  info.appendChild(desc);
  info.appendChild(price);
  info.appendChild(link);
  card.appendChild(img);
  card.appendChild(info);
  return card;
}

/* Clear the grid and draw the current results */
function renderProducts() {
  var grid = document.getElementById('product-grid');
  var count = document.getElementById('result-count');
  var list = getFilteredProducts();

  grid.innerHTML = '';
  if (list.length === 0) {
    var none = document.createElement('p');
    none.className = 'no-results';
    none.textContent = 'No products match your search. Try a different word or choose "All categories".';
    grid.appendChild(none);
  } else {
    list.forEach(function (p) { grid.appendChild(createCard(p)); });
  }
  // aria-live region announces the new count to screen-reader users
  count.textContent = 'Showing ' + list.length + ' of ' + products.length + ' products';
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('product-grid')) { return; }
  ['product-search', 'category-filter', 'sort-by'].forEach(function (id) {
    // 'input' fires on every keystroke so results update live
    document.getElementById(id).addEventListener('input', renderProducts);
  });
  document.getElementById('product-filter-form').addEventListener('submit', function (e) {
    e.preventDefault(); // pressing Enter in the search box should not reload the page
  });
  renderProducts();
});