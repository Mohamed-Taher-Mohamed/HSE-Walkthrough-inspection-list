const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/HSE-Walkthrough-inspection-list/",
  "/HSE-Walkthrough-inspection-list/index.html",
  "/HSE-Walkthrough-inspection-list/style.css",
  "/HSE-Walkthrough-inspection-list/script.js",
  "/HSE-Walkthrough-inspection-list/icons/icon-192.png",
  "/HSE-Walkthrough-inspection-list/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
