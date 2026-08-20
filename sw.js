// Bump this whenever index.html changes: the shell is cache-first, so an installed PWA keeps
// serving the old shell until the cache NAME changes and `activate` deletes the stale one.
// v5 (2026-08-20): bucket display names for blogs / careers / au_phd, which previously rendered
// as their raw keys.
const CACHE = 'signal-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// network-first for data, cache-first for shell; every good response refreshes the cache for offline reading
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isData = e.request.url.includes('/data/');
  e.respondWith(
    isData
      ? fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request))
      : caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }))
  );
});
