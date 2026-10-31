import { arrange, int, pick, shuffle, type Item, type Rng } from '@/lib/brain/core';

// ---------- paper folding ----------

/** A square sheet on an N×N grid; folds are halves (vertical, horizontal) or a diagonal at hard levels. */
export type Fold = 'left' | 'right' | 'top' | 'bottom' | 'diag';
export type FoldPrompt = { n: number; folds: Fold[]; holes: [number, number][] };
export type HoleSet = [number, number][];

const keyOf = (h: HoleSet) => h.map((p) => p.join(',')).sort().join(';');

/** The corner of the quarter left after the half folds; a diagonal fold runs across that quarter. */
const corner = (n: number, folds: Fold[]) => [folds.includes('left') ? n / 2 : 0, folds.includes('top') ? n / 2 : 0];

/** Where a folded-over cell lands: reflecting a hole back out undoes each fold, last fold first. */
function unfold(n: number, holes: HoleSet, folds: Fold[]): HoleSet {
  let out = holes;
  const [x0, y0] = corner(n, folds);
  for (const f of [...folds].reverse()) {
    const mirror = out.map(([x, y]): [number, number] =>
      f === 'left' || f === 'right' ? [n - 1 - x, y] : f === 'top' || f === 'bottom' ? [x, n - 1 - y] : [x0 + (y - y0), y0 + (x - x0)],
    );
    out = [...out, ...mirror];
  }
  const seen = new Map(out.map((h) => [h.join(','), h]));
  return [...seen.values()];
}

/** The part of the sheet still showing after the folds, where holes may be punched. */
function visibleCells(n: number, folds: Fold[]) {
  const cells: [number, number][] = [];
  const h = n / 2;
  const [x0, y0] = corner(n, folds);
  for (let x = 0; x < n; x++)
    for (let y = 0; y < n; y++) {
      const ok = folds.every((f) =>
        f === 'left' ? x >= h : f === 'right' ? x < h : f === 'top' ? y >= h : f === 'bottom' ? y < h : x - x0 >= y - y0,
      );
      if (ok) cells.push([x, y]);
    }
  return cells;
}

/** Fold a sheet one to three times, punch holes, and pick how it looks unfolded. */
export function makeFolding(d: number, rng: Rng): Item {
  const n = 4;
  const nFolds = d <= 3 ? 1 : d <= 7 ? 2 : 3;
  const first = pick(rng, ['left', 'right', 'top', 'bottom'] as Fold[]);
  const second = pick(rng, (first === 'left' || first === 'right' ? ['top', 'bottom'] : ['left', 'right']) as Fold[]);
  const folds: Fold[] = [first, second, 'diag'].slice(0, nFolds) as Fold[];
  // The diagonal fold only works on a square; after two half folds it's a quarter square, so use a fresh order.
  const visible = visibleCells(n, folds);
  const punches = shuffle(rng, visible).slice(0, d <= 5 ? 1 : 2);
  const answer = unfold(n, punches, folds);
  // Distractors: missing one of the folds, folding the wrong way, or a hole shifted.
  const wrongs: HoleSet[] = [];
  const candidates: HoleSet[] = [
    unfold(n, punches, folds.slice(0, -1)),
    unfold(n, punches, folds.map((f) => (f === 'left' ? 'top' : f === 'right' ? 'bottom' : f === 'top' ? 'left' : f === 'bottom' ? 'right' : f))),
    unfold(n, punches.map(([x, y]) => [Math.min(n - 1, x + 1), y] as [number, number]), folds),
    unfold(n, punches.map(([x, y]) => [x, Math.max(0, y - 1)] as [number, number]), folds),
    answer.slice(1),
    unfold(n, punches, folds.slice(1)),
    answer.map(([x, y]) => [y, x] as [number, number]),
  ];
  // Fill up with other patterns of the same number of holes if the near misses ran out.
  const all: [number, number][] = [];
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) all.push([x, y]);
  for (let t = 0; t < 40; t++) candidates.push(shuffle(rng, all).slice(0, answer.length));
  for (const c of [...shuffle(rng, candidates.slice(0, 7)), ...candidates.slice(7)]) {
    if (wrongs.length >= 4) break;
    if (c.length && keyOf(c) !== keyOf(answer) && !wrongs.some((w) => keyOf(w) === keyOf(c))) wrongs.push(c);
  }
  const { options, answer: idx } = arrange(rng, answer, wrongs);
  return {
    kind: 'folding',
    ask: 'The sheet is folded as shown, then punched. How does it look unfolded?',
    prompt: { n, folds, holes: punches } satisfies FoldPrompt,
    options,
    answer: idx,
    explain: 'Unfold one step at a time: every hole is mirrored across each fold line, so each fold doubles the holes.',
    difficulty: d,
  };
}

