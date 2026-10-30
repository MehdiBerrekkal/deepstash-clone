import { arrange, int, numberOptions, pick, shuffle, type Item, type Rng } from '@/lib/brain/core';

// ---------- number series ----------

type Series = { seq: number[]; why: string; min: number };

/** Sequence families, each with the lowest difficulty it appears at. */
const SERIES: ((rng: Rng) => Series)[] = [
  (rng) => { const a = int(rng, 2, 30), d = int(rng, 3, 13); return { seq: Array.from({ length: 7 }, (_, i) => a + d * i), why: `+${d} each time.`, min: 1 }; },
  (rng) => { const a = int(rng, 2, 5), m = int(rng, 2, 3); return { seq: Array.from({ length: 6 }, (_, i) => a * m ** i), why: `×${m} each time.`, min: 1 }; },
  (rng) => { const a = int(rng, 1, 10), d = int(rng, 2, 4); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + d * i); return { seq: s, why: `The gaps grow by ${d}: +${d}, +${2 * d}, +${3 * d}…`, min: 2 }; },
  (rng) => { const s0 = int(rng, 2, 6), k = int(rng, -3, 3); return { seq: Array.from({ length: 6 }, (_, i) => (s0 + i) ** 2 + k), why: `Square numbers ${k ? (k > 0 ? `plus ${k}` : `minus ${-k}`) : ''}.`.replace(' .', '.'), min: 3 }; },
  (rng) => { const a = int(rng, 2, 9), m = int(rng, 2, 3), d = int(rng, 1, 6); const s = [a]; for (let i = 1; i < 7; i++) s.push(i % 2 ? s[i - 1] * m : s[i - 1] - d); return { seq: s, why: `Alternately ×${m} and −${d}.`, min: 4 }; },
  (rng) => { const a = int(rng, 1, 5), b = int(rng, 2, 7); const s = [a, b]; for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]); return { seq: s, why: 'Each term is the sum of the two before it.', min: 4 }; },
  (rng) => { const a = int(rng, 1, 9), d1 = int(rng, 2, 7), b = int(rng, 40, 80), d2 = int(rng, 3, 9); return { seq: Array.from({ length: 8 }, (_, i) => (i % 2 === 0 ? a + d1 * (i / 2) : b - d2 * ((i - 1) / 2))), why: `Two series take turns: one goes +${d1}, the other −${d2}.`, min: 5 }; },
  (rng) => { const a = int(rng, 1, 5), m = int(rng, 2, 3), k = pick(rng, [1, -1, 2, 3]); const s = [a]; for (let i = 1; i < 6; i++) s.push(s[i - 1] * m + k); return { seq: s, why: `×${m}, then ${k > 0 ? '+' : '−'}${Math.abs(k)}.`, min: 6 }; },
  (rng) => { const a = int(rng, 2, 8), d0 = int(rng, 1, 3), dd = int(rng, 2, 4); const s = [a]; let gap = d0; for (let i = 1; i < 7; i++) { s.push(s[i - 1] + gap); gap = gap * dd; } return { seq: s, why: `The gaps multiply by ${dd} each time.`, min: 7 }; },
  (rng) => { const s0 = int(rng, 1, 3); return { seq: Array.from({ length: 6 }, (_, i) => (s0 + i) ** 3 - (s0 + i)), why: 'n³ − n for consecutive n.', min: 8 }; },
  (rng) => { const p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]; const st = int(rng, 0, 5); const m = int(rng, 1, 3); return { seq: p.slice(st, st + 7).map((x) => x * m), why: m === 1 ? 'Consecutive prime numbers.' : `Consecutive primes ×${m}.`, min: 7 }; },
  (rng) => { const a = int(rng, 1, 4); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + (i % 2 ? i * i : -i)); return { seq: s, why: 'Alternately add the square of the position and subtract the position: +1, −2, +9, −4, +25…', min: 9 }; },
  (rng) => { const a = int(rng, 2, 6), b = int(rng, 3, 8); const s = [a, b]; for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2] - 1); return { seq: s, why: 'Each term is the sum of the two before it, minus 1.', min: 9 }; },
];

