const CACHE = 'walkgolf-v1';
const ASSETS = [
  '/walkgolf/',
  '/walkgolf/index.html',
  '/walkgolf/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Solo cachear recursos propios, no Firebase
  if(e.request.url.includes('firebase') || e.request.url.includes('googleapis')){
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
