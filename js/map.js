/* =========================================================
   map.js - interactive store map using Leaflet (Agafonkin, n.d.)
   with OpenStreetMap tiles (OpenStreetMap contributors, n.d.)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var mapDiv = document.getElementById('store-map');
  // Stop quietly if this page has no map or the Leaflet library did not load
  if (!mapDiv || typeof L === 'undefined') { return; }

  var stores = [
    { name: 'LG Store \u2014 Sandton', lat: -26.1052, lng: 28.0560,
      address: '123 Rivonia Road, Sandton, Johannesburg, 2196', tel: '011 000 0000' },
    { name: 'LG Store \u2014 Cape Town', lat: -33.9205, lng: 18.4222,
      address: '45 Bree Street, Cape Town City Centre, 8001', tel: '021 000 0000' }
  ];

  var map = L.map('store-map', { scrollWheelZoom: false }); // wheel zoom off so page scrolling is not hijacked
  map.once('click', function () { map.scrollWheelZoom.enable(); }); // enabled after first click

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // One marker + popup per store
  var markers = stores.map(function (s) {
    var marker = L.marker([s.lat, s.lng]).addTo(map);
    var popup = document.createElement('div');
    var title = document.createElement('strong');
    title.textContent = s.name;
    var details = document.createElement('p');
    details.textContent = s.address + ' | Tel: ' + s.tel;
    var dir = document.createElement('a');
    dir.href = 'https://www.google.com/maps/dir/?api=1&destination=' + s.lat + ',' + s.lng;
    dir.target = '_blank';
    dir.rel = 'noopener noreferrer';
    dir.textContent = 'Get directions';
    popup.appendChild(title);
    popup.appendChild(details);
    popup.appendChild(dir);
    marker.bindPopup(popup);
    return marker;
  });

  // Zoom out so both stores are visible at the start
  map.fitBounds(L.latLngBounds(stores.map(function (s) { return [s.lat, s.lng]; })).pad(0.3));

  // Buttons that fly the map to a chosen store
  document.querySelectorAll('[data-store]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = Number(btn.getAttribute('data-store'));
      map.flyTo([stores[i].lat, stores[i].lng], 15);
      markers[i].openPopup();
    });
  });

  // "Find my nearest store" uses the browser Geolocation API (MDN Web Docs, n.d.b)
  var status = document.getElementById('map-status');
  var nearestBtn = document.getElementById('nearest-store');
  if (nearestBtn) {
    nearestBtn.addEventListener('click', function () {
      if (!navigator.geolocation) { status.textContent = 'Location is not supported by your browser.'; return; }
      status.textContent = 'Finding your location...';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var best = 0, bestDist = Infinity;
        stores.forEach(function (s, i) {
          // map.distance() returns metres between two points
          var d = map.distance([pos.coords.latitude, pos.coords.longitude], [s.lat, s.lng]);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        status.textContent = 'Your nearest store is ' + stores[best].name + ' (about ' + Math.round(bestDist / 1000) + ' km away).';
        map.flyTo([stores[best].lat, stores[best].lng], 13);
        markers[best].openPopup();
      }, function () {
        status.textContent = 'We could not get your location. Please use the store buttons instead.';
      });
    });
  }
});