export function makeSeries(d: number, rng: Rng): Item {
  const pool = SERIES.map((f) => f(rng)).filter((s) => s.min <= d && s.min >= Math.max(1, d - 5));
  const s = pick(rng, pool.length ? pool : [SERIES[0](rng)]);
  const shown = s.seq.length - 1;
  const answer = s.seq[shown];
  const gap = Math.max(2, Math.abs(s.seq[shown] - s.seq[shown - 1]));
  return {
    kind: 'series',
    ask: 'Which number comes next?',
    prompt: s.seq.slice(0, shown),
    ...numberOptions(rng, answer, 6, [1, -1, 2, -2, Math.round(gap / 2), -Math.round(gap / 2), gap, -gap, 10, -10]),
    explain: s.why,
    difficulty: d,
  };
}

// ---------- letter series ----------

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const L = (i: number) => AZ[((i % 26) + 26) % 26];

export function makeLetters(d: number, rng: Rng): Item {
  const kind = pick(rng, d <= 3 ? ['step', 'back'] : d <= 6 ? ['grow', 'alt', 'step2'] : ['interleave', 'pairs', 'grow2']);
  let seq: string[] = [];
  let why = '';
  const a = int(rng, 0, 12);
  if (kind === 'step') { const s = int(rng, 2, 4); seq = Array.from({ length: 6 }, (_, i) => L(a + s * i)); why = `Skip ${s - 1} letter${s > 2 ? 's' : ''} each time.`; }
  if (kind === 'back') { const s = int(rng, 2, 3); seq = Array.from({ length: 6 }, (_, i) => L(25 - a - s * i)); why = `Go back ${s} letters each time.`; }
  if (kind === 'step2') { const s = int(rng, 3, 5); seq = Array.from({ length: 6 }, (_, i) => L(a + s * i)); why = `Move ${s} letters forward each time (wrapping from Z to A).`; }
  if (kind === 'grow') { let p = a; seq = [L(p)]; for (let i = 1; i < 6; i++) { p += i; seq.push(L(p)); } why = 'The jumps grow: +1, +2, +3, +4…'; }
  if (kind === 'alt') { const s1 = int(rng, 2, 3), s2 = 1; let p = a; seq = [L(p)]; for (let i = 1; i < 7; i++) { p += i % 2 ? s1 : -s2; seq.push(L(p)); } why = `Alternately +${s1} and −1.`; }
  if (kind === 'interleave') { const s1 = int(rng, 1, 3), s2 = int(rng, 1, 3); seq = Array.from({ length: 8 }, (_, i) => (i % 2 === 0 ? L(a + s1 * (i / 2)) : L(25 - s2 * ((i - 1) / 2)))); why = `Two series take turns: one forward by ${s1} from ${L(a)}, one backward by ${s2} from Z.`; }
  if (kind === 'pairs') { seq = Array.from({ length: 4 }, (_, i) => L(a + 3 * i) + L(a + 3 * i + 1)); why = 'Pairs of neighbouring letters, each pair starting three letters later.'; }
  if (kind === 'grow2') { let p = a; seq = [L(p)]; for (let i = 1; i < 6; i++) { p += 2 * i - 1; seq.push(L(p)); } why = 'The jumps are the odd numbers: +1, +3, +5, +7…'; }
  const shown = seq.length - 1;
  const answer = seq[shown];
  const others = new Set<string>();
  const near = (s: string, k: number) => s.split('').map((c) => L(AZ.indexOf(c) + k)).join('');
  for (const k of shuffle(rng, [1, -1, 2, -2, 3, -3, 4, 5])) if (others.size < 5 && near(answer, k) !== answer) others.add(near(answer, k));
  const { options, answer: idx } = arrange(rng, answer, [...others]);
  return { kind: 'letters', ask: 'Which comes next?', prompt: seq.slice(0, shown), options, answer: idx, explain: why, difficulty: d };
}

// ---------- number matrices ----------

export function makeNumberMatrix(d: number, rng: Rng): Item {
  const rules: { f: (a: number, b: number) => number; why: string; min: number }[] = [
    { f: (a, b) => a + b, why: 'In each row, the first two numbers add up to the third.', min: 1 },
    { f: (a, b) => a * b, why: 'In each row, the first two numbers multiply to the third.', min: 3 },
    { f: (a, b) => a * b - a, why: 'In each row: first × second − first = third.', min: 6 },
    { f: (a, b) => (a + b) * 2, why: 'In each row: (first + second) × 2 = third.', min: 5 },
    { f: (a, b) => a * a + b, why: 'In each row: first² + second = third.', min: 8 },
    { f: (a, b) => Math.abs(a - b) * 3, why: 'In each row: the difference of the first two, × 3.', min: 7 },
  ];
  const rule = pick(rng, rules.filter((r) => r.min <= d));
  const rows = [0, 1, 2].map(() => {
    const a = int(rng, 2, d < 5 ? 9 : 12);
    const b = int(rng, 2, d < 5 ? 9 : 12);
    return [a, b, rule.f(a, b)];
  });
  const answer = rows[2][2];
  return {
    kind: 'numgrid',
    ask: 'Which number replaces the question mark?',
    prompt: rows.flat().slice(0, 8),
    ...numberOptions(rng, answer, 6, [1, -1, 2, -2, rows[2][0], -rows[2][1], 3, -3, 10]),
    explain: rule.why,
    difficulty: d,
  };
}

