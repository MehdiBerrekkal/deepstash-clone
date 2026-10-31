import { parseEpub, parseHtmlBook } from '@/lib/epub';
import type { FullBook } from '@/lib/fullbook';

/**
 * "Find a book": search free, legal sources and download a book straight into the Library.
 *
 * - Project Gutenberg, through the copies the Internet Archive keeps in its "gutenberg" collection (the Archive
 *   allows downloads from web apps; gutenberg.org itself doesn't).
 * - Standard Ebooks (carefully produced public-domain EPUBs).
 *
 * Only books that are public domain in Europe can be downloaded: every author and translator must have died more
 * than 70 years ago. When a date is unknown, the book links to its source instead.
 */

export type Lang = 'en' | 'fr';
export type FoundBook = {
  key: string;
  source: 'gutenberg' | 'standard';
  title: string;
  /** Display names, e.g. ["Victor Hugo"]. */
  authors: string[];
  /** People whose death year decides the copyright: authors, translators, editors. */
  people: { name: string; died?: number; role?: string }[];
  lang: Lang | 'other';
  cover?: string;
  downloads?: number;
  /** Where to read it on the web. */
  pageUrl: string;
  description?: string;
  /** Archive identifier or Standard Ebooks path. */
  ref: string;
};

/** Public domain in the EU this year: everyone involved died at least 71 years ago (life + 70, from 1 January). */
export function publicDomainEU(people: FoundBook['people'], year = new Date().getFullYear()) {
  if (!people.length) return false;
  return people.every((p) => p.died !== undefined && p.died <= year - 71);
}

// ---------- Project Gutenberg via the Internet Archive ----------

const IA_LANG: Record<Lang, string> = { en: '(eng OR en OR English)', fr: '(fre OR fr OR fra OR French)' };

/** "Hugo, Victor, 1802-1885" → { name: "Victor Hugo", died: 1885 }; "[Translator]" kept as the role. */
export function parseCreator(raw: string): FoundBook['people'][number] {
  const role = raw.match(/\[([^\]]+)\]/)?.[1];
  const s = raw.replace(/\[[^\]]+\]/g, '').trim();
  // Life dates at the end: "1802-1885", "-1872", "4 BC-65". An open range ("1950-") means still living.
  const dates = s.match(/,\s*(?:\d{1,4}\??\s*(?:BC|B\.C\.)?)?\s*-\s*(\d{1,4})\??\s*(BC|B\.C\.)?\s*$/);
  const base = s.replace(/,\s*[^,]*\d[^,]*$/, '').replace(/\s*\([^)]*\)/g, '').trim();
  const parts = base.split(',').map((x) => x.trim()).filter(Boolean);
  const name = parts.length === 2 ? `${parts[1]} ${parts[0]}` : base;
  const died = dates ? Number(dates[1]) * (dates[2] ? -1 : 1) : undefined;
  return { name: name.replace(/\s+/g, ' '), died, role };
}

function iaLang(l: unknown): FoundBook['lang'] {
  const v = String(Array.isArray(l) ? l[0] : l ?? '').toLowerCase();
  return /^(eng|en|english)/.test(v) ? 'en' : /^(fre|fr|fra|french)/.test(v) ? 'fr' : 'other';
}

