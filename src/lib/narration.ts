import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import ids from '@/data/librivox-ids.json';
import type { FullBook } from '@/lib/fullbook';
import type { Sentence, SleepTimer } from '@/lib/listen';
import type { BookPosition } from '@/lib/paginate';

/**
 * Human narration: free public-domain audiobooks recorded by LibriVox volunteers, streamed from the Internet Archive.
 * The recordings were matched to our books ahead of time (scripts/librivox.js); the full list of chapters is loaded
 * only when a book is opened. Pages follow the narrator approximately: by chapter when the recording's sections
 * line up with ours, otherwise in proportion to the length of the text.
 */

export type Narration = { project: string; url: string; readers: string[]; solo: boolean; secs: number; sections: { t: string; u: string; s: number; r?: string }[] };

const withNarration = new Set(ids as string[]);
export const hasNarration = (classicId?: string) => !!classicId && withNarration.has(classicId);

let all: Promise<Record<string, Narration>> | null = null;
export function loadNarration(classicId: string): Promise<Narration | null> {
  all ??= import('@/data/librivox.json').then((m) => (m.default ?? m) as unknown as Record<string, Narration>);
  return all.then((d) => d[classicId] ?? null).catch(() => null);
}

const charsOf = (book: FullBook, c: number) => book.chapters[c].paragraphs.reduce((n, p) => n + p.length + 1, 0);

/** The text position a fraction (0..1) of the way through a chapter. */
function positionIn(book: FullBook, chapter: number, f: number): BookPosition {
  const paras = book.chapters[chapter]?.paragraphs ?? [];
  let target = Math.max(0, f) * charsOf(book, chapter);
  for (let p = 0; p < paras.length; p++) {
    if (target <= paras[p].length) return { chapter, para: p, char: Math.floor(target) };
    target -= paras[p].length + 1;
  }
  return { chapter, para: Math.max(0, paras.length - 1), char: 0 };
}
function fractionIn(book: FullBook, pos: BookPosition) {
  const paras = book.chapters[pos.chapter]?.paragraphs ?? [];
  let before = 0;
  for (let p = 0; p < pos.para && p < paras.length; p++) before += paras[p].length + 1;
  return (before + pos.char) / Math.max(1, charsOf(book, pos.chapter));
}

/** Maps between text positions and (section, seconds) in the recording. */
function makeMap(book: FullBook, n: Narration) {
  const secs = n.sections.map((s) => s.s || n.secs / n.sections.length || 600);
  // Chapters that hold real text (skip tiny title or contents pages) when lining up with the recording.
  const textChapters = book.chapters.map((_, i) => i).filter((i) => charsOf(book, i) > 400);
  const byChapter = n.sections.length === book.chapters.length ? book.chapters.map((_, i) => i) : n.sections.length === textChapters.length ? textChapters : null;
  if (byChapter) {
    return {
      toAudio: (pos: BookPosition) => {
        let i = byChapter.findIndex((c) => c >= pos.chapter);
        if (i < 0) i = byChapter.length - 1;
        const f = byChapter[i] === pos.chapter ? fractionIn(book, pos) : 0;
        return { section: i, time: f * secs[i] };
      },
      toText: (section: number, time: number) => positionIn(book, byChapter[section] ?? 0, time / secs[section]),
    };
  }
  // Otherwise: the same share of the book as of the recording.
  const chapterChars = book.chapters.map((_, i) => charsOf(book, i));
  const totalChars = chapterChars.reduce((a, b) => a + b, 0);
  const totalSecs = secs.reduce((a, b) => a + b, 0);
  return {
    toAudio: (pos: BookPosition) => {
      const before = chapterChars.slice(0, pos.chapter).reduce((a, b) => a + b, 0) + fractionIn(book, pos) * chapterChars[pos.chapter];
      let t = (before / totalChars) * totalSecs;
      let i = 0;
      while (i < secs.length - 1 && t > secs[i]) t -= secs[i++];
      return { section: i, time: t };
    },
    toText: (section: number, time: number) => {
      let chars = ((secs.slice(0, section).reduce((a, b) => a + b, 0) + time) / totalSecs) * totalChars;
      let c = 0;
      while (c < chapterChars.length - 1 && chars > chapterChars[c]) chars -= chapterChars[c++];
      return positionIn(book, c, chars / chapterChars[c]);
    },
  };
}

/**
 * Plays a book's human narration. Exposes the same shape the reader uses for the synthetic voice (a current
 * "sentence" to follow, play/pause, skip, sleep), so the player bar and page-following work for both.
 */
