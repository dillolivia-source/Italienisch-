/* Service Worker – macht die App offline nutzbar */
const CACHE = "olivia-it-v35";
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

// App-eigene Dateien: NETWORK-FIRST → online immer die neueste Version,
// offline der Cache als Fallback. Fremde Ressourcen: cache-first.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    event.respondWith(
      fetch(event.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return resp;
      }).catch(() =>
        caches.match(event.request).then(c => c || caches.match("index.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});
