import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';

import { classicAssets } from '@/data/classics/assets';
import downloadable from '@/data/catalog.json';
import catalog from '@/data/classics/index.json';
import { loadDownloadedBook } from '@/lib/downloads';
import { myBookAssets, myBooks } from '@/lib/myBooks';

/** A whole book ready for the reader: public-domain classics and the user's own EPUBs share this shape. */
export type FullBook = {
  title: string;
  author: string;
  chapters: { title: string; paragraphs: string[] }[];
};

export type Classic = {
  id: string;
  /** Project Gutenberg ebook number, for public-domain books. */
  gutenberg?: number;
  /**
   * books: the shared books/ folder. private: your own my-books/ folder, never committed. library: bundled from
   * Standard Ebooks or Gutenberg. catalog: downloaded on demand from Standard Ebooks.
   */
  origin?: 'books' | 'private' | 'library' | 'catalog';
  /** Which Library shelf it sits on. */
  shelf?: 'wisdom' | 'lives' | 'ideas' | 'novels' | 'poetry' | 'french';
  /** Cover image (Standard Ebooks or Gutenberg); otherwise Open Library or a typographic cover. */
  coverUrl?: string;
  /** Where the text comes from, e.g. "Standard Ebooks". */
  source?: string;
  lang?: string;
  /** Catalog books: the EPUB to download. */
  epubUrl?: string;
  /** A PDF from my-books/, read in the PDF reader instead of the text reader. */
  format?: 'pdf';
  /** Open Library cover, for private books (shared books keep theirs in covers.json). */
  coverId?: number;
  /** When `npm run books` first imported it (ISO date). */
  addedAt?: string;
  description?: string;
  /** "Public domain" or a Creative Commons license, for books not from Gutenberg. */
  license?: string;
  licenseUrl?: string;
  homepage?: string;
  title: string;
  author: string;
  translator?: string;
  year: number;
  topicId: string;
  /** Library book whose page links to this full text. */
  sourceId?: string;
  chapters: number;
  words: number;
};

export const classics = [...(catalog as Classic[]), ...myBooks, ...(downloadable as Classic[])];
export const classicById = Object.fromEntries(classics.map((c) => [c.id, c])) as Record<string, Classic>;
export const classicBySourceId = Object.fromEntries(
  classics.filter((c) => c.sourceId).map((c) => [c.sourceId!, c]),
) as Record<string, Classic>;

/** Reader ids: "classic:<id>" for bundled books, "own:<id>" for files the user opened. */
export const classicReaderId = (id: string) => `classic:${id}`;

const cache = new Map<string, Promise<FullBook>>();

async function readText(uri: string): Promise<string> {
  if (Platform.OS === 'web' || /^https?:/.test(uri)) return (await fetch(uri)).text();
  return new File(uri).text();
}

export function loadClassic(id: string): Promise<FullBook> {
  const key = classicReaderId(id);
  if (!cache.has(key)) {
    const meta = classicById[id];
    const load = (async () => {
      if (meta.origin === 'catalog') {
        const book = await loadDownloadedBook(id);
        if (!book) throw new Error('Download this book first from its page in the Library.');
        return book;
      }
      const asset = Asset.fromModule(classicAssets[id] ?? myBookAssets[id]);
      await asset.downloadAsync();
      const { chapters } = JSON.parse(await readText(asset.localUri ?? asset.uri));
      return { title: meta.title, author: meta.author, chapters } as FullBook;
    })();
    load.catch(() => cache.delete(key));
    cache.set(key, load);
  }
  return cache.get(key)!;
}

export function readMinutesForWords(words: number): number {
  return Math.max(1, Math.round(words / 230));
}

export function formatYear(year: number): string {
  return year < 0 ? `${-year} BC` : String(year);
}
