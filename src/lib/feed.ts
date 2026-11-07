import type { CardKind, Idea, Source, Topic } from '@/lib/types';

export type FeedItem = { idea: Idea; reason?: string };

type Signals = {
  ideas: Idea[];
  kind: CardKind | null;
  followedTopicIds: string[];
  likedIdeaIds: string[];
  stashedIdeaIds: string[];
  readIdeaIds: string[];
  /** Topics of books you hearted or highlighted in. */
  bookTopicIds: string[];
  notInterested: string[];
  ideaById: Record<string, Idea>;
  sourceById: Record<string, Source>;
  topicById: Record<string, Topic>;
  random: () => number;
};

/** How many recent topics a card's topic should differ from, so the feed doesn't clump. */
const SPREAD = 2;
const LOOKAHEAD = 12;

/**
 * Ranks the feed from what you do: likes and stashes count most, then highlights and favourite books, then what you
 * read; "Not interested" pushes a topic down. A little daily randomness keeps it fresh, cards you've read go last,
 * and topics are spread out. Each card may carry a reason ("Because you liked …").
 */
export function rankFeed(s: Signals): FeedItem[] {
  const followed = new Set(s.followedTopicIds);
  const read = new Set(s.readIdeaIds);
  const hidden = new Set(s.notInterested);
  const topicScore: Record<string, number> = {};
  const kindLikes: Partial<Record<CardKind, number>> = {};
  const likedSources = new Map<string, number>();
  const bump = (topicId: string | undefined, by: number) => topicId && (topicScore[topicId] = (topicScore[topicId] ?? 0) + by);

  for (const id of [...s.likedIdeaIds, ...s.stashedIdeaIds]) {
    const idea = s.ideaById[id];
    if (!idea) continue;
    bump(idea.topicId, 3);
    kindLikes[idea.kind] = (kindLikes[idea.kind] ?? 0) + 1;
    if (idea.sourceId) likedSources.set(idea.sourceId, (likedSources.get(idea.sourceId) ?? 0) + 1);
  }
  for (const t of s.bookTopicIds) bump(t, 2);
  for (const id of s.readIdeaIds.slice(0, 400)) bump(s.ideaById[id]?.topicId, 0.15);
  for (const id of s.notInterested) bump(s.ideaById[id]?.topicId, -4);

  const affinity = (t: string) => {
    const raw = topicScore[t] ?? 0;
    return Math.sign(raw) * Math.log1p(Math.abs(raw));
  };

  const scored = s.ideas
    .filter((idea) => (!s.kind || idea.kind === s.kind) && !hidden.has(idea.id))
    .map((idea) => {
      const fromLikedSource = idea.sourceId ? likedSources.has(idea.sourceId) : false;
      const score =
        (followed.has(idea.topicId) ? 2 : 0) +
        affinity(idea.topicId) +
        (fromLikedSource ? 2.5 : 0) +
        Math.log1p(kindLikes[idea.kind] ?? 0) * 0.5 +
        s.random() * 1.6 -
        (read.has(idea.id) ? 1000 : 0);
      let reason: string | undefined;
      if (!read.has(idea.id)) {
        if (fromLikedSource) reason = `Because you liked ${s.sourceById[idea.sourceId!]?.title ?? 'this book'}`;
        else if ((topicScore[idea.topicId] ?? 0) >= 6 && s.topicById[idea.topicId]) reason = `Because you like ${s.topicById[idea.topicId].name}`;
      }
      return { idea, reason, score };
    })
    .sort((a, b) => b.score - a.score);

  // Spread topics: take the best card whose topic differs from the last few, looking a little way ahead.
  const out: FeedItem[] = [];
  const recent: string[] = [];
  const pool = scored;
  while (pool.length) {
    let pick = 0;
    for (let i = 0; i < Math.min(LOOKAHEAD, pool.length); i++) {
      if (!recent.includes(pool[i].idea.topicId)) {
        pick = i;
        break;
      }
    }
    const [next] = pool.splice(pick, 1);
    out.push({ idea: next.idea, reason: next.reason });
    recent.push(next.idea.topicId);
    if (recent.length > SPREAD) recent.shift();
  }
  return out;
}
