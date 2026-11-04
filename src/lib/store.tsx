import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { bundledContent, type Content } from '@/data/content';
import { rankFeed, type FeedItem } from '@/lib/feed';
import { classicById } from '@/lib/fullbook';
import { ownSourceId, type OwnBook } from '@/lib/ownbooks';
import { NEW_PER_DAY, schedule, type Grade, type ReviewState } from '@/lib/review';
import { supabase } from '@/lib/supabase';
import type { Appearance } from '@/lib/theme';
import { mergeUser } from '@/lib/backup';
import type { Skill } from '@/lib/brain/core';
import { isKidId, type Audience } from '@/lib/audience';
import { loadCloud, saveCloud, type Account } from '@/lib/auth';
import type {
  Bookmark, BookProgress, CardKind, DayLog, Highlight, Idea, ReaderPosition, ReaderProgress, ReaderSettings, Source, Stash, Streak, Topic,
} from '@/lib/types';

const STORAGE_KEY = 'deepstash-clone/user-state/v1';
const keyFor = (accountId?: string | null) => (accountId ? `${STORAGE_KEY}/${accountId}` : STORAGE_KEY);
/** Set by the sign-up screen (to the new email) when the person wants this device's guest progress in their account. */
export const IMPORT_KEY = 'deepstash-clone/import-guest';
const MAX_READ_HISTORY = 5000;

