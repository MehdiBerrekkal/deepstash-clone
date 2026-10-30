import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { FullBook } from '@/lib/fullbook';
import type { BookPosition } from '@/lib/paginate';

/** A sentence in a book: chapter, paragraph and character range. */
export type Sentence = { chapter: number; para: number; from: number; to: number };
export type SleepTimer = { kind: 'time'; until: number } | { kind: 'chapter'; chapter: number } | null;

export const LISTEN_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
/** Long sentences are read in pieces; some engines refuse very long input. */
const MAX_PIECE = 600;

const ABBREVIATION = /(?:^|[\s(“"])(?:[A-Z]|Mr|Mrs|Ms|Dr|St|Jr|Sr|Prof|Rev|Capt|Col|Gen|Lt|Mt|No|vs|etc|viz|M|Mme|Mlle)\.\s*$/;

const sentenceCache = new WeakMap<object, Map<string, { from: number; to: number }[]>>();

/** Splits a paragraph into sentence ranges, keeping closing quotes and brackets with their sentence. */
export function splitSentences(text: string): { from: number; to: number }[] {
  const out: { from: number; to: number }[] = [];
  const re = /[^.!?…]+(?:[.!?…]+["'”’»)\]]*|$)\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && m[0].length) {
    let from = m.index;
    const end = m.index + m[0].length;
    // Break runaway sentences at a comma, semicolon or space so each piece stays speakable.
    while (end - from > MAX_PIECE) {
      const chunk = text.slice(from, from + MAX_PIECE);
      const cut = Math.max(chunk.lastIndexOf('; '), chunk.lastIndexOf(', '), chunk.lastIndexOf(' '));
      const to = from + (cut > MAX_PIECE * 0.4 ? cut + 2 : MAX_PIECE);
      out.push({ from, to });
      from = to;
    }
    if (text.slice(from, end).trim()) out.push({ from, to: end });
  }
  // Initials and titles ("C. D.", "Mr. Fogg") don't end a sentence: join them to what follows.
  for (let i = out.length - 2; i >= 0; i--) {
    if (ABBREVIATION.test(text.slice(out[i].from, out[i].to)) && out[i + 1].to - out[i].from <= MAX_PIECE) {
      out.splice(i, 2, { from: out[i].from, to: out[i + 1].to });
    }
  }
  return out;
}

function sentencesOf(book: FullBook, chapter: number, para: number) {
  let byPara = sentenceCache.get(book);
  if (!byPara) sentenceCache.set(book, (byPara = new Map()));
  const key = `${chapter}:${para}`;
  let list = byPara.get(key);
  if (!list) byPara.set(key, (list = splitSentences(book.chapters[chapter]?.paragraphs[para] ?? '')));
  return list;
}

/** The first sentence that ends after a position, moving on to later paragraphs and chapters if needed. */
export function sentenceAt(book: FullBook, pos: BookPosition): Sentence | null {
  for (let c = pos.chapter; c < book.chapters.length; c++) {
    const paras = book.chapters[c].paragraphs;
    for (let p = c === pos.chapter ? pos.para : 0; p < paras.length; p++) {
      const minEnd = c === pos.chapter && p === pos.para ? pos.char : 0;
      const s = sentencesOf(book, c, p).find((r) => r.to > minEnd);
      if (s) return { chapter: c, para: p, ...s };
    }
  }
  return null;
}

export function nextSentence(book: FullBook, s: Sentence): Sentence | null {
  return sentenceAt(book, { chapter: s.chapter, para: s.para, char: s.to });
}

export function previousSentence(book: FullBook, s: Sentence): Sentence | null {
  const here = sentencesOf(book, s.chapter, s.para);
  const i = here.findIndex((r) => r.from === s.from);
  if (i > 0) return { chapter: s.chapter, para: s.para, ...here[i - 1] };
  for (let c = s.chapter, p = s.para - 1; c >= 0; c--, p = (book.chapters[c]?.paragraphs.length ?? 0) - 1) {
    for (; p >= 0; p--) {
      const list = sentencesOf(book, c, p);
      if (list.length) return { chapter: c, para: p, ...list[list.length - 1] };
    }
  }
  return s;
}

export function sentenceText(book: FullBook, s: Sentence) {
  return (book.chapters[s.chapter]?.paragraphs[s.para] ?? '').slice(s.from, s.to).replace(/\s+/g, ' ').trim();
}

export type ListenVoice = { id: string; name: string; language: string };

/** Voices for a language (e.g. "en", "fr"), best first. */
export async function voicesFor(language: string): Promise<ListenVoice[]> {
  // On the web the voice list can stay empty forever (no voices installed), so don't wait on it for long.
  const timeout = new Promise<Speech.Voice[]>((r) => setTimeout(() => r([]), Platform.OS === 'web' ? 1500 : 5000));
  const all = await Promise.race([Speech.getAvailableVoicesAsync().catch(() => []), timeout]);
  const lang = language.toLowerCase();
  return all
    .filter((v) => v.language?.toLowerCase().replace('_', '-').startsWith(lang))
    .sort((a, b) => Number(b.quality === Speech.VoiceQuality.Enhanced) - Number(a.quality === Speech.VoiceQuality.Enhanced) || a.name.localeCompare(b.name))
    .map((v) => ({ id: v.identifier, name: v.name, language: v.language }));
}

type Options = { rate: number; voice?: string; language: string };

/**
 * Reads a book aloud one sentence at a time, so the current sentence can be highlighted and followed.
 * Pausing stops speech and keeps the sentence, which also works on Android (no native pause there).
 */
export function useListen(book: FullBook | null, { rate, voice, language }: Options) {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sleep, setSleep] = useState<SleepTimer>(null);
  const [finished, setFinished] = useState(false);

  // Speak the current sentence; when it ends, move to the next. Any change (pause, speed, voice) restarts it cleanly.
  useEffect(() => {
    if (!playing || !sentence || !book) return;
    let cancelled = false;
    const advance = () => {
      if (cancelled) return;
      const next = nextSentence(book, sentence);
      if (!next) {
        setPlaying(false);
        setFinished(true);
        return;
      }
      if (sleep?.kind === 'chapter' && next.chapter !== sleep.chapter) {
        setPlaying(false);
        setSleep(null);
      }
      setSentence(next);
    };
    const text = sentenceText(book, sentence);
    if (!text) {
      advance();
      return;
    }
    Speech.speak(text, { rate, voice, language, onDone: advance, onError: advance });
    return () => {
      cancelled = true;
      void Speech.stop();
    };
  }, [playing, sentence, book, rate, voice, language, sleep]);

  // Sleep timer by the clock.
  useEffect(() => {
    if (sleep?.kind !== 'time' || !playing) return;
    const t = setTimeout(() => {
      setPlaying(false);
      setSleep(null);
    }, Math.max(0, sleep.until - Date.now()));
    return () => clearTimeout(t);
  }, [sleep, playing]);

  // Never keep talking after the reader closes.
  useEffect(() => () => void Speech.stop(), []);

  const start = useCallback(
    (from: BookPosition) => {
      if (!book) return;
      const s = sentenceAt(book, from);
      if (!s) return;
      setFinished(false);
      setSentence(s);
      setPlaying(true);
    },
    [book],
  );
  const skip = useCallback(
    (dir: 1 | -1) => {
      if (!book) return;
      setSentence((s) => (s ? (dir === 1 ? nextSentence(book, s) ?? s : previousSentence(book, s)) : s));
    },
    [book],
  );
  const close = useCallback(() => {
    setPlaying(false);
    setSentence(null);
    setSleep(null);
  }, []);

  return useMemo(
    () => ({ sentence, playing, sleep, finished, start, skip, close, setPlaying, setSleep }),
    [sentence, playing, sleep, finished, start, skip, close],
  );
}

let utterance = 0;

/** Speak a short text (an idea card), stopping anything else. Returns a stop function that only stops this text. */
export function speakOnce(text: string, onEnd: () => void, language = 'en') {
  const mine = ++utterance;
  void Speech.stop();
  Speech.speak(text, { language, onDone: onEnd, onStopped: onEnd, onError: onEnd });
  return () => {
    if (mine === utterance) void Speech.stop();
  };
}