// ---------- cube nets ----------

export type Face = 'T' | 'B' | 'N' | 'S' | 'E' | 'W';
export type Symbol = 'dot' | 'ring' | 'block' | 'box' | 'plus' | 'cross';
const SYMBOLS: Symbol[] = ['dot', 'ring', 'block', 'box', 'plus', 'cross'];
const NORMAL: Record<Face, [number, number, number]> = { T: [0, 0, 1], B: [0, 0, -1], N: [0, 1, 0], S: [0, -1, 0], E: [1, 0, 0], W: [-1, 0, 0] };

/** The 11 nets of a cube as cells on a grid. */
export const NETS: [number, number][][] = [
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]],
];

/** Folds a net: which cube face each cell becomes (the first cell lies on the bottom). */
export function foldNet(cells: [number, number][]): Face[] {
  const faces: Face[] = new Array(cells.length);
  type Pose = Record<'B' | 'T' | 'N' | 'S' | 'E' | 'W', Face>;
  const start: Pose = { B: 'B', T: 'T', N: 'N', S: 'S', E: 'E', W: 'W' };
  const roll = (p: Pose, dir: 'E' | 'W' | 'N' | 'S'): Pose =>
    dir === 'E'
      ? { ...p, B: p.E, E: p.T, T: p.W, W: p.B }
      : dir === 'W'
        ? { ...p, B: p.W, W: p.T, T: p.E, E: p.B }
        : dir === 'N'
          ? { ...p, B: p.N, N: p.T, T: p.S, S: p.B }
          : { ...p, B: p.S, S: p.T, T: p.N, N: p.B };
  const idx = (x: number, y: number) => cells.findIndex((c) => c[0] === x && c[1] === y);
  const stack: [number, Pose][] = [[0, start]];
  faces[0] = 'B';
  while (stack.length) {
    const [i, pose] = stack.pop()!;
    const [x, y] = cells[i];
    // Screen y grows downward, so "north" on the net is y - 1.
    for (const [dx, dy, dir] of [[1, 0, 'E'], [-1, 0, 'W'], [0, -1, 'N'], [0, 1, 'S']] as const) {
      const j = idx(x + dx, y + dy);
      if (j < 0 || faces[j]) continue;
      const next = roll(pose, dir);
      faces[j] = next.B;
      stack.push([j, next]);
    }
  }
  return faces;
}

export type NetPrompt = { cells: [number, number][]; symbols: Symbol[] };
export type CubeView = { top: Symbol; front: Symbol; right: Symbol };

const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** All 24 correct views (top, front, right) of the folded cube. */
function views(): [Face, Face, Face][] {
  const fs = Object.keys(NORMAL) as Face[];
  const out: [Face, Face, Face][] = [];
  for (const t of fs) for (const f of fs) for (const r of fs) {
    const [a, b, c] = [NORMAL[t], NORMAL[f], NORMAL[r]];
    if (dot(a, b) || dot(a, c) || dot(b, c)) continue;
    // Seen from the front-right: top · (front × right) is +1 for a real cube, −1 for its mirror image.
    if (dot(a, cross(b, c)) === 1) out.push([t, f, r]);
  }
  return out;
}

/** Which cube can this net fold into? */
export function makeCubeNet(d: number, rng: Rng): Item {
  const cells = pick(rng, NETS);
  const symbols = shuffle(rng, SYMBOLS);
  const faces = foldNet(cells);
  const symbolOf = (f: Face) => symbols[faces.indexOf(f)];
  const good = views();
  const right = pick(rng, good);
  const answer: CubeView = { top: symbolOf(right[0]), front: symbolOf(right[1]), right: symbolOf(right[2]) };
  const allFaces = Object.keys(NORMAL) as Face[];
  const wrong: CubeView[] = [];
  const asView = (t: Face, f: Face, r: Face): CubeView => ({ top: symbolOf(t), front: symbolOf(f), right: symbolOf(r) });
  const isGood = (t: Face, f: Face, r: Face) => good.some((g) => g[0] === t && g[1] === f && g[2] === r);
  const same = (a: CubeView, b: CubeView) => a.top === b.top && a.front === b.front && a.right === b.right;
  // Harder levels use only mirror images (all faces truly adjacent); easier ones also show opposite faces side by side.
  const tries: [Face, Face, Face][] = [];
  for (const t of allFaces) for (const f of allFaces) for (const r of allFaces) {
    if (t === f || t === r || f === r || isGood(t, f, r)) continue;
    const mirror = !dot(NORMAL[t], NORMAL[f]) && !dot(NORMAL[t], NORMAL[r]) && !dot(NORMAL[f], NORMAL[r]);
    if (d >= 6 && !mirror) continue;
    tries.push([t, f, r]);
  }
  for (const [t, f, r] of shuffle(rng, tries)) {
    if (wrong.length >= 3) break;
    const v = asView(t, f, r);
    if (!same(v, answer) && !wrong.some((w) => same(w, v))) wrong.push(v);
  }
  const { options, answer: idx } = arrange(rng, answer, wrong);
  return {
    kind: 'cubenet',
    ask: 'Which cube can be folded from this net?',
    prompt: { cells, symbols } satisfies NetPrompt,
    options,
    answer: idx,
    explain: 'Faces that are two apart in a straight line of the net end up opposite each other, so they can never be seen together; and the order of the three visible faces must match the net, not its mirror image.',
    difficulty: d,
  };
}

