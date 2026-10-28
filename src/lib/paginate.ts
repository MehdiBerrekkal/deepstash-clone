import type { FullBook } from '@/lib/fullbook';

/** A point in a book that survives re-pagination (font size or screen changes). */
export type BookPosition = { chapter: number; para: number; char: number };

export type PagePiece = { para: number; from: number; to: number };

export type Page = {
  chapter: number;
  /** Set on a chapter's first page. */
  chapterTitle?: string;
  pieces: PagePiece[];
};

type Layout = { width: number; height: number; fontSize: number; lineHeight: number };

/**
 * Splits a book into screen-sized pages by estimating how many lines each paragraph takes.
 * The estimate is a little conservative so text doesn't overflow; pages clip anything that still does.
 */
export function paginate(book: FullBook, { width, height, fontSize, lineHeight }: Layout): Page[] {
  const charsPerLine = Math.max(16, Math.floor(width / (fontSize * 0.5)));
  const linesPerPage = Math.max(6, Math.floor((height / lineHeight) * 0.95));
  const pages: Page[] = [];

  book.chapters.forEach((chapter, c) => {
    let page: Page = { chapter: c, chapterTitle: chapter.title, pieces: [] };
    let used = 3; // the chapter title
    const flush = () => {
      if (page.pieces.length || page.chapterTitle) pages.push(page);
      page = { chapter: c, pieces: [] };
      used = 0;
    };

    chapter.paragraphs.forEach((text, p) => {
      let from = 0;
      while (from < text.length) {
        const rest = text.slice(from);
        const restLines = rest.split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
        const free = linesPerPage - used;
        if (restLines <= free) {
          page.pieces.push({ para: p, from, to: text.length });
          used += restLines + 1;
          if (used >= linesPerPage) flush();
          break;
        }
        if (free < 2) {
          flush();
          continue;
        }
        // Fill the rest of the page, breaking at a space or line break.
        let take = Math.max(1, free) * charsPerLine;
        const newline = rest.lastIndexOf('\n', take);
        const space = rest.lastIndexOf(' ', take);
        const cut = newline > take * 0.5 ? newline + 1 : space > take * 0.5 ? space + 1 : take;
        take = Math.min(cut, rest.length);
        page.pieces.push({ para: p, from, to: from + take });
        from += take;
        flush();
      }
    });
    flush();
  });
  return pages;
}

export function pageStart(page: Page): BookPosition {
  const first = page.pieces[0];
  return { chapter: page.chapter, para: first?.para ?? 0, char: first?.from ?? 0 };
}

const cmp = (a: BookPosition, b: BookPosition) => a.chapter - b.chapter || a.para - b.para || a.char - b.char;

/** Index of the page that contains a position. */
export function findPage(pages: Page[], pos: BookPosition): number {
  let lo = 0;
  let hi = pages.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (cmp(pageStart(pages[mid]), pos) <= 0) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
