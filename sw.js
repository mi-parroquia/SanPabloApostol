const CACHE_NAME = "parroquia-demo-v3";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/iglesia1.jpg",
  "/SanPablito.png",
  "/Confesionescarta.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 activa inmediato

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // 🔥 toma control inmediato
});

// FETCH (IMPORTANTE: network-first para HTML)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // 🔥 HTML siempre fresco
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("/index.html")
      )
    );
    return;
  }

  // 🔥 assets cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});