// ---------- 3D rotation of block figures ----------

export type Voxel = [number, number, number];

function polycube(rng: Rng, size: number): Voxel[] {
  const cells: Voxel[] = [[0, 0, 0]];
  const dirs: Voxel[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  while (cells.length < size) {
    const [x, y, z] = pick(rng, cells);
    const [dx, dy, dz] = pick(rng, dirs);
    const next: Voxel = [x + dx, y + dy, z + dz];
    if (!cells.some((c) => c[0] === next[0] && c[1] === next[1] && c[2] === next[2])) cells.push(next);
  }
  return normalize(cells);
}
function normalize(cells: Voxel[]): Voxel[] {
  const m = [0, 1, 2].map((i) => Math.min(...cells.map((c) => c[i])));
  return cells.map((c) => [c[0] - m[0], c[1] - m[1], c[2] - m[2]] as Voxel).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}
const vkey = (cells: Voxel[]) => normalize(cells).map((c) => c.join(',')).join(';');
/** The 24 rotations of 3D space, as functions on a point. */
const ROTATIONS: ((v: Voxel) => Voxel)[] = (() => {
  const rx = ([x, y, z]: Voxel): Voxel => [x, -z, y];
  const ry = ([x, y, z]: Voxel): Voxel => [z, y, -x];
  const rz = ([x, y, z]: Voxel): Voxel => [-y, x, z];
  const out: ((v: Voxel) => Voxel)[] = [];
  const seen = new Set<string>();
  const probe: Voxel[] = [[1, 2, 3]];
  const compose = (...fs: ((v: Voxel) => Voxel)[]) => (v: Voxel) => fs.reduce((a, f) => f(a), v);
  const gens = [rx, ry, rz];
  const queue: ((v: Voxel) => Voxel)[] = [(v) => v];
  while (queue.length && out.length < 24) {
    const f = queue.shift()!;
    const k = probe.map(f).map((p) => p.join(',')).join();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(f);
    for (const g of gens) queue.push(compose(f, g));
  }
  return out;
})();
const mirror3 = (cells: Voxel[]) => normalize(cells.map(([x, y, z]) => [-x, y, z] as Voxel));
const allRotations = (cells: Voxel[]) => ROTATIONS.map((r) => vkey(cells.map(r)));

/** Which figure is the same as the target, only turned? The others are mirror images or have a block moved. */
export function makeRotation3D(d: number, rng: Rng): Item {
  const size = d <= 3 ? 4 : d <= 6 ? 5 : 6;
  let shape: Voxel[];
  let guard = 0;
  // A figure that is its own mirror image would have no wrong answers.
  do shape = polycube(rng, size);
  while (allRotations(shape).includes(vkey(mirror3(shape))) && guard++ < 50);
  const rot = (cells: Voxel[]) => normalize(cells.map(pick(rng, ROTATIONS.slice(1))));
  const answer = rot(shape);
  const rots = new Set(allRotations(shape));
  const wrong: Voxel[][] = [];
  const mirrored = mirror3(shape);
  const tweak = (cells: Voxel[]): Voxel[] => {
    // Move one end block somewhere else that keeps the figure connected.
    for (let t = 0; t < 30; t++) {
      const i = int(rng, 0, cells.length - 1);
      const rest = cells.filter((_, k) => k !== i);
      const [x, y, z] = pick(rng, rest);
      const dir = pick(rng, [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] as Voxel[]);
      const nv: Voxel = [x + dir[0], y + dir[1], z + dir[2]];
      if (rest.some((c) => c.join() === nv.join())) continue;
      const out = normalize([...rest, nv]);
      if (!rots.has(vkey(out))) return out;
    }
    return mirrored;
  };
  const pool = [rot(mirrored), rot(mirrored), rot(mirrored), rot(tweak(shape)), rot(tweak(shape))];
  for (const w of pool) {
    if (wrong.length >= 3) break;
    if (!rots.has(vkey(w)) && !wrong.some((x) => vkey(x) === vkey(w))) wrong.push(w);
  }
  const { options, answer: idx } = arrange(rng, answer, wrong);
  return {
    kind: 'rotation3d',
    ask: 'Which figure is the target, only turned?',
    prompt: shape,
    options,
    answer: idx,
    explain: 'The others are mirror images or have a block in a different place: no turn can make them match.',
    difficulty: d,
  };
}

// ---------- mental rotation (flat shapes) ----------

/** A flat shape made of grid squares, as [column, row] cells. */
export type Poly = [number, number][];

const polyKey = (cells: Poly) => {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => `${x - minX},${y - minY}`).sort().join(';');
};
const normPoly = (cells: Poly): Poly => {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - minX, y - minY] as [number, number]);
};
/** Turns a shape 90° clockwise, k times. */
const turnPoly = (cells: Poly, k: number): Poly => {
  let out = cells;
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) out = out.map(([x, y]) => [-y, x] as [number, number]);
  return normPoly(out);
};
const flipPoly = (cells: Poly): Poly => normPoly(cells.map(([x, y]) => [-x, y] as [number, number]));
const turns = (cells: Poly) => [0, 1, 2, 3].map((k) => polyKey(turnPoly(cells, k)));

