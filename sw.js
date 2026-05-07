const CACHE = "hse-cache-v3";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./script.js",
  "./style.css"
];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
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
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        return res || fetch(e.request)
          .then(networkRes => {
            caches.open(CACHE).then(cache => {
              cache.put(e.request, networkRes.clone());
            });
            return networkRes;
          })
          .catch(() => caches.match("./index.html"));
      })
  );
});
