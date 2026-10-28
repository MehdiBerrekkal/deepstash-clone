import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import seed from '@/data/seed.json';
import { supabase } from '@/lib/supabase';
import type { Idea, Source, Stash, Streak, Topic } from '@/lib/types';

const STORAGE_KEY = 'deepstash-clone/user-state/v1';

type Content = {
  topics: Topic[];
  sources: Source[];
  ideas: Idea[];
};

type UserState = {
  followedTopicIds: string[];
  stashes: Stash[];
  streak: Streak;
};

type Store = Content &
  UserState & {
    ready: boolean;
    topicById: Record<string, Topic>;
    sourceById: Record<string, Source>;
    ideaById: Record<string, Idea>;
    setFollowedTopics: (ids: string[]) => void;
    createStash: (name: string) => Stash;
    deleteStash: (stashId: string) => void;
    toggleInStash: (stashId: string, ideaId: string) => void;
    isSaved: (ideaId: string) => boolean;
  };

const DEFAULT_STASH: Stash = { id: 'saved', name: 'Saved', ideaIds: [], createdAt: new Date(0).toISOString() };

const initialUserState: UserState = {
  followedTopicIds: [],
  stashes: [DEFAULT_STASH],
  streak: { count: 0, lastActiveDate: null },
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
  return { topics: topics.data, sources: sources.data as Source[], ideas: ideas.data as Idea[] };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(seed as Content);
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

  const value = useMemo<Store>(() => {
    const savedIds = new Set(user.stashes.flatMap((s) => s.ideaIds));
    return {
      ...content,
      ...user,
      ready,
      topicById: toIndex(content.topics),
      sourceById: toIndex(content.sources),
      ideaById: toIndex(content.ideas),
      setFollowedTopics,
      createStash,
      deleteStash,
      toggleInStash,
      isSaved: (ideaId) => savedIds.has(ideaId),
    };
  }, [content, user, ready, setFollowedTopics, createStash, deleteStash, toggleInStash]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}

/** Ideas from followed topics first, interleaved by topic so the feed doesn't clump. */
export function useFeed(): Idea[] {
  const { ideas, followedTopicIds } = useStore();
  return useMemo(() => {
    const followed = new Set(followedTopicIds);
    const byTopic = new Map<string, Idea[]>();
    for (const idea of ideas) {
      const list = byTopic.get(idea.topicId) ?? [];
      list.push(idea);
      byTopic.set(idea.topicId, list);
    }
    const interleave = (topicIds: string[]) => {
      const queues = topicIds.map((id) => [...(byTopic.get(id) ?? [])]);
      const out: Idea[] = [];
      while (queues.some((q) => q.length)) for (const q of queues) if (q.length) out.push(q.shift()!);
      return out;
    };
    const topicIds = [...byTopic.keys()];
    return [...interleave(topicIds.filter((id) => followed.has(id))), ...interleave(topicIds.filter((id) => !followed.has(id)))];
  }, [ideas, followedTopicIds]);
}
