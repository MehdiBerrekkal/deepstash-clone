// Turns the web export (dist/) into an installable, offline-capable app for GitHub Pages:
// icons + web manifest, iPhone home-screen tags, a service worker, 404.html for deep links and .nojekyll.
// Runs after `expo export -p web`, with the same WEB_BASE_URL (see .github/workflows/deploy-web.yml).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { generateImageAsync } = require('@expo/image-utils');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const app = require(path.join(root, 'app.json')).expo;
const base = `${(process.env.WEB_BASE_URL ?? '').replace(/\/$/, '')}/`;
const NAME = 'DeepStach';
const BACKGROUND = '#0F1115';
const ACCENT = '#F2B84B';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

(async () => {
  if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('Run `npx expo export -p web` first.');

  // Private books must never be published.
  const leaked = walk(dist).filter((f) => /my-books|[\\/]my-[a-z0-9-]+\.(txt|pdf)$/i.test(f));
  if (leaked.length) throw new Error(`Refusing to publish private books: ${leaked.join(', ')}`);

  // Icons: 180 for iPhone home screens, 192 and 512 for the manifest.
  fs.mkdirSync(path.join(dist, 'pwa'), { recursive: true });
  for (const size of [180, 192, 512]) {
    const { source } = await generateImageAsync(
      { projectRoot: root, cacheType: 'pwa-icons' },
      { src: path.join(root, app.icon), width: size, height: size, resizeMode: 'cover', backgroundColor: BACKGROUND, removeTransparency: true },
    );
    fs.writeFileSync(path.join(dist, 'pwa', `icon-${size}.png`), source);
  }

  fs.writeFileSync(
    path.join(dist, 'manifest.webmanifest'),
    JSON.stringify(
      {
        name: NAME,
        short_name: NAME,
        description: 'Big ideas from great books, full classics to read and listen to, quotes, poems and knowledge.',
        id: base,
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'any',
        background_color: BACKGROUND,
        theme_color: BACKGROUND,
        icons: [
          { src: `${base}pwa/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}pwa/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${base}pwa/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
  );

  // The app shell is precached; everything else (books, fonts, covers) is cached the first time it's opened.
  const shell = walk(dist)
    .map((f) => path.relative(dist, f).split(path.sep).join('/'))
    .filter((f) => f === 'index.html' || f === 'manifest.webmanifest' || /^_expo\/static\/(js|css)\//.test(f) || /^pwa\//.test(f))
    .map((f) => base + (f === 'index.html' ? '' : f));
  const version = crypto.createHash('sha1').update(shell.join('\n')).digest('hex').slice(0, 10);
  const sw = fs
    .readFileSync(path.join(__dirname, 'sw-template.js'), 'utf8')
    .replace('__VERSION__', version)
    .replace('__BASE__', base)
    .replace('__SHELL__', JSON.stringify(shell));
  fs.writeFileSync(path.join(dist, 'sw.js'), sw);

  // Home-screen tags for iPhone, the manifest, notch-aware layout, and the service worker.
  const head = [
    `<link rel="manifest" href="${base}manifest.webmanifest">`,
    `<link rel="apple-touch-icon" href="${base}pwa/icon-180.png">`,
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
    `<meta name="apple-mobile-web-app-title" content="${NAME}">`,
    `<meta name="theme-color" content="${BACKGROUND}">`,
    `<style>html,body{background:${BACKGROUND};overscroll-behavior:none}</style>`,
    `<script>if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('${base}sw.js',{scope:'${base}'})})}</script>`,
  ].join('');
  let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  html = html.replace(/<meta name="viewport"[^>]*>/, '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no">');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${NAME}</title>`);
  html = html.replace('</head>', `${head}</head>`);
  fs.writeFileSync(path.join(dist, 'index.html'), html);
  // GitHub Pages serves 404.html for unknown paths, so deep links like /reader/... load the app too.
  fs.writeFileSync(path.join(dist, '404.html'), html);
  fs.writeFileSync(path.join(dist, '.nojekyll'), '');

  console.log(`PWA ready: ${shell.length} shell files precached (sw ${version}), base ${base}, accent ${ACCENT}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
