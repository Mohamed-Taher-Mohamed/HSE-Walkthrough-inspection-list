const CACHE_NAME = 'hse-v6';

// ✅ مش بنعرف الـ ASSETS مسبقاً — بنكتشفها تلقائياً
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // نحفظ الصفحة الرئيسية فقط عند التثبيت
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./script.js",
        "./iconn-192.png",
        "./iconn-512.png",
        "./favicon.png"
      ]).catch(err => {
        console.warn('SW install cache error (ignored):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // ✅ Firebase و Google APIs — دايماً من الشبكة
  if (
    url.includes('firebase') ||
    url.includes('googleapis') ||
    url.includes('gstatic') ||
    url.includes('firebaseio') ||
    url.includes('firestore')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // ✅ باقي الطلبات — Cache First ثم Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // احفظ في الكاش لو الرد صح
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      return caches.match('./index.html');
    })
  );
});
