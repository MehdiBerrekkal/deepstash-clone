import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { bundledContent, type Content } from '@/data/content';
import { supabase } from '@/lib/supabase';
import type { BookProgress, CardKind, Idea, Source, Stash, Streak, Topic } from '@/lib/types';

const STORAGE_KEY = 'deepstash-clone/user-state/v1';
const MAX_READ_HISTORY = 5000;

type UserState = {
  followedTopicIds: string[];
  stashes: Stash[];
  streak: Streak;
  bookProgress: Record<string, BookProgress>;
  savedBookIds: string[];
  likedIdeaIds: string[];
  /** Most recent first. */
  readIdeaIds: string[];
  dailyGoal: number;
  today: { date: string; count: number };
};

type Store = Content &
  UserState & {
    ready: boolean;
    topicById: Record<string, Topic>;
    sourceById: Record<string, Source>;
    ideaById: Record<string, Idea>;
    ideasBySource: Record<string, Idea[]>;
    setFollowedTopics: (ids: string[]) => void;
    createStash: (name: string) => Stash;
    deleteStash: (stashId: string) => void;
    toggleInStash: (stashId: string, ideaId: string) => void;
    isSaved: (ideaId: string) => boolean;
    toggleLike: (ideaId: string) => void;
    markRead: (ideaId: string) => void;
    setBookPosition: (bookId: string, position: number) => void;
    finishBook: (bookId: string) => void;
    toggleSavedBook: (bookId: string) => void;
    setDailyGoal: (goal: number) => void;
    resetProgress: () => void;
  };

const DEFAULT_STASH: Stash = { id: 'saved', name: 'Saved', ideaIds: [], createdAt: new Date(0).toISOString() };

const initialUserState: UserState = {
  followedTopicIds: [],
  stashes: [DEFAULT_STASH],
  streak: { count: 0, lastActiveDate: null },
  bookProgress: {},
  savedBookIds: [],
  likedIdeaIds: [],
  readIdeaIds: [],
  dailyGoal: 10,
  today: { date: '', count: 0 },
};

const StoreContext = createContext<Store | null>(null);

