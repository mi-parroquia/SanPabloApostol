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

// Instalación: cache inicial + activación inmediata
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // activa SW inmediatamente
  );
});

// Activación: elimina caches antiguos y toma control inmediato
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim()) // controla todas las pestañas
  );
});

// Fetch: primero cache, luego red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Mensaje opcional para informar al cliente (React) sobre nuevas versiones
self.addEventListener("message", event => {
  if(event.data && event.data.type === "SKIP_WAITING"){
    self.skipWaiting();
  }
});
