/**
 * Characters as strokes, and grading of hand-drawn strokes.
 *
 * Every glyph is a list of strokes in drawing order; each stroke is its centre line as points in the glyph's own box
 * (KanjiVG: 109, Make Me a Hanzi: 1024). A drawn stroke passes when it follows the expected one closely enough, in
 * the right direction; strokes are checked one by one, so order counts too.
 */

export type Pt = [number, number];
export type Glyph = {
  char: string;
  /** Size of the square the coordinates live in. */
  box: number;
  /** Centre lines, in order. */
  strokes: Pt[][];
  /** Filled outlines for display (Chinese characters), same order. */
  outlines?: string[];
};

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const lengthOf = (pts: Pt[]) => pts.reduce((n, p, i) => (i ? n + dist(pts[i - 1], p) : 0), 0);

/** n points evenly spaced along a line. */
export function resample(pts: Pt[], n = 24): Pt[] {
  if (pts.length < 2) return Array.from({ length: n }, () => pts[0] ?? [0, 0]);
  const total = lengthOf(pts);
  const step = total / (n - 1);
  const out: Pt[] = [pts[0]];
  let acc = 0;
  let i = 1;
  let prev = pts[0];
  while (out.length < n - 1 && i < pts.length) {
    const d = dist(prev, pts[i]);
    if (acc + d >= step && d > 0) {
      const t = (step - acc) / d;
      const p: Pt = [prev[0] + (pts[i][0] - prev[0]) * t, prev[1] + (pts[i][1] - prev[1]) * t];
      out.push(p);
      prev = p;
      acc = 0;
    } else {
      acc += d;
      prev = pts[i];
      i++;
    }
  }
  while (out.length < n) out.push(pts[pts.length - 1]);
  return out;
}

const meanGap = (a: Pt[], b: Pt[]) => a.reduce((s, p, i) => s + dist(p, b[i]), 0) / a.length;

export type StrokeResult = { ok: boolean; reversed: boolean; error: number };

/**
 * Grades a drawn stroke against the expected one (both in glyph coordinates). Forgiving on shape, strict on
 * direction: a stroke drawn backwards doesn't count. Very short strokes (dots, ticks) only need the right place.
 */
export function gradeStroke(drawn: Pt[], target: Pt[], box: number, strictness = 1): StrokeResult {
  const tLen = lengthOf(target);
  const dLen = lengthOf(drawn);
  const tolerance = box * 0.16 * (1 / strictness);
  if (tLen < box * 0.12) {
    // A dot or tick: close to where it should be.
    const centre = target[Math.floor(target.length / 2)];
    const mid = drawn[Math.floor(drawn.length / 2)] ?? drawn[0];
    const error = dist(centre, mid);
    return { ok: error < tolerance * 1.2, reversed: false, error };
  }
  if (dLen < tLen * 0.35) return { ok: false, reversed: false, error: Infinity };
  const a = resample(drawn);
  const b = resample(target);
  const forward = meanGap(a, b);
  const backward = meanGap([...a].reverse(), b);
  const reversed = backward < forward * 0.8 && backward < tolerance;
  return { ok: forward < tolerance && !reversed, reversed, error: forward };
}

// ---------- loading glyphs ----------

let kana: Promise<Record<string, Pt[][]>> | null = null;
const hanzi = new Map<string, Promise<Glyph | null>>();

/** Japanese kana and starter kanji (KanjiVG), loaded on first use. */
async function kanaGlyph(char: string): Promise<Glyph | null> {
  kana ??= import('@/data/learn/kana-strokes.json').then((m) => (m.default ?? m) as unknown as Record<string, Pt[][]>);
  const strokes = (await kana)[char];
  return strokes ? { char, box: 109, strokes } : null;
}

/** Chinese characters from Make Me a Hanzi (via the hanzi-writer-data package), fetched when needed. */
function hanziGlyph(char: string): Promise<Glyph | null> {
  if (!hanzi.has(char)) {
    hanzi.set(
      char,
      fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { strokes: string[]; medians: Pt[][] } | null) =>
          d ? { char, box: 1024, strokes: d.medians.map((m) => m.map(([x, y]) => [x, 900 - y] as Pt)), outlines: d.strokes } : null,
        )
        .catch(() => {
          hanzi.delete(char);
          return null;
        }),
    );
  }
  return hanzi.get(char)!;
}

export async function loadGlyph(char: string, script: 'kana' | 'hanzi' | 'own', own?: Record<string, Pt[][]>, ownBox = 109): Promise<Glyph | null> {
  if (script === 'own') return own?.[char] ? { char, box: ownBox, strokes: own[char] } : null;
  if (script === 'hanzi') return hanziGlyph(char);
  return kanaGlyph(char);
}
