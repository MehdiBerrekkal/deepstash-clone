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
};

export type Idea = {
  id: string;
  topicId: string;
  sourceId: string;
  title: string;
  body: string;
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