// ---------- syllogisms ----------

const TERMS = ['glorps', 'trivels', 'manks', 'zebbits', 'quoles', 'fendrils', 'pobs', 'warlins', 'sneeps', 'drovs'];
type Q = 'all' | 'no' | 'some' | 'someNot';
type Stmt = { q: Q; s: number; p: number };
const say = (st: Stmt, names: string[]) =>
  st.q === 'all' ? `All ${names[st.s]} are ${names[st.p]}.` : st.q === 'no' ? `No ${names[st.s]} are ${names[st.p]}.` : st.q === 'some' ? `Some ${names[st.s]} are ${names[st.p]}.` : `Some ${names[st.s]} are not ${names[st.p]}.`;

/** Is a statement true in a world of 3 sets, described by which of the 8 regions have members? */
function holds(st: Stmt, world: number) {
  const regions = [...Array(8).keys()].filter((r) => world & (1 << r));
  const inS = (r: number) => (r >> st.s) & 1;
  const inP = (r: number) => (r >> st.p) & 1;
  if (st.q === 'all') return regions.every((r) => !inS(r) || inP(r));
  if (st.q === 'no') return regions.every((r) => !(inS(r) && inP(r)));
  if (st.q === 'some') return regions.some((r) => inS(r) && inP(r));
  return regions.some((r) => inS(r) && !inP(r));
}

/** Valid if the conclusion is true in every world where both premises are true (every set non-empty). */
function valid(p1: Stmt, p2: Stmt, c: Stmt) {
  let any = false;
  for (let w = 0; w < 256; w++) {
    const nonEmpty = [0, 1, 2].every((k) => [...Array(8).keys()].some((r) => w & (1 << r) && (r >> k) & 1));
    if (!nonEmpty || !holds(p1, w) || !holds(p2, w)) continue;
    any = true;
    if (!holds(c, w)) return false;
  }
  return any;
}

export function makeSyllogism(d: number, rng: Rng): Item {
  const names = shuffle(rng, TERMS).slice(0, 3);
  const qs: Q[] = d <= 3 ? ['all', 'no'] : ['all', 'no', 'some', 'someNot'];
  let p1: Stmt, p2: Stmt, c: Stmt;
  // Aim for about half valid, half invalid conclusions.
  const wantValid = rng() < 0.5;
  let guard = 0;
  do {
    p1 = { q: pick(rng, qs), s: 0, p: 1 };
    p2 = { q: pick(rng, qs), s: pick(rng, [1, 2]), p: 0 };
    if (p2.s === 1) p2 = { ...p2, p: 2 };
    else p2 = { q: p2.q, s: 1, p: 2 };
    if (rng() < 0.5) p2 = { q: p2.q, s: p2.p, p: p2.s };
    c = { q: pick(rng, qs), s: 0, p: 2 };
    if (rng() < 0.3) c = { q: c.q, s: 2, p: 0 };
  } while (valid(p1, p2, c) !== wantValid && guard++ < 200);
  const isValid = valid(p1, p2, c);
  return {
    kind: 'syllogism',
    ask: 'Assume both statements are true. Does the conclusion have to follow?',
    prompt: { premises: [say(p1, names), say(p2, names)], conclusion: say(c, names) },
    options: ['It must be true', 'It does not follow'],
    answer: isValid ? 0 : 1,
    explain: isValid
      ? 'Every arrangement that makes both statements true also makes the conclusion true.'
      : 'There is an arrangement where both statements are true but the conclusion is false, so it does not follow.',
    difficulty: d,
  };
}

// ---------- verbal analogies ----------

