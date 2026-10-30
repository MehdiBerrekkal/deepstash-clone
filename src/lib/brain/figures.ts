import { arrange, int, pick, shuffle, type Item, type Rng } from '@/lib/brain/core';

/**
 * Abstract figures for matrix reasoning and analogies. A figure is a few independent layers, so rules can act on
 * each one: an outer shape (kind, size, fill), an inner shape, lines through the centre (a set of angles) and dots.
 */
export type Outer = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'none';
export type Fill = 0 | 1 | 2; // empty, grey, black
export type Figure = {
  outer: Outer;
  size: 0 | 1 | 2;
  fill: Fill;
  inner: Outer;
  innerFill: Fill;
  /** Bit mask of line angles: 1 = 0°, 2 = 45°, 4 = 90°, 8 = 135°. */
  lines: number;
  dots: number; // 0-4
  /** Angle of the outer shape, in 45° steps. */
  turn: number;
};
const SHAPES: Outer[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
const LINE_SETS = [1, 2, 4, 8, 3, 5, 6, 9, 10, 12];

/** A square turned 45° is a diamond (and vice versa): compare figures as they look. */
function canonical(f: Figure): Figure {
  const t = ((f.turn % 8) + 8) % 8;
  if ((f.outer === 'square' || f.outer === 'diamond') && t % 2 === 1) return { ...f, outer: f.outer === 'square' ? 'diamond' : 'square', turn: t + 1 };
  return { ...f, turn: t };
}

export const sameFigure = (x: Figure, y: Figure) => sameCanonical(canonical(x), canonical(y));
const sameCanonical = (a: Figure, b: Figure) =>
  a.outer === b.outer &&
  a.size === b.size &&
  a.fill === b.fill &&
  a.inner === b.inner &&
  a.innerFill === b.innerFill &&
  a.lines === b.lines &&
  a.dots === b.dots &&
  // A circle looks the same at any angle; so do shapes whose symmetry covers the turn.
  (a.outer === 'circle' || a.outer === 'none' || normTurn(a) === normTurn(b));

/** The figure's angle reduced by its symmetry (a square turned 90° looks the same). */
function normTurn(f: Figure) {
  const period = f.outer === 'square' || f.outer === 'diamond' ? 2 : f.outer === 'hexagon' ? 4 : 8;
  return ((f.turn % period) + period) % period;
}

type Attr = 'outer' | 'size' | 'fill' | 'inner' | 'lines' | 'dots' | 'turn';
type Rule = { attr: Attr; kind: 'constant' | 'progression' | 'distribution' | 'xor' | 'or' | 'sum'; describe: string };

/**
 * Builds a 3×3 matrix where each attribute follows a rule across every row. Difficulty adds attributes and harder
 * rules: progressions and constants first, then a different set of three in each row, then lines that combine
 * (the third is what's in exactly one of the first two), and dots that add up.
 */
export function makeMatrix(d: number, rng: Rng): Item {
  const count = d <= 2 ? 1 : d <= 4 ? 2 : d <= 7 ? 3 : 4;
  const pool: Attr[] = shuffle(rng, d <= 3 ? ['outer', 'size', 'fill', 'dots'] : ['outer', 'size', 'fill', 'inner', 'lines', 'dots', 'turn']);
  const attrs = pool.slice(0, count);
  if (d >= 6 && !attrs.includes('lines')) attrs[attrs.length - 1] = 'lines';
  const rules: Rule[] = attrs.map((attr) => chooseRule(attr, d, rng));
  const base: Figure = {
    outer: pick(rng, SHAPES),
    size: 1,
    fill: 0,
    inner: 'none',
    innerFill: 2,
    lines: 0,
    dots: 0,
    turn: 0,
  };
  const grid: Figure[][] = [0, 1, 2].map(() => [0, 1, 2].map(() => ({ ...base })));
  for (const rule of rules) applyRule(grid, rule, rng);
  const cells = grid.flat();
  const answer = cells[8];
  const wrong = distractors(answer, rules, rng, 7);
  const { options, answer: idx } = arrange(rng, answer, wrong);
  return {
    kind: 'matrix',
    ask: 'Which figure completes the pattern?',
    prompt: cells.slice(0, 8),
    options,
    answer: idx,
    explain: rules.map((r) => r.describe).join(' '),
    difficulty: d,
  };
}

const PLURAL: Record<Attr, string> = {
  outer: 'outer shapes', size: 'sizes', fill: 'shadings', inner: 'inner shapes', lines: 'line patterns', dots: 'dot counts', turn: 'angles',
};

function chooseRule(attr: Attr, d: number, rng: Rng): Rule {
  const kinds: Rule['kind'][] =
    attr === 'lines'
      ? d >= 6 ? ['xor', 'or', 'distribution'] : ['distribution', 'constant', 'or']
      : attr === 'dots'
        ? d >= 5 ? ['sum', 'progression', 'distribution'] : ['progression', 'distribution']
        : attr === 'size' || attr === 'turn'
          ? ['progression', 'distribution']
          : d <= 2 ? ['constant', 'distribution'] : ['distribution', 'distribution', 'constant'];
  const kind = pick(rng, kinds);
  const name = { outer: 'outer shape', size: 'size', fill: 'shading', inner: 'inner shape', lines: 'lines', dots: 'dots', turn: 'angle' }[attr];
  const describe = {
    constant: `The ${name} stays the same along each row.`,
    progression: `The ${name} changes step by step along each row.`,
    distribution: `Each row uses the same three ${PLURAL[attr]} in a different order.`,
    xor: 'In each row, the third figure has the lines found in exactly one of the first two.',
    or: 'In each row, the third figure combines the lines of the first two.',
    sum: 'In each row, the dots of the first two figures add up to the third.',
  }[kind];
  return { attr, kind, describe };
}

function applyRule(grid: Figure[][], rule: Rule, rng: Rng) {
  const set = (r: number, c: number, v: number | Outer) => {
    (grid[r][c] as unknown as Record<string, number | Outer>)[rule.attr] = v;
  };
  const values: Record<Attr, (number | Outer)[]> = {
    outer: shuffle(rng, SHAPES).slice(0, 3),
    inner: shuffle(rng, ['circle', 'square', 'triangle', 'diamond'] as Outer[]).slice(0, 3),
    size: [0, 1, 2],
    fill: shuffle(rng, [0, 1, 2]),
    lines: shuffle(rng, LINE_SETS).slice(0, 3),
    dots: shuffle(rng, [1, 2, 3, 4]).slice(0, 3),
    turn: [0, 1, 2],
  };
  const v = values[rule.attr];
  for (let r = 0; r < 3; r++) {
    if (rule.kind === 'constant') {
      const row = rule.attr === 'outer' || rule.attr === 'inner' ? v[r] : v[(r + 1) % 3];
      for (let c = 0; c < 3; c++) set(r, c, row);
    } else if (rule.kind === 'progression') {
      const start = rule.attr === 'dots' ? int(rng, 0, 1) : 0;
      const step = rule.attr === 'turn' ? pick(rng, [1, 2]) : 1;
      for (let c = 0; c < 3; c++) set(r, c, rule.attr === 'turn' ? (r + c * step) % 8 : rule.attr === 'dots' ? start + c + (r === 1 ? 1 : 0) : c);
    } else if (rule.kind === 'distribution') {
      for (let c = 0; c < 3; c++) set(r, c, v[(c + r) % 3]);
    } else if (rule.kind === 'xor' || rule.kind === 'or') {
      const a = pick(rng, LINE_SETS);
      let b = pick(rng, LINE_SETS);
      while (b === a) b = pick(rng, LINE_SETS);
      set(r, 0, a);
      set(r, 1, b);
      set(r, 2, rule.kind === 'xor' ? a ^ b : a | b);
    } else if (rule.kind === 'sum') {
      const a = int(rng, 0, 2);
      const b = int(rng, 1, 4 - a);
      set(r, 0, a);
      set(r, 1, b);
      set(r, 2, a + b);
    }
  }
  // Inner shapes need a visible fill.
  if (rule.attr === 'inner') for (const row of grid) for (const f of row) f.innerFill = f.fill === 2 ? 0 : 2;
}

/** Close distractors: the answer with one (or, sometimes, two) attributes changed, all different. */
function distractors(answer: Figure, rules: Rule[], rng: Rng, n: number): Figure[] {
  const tweaks: ((f: Figure) => Figure)[] = [
    (f) => ({ ...f, outer: pick(rng, SHAPES.filter((s) => s !== f.outer)) }),
    (f) => ({ ...f, size: ((f.size + pick(rng, [1, 2])) % 3) as Figure['size'] }),
    (f) => ({ ...f, fill: ((f.fill + pick(rng, [1, 2])) % 3) as Fill }),
    (f) => ({ ...f, lines: f.lines ^ pick(rng, [1, 2, 4, 8]) }),
    (f) => ({ ...f, lines: pick(rng, LINE_SETS.filter((l) => l !== f.lines)) }),
    (f) => ({ ...f, dots: f.dots === 0 ? 1 : f.dots === 4 ? 3 : f.dots + pick(rng, [1, -1]) }),
    (f) => ({ ...f, turn: f.turn + pick(rng, [1, 2, 3]) }),
    (f) => ({ ...f, inner: f.inner === 'none' ? pick(rng, ['circle', 'square'] as Outer[]) : pick(rng, (['circle', 'square', 'triangle', 'diamond'] as Outer[]).filter((s) => s !== f.inner)) }),
  ];
  // Favour changes to the attributes that matter, so options look plausible.
  const focus = rules.map((r) => r.attr);
  const ranked = [...tweaks.keys()].sort(() => rng() - 0.5).sort((a, b) => Number(isFocus(b, focus)) - Number(isFocus(a, focus)));
  const out: Figure[] = [];
  let guard = 0;
  while (out.length < n && guard++ < 200) {
    const t = tweaks[ranked[guard % ranked.length]];
    let f = t(answer);
    if (rng() < 0.25) f = tweaks[int(rng, 0, tweaks.length - 1)](f);
    if (f.dots < 0 || f.dots > 4) continue;
    if (sameFigure(f, answer) || out.some((o) => sameFigure(o, f))) continue;
    out.push(f);
  }
  return out;
}
const ATTR_OF_TWEAK: Attr[] = ['outer', 'size', 'fill', 'lines', 'lines', 'dots', 'turn', 'inner'];
const isFocus = (i: number, focus: Attr[]) => focus.includes(ATTR_OF_TWEAK[i]);

// ---------- figure analogies ----------

type Transform = { name: string; apply: (f: Figure) => Figure };

const TRANSFORMS: Transform[] = [
  { name: 'turns 90°', apply: (f) => ({ ...f, turn: f.turn + 2 }) },
  { name: 'turns 45°', apply: (f) => ({ ...f, turn: f.turn + 1 }) },
  { name: 'swaps its inner and outer shapes', apply: (f) => ({ ...f, outer: f.inner === 'none' ? f.outer : f.inner, inner: f.inner === 'none' ? 'none' : f.outer }) },
  { name: 'gets darker', apply: (f) => ({ ...f, fill: Math.min(2, f.fill + 1) as Fill }) },
  { name: 'loses its shading', apply: (f) => ({ ...f, fill: 0 }) },
  { name: 'gains one dot', apply: (f) => ({ ...f, dots: Math.min(4, f.dots + 1) }) },
  { name: 'doubles its dots', apply: (f) => ({ ...f, dots: Math.min(4, f.dots * 2) }) },
  { name: 'gets a horizontal line', apply: (f) => ({ ...f, lines: f.lines | 1 }) },
  { name: 'loses its lines', apply: (f) => ({ ...f, lines: 0 }) },
  { name: 'flips its lines to the other diagonal', apply: (f) => ({ ...f, lines: ((f.lines & 2) << 2) | ((f.lines & 8) >> 2) | (f.lines & 5) }) },
  { name: 'shrinks', apply: (f) => ({ ...f, size: Math.max(0, f.size - 1) as Figure['size'] }) },
  { name: 'grows', apply: (f) => ({ ...f, size: Math.min(2, f.size + 1) as Figure['size'] }) },
];

function randomFigure(rng: Rng): Figure {
  return {
    outer: pick(rng, ['square', 'triangle', 'diamond', 'hexagon'] as Outer[]),
    size: 1,
    fill: pick(rng, [0, 1] as Fill[]),
    inner: pick(rng, ['circle', 'square', 'none'] as Outer[]),
    innerFill: 2,
    lines: pick(rng, [0, 2, 4, 8, 6]),
    dots: int(rng, 1, 2),
    turn: 0,
  };
}

/** A is to B as C is to ?: one or more changes turn A into B; apply the same to C. */
export function makeAnalogy(d: number, rng: Rng): Item {
  const steps = d <= 3 ? 1 : d <= 7 ? 2 : 3;
  let chosen: Transform[] = [];
  let a: Figure, b: Figure, c: Figure, answer: Figure;
  let guard = 0;
  do {
    chosen = shuffle(rng, TRANSFORMS).slice(0, steps);
    a = randomFigure(rng);
    c = randomFigure(rng);
    b = chosen.reduce((f, t) => t.apply(f), a);
    answer = chosen.reduce((f, t) => t.apply(f), c);
  } while ((sameFigure(a, b) || sameFigure(c, answer)) && guard++ < 50);
  const wrong: Figure[] = [];
  const alts = shuffle(rng, TRANSFORMS);
  // Distractors: C changed by some but not all of the steps, by wrong steps, or the right steps plus an extra.
  const tries: Figure[] = [
    c,
    ...chosen.map((_, i) => chosen.filter((__, k) => k !== i).reduce((f, t) => t.apply(f), c)),
    ...alts.map((t) => t.apply(answer)),
    ...alts.map((t) => chosen.slice(1).reduce((f, s) => s.apply(f), t.apply(c))),
  ];
  for (const f of tries) {
    if (wrong.length >= 5) break;
    if (!sameFigure(f, answer) && !wrong.some((w) => sameFigure(w, f)) && f.dots <= 4) wrong.push(f);
  }
  const { options, answer: idx } = arrange(rng, answer, wrong);
  return {
    kind: 'analogy',
    ask: 'A is to B as C is to…?',
    prompt: [a, b, c],
    options,
    answer: idx,
    explain: `From A to B the figure ${chosen.map((t) => t.name).join(', then ')}. Do the same to C.`,
    difficulty: d,
  };
}
