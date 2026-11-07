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
  fr: () => Promise.all([import('@/data/learn/fr-full'), import('@/data/learn/fr-more1')]).then(([base, m1]) => merge(base.FRENCH_FULL, [m1.TOPICS])),
  ja: () => Promise.all([import('@/data/learn/ja-full'), import('@/data/learn/ja-more1')]).then(([base, m1]) => merge(base.JAPANESE_FULL, [m1.TOPICS])),
  ko: () => Promise.all([import('@/data/learn/ko-full'), import('@/data/learn/ko-more1')]).then(([base, m1]) => merge(base.KOREAN_FULL, [m1.TOPICS])),
  de: () => Promise.all([import('@/data/learn/de-full'), import('@/data/learn/de-more1')]).then(([base, m1]) => merge(base.GERMAN_FULL, [m1.TOPICS])),
  zh: () => Promise.all([import('@/data/learn/zh-full'), import('@/data/learn/zh-more1')]).then(([base, m1]) => merge(base.CHINESE_FULL, [m1.TOPICS])),
  it: () => Promise.all([import('@/data/learn/it-full'), import('@/data/learn/it-more1')]).then(([base, m1]) => merge(base.ITALIAN_FULL, [m1.TOPICS])),
  pt: () => Promise.all([import('@/data/learn/pt-full'), import('@/data/learn/pt-more1')]).then(([base, m1]) => merge(base.PORTUGUESE_FULL, [m1.TOPICS])),
  en: () => Promise.all([import('@/data/learn/en-full'), import('@/data/learn/en-more1')]).then(([base, m1]) => merge(base.ENGLISH_FULL, [m1.TOPICS])),
  ru: () => Promise.all([import('@/data/learn/ru-full'), import('@/data/learn/ru-more1')]).then(([base, m1]) => merge(base.RUSSIAN_FULL, [m1.TOPICS])),
  ar: () => Promise.all([import('@/data/learn/ar-full'), import('@/data/learn/ar-more1')]).then(([base, m1]) => merge(base.ARABIC_FULL, [m1.TOPICS])),
  tr: () => import('@/data/learn/tr-full').then((m) => m.TURKISH_FULL),
  hi: () => import('@/data/learn/hi-full').then((m) => m.HINDI_FULL),
  nl: () => import('@/data/learn/nl-full').then((m) => m.DUTCH_FULL),
  es: () =>
    Promise.all([import('@/data/learn/es-full'), import('@/data/learn/es-a1-more'), import('@/data/learn/es-a2-more'), import('@/data/learn/es-b1-more'), import('@/data/learn/es-more2'), import('@/data/learn/es-more3'), import('@/data/learn/es-more4'), import('@/data/learn/es-more5')]).then(([base, a1, a2, b1, m2, m3, m4, m5]) =>
      merge(base.SPANISH_FULL, [a1.TOPICS, a2.TOPICS, b1.TOPICS, m2.TOPICS, m3.TOPICS, m4.TOPICS, m5.TOPICS]),
    ),
};

const cache = new Map<string, Promise<FullCourse | null>>();
export function loadFull(courseId: string): Promise<FullCourse | null> {
  if (!cache.has(courseId)) cache.set(courseId, LOADERS[courseId] ? LOADERS[courseId]().catch(() => null) : Promise.resolve(null));
  return cache.get(courseId)!;
}
export const hasFull = (courseId: string) => !!LOADERS[courseId];