type UserState = {
  followedTopicIds: string[];
  stashes: Stash[];
  streak: Streak;
  bookProgress: Record<string, BookProgress>;
  /** Favorite books, newest first: "book:<id>" (library), "classic:<id>" (full classic) or "own:<id>" (your file). */
  favoriteBooks: string[];
  likedIdeaIds: string[];
  /** Most recent first. */
  readIdeaIds: string[];
  dailyGoal: number;
  today: { date: string; count: number };
  readerSettings: ReaderSettings;
  /** Keyed by reader id: "classic:<id>" or "own:<id>". */
  readerProgress: Record<string, ReaderProgress>;
  bookmarks: Record<string, Bookmark[]>;
  /** Passages saved from the full-book reader, stored as quote cards so stashes can hold them. */
  clips: Idea[];
  /** Highlights in full books, newest first. */
  highlights: Highlight[];
  /** Reading per local day ("2026-10-30"). */
  readingLog: Record<string, DayLog>;
  /** Daily reading goal in minutes. */
  minuteGoal: number;
  /** Full books read to the last page: reader id -> date finished. */
  finishedReaders: Record<string, string>;
  /** Spaced-repetition state per item: "idea:<id>" (stashed card) or "hl:<id>" (highlight). */
  reviews: Record<string, ReviewState>;
  /** New items started per day, to cap how many arrive at once. */
  reviewNew: { date: string; count: number };
  /** Cards you marked "Not interested": hidden, and their topics ranked lower. */
  notInterested: string[];
  /** Light, dark, or follow the device ("auto"). */
  appearance: Appearance;
  brain: BrainState;
  ownBooks: OwnBook[];
  /** Catalog books downloaded to this device, newest first. */
  downloadedBooks: string[];
  /** When the last backup file was made (ISO date). */
  lastBackup?: string;
  /** The interface language: follow the device, or English / French. */
  uiLanguage?: 'auto' | 'en' | 'fr';
  /** Kid or adult, chosen on the first screen: decides which topics, books, games and quizzes appear. */
  audience?: Audience;
  /** Birth year, asked by the IQ-style test for its age norms. */
  birthYear?: number;
  /** Device guest only: chose to use the app without an account. */
  guest?: boolean;
  /** When this state was last saved (to pick the newer of the device and online copies). */
  savedAt?: string;
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
    toggleFavoriteBook: (key: string) => void;
    isFavoriteBook: (key: string) => boolean;
    setDailyGoal: (goal: number) => void;
    resetProgress: () => void;
    setReaderSettings: (settings: Partial<ReaderSettings>) => void;
    setReaderPosition: (readerId: string, position: ReaderPosition, fraction: number) => void;
    toggleBookmark: (readerId: string, position: ReaderPosition, label: string) => void;
    removeBookmark: (readerId: string, bookmarkId: string) => void;
    saveClip: (clip: Omit<Idea, 'id' | 'kind'>) => Idea;
    addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => Highlight;
    updateHighlight: (id: string, patch: Partial<Pick<Highlight, 'color' | 'note' | 'char' | 'to' | 'text'>>) => void;
    removeHighlight: (id: string) => void;
    logReading: (delta: Partial<DayLog>) => void;
    setMinuteGoal: (minutes: number) => void;
    markReaderFinished: (readerId: string) => void;
    /** Today's review queue: items due, then a few new ones. */
    reviewQueue: string[];
    gradeReview: (key: string, grade: Grade) => void;
    setNotInterested: (ideaId: string, hide: boolean) => void;
    setAppearance: (appearance: Appearance) => void;
    /** Records a finished game or quiz; returns whether it was a personal best and the new level. */
    recordBrain: (r: BrainResult) => void;
    addBrainTest: (t: BrainTest) => void;
    setBrainSound: (on: boolean) => void;
    patchBrain: (p: Partial<BrainState>) => void;
    /** Everything you've done, for a backup file. */
    exportUser: () => Record<string, unknown>;
    /** Loads data from a backup: replacing this device's, or merged into it. */
    importUser: (data: Record<string, unknown>, mode: 'merge' | 'replace') => void;
    markBackedUp: () => void;
    setUiLanguage: (l: 'auto' | 'en' | 'fr') => void;
    setAudience: (a: Audience) => void;
    /** The signed-in account, or null for the device's guest. */
    account: Account | null;
    /** A password-reset link was just opened: the app should ask for a new password. */
    recovering: boolean;
    setRecovering: (on: boolean) => void;
    continueAsGuest: () => void;
    setBirthYear: (y: number) => void;
    /** All topics and cards, for both kids and adults (stashes may hold either). */
    allContent: Content;
    markBrainHowTo: (id: string) => void;
    markBrainDaily: (part: 'game' | 'quiz') => void;
    addOwnBook: (book: OwnBook) => void;
    /** Saves the main-idea cards made for one of your books. */
    setOwnBookIdeas: (id: string, patch: Pick<OwnBook, 'ideas' | 'ideasVersion' | 'description' | 'topicId' | 'lang'>) => void;
    removeOwnBook: (id: string) => void;
    markDownloaded: (id: string) => void;
  };

export type BrainState = {
  /** Brain score per skill, 0-100 (a running average of recent sessions). */
  skills: Partial<Record<Skill, number>>;
  /** Best points per game or quiz set. */
  best: Record<string, number>;
  /** Current difficulty per game, 1-10 (adapted as you play). */
  levels: Record<string, number>;
  played: Record<string, number>;
  /** Games whose how-to has been shown. */
  seen: string[];
  daily: { date: string; game: boolean; quiz: boolean };
  /** Experience points from all training, for ranks. */
  xp?: number;
  /** Sound effects on (web). */
  sound?: boolean;
  /** IQ-style test results, newest first. */
  tests?: BrainTest[];
  /** Sound volume, 0 to 1. */
  volume?: number;
  /** A puzzle run left unfinished, so it can be resumed. */
  run?: BrainRun;
  /** Today's three-game session and how each game went. */
  session?: BrainSession;
  /** One snapshot of the area scores per day you trained, oldest first (for the progress chart). */
  history?: { date: string; skills: Partial<Record<Skill, number>> }[];
};
export type BrainRun = { id: string; n: number; right: number; points: number; d: number; streak: number; hardest: number; seconds: number; history: boolean[]; saved: number };
export type BrainSession = { date: string; games: string[]; done: Record<string, { points: number; right: number; total: number; xp: number; from: number; to: number }> };
export type BrainTest = {
  date: string;
  mode: 'full' | 'quick';
  iq: number;
  correct: number;
  total: number;
  seconds: number;
  domains: Partial<Record<Skill, { right: number; total: number }>>;
  /** Newer tests: the age the score was normed for, a 95% range, index scores and subtest scaled scores (1-19). */
  age?: number;
  range?: [number, number];
  indexes?: Record<string, number>;
  subtests?: Record<string, number>;
  version?: number;
};
export type BrainResult = { id: string; skill: Skill; points: number; perf: number; xp: number; rating?: number; seconds?: number };