async function searchGutenberg(query: string, lang: Lang | 'all'): Promise<FoundBook[]> {
  const q = query.replace(/[():"]/g, ' ').trim();
  const terms = `(title:(${q}) OR creator:(${q}))`;
  const langQ = lang === 'all' ? `(language:${IA_LANG.en} OR language:${IA_LANG.fr})` : `language:${IA_LANG[lang]}`;
  const params = new URLSearchParams({ q: `collection:gutenberg AND ${terms} AND ${langQ}`, rows: '40', output: 'json' });
  for (const f of ['identifier', 'title', 'creator', 'language', 'downloads', 'description']) params.append('fl[]', f);
  params.append('sort[]', 'downloads desc');
  const res = await fetch(`https://archive.org/advancedsearch.php?${params}`);
  if (!res.ok) throw new Error('The Gutenberg collection is not answering right now.');
  const docs = ((await res.json()).response?.docs ?? []) as Record<string, unknown>[];
  return docs.map((d) => {
    const creators = (Array.isArray(d.creator) ? d.creator : d.creator ? [d.creator] : []) as string[];
    const people = creators.map(parseCreator);
    const id = String(d.identifier);
    const desc = Array.isArray(d.description) ? d.description.join(' ') : (d.description as string | undefined);
    return {
      key: `ia:${id}`,
      source: 'gutenberg' as const,
      title: String(Array.isArray(d.title) ? d.title[0] : d.title ?? 'Untitled'),
      authors: people.filter((p) => !p.role).map((p) => p.name).slice(0, 3),
      people,
      lang: iaLang(d.language),
      cover: `https://archive.org/services/img/${id}`,
      downloads: Number(d.downloads ?? 0),
      pageUrl: `https://archive.org/details/${id}`,
      description: desc?.replace(/<[^>]+>/g, '').slice(0, 600),
      ref: id,
    };
  });
}

/** Decodes Gutenberg files, which are UTF-8 or Latin-1. */
function decodeText(buf: ArrayBuffer, hint = '') {
  const utf8 = new TextDecoder('utf-8').decode(buf);
  const declared = /charset\s*=\s*["']?(iso-8859-1|latin-1|windows-1252)/i.test(utf8.slice(0, 3000)) || /-8\.(txt|htm)/.test(hint);
  if (declared || (utf8.match(/�/g)?.length ?? 0) > 20) return new TextDecoder('windows-1252').decode(buf);
  return utf8;
}

async function downloadGutenberg(b: FoundBook, onProgress: (f: number) => void): Promise<FullBook> {
  const meta = await (await fetch(`https://archive.org/metadata/${b.ref}`)).json();
  const files = ((meta.files ?? []) as { name: string; size?: string }[]).map((f) => f.name);
  const html = files.find((f) => /-h\.html?$/i.test(f)) ?? files.find((f) => /\.html?$/i.test(f) && !/_files\//.test(f));
  const text = files.find((f) => /-0\.txt$/.test(f)) ?? files.find((f) => /-8\.txt$/.test(f)) ?? files.find((f) => /\.txt$/.test(f) && !/_(meta|files)/.test(f));
  const pick = html ?? text;
  if (!pick) throw new Error('No readable file was found for this book.');
  onProgress(0.2);
  const buf = await fetchWithProgress(`https://archive.org/download/${b.ref}/${pick.split('/').map(encodeURIComponent).join('/')}`, (f) => onProgress(0.2 + f * 0.7));
  const raw = decodeText(buf, pick);
  const author = b.authors.join(', ') || 'Unknown author';
  // "The Project Gutenberg eBook of Du côté de chez Swann, by Marcel Proust" → "Du côté de chez Swann".
  const fileTitle = (raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? raw.match(/^Title:\s*(.+)$/m)?.[1] ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^.*?(e-?book|EBook) of\s+/i, '')
    .replace(/,\s*by\s+[^,]+$/i, '')
    .replace(/\s*\([^)]*$/, '')
    .replace(/[,;:\s]+$/, '')
    .trim();
  const title = fileTitle && !/\uFFFD/.test(fileTitle) && fileTitle.length < 140 ? fileTitle : b.title;
  const book = html ? parseHtmlBook(raw, title, author) : parsePlainBook(raw, title, author);
  // Drop transcriber credits at the very start.
  const first = book.chapters[0];
  while (first && first.paragraphs.length > 1 && /produced by|transcriber|Project Gutenberg|Distributed Proofread/i.test(first.paragraphs[0])) first.paragraphs.shift();
  onProgress(1);
  return book;
}

/** Plain-text Gutenberg books: the licence trimmed, chapters found by their headings, paragraphs by blank lines. */
export function parsePlainBook(raw: string, title: string, author: string): FullBook {
  let t = raw.replace(/\r\n/g, '\n');
  const start = t.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i);
  if (start >= 0) t = t.slice(t.indexOf('\n', start) + 1);
  // 1990s files open with a long licence that ends with "*END*THE SMALL PRINT!".
  const small = t.search(/\*\s*END\s*\*?\s*THE SMALL PRINT[^\n]*\n/i);
  if (small >= 0) t = t.slice(t.indexOf('\n', small) + 1);
  const end = t.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG|End of (the )?Project Gutenberg/i);
  if (end >= 0) t = t.slice(0, end);
  const blocks = t.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  const heading = /^(CHAPTER|CHAPITRE|BOOK|LIVRE|PART|PARTIE|STAVE|ACT|ACTE|PREMI[EÈ]RE|DEUXI[EÈ]ME|TROISI[EÈ]ME|QUATRI[EÈ]ME)\b|^[IVXLC]+\.?$/i;
  // A short line in capitals ("COMBRAY", "UN AMOUR DE SWANN") is a heading too, once the book has begun.
  const caps = (p: string) => p.length < 50 && /\p{Lu}{3}/u.test(p) && !/\p{Ll}/u.test(p);
  const chapters: FullBook['chapters'] = [];
  for (const p of blocks) {
    const words = chapters.reduce((n, c) => n + c.paragraphs.length, 0);
    if ((heading.test(p) && p.length < 80) || (caps(p) && words > 3)) {
      // Consecutive headings ("PREMIÈRE PARTIE" then "COMBRAY") become one title.
      const last = chapters[chapters.length - 1];
      if (last && !last.paragraphs.length) last.title = `${last.title} · ${p}`;
      else chapters.push({ title: p, paragraphs: [] });
    }
    else {
      if (!chapters.length) chapters.push({ title: title, paragraphs: [] });
      chapters[chapters.length - 1].paragraphs.push(p);
    }
  }
  const kept = chapters.filter((c) => c.paragraphs.length);
  if (!kept.length) throw new Error('No readable text was found in this book.');
  return { title, author, chapters: kept };
}

// ---------- Standard Ebooks ----------

const SE = 'https://standardebooks.org';

async function searchStandard(query: string): Promise<FoundBook[]> {
  const res = await fetch(`${SE}/ebooks?query=${encodeURIComponent(query)}&per-page=24`);
  if (!res.ok) throw new Error('Standard Ebooks is not answering right now.');
  const html = await res.text();
  const items = html.split('<li typeof="schema:Book"').slice(1);
  return items.map((li) => {
    const path = li.match(/^\s*about="([^"]+)"/)?.[1] ?? '';
    const title = li.match(/<span property="schema:name">([^<]+)<\/span><\/a><\/p>/)?.[1] ?? 'Untitled';
    const authors = [...li.matchAll(/schema:author[\s\S]*?<span property="schema:name">([^<]+)<\/span>/g)].map((m) => decodeEntities(m[1]));
    const img = li.match(/<img src="([^"]+)"/)?.[1];
    // The path is /ebooks/author/title[/translator…]; translators matter for copyright.
    const segs = path.split('/').filter(Boolean).slice(3);
    const translators = segs.map((s) => s.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' '));
    return {
      key: `se:${path}`,
      source: 'standard' as const,
      title: decodeEntities(title),
      authors,
      people: [...authors.map((name) => ({ name })), ...translators.map((name) => ({ name, role: 'Translator' }))],
      lang: 'en' as const,
      cover: img ? `${SE}${img}` : undefined,
      pageUrl: `${SE}${path}`,
      ref: path,
    };
  });
}

