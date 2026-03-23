const CACHE_NAME = "parroquia-demo-v2"; // cambiar versión para forzar update
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

// INSTALACIÓN: cache inicial + activación inmediata
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // activa SW inmediatamente
  );
});

// ACTIVACIÓN: elimina caches antiguos y toma control
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: cache primero, luego red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// ALERTA DE NUEVA VERSION: envía mensaje a todas las pestañas
self.addEventListener("message", event => {
  if (event.data && event.data.type === "CHECK_FOR_UPDATE") {
    self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
      });
    });
  }
});
