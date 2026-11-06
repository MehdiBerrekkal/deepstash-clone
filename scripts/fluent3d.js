// Maps every emoji used by the language courses to its Fluent Emoji 3D picture (Microsoft, MIT licence; packaged as
// @lobehub/fluent-emoji-3d). Writes src/data/learn/fluent3d.json: emoji → file name. Re-run after adding content.
// Usage: node scripts/fluent3d.js
const fs = require('fs');
const path = require('path');

const PKG = '@lobehub/fluent-emoji-3d@1.1.0';
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'src', 'data', 'learn');
const extra = [path.join(root, 'src', 'components', 'learn'), path.join(root, 'src', 'lib', 'learn')];

const files = [dataDir, ...extra].flatMap((d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => path.join(d, f)) : []));
const re = /\p{Extended_Pictographic}(?:️|⃣|[\u{1F3FB}-\u{1F3FF}])*(?:‍\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])*)*/gu;
const used = new Set();
for (const f of files) for (const m of fs.readFileSync(f, 'utf8').matchAll(re)) used.add(m[0]);

const hex = (s, keepFe0f) => [...s].map((c) => c.codePointAt(0)).filter((c) => keepFe0f || c !== 0xfe0f).map((c) => c.toString(16).padStart(4, '0')).join('-');

(async () => {
  const list = await (await fetch(`https://data.jsdelivr.com/v1/packages/npm/${PKG}?structure=flat`)).json();
  const have = new Map(list.files.map((f) => f.name.replace('/assets/', '').replace('.webp', '')).map((n) => [n.replace(/-fe0f/g, ''), n]));
  const map = {};
  const missing = [];
  for (const e of [...used].sort()) {
    const name = have.get(hex(e, true).replace(/-fe0f/g, '')) ?? have.get(hex(e, false));
    if (name) map[e] = name;
    else missing.push(e);
  }
  fs.writeFileSync(path.join(dataDir, 'fluent3d.json'), JSON.stringify(map));
  console.log(`${Object.keys(map).length} emoji mapped, ${missing.length} without a 3D picture: ${missing.join(' ')}`);
})();
