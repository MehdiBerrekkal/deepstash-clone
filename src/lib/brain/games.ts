/**
 * The Brain games: small puzzles generated fresh every round, at three difficulty levels. Each game is a set of
 * rounds (or a timed run) of multiple-choice questions, except Memory grid, which has its own screen.
 * All designs here are our own; the genres are classic puzzle types.
 */
export type Skill = 'logic' | 'memory' | 'math' | 'spatial' | 'verbal' | 'focus';
export type Level = 1 | 2 | 3;
export type Rng = () => number;

export type ShapeKind = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'hexagon';
export type Fill = 'solid' | 'empty' | 'striped';
export type ShapeSpec = { kind: ShapeKind; fill: Fill; count: 1 | 2 | 3; rotation: number };

export type Prompt =
  | { type: 'text'; title: string; body: string; big?: boolean }
  | { type: 'matrix'; cells: (ShapeSpec | null)[] }
  | { type: 'rotation'; a: Cell[]; b: Cell[] }
  | { type: 'clues'; title: string; seats: number; clues: string[]; question: string }
  | { type: 'word'; word: string; ink: string };
export type Cell = [number, number];
export type Choice = { key: string; text?: string; shape?: ShapeSpec; color?: string; colorName?: string };
export type Round = { prompt: Prompt; choices: Choice[]; answer: number; explain?: string };

export type GameDef = {
  id: string;
  name: string;
  emoji: string;
  skill: Skill;
  blurb: string;
  howTo: string;
  /** Number of rounds, or a time limit in seconds for sprint games. */
  rounds?: number;
  seconds?: number;
  /** Correct answers in a timed run that count as a perfect score, per level. */
  target?: [number, number, number];
  make?: (level: Level, rng: Rng) => Round;
};

// ---------- helpers ----------

