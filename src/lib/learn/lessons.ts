import type { Course, LItem } from '@/data/learn/courses';
import type { Dialogue, FullCourse, Grammar, Story } from '@/data/learn/full';
import { buildReview, buildSession, type Step } from '@/lib/learn/session';
import { wordItem, wordKey, type Lesson, type PlanUnit, type Section } from '@/lib/learn/plan';

/** The extra activities of full courses. */
export type FullStep =
  | Step
  | { type: 'note'; title: string; card: Grammar['cards'][number]; index: number; total: number }
  | { type: 'gap'; text: string; answer: string; options: string[]; en: string; fr: string; item?: LItem }
  | { type: 'listenq'; item: LItem; options: LItem[] }
  | { type: 'speak'; item: LItem; phrase: string }
  | { type: 'dictation'; item: LItem }
  | { type: 'dialogue'; dialogue: Dialogue; speakIt: boolean }
  | { type: 'story'; story: Story }
  | { type: 'question'; prompt: { en: string; fr: string }; answer: string; options: string[] };

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const label = (x: unknown) => (typeof x === 'string' ? x : (x as { text?: string }).text ?? '');
/** n distinct others from the pool (never the same word twice, never the answer). */
const pickOthers = <T,>(pool: T[], not: T, n: number) => {
  const seen = new Set([label(not)]);
  return shuffle(pool).filter((x) => !seen.has(label(x)) && !!seen.add(label(x))).slice(0, n);
};

/** "Un café con leche" with "café" → "Un ___ con leche" (whole word, any case). */
function blank(sentence: string, word: string) {
  const core = word.replace(/^(el|la|los|las|un|una)\s+/i, '');
  const re = new RegExp(`(^|[^\\p{L}])(${core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=[^\\p{L}]|$)`, 'iu');
  if (!re.test(sentence)) return null;
  return { text: sentence.replace(re, '$1___'), answer: sentence.match(re)![2] };
}

function wordSteps(course: Course, items: LItem[], pool: LItem[]): FullStep[] {
  const steps: FullStep[] = [];
  for (const it of items) {
    steps.push({ type: 'learn', item: it });
    steps.push({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) });
  }
  for (const it of shuffle(items)) steps.push({ type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(pool, it, 3)]) });
  if (items.length >= 4) steps.push({ type: 'match', items: shuffle(items).slice(0, 5) });
  return steps;
}

function contextSteps(items: LItem[], pool: LItem[]): FullStep[] {
  const steps: FullStep[] = [];
  const withEx = items.filter((i) => i.ex);
  for (const it of shuffle(withEx).slice(0, 4)) steps.push({ type: 'listenq', item: it, options: shuffle([it, ...pickOthers(withEx.length >= 4 ? withEx : pool.filter((p) => p.ex), it, 2)]) });
  for (const it of shuffle(withEx).slice(0, 4)) {
    const b = blank(it.ex!, it.text);
    if (b) steps.push({ type: 'gap', text: b.text, answer: b.answer, options: shuffle([b.answer, ...pickOthers(pool.map((p) => p.text.replace(/^(el|la|los|las)\s+/i, '')), b.answer, 2)]), en: it.exEn ?? '', fr: it.exFr ?? '', item: it });
  }
  for (const it of shuffle(withEx).slice(0, 2)) {
    const tiles = it.ex!.replace(/[¿?¡!,.]/g, '').split(/\s+/).filter(Boolean);
    if (tiles.length >= 3 && tiles.length <= 9) steps.push({ type: 'build', item: { ...it, text: it.ex!, tiles, en: it.exEn ?? it.en, fr: it.exFr ?? it.fr }, tiles: shuffle(tiles) });
  }
  return steps;
}

function speakSteps(items: LItem[]): FullStep[] {
  const steps: FullStep[] = [];
  for (const it of shuffle(items).slice(0, 3)) steps.push({ type: 'speak', item: it, phrase: it.text });
  for (const it of shuffle(items.filter((i) => i.ex && i.ex.split(' ').length <= 7)).slice(0, 2)) steps.push({ type: 'speak', item: it, phrase: it.ex! });
  for (const it of shuffle(items).slice(0, 3)) steps.push({ type: 'dictation', item: it });
  return steps;
}

function drillSteps(g: Grammar): FullStep[] {
  return shuffle(g.drills).map((d) => ({ type: 'gap', text: d.text, answer: d.answer, options: shuffle([d.answer, ...d.wrong]), en: d.en, fr: d.fr }));
}

