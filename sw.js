const CACHE = "hse-cache-v10";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./iconn-192.png",
  "./iconn-512.png",
  "./script.js",
  "./style.css"
];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE){
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => caches.match("./index.html"));
      })
  );
});
