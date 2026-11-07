import type { Classic } from '@/lib/fullbook';

/**
 * Books imported from the private my-books/ folder by `npm run books`. Their files live in src/data/my-books/,
 * which Git ignores, so on a fresh checkout these lists are empty. require.context picks up whatever is there.
 */
const metaFiles = require.context('../data/my-books', false, /\.meta\.json$/);
const textFiles = require.context('../data/my-books', false, /\.txt$/);
const pdfFiles = require.context('../data/my-books', false, /\.pdf$/);

export const myBooks: Classic[] = metaFiles.keys().map((key) => metaFiles(key) as Classic);

export const myBookAssets: Record<string, number> = Object.fromEntries(
  textFiles.keys().map((key) => [key.replace(/^\.\//, '').replace(/\.txt$/, ''), textFiles(key) as number]),
);

/** PDFs from my-books/, opened in the page-flip PDF reader. */
export const myBookPdfAssets: Record<string, number> = Object.fromEntries(
  pdfFiles.keys().map((key) => [key.replace(/^\.\//, '').replace(/\.pdf$/, ''), pdfFiles(key) as number]),
);