export function seeded(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const int = (rng: Rng, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)];
function shuffle<T>(rng: Rng, xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Shuffles the right answer in among distractors; returns choices and the answer's index. */
function withAnswer(rng: Rng, answer: Choice, distractors: Choice[]): { choices: Choice[]; answer: number } {
  const choices = shuffle(rng, [answer, ...distractors]);
  return { choices, answer: choices.indexOf(answer) };
}
/** Number choices near the answer, all different. */
function numberChoices(rng: Rng, answer: number, spread: number[]): { choices: Choice[]; answer: number } {
  const set = new Set<number>([answer]);
  for (const d of shuffle(rng, spread)) {
    if (set.size >= 4) break;
    const v = answer + d;
    if (v !== answer && !set.has(v)) set.add(v);
  }
  while (set.size < 4) set.add(answer + int(rng, -20, 20) || answer + set.size);
  const [first, ...rest] = [...set];
  return withAnswer(rng, { key: String(first), text: String(first) }, rest.map((n) => ({ key: String(n), text: String(n) })));
}

// ---------- 1. Number sequences ----------

function makeSequence(level: Level, rng: Rng): Round {
  const kinds =
    level === 1 ? ['add', 'sub', 'double'] : level === 2 ? ['grow', 'squares', 'alt', 'fib', 'triple'] : ['interleave', 'cubes', 'muladd', 'grow2', 'squares1'];
  const kind = pick(rng, kinds);
  let seq: number[] = [];
  let why = '';
  switch (kind) {
    case 'add': {
      const a = int(rng, 1, 20), d = int(rng, 2, 9);
      seq = Array.from({ length: 6 }, (_, i) => a + d * i);
      why = `Add ${d} each time.`;
      break;
    }
    case 'sub': {
      const d = int(rng, 2, 8), a = int(rng, 40, 80);
      seq = Array.from({ length: 6 }, (_, i) => a - d * i);
      why = `Subtract ${d} each time.`;
      break;
    }
    case 'double': {
      const a = int(rng, 1, 6);
      seq = Array.from({ length: 6 }, (_, i) => a * 2 ** i);
      why = 'Each number doubles.';
      break;
    }
    case 'triple': {
      const a = int(rng, 1, 3);
      seq = Array.from({ length: 6 }, (_, i) => a * 3 ** i);
      why = 'Each number is multiplied by 3.';
      break;
    }
    case 'grow': {
      const a = int(rng, 1, 10), d = int(rng, 1, 4);
      seq = [a];
      for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + d * i);
      why = `The gap grows by ${d}: +${d}, +${2 * d}, +${3 * d}…`;
      break;
    }
    case 'squares': {
      const s = int(rng, 1, 5);
      seq = Array.from({ length: 6 }, (_, i) => (s + i) ** 2);
      why = 'Square numbers.';
      break;
    }
    case 'squares1': {
      const s = int(rng, 1, 4);
      seq = Array.from({ length: 6 }, (_, i) => (s + i) ** 2 + 1);
      why = 'Square numbers plus one.';
      break;
    }
    case 'alt': {
      const a = int(rng, 2, 9), m = int(rng, 2, 3), d = int(rng, 1, 5);
      seq = [a];
      for (let i = 1; i < 6; i++) seq.push(i % 2 ? seq[i - 1] * m : seq[i - 1] - d);
      why = `Alternately ×${m} and −${d}.`;
      break;
    }
    case 'fib': {
      const a = int(rng, 1, 4), b = int(rng, 2, 6);
      seq = [a, b];
      for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
      why = 'Each number is the sum of the two before it.';
      break;
    }
    case 'interleave': {
      const a = int(rng, 1, 9), d1 = int(rng, 2, 5), b = int(rng, 20, 40), d2 = int(rng, 2, 6);
      seq = Array.from({ length: 6 }, (_, i) => (i % 2 === 0 ? a + d1 * (i / 2) : b - d2 * ((i - 1) / 2)));
      why = `Two sequences take turns: +${d1} and −${d2}.`;
      break;
    }
    case 'cubes': {
      const s = int(rng, 1, 3);
      seq = Array.from({ length: 6 }, (_, i) => (s + i) ** 3);
      why = 'Cube numbers.';
      break;
    }
    case 'muladd': {
      const a = int(rng, 1, 4), m = 2, d = pick(rng, [1, -1, 2, 3]);
      seq = [a];
      for (let i = 1; i < 6; i++) seq.push(seq[i - 1] * m + d);
      why = `Double, then ${d > 0 ? 'add' : 'subtract'} ${Math.abs(d)}.`;
      break;
    }
    case 'grow2': {
      const a = int(rng, 1, 5);
      seq = [a];
      for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + i * i);
      why = 'Add 1, 4, 9, 16, 25: the square numbers.';
      break;
    }
  }
  const shown = seq.slice(0, 5);
  const answer = seq[5];
  const step = Math.max(2, Math.round(Math.abs(seq[5] - seq[4]) / 3));
  return {
    prompt: { type: 'text', title: 'What comes next?', body: `${shown.join(',  ')},  ?`, big: true },
    ...numberChoices(rng, answer, [step, -step, 2 * step, -2 * step, 1, -1, 10, -10]),
    explain: why,
  };
}

// ---------- 2. Pattern matrix ----------

const SHAPES: ShapeKind[] = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
const FILLS: Fill[] = ['solid', 'empty', 'striped'];
const sameShape = (a: ShapeSpec, b: ShapeSpec) => a.kind === b.kind && a.fill === b.fill && a.count === b.count && a.rotation === b.rotation;

