/**
 * The IQ-style test, built the way standard intelligence batteries are: several short subtests grouped into five
 * indexes (verbal, fluid reasoning, visual-spatial, working memory, processing speed), each scored against people of
 * the same age, then combined into one full-scale estimate with an uncertainty range.
 *
 * Multiple-choice subtests are adaptive (each answer moves the next item's difficulty towards your level) and scored
 * with a three-parameter item-response model, so lucky guesses on 5- or 6-option items count for less. Digit span and
 * symbol coding are scored from their raw results. The age norms below are our own approximations of published
 * lifespan trends (ability climbs through childhood, reasoning and speed ease off in later adulthood while vocabulary
 * keeps growing); they are not a standardisation sample, so the result stays an estimate, not a clinical score.
 */
import type { Skill } from '@/lib/brain/core';

export type IndexId = 'VCI' | 'FRI' | 'VSI' | 'WMI' | 'PSI';
export const INDEXES: { id: IndexId; name: string; short: string; color: string }[] = [
  { id: 'VCI', name: 'Verbal comprehension', short: 'Verbal', color: '#FF6FB5' },
  { id: 'FRI', name: 'Fluid reasoning', short: 'Reasoning', color: '#7C8CFF' },
  { id: 'VSI', name: 'Visual-spatial', short: 'Spatial', color: '#4FD1FF' },
  { id: 'WMI', name: 'Working memory', short: 'Memory', color: '#3DDC97' },
  { id: 'PSI', name: 'Processing speed', short: 'Speed', color: '#FFB547' },
];
export const indexOf = (id: IndexId) => INDEXES.find((x) => x.id === id)!;

export type SubtestId = 'matrix' | 'series' | 'vocab' | 'similar' | 'folding' | 'rotation' | 'digits' | 'coding';
export type Subtest = {
  id: SubtestId;
  name: string;
  index: IndexId;
  skill: Skill;
  kind: 'mc' | 'span' | 'coding';
  /** Brain game whose generator makes the items (multiple-choice subtests drawn from games). */
  game?: string;
  /** Seconds allowed per item before it counts as wrong. */
  perItem?: number;
  how: string;
};
export const SUBTESTS: Record<SubtestId, Subtest> = {
  matrix: { id: 'matrix', name: 'Matrix Reasoning', index: 'FRI', skill: 'logic', kind: 'mc', game: 'matrix', perItem: 75, how: 'Each grid follows hidden rules across its rows. Pick the figure that completes the empty cell.' },
  series: { id: 'series', name: 'Number Series', index: 'FRI', skill: 'math', kind: 'mc', game: 'series', perItem: 60, how: 'Find the rule behind the numbers and pick the one that comes next.' },
  vocab: { id: 'vocab', name: 'Vocabulary', index: 'VCI', skill: 'verbal', kind: 'mc', perItem: 25, how: 'Pick the answer that means the same as the word.' },
  similar: { id: 'similar', name: 'Similarities', index: 'VCI', skill: 'verbal', kind: 'mc', perItem: 35, how: 'Say how two things are alike. The best answer is the most general one that is true for both.' },
  folding: { id: 'folding', name: 'Paper Folding', index: 'VSI', skill: 'spatial', kind: 'mc', game: 'folding', perItem: 60, how: 'A sheet is folded and punched. Pick how it looks when unfolded.' },
  rotation: { id: 'rotation', name: 'Mental Rotation', index: 'VSI', skill: 'spatial', kind: 'mc', game: 'rotation3d', perItem: 45, how: 'Pick the shape that is the target turned on the page, not flipped over.' },
  digits: { id: 'digits', name: 'Digit Span', index: 'WMI', skill: 'memory', kind: 'span', how: 'Digits appear one per second. Type them back in the same order, then later in reverse order. The lists get longer.' },
  coding: { id: 'coding', name: 'Symbol Coding', index: 'PSI', skill: 'focus', kind: 'coding', how: 'Each symbol has a number in the key. Tap the number for the symbol shown, as fast and accurately as you can.' },
};

export type Mode = 'full' | 'quick';
/** Subtests in order (verbal and non-verbal alternate, as in standard batteries) and items per multiple-choice subtest. */
export const PLANS: Record<Mode, { order: SubtestId[]; items: Partial<Record<SubtestId, number>>; codingSeconds: number; minutes: number }> = {
  full: {
    order: ['matrix', 'vocab', 'folding', 'digits', 'series', 'similar', 'rotation', 'coding'],
    items: { matrix: 10, vocab: 10, folding: 6, series: 8, similar: 8, rotation: 8 },
    codingSeconds: 90,
    minutes: 30,
  },
  quick: {
    order: ['matrix', 'vocab', 'rotation', 'digits', 'coding'],
    items: { matrix: 7, vocab: 7, rotation: 6 },
    codingSeconds: 60,
    minutes: 15,
  },
};

// ---------- item response model ----------

/** Item difficulty 1-10 on the ability scale (0 = an average young adult). */
export const itemB = (d: number) => (d - 5.5) / 1.5;
/** The generator level whose items suit an ability. */
export const levelFor = (theta: number) => Math.max(1, Math.min(10, Math.round(5.5 + 1.5 * theta)));
const A = 1.3;

export type Response = { d: number; options: number; right: boolean };

