// Looks up each library book on Open Library and writes src/data/covers.json ({ bookId: coverId }).
// Covers are then loaded from https://covers.openlibrary.org/b/id/<coverId>-M.jpg. Re-run after adding books.
// Books already in covers.json are skipped, so a hand-picked cover id there is kept.
const fs = require('fs');
const path = require('path');

const libraryDir = path.join(__dirname, '..', 'src', 'data', 'library');
const outFile = path.join(__dirname, '..', 'src', 'data', 'covers.json');

const books = fs
  .readdirSync(libraryDir)
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(libraryDir, f), 'utf8')).books)
  .filter((b) => b.kind === 'book');

const existing = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};

async function search(book, language) {
  const author = book.author.split(/[&,]| et al/)[0].trim();
  const url =
    `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(author)}` +
    `${language ? `&language=${language}` : ''}&fields=cover_i&limit=5`;
  const res = await fetch(url, { headers: { 'User-Agent': 'deepstash-clone cover lookup' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { docs } = await res.json();
  return docs.find((d) => d.cover_i)?.cover_i ?? null;
}

// Prefer an English edition's cover, fall back to any edition.
const lookup = async (book) => (await search(book, 'eng')) ?? (await search(book));

(async () => {
  const covers = { ...existing };
  for (const book of books) {
    if (covers[book.id]) continue;
    try {
      const id = await lookup(book);
      if (id) covers[book.id] = id;
      console.log(`${id ? 'ok  ' : 'none'} ${book.title}`);
    } catch (e) {
      console.log(`fail ${book.title}: ${e.message}`);
    }
  }
  fs.writeFileSync(outFile, JSON.stringify(covers, null, 2) + '\n');
  console.log(`Wrote ${Object.keys(covers).length}/${books.length} covers to src/data/covers.json`);
})();
