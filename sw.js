const cachedFiles = [
  "first.html",
  "second.html",
  "main.js",
  "error.html",
  "offline.html",
  "manifest.json",
  "icon512_maskable.png",
  "icon512_rounded.png"
];
const Pages = "pages"
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(Pages).then((cache) => {
      return cache.addAll(cachedFiles);
    })
  );
  console.log("Installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status === 404) {
            return caches.match("error.html");
          }
          return caches.open(Pages).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match("offline.html"));
    })
  );
});