/** [a, b, c, answer, distractors…, difficulty]: a is to b as c is to answer. */
const ANALOGIES: [string, string, string, string, string[], number][] = [
  ['Pen', 'Write', 'Knife', 'Cut', ['Sharp', 'Fork', 'Kitchen', 'Steel'], 2],
  ['Hungry', 'Eat', 'Tired', 'Sleep', ['Yawn', 'Bed', 'Night', 'Work'], 2],
  ['Seed', 'Tree', 'Caterpillar', 'Butterfly', ['Leaf', 'Cocoon', 'Wing', 'Insect'], 3],
  ['Thermometer', 'Temperature', 'Barometer', 'Pressure', ['Weather', 'Altitude', 'Rain', 'Wind'], 4],
  ['Author', 'Novel', 'Composer', 'Symphony', ['Piano', 'Orchestra', 'Note', 'Concert'], 3],
  ['Drought', 'Water', 'Famine', 'Food', ['Hunger', 'Crop', 'Poverty', 'Desert'], 4],
  ['Archipelago', 'Island', 'Constellation', 'Star', ['Sky', 'Galaxy', 'Planet', 'Telescope'], 5],
  ['Prologue', 'Epilogue', 'Overture', 'Finale', ['Opera', 'Aria', 'Curtain', 'Encore'], 6],
  ['Benevolent', 'Malevolent', 'Candid', 'Evasive', ['Honest', 'Frank', 'Cheerful', 'Rude'], 6],
  ['Ephemeral', 'Permanent', 'Scarce', 'Abundant', ['Rare', 'Brief', 'Expensive', 'Small'], 6],
  ['Cartographer', 'Map', 'Lexicographer', 'Dictionary', ['Words', 'Grammar', 'Atlas', 'Library'], 7],
  ['Laconic', 'Words', 'Frugal', 'Money', ['Time', 'Food', 'Effort', 'Speech'], 7],
  ['Pugnacious', 'Fight', 'Garrulous', 'Talk', ['Sing', 'Argue', 'Listen', 'Laugh'], 8],
  ['Sycophant', 'Flatter', 'Iconoclast', 'Challenge', ['Worship', 'Obey', 'Paint', 'Destroy'], 8],
  ['Myopia', 'Sight', 'Amnesia', 'Memory', ['Brain', 'Sleep', 'Hearing', 'Thought'], 6],
  ['Paucity', 'Plethora', 'Penury', 'Affluence', ['Poverty', 'Debt', 'Charity', 'Wealthy'], 9],
  ['Obdurate', 'Yield', 'Taciturn', 'Speak', ['Listen', 'Smile', 'Argue', 'Hide'], 9],
  ['Fetter', 'Liberate', 'Obfuscate', 'Clarify', ['Confuse', 'Hide', 'Explain', 'Darken'], 9],
  ['Insipid', 'Flavour', 'Vapid', 'Interest', ['Taste', 'Colour', 'Boredom', 'Air'], 10],
  ['Quixotic', 'Practical', 'Perfunctory', 'Thorough', ['Quick', 'Careless', 'Dreamy', 'Polite'], 10],
  ['Calf', 'Cow', 'Kid', 'Goat', ['Child', 'Lamb', 'Sheep', 'Horse'], 2],
  ['Ornithology', 'Birds', 'Entomology', 'Insects', ['Words', 'Fossils', 'Fish', 'Plants'], 5],
  ['Sculptor', 'Chisel', 'Surgeon', 'Scalpel', ['Hospital', 'Patient', 'Doctor', 'Mask'], 3],
  ['Glacier', 'Ice', 'Dune', 'Sand', ['Desert', 'Wind', 'Beach', 'Hill'], 3],
  ['Mitigate', 'Aggravate', 'Placate', 'Provoke', ['Calm', 'Soothe', 'Reduce', 'Ignore'], 8],
  ['Verbose', 'Concise', 'Lethargic', 'Energetic', ['Sleepy', 'Lazy', 'Tired', 'Slow'], 7],
];

export function makeVerbal(d: number, rng: Rng): Item {
  const pool = ANALOGIES.filter((a) => Math.abs(a[5] - d) <= 2);
  const [a, b, c, ans, wrong, level] = pick(rng, pool.length ? pool : ANALOGIES);
  const { options, answer } = arrange(rng, ans, shuffle(rng, wrong).slice(0, 4));
  return {
    kind: 'verbal',
    ask: 'Complete the analogy.',
    prompt: `${a} is to ${b} as ${c} is to …`,
    options,
    answer,
    explain: `${a} → ${b} is the same relation as ${c} → ${ans}.`,
    difficulty: level,
  };
}

