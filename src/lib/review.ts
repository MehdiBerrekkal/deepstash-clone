/**
 * Spaced repetition in the style of SM-2: each saved idea or highlight comes back just before you'd forget it.
 * Again restarts the item, Hard grows the gap a little, Good by the item's ease, Easy by more.
 */
export type ReviewState = {
  /** Ease factor, 1.3 and up (2.5 for a new item). */
  ef: number;
  /** Days until the next review. */
  interval: number;
  /** Successful reviews in a row. */
  reps: number;
  /** Local date the item is next due ("2026-10-30"). */
  due: string;
  lapses: number;
};

export type Grade = 'again' | 'hard' | 'good' | 'easy';
export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];
const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };

/** New cards introduced per day, so a big stash doesn't arrive all at once. */
export const NEW_PER_DAY = 10;

export function addDays(date: string, days: number) {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(y, m - 1, d + days);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

export function schedule(prev: ReviewState | undefined, grade: Grade, today: string): ReviewState {
  const q = QUALITY[grade];
  const s = prev ?? { ef: 2.5, interval: 0, reps: 0, due: today, lapses: 0 };
  const ef = Math.max(1.3, s.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (grade === 'again') return { ef, interval: 0, reps: 0, due: today, lapses: s.lapses + 1 };
  let interval: number;
  if (s.reps === 0) interval = grade === 'easy' ? 4 : grade === 'good' ? 1 : 1;
  else if (s.reps === 1) interval = grade === 'easy' ? 8 : grade === 'good' ? 6 : 3;
  else interval = Math.round(s.interval * (grade === 'hard' ? 1.2 : grade === 'good' ? ef : ef * 1.3));
  interval = Math.min(365, Math.max(1, interval));
  return { ef, interval, reps: s.reps + 1, due: addDays(today, interval), lapses: s.lapses };
}

/** "10 min", "1 day", "6 days", "3 mo" for the answer buttons. */
export function intervalLabel(state: ReviewState) {
  const d = state.interval;
  if (d === 0) return '<10 min';
  if (d < 30) return `${d} ${d === 1 ? 'day' : 'days'}`;
  if (d < 365) return `${Math.round(d / 30)} mo`;
  return '1 yr';
}
