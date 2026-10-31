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
  /** A direct cover image, used before Open Library. */
  coverUrl?: string;
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

export type ReaderFont = 'literata' | 'garamond' | 'sans';

export type ReaderSettings = {
  /** The paper for light reading (Paper or Sepia); Night is used when the app is dark. */
  theme: ReaderTheme;
  /** A theme picked by hand in the reader, which wins over the app's appearance until it changes. */
  themeOverride?: ReaderTheme;
  fontSize: number;
  font?: ReaderFont;
  listenRate?: number;
  /** The voice for English text: a system voice id, "piper:<voice>" for a natural voice, or unset for the best available. */
  voice?: string;
  /** Books with a LibriVox recording: read by the human narrator (default) or by a synthetic voice. */
  narrator?: 'human' | 'ai';
  /** The voice for French text (books, cards, quizzes); `voice` is for English. */
  voiceFr?: string;
  /** Set when the natural voice was too slow on this device, so it isn't picked automatically. */
  naturalOff?: boolean;
};

/** Where the full-book reader is in a book; see paginate.ts. */
export type ReaderPosition = { chapter: number; para: number; char: number };

export type ReaderProgress = ReaderPosition & { fraction: number; updatedAt: string };

export type Bookmark = ReaderPosition & { id: string; label: string; createdAt: string };

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

/** A highlighted passage in a full book, with an optional note. readerId is "classic:<id>" or "own:<id>". */
export type Highlight = ReaderPosition & {
  id: string;
  readerId: string;
  bookTitle: string;
  author: string;
  chapterTitle: string;
  /** End of the passage in the same paragraph (char is the start). */
  to: number;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: string;
};

/** One day of reading: time in books and cards, pages turned, words read and cards seen. */
export type DayLog = { seconds: number; pages: number; words: number; cards: number };