const decodeEntities = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&rsquo;/g, '’');

async function downloadStandard(b: FoundBook, onProgress: (f: number) => void): Promise<FullBook> {
  const slug = b.ref.replace(/^\/ebooks\//, '').replace(/\//g, '_');
  const buf = await fetchWithProgress(`${SE}${b.ref}/downloads/${slug}.epub?source=download`, (f) => onProgress(f * 0.9));
  const book = await parseEpub(buf, `${slug}.epub`);
  // Standard Ebooks frame each book with title, imprint and licence pages; the reader starts at the text.
  book.chapters = book.chapters.filter((c) => !/^(imprint|colophon|uncopyright|titlepage|half title|endnotes)$/i.test(c.title.trim()));
  onProgress(1);
  return book;
}

// ---------- death years (Wikidata) ----------

const deathCache = new Map<string, Promise<number | undefined>>();
// Wikidata asks for gentle use: one lookup at a time.
let queue: Promise<unknown> = Promise.resolve();
const pause = () => new Promise((r) => setTimeout(r, 40));
const queued = <T,>(job: () => Promise<T>) => {
  const run = queue.then(pause).then(job);
  queue = run.catch(() => {});
  return run;
};

/** The year a person died, from Wikidata (undefined if unknown or still living). */
export function deathYear(name: string): Promise<number | undefined> {
  if (!deathCache.has(name)) {
    deathCache.set(
      name,
      queued(async () => {
        const api = 'https://www.wikidata.org/w/api.php?format=json&origin=*';
        // "Isabel F Hapgood" (from a web address) is found as "Isabel F. Hapgood", or failing that as "Isabel Hapgood".
        const words = name.split(/\s+/);
        const dotted = words.map((w) => (/^[A-Z]$/.test(w) ? `${w}.` : w)).join(' ');
        const short = words.length > 2 ? `${words[0]} ${words[words.length - 1]}` : name;
        for (const query of [...new Set([dotted, short])]) {
          try {
            const found = await (await fetch(`${api}&action=wbsearchentities&type=item&limit=5&language=en&search=${encodeURIComponent(query)}`)).json();
            const ids: string[] = (found.search ?? []).map((h: { id: string }) => h.id);
            if (!ids.length) continue;
            const ents = (await (await fetch(`${api}&action=wbgetentities&props=claims&ids=${ids.join('|')}`)).json()).entities ?? {};
            for (const id of ids) {
              const claims = ents[id]?.claims ?? {};
              // Only people (instance of human).
              if (!claims.P31?.some((c: { mainsnak: { datavalue?: { value: { id: string } } } }) => c.mainsnak.datavalue?.value.id === 'Q5')) continue;
              const time: string | undefined = claims.P570?.[0]?.mainsnak.datavalue?.value.time;
              return time ? Number(time.slice(1, 5)) * (time[0] === '-' ? -1 : 1) : undefined;
            }
          } catch {
            // A network hiccup: forget this answer so the next look tries again.
            setTimeout(() => deathCache.delete(name), 0);
          }
        }
        return undefined;
      }),
    );
  }
  return deathCache.get(name)!;
}

// ---------- shared ----------

async function fetchWithProgress(url: string, onProgress: (f: number) => void): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}).`);
  const total = Number(res.headers.get('content-length') ?? 0);
  if (!res.body || !total) return res.arrayBuffer();
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    onProgress(Math.min(1, got / total));
  }
  const out = new Uint8Array(got);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out.buffer;
}

/** Searches every source; one source failing doesn't stop the others. */
export async function findBooks(query: string, lang: Lang | 'all'): Promise<{ books: FoundBook[]; errors: string[] }> {
  const jobs: Promise<FoundBook[]>[] = [searchGutenberg(query, lang)];
  if (lang !== 'fr') jobs.push(searchStandard(query));
  const settled = await Promise.allSettled(jobs);
  const errors = settled.filter((s) => s.status === 'rejected').map((s) => ((s as PromiseRejectedResult).reason as Error).message || 'A source failed.');
  const [gut = [], std = []] = settled.map((s) => (s.status === 'fulfilled' ? s.value : []));
  // Standard Ebooks first (the nicest editions), then Gutenberg by popularity.
  return { books: [...std, ...gut.filter((b) => lang === 'all' || b.lang === lang)], errors };
}

/** Fills in death years that the source didn't give (Standard Ebooks), so the copyright check can run. */
export async function withDeathYears(b: FoundBook): Promise<FoundBook> {
  if (b.people.every((p) => p.died !== undefined)) return b;
  const people = await Promise.all(b.people.map(async (p) => (p.died !== undefined ? p : { ...p, died: await deathYear(p.name) })));
  return { ...b, people };
}

export function downloadFound(b: FoundBook, onProgress: (f: number) => void): Promise<FullBook> {
  if (!publicDomainEU(b.people)) throw new Error('This book may still be under copyright in Europe, so it can only be read on its source site.');
  return b.source === 'standard' ? downloadStandard(b, onProgress) : downloadGutenberg(b, onProgress);
}
