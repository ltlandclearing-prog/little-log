const CACHE = 'little-log-v43';
const ASSETS = ['./', './index.html', './manifest.json', './icon-180.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok && event.request.method === 'GET') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(()=>{});
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
