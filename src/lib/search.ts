import type { FullBook } from '@/lib/fullbook';

/** Lowercase without accents, so "eloise" finds "Héloïse". */
export const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** True when every word of the query appears somewhere in the text. */
export function matchesAll(text: string, query: string) {
  const hay = fold(text);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

export type BookHit = { chapter: number; para: number; char: number; length: number; before: string; match: string; after: string };

/**
 * Every place a phrase appears in a book, with a little context either side.
 * Matching ignores case, accents and curly-vs-straight quotes; offsets index into the original text.
 */
export function searchBook(book: FullBook, query: string, limit = 300): BookHit[] {
  // Folding can change string length (é -> e + mark), so fold character by character and keep a map back.
  const foldChars = (s: string) => {
    // Fast path for plain ASCII text, which is most of most books.
    if (/^[\x00-\x7f]*$/.test(s)) return { out: s.toLowerCase(), map: null };
    let out = '';
    const map: number[] = [];
    for (let i = 0; i < s.length; i++) {
      const f = fold(s[i]).replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
      out += f;
      for (let k = 0; k < f.length; k++) map.push(i);
    }
    map.push(s.length);
    return { out, map: map as number[] | null };
  };
  const q = foldChars(query.trim()).out;
  if (q.length < 2) return [];
  const hits: BookHit[] = [];
  book.chapters.forEach((chapter, c) =>
    chapter.paragraphs.forEach((text, p) => {
      if (hits.length >= limit) return;
      const { out, map } = foldChars(text);
      for (let at = out.indexOf(q); at !== -1 && hits.length < limit; at = out.indexOf(q, at + q.length)) {
        const start = map ? map[at] : at;
        const end = map ? map[at + q.length] : at + q.length;
        const from = Math.max(0, start - 50);
        const to = Math.min(text.length, end + 70);
        hits.push({
          chapter: c,
          para: p,
          char: start,
          length: end - start,
          before: (from > 0 ? '…' : '') + text.slice(from, start).replace(/^\S*\s/, from > 0 ? '' : '$&'),
          match: text.slice(start, end),
          after: text.slice(end, to) + (to < text.length ? '…' : ''),
        });
      }
    }),
  );
  return hits;
}
