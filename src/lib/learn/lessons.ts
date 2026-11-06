import type { Course, LItem } from '@/data/learn/courses';
import type { Dialogue, FullCourse, Grammar, Story } from '@/data/learn/full';
import { buildReview, buildSession, type Step } from '@/lib/learn/session';
import { wordChunks, wordItem, wordKey, type Lesson, type PlanUnit, type Section } from '@/lib/learn/plan';

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
  | { type: 'question'; prompt: { en: string; fr: string }; answer: string; options: string[] }
  | { type: 'picture'; item: LItem; options: LItem[] }
  | { type: 'pictureOf'; item: LItem; options: LItem[] }
  | { type: 'memory'; items: LItem[] }
  | { type: 'speed'; pool: LItem[] }
  | { type: 'scene'; items: LItem[]; ask: LItem[]; topic: { id: string; icon: string; en: string; fr: string } };

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

/** A noun without its article (Spanish, French, Italian, Portuguese, German, Dutch): "la mesa" → "mesa", "l’école" → "école". */
const ARTICLE = /^(the|an|el|la|los|las|un|una|le|les|des|du|une|il|lo|gli|os|as|um|uma|der|die|das|ein|eine|de|het|een)\s+|^(l[’'])/i;
const bare = (w: string) => w.replace(ARTICLE, '');

/** "Un café con leche" with "café" → "Un ___ con leche" (whole word, any case). */
/** Japanese, Chinese and Korean: no spaces between words, or no Latin letters to type. */
/** Words written in Latin letters (others are not typed on a phone keyboard in lessons). */
const LATIN = /^[\p{Script=Latin}\p{N}\s\p{P}\p{S}]+$/u;
const CJK = /[぀-ヿ㐀-鿿가-힯]/;

function blank(sentence: string, word: string) {
  const core = bare(word);
  if (CJK.test(core)) return sentence.includes(core) ? { text: sentence.replace(core, '___'), answer: core } : null;
  const re = new RegExp(`(^|[^\\p{L}])(${core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=[^\\p{L}]|$)`, 'iu');
  if (!re.test(sentence)) return null;
  return { text: sentence.replace(re, '$1___'), answer: sentence.match(re)![2] };
}

/** Symbols that don't picture a thing: no picture games for these words. */
const ABSTRACT = new Set(['💬', '👍', '👎', '✅', '❌', '❓', '❗', '➡️', '⬅️', '⬆️', '⬇️', '🔁', '🔢', '➕', '➖', '✔️', '💯', '🆗', '🔤', '📝']);
/** Words that make good picture games: a concrete picture, not shared with another word of the set. */
export function pictured(items: LItem[]) {
  const count = new Map<string, number>();
  for (const it of items) if (it.emoji) count.set(it.emoji, (count.get(it.emoji) ?? 0) + 1);
  return items.filter((it) => it.emoji && !ABSTRACT.has(it.emoji) && count.get(it.emoji) === 1);
}

/** The broad kind of an activity, for variety. */
const family = (s: FullStep) => (s.type === 'pick' ? `pick-${s.ask}` : s.type);
/** Never more than 3 activities of the same kind in a row: pull a different one forward when a run gets long. */
export function vary(steps: FullStep[]): FullStep[] {
  const out = [...steps];
  for (let i = 3; i < out.length; i++) {
    const f = family(out[i]);
    if (family(out[i - 1]) === f && family(out[i - 2]) === f && family(out[i - 3]) === f) {
      const j = out.findIndex((s, k) => k > i && family(s) !== f && s.type !== 'learn');
      if (j > 0) [out[i], out[j]] = [out[j], out[i]];
    }
  }
  return out;
}

function wordSteps(course: Course, items: LItem[], pool: LItem[], extra: 'memory' | 'speed'): FullStep[] {
  const pics = new Set(pictured(pool).map((p) => p.key ?? p.text));
  const picPool = pool.filter((p) => pics.has(p.key ?? p.text));
  const intro: FullStep[] = [];
  items.forEach((it, k) => {
    intro.push({ type: 'learn', item: it });
    // A quick check right after each new word: from its picture when it has one, else its meaning.
    if (pics.has(it.key ?? it.text) && k % 2 === 0) intro.push({ type: 'picture', item: it, options: shuffle([it, ...pickOthers(pool, it, 2)]) });
    else intro.push({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) });
  });
  // Practice: each word once more, cycling listening, word → picture and meaning.
  const practice: FullStep[] = shuffle(items).map((it, k) => {
    const kind = k % 3;
    if (kind === 1 && pics.has(it.key ?? it.text) && picPool.length >= 4) return { type: 'pictureOf', item: it, options: shuffle([it, ...pickOthers(picPool, it, 3)]) };
    if (kind === 2) return { type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) };
    return { type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(pool, it, 3)]) };
  });
  const own = items.filter((i) => pics.has(i.key ?? i.text));
  const games: FullStep[] = [];
  if (extra === 'memory' && own.length >= 3) games.push({ type: 'memory', items: shuffle(own).slice(0, 4) });
  else if (items.length >= 4) games.push({ type: 'match', items: shuffle(items).slice(0, 5) });
  if (extra === 'speed' && picPool.length >= 4) games.push({ type: 'speed', pool: picPool });
  return [...intro, ...vary(practice), ...games];
}