function makeMatrix(level: Level, rng: Rng): Round {
  const kinds = shuffle(rng, SHAPES).slice(0, 3);
  const fills = shuffle(rng, FILLS);
  const counts = shuffle(rng, [1, 2, 3] as const);
  const rotStep = pick(rng, [45, 90]);
  // Rows and columns follow simple rules; harder levels add more of them.
  const cell = (r: number, c: number): ShapeSpec => ({
    kind: level === 3 ? kinds[(r + c) % 3] : kinds[r],
    count: counts[c],
    fill: level >= 2 ? fills[(r + c) % 3] : fills[0],
    rotation: level === 3 && kinds[(r + c) % 3] !== 'circle' ? ((c * rotStep) % 360) : 0,
  });
  const cells: (ShapeSpec | null)[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push(r === 2 && c === 2 ? null : cell(r, c));
  const right = cell(2, 2);
  const variants: ShapeSpec[] = [
    { ...right, count: (right.count === 3 ? 1 : right.count + 1) as 1 | 2 | 3 },
    { ...right, count: (right.count === 1 ? 2 : right.count - 1) as 1 | 2 | 3 },
    { ...right, kind: kinds.find((k) => k !== right.kind)! },
    { ...right, fill: FILLS.find((f) => f !== right.fill)! },
    { ...right, rotation: (right.rotation + 45) % 360 },
    { ...right, kind: SHAPES.find((k) => !kinds.includes(k))! },
  ];
  const distractors: ShapeSpec[] = [];
  for (const v of shuffle(rng, variants)) {
    if (distractors.length >= 5) break;
    if (!sameShape(v, right) && !distractors.some((d) => sameShape(d, v)) && !(v.kind === 'circle' && v.rotation !== right.rotation && v.kind === right.kind)) {
      distractors.push(v);
    }
  }
  const { choices, answer } = withAnswer(
    rng,
    { key: 'a', shape: right },
    distractors.map((d, i) => ({ key: `d${i}`, shape: d })),
  );
  return {
    prompt: { type: 'matrix', cells },
    choices,
    answer,
    explain:
      level === 1
        ? 'Each row keeps its shape, and each column has its own number of shapes.'
        : level === 2
          ? 'Rows keep their shape, columns set the number, and the fill shifts along each diagonal.'
          : 'Shapes and fills shift along the diagonals, columns set the number, and shapes turn step by step across a row.',
  };
}

// ---------- 3. Odd one out ----------

const WORD_SETS: Record<string, string[]> = {
  fruits: ['apple', 'pear', 'plum', 'mango', 'grape', 'peach', 'cherry', 'lemon'],
  animals: ['otter', 'tiger', 'horse', 'eagle', 'whale', 'rabbit', 'wolf', 'camel'],
  tools: ['hammer', 'saw', 'drill', 'wrench', 'chisel', 'pliers', 'spanner', 'file'],
  instruments: ['violin', 'flute', 'drum', 'harp', 'trumpet', 'piano', 'cello', 'oboe'],
  planets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  colours: ['crimson', 'navy', 'olive', 'amber', 'teal', 'violet', 'scarlet', 'ivory'],
  furniture: ['chair', 'table', 'sofa', 'shelf', 'desk', 'bench', 'stool', 'wardrobe'],
};

function makeOdd(level: Level, rng: Rng): Round {
  const mode = level === 1 ? 'shape' : level === 2 ? pick(rng, ['shape2', 'words', 'numbers']) : pick(rng, ['numbers3', 'words', 'shape3']);
  if (mode === 'words') {
    const [a, b] = shuffle(rng, Object.keys(WORD_SETS)).slice(0, 2);
    const same = shuffle(rng, WORD_SETS[a]).slice(0, 4);
    const odd = pick(rng, WORD_SETS[b]);
    const r = withAnswer(rng, { key: odd, text: odd }, same.map((w) => ({ key: w, text: w })));
    return { prompt: { type: 'text', title: 'Which word is the odd one out?', body: '' }, ...r, explain: `The others are ${a}; ${odd} is not.` };
  }
  if (mode === 'numbers' || mode === 'numbers3') {
    const rules =
      mode === 'numbers'
        ? [
            { name: 'even', test: (n: number) => n % 2 === 0, gen: () => 2 * int(rng, 2, 40) },
            { name: 'multiples of 5', test: (n: number) => n % 5 === 0, gen: () => 5 * int(rng, 2, 19) },
          ]
        : [
            { name: 'prime', test: (n: number) => n > 1 && [...Array(Math.floor(Math.sqrt(n)) + 1).keys()].slice(2).every((d) => n % d), gen: () => pick(rng, [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]) },
            { name: 'square numbers', test: (n: number) => Number.isInteger(Math.sqrt(n)), gen: () => int(rng, 3, 12) ** 2 },
            { name: 'multiples of 7', test: (n: number) => n % 7 === 0, gen: () => 7 * int(rng, 3, 14) },
          ];
    const rule = pick(rng, rules);
    const same = new Set<number>();
    while (same.size < 4) same.add(rule.gen());
    let odd = int(rng, 10, 99);
    while (rule.test(odd) || same.has(odd)) odd = int(rng, 10, 99);
    const r = withAnswer(rng, { key: String(odd), text: String(odd) }, [...same].map((n) => ({ key: String(n), text: String(n) })));
    return { prompt: { type: 'text', title: 'Which number is the odd one out?', body: '' }, ...r, explain: `The others are ${rule.name}; ${odd} is not.` };
  }
  // Shapes: four share something, one differs.
  const base: ShapeSpec = { kind: pick(rng, SHAPES), fill: pick(rng, FILLS), count: pick(rng, [1, 2] as const), rotation: 0 };
  let odd: ShapeSpec;
  let explain: string;
  if (mode === 'shape') {
    odd = { ...base, kind: pick(rng, SHAPES.filter((k) => k !== base.kind)) };
    explain = 'It is a different shape.';
  } else if (mode === 'shape2') {
    odd = rng() < 0.5 ? { ...base, fill: pick(rng, FILLS.filter((f) => f !== base.fill)) } : { ...base, count: base.count === 1 ? 2 : 1 };
    explain = odd.fill !== base.fill ? 'Its fill is different.' : 'It has a different number of shapes.';
  } else {
    // All the same shape turned to different angles except one, which is mirrored or a different count.
    const kind = pick(rng, ['triangle', 'star', 'diamond'] as ShapeKind[]);
    odd = { kind, fill: base.fill, count: 2, rotation: 0 };
    const same = [0, 90, 180, 270].map((rotation) => ({ kind, fill: base.fill, count: 1 as const, rotation }));
    const r = withAnswer(rng, { key: 'odd', shape: odd }, same.map((s, i) => ({ key: `s${i}`, shape: s })));
    return { prompt: { type: 'text', title: 'Which is the odd one out?', body: '' }, ...r, explain: 'The others are one shape at different angles; this one has two.' };
  }
  const others = Array.from({ length: 4 }, () => ({ ...base, rotation: base.kind === 'triangle' || base.kind === 'star' ? 0 : 0 }));
  const r = withAnswer(rng, { key: 'odd', shape: odd }, others.map((s, i) => ({ key: `s${i}`, shape: s })));
  return { prompt: { type: 'text', title: 'Which is the odd one out?', body: '' }, ...r, explain };
}

// ---------- 4. Mental rotation ----------

const norm = (cells: Cell[]): Cell[] => {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - minX, y - minY] as Cell).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
const key = (cells: Cell[]) => norm(cells).map((c) => c.join(',')).join(';');
const rotate = (cells: Cell[], times: number): Cell[] => {
  let out = cells;
  for (let i = 0; i < times; i++) out = out.map(([x, y]) => [-y, x] as Cell);
  return norm(out);
};
const mirror = (cells: Cell[]): Cell[] => norm(cells.map(([x, y]) => [-x, y] as Cell));

