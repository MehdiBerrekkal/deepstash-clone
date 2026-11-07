// Service worker for the web app (filled in by scripts/pwa.js).
// The app shell is precached so the app opens offline; books, fonts and covers are cached the first time they load.
// iPhones limit how much a web app can store, so nothing big is downloaded ahead of time.
const VERSION = '1ebad7c479';
const BASE = '/deepstash-clone/';
const SHELL = ["/deepstash-clone/_expo/static/js/web/__common-4b07774e44e8124c0dd08b2517a13e1a.js","/deepstash-clone/_expo/static/js/web/__expo-metro-runtime-8c088df87a31e4e6accd81c554ec290d.js","/deepstash-clone/_expo/static/js/web/ar-full-7df00031d96d83c29a812fddf4ad30c6.js","/deepstash-clone/_expo/static/js/web/ar-more1-bf6a41fd3eac84d71162d2e6ba40be52.js","/deepstash-clone/_expo/static/js/web/de-full-265422454a75e23135387d43a97e7124.js","/deepstash-clone/_expo/static/js/web/de-more1-30cb24de64d8cee119b69ddc7de70a20.js","/deepstash-clone/_expo/static/js/web/en-full-62abd2a1e38a89ebca8e4c9c369b9569.js","/deepstash-clone/_expo/static/js/web/en-more1-d56eed5700bb6f2f69b84ad255222389.js","/deepstash-clone/_expo/static/js/web/en-more2-fb8b6742d2665ebd89a4f44b272efd09.js","/deepstash-clone/_expo/static/js/web/entry-72168a90255ed609b7d754f01cbeca8b.js","/deepstash-clone/_expo/static/js/web/es-a1-more-563a5a799f7a1b7609bd23d9e7f297c7.js","/deepstash-clone/_expo/static/js/web/es-a2-more-0d13f373f76c16ac4d1cf50300e339c6.js","/deepstash-clone/_expo/static/js/web/es-b1-more-d1f3816727bf956e44e4fdc12c097fb6.js","/deepstash-clone/_expo/static/js/web/es-full-9cdf237975bbc59fa80c8f6f9bf1d79f.js","/deepstash-clone/_expo/static/js/web/es-more2-24a979cf9bb3e0e6335453e6674e2564.js","/deepstash-clone/_expo/static/js/web/es-more3-a6053744d3777cbb7dbf9bea26ed27f1.js","/deepstash-clone/_expo/static/js/web/es-more4-ce449c6b8f88896a008191cc13b8a114.js","/deepstash-clone/_expo/static/js/web/es-more5-479dcbf4a908ed0de8ab7a8dd7de6b17.js","/deepstash-clone/_expo/static/js/web/fr-full-30fc7bde6b5b114051486f58f2f4aacd.js","/deepstash-clone/_expo/static/js/web/fr-more1-a452d6fb86a39f8b3d13700835b28703.js","/deepstash-clone/_expo/static/js/web/hi-full-1ea53f52bc123028b099fbfe63155af2.js","/deepstash-clone/_expo/static/js/web/hi-more1-eb2933ddb986044a1d2203b1a8faa283.js","/deepstash-clone/_expo/static/js/web/html2canvas-pro-39c9d12423fdefc6fa78be0180672d80.js","/deepstash-clone/_expo/static/js/web/index-c300ed79b69a6ff170c5f7c7136eb58a.js","/deepstash-clone/_expo/static/js/web/it-full-9690e4d092f368cd3015e4a2371ff296.js","/deepstash-clone/_expo/static/js/web/it-more1-ed9becc612a9b885b5f8f43da0f5757e.js","/deepstash-clone/_expo/static/js/web/ja-full-943b14d5e170bc0dcd3b1857c01eda1f.js","/deepstash-clone/_expo/static/js/web/ja-more1-80da78dcd1bf185df3becaeaff1d64d8.js","/deepstash-clone/_expo/static/js/web/jszip-a018d315fb28be5d8058c6033419d6ad.js","/deepstash-clone/_expo/static/js/web/kana-strokes-24a856a3dfc030de55ff0fd39f36ca87.js","/deepstash-clone/_expo/static/js/web/ko-full-93b71040a28fa2fd6f920c7b664f03d1.js","/deepstash-clone/_expo/static/js/web/ko-more1-c87a092f79be28b91e8b2cbcd4563510.js","/deepstash-clone/_expo/static/js/web/librivox-44510cf73a6b8ca960e80c4bab7ecd89.js","/deepstash-clone/_expo/static/js/web/nl-full-e025e018312464a6e1d16b6abce17602.js","/deepstash-clone/_expo/static/js/web/nl-more1-b6884df7bc82e5d902be20ce4e1cdd37.js","/deepstash-clone/_expo/static/js/web/pt-full-82b183f0b0730e50055e2869698c86b1.js","/deepstash-clone/_expo/static/js/web/pt-more1-d284359d44cb64c805bc434fe987b1af.js","/deepstash-clone/_expo/static/js/web/ru-full-98523337e62db569577975c700b29af3.js","/deepstash-clone/_expo/static/js/web/ru-more1-1135fc5663c66cbb2e9b2cfd36dfe129.js","/deepstash-clone/_expo/static/js/web/tr-full-cbe7aa19c3a2c9c143b0abb0c4e5e6dd.js","/deepstash-clone/_expo/static/js/web/tr-more1-8ab1c3e36c05276dbe513f3d0168571e.js","/deepstash-clone/_expo/static/js/web/zh-full-396d3cacfe678cd1dc5c82babf522dc5.js","/deepstash-clone/_expo/static/js/web/zh-more1-2194b3189dcf55b6b474abcf0a9aeedd.js","/deepstash-clone/","/deepstash-clone/manifest.webmanifest","/deepstash-clone/pwa/icon-180.png","/deepstash-clone/pwa/icon-192.png","/deepstash-clone/pwa/icon-512.png"];
const SHELL_CACHE = `shell-${VERSION}`;
const ASSET_CACHE = 'assets-v1';
const REMOTE_CACHE = 'remote-v1';
// Cross-origin files worth keeping: book covers, the PDF engine, and the natural voices (engine + voice models),
// so they work offline after the first use.
const REMOTE =
  /^https:\/\/(covers\.openlibrary\.org|standardebooks\.org\/images|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net\/npm\/(@mintplex-labs\/piper-tts-web|onnxruntime-web|@diffusionstudio\/piper-wasm|@lobehub\/fluent-emoji-3d)@|huggingface\.co\/diffusionstudio\/piper-voices\/)/;

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