// ---------- arithmetic reasoning ----------

export function makeWordProblem(d: number, rng: Rng): Item {
  const kinds = d <= 3 ? ['percent', 'share'] : d <= 6 ? ['rate', 'percent2', 'age', 'mix'] : ['work', 'speed', 'age2', 'compound'];
  const kind = pick(rng, kinds);
  let q = '';
  let a = 0;
  let why = '';
  if (kind === 'percent') { const p = pick(rng, [10, 15, 20, 25, 30, 40]); const x = 20 * int(rng, 2, 12); a = (x * p) / 100; q = `What is ${p}% of ${x}?`; why = `${x} × ${p} / 100 = ${a}.`; }
  if (kind === 'share') { const k = int(rng, 2, 4), m = int(rng, 1, 3); const tot = (k + m) * int(rng, 3, 9); a = (tot / (k + m)) * k; q = `${tot} sweets are shared in the ratio ${k}:${m}. How many are in the bigger share?`; why = `${tot} ÷ ${k + m} = ${tot / (k + m)} per part, × ${k} = ${a}.`; }
  if (kind === 'rate') { const n = int(rng, 3, 6), t = n * int(rng, 2, 5), m = int(rng, 2, 4) * n; a = (t / n) * m; q = `${n} printers print ${t} pages a minute. How many pages a minute do ${m} printers print?`; why = `Each prints ${t / n} a minute; × ${m} = ${a}.`; }
  if (kind === 'percent2') { const x = 10 * int(rng, 5, 20), p = pick(rng, [10, 20, 25]), q2 = pick(rng, [10, 20]); a = Math.round(x * (1 + p / 100) * (1 - q2 / 100) * 100) / 100; q = `A price of ${x} goes up ${p}%, then down ${q2}%. What is it now?`; why = `${x} × ${1 + p / 100} × ${1 - q2 / 100} = ${a}.`; }
  if (kind === 'age') { const c = int(rng, 4, 12), k = int(rng, 3, 5), y = int(rng, 3, 8); a = c * k + y; q = `A mother is ${k} times as old as her son, who is ${c}. How old will she be in ${y} years?`; why = `${c} × ${k} = ${c * k} now, + ${y} = ${a}.`; }
  if (kind === 'mix') { const v1 = 10 * int(rng, 2, 6), c1 = pick(rng, [10, 20, 30]), v2 = 10 * int(rng, 2, 6), c2 = pick(rng, [40, 50, 60]); a = Math.round(((v1 * c1 + v2 * c2) / (v1 + v2)) * 10) / 10; q = `${v1} L of ${c1}% juice is mixed with ${v2} L of ${c2}% juice. What percent juice is the mix?`; why = `(${v1}×${c1} + ${v2}×${c2}) / ${v1 + v2} = ${a}%.`; }
  if (kind === 'work') { const x = pick(rng, [3, 4, 6]), y = pick(rng, [6, 12]); a = Math.round(((x * y) / (x + y)) * 10) / 10; q = `One pump fills a tank in ${x} hours, another in ${y} hours. Together, how many hours?`; why = `Rates add: 1/${x} + 1/${y}, so ${x}×${y}/(${x}+${y}) = ${a} h.`; }
  if (kind === 'speed') { const d1 = 60 * int(rng, 1, 3), s1 = pick(rng, [30, 40, 60]), s2 = pick(rng, [60, 90, 120]); a = Math.round(((2 * d1) / (d1 / s1 + d1 / s2)) * 10) / 10; q = `A car drives ${d1} km at ${s1} km/h and comes back at ${s2} km/h. What is its average speed in km/h?`; why = `Total distance ${2 * d1} km over ${d1 / s1 + d1 / s2} h = ${a} km/h (not the average of the speeds).`; }
  if (kind === 'age2') { const diff = int(rng, 20, 30), yrs = int(rng, 4, 10), k = 2; const son = (diff - yrs * (k - 1)) / (k - 1); a = son > 0 ? son + 0 : diff; q = `A father is ${diff} years older than his son. In ${yrs} years he will be twice his son's age. How old is the son now?`; why = `In ${yrs} years: son + ${diff} + ${yrs} = 2 × (son + ${yrs}), so son = ${diff} − ${yrs} = ${diff - yrs}.`; a = diff - yrs; }
  if (kind === 'compound') { const x = 1000 * int(rng, 1, 5), p = pick(rng, [10, 20]); a = Math.round(x * (1 + p / 100) ** 2); q = `${x} grows by ${p}% a year, compounded. What is it after 2 years?`; why = `${x} × ${(1 + p / 100).toFixed(1)}² = ${a}.`; }
  const spread = Number.isInteger(a) ? [1, -1, 2, -2, 5, -5, 10, -10] : [0.5, -0.5, 1, -1, 2.5, -2.5];
  return { kind: 'word', ask: 'Work it out.', prompt: q, ...numberOptions(rng, a, 5, spread), explain: why, difficulty: d };
}

