// Service worker for the web app (filled in by scripts/pwa.js).
// The app shell is precached so the app opens offline; books, fonts and covers are cached the first time they load.
// iPhones limit how much a web app can store, so nothing big is downloaded ahead of time.
const VERSION = '9e16724c20';
const BASE = '/deepstash-clone/';
const SHELL = ["/deepstash-clone/_expo/static/js/web/__common-cc31ba3886589f8a7051e7f938562804.js","/deepstash-clone/_expo/static/js/web/__expo-metro-runtime-8c088df87a31e4e6accd81c554ec290d.js","/deepstash-clone/_expo/static/js/web/ar-full-9d023a179b4c74518a826edf80c0b2c8.js","/deepstash-clone/_expo/static/js/web/ar-more1-f29ed3bab7d2659e46bdd712eefdaf77.js","/deepstash-clone/_expo/static/js/web/de-full-6957c014ba1796dfb9ce319418f7fed9.js","/deepstash-clone/_expo/static/js/web/de-more1-2550491b4e6fe66aacd1329bc668f634.js","/deepstash-clone/_expo/static/js/web/en-full-e4dd21b016bf9e1ca9ad6a5ce4bb2802.js","/deepstash-clone/_expo/static/js/web/en-more1-2ff3d09532858f4a5f9b3b6f556e27e0.js","/deepstash-clone/_expo/static/js/web/en-more2-c80ee572b09838f523fcb9cabdedd60a.js","/deepstash-clone/_expo/static/js/web/entry-ebf664b5efcc725e6667dc008dd95f25.js","/deepstash-clone/_expo/static/js/web/es-a1-more-6229ee71c9bbf5afa6c4eb9617fc5d86.js","/deepstash-clone/_expo/static/js/web/es-a2-more-f8b336d2c4a3ee9c1c93aea87c2d51d0.js","/deepstash-clone/_expo/static/js/web/es-b1-more-645ca1a8f4a95f303d6caa28af759195.js","/deepstash-clone/_expo/static/js/web/es-full-e4e441cf663a0611114d8f68877e34ef.js","/deepstash-clone/_expo/static/js/web/es-more2-7eb6b9651690dd7a010d057584dbb295.js","/deepstash-clone/_expo/static/js/web/es-more3-9b98f2a5e59aa790634ddd083dd07859.js","/deepstash-clone/_expo/static/js/web/es-more4-78d5e8c5f323a480f8fb1a6d8483eec3.js","/deepstash-clone/_expo/static/js/web/es-more5-1e50385d804d41eb29e44dee843a40aa.js","/deepstash-clone/_expo/static/js/web/fr-full-4b7254a27bcd736668582ab5a7552238.js","/deepstash-clone/_expo/static/js/web/fr-more1-44ba325b792e71c42b2b441594dea215.js","/deepstash-clone/_expo/static/js/web/hi-full-847c298ae8010d4b54dc6cb027c71c08.js","/deepstash-clone/_expo/static/js/web/hi-more1-3a9cdeacb07628e8eb478472a793de6e.js","/deepstash-clone/_expo/static/js/web/html2canvas-pro-f156789e8e55f61c0ac09d71c6ed3726.js","/deepstash-clone/_expo/static/js/web/index-577791202fb7f69c88d063d5deff7d1a.js","/deepstash-clone/_expo/static/js/web/it-full-689feee6540e12a5854da5b7e1ae1e1c.js","/deepstash-clone/_expo/static/js/web/it-more1-916a3e0c1ff535d81e7b8811e34fa5d2.js","/deepstash-clone/_expo/static/js/web/ja-full-50addf963ed610d55b5aefa3ebc64c09.js","/deepstash-clone/_expo/static/js/web/ja-more1-f9c2d670d563ac3a141864af85244aa1.js","/deepstash-clone/_expo/static/js/web/jszip-13604108381bea1c5e8e280145a1e831.js","/deepstash-clone/_expo/static/js/web/kana-strokes-4574568224685c7a8b8e7c6f154a9d5e.js","/deepstash-clone/_expo/static/js/web/ko-full-b59b9ccf3fdb168328bf9e94955281f7.js","/deepstash-clone/_expo/static/js/web/ko-more1-55d1b54d54fa92ccaadfb8145a402f8d.js","/deepstash-clone/_expo/static/js/web/librivox-c0c380d247afd20b60b844f8ee3f05b7.js","/deepstash-clone/_expo/static/js/web/nl-full-1986099787713f24ddf67dadd728bafe.js","/deepstash-clone/_expo/static/js/web/nl-more1-c65d93052be5a69c4aa9e0e03a2fa7c5.js","/deepstash-clone/_expo/static/js/web/pt-full-e006bd1b70f9e5d8e7657fb98fb55ba7.js","/deepstash-clone/_expo/static/js/web/pt-more1-a074a2ed75abdc530e7d90bb8528f92a.js","/deepstash-clone/_expo/static/js/web/ru-full-dd6188db2c13a04144c07a718cf4c315.js","/deepstash-clone/_expo/static/js/web/ru-more1-0194bb1bf1f5603e5be053c7b1b945ef.js","/deepstash-clone/_expo/static/js/web/tr-full-cb65f56c56a5dab789726d05d18757cb.js","/deepstash-clone/_expo/static/js/web/tr-more1-c4cdbc49d9302148bc693cac088d470d.js","/deepstash-clone/_expo/static/js/web/zh-full-f1d309d427cc21a0add44867285bee7e.js","/deepstash-clone/_expo/static/js/web/zh-more1-7d805dc47df3f12b4b649e08d63f2891.js","/deepstash-clone/","/deepstash-clone/manifest.webmanifest","/deepstash-clone/pwa/icon-180.png","/deepstash-clone/pwa/icon-192.png","/deepstash-clone/pwa/icon-512.png"];
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
