// Service worker for the web app (filled in by scripts/pwa.js).
// The app shell is precached so the app opens offline; books, fonts and covers are cached the first time they load.
// iPhones limit how much a web app can store, so nothing big is downloaded ahead of time.
const VERSION = '3ba1a13358';
const BASE = '/deepstash-clone/';
const SHELL = ["/deepstash-clone/_expo/static/js/web/[game]-54b06c1d5c384b9c4ead77750a3c3745.js","/deepstash-clone/_expo/static/js/web/[id]-23d85ace5453a7a08fba4db288183d85.js","/deepstash-clone/_expo/static/js/web/[id]-3f485c29a6de7840fdc67d7d495ab372.js","/deepstash-clone/_expo/static/js/web/[id]-5dd63b65299f9769c602da2a43e88792.js","/deepstash-clone/_expo/static/js/web/[id]-66aef9dd60eb36e85e4dd73b5056525a.js","/deepstash-clone/_expo/static/js/web/[id]-6e3367bf96fd19d123f2e8c182e554a0.js","/deepstash-clone/_expo/static/js/web/[id]-960720c16b9e0a120fbcb9ec5cdb0897.js","/deepstash-clone/_expo/static/js/web/[id]-a7c925c7f157b6d7f37e9e7bf8c2cf76.js","/deepstash-clone/_expo/static/js/web/[id]-eccc78a54a8388becf2ff3143ad5beb1.js","/deepstash-clone/_expo/static/js/web/__common-9ab3c137ac4fbf23864b53f0e61d5a64.js","/deepstash-clone/_expo/static/js/web/__expo-metro-runtime-8c088df87a31e4e6accd81c554ec290d.js","/deepstash-clone/_expo/static/js/web/_layout-33a90b7d4e95bc4c1830b2a4a99f8ab3.js","/deepstash-clone/_expo/static/js/web/_layout-b0ecd7e79578a2b60b54097fe20281b9.js","/deepstash-clone/_expo/static/js/web/brain-dd640b48c23fdc9621221389bc969b5e.js","/deepstash-clone/_expo/static/js/web/entry-da3c832f8daf3f964ed0203051d2404b.js","/deepstash-clone/_expo/static/js/web/explore-bf1bed3bfaa428e93c5f1966823fb72e.js","/deepstash-clone/_expo/static/js/web/favorites-fe4736e59ee537703ef23ff3218c6708.js","/deepstash-clone/_expo/static/js/web/find-0387e53d39c2ded5f8cb5922c8a5cbd1.js","/deepstash-clone/_expo/static/js/web/highlights-60758ed2461fe971b043f07e0c03b6ba.js","/deepstash-clone/_expo/static/js/web/html2canvas-pro-9e38fb425fcaacaa0124221ec8627191.js","/deepstash-clone/_expo/static/js/web/index-7d86b1af0b472901a19980fd99e10bf2.js","/deepstash-clone/_expo/static/js/web/index-b5e1ea7077735edb271eba6c8d774b3d.js","/deepstash-clone/_expo/static/js/web/jszip-a2fb4f242cbfbf237ed5791fa338514f.js","/deepstash-clone/_expo/static/js/web/library-f9b794fdd6da0e75ade31ac592ca19de.js","/deepstash-clone/_expo/static/js/web/librivox-d0d269b4178b95dafde1e5914f0888f0.js","/deepstash-clone/_expo/static/js/web/onboarding-ff36f83029531ac4d732f5f1353165b1.js","/deepstash-clone/_expo/static/js/web/profile-e50a76e94859f7101ef7f465e7f30ca7.js","/deepstash-clone/_expo/static/js/web/quiz-5b10c5202d7e87290fa4ca19cb192785.js","/deepstash-clone/_expo/static/js/web/review-50fadd10873ceac68d08806fae3da74c.js","/deepstash-clone/_expo/static/js/web/stashes-a4f449499b506a3355706deadd2bb3cd.js","/deepstash-clone/_expo/static/js/web/test-ea0629bec3002fce4b903d56820a24cf.js","/deepstash-clone/_expo/static/js/web/voices-56357ee760b45d97a2402ff7c4a55988.js","/deepstash-clone/","/deepstash-clone/manifest.webmanifest","/deepstash-clone/pwa/icon-180.png","/deepstash-clone/pwa/icon-192.png","/deepstash-clone/pwa/icon-512.png"];
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