// ---------- seating logic ----------

const NAMES = ['Ava', 'Ben', 'Cleo', 'Dan', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivo', 'Jade', 'Kai', 'Lina', 'Mo', 'Nia'];
function permutations<T>(xs: T[]): T[][] {
  if (xs.length <= 1) return [xs];
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

/** People in a row; clues narrow it to one order. Harder levels have more people and subtler clues. */
export function makeSeating(d: number, rng: Rng): Item {
  const n = d <= 3 ? 4 : d <= 7 ? 5 : 6;
  const people = shuffle(rng, NAMES).slice(0, n);
  const truth = shuffle(rng, people);
  const pos = (a: string[], p: string) => a.indexOf(p);
  type Clue = { text: string; test: (a: string[]) => boolean; weight: number };
  const make = (): Clue => {
    const [x, y, z] = shuffle(rng, people);
    const px = pos(truth, x), py = pos(truth, y), pz = pos(truth, z);
    const r = rng();
    if (r < 0.18) return px < py ? { text: `${x} sits somewhere left of ${y}.`, test: (a) => pos(a, x) < pos(a, y), weight: 1 } : { text: `${x} sits somewhere right of ${y}.`, test: (a) => pos(a, x) > pos(a, y), weight: 1 };
    if (r < 0.32 && Math.abs(px - py) === 1) return { text: `${x} sits next to ${y}.`, test: (a) => Math.abs(pos(a, x) - pos(a, y)) === 1, weight: 1 };
    if (r < 0.44 && Math.abs(px - py) > 1) return { text: `${x} does not sit next to ${y}.`, test: (a) => Math.abs(pos(a, x) - pos(a, y)) !== 1, weight: 1 };
    if (r < 0.56 && Math.abs(px - py) === 2) return { text: `Exactly one person sits between ${x} and ${y}.`, test: (a) => Math.abs(pos(a, x) - pos(a, y)) === 2, weight: 2 };
    if (r < 0.7 && (px - pz) * (py - pz) < 0) return { text: `${z} sits somewhere between ${x} and ${y}.`, test: (a) => (pos(a, x) - pos(a, z)) * (pos(a, y) - pos(a, z)) < 0, weight: 2 };
    if (r < 0.8) { const end = px === 0 || px === n - 1; return end ? { text: `${x} sits at one end.`, test: (a) => [0, n - 1].includes(pos(a, x)), weight: 1 } : { text: `${x} is not at either end.`, test: (a) => ![0, n - 1].includes(pos(a, x)), weight: 1 }; }
    const seat = int(rng, 0, n - 1);
    return seat === px ? { text: `${x} sits in seat ${seat + 1}.`, test: (a) => pos(a, x) === seat, weight: 0 } : { text: `${x} is not in seat ${seat + 1}.`, test: (a) => pos(a, x) !== seat, weight: 1 };
  };
  let left = permutations(people);
  const clues: Clue[] = [];
  let guard = 0;
  while (left.length > 1 && guard++ < 300) {
    const c = make();
    // Harder levels avoid giveaway clues that pin a seat directly.
    if (d >= 6 && c.weight === 0) continue;
    if (clues.some((k) => k.text === c.text)) continue;
    const next = left.filter(c.test);
    if (next.length < left.length && next.length > 0) {
      clues.push(c);
      left = next;
    }
  }
  if (left.length !== 1) return makeSeating(d, rng);
  const seat = int(rng, 0, n - 1);
  const who = truth[seat];
  const { options, answer } = arrange(rng, who, people.filter((p) => p !== who));
  return {
    kind: 'seating',
    ask: `Who sits in seat ${seat + 1}?`,
    prompt: { n, clues: shuffle(rng, clues.map((c) => c.text)) },
    options,
    answer,
    explain: `Only one order fits every clue: ${truth.map((p, i) => `${i + 1}. ${p}`).join(', ')}.`,
    difficulty: d,
  };
}