function toIndex<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function bumpStreak(streak: Streak): Streak {
  const today = localDate();
  if (streak.lastActiveDate === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const continued = streak.lastActiveDate === localDate(yesterday);
  return { count: continued ? streak.count + 1 : 1, lastActiveDate: today };
}

async function fetchRemoteContent(): Promise<Content | null> {
  if (!supabase) return null;
  const [topics, sources, ideas] = await Promise.all([
    supabase.from('topics').select('id, name, emoji, color').order('name'),
    supabase.from('sources').select('id, title, author, kind'),
    supabase.from('ideas').select('id, topicId:topic_id, sourceId:source_id, title, body').order('created_at', { ascending: false }),
  ]);
  if (topics.error || sources.error || ideas.error) {
    console.warn('Supabase fetch failed, using bundled ideas', topics.error ?? sources.error ?? ideas.error);
    return null;
  }
  // The database only holds book ideas so far; keep the bundled quotes, poems and facts alongside them.
  const remoteIdeas = (ideas.data as Omit<Idea, 'kind'>[]).map((i): Idea => ({ ...i, kind: 'idea' }));
  const remoteSources = (sources.data as Source[]).map((s) => {
    const bundled = bundledContent.sources.find((b) => b.id === s.id);
    const topicId = bundled?.topicId ?? remoteIdeas.find((i) => i.sourceId === s.id)?.topicId ?? '';
    return { ...bundled, ...s, topicId, description: bundled?.description ?? '' };
  });
  return {
    topics: topics.data,
    sources: remoteSources,
    ideas: [...remoteIdeas, ...bundledContent.ideas.filter((i) => i.kind !== 'idea')],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(bundledContent);
  const [user, setUser] = useState<UserState>(initialUserState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const saved: UserState = raw ? { ...initialUserState, ...JSON.parse(raw) } : initialUserState;
        setUser({ ...saved, streak: bumpStreak(saved.streak) });
      } catch {
        setUser((u) => ({ ...u, streak: bumpStreak(u.streak) }));
      }
      setReady(true);
    })();
    fetchRemoteContent().then((remote) => remote && setContent(remote));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user)).catch(() => {});
  }, [user, ready]);

  const setFollowedTopics = useCallback((ids: string[]) => {
    setUser((u) => ({ ...u, followedTopicIds: ids }));
  }, []);

  const createStash = useCallback((name: string) => {
    const stash: Stash = { id: `${Date.now()}`, name: name.trim(), ideaIds: [], createdAt: new Date().toISOString() };
    setUser((u) => ({ ...u, stashes: [...u.stashes, stash] }));
    return stash;
  }, []);

  const deleteStash = useCallback((stashId: string) => {
    setUser((u) => ({ ...u, stashes: u.stashes.filter((s) => s.id !== stashId || s.id === DEFAULT_STASH.id) }));
  }, []);

  const toggleInStash = useCallback((stashId: string, ideaId: string) => {
    setUser((u) => ({
      ...u,
      stashes: u.stashes.map((s) =>
        s.id !== stashId
          ? s
          : { ...s, ideaIds: s.ideaIds.includes(ideaId) ? s.ideaIds.filter((id) => id !== ideaId) : [ideaId, ...s.ideaIds] },
      ),
    }));
  }, []);

  const toggleLike = useCallback((ideaId: string) => {
    setUser((u) => ({
      ...u,
      likedIdeaIds: u.likedIdeaIds.includes(ideaId) ? u.likedIdeaIds.filter((id) => id !== ideaId) : [ideaId, ...u.likedIdeaIds],
    }));
  }, []);

  const markRead = useCallback((ideaId: string) => {
    setUser((u) => {
      if (u.readIdeaIds[0] === ideaId) return u;
      const firstTime = !u.readIdeaIds.includes(ideaId);
      const date = localDate();
      const todayCount = u.today.date === date ? u.today.count : 0;
      return {
        ...u,
        readIdeaIds: [ideaId, ...u.readIdeaIds.filter((id) => id !== ideaId)].slice(0, MAX_READ_HISTORY),
        today: { date, count: todayCount + (firstTime ? 1 : 0) },
      };
    });
  }, []);

  const setBookPosition = useCallback((bookId: string, position: number) => {
    setUser((u) => {
      const current = u.bookProgress[bookId];
      if (current?.position === position) return u;
      return {
        ...u,
        bookProgress: { ...u.bookProgress, [bookId]: { ...current, startedAt: current?.startedAt ?? new Date().toISOString(), position } },
      };
    });
  }, []);

  const finishBook = useCallback((bookId: string) => {
    setUser((u) => {
      const current = u.bookProgress[bookId];
      if (current?.finishedAt) return u;
      const now = new Date().toISOString();
      return {
        ...u,
        bookProgress: { ...u.bookProgress, [bookId]: { position: 0, startedAt: current?.startedAt ?? now, finishedAt: now } },
      };
    });
  }, []);

  const toggleSavedBook = useCallback((bookId: string) => {
    setUser((u) => ({
      ...u,
      savedBookIds: u.savedBookIds.includes(bookId) ? u.savedBookIds.filter((id) => id !== bookId) : [bookId, ...u.savedBookIds],
    }));
  }, []);

  const setDailyGoal = useCallback((dailyGoal: number) => setUser((u) => ({ ...u, dailyGoal })), []);

  const resetProgress = useCallback(() => {
    setUser((u) => ({ ...u, bookProgress: {}, readIdeaIds: [], today: { date: localDate(), count: 0 } }));
  }, []);

  const indexes = useMemo(() => {
    const ideasBySource: Record<string, Idea[]> = {};
    for (const idea of content.ideas) {
      if (idea.sourceId) (ideasBySource[idea.sourceId] ??= []).push(idea);
    }
    return {
      topicById: toIndex(content.topics),
      sourceById: toIndex(content.sources),
      ideaById: toIndex(content.ideas),
      ideasBySource,
    };
  }, [content]);

  const value = useMemo<Store>(() => {
    const savedIds = new Set(user.stashes.flatMap((s) => s.ideaIds));
    const today = user.today.date === localDate() ? user.today : { date: localDate(), count: 0 };
    return {
      ...content,
      ...user,
      today,
      ready,
      ...indexes,
      setFollowedTopics,
      createStash,
      deleteStash,
      toggleInStash,
      isSaved: (ideaId) => savedIds.has(ideaId),
      toggleLike,
      markRead,
      setBookPosition,
      finishBook,
      toggleSavedBook,
      setDailyGoal,
      resetProgress,
    };
  }, [content, user, ready, indexes, setFollowedTopics, createStash, deleteStash, toggleInStash, toggleLike, markRead, setBookPosition, finishBook, toggleSavedBook, setDailyGoal, resetProgress]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}

/** Small seeded PRNG so the feed order is stable within a day but changes from day to day. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Cards from followed topics first, interleaved by topic so the feed doesn't clump,
 * shuffled daily, with cards you've already read pushed to the end.
 */
export function useFeed(kind: CardKind | null): Idea[] {
  const { ideas, followedTopicIds, readIdeaIds } = useStore();
  const day = localDate();
  // Only reorder when the day or filter changes, not every time a card is marked read.
  const [readSnapshot] = useState(() => new Set(readIdeaIds));
  return useMemo(() => {
    const random = seededRandom(`${day}:${kind ?? 'all'}`);
    const followed = new Set(followedTopicIds);
    const byTopic = new Map<string, Idea[]>();
    for (const idea of ideas) {
      if (kind && idea.kind !== kind) continue;
      const list = byTopic.get(idea.topicId) ?? [];
      list.push(idea);
      byTopic.set(idea.topicId, list);
    }
    const interleave = (topicIds: string[]) => {
      const queues = shuffle(topicIds, random).map((id) => shuffle(byTopic.get(id) ?? [], random));
      const out: Idea[] = [];
      while (queues.some((q) => q.length)) for (const q of queues) if (q.length) out.push(q.shift()!);
      return out;
    };
    const topicIds = [...byTopic.keys()];
    const ordered = [...interleave(topicIds.filter((id) => followed.has(id))), ...interleave(topicIds.filter((id) => !followed.has(id)))];
    return [...ordered.filter((i) => !readSnapshot.has(i.id)), ...ordered.filter((i) => readSnapshot.has(i.id))];
  }, [ideas, followedTopicIds, kind, day, readSnapshot]);
}
