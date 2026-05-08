const CACHE="hse-cache-v50";
const STATIC_FILES=[
  "./",
  "./index.html",
  "./manifest.json",
  "./script.js",
  "./iconn-192.png",
  "./iconn-512.png",
  "./favicon.png"];
self.addEventListener("install",event=>{
self.skipWaiting();
event.waitUntil(
caches.open(CACHE).then(cache=>{
return cache.addAll(STATIC_FILES);
})
);
});
self.addEventListener("activate",event=>{
event.waitUntil(
caches.keys().then(keys=>{
return Promise.all(
keys.map(key=>{
if(key!==CACHE){
return caches.delete(key);
}
})
);
}).then(()=>self.clients.claim())
);
});
self.addEventListener("fetch",event=>{
event.respondWith(
caches.match(event.request).then(cached=>{
if(cached){
return cached;
}
return fetch(event.request).then(response=>{
const clone=response.clone();
caches.open(CACHE).then(cache=>{
cache.put(event.request,clone);
});
return response;
}).catch(()=>{
return caches.match("./index.html");
});
})
);
});
