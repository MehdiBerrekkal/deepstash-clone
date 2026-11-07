#!/usr/bin/env node
/**
 * Matches our public-domain books to LibriVox recordings (free, public-domain audiobooks read by volunteers) and
 * writes src/data/librivox.json: per book, the recording's chapters (MP3 on archive.org), reader names and lengths.
 * The LibriVox API can't be called from the web app (no CORS), so this runs ahead of time:
 *   node scripts/librivox.js
 * Only books from the shared books/ catalog and the downloadable catalog are matched, never private files.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const books = [...require(path.join(root, 'src/data/classics/index.json')).filter((b) => b.origin !== 'private'), ...require(path.join(root, 'src/data/catalog.json'))];
const out = path.join(root, 'src/data/librivox.json');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

async function get(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'deepstash-clone librivox matcher (personal reading app)' } });
      if (res.ok) return res.json();
      if (res.status === 404) return null;
    } catch {
      // retry
    }
    await wait(1500 * (i + 1));
  }
  return null;
}

/** A short title to search with: "Candide, ou l'optimisme" → "Candide". */
const searchTitle = (t) => t.replace(/[,:;(].*$/, '').replace(/^the /i, '').trim();

async function match(book) {
  const lang = book.lang === 'fr' ? 'French' : 'English';
  const last = norm(book.author).split(' ').pop();
  const data = await get(`https://librivox.org/api/feed/audiobooks?title=${encodeURIComponent('^' + searchTitle(book.title))}&format=json&extended=1&limit=30`);
  const candidates = (data?.books ?? []).filter(
    (p) =>
      p.language === lang &&
      Number(p.num_sections) > 0 &&
      p.authors?.some((a) => norm(`${a.first_name} ${a.last_name}`).includes(last)) &&
      norm(p.title).includes(norm(searchTitle(book.title)).split(' ').slice(0, 3).join(' ')) &&
      !/dramatic reading|abridged|version \d+ \(dramatic|selections/i.test(p.title) &&
      // Only recordings of the whole work, so the narration lines up with our text.
      (!/\b(book|books|vol\.?|volume|livre|tome|part|partie)\s+([0-9]+|[ivx]+)\b/i.test(p.title) || /\b(book|vol|volume|livre|tome|part)\b/i.test(book.title)),
  );
  if (!candidates.length) return null;
  const scored = candidates.map((p) => {
    const readers = new Set(p.sections.flatMap((s) => (s.readers ?? []).map((r) => r.display_name)));
    // Solo readings sound consistent; then prefer complete, newer recordings.
    return { p, readers: [...readers], score: (readers.size === 1 ? 1000 : 0) + Number(p.num_sections) + Number(p.id) / 100000 };
  });
  scored.sort((a, b) => b.score - a.score);
  const { p, readers } = scored[0];
  const sections = p.sections
    .filter((s) => s.listen_url)
    .sort((a, b) => Number(a.section_number) - Number(b.section_number))
    .map((s) => ({ t: s.title, u: s.listen_url.replace(/^http:/, 'https:'), s: Number(s.playtime) || 0, r: s.readers?.[0]?.display_name }));
  if (!sections.length) return null;
  return { project: p.title, url: p.url_librivox, readers, solo: readers.length === 1, secs: sections.reduce((n, s) => n + s.s, 0), sections };
}

(async () => {
  const result = {};
  for (const b of books) {
    const m = await match(b);
    if (m) result[b.id] = m;
    console.log(`${m ? '🎙' : '  '} ${b.id}${m ? ` → ${m.project} (${m.solo ? m.readers[0] : `${m.readers.length} readers`}, ${Math.round(m.secs / 3600)} h, ${m.sections.length} parts)` : ''}`);
    await wait(400);
  }
  fs.writeFileSync(out, JSON.stringify(result));
  // A tiny list of which books have narration, for badges, without loading every recording's chapters.
  fs.writeFileSync(path.join(root, 'src/data/librivox-ids.json'), JSON.stringify(Object.keys(result)));
  console.log(`\n${Object.keys(result).length} of ${books.length} books have a human narration → ${path.relative(root, out)}`);
})();
