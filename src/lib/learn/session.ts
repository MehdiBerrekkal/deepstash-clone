import type { Course, LItem, Unit } from '@/data/learn/courses';

/** One screen of a lesson. */
export type Step =
  | { type: 'learn'; item: LItem }
  | { type: 'pick'; item: LItem; ask: 'sound' | 'listen' | 'meaning' | 'char'; options: LItem[] }
  | { type: 'write'; item: LItem; mode: 'trace' | 'hint' | 'free' }
  | { type: 'match'; items: LItem[] }
  | { type: 'build'; item: LItem; tiles: string[] }
  | { type: 'block'; item: LItem; consonants: string[]; vowels: string[] }
  | { type: 'tone'; item: LItem }
  | { type: 'spell'; item: LItem; options: string[] };

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const others = (pool: LItem[], item: LItem, n: number) => shuffle(pool.filter((x) => x.text !== item.text)).slice(0, n);
const options = (pool: LItem[], item: LItem, n = 4) => shuffle([item, ...others(pool, item, n - 1)]);

/** Misspellings of a word: accents moved or dropped, ñ and double letters lost, so only one option is right. */
function misspell(word: string): string[] {
  const plain = word.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').replace(/ı/g, 'i');
  const out = new Set<string>();
  if (plain !== word) out.add(plain);
  const vowels = [...plain].map((c, i) => ({ c, i })).filter(({ c }) => 'aeiou'.includes(c));
  for (const { i } of vowels) {
    const accented = plain.slice(0, i) + plain[i].normalize('NFD') + '́' + plain.slice(i + 1);
    out.add(accented.normalize('NFC'));
  }
  out.add(word.replace('rr', 'r').replace('ll', 'l').replace('ñ', 'n'));
  out.delete(word);
  return shuffle([...out]).slice(0, 3);
}

/**
 * A lesson for a unit: new things are shown first (heard, watched, traced), then practised in different ways,
 * and the session ends on something a little harder. About 12–16 steps, 3–5 minutes.
 */
export function buildSession(course: Course, unit: Unit, done: boolean): Step[] {
  const items = unit.items;
  const pool = course.units.filter((u) => u.kind === unit.kind || (unit.kind === 'phrases' && u.kind === 'words')).flatMap((u) => u.items);
  const steps: Step[] = [];
  const pick = shuffle(items).slice(0, Math.min(items.length, done ? 8 : 6));
  const groups = [pick.slice(0, 3), pick.slice(3, 6), pick.slice(6)].filter((g) => g.length);

  for (const g of groups) {
    if (unit.kind === 'script') {
      for (const it of g) {
        if (!done) steps.push({ type: 'learn', item: it });
        // Writing practice where stroke data exists; other alphabets are learned by sight and sound.
        if (unit.script) steps.push({ type: 'write', item: it, mode: done ? 'hint' : 'trace' });
        else steps.push({ type: 'pick', item: it, ask: 'listen', options: options(items, it) });
      }
      for (const it of g) steps.push({ type: 'pick', item: it, ask: Math.random() < 0.5 ? 'sound' : 'listen', options: options(items.length >= 4 ? items : pool, it) });
    } else if (unit.kind === 'blocks') {
      for (const it of g) {
        if (!done) steps.push({ type: 'learn', item: it });
        const c = it.parts![0];
        const v = it.parts![1];
        const cs = shuffle([c, ...shuffle([...new Set(pool.map((x) => x.parts?.[0]).filter((x): x is string => !!x && x !== c))]).slice(0, 3)]);
        const vs = shuffle([v, ...shuffle([...new Set(pool.map((x) => x.parts?.[1]).filter((x): x is string => !!x && x !== v))]).slice(0, 3)]);
        steps.push({ type: 'block', item: it, consonants: cs, vowels: vs });
      }
      for (const it of g) steps.push({ type: 'pick', item: it, ask: 'listen', options: options(items, it) });
    } else if (unit.kind === 'tones') {
      for (const it of g) {
        if (!done) steps.push({ type: 'learn', item: it });
        steps.push({ type: 'tone', item: it });
      }
    } else if (unit.kind === 'accents') {
      for (const it of g) {
        if (!done) steps.push({ type: 'learn', item: it });
        steps.push({ type: 'spell', item: it, options: shuffle([it.text, ...(it.wrong ?? misspell(it.text))]) });
        steps.push({ type: 'pick', item: it, ask: 'listen', options: options(items, it) });
      }
    } else {
      // Words and phrases.
      for (const it of g) {
        if (!done) steps.push({ type: 'learn', item: it });
        steps.push({ type: 'pick', item: it, ask: 'meaning', options: options(items.length >= 4 ? items : pool, it) });
      }
      for (const it of g) {
        if (it.tiles && it.tiles.length > 1) {
          const extra = shuffle(pool.filter((x) => x !== it).flatMap((x) => x.tiles ?? [])).filter((t) => !it.tiles!.includes(t)).slice(0, unit.kind === 'phrases' ? 2 : 3);
          steps.push({ type: 'build', item: it, tiles: shuffle([...it.tiles, ...extra]) });
        } else steps.push({ type: 'pick', item: it, ask: 'listen', options: options(items, it) });
      }
    }
  }
  // A timed matching round to finish.
  if (items.length >= 4 && unit.kind !== 'tones') steps.push({ type: 'match', items: shuffle(items).slice(0, Math.min(5, items.length)) });
  // Practised characters get written once more from memory.
  if (unit.kind === 'script' && unit.script && done) for (const it of shuffle(items).slice(0, 2)) steps.push({ type: 'write', item: it, mode: 'free' });
  return steps;
}

/** A review session from items that are due (or the weakest), across a course's finished units. */
export function buildReview(course: Course, keys: string[]): Step[] {
  const all = course.units.flatMap((u) => u.items.map((it) => ({ u, it })));
  const chosen = keys.map((k) => all.find(({ u, it }) => `${course.id}:${u.id}:${it.text}` === k)).filter(Boolean).slice(0, 12) as { u: Unit; it: LItem }[];
  return chosen.flatMap(({ u, it }) => {
    const pool = u.items.length >= 4 ? u.items : course.units.flatMap((x) => x.items);
    if (u.kind === 'script' && u.script) return [{ type: 'write', item: it, mode: 'hint' } as Step, { type: 'pick', item: it, ask: 'sound', options: options(pool, it) } as Step];
    if (u.kind === 'script') return [{ type: 'pick', item: it, ask: 'sound', options: options(pool, it) } as Step];
    if (u.kind === 'tones') return [{ type: 'tone', item: it } as Step];
    return [{ type: 'pick', item: it, ask: Math.random() < 0.5 ? 'meaning' : 'listen', options: options(pool, it) } as Step];
  });
}

export const itemKey = (course: Course, unit: Unit, item: LItem) => `${course.id}:${unit.id}:${item.text}`;
