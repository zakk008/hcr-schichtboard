var CACHE_NAME = 'hcr-fahrer-v10';
var ASSETS = [
  './',
  './index.html',
  './manifest-1.json',
  './icon-192x192-1.png',
  './icon-512x512-2.png',
  './Fahrerkarten-Montag-Freitag-Schule.PDF',
  './Fahrerkarten-Montag-Freitag-Ferien(1).PDF',
  './Fahrerkarten-Montag-Freitag-Ferien-E-Wagen.PDF',
  './Fahrerkarten-Samstag.PDF',
  './Fahrerkarten-Sonntag-und-Feiertag.PDF'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS.slice(0,4)); // Cache only core files on install
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).then(function(response) {
      if (response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || new Response('Offline', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});
