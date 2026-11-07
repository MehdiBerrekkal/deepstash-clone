import { parseEpub } from '@/lib/epub';
import type { Classic, FullBook } from '@/lib/fullbook';
import { loadSavedBook, saveBook } from '@/lib/ownbooks';

/**
 * Catalog books (src/data/catalog.json) are downloaded on demand from Standard Ebooks, which allows downloads
 * from browsers as well as phones, then kept on the device like an EPUB the user opened themselves.
 */
const storageId = (id: string) => `dl-${id}`;

export async function downloadCatalogBook(book: Classic): Promise<FullBook> {
  if (!book.epubUrl) throw new Error('This book has no download link.');
  let res: Response;
  try {
    res = await fetch(book.epubUrl);
  } catch {
    throw new Error("Couldn't reach Standard Ebooks. Check your internet connection and try again.");
  }
  if (!res.ok) throw new Error(`The download failed (HTTP ${res.status}). Try again later.`);
  const parsed = await parseEpub(await res.arrayBuffer(), `${book.id}.epub`);
  // Drop the production pages (title page, colophon, licence) so the book opens on its first real page.
  const chapters = parsed.chapters.filter((c) => !/^(titlepage|colophon|uncopyright|imprint|table of contents|contents)$/i.test(c.title.trim()));
  const full: FullBook = { title: book.title, author: book.author, chapters: chapters.length ? chapters : parsed.chapters };
  await saveBook(storageId(book.id), full);
  return full;
}

export function loadDownloadedBook(id: string): Promise<FullBook | null> {
  return loadSavedBook(storageId(id));
}
