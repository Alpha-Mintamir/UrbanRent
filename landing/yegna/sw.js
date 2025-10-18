const CACHE = 'yegna-v1';
const ASSETS = [
  '/landing/yegna/index.html',
  '/landing/yegna/styles.css',
  '/landing/yegna/script.js',
  '/client/public/assets/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).then((net) => {
      const clone = net.clone();
      caches.open(CACHE).then((c) => c.put(e.request, clone));
      return net;
    }).catch(() => res))
  );
});