/** "Tap the thing in the scene": the topic's objects laid out on a backdrop. */
function sceneStep(items: LItem[], topic: { id: string; icon: string; en: string; fr: string }): FullStep | null {
  const own = shuffle(pictured(items)).slice(0, 6);
  return own.length >= 4 ? { type: 'scene', items: own, ask: shuffle(own).slice(0, 4), topic } : null;
}

function contextSteps(items: LItem[], pool: LItem[]): FullStep[] {
  const steps: FullStep[] = [];
  const withEx = items.filter((i) => i.ex);
  for (const it of shuffle(withEx).slice(0, 4)) steps.push({ type: 'listenq', item: it, options: shuffle([it, ...pickOthers(withEx.length >= 4 ? withEx : pool.filter((p) => p.ex), it, 2)]) });
  for (const it of shuffle(withEx).slice(0, 4)) {
    const b = blank(it.ex!, it.text);
    if (b) steps.push({ type: 'gap', text: b.text, answer: b.answer, options: shuffle([b.answer, ...pickOthers(pool.map((p) => bare(p.text)), b.answer, 2)]), en: it.exEn ?? '', fr: it.exFr ?? '', item: it });
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
  for (const it of shuffle(items.filter((i) => i.ex && (CJK.test(i.ex) ? i.ex.length <= 16 : i.ex.split(' ').length <= 7))).slice(0, 2)) steps.push({ type: 'speak', item: it, phrase: it.ex! });
  // Typing kana or hanzi on a phone is a chore: those courses listen and pick instead.
  for (const it of shuffle(items).slice(0, 3)) steps.push(!LATIN.test(it.text) ? { type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(items, it, 3)]) } : { type: 'dictation', item: it });
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
    const chunks = wordChunks(items.length);
    const size = Math.ceil(items.length / chunks);
    const k = Math.max(0, (Number(lesson.id.slice(1)) || 1) - 1);
    const chunk = items.slice(k * size, (k + 1) * size);
    const pool = levelWords.length >= 8 ? levelWords : items;
    switch (lesson.kind) {
      case 'words1':
        return wordSteps(course, chunk, pool, 'memory');
      case 'words2':
        return wordSteps(course, chunk, pool, 'speed');
      case 'context': {
        const scene = sceneStep(items, topic);
        return [...(scene ? [scene] : []), ...vary(shuffle(contextSteps(items, pool)))];
      }
      case 'speak':
        return speakSteps(items);
      default: {
        const pics = pictured(items);
        const mixed = vary(
          shuffle([
            ...shuffle(items).slice(0, 3).map((it): FullStep => ({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
            ...shuffle(items).slice(0, 3).map((it): FullStep => ({ type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(items, it, 3)]) })),
            ...shuffle(pics).slice(0, 2).map((it): FullStep => ({ type: 'picture', item: it, options: shuffle([it, ...pickOthers(pool, it, 2)]) })),
            ...shuffle(contextSteps(items, pool)).slice(0, 3),
          ]),
        );
        const games: FullStep[] = pics.length >= 3 ? [{ type: 'memory', items: shuffle(pics).slice(0, 4) }] : [{ type: 'match', items: shuffle(items).slice(0, 5) }];
        const picPool = pictured(pool);
        if (picPool.length >= 4) games.push({ type: 'speed', pool: picPool });
        return [...mixed.slice(0, 4), games[0], ...mixed.slice(4), ...games.slice(1)];
      }
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
    return vary(shuffle([
      ...shuffle(pool).slice(0, 5).map((it): FullStep => ({ type: 'pick', item: it, ask: 'meaning', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
      ...shuffle(pool).slice(0, 3).map((it): FullStep => ({ type: 'pick', item: it, ask: 'listen', options: shuffle([it, ...pickOthers(pool, it, 3)]) })),
      ...contextSteps(shuffle(pool).slice(0, 6), pool).filter((s) => s.type === 'gap').slice(0, 2),
      ...shuffle(grammar).slice(0, 3).map((d): FullStep => ({ type: 'gap', text: d.text, answer: d.answer, options: shuffle([d.answer, ...d.wrong]), en: d.en, fr: d.fr })),
      ...shuffle(pictured(pool)).slice(0, 2).map((it): FullStep => ({ type: 'pictureOf', item: it, options: shuffle([it, ...pickOthers(pictured(pool), it, 3)]) })),
    ]));
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
