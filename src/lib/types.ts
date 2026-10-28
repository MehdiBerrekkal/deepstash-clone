export type Topic = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type SourceKind = 'book' | 'article' | 'podcast' | 'video';

/** A modern book its author or publisher gives away officially. */
export type FreeOffer = {
  /** The official page to read or download it. */
  url: string;
  /** Set when the book is under an open license, e.g. "CC BY-NC-SA 3.0". */
  license?: string;
  licenseUrl?: string;
  note?: string;
};

export type Source = {
  id: string;
  title: string;
  author: string;
  kind: SourceKind;
  topicId: string;
  description: string;
  year?: number;
  coverId?: number;
  free?: FreeOffer;
};

/** idea = key idea from a book or article; quote, poem and fact cards stand on their own. */
export type CardKind = 'idea' | 'quote' | 'poem' | 'fact';

export type Idea = {
  id: string;
  kind: CardKind;
  topicId: string;
  sourceId?: string;
  title: string;
  body: string;
  /** Who said or wrote it, for quotes and poems. */
  author?: string;
  /** Where a quote comes from (book, speech). */
  cite?: string;
  year?: number;
};

export type Stash = {
  id: string;
  name: string;
  ideaIds: string[];
  createdAt: string;
};

export type Streak = {
  count: number;
  lastActiveDate: string | null;
};

export type BookProgress = {
  /** Index of the idea the reader is on. */
  position: number;
  startedAt: string;
  finishedAt?: string;
};

export type ReaderTheme = 'light' | 'sepia' | 'dark';

export type ReaderSettings = { theme: ReaderTheme; fontSize: number };

/** Where the full-book reader is in a book; see paginate.ts. */
export type ReaderPosition = { chapter: number; para: number; char: number };

export type ReaderProgress = ReaderPosition & { fraction: number; updatedAt: string };

export type Bookmark = ReaderPosition & { id: string; label: string; createdAt: string };