export function useNarration(book: FullBook | null, classicId: string | undefined, rate: number) {
  const [entry, setEntry] = useState<Narration | null>(null);
  const [position, setPosition] = useState<Sentence | null>(null);
  const [playing, setPlayingState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState(0);
  const [sleep, setSleep] = useState<SleepTimer>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const current = useRef({ section: 0 });

  useEffect(() => {
    let alive = true;
    if (classicId && hasNarration(classicId)) loadNarration(classicId).then((n) => alive && setEntry(n));
    return () => {
      alive = false;
    };
  }, [classicId]);
  const map = useMemo(() => (book && entry ? makeMap(book, entry) : null), [book, entry]);
  const available = Platform.OS === 'web' && !!entry && !!map;

  const el = () => {
    if (!audio.current) {
      const a = new Audio();
      a.preload = 'auto';
      audio.current = a;
    }
    return audio.current;
  };

  const play = useCallback(
    (sec: number, time: number) => {
      if (!entry) return;
      const a = el();
      const src = entry.sections[sec]?.u;
      if (!src) return;
      current.current.section = sec;
      setSection(sec);
      setLoading(true);
      if (a.src !== src) a.src = src;
      const seek = () => {
        try {
          a.currentTime = Math.max(0, time);
        } catch {
          // not seekable yet
        }
      };
      if (a.readyState >= 1) seek();
      else a.addEventListener('loadedmetadata', seek, { once: true });
      a.playbackRate = rate;
      a.play().then(
        () => setPlayingState(true),
        () => setPlayingState(false),
      );
    },
    [entry, rate],
  );

  // Follow the narrator: the text position moves with the audio, and the next section starts on its own.
  useEffect(() => {
    if (!map || !entry) return;
    const a = el();
    const onTime = () => {
      const pos = map.toText(current.current.section, a.currentTime);
      setPosition((old) => (old && old.chapter === pos.chapter && old.para === pos.para ? old : { chapter: pos.chapter, para: pos.para, from: pos.char, to: pos.char + 1 }));
      if (sleep?.kind === 'time' && Date.now() >= sleep.until) {
        a.pause();
        setSleep(null);
      }
    };
    const onPlaying = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onPause = () => setPlayingState(false);
    const onEnded = () => {
      const next = current.current.section + 1;
      if (sleep?.kind === 'chapter') {
        setSleep(null);
        setPlayingState(false);
        return;
      }
      if (next < entry.sections.length) play(next, 0);
      else setPlayingState(false);
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('playing', onPlaying);
    a.addEventListener('waiting', onWaiting);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('playing', onPlaying);
      a.removeEventListener('waiting', onWaiting);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
    };
  }, [map, entry, sleep, play]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  // Lock-screen and headphone controls.
  useEffect(() => {
    const ms = (globalThis.navigator as Navigator | undefined)?.mediaSession;
    if (!ms || !entry || !book || !playing) return;
    ms.metadata = new MediaMetadata({ title: book.title, artist: `Read by ${entry.solo ? entry.readers[0] : 'LibriVox volunteers'}`, album: entry.sections[section]?.t ?? '' });
    const a = el();
    ms.setActionHandler('play', () => void a.play());
    ms.setActionHandler('pause', () => a.pause());
    ms.setActionHandler('seekbackward', () => (a.currentTime = Math.max(0, a.currentTime - 15)));
    ms.setActionHandler('seekforward', () => (a.currentTime = a.currentTime + 30));
  }, [entry, book, playing, section]);

  // Stop when the reader closes.
  useEffect(() => () => audio.current?.pause(), []);

  const start = useCallback(
    (from: BookPosition) => {
      if (!map) return;
      const { section: s, time } = map.toAudio(from);
      setPosition({ chapter: from.chapter, para: from.para, from: from.char, to: from.char + 1 });
      play(s, time);
    },
    [map, play],
  );
  const setPlaying = useCallback(
    (on: boolean) => {
      const a = el();
      if (on) a.play().then(() => setPlayingState(true), () => setPlayingState(false));
      else a.pause();
    },
    [],
  );
  /** Back 15 seconds, or forward 30, like podcast apps. */
  const skip = useCallback((dir: 1 | -1) => {
    const a = el();
    a.currentTime = Math.max(0, a.currentTime + (dir === 1 ? 30 : -15));
  }, []);
  const close = useCallback(() => {
    el().pause();
    setPlayingState(false);
    setPosition(null);
    setSleep(null);
  }, []);

  return {
    available,
    entry,
    sentence: position,
    playing,
    preparing: loading && playing,
    sectionTitle: entry?.sections[section]?.t ?? '',
    reader: entry ? (entry.solo ? entry.readers[0] : `${entry.readers.length} volunteers`) : '',
    sleep,
    setSleep,
    start,
    setPlaying,
    skip,
    close,
  };
}