/** Steps for one lesson of a full course. */
export function buildLesson(course: Course, full: FullCourse | null, sections: Section[], unit: PlanUnit, lesson: Lesson, done: boolean): FullStep[] {
  if (lesson.kind === 'basic' && unit.basic) return buildSession(course, unit.basic, done);
  const levelWords = (sections.find((s) => s.id === unit.section)?.units ?? []).flatMap((u) => (u.topic ? u.topic.words.map((w) => wordItem(w, wordKey(course, u.topic!, w))) : []));
  if (unit.topic) {
    const topic = unit.topic;
    const items = topic.words.map((w) => wordItem(w, wordKey(course, topic, w)));
    const half = Math.ceil(items.length / 2);
    const pool = levelWords.length >= 8 ? levelWords : items;
    switch (lesson.kind) {
      case 'words1':
        return wordSteps(course, items.slice(0, half), pool);
      case 'words2':
        return wordSteps(course, items.slice(half), pool);
      case 'context':
        return contextSteps(items, pool);
      case 'speak':
        return speakSteps(items);
      default:
        return [
          ...shuffle(items).slice(0, 4).map((it): FullStep => ({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
          ...shuffle(items).slice(0, 3).map((it): FullStep => ({ type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(items, it, 3)]) })),
          { type: 'match', items: shuffle(items).slice(0, 5) },
          ...contextSteps(items, pool).slice(0, 3),
        ];
    }
  }
  if (unit.grammar) {
    const g = unit.grammar;
    if (lesson.kind === 'notes') return [...g.cards.map((card, index): FullStep => ({ type: 'note', title: g.en, card, index, total: g.cards.length })), ...drillSteps(g).slice(0, 3)];
    return drillSteps(g);
  }
  if (unit.dialogue) return [{ type: 'dialogue', dialogue: unit.dialogue, speakIt: lesson.id === 'again' }];
  if (unit.story) {
    const s = unit.story;
    return [{ type: 'story', story: s }, ...s.questions.map((q): FullStep => ({ type: 'question', prompt: { en: q.en, fr: q.fr }, answer: q.answer, options: shuffle([q.answer, ...q.wrong]) }))];
  }
  if (unit.type === 'checkpoint') {
    // A dozen questions across the level: meanings, listening, gaps and grammar.
    const pool = levelWords;
    const grammar = (sections.find((s) => s.id === unit.section)?.units ?? []).flatMap((u) => (u.grammar ? u.grammar.drills : []));
    return [
      ...shuffle(pool).slice(0, 5).map((it): FullStep => ({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
      ...shuffle(pool).slice(0, 3).map((it): FullStep => ({ type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
      ...contextSteps(shuffle(pool).slice(0, 6), pool).filter((s) => s.type === 'gap').slice(0, 2),
      ...shuffle(grammar).slice(0, 3).map((d): FullStep => ({ type: 'gap', text: d.text, answer: d.answer, options: shuffle([d.answer, ...d.wrong]), en: d.en, fr: d.fr })),
    ];
  }
  return [];
}

/** All words of a full course, for the word bank. */
export const allWords = (course: Course, full: FullCourse | null) => (full ? full.topics.flatMap((t) => t.words.map((w) => ({ ...wordItem(w, wordKey(course, t, w)), topic: t }))) : []);

/** Spaced review: due letters and basics from the old units, plus due words of the full course. */
export function buildFullReview(course: Course, full: FullCourse | null, keys: string[]): FullStep[] {
  const base: FullStep[] = buildReview(course, keys);
  if (!full) return base;
  const words = allWords(course, full);
  const byKey = new Map(words.map((w) => [w.key!, w]));
  const due = keys.map((k) => byKey.get(k)).filter(Boolean).slice(0, Math.max(4, 14 - base.length)) as LItem[];
  const extra = due.map((it): FullStep => {
    const pool = words.filter((w) => w.topic.level === (it as LItem & { topic: { level: string } }).topic.level);
    const r = Math.random();
    if (r < 0.2 && it.ex) return { type: 'listenq', item: it, options: shuffle([it, ...pickOthers(pool.filter((p) => p.ex), it, 2)]) };
    return { type: 'pick', item: it, ask: r < 0.6 ? 'meaning' : 'listen', options: shuffle([it, ...pickOthers(pool, it, 3)]) };
  });
  return shuffle([...base, ...extra]);
}
