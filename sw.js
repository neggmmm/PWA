// Name of your cache
const pages = "Pages";

// Files to cache during installation
const FILES_TO_CACHE = [
  "first.html",
  "second.html",
  "main.js",
  "offline.html",
  "404.html",
  "manifest.json",
  "icon512_maskable.png",
  "icon512_rounded.png"
];

/* 
  INSTALL EVENT:
  → Runs once when the service worker is first installed
  → Pre-caches all the important static files
*/
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed ✅");
  event.waitUntil(
    caches.open(pages).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

/* 
  ACTIVATE EVENT:
  → Used to clean up old caches when a new version is activated
*/
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated 🚀");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== pages) {
            console.log("Service Worker: Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

/* 
  FETCH EVENT:
  → Intercepts all requests
  → Serves cached files first (offline support)
  → Falls back to network if not cached
  → If offline, shows offline.html
  → If 404, shows 404.html
  → Caches any new successful requests dynamically
*/
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1️⃣ Return from cache if available
      if (cachedResponse) {
        console.log('Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // 2️⃣ Otherwise, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Handle 404 and other error responses
          if (!networkResponse || networkResponse.status === 404) {
            console.log('404 error, serving 404.html');
            return caches.match("404.html");
          }

          // Only cache successful responses
          if (networkResponse.status === 200) {
            // 3️⃣ Save successful responses to cache dynamically
            return caches.open(pages).then((cache) => {
              console.log('Caching new request:', event.request.url);
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }

          return networkResponse;
        })
        // 4️⃣ If offline or network error, show offline page
        .catch((error) => {
          console.log('Network error, serving offline page:', error);
          return caches.match("offline.html");
        });
    })
  );
});
