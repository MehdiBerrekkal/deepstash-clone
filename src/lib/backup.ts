import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';

import type { FullBook } from '@/lib/fullbook';
import { loadSavedBook, saveBook, type OwnBook } from '@/lib/ownbooks';
import { shareTextFile } from '@/lib/share';

/**
 * Backup and restore: everything you've done in the app in one .json file you keep (Files, iCloud Drive…), and
 * restore on any device. Includes the text of books you opened or downloaded (not PDFs, which can be large).
 */

type Obj = Record<string, unknown>;
export type Backup = { app: 'deepstash-clone'; version: 1; exportedAt: string; user: Obj; books: Record<string, FullBook> };

export async function makeBackup(user: Obj): Promise<Backup> {
  const books: Record<string, FullBook> = {};
  for (const b of (user.ownBooks as OwnBook[] | undefined) ?? []) {
    if (b.kind !== 'epub') continue;
    const book = await loadSavedBook(b.id).catch(() => null);
    if (book) books[b.id] = book;
  }
  return { app: 'deepstash-clone', version: 1, exportedAt: new Date().toISOString(), user, books };
}

/** Saves the backup through the share sheet ("Save to Files") where possible, else as a download. */
export async function shareBackup(backup: Backup) {
  const name = `deepstash-backup-${backup.exportedAt.slice(0, 10)}.json`;
  const text = JSON.stringify(backup);
  const nav = globalThis.navigator as Navigator | undefined;
  if (Platform.OS === 'web' && typeof globalThis.File !== 'undefined' && nav?.canShare) {
    const file = new globalThis.File([text], name, { type: 'application/json' });
    if (nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'Deepstash backup' });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') throw e;
      }
    }
  }
  await shareTextFile(name, text, 'application/json');
}

/** Lets you pick a backup file and checks it. Resolves to null if you cancel. */
export async function pickBackup(): Promise<Backup | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['application/json', '.json', '*/*'], copyToCacheDirectory: true });
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  const text = Platform.OS === 'web' ? await (a.file ? a.file.text() : (await fetch(a.uri)).text()) : await new File(a.uri).text();
  let data: Backup;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a backup from this app.");
  }
  if (data?.app !== 'deepstash-clone' || typeof data.user !== 'object') throw new Error("That file isn't a backup from this app.");
  return data;
}

export async function restoreBooks(backup: Backup) {
  for (const [id, book] of Object.entries(backup.books ?? {})) await saveBook(id, book);
}

// ---------- merging ----------

const arr = (x: unknown) => (Array.isArray(x) ? x : []);
const obj = (x: unknown) => (x && typeof x === 'object' && !Array.isArray(x) ? (x as Obj) : {});
const unique = (xs: unknown[]) => [...new Set(xs)];
/** Items with an id: keep what's here, add what's only in the backup. */
const byId = (here: unknown, there: unknown) => {
  const mine = arr(here) as { id: string }[];
  const ids = new Set(mine.map((x) => x.id));
  return [...mine, ...(arr(there) as { id: string }[]).filter((x) => !ids.has(x.id))];
};

/**
 * Combines this device's data with a backup without losing either: lists are joined, the further reading position
 * wins, daily logs keep the larger numbers, and Brain keeps the profile with more experience.
 */
export function mergeUser(here: Obj, there: Obj): Obj {
  const out: Obj = { ...there, ...here };
  for (const k of ['followedTopicIds', 'favoriteBooks', 'likedIdeaIds', 'readIdeaIds', 'notInterested', 'downloadedBooks']) out[k] = unique([...arr(here[k]), ...arr(there[k])]);
  for (const k of ['highlights', 'clips', 'ownBooks']) out[k] = byId(here[k], there[k]);
  // Stashes with the same id keep the cards of both.
  const stashes = byId(here.stashes, there.stashes) as { id: string; ideaIds: string[] }[];
  out.stashes = stashes.map((s) => {
    const other = (arr(there.stashes) as { id: string; ideaIds: string[] }[]).find((x) => x.id === s.id);
    return other ? { ...s, ideaIds: unique([...s.ideaIds, ...other.ideaIds]) } : s;
  });
  const progress = { ...obj(there.readerProgress) } as Record<string, { fraction: number }>;
  for (const [id, p] of Object.entries(obj(here.readerProgress)) as [string, { fraction: number }][]) if (!progress[id] || p.fraction >= progress[id].fraction) progress[id] = p;
  out.readerProgress = progress;
  const log = { ...obj(there.readingLog) } as Record<string, Record<string, number>>;
  for (const [day, d] of Object.entries(obj(here.readingLog)) as [string, Record<string, number>][]) {
    const o = log[day] ?? {};
    log[day] = Object.fromEntries([...new Set([...Object.keys(d), ...Object.keys(o)])].map((f) => [f, Math.max(d[f] ?? 0, o[f] ?? 0)]));
  }
  out.readingLog = log;
  const marks = { ...obj(there.bookmarks) } as Record<string, { id: string }[]>;
  for (const [id, list] of Object.entries(obj(here.bookmarks))) marks[id] = byId(list, marks[id]);
  out.bookmarks = marks;
  out.bookProgress = { ...obj(there.bookProgress), ...obj(here.bookProgress) };
  out.finishedReaders = { ...obj(there.finishedReaders), ...obj(here.finishedReaders) };
  out.reviews = { ...obj(there.reviews), ...obj(here.reviews) };
  const s1 = obj(here.streak) as { count?: number };
  const s2 = obj(there.streak) as { count?: number };
  out.streak = (s1.count ?? 0) >= (s2.count ?? 0) ? here.streak : there.streak;
  const b1 = obj(here.brain) as { xp?: number };
  const b2 = obj(there.brain) as { xp?: number };
  out.brain = (b1.xp ?? 0) >= (b2.xp ?? 0) ? here.brain : there.brain;
  return out;
}