/**
 * Ability from right/wrong answers: the posterior mean and spread on a grid (EAP), with a broad prior centred on the
 * test-taker's age group so short subtests stay stable.
 */
export function estimate(rs: Response[], priorMu: number, priorSd = 1.4) {
  let sw = 0;
  let sm = 0;
  let s2 = 0;
  for (let t = -6; t <= 4.5; t += 0.05) {
    let logp = -((t - priorMu) ** 2) / (2 * priorSd * priorSd);
    for (const r of rs) {
      const c = 1 / Math.max(2, r.options);
      const p = c + (1 - c) / (1 + Math.exp(-A * (t - itemB(r.d))));
      logp += Math.log(r.right ? p : 1 - p);
    }
    const w = Math.exp(logp);
    sw += w;
    sm += w * t;
    s2 += w * t * t;
  }
  const mean = sm / sw;
  return { theta: mean, se: Math.sqrt(Math.max(0.01, s2 / sw - mean * mean)) };
}

// ---------- age norms ----------

/** How far below young adults each ability sits in childhood (multiplier on a shared growth curve). */
const CHILD: Record<IndexId, number> = { VCI: 1.1, FRI: 1, VSI: 1, WMI: 0.6, PSI: 1.2 };

/** Typical ability (on the adult scale) and its spread for an age. */
export function norm(age: number, index: IndexId) {
  const a = Math.max(6, Math.min(90, age));
  let mu = 0;
  if (a < 20) mu = -3 * CHILD[index] * ((20 - a) / 14) ** 1.3;
  else if (index === 'VCI') mu = 0.012 * Math.min(Math.max(0, a - 22), 43) - 0.03 * Math.max(0, a - 75);
  else if (index === 'PSI') mu = -0.03 * Math.max(0, a - 24);
  else if (index === 'WMI') mu = -0.016 * Math.max(0, a - 28);
  else mu = -0.022 * Math.max(0, a - 28);
  const sd = a < 20 ? 0.85 + (0.15 * (a - 6)) / 14 : 1;
  return { mu, sd };
}

/** Digit span (longest forward + longest backward) and coding rate, put on the same ability scale as the other subtests. */
const SPAN_MEAN = 11.4;
const SPAN_SD = 2.2;
const CODING_PER_MIN = 34;
const CODING_SD = 7.5;
export const spanTheta = (forward: number, backward: number) => (forward + backward - SPAN_MEAN) / SPAN_SD;
export const codingTheta = (correct: number, wrong: number, seconds: number) => ((Math.max(0, correct - wrong) * 60) / seconds - CODING_PER_MIN) / CODING_SD;

// ---------- scores ----------

export type SubtestResult = { id: SubtestId; theta: number; se: number; right: number; total: number; raw?: string };
export type Scores = {
  iq: number;
  range: [number, number];
  /** Standard scores (mean 100, SD 15) per index. */
  indexes: Partial<Record<IndexId, number>>;
  /** Scaled scores (mean 10, SD 3, from 1 to 19) per subtest. */
  scaled: Partial<Record<SubtestId, number>>;
  /** z-score per subtest, for strengths and weaknesses. */
  z: Partial<Record<SubtestId, number>>;
};

const clampZ = (z: number) => Math.max(-3.4, Math.min(3.4, z));
/** A composite of k scores that correlate about r with each other is more extreme than their average. */
const composite = (zs: number[], r: number) => zs.reduce((a, b) => a + b, 0) / Math.sqrt(zs.length + zs.length * (zs.length - 1) * r);

export function score(results: SubtestResult[], age: number): Scores {
  const z: Scores['z'] = {};
  const scaled: Scores['scaled'] = {};
  const err: number[] = [];
  for (const r of results) {
    const n = norm(age, SUBTESTS[r.id].index);
    const v = clampZ((r.theta - n.mu) / n.sd);
    z[r.id] = v;
    scaled[r.id] = Math.max(1, Math.min(19, Math.round(10 + 3 * v)));
    err.push((r.se / n.sd) ** 2);
  }
  const indexes: Scores['indexes'] = {};
  for (const ix of INDEXES) {
    const zs = results.filter((r) => SUBTESTS[r.id].index === ix.id).map((r) => z[r.id]!);
    if (zs.length) indexes[ix.id] = Math.round(Math.max(40, Math.min(160, 100 + 15 * composite(zs, 0.6))));
  }
  const all = results.map((r) => z[r.id]!);
  const k = all.length;
  const zc = composite(all, 0.45);
  const iq = Math.round(Math.max(40, Math.min(160, 100 + 15 * zc)));
  // Measurement error of the composite: subtest errors add, scaled the same way as the composite.
  const se = (15 * Math.sqrt(err.reduce((a, b) => a + b, 0))) / Math.sqrt(k + k * (k - 1) * 0.45);
  const half = Math.max(4, Math.round(1.96 * se));
  return { iq, range: [Math.max(40, iq - half), Math.min(160, iq + half)], indexes, scaled, z };
}

/** The usual descriptive bands for standard scores. */
export function band(iq: number) {
  if (iq >= 130) return 'Extremely high';
  if (iq >= 120) return 'Very high';
  if (iq >= 110) return 'High average';
  if (iq >= 90) return 'Average';
  if (iq >= 80) return 'Low average';
  if (iq >= 70) return 'Very low';
  return 'Extremely low';
}