function growPoly(rng: Rng, n: number): Poly {
  const cells: Poly = [[0, 0]];
  while (cells.length < n) {
    const [x, y] = pick(rng, cells);
    const [dx, dy] = pick(rng, [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]);
    const c: [number, number] = [x + dx, y + dy];
    if (!cells.some((k) => k[0] === c[0] && k[1] === c[1])) cells.push(c);
  }
  return normPoly(cells);
}

/**
 * Mental rotation with flat shapes: which option is the target only turned (not flipped)? Shapes are asymmetric,
 * so the mirror image never matches; harder levels use more squares, more options and a moved-square distractor.
 */
export function makeRotation2D(d: number, rng: Rng): Item {
  const n = d <= 2 ? 5 : d <= 5 ? 6 : d <= 8 ? 7 : 8;
  let shape: Poly;
  let guard = 0;
  // Every turn must look different, and the mirror image must not match any turn.
  do shape = growPoly(rng, n);
  while ((new Set(turns(shape)).size < 4 || turns(shape).includes(polyKey(flipPoly(shape)))) && guard++ < 200);
  const own = new Set(turns(shape));
  const answer = turnPoly(shape, int(rng, 1, 3));
  const optionCount = d <= 4 ? 4 : 5;
  const wrong: Poly[] = [];
  const add = (p: Poly) => {
    if (wrong.length < optionCount - 1 && !own.has(polyKey(p)) && !wrong.some((w) => polyKey(w) === polyKey(p))) wrong.push(p);
  };
  const mirrored = flipPoly(shape);
  for (const k of shuffle(rng, [0, 1, 2, 3])) add(turnPoly(mirrored, k));
  // From level 5, one option has a single square moved: close, but a different shape.
  if (d >= 5) {
    for (let t = 0; t < 40; t++) {
      const i = int(rng, 0, shape.length - 1);
      const rest = shape.filter((_, k) => k !== i);
      const [x, y] = pick(rng, rest);
      const [dx, dy] = pick(rng, [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]);
      const moved = normPoly([...rest, [x + dx, y + dy]]);
      if (new Set(moved.map((c) => c.join())).size !== moved.length || own.has(polyKey(moved))) continue;
      wrong.splice(wrong.length - 1, 1);
      add(turnPoly(moved, int(rng, 0, 3)));
      break;
    }
  }
  // Keep the moved-square option in the set even when the mirror turns filled it.
  const { options, answer: idx } = arrange(rng, answer, wrong.slice(0, optionCount - 1));
  return {
    kind: 'rotation2d',
    ask: 'Which shape is the target, only turned (not flipped)?',
    prompt: shape,
    options,
    answer: idx,
    explain: 'Turn the target in your head until one corner lines up. The other options are mirror images (flipped over) or have a square moved, so no turn can make them match.',
    difficulty: d,
  };
}