const EMPTY_DAY: DayLog = { seconds: 0, pages: 0, words: 0, cards: 0 };
const CARD_SECONDS = 30;

const DEFAULT_STASH: Stash = { id: 'saved', name: 'Saved', ideaIds: [], createdAt: new Date(0).toISOString() };

const initialUserState: UserState = {
  followedTopicIds: [],
  stashes: [DEFAULT_STASH],
  streak: { count: 0, lastActiveDate: null },
  bookProgress: {},
  favoriteBooks: [],
  likedIdeaIds: [],
  readIdeaIds: [],
  dailyGoal: 10,
  today: { date: '', count: 0 },
  readerSettings: { theme: 'light', fontSize: 19, font: 'literata' },
  readerProgress: {},
  bookmarks: {},
  clips: [],
  highlights: [],
  readingLog: {},
  minuteGoal: 10,
  finishedReaders: {},
  reviews: {},
  reviewNew: { date: '', count: 0 },
  notInterested: [],
  appearance: 'auto',
  brain: { skills: {}, best: {}, levels: {}, played: {}, seen: [], daily: { date: '', game: false, quiz: false } },
  ownBooks: [],
  downloadedBooks: [],
};

const StoreContext = createContext<Store | null>(null);

function toIndex<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

export function localDate(d = new Date()): string {
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
  // The database holds accounts; it only replaces the bundled cards when it has been filled with content on purpose.
  if (!supabase || process.env.EXPO_PUBLIC_SUPABASE_CONTENT !== '1') return null;
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
    topics: [...topics.data, ...bundledContent.topics.filter((t) => isKidId(t.id))],
    sources: [...remoteSources, ...bundledContent.sources.filter((x) => isKidId(x.topicId))],
    ideas: [...remoteIdeas, ...bundledContent.ideas.filter((i) => i.kind !== 'idea' || isKidId(i.topicId))],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(bundledContent);
  const [user, setUser] = useState<UserState>(initialUserState);
  const [ready, setReady] = useState(false);

  // Each account has its own saved state (the device guest keeps the original key), so people sharing a device never
  // see each other's settings or progress. `owner` is the key the state in memory belongs to.
  const [account, setAccount] = useState<Account | null>(null);
  const [recovering, setRecovering] = useState(false);
  const owner = useRef<string | null>(null);
  const accountRef = useRef<Account | null>(null);
  const cloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFor = useCallback(async (acc: Account | null) => {
    setReady(false);
    owner.current = null;
    const key = keyFor(acc?.id);
    let stored: Record<string, unknown> = {};
    let hadLocal = false;
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        stored = JSON.parse(raw);
        hadLocal = true;
      }
    } catch {
      // unreadable: start fresh
    }
    if (acc) {
      const cloud = await loadCloud(acc.id).catch(() => null);
      if (cloud && (!stored.savedAt || cloud.updatedAt > String(stored.savedAt))) stored = cloud.data;
      else if (!cloud && !hadLocal) {
        // A brand-new account: bring this device's guest progress along only if the person asked for it at sign-up.
        const want = await AsyncStorage.getItem(IMPORT_KEY).catch(() => null);
        if (want && want.toLowerCase() === acc.email.toLowerCase()) {
          const guest = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
          if (guest) stored = { ...JSON.parse(guest), guest: undefined };
        }
        AsyncStorage.removeItem(IMPORT_KEY).catch(() => {});
      }
    }
    const saved: UserState = { ...initialUserState, ...stored };
    // Books saved as "Want to read" before favorites existed become favorites.
    if (!stored.favoriteBooks && Array.isArray(stored.savedBookIds)) saved.favoriteBooks = (stored.savedBookIds as string[]).map((id) => `book:${id}`);
    delete (saved as Partial<UserState> & { savedBookIds?: string[] }).savedBookIds;
    owner.current = key;
    setUser({ ...saved, streak: bumpStreak(saved.streak) });
    setReady(true);
  }, []);

  useEffect(() => {
    fetchRemoteContent().then((remote) => remote && setContent(remote));
    if (!supabase) {
      Promise.resolve().then(() => loadFor(null));
      return;
    }
    const toAccount = (s: { user: { id: string; email?: string } } | null): Account | null => (s ? { id: s.user.id, email: s.user.email ?? '' } : null);
    let first = true;
    const switchTo = (a: Account | null) => {
      if (!first && (accountRef.current?.id ?? null) === (a?.id ?? null)) return;
      first = false;
      accountRef.current = a;
      setAccount(a);
      loadFor(a);
    };
    supabase.auth.getSession().then(({ data }) => switchTo(toAccount(data.session)), () => switchTo(null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      if (event === 'INITIAL_SESSION') return;
      // Outside the auth callback, as Supabase recommends for follow-up calls.
      setTimeout(() => switchTo(toAccount(session)), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadFor]);

  useEffect(() => {
    if (!ready || !owner.current) return;
    const payload = { ...user, savedAt: new Date().toISOString() };
    AsyncStorage.setItem(owner.current, JSON.stringify(payload)).catch(() => {});
    const acc = accountRef.current;
    if (acc && owner.current === keyFor(acc.id)) {
      // Online copy, a few seconds after the last change.
      if (cloudTimer.current) clearTimeout(cloudTimer.current);
      cloudTimer.current = setTimeout(() => saveCloud(acc.id, payload as unknown as Record<string, unknown>).catch(() => {}), 2500);
    }
  }, [user, ready]);

  const continueAsGuest = useCallback(() => setUser((u) => ({ ...u, guest: true })), []);

  // Kids and adults keep their own followed topics: setting one group's leaves the other's alone.
  const setFollowedTopics = useCallback((ids: string[]) => {
    setUser((u) => ({ ...u, followedTopicIds: [...u.followedTopicIds.filter((id) => isKidId(id) !== (u.audience === 'kid')), ...ids] }));
  }, []);
  const setAudience = useCallback((audience: Audience) => setUser((u) => ({ ...u, audience })), []);
  const setBirthYear = useCallback((birthYear: number) => setUser((u) => ({ ...u, birthYear })), []);

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
      const day = u.readingLog[date] ?? EMPTY_DAY;
      return {
        ...u,
        readIdeaIds: [ideaId, ...u.readIdeaIds.filter((id) => id !== ideaId)].slice(0, MAX_READ_HISTORY),
        today: { date, count: todayCount + (firstTime ? 1 : 0) },
        // A card takes about half a minute to read; count it toward the day's reading time.
        readingLog: firstTime ? { ...u.readingLog, [date]: { ...day, cards: day.cards + 1, seconds: day.seconds + CARD_SECONDS } } : u.readingLog,
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

  const toggleFavoriteBook = useCallback((key: string) => {
    setUser((u) => ({
      ...u,
      favoriteBooks: u.favoriteBooks.includes(key) ? u.favoriteBooks.filter((k) => k !== key) : [key, ...u.favoriteBooks],
    }));
  }, []);

  const setDailyGoal = useCallback((dailyGoal: number) => setUser((u) => ({ ...u, dailyGoal })), []);

  const resetProgress = useCallback(() => {
    setUser((u) => ({ ...u, bookProgress: {}, readIdeaIds: [], today: { date: localDate(), count: 0 } }));
  }, []);

  const setReaderSettings = useCallback((settings: Partial<ReaderSettings>) => {
    setUser((u) => ({ ...u, readerSettings: { ...u.readerSettings, ...settings } }));
  }, []);

  const setReaderPosition = useCallback((readerId: string, position: ReaderPosition, fraction: number) => {
    setUser((u) => ({
      ...u,
      readerProgress: { ...u.readerProgress, [readerId]: { ...position, fraction, updatedAt: new Date().toISOString() } },
    }));
  }, []);

  const toggleBookmark = useCallback((readerId: string, position: ReaderPosition, label: string) => {
    setUser((u) => {
      const list = u.bookmarks[readerId] ?? [];
      const same = (b: Bookmark) => b.chapter === position.chapter && b.para === position.para && b.char === position.char;
      const next = list.some(same)
        ? list.filter((b) => !same(b))
        : [...list, { ...position, id: `${Date.now()}`, label, createdAt: new Date().toISOString() }];
      return { ...u, bookmarks: { ...u.bookmarks, [readerId]: next } };
    });
  }, []);

  const removeBookmark = useCallback((readerId: string, bookmarkId: string) => {
    setUser((u) => ({ ...u, bookmarks: { ...u.bookmarks, [readerId]: (u.bookmarks[readerId] ?? []).filter((b) => b.id !== bookmarkId) } }));
  }, []);

  const saveClip = useCallback((clip: Omit<Idea, 'id' | 'kind'>) => {
    const idea: Idea = { ...clip, id: `clip-${Date.now().toString(36)}`, kind: 'quote' };
    setUser((u) => ({ ...u, clips: [idea, ...u.clips] }));
    return idea;
  }, []);

  const addHighlight = useCallback((h: Omit<Highlight, 'id' | 'createdAt'>) => {
    const highlight: Highlight = { ...h, id: `hl-${Date.now().toString(36)}`, createdAt: new Date().toISOString() };
    setUser((u) => ({ ...u, highlights: [highlight, ...u.highlights] }));
    return highlight;
  }, []);

  const updateHighlight = useCallback((id: string, patch: Partial<Highlight>) => {
    setUser((u) => ({ ...u, highlights: u.highlights.map((h) => (h.id === id ? { ...h, ...patch } : h)) }));
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setUser((u) => ({ ...u, highlights: u.highlights.filter((h) => h.id !== id) }));
  }, []);

  const logReading = useCallback((delta: Partial<DayLog>) => {
    setUser((u) => {
      const date = localDate();
      const day = u.readingLog[date] ?? EMPTY_DAY;
      const next: DayLog = {
        seconds: day.seconds + (delta.seconds ?? 0),
        pages: day.pages + (delta.pages ?? 0),
        words: day.words + (delta.words ?? 0),
        cards: day.cards + (delta.cards ?? 0),
      };
      return { ...u, readingLog: { ...u.readingLog, [date]: next }, streak: bumpStreak(u.streak) };
    });
  }, []);

  const setMinuteGoal = useCallback((minuteGoal: number) => setUser((u) => ({ ...u, minuteGoal })), []);

  const markReaderFinished = useCallback((readerId: string) => {
    setUser((u) => (u.finishedReaders[readerId] ? u : { ...u, finishedReaders: { ...u.finishedReaders, [readerId]: new Date().toISOString() } }));
  }, []);

  const gradeReview = useCallback((key: string, grade: Grade) => {
    const date = localDate();
    setUser((u) => {
      const isNew = !u.reviews[key];
      const started = u.reviewNew.date === date ? u.reviewNew.count : 0;
      return { ...u, reviews: { ...u.reviews, [key]: schedule(u.reviews[key], grade, date) }, reviewNew: { date, count: started + (isNew ? 1 : 0) } };
    });
  }, []);

  const setNotInterested = useCallback((ideaId: string, hide: boolean) => {
    setUser((u) => ({
      ...u,
      notInterested: hide ? [ideaId, ...u.notInterested.filter((id) => id !== ideaId)] : u.notInterested.filter((id) => id !== ideaId),
    }));
  }, []);

  // Changing the app's appearance also lets the reader follow it again (drops a manual reader theme).
  const setAppearance = useCallback((appearance: Appearance) => {
    setUser((u) => ({ ...u, appearance, readerSettings: { ...u.readerSettings, themeOverride: undefined } }));
  }, []);

  const recordBrain = useCallback((r: BrainResult) => {
    setUser((u) => {
      const b = u.brain ?? initialUserState.brain;
      const old = b.skills[r.skill];
      const date = localDate();
      const day = u.readingLog[date] ?? EMPTY_DAY;
      return {
        ...u,
        streak: bumpStreak(u.streak),
        // Brain practice counts toward the day's minutes too.
        readingLog: { ...u.readingLog, [date]: { ...day, seconds: day.seconds + Math.min(r.seconds ?? 60, 900) } },
        brain: {
          ...b,
          skills: { ...b.skills, [r.skill]: Math.round(old === undefined ? r.perf : old * 0.65 + r.perf * 0.35) },
          history: [
            ...(b.history ?? []).filter((h) => h.date !== date),
            { date, skills: { ...b.skills, [r.skill]: Math.round(old === undefined ? r.perf : old * 0.65 + r.perf * 0.35) } },
          ].slice(-120),
          best: r.points > (b.best[r.id] ?? 0) ? { ...b.best, [r.id]: r.points } : b.best,
          levels: r.rating ? { ...b.levels, [r.id]: r.rating } : b.levels,
          played: { ...b.played, [r.id]: (b.played[r.id] ?? 0) + 1 },
          xp: (b.xp ?? 0) + r.xp,
        },
      };
    });
  }, []);

  const addBrainTest = useCallback((t: BrainTest) => {
    setUser((u) => ({ ...u, brain: { ...u.brain, tests: [t, ...(u.brain.tests ?? [])].slice(0, 30), xp: (u.brain.xp ?? 0) + t.correct * 25 } }));
  }, []);

  const setBrainSound = useCallback((on: boolean) => setUser((u) => ({ ...u, brain: { ...u.brain, sound: on } })), []);
  const patchBrain = useCallback((p: Partial<BrainState>) => setUser((u) => ({ ...u, brain: { ...u.brain, ...p } })), []);
  const exportUser = useCallback(() => user as unknown as Record<string, unknown>, [user]);
  const importUser = useCallback((data: Record<string, unknown>, mode: 'merge' | 'replace') => {
    setUser((u) => {
      const next = (mode === 'replace' ? { ...initialUserState, ...data } : { ...initialUserState, ...mergeUser(u as unknown as Record<string, unknown>, data) }) as UserState;
      return { ...next, streak: bumpStreak(next.streak), lastBackup: u.lastBackup ?? next.lastBackup };
    });
  }, []);
  const markBackedUp = useCallback(() => setUser((u) => ({ ...u, lastBackup: new Date().toISOString() })), []);
  const setUiLanguage = useCallback((l: 'auto' | 'en' | 'fr') => setUser((u) => ({ ...u, uiLanguage: l })), []);

  const markBrainHowTo = useCallback((id: string) => {
    setUser((u) => ({ ...u, brain: { ...u.brain, seen: [...new Set([...(u.brain?.seen ?? []), id])] } }));
  }, []);

  const markBrainDaily = useCallback((part: 'game' | 'quiz') => {
    setUser((u) => {
      const date = localDate();
      const daily = u.brain.daily.date === date ? u.brain.daily : { date, game: false, quiz: false };
      return { ...u, brain: { ...u.brain, daily: { ...daily, [part]: true } } };
    });
  }, []);

  const addOwnBook = useCallback((book: OwnBook) => setUser((u) => ({ ...u, ownBooks: [book, ...u.ownBooks] })), []);
  const setOwnBookIdeas = useCallback(
    (id: string, patch: Pick<OwnBook, 'ideas' | 'ideasVersion' | 'description' | 'topicId' | 'lang'>) =>
      setUser((u) => ({ ...u, ownBooks: u.ownBooks.map((b) => (b.id === id ? { ...b, ...patch, lang: b.lang ?? patch.lang } : b)) })),
    [],
  );

  const removeOwnBook = useCallback((id: string) => {
    setUser((u) => {
      const { [`own:${id}`]: _progress, ...readerProgress } = u.readerProgress;
      const { [`own:${id}`]: _marks, ...bookmarks } = u.bookmarks;
      return {
        ...u,
        ownBooks: u.ownBooks.filter((b) => b.id !== id),
        favoriteBooks: u.favoriteBooks.filter((k) => k !== `own:${id}` && k !== `book:${ownSourceId(id)}`),
        // Its idea cards go too, so take them out of your stashes.
        stashes: u.stashes.map((st) => ({ ...st, ideaIds: st.ideaIds.filter((i) => !i.startsWith(`${ownSourceId(id)}-`)) })),
        readerProgress,
        bookmarks,
      };
    });
  }, []);

  const markDownloaded = useCallback(
    (id: string) => setUser((u) => ({ ...u, downloadedBooks: [id, ...u.downloadedBooks.filter((d) => d !== id)] })),
    [],
  );

  // Your own books, with the idea cards made from them, appear like library books (always, in kid and adult mode).
  const own = useMemo(() => {
    const sources: Source[] = [];
    const ideas: Idea[] = [];
    for (const b of user.ownBooks) {
      if (!b.ideas?.length) continue;
      const sourceId = ownSourceId(b.id);
      const topicId = b.topicId ?? 'philosophy';
      sources.push({ id: sourceId, title: b.title, author: b.author === 'PDF' ? 'Your PDF' : b.author, kind: 'book', topicId, description: b.description ?? '' });
      b.ideas.forEach((idea, n) => ideas.push({ id: `${sourceId}-${n + 1}`, kind: 'idea', topicId, sourceId, title: idea.title, body: idea.body }));
    }
    return { sources, ideas };
  }, [user.ownBooks]);

  const indexes = useMemo(() => {
    const ideasBySource: Record<string, Idea[]> = {};
    for (const idea of [...content.ideas, ...own.ideas]) {
      if (idea.sourceId) (ideasBySource[idea.sourceId] ??= []).push(idea);
    }
    return {
      topicById: toIndex(content.topics),
      sourceById: toIndex([...content.sources, ...own.sources]),
      ideaById: toIndex([...content.ideas, ...own.ideas, ...user.clips]),
      ideasBySource,
    };
  }, [content, own, user.clips]);

  const value = useMemo<Store>(() => {
    const savedIds = new Set(user.stashes.flatMap((s) => s.ideaIds));
    const favoriteSet = new Set(user.favoriteBooks);
    const today = user.today.date === localDate() ? user.today : { date: localDate(), count: 0 };
    // Review: everything stashed or highlighted is an item; due ones first (oldest first), then today's share of new ones.
    const date = localDate();
    const items = [...[...savedIds].map((id) => `idea:${id}`), ...user.highlights.map((h) => `hl:${h.id}`)];
    const due = items.filter((k) => user.reviews[k] && user.reviews[k].due <= date).sort((a, b) => user.reviews[a].due.localeCompare(user.reviews[b].due));
    const newLeft = Math.max(0, NEW_PER_DAY - (user.reviewNew.date === date ? user.reviewNew.count : 0));
    const fresh = items.filter((k) => !user.reviews[k]).slice(0, newLeft);
    const reviewQueue = [...due, ...fresh];
    // Only the chosen group's topics, cards and idea books are listed; the indexes keep everything.
    const kid = user.audience === 'kid';
    const mine = (topicId: string) => isKidId(topicId) === kid;
    return {
      topics: content.topics.filter((t) => mine(t.id)),
      sources: [...own.sources, ...content.sources.filter((s) => mine(s.topicId))],
      ideas: [...content.ideas.filter((i) => mine(i.topicId)), ...own.ideas],
      allContent: content,
      ...user,
      followedTopicIds: user.followedTopicIds.filter(mine),
      setAudience,
      setBirthYear,
      account,
      recovering,
      setRecovering,
      continueAsGuest,
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
      toggleFavoriteBook,
      isFavoriteBook: (key) => favoriteSet.has(key),
      setDailyGoal,
      resetProgress,
      setReaderSettings,
      setReaderPosition,
      toggleBookmark,
      removeBookmark,
      saveClip,
      addHighlight,
      updateHighlight,
      removeHighlight,
      logReading,
      setMinuteGoal,
      markReaderFinished,
      reviewQueue,
      gradeReview,
      setNotInterested,
      setAppearance,
      recordBrain,
      addBrainTest,
      setBrainSound,
      patchBrain,
      exportUser,
      importUser,
      markBackedUp,
      setUiLanguage,
      markBrainHowTo,
      markBrainDaily,
      addOwnBook,
      setOwnBookIdeas,
      removeOwnBook,
      markDownloaded,
    };
  }, [
    content, own, setOwnBookIdeas, user, ready, indexes, setFollowedTopics, createStash, deleteStash, toggleInStash, toggleLike, markRead, setBookPosition,
    finishBook, toggleFavoriteBook, setDailyGoal, resetProgress, setReaderSettings, setReaderPosition, toggleBookmark, removeBookmark,
    saveClip, addHighlight, updateHighlight, removeHighlight, logReading, setMinuteGoal, markReaderFinished, gradeReview, setNotInterested, setAppearance, recordBrain, addBrainTest, setBrainSound, patchBrain, exportUser, importUser, markBackedUp, setUiLanguage, markBrainHowTo, markBrainDaily, addOwnBook, removeOwnBook, markDownloaded, setAudience, setBirthYear, account, recovering, continueAsGuest,
  ]);

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

/**
 * The For you feed, ranked from your likes, stashes, highlights, favourite books and reading (see feed.ts).
 * The ranking is worked out once per day and filter, so liking a card doesn't reshuffle the feed under you;
 * "Not interested" removes a card straight away.
 */
export function useFeed(kind: CardKind | null): FeedItem[] {
  const store = useStore();
  const day = localDate();
  // A snapshot of your signals when the feed opens.
  const [signals] = useState(() => ({
    likedIdeaIds: store.likedIdeaIds,
    stashedIdeaIds: store.stashes.flatMap((st) => st.ideaIds),
    readIdeaIds: store.readIdeaIds,
    bookTopicIds: [
      ...store.favoriteBooks.map((k) => (k.startsWith('book:') ? store.sourceById[k.slice(5)]?.topicId : k.startsWith('classic:') ? classicById[k.slice(8)]?.topicId : undefined)),
      ...store.highlights.map((h) => (h.readerId.startsWith('classic:') ? classicById[h.readerId.slice(8)]?.topicId : undefined)),
    ].filter((t): t is string => !!t),
    notInterested: store.notInterested,
  }));
  const { ideas, followedTopicIds, ideaById, sourceById, topicById, notInterested } = store;
  const ranked = useMemo(
    () => rankFeed({ ...signals, ideas, kind, followedTopicIds, ideaById, sourceById, topicById, random: seededRandom(`${day}:${kind ?? 'all'}`) }),
    [signals, ideas, kind, followedTopicIds, ideaById, sourceById, topicById, day],
  );
  return useMemo(() => {
    const hidden = new Set(notInterested);
    return ranked.filter((f) => !hidden.has(f.idea.id));
  }, [ranked, notInterested]);
}
