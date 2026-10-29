// Imports the EPUBs in the private my-books/ folder onto the app's "My books" shelf (see my-books/README.md).
// No license or sidecar is needed: these are your own copies. Everything is written to src/data/my-books/, which Git
// ignores, and no tracked file is touched, so nothing from my-books/ can end up in the repository.
// Runs as the first step of: npm run books
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.join(__dirname, '..');
const inDir = path.join(root, 'my-books');
const outDir = path.join(root, 'src', 'data', 'my-books');

const TOPICS = new Set([
  ...fs.readdirSync(path.join(root, 'src', 'data', 'library')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')),
  'poetry',
]);

/** "Leading Change (Kotter).epub" -> "my-leading-change-kotter". The prefix keeps ids apart from shared books. */
function idFor(file) {
  const slug = file
    .replace(/\.epub$/i, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `my-${slug || 'book'}`;
}

async function findCover(title, author) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&fields=cover_i&limit=5`;
    const res = await fetch(url, { headers: { 'User-Agent': 'deepstash-clone cover lookup' } });
    if (!res.ok) return undefined;
    const { docs } = await res.json();
    return docs.find((d) => d.cover_i)?.cover_i;
  } catch {
    return undefined; // offline: the app draws a plain cover instead
  }
}

(async () => {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 18)) {
    console.error(`Node.js 22.18 or newer is needed (you have ${process.versions.node}).`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const epubs = fs.existsSync(inDir) ? fs.readdirSync(inDir).filter((f) => f.toLowerCase().endsWith('.epub')) : [];
  const existing = Object.fromEntries(
    fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith('.meta.json'))
      .map((f) => {
        const meta = JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf8'));
        return [meta.id, meta];
      }),
  );

  const { parseEpub } = await import(pathToFileURL(path.join(root, 'src', 'lib', 'epub.ts')).href);
  const kept = new Set();
  for (const file of epubs) {
    const id = idFor(file);
    const sidecarPath = path.join(inDir, file.replace(/\.epub$/i, '.json'));
    let extra = {};
    if (fs.existsSync(sidecarPath)) {
      try {
        extra = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
      } catch (e) {
        console.log(`note ${file}: ignoring its .json (${e.message})`);
      }
    }
    let parsed;
    try {
      parsed = await parseEpub(fs.readFileSync(path.join(inDir, file)), file);
    } catch (e) {
      console.log(`skip ${file}: ${e.message}`);
      continue;
    }
    const title = extra.title || parsed.title;
    const author = extra.author || parsed.author;
    const topicId = TOPICS.has(extra.topicId) ? extra.topicId : '';
    if (extra.topicId && !topicId) console.log(`note ${file}: unknown topicId "${extra.topicId}", showing it without a topic`);
    const previous = existing[id];
    const words = parsed.chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0);
    const meta = {
      id,
      origin: 'private',
      title,
      author,
      year: Number(extra.year) || previous?.year || 0,
      topicId,
      ...(extra.description ? { description: extra.description } : {}),
      addedAt: previous?.addedAt ?? new Date().toISOString(),
      coverId: previous?.title === title && previous?.coverId ? previous.coverId : await findCover(title, author),
      chapters: parsed.chapters.length,
      words,
    };
    fs.writeFileSync(path.join(outDir, `${id}.txt`), JSON.stringify({ chapters: parsed.chapters }));
    fs.writeFileSync(path.join(outDir, `${id}.meta.json`), JSON.stringify(meta, null, 2) + '\n');
    kept.add(id);
    console.log(`ok   my-books/${file}: "${title}" by ${author}, ${parsed.chapters.length} chapters`);
  }

  // Remove books whose EPUB was deleted from my-books/.
  for (const id of Object.keys(existing)) {
    if (kept.has(id)) continue;
    for (const f of [`${id}.txt`, `${id}.meta.json`]) fs.rmSync(path.join(outDir, f), { force: true });
    console.log(`removed ${id} from My books`);
  }
  console.log(`My books: ${kept.size} ${kept.size === 1 ? 'book' : 'books'} (private, not committed).`);
})();
