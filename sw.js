/* Service Worker – macht die App offline nutzbar */
const CACHE = "olivia-it-v27";
const ASSETS = [
  ".",
  "index.html",
  "styles.css",
  "app.js",
  "lesson.js",
  "data.js",
  "data-lesson.js",
  "data-vocab-extra.js",
  "data-verbs.js",
  "icon.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: erst aus dem Cache, sonst Netzwerk (und dann cachen)
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return resp;
      }).catch(() => caches.match("index.html"));
    })
  );
});
