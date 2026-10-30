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

const ABBREVIATIONS_EN: [RegExp, string][] = [
  [/\bMr\./g, 'Mister'],
  [/\bMrs\./g, 'Missus'],
  [/\bMs\./g, 'Miz'],
  [/\bDr\./g, 'Doctor'],
  [/\bSt\.(?= [A-Z])/g, 'Saint'],
  [/\bProf\./g, 'Professor'],
  [/\bRev\./g, 'Reverend'],
  [/\bCapt\./g, 'Captain'],
  [/\bCol\./g, 'Colonel'],
  [/\bGen\./g, 'General'],
  [/\bLt\./g, 'Lieutenant'],
  [/\bJr\./g, 'Junior'],
  [/\bvs\./g, 'versus'],
  [/\betc\./g, 'et cetera'],
  [/\be\.g\./g, 'for example'],
  [/\bi\.e\./g, 'that is'],
];
const ABBREVIATIONS_FR: [RegExp, string][] = [
  [/\bM\.(?= [A-ZÉ])/g, 'Monsieur'],
  [/\bMme\b\.?/g, 'Madame'],
  [/\bMlle\b\.?/g, 'Mademoiselle'],
  [/\bDr\b\.?/g, 'Docteur'],
  [/\bSt\b\.?(?=[- ][A-Z])/g, 'Saint'],
];
const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };

function romanToNumber(r: string) {
  let n = 0;
  for (let i = 0; i < r.length; i++) {
    const v = ROMAN[r[i]];
    n += v < (ROMAN[r[i + 1]] ?? 0) ? -v : v;
  }
  return n;
}

/**
 * Text as it should be heard: abbreviations spelled out, dialogue dashes and brackets turned into pauses,
 * footnote markers and decorations dropped. Works for any voice.
 */
