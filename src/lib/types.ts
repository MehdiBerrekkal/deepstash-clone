export type Topic = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type SourceKind = 'book' | 'article' | 'podcast' | 'video';

export type Source = {
  id: string;
  title: string;
  author: string;
  kind: SourceKind;
  topicId: string;
  description: string;
  year?: number;
  coverId?: number;
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
