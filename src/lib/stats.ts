import { localDate } from '@/lib/store';
import type { DayLog } from '@/lib/types';

/** A typical adult reading speed, used until we've seen enough of yours. */
export const DEFAULT_WPM = 230;
/** Characters per word in English prose, including the space. */
export const CHARS_PER_WORD = 5.8;
const CARD_SECONDS = 30;

export const minutesOf = (day?: DayLog) => Math.floor((day?.seconds ?? 0) / 60);

/** Your reading speed in words per minute, from time spent in full books; null until there's 5 minutes of data. */
export function readingSpeed(log: Record<string, DayLog>): number | null {
  let words = 0;
  let seconds = 0;
  for (const d of Object.values(log)) {
    words += d.words;
    seconds += Math.max(0, d.seconds - d.cards * CARD_SECONDS);
  }
  if (seconds < 300 || words < 500) return null;
  return Math.round(Math.min(600, Math.max(100, words / (seconds / 60))));
}

/** Consecutive days with some reading, ending today (or yesterday, if today hasn't started yet). */
export function readingStreak(log: Record<string, DayLog>, goalSeconds = 1) {
  const day = new Date();
  if (!((log[localDate(day)]?.seconds ?? 0) >= goalSeconds)) day.setDate(day.getDate() - 1);
  let n = 0;
  while ((log[localDate(day)]?.seconds ?? 0) >= goalSeconds) {
    n++;
    day.setDate(day.getDate() - 1);
  }
  return n;
}

/** The last `weeks` whole weeks as columns of 7 dates (Monday first), oldest first; future days are null. */
export function calendarWeeks(weeks: number): (string | null)[][] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (weeks - 1) * 7);
  const out: (string | null)[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + w * 7 + d);
      col.push(date > today ? null : localDate(date));
    }
    out.push(col);
  }
  return out;
}

export function formatDuration(minutes: number) {
  if (minutes < 1) return 'under a minute';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function compactNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}
