const CACHE_NAME = "parroquia-demo-v1";
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/SanPablito.png",
  "/Confesionescarta.png",
  "/iglesia1.jpg",
  "/sanpablito192.png",
  "/sanpablito512.png",
  "/sanpablito180.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
