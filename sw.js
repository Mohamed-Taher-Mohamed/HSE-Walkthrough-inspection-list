const CACHE_NAME = "app-cache-v2";

const urlsToCache = [
  "/HSE-Walkthrough-inspection-list/",
  "/HSE-Walkthrough-inspection-list/index.html",
  "/HSE-Walkthrough-inspection-list/style.css",
  "/HSE-Walkthrough-inspection-list/script.js",
  "/HSE-Walkthrough-inspection-list/icon-192.png",
  "/HSE-Walkthrough-inspection-list/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate (تنضيف القديم)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch (network-first fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
