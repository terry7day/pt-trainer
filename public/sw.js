// Bump CACHE to invalidate old caches on deploy.
const CACHE = 'pt-trainer-v2';
const PRECACHE = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Network-first for pages so new deploys appear immediately; cache as offline fallback.
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }

  // Cache-first for hashed, immutable static assets.
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          const c = res.clone();
          caches.open(CACHE).then(ca => ca.put(req, c));
        }
        return res;
      })
    )
  );
});
