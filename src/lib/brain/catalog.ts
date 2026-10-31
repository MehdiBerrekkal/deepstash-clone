import { int, numberOptions, pick, shuffle, type Item, type Rng, type Skill } from '@/lib/brain/core';
import { makeAnalogy, makeMatrix } from '@/lib/brain/figures';
import { makeLetters, makeNumberMatrix, makeSeries, makeSeating, makeSyllogism, makeVerbal, makeWordProblem } from '@/lib/brain/reasoning';
import { makeCubeNet, makeFolding, makeRotation2D } from '@/lib/brain/spatial';

// ---------- speed items ----------

const GLYPHS = ['⊕', '△', '◇', '○', '□', '✕', '≡', '∞', '⊗', '☰', '◐', '⌘'];
export type CodePrompt = { key: { glyph: string; digit: number }[]; glyph: string };

/** Symbol coding: a key pairs symbols with digits; give the digit for the symbol shown. */
function makeCode(d: number, rng: Rng): Item {
  const n = d <= 3 ? 5 : d <= 6 ? 7 : 9;
  const glyphs = shuffle(rng, GLYPHS).slice(0, n);
  const key = glyphs.map((glyph, i) => ({ glyph, digit: i + 1 }));
  const target = pick(rng, key);
  return {
    kind: 'code',
    ask: 'Which number goes with this symbol?',
    prompt: { key: shuffle(rng, key), glyph: target.glyph } satisfies CodePrompt,
    options: key.map((k) => k.digit),
    answer: target.digit - 1,
    explain: `In the key, ${target.glyph} is paired with ${target.digit}.`,
    difficulty: d,
  };
}

export type SwitchPrompt = { n: number; rule: 'parity' | 'size' };
let lastRule: SwitchPrompt['rule'] = 'parity';
/** Task switching: the frame colour says which question to answer: odd/even, or lower/higher than 5. */
function makeSwitch(d: number, rng: Rng): Item {
  const switchChance = d <= 3 ? 0.25 : d <= 6 ? 0.4 : 0.55;
  const rule: SwitchPrompt['rule'] = rng() < switchChance ? (lastRule === 'parity' ? 'size' : 'parity') : lastRule;
  lastRule = rule;
  const n = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
  const answer = rule === 'parity' ? (n % 2 ? 0 : 1) : n < 5 ? 2 : 3;
  return { kind: 'switch', ask: '', prompt: { n, rule } satisfies SwitchPrompt, options: ['Odd', 'Even', 'Lower', 'Higher'], answer, explain: rule === 'parity' ? `The amber frame asks odd or even: ${n} is ${n % 2 ? 'odd' : 'even'}.` : `The cyan frame asks lower or higher than 5: ${n} is ${n < 5 ? 'lower' : 'higher'}.`, difficulty: d };
}

// Hues chosen to stay apart for the common kinds of colour blindness (after the Okabe-Ito palette).
const INKS = [
  { name: 'RED', color: '#E0561B' },
  { name: 'BLUE', color: '#2F7BFF' },
  { name: 'YELLOW', color: '#F0D23C' },
  { name: 'PINK', color: '#E07AC0' },
  { name: 'GREEN', color: '#00A383' },
  { name: 'GREY', color: '#8A909C' },
];
export type InkPrompt = { word: string; ink: string; rule: 'ink' | 'word' };
/** Colour conflict: name the ink colour, not the word; at high levels the rule sometimes flips to the word. */
function makeInk(d: number, rng: Rng): Item {
  const palette = INKS.slice(0, d <= 4 ? 4 : d <= 7 ? 5 : 6);
  const word = pick(rng, palette);
  const ink = rng() < 0.8 ? pick(rng, palette.filter((p) => p !== word)) : word;
  const rule: InkPrompt['rule'] = d >= 7 && rng() < 0.3 ? 'word' : 'ink';
  const target = rule === 'ink' ? ink : word;
  const options = shuffle(rng, palette).slice(0, 4);
  if (!options.includes(target)) options[int(rng, 0, 3)] = target;
  const other = rule === 'ink' ? word : ink;
  if (!options.includes(other)) options[options.findIndex((o) => o !== target)] = other;
  return {
    kind: 'ink',
    ask: '',
    prompt: { word: word.name, ink: ink.color, rule } satisfies InkPrompt,
    options: options.map((o) => ({ name: o.name, color: o.color })),
    answer: options.indexOf(target),
    explain: rule === 'ink' ? `The word says ${word.name}, but the ink is ${ink.name.toLowerCase()}.` : `This time the prompt asks for the word: ${word.name}.`,
    difficulty: d,
  };
}

