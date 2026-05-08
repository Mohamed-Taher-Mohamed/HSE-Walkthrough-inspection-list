const CACHE = "hse-cache-v20";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./script.js",
  "./iconn-192.png",
  "./iconn-512.png"
];

// INSTALL

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE).then(cache => {

      return cache.addAll(STATIC_FILES);

    })

  );

});

// ACTIVATE

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE){

            return caches.delete(key);

          }

        })

      );

    }).then(() => self.clients.claim())

  );

});

// FETCH

self.addEventListener("fetch", event => {

  // HTML pages → Network First

  if(event.request.mode === "navigate"){

    event.respondWith(

      fetch(event.request)

        .then(response => {

          const clone = response.clone();

          caches.open(CACHE).then(cache => {

            cache.put(event.request, clone);

          });

          return response;

        })

        .catch(() => caches.match("./index.html"))

    );

    return;

  }

  // Static files → Cache First

  event.respondWith(

    caches.match(event.request)

      .then(cached => {

        return cached || fetch(event.request)

          .then(response => {

            const clone = response.clone();

            caches.open(CACHE).then(cache => {

              cache.put(event.request, clone);

            });

            return response;

          });

      })

  );

});