function polyomino(rng: Rng, size: number): Cell[] {
  const cells: Cell[] = [[0, 0]];
  while (cells.length < size) {
    const [x, y] = pick(rng, cells);
    const [dx, dy] = pick(rng, [[1, 0], [-1, 0], [0, 1], [0, -1]] as const);
    const next: Cell = [x + dx, y + dy];
    if (!cells.some((c) => c[0] === next[0] && c[1] === next[1])) cells.push(next);
  }
  return norm(cells);
}

function makeRotation(level: Level, rng: Rng): Round {
  const size = level === 1 ? 5 : level === 2 ? 6 : 7;
  let a: Cell[];
  // The shape must look different from its mirror image, or the question has no answer.
  do a = polyomino(rng, size);
  while ([0, 1, 2, 3].some((t) => key(rotate(mirror(a), t)) === key(a)));
  const turns = level === 1 ? pick(rng, [1, 2]) : int(rng, 1, 3);
  const mirrored = rng() < 0.5;
  const b = rotate(mirrored ? mirror(a) : a, turns);
  const choices: Choice[] = [
    { key: 'same', text: 'Same shape, turned' },
    { key: 'mirror', text: 'Mirror image' },
  ];
  return {
    prompt: { type: 'rotation', a, b },
    choices,
    answer: mirrored ? 1 : 0,
    explain: mirrored ? 'However you turn it, the right shape only matches when flipped over.' : `Turn the left shape ${turns * 90}° and it matches.`,
  };
}

// ---------- 5. Logic seats ----------