/** Mental arithmetic, harder with each level. */
function makeArithmetic(d: number, rng: Rng): Item {
  let q = '';
  let a = 0;
  if (d <= 2) { const x = int(rng, 12, 60), y = int(rng, 12, 60); q = `${x} + ${y}`; a = x + y; }
  else if (d <= 4) { const x = int(rng, 6, 15), y = int(rng, 3, 12); q = `${x} × ${y}`; a = x * y; }
  else if (d <= 6) { const x = int(rng, 30, 150), y = int(rng, 15, 99); const op = pick(rng, ['+', '−']); q = `${x} ${op} ${y}`; a = op === '+' ? x + y : x - y; }
  else if (d <= 8) { const x = int(rng, 3, 12), y = int(rng, 3, 12), z = int(rng, 10, 60); q = `${x} × ${y} − ${z}`; a = x * y - z; }
  else { const y = int(rng, 3, 15), x = y * int(rng, 6, 25), z = int(rng, 2, 9); q = `${x} ÷ ${y} × ${z}`; a = (x / y) * z; }
  return { kind: 'arith', ask: '', prompt: `${q} = ?`, ...numberOptions(rng, a, 4, [1, -1, 2, -2, 10, -10, 5, -5]), explain: `${q} = ${a}.`, difficulty: d };
}

// ---------- the catalog ----------

export type GameType = 'items' | 'sprint' | 'nback' | 'span' | 'corsi' | 'tower';
export type GameDef = {
  id: string;
  name: string;
  skill: Skill;
  blurb: string;
  howTo: string;
  type: GameType;
  make?: (d: number, rng: Rng) => Item;
  /** Items per run (items games), or seconds (sprints). */
  items?: number;
  seconds?: number;
  /** Seconds allowed per item before it counts as missed (items games). */
  perItem?: number;
  /** Shown in the IQ-style test. */
  test?: boolean;
  /** One line on what the game trains. */
  why?: string;
};

