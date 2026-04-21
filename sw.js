const CACHE_NAME = 'secu-pwa-v6';

const assets = [
  '/',
  '/index.html',
  '/logo.png'
];

// INSTALACIÓN
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// ACTIVACIÓN
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  return self.clients.claim();
});

// FETCH (clave para iPhone)
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    // 👉 Siempre devuelve index.html para navegación
    e.respondWith(
      caches.match('/index.html')
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});