const NAMES = ['Ava', 'Ben', 'Cleo', 'Dan', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivo', 'Jade', 'Kai', 'Lina'];

function permutations<T>(xs: T[]): T[][] {
  if (xs.length <= 1) return [xs];
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

function makeLogic(level: Level, rng: Rng): Round {
  const n = level === 3 ? 4 : 3;
  const people = shuffle(rng, NAMES).slice(0, n);
  const truth = shuffle(rng, people); // truth[i] sits in seat i (left to right)
  const pos = (arr: string[], p: string) => arr.indexOf(p);
  type Clue = { text: string; test: (a: string[]) => boolean };
  const makeClue = (): Clue => {
    const [x, y] = shuffle(rng, people);
    const px = pos(truth, x), py = pos(truth, y);
    const r = rng();
    if (r < 0.3) {
      return px < py
        ? { text: `${x} sits somewhere to the left of ${y}.`, test: (a) => pos(a, x) < pos(a, y) }
        : { text: `${x} sits somewhere to the right of ${y}.`, test: (a) => pos(a, x) > pos(a, y) };
    }
    if (r < 0.5 && Math.abs(px - py) === 1) return { text: `${x} sits next to ${y}.`, test: (a) => Math.abs(pos(a, x) - pos(a, y)) === 1 };
    if (r < 0.65 && Math.abs(px - py) > 1) return { text: `${x} does not sit next to ${y}.`, test: (a) => Math.abs(pos(a, x) - pos(a, y)) !== 1 };
    if (r < 0.8) {
      const end = px === 0 || px === n - 1;
      return end ? { text: `${x} sits at one end.`, test: (a) => [0, n - 1].includes(pos(a, x)) } : { text: `${x} does not sit at an end.`, test: (a) => ![0, n - 1].includes(pos(a, x)) };
    }
    const seat = int(rng, 0, n - 1);
    return seat === px
      ? { text: `${x} sits in seat ${seat + 1}.`, test: (a) => pos(a, x) === seat }
      : { text: `${x} is not in seat ${seat + 1}.`, test: (a) => pos(a, x) !== seat };
  };
  const all = permutations(people);
  const clues: Clue[] = [];
  let left = all;
  let guard = 0;
  while (left.length > 1 && guard++ < 60) {
    const c = makeClue();
    if (clues.some((k) => k.text === c.text)) continue;
    const next = left.filter(c.test);
    if (next.length < left.length) {
      clues.push(c);
      left = next;
    }
  }
  // Make sure the clues lead to exactly one order.
  if (left.length !== 1) return makeLogic(level, rng);
  // Ask about one of the seats.
  const seat = int(rng, 0, n - 1);
  const who = truth[seat];
  const r = withAnswer(rng, { key: who, text: who }, people.filter((p) => p !== who).map((p) => ({ key: p, text: p })));
  return {
    prompt: { type: 'clues', title: `${n} friends sit in a row of seats numbered 1 to ${n}, left to right.`, seats: n, clues: shuffle(rng, clues.map((c) => c.text)), question: `Who sits in seat ${seat + 1}?` },
    ...r,
    explain: `The only order that fits every clue: ${truth.join(', ')}.`,
  };
}

// ---------- 6. Mental math sprint ----------

function makeMath(level: Level, rng: Rng): Round {
  let q = '';
  let a = 0;
  const op = level === 1 ? pick(rng, ['+', '−']) : level === 2 ? pick(rng, ['+', '−', '×']) : pick(rng, ['×', '÷', '+', '−', '2step']);
  if (op === '+') {
    const x = level === 1 ? int(rng, 2, 20) : int(rng, 12, 99), y = level === 1 ? int(rng, 2, 20) : int(rng, 12, 99);
    q = `${x} + ${y}`;
    a = x + y;
  } else if (op === '−') {
    const x = level === 1 ? int(rng, 10, 30) : int(rng, 40, 150), y = int(rng, 2, x - 1);
    q = `${x} − ${y}`;
    a = x - y;
  } else if (op === '×') {
    const x = int(rng, 2, level === 3 ? 15 : 12), y = int(rng, 2, level === 3 ? 15 : 9);
    q = `${x} × ${y}`;
    a = x * y;
  } else if (op === '÷') {
    const y = int(rng, 2, 12), a0 = int(rng, 2, 12);
    q = `${a0 * y} ÷ ${y}`;
    a = a0;
  } else {
    const x = int(rng, 2, 9), y = int(rng, 2, 9), z = int(rng, 2, 20);
    q = `${x} × ${y} + ${z}`;
    a = x * y + z;
  }
  return { prompt: { type: 'text', title: '', body: `${q} = ?`, big: true }, ...numberChoices(rng, a, [1, -1, 2, -2, 10, -10, 5, -5]) };
}

// ---------- 7. Colour focus ----------

const INKS = [
  { name: 'RED', color: '#D64545' },
  { name: 'BLUE', color: '#3E7BD6' },
  { name: 'GREEN', color: '#3F9B52' },
  { name: 'YELLOW', color: '#D9A419' },
  { name: 'PURPLE', color: '#8A55C9' },
];

function makeFocus(level: Level, rng: Rng): Round {
  const palette = level === 3 ? INKS : INKS.slice(0, 4);
  const word = pick(rng, palette);
  // Mostly the word and ink disagree; that's what makes it hard.
  const mismatch = rng() < (level === 1 ? 0.6 : 0.8);
  const ink = mismatch ? pick(rng, palette.filter((p) => p !== word)) : word;
  const options = shuffle(rng, palette).slice(0, 4);
  if (!options.includes(ink)) options[int(rng, 0, 3)] = ink;
  if (level >= 2 && !options.includes(word)) options[options.findIndex((o) => o !== ink)] = word;
  return {
    prompt: { type: 'word', word: word.name, ink: ink.color },
    choices: options.map((o) => ({ key: o.name, colorName: o.name.toLowerCase(), color: o.color })),
    answer: options.indexOf(ink),
  };
}

// ---------- the list ----------

export const GAMES: GameDef[] = [
  { id: 'sequence', name: 'Number trail', emoji: '🔢', skill: 'logic', blurb: 'Find the next number', rounds: 8, make: makeSequence, howTo: 'Each row of numbers follows a rule. Work it out and pick the number that comes next.' },
  { id: 'matrix', name: 'Pattern grid', emoji: '🔷', skill: 'logic', blurb: 'Complete the 3×3 grid', rounds: 6, make: makeMatrix, howTo: 'Shapes in the grid follow rules across rows and down columns: kind, number, fill and angle. Pick the piece that fits the empty corner.' },
  { id: 'memory', name: 'Memory grid', emoji: '🟨', skill: 'memory', blurb: 'Repeat the tiles that light up', howTo: 'Some tiles light up for a moment. Tap the same tiles from memory, in any order. Each success adds a tile; two mistakes end the game.' },
  { id: 'math', name: 'Quick maths', emoji: '➗', skill: 'math', blurb: '60-second sprint', seconds: 60, target: [16, 20, 22], make: makeMath, howTo: 'Answer as many sums as you can in 60 seconds. Speed counts, but wrong answers cost you a second.' },
  { id: 'odd', name: 'Odd one out', emoji: '🔍', skill: 'verbal', blurb: 'Spot what doesn’t belong', rounds: 8, make: makeOdd, howTo: 'All the choices but one share something. Find the one that doesn’t belong.' },
  { id: 'rotation', name: 'Turn it over', emoji: '🔄', skill: 'spatial', blurb: 'Same shape or mirror image?', rounds: 10, make: makeRotation, howTo: 'Is the right shape the left one turned around, or its mirror image? Imagine rotating it in your head.' },
  { id: 'focus', name: 'Ink focus', emoji: '🎨', skill: 'focus', blurb: 'Tap the ink, not the word', seconds: 45, target: [18, 22, 26], make: makeFocus, howTo: 'A colour word appears in a coloured ink. Tap the colour of the INK, not what the word says. Be quick: 45 seconds.' },
  { id: 'logic', name: 'Who sits where', emoji: '🪑', skill: 'logic', blurb: 'Small deduction puzzles', rounds: 4, make: makeLogic, howTo: 'Friends sit in a row of numbered seats. Use the clues to work out the order, then answer the question.' },
];
export const gameById = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<string, GameDef>;

export const SKILLS: { id: Skill; name: string; emoji: string }[] = [
  { id: 'logic', name: 'Logic', emoji: '🧩' },
  { id: 'memory', name: 'Memory', emoji: '🧠' },
  { id: 'math', name: 'Maths', emoji: '➗' },
  { id: 'spatial', name: 'Spatial', emoji: '🧊' },
  { id: 'verbal', name: 'Words', emoji: '🔤' },
  { id: 'focus', name: 'Focus', emoji: '🎯' },
];

/** Session performance 0-100, harder levels worth more. */
export function performance(accuracy: number, level: Level) {
  return Math.round(Math.min(1, accuracy) * 100 * (0.7 + 0.1 * level));
}

/** Today's daily-challenge game (date as "2026-10-30"): the same for everyone on a given day. */
export function dailyGame(date: string) {
  const rng = seeded(`daily-game-${date}`);
  return GAMES[Math.floor(rng() * GAMES.length)];
}
