import type { FullCourse, Topic } from '@/data/learn/full';

const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2 } as const;

/** Extra word packs: a topic with an existing id adds its words to it; a new id is a new topic. */
function merge(base: FullCourse, packs: Topic[][]): FullCourse {
  const topics = base.topics.map((t) => ({ ...t, words: [...t.words] }));
  // A word is taught once, in the first topic that has it.
  const have = new Set(topics.flatMap((t) => t.words.map((w) => w.text)));
  for (const pack of packs)
    for (const t of pack) {
      const fresh = t.words.filter((w) => !have.has(w.text) && !!have.add(w.text));
      const old = topics.find((x) => x.id === t.id);
      if (old) old.words.push(...fresh);
      else if (fresh.length >= 4) topics.push({ ...t, words: fresh });
    }
  // Stable by level, so a level's new topics follow its first ones.
  topics.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  return { ...base, topics };
}

/** Full A1 → B1 content, loaded only when a course is opened (each language is its own download). */
const LOADERS: Record<string, () => Promise<FullCourse>> = {
  fr: () => import('@/data/learn/fr-full').then((m) => m.FRENCH_FULL),
  ja: () => import('@/data/learn/ja-full').then((m) => m.JAPANESE_FULL),
  ko: () => import('@/data/learn/ko-full').then((m) => m.KOREAN_FULL),
  de: () => import('@/data/learn/de-full').then((m) => m.GERMAN_FULL),
  zh: () => import('@/data/learn/zh-full').then((m) => m.CHINESE_FULL),
  it: () => import('@/data/learn/it-full').then((m) => m.ITALIAN_FULL),
  pt: () => import('@/data/learn/pt-full').then((m) => m.PORTUGUESE_FULL),
  en: () => import('@/data/learn/en-full').then((m) => m.ENGLISH_FULL),
  ru: () => import('@/data/learn/ru-full').then((m) => m.RUSSIAN_FULL),
  ar: () => import('@/data/learn/ar-full').then((m) => m.ARABIC_FULL),
  es: () =>
    Promise.all([import('@/data/learn/es-full'), import('@/data/learn/es-a1-more'), import('@/data/learn/es-a2-more'), import('@/data/learn/es-b1-more'), import('@/data/learn/es-more2'), import('@/data/learn/es-more3'), import('@/data/learn/es-more4')]).then(([base, a1, a2, b1, m2, m3, m4]) =>
      merge(base.SPANISH_FULL, [a1.TOPICS, a2.TOPICS, b1.TOPICS, m2.TOPICS, m3.TOPICS, m4.TOPICS]),
    ),
};

const cache = new Map<string, Promise<FullCourse | null>>();
export function loadFull(courseId: string): Promise<FullCourse | null> {
  if (!cache.has(courseId)) cache.set(courseId, LOADERS[courseId] ? LOADERS[courseId]().catch(() => null) : Promise.resolve(null));
  return cache.get(courseId)!;
}
export const hasFull = (courseId: string) => !!LOADERS[courseId];