export function speakable(text: string, language = 'en') {
  let t = text
    .replace(/\[\d+\]|\[[a-z]\]|[*†‡§¶]+|(?<=[a-z.,;!?”’])\d{1,3}(?=\s|$)/g, '') // footnote markers
    .replace(/_/g, '')
    .replace(/\s*[—–]\s*/g, ', ') // dashes become a short pause
    .replace(/\s*\(\s*/g, ', ')
    .replace(/\s*\)\s*/g, ', ')
    .replace(/…|\.\.\./g, '... ')
    .replace(/&/g, language.startsWith('fr') ? ' et ' : ' and ');
  for (const [re, word] of language.startsWith('fr') ? ABBREVIATIONS_FR : ABBREVIATIONS_EN) t = t.replace(re, word);
  return t
    .replace(/,\s*([,.;:!?])/g, '$1')
    .replace(/^[,\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "STAVE III" -> "Stave 3", "CHAPTER XII. The Ball" -> "Chapter 12. The Ball", for reading headings aloud. */
export function speakableTitle(title: string, language = 'en') {
  const t = title.replace(/\b([IVXLC]{1,7})\b(?=[.:\s]|$)/g, (m) => {
    const n = romanToNumber(m);
    return n > 0 && n < 200 && !(m === 'I' && !/^(chapter|stave|book|part|chapitre|livre|partie)\b/i.test(title)) ? String(n) : m;
  });
  const cased = t === t.toUpperCase() ? t.toLowerCase().replace(/(^|[\s.])\p{L}/gu, (c) => c.toUpperCase()) : t;
  return speakable(cased, language);
}

export type ListenVoice = { id: string; name: string; language: string; badge?: 'Premium' | 'Enhanced' | 'Natural' };

// Novelty and robotic voices that ship with Apple devices; never pick these automatically.
const NOVELTY =
  /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|hysterical|deranged|pipe organ)\b/i;
const GOOD_VOICES = /\b(ava|zoe|evan|samantha|daniel|allison|susan|tom|nathan|joelle|noelle|serena|karen|moira|tessa|kate|oliver|jamie|amélie|amelie|thomas|audrey|aurélie|aurelie|marie|google us english|google uk english)\b/i;

function grade(v: { identifier: string; name: string; quality?: string }) {
  const id = `${v.name} ${v.identifier}`;
  if (/premium/i.test(id)) return { score: 100, badge: 'Premium' as const };
  if (/\b(natural|neural|online)\b/i.test(id)) return { score: 90, badge: 'Natural' as const };
  if (/enhanced/i.test(id) || v.quality === Speech.VoiceQuality.Enhanced) return { score: 80, badge: 'Enhanced' as const };
  if (/siri/i.test(id)) return { score: 70, badge: undefined };
  if (GOOD_VOICES.test(v.name)) return { score: 50, badge: undefined };
  if (/compact/i.test(id)) return { score: 5, badge: undefined };
  return { score: 20, badge: undefined };
}

/** Voices for a language (e.g. "en", "fr"), most natural first; novelty voices are left out. */
export async function voicesFor(language: string): Promise<ListenVoice[]> {
  // On the web the voice list can stay empty forever (no voices installed), so don't wait on it for long.
  const timeout = new Promise<Speech.Voice[]>((r) => setTimeout(() => r([]), Platform.OS === 'web' ? 1500 : 5000));
  const all = await Promise.race([Speech.getAvailableVoicesAsync().catch(() => []), timeout]);
  const lang = language.toLowerCase();
  // US voices first for English and France voices for French, after quality.
  const home = lang.startsWith('fr') ? 'fr-fr' : 'en-us';
  return all
    .filter((v) => v.language?.toLowerCase().replace('_', '-').startsWith(lang) && !NOVELTY.test(v.name))
    .map((v) => ({ v, ...grade(v) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.v.language.toLowerCase().replace('_', '-') === home) - Number(a.v.language.toLowerCase().replace('_', '-') === home) ||
        a.v.name.localeCompare(b.v.name),
    )
    .map(({ v, badge }) => ({ id: v.identifier, name: v.name.replace(/\s*\((premium|enhanced)\)/i, ''), language: v.language, badge }));
}

/** System speech sounds less rushed slightly below its default speed. */
const SYSTEM_RATE = 0.95;
/** Breathing room between paragraphs and before a new chapter, in ms. */
const PARAGRAPH_PAUSE = 350;
const CHAPTER_PAUSE = 900;

type Options = { rate: number; voice?: string; language: string };

/**
 * Reads a book aloud one sentence at a time, so the current sentence can be highlighted and followed.
 * Pausing stops speech and keeps the sentence, which also works on Android (no native pause there).
 */
export function useListen(book: FullBook | null, { rate, voice: chosen, language }: Options) {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sleep, setSleep] = useState<SleepTimer>(null);
  const [finished, setFinished] = useState(false);
  // Without a chosen voice, use the most natural one installed for the book's language.
  const [best, setBest] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (chosen) return;
    let alive = true;
    voicesFor(language).then((v) => alive && setBest(v[0]?.id));
    return () => {
      alive = false;
    };
  }, [chosen, language]);
  const voice = chosen ?? best;

  // Speak the current sentence; when it ends, move to the next. Any change (pause, speed, voice) restarts it cleanly.
  useEffect(() => {
    if (!playing || !sentence || !book) return;
    let cancelled = false;
    let pause: ReturnType<typeof setTimeout> | undefined;
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
      // A beat between paragraphs and a longer one before a new chapter, like a person reading.
      const gap = next.chapter !== sentence.chapter ? CHAPTER_PAUSE : next.para !== sentence.para ? PARAGRAPH_PAUSE : 0;
      if (gap) pause = setTimeout(() => !cancelled && setSentence(next), gap / rate);
      else setSentence(next);
    };
    const body = speakable(sentenceText(book, sentence), language);
    // A chapter's first sentence is introduced by its title.
    const opening = sentence.para === 0 && sentence.from === 0 ? speakableTitle(book.chapters[sentence.chapter]?.title ?? '', language) : '';
    const text = opening ? `${opening}. ... ${body}` : body;
    if (!text) {
      advance();
      return;
    }
    Speech.speak(text, { rate: rate * SYSTEM_RATE, voice, language, onDone: advance, onError: advance });
    return () => {
      cancelled = true;
      clearTimeout(pause);
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
export function speakOnce(text: string, onEnd: () => void, language = 'en', voice?: string) {
  const mine = ++utterance;
  void Speech.stop();
  const go = (v?: string) =>
    mine === utterance && Speech.speak(speakable(text, language), { language, voice: v, rate: SYSTEM_RATE, onDone: onEnd, onStopped: onEnd, onError: onEnd });
  if (voice) go(voice);
  else voicesFor(language).then((v) => go(v[0]?.id));
  return () => {
    if (mine === utterance) void Speech.stop();
  };
}
