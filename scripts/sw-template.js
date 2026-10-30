// Service worker for the web app (filled in by scripts/pwa.js).
// The app shell is precached so the app opens offline; books, fonts and covers are cached the first time they load.
// iPhones limit how much a web app can store, so nothing big is downloaded ahead of time.
const VERSION = '__VERSION__';
const BASE = '__BASE__';
const SHELL = __SHELL__;
const SHELL_CACHE = `shell-${VERSION}`;
const ASSET_CACHE = 'assets-v1';
const REMOTE_CACHE = 'remote-v1';
// Cross-origin files worth keeping: book covers, the PDF engine, and the natural voices (engine + voice models),
// so they work offline after the first use.
const REMOTE =
  /^https:\/\/(covers\.openlibrary\.org|standardebooks\.org\/images|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net\/npm\/(@mintplex-labs\/piper-tts-web|onnxruntime-web|@diffusionstudio\/piper-wasm)@|huggingface\.co\/diffusionstudio\/piper-voices\/)/;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('shell-') && k !== SHELL_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone()).catch(() => {});
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Pages: try the network for the newest version, fall back to the cached app when offline.
  if (request.mode === 'navigate' && url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    event.respondWith(
      fetch(request)
        .then((r) => (r.ok || r.status === 404 ? r : Promise.reject(r)))
        .catch(() => caches.match(BASE, { ignoreSearch: true }).then((r) => r || caches.match(`${BASE}index.html`))),
    );
    return;
  }
  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    // Built files have content hashes in their names, so a cached copy is always right.
    event.respondWith(caches.match(request).then((r) => r || cacheFirst(request, ASSET_CACHE)));
    return;
  }
  if (REMOTE.test(request.url)) event.respondWith(cacheFirst(request, REMOTE_CACHE).catch(() => fetch(request)));
});
