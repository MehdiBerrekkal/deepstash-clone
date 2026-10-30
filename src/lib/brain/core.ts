/**
 * Shared pieces for Brain training: domains, items, randomness, adaptive difficulty, ranks and the IQ-style estimate.
 * Every puzzle is generated here from our own rules; nothing is copied from published tests or apps.
 */

/** Stored skill keys (kept from v1 so saved progress carries over) and how they're shown. */
export type Skill = 'logic' | 'memory' | 'math' | 'spatial' | 'verbal' | 'focus';
export const DOMAINS: { id: Skill; name: string; short: string; color: string; glyph: string }[] = [
  { id: 'logic', name: 'Reasoning', short: 'REA', color: '#7C8CFF', glyph: '◇' },
  { id: 'spatial', name: 'Spatial', short: 'SPA', color: '#4FD1FF', glyph: '◰' },
  { id: 'memory', name: 'Memory', short: 'MEM', color: '#3DDC97', glyph: '▦' },
  { id: 'focus', name: 'Speed', short: 'SPD', color: '#FFB547', glyph: '⟫' },
  { id: 'math', name: 'Numerical', short: 'NUM', color: '#B78CFF', glyph: '∑' },
  { id: 'verbal', name: 'Verbal', short: 'VRB', color: '#FF6FB5', glyph: '¶' },
];
export const domainOf = (s: Skill) => DOMAINS.find((d) => d.id === s)!;

export type Rng = () => number;
export function seeded(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
export const int = (rng: Rng, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));
export const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)];
export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Difficulty runs 1 (easy) to 10 (very hard). */
export const MAX_D = 10;

/**
 * A multiple-choice item. `prompt` is drawn by the matching renderer (see ItemView); options are values that the
 * same renderer can draw (text, figures, grids…).
 */
export type Item = {
  kind: string;
  /** The question line shown above the prompt. */
  ask: string;
  prompt: unknown;
  options: unknown[];
  answer: number;
  explain: string;
  difficulty: number;
};

/** Puts the right option among distractors at a random position. */
export function arrange<T>(rng: Rng, right: T, wrong: T[]): { options: T[]; answer: number } {
  const options = shuffle(rng, [right, ...wrong]);
  return { options, answer: options.indexOf(right) };
}

/** Number options near the answer, all different. */
export function numberOptions(rng: Rng, answer: number, n = 6, spread: number[] = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10]) {
  const set = new Set<number>();
  for (const d of shuffle(rng, spread)) {
    if (set.size >= n - 1) break;
    if (answer + d !== answer) set.add(answer + d);
  }
  let k = 11;
  while (set.size < n - 1) set.add(answer + (k++ % 2 ? k : -k));
  return arrange(rng, answer, [...set]);
}

// ---------- adaptive difficulty ----------

/**
 * A staircase: two right in a row steps up, a wrong answer steps down, so each run settles where you get about
 * 70% right and keeps pushing as you improve.
 */
export function stair(d: number, right: boolean, streak: number) {
  if (!right) return Math.max(1, d - 1);
  return streak > 0 && streak % 2 === 0 ? Math.min(MAX_D, d + 1) : d;
}

// ---------- ranks and XP ----------

export const RANKS = [
  { name: 'Bronze', xp: 0, color: '#C98B5B' },
  { name: 'Silver', xp: 600, color: '#B8C2CC' },
  { name: 'Gold', xp: 1800, color: '#F2C14E' },
  { name: 'Platinum', xp: 4000, color: '#7FE3D6' },
  { name: 'Diamond', xp: 8000, color: '#7CC4FF' },
  { name: 'Master', xp: 14000, color: '#B18CFF' },
  { name: 'Genius', xp: 24000, color: '#FF7AC3' },
];
export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const next = RANKS[i + 1];
  return { ...RANKS[i], index: i, next, progress: next ? (xp - RANKS[i].xp) / (next.xp - RANKS[i].xp) : 1 };
}

// ---------- IQ-style estimate ----------

/** Item difficulty 1-10 on a logistic scale. */
const itemB = (d: number) => (d - 5.5) / 1.6;

/**
 * Ability from right/wrong answers on items of known difficulty (a one-parameter logistic model), turned into an
 * IQ-style number: mean 100, SD 15, clamped to 55-160. It's an estimate for practice, not a clinical score.
 */
export function estimateIQ(answers: { d: number; right: boolean }[]) {
  if (!answers.length) return 100;
  let theta = 0;
  for (let it = 0; it < 40; it++) {
    let g = 0;
    let h = 0;
    for (const a of answers) {
      const p = 1 / (1 + Math.exp(-(theta - itemB(a.d))));
      g += (a.right ? 1 : 0) - p;
      h -= p * (1 - p);
    }
    // A weak prior keeps all-right or all-wrong runs finite.
    g -= theta / 4;
    h -= 1 / 4;
    theta -= g / h;
  }
  return Math.round(Math.min(160, Math.max(55, 100 + 15 * theta)));
}

/** Share of people below a score on a normal curve (for "higher than X% of people"). */
export function percentile(iq: number) {
  const z = (iq - 100) / 15;
  // Abramowitz-Stegun approximation of the normal CDF.
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return Math.round((z > 0 ? 1 - p : p) * 1000) / 10;
}