export const GAMES: GameDef[] = [
  { id: 'matrix', name: 'Matrix Reasoning', skill: 'logic', type: 'items', make: makeMatrix, items: 10, perItem: 75, test: true, blurb: 'Complete abstract 3×3 patterns', howTo: 'Each row of the grid follows hidden rules: shapes, shading, lines and dots change in a regular way. Work out the rules and pick the figure that completes the bottom-right cell. Rules combine as you improve.', why: 'Fluid reasoning: spotting rules nobody told you, the core of most IQ tests.' },
  { id: 'analogy', name: 'Figure Analogies', skill: 'logic', type: 'items', make: makeAnalogy, items: 10, perItem: 60, test: true, blurb: 'A is to B as C is to ?', howTo: 'Something changes between figure A and figure B. Apply exactly the same changes to C. Later levels chain two or three changes.', why: 'Abstraction: describing a change precisely enough to apply it elsewhere.' },
  { id: 'series', name: 'Number Series', skill: 'math', type: 'items', make: makeSeries, items: 10, perItem: 60, test: true, blurb: 'Multi-rule sequences', howTo: 'Find the rule behind the numbers and pick the next one. Watch for alternating steps, growing gaps, two series woven together and powers.', why: 'Inductive reasoning with numbers: forming and testing hypotheses quickly.' },
  { id: 'letters', name: 'Letter Series', skill: 'verbal', type: 'items', make: makeLetters, items: 10, perItem: 45, test: true, blurb: 'Patterns in the alphabet', howTo: 'The letters move through the alphabet by a rule. Count the steps between them and pick what comes next.', why: 'Rule finding with sequences, while holding positions in working memory.' },
  { id: 'numgrid', name: 'Number Matrix', skill: 'math', type: 'items', make: makeNumberMatrix, items: 8, perItem: 60, test: true, blurb: 'Find the rule across rows', howTo: 'Each row turns its first two numbers into the third with the same calculation. Find it and fill in the gap.', why: 'Numerical reasoning: finding one operation that fits several cases.' },
  { id: 'syllogism', name: 'Deduction', skill: 'logic', type: 'items', make: makeSyllogism, items: 12, perItem: 40, test: true, blurb: 'Valid or invalid conclusions', howTo: 'Accept both statements as true, even if the words are made up. Decide whether the conclusion must follow, or whether it could be false.', why: 'Deductive logic: separating what must be true from what merely sounds right.' },
  { id: 'seating', name: 'Logic Grid', skill: 'logic', type: 'items', make: makeSeating, items: 4, perItem: 150, test: true, blurb: 'Deduce the seating order', howTo: 'People sit in a row of numbered seats. Use every clue to rule out arrangements until only one remains, then answer the question.', why: 'Constraint reasoning: combining many facts into one consistent picture.' },
  { id: 'verbal', name: 'Verbal Analogies', skill: 'verbal', type: 'items', make: makeVerbal, items: 10, perItem: 30, test: true, blurb: 'Relationships between words', howTo: 'Find the relationship between the first pair of words, then choose the word that completes the second pair in the same way.', why: 'Verbal reasoning and vocabulary: naming the relation between ideas.' },
  { id: 'word', name: 'Quantitative Reasoning', skill: 'math', type: 'items', make: makeWordProblem, items: 8, perItem: 90, test: true, blurb: 'Rates, ratios and percentages', howTo: 'Short word problems. Set them up carefully: averages of speeds, percentages of percentages and combined rates are classic traps.', why: 'Quantitative reasoning: turning words into the right calculation.' },
  { id: 'folding', name: 'Paper Folding', skill: 'spatial', type: 'items', make: makeFolding, items: 8, perItem: 60, test: true, blurb: 'Fold, punch, unfold', howTo: 'A square sheet is folded as shown, then holes are punched through all the layers. Picture unfolding it: every hole is mirrored across each fold.', why: 'Spatial visualisation: mentally transforming a shape step by step.' },
  { id: 'cubenet', name: 'Cube Nets', skill: 'spatial', type: 'items', make: makeCubeNet, items: 8, perItem: 60, test: true, blurb: 'Which cube does it fold into?', howTo: 'The flat net folds into a cube. Choose the cube view that is possible. Faces two apart in a straight line end up opposite, and the order of faces must not be mirrored.', why: 'Spatial visualisation: folding a flat pattern into 3D in your head.' },
  { id: 'rotation3d', name: 'Mental Rotation', skill: 'spatial', type: 'items', make: makeRotation2D, items: 10, perItem: 45, test: true, blurb: 'Turned, or flipped over?', howTo: 'Find the shape that is the target turned around on the page, without flipping it over. The others are mirror images or have a square moved. Pick a distinctive corner of the target and look for it in each option.', why: 'Mental rotation: keeping an object’s structure while turning it.' },
  { id: 'nback', name: 'Dual N-Back', skill: 'memory', type: 'nback', blurb: 'Working memory at its limit', howTo: 'A square lights up on the grid while a letter is spoken. Press “Position” when the square is where it was N steps back, and “Sound” when the letter is the same as N steps back. N grows as you improve.', why: 'Working memory: updating what you hold in mind, second by second.' },
  { id: 'span', name: 'Digit Span', skill: 'memory', type: 'span', blurb: 'Forwards, then backwards', howTo: 'Digits appear one at a time. Type them back in the same order; at higher levels, in reverse order. The list gets longer each time you succeed.', why: 'Short-term memory span, and mental manipulation when reversed.' },
  { id: 'corsi', name: 'Block Span', skill: 'memory', type: 'corsi', blurb: 'Remember a path of blocks', howTo: 'Blocks light up one after another. Tap them in the same order. The path grows by one after each success.', why: 'Visuospatial memory: holding a path in mind.' },
  { id: 'code', name: 'Symbol Coding', skill: 'focus', type: 'sprint', make: makeCode, seconds: 60, blurb: 'Processing speed, 60 seconds', howTo: 'Use the key to find the number paired with the symbol, as fast as you can. Accuracy counts as much as speed.', why: 'Processing speed: how fast you look up and act on information.' },
  { id: 'switch', name: 'Task Switching', skill: 'focus', type: 'sprint', make: makeSwitch, seconds: 60, blurb: 'The rule changes without warning', howTo: 'An amber frame asks odd or even; a cyan frame asks lower or higher than 5. Answer the question the frame asks. The rule switches more often as you improve.', why: 'Cognitive flexibility: switching rules without losing speed.' },
  { id: 'ink', name: 'Colour Conflict', skill: 'focus', type: 'sprint', make: makeInk, seconds: 45, blurb: 'Inhibit the obvious answer', howTo: 'Name the colour of the INK, not the word. At higher levels a prompt sometimes asks for the word instead: read it carefully.', why: 'Inhibition: stopping the automatic answer to give the right one.' },
  { id: 'arith', name: 'Mental Arithmetic', skill: 'math', type: 'sprint', make: makeArithmetic, seconds: 60, blurb: 'Speed calculation', howTo: 'Solve as many as you can in 60 seconds. Wrong answers cost two seconds.', why: 'Calculation fluency under time pressure.' },
  { id: 'tower', name: 'Tower Planning', skill: 'logic', type: 'tower', blurb: 'Reach the goal in the fewest moves', howTo: 'Move one disc at a time from the top of a peg; a disc can never sit on a smaller one. Rebuild the goal arrangement in as few moves as possible. Plan before you move.', why: 'Planning: thinking several moves ahead before acting.' },
];
export const gameById = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<string, GameDef>;

/** Today's daily-challenge game (date as "2026-10-30"). */
export function dailyGame(date: string) {
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GAMES[h % GAMES.length];
}

/** Today's three-game session: one game from each of your two weakest areas, then one from somewhere else. */
export function sessionGames(skills: Partial<Record<Skill, number>>, played: Record<string, number>, date: string): string[] {
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const areas = (['logic', 'spatial', 'memory', 'focus', 'math', 'verbal'] as Skill[]).sort((a, b) => (skills[a] ?? -1) - (skills[b] ?? -1) || ((h >> a.length) & 1) - 0.5);
  const pickFrom = (skill: Skill, salt: number) => {
    const games = GAMES.filter((g) => g.skill === skill).sort((a, b) => (played[a.id] ?? 0) - (played[b.id] ?? 0));
    const least = games.filter((g) => (played[g.id] ?? 0) === (played[games[0].id] ?? 0));
    return least[(h + salt) % least.length].id;
  };
  return [pickFrom(areas[0], 0), pickFrom(areas[1], 1), pickFrom(areas[2 + (h % 4)], 2)];
}
