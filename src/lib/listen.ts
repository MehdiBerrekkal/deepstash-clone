import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import type { FullBook } from '@/lib/fullbook';
import { detectLang } from '@/lib/lang';
import {
  NATURAL_PREFIX, isNatural, loadNatural, naturalDownloaded, naturalSupported, naturalVoicesFor, playClip, synthesize, unlockAudio, type Clip,
} from '@/lib/neuralVoice';
import type { BookPosition } from '@/lib/paginate';

/** A sentence in a book: chapter, paragraph and character range. */
export type Sentence = { chapter: number; para: number; from: number; to: number };
export type SleepTimer = { kind: 'time'; until: number } | { kind: 'chapter'; chapter: number } | null;

export const LISTEN_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
/** Long sentences are read in pieces; some engines refuse very long input. */
const MAX_PIECE = 600;

const ABBREVIATION = /(?:^|[\s(“"])(?:[A-Z]|Mr|Mrs|Ms|Dr|St|Jr|Sr|Prof|Rev|Capt|Col|Gen|Lt|Mt|No|vs|etc|viz|M|MM|Mme|Mlle|Mgr|cf|p|av|apr|J\.-C)\.\s*$/;

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
      // Starting mid-sentence (a page that begins mid-sentence) reads from there, not from the previous page.
      if (s) return { chapter: c, para: p, from: Math.max(s.from, minEnd), to: s.to };
    }
  }
  return null;
}

/**
 * The first piece to read when you press play: a long sentence is cut at an early comma (or after about eight
 * words), so the natural voice can start speaking sooner; the rest of the sentence follows as the next piece.
 */
export function leadPiece(book: FullBook, s: Sentence, language = 'en'): Sentence {
  const text = (book.chapters[s.chapter]?.paragraphs[s.para] ?? '').slice(s.from, s.to);
  const words = [...text.matchAll(/\S+\s*/g)];
  // At a chapter start the title is read first, so keep the first words fewer.
  const max = s.para === 0 && s.from === 0 ? 4 : 8;
  if (words.length <= max + 3) return s;
  let end = 0;
  for (let i = 0; i < max; i++) {
    end += words[i][0].length;
    if (i >= 2 && /[,;:—–]\s*$/.test(words[i][0])) return { ...s, to: s.from + end };
  }
  // French links words across a gap (liaison: "les‿amis"), so a French piece is only cut at punctuation.
  if (language.startsWith('fr')) {
    for (let i = max; i < Math.min(words.length - 3, 14); i++) {
      end += words[i][0].length;
      if (/[,;:—–]\s*$/.test(words[i][0])) return { ...s, to: s.from + end };
    }
    return s;
  }
  return { ...s, to: s.from + end };
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
  [/\bMM\.(?= [A-ZÉ])/g, 'Messieurs'],
  [/\bM\.(?= [A-ZÉ])/g, 'Monsieur'],
  [/\bMgr\b\.?/g, 'Monseigneur'],
  [/\bcf\./g, 'voir'],
  [/\bc\.-à-d\./g, "c'est-à-dire"],
  [/\betc\./g, 'et cetera'],
  [/\bn°\s*/g, 'numéro '],
  [/\bav\. J\.-C\./g, 'avant Jésus-Christ'],
  [/\bapr\. J\.-C\./g, 'après Jésus-Christ'],
  [/\bJ\.-C\./g, 'Jésus-Christ'],
  [/\bp\.(?= ?\d)/g, 'page'],
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

/** French Roman numerals: "XIXe siècle" → "19e siècle", "François Ier" → "François premier", "Louis XIV" → "Louis 14". */
function frenchNumerals(t: string) {
  return t
    .replace(/\b([IVXLC]{1,6})(?:e|ème|è)\b/g, (m, r: string) => (romanToNumber(r) > 0 ? `${romanToNumber(r)}e` : m))
    .replace(/\b(\p{Lu}\p{Ll}+) Ier\b/gu, '$1 premier')
    .replace(/\b(\p{Lu}\p{Ll}+) ([IVXL]{2,6}|V|X)\b/gu, (m, name: string, r: string) =>
      /^(Le|La|Les|Un|Une|De|Du|Des|Et|En|Au|Aux|Ce|Il|Elle)$/.test(name) ? m : `${name} ${romanToNumber(r)}`,
    );
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
  if (language.startsWith('fr')) {
    // « Guillemets » are heard as a slight pause, not read.
    t = frenchNumerals(t.replace(/«[\s  ]*/g, '').replace(/[\s  ]*»/g, ''));
  }
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

type Options = {
  rate: number;
  voice?: string;
  language: string;
  /** Use the natural (neural) voice when nothing is chosen and it's already downloaded. */
  preferNatural?: boolean;
  /** Called when the natural voice can't keep up or fails, so it isn't picked automatically again. */
  onNaturalFailed?: (reason: string) => void;
};

/** What to say for a sentence: a chapter's first sentence is introduced by its title. */
function spokenText(book: FullBook, s: Sentence, language: string) {
  const body = speakable(sentenceText(book, s), language);
  const opening = s.para === 0 && s.from === 0 ? speakableTitle(book.chapters[s.chapter]?.title ?? '', language) : '';
  return opening ? `${opening}. ... ${body}` : body;
}

/** How long to wait before a sentence: a beat between paragraphs and a longer one before a new chapter. */
function gapBefore(prev: Sentence, next: Sentence) {
  return next.chapter !== prev.chapter ? CHAPTER_PAUSE : next.para !== prev.para ? PARAGRAPH_PAUSE : 0;
}

const sentenceKey = (s: Sentence) => `${s.chapter}.${s.para}.${s.from}`;
/** Sentences generated ahead of the one playing, so the natural voice never waits between them. */
const LOOKAHEAD = 2;
/** If the natural voice keeps making you wait this long between sentences, the device is too slow for it. */
const STALL_MS = 1800;
const MAX_STALLS = 3;

/**
 * Reads a book aloud one sentence at a time, so the current sentence can be highlighted and followed.
 * Two engines: the device's own voices (expo-speech) everywhere, and on the web the on-device natural voices
 * (Piper, see neuralVoice.ts) for English and French books. Pausing stops speech and keeps the sentence, which also works
 * on Android (no native pause there).
 */
export function useListen(book: FullBook | null, { rate, voice: chosen, language, preferNatural, onNaturalFailed }: Options) {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sleep, setSleep] = useState<SleepTimer>(null);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  /** Download progress of the natural voice (0..1) while it loads, else null. */
  const [loading, setLoading] = useState<number | null>(null);
  const [systemOnly, setSystemOnly] = useState(false);
  /** True from pressing play until the natural voice actually starts. */
  const [preparing, setPreparing] = useState(false);
  const naturalChoices = naturalVoicesFor(language);
  const naturalAvailable = naturalChoices.length > 0 && naturalSupported();

  // Without a chosen voice, use the most natural one installed for the book's language.
  const [best, setBest] = useState<string | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    voicesFor(language).then((v) => alive && setBest(v[0]?.id));
    return () => {
      alive = false;
    };
  }, [language]);

  const naturalVoice =
    isNatural(chosen) && naturalChoices.some((v) => NATURAL_PREFIX + v.id === chosen) ? chosen! : `${NATURAL_PREFIX}${naturalChoices[0]?.id}`;
  // With no voice chosen, the natural voice is the default where it runs: the device's built-in voices sound robotic,
  // so the first Listen downloads it once (with progress shown) and every later one starts at once.
  const cached = naturalAvailable && naturalDownloaded(naturalVoice);
  const wantsNatural = isNatural(chosen) || (!chosen && preferNatural);
  const natural = wantsNatural && naturalAvailable && !systemOnly;
  const systemVoice = chosen && !isNatural(chosen) ? chosen : best;

  // System voices: speak the current sentence; when it ends, move to the next. Any change restarts it cleanly.
  useEffect(() => {
    if (!playing || !sentence || !book || natural) return;
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
      // The sleep timer stops between sentences (end of chapter, or once the time is up), never mid-word.
      if ((sleep?.kind === 'chapter' && next.chapter !== sleep.chapter) || (sleep?.kind === 'time' && Date.now() >= sleep.until)) {
        setPlaying(false);
        setSleep(null);
        return;
      }
      const gap = gapBefore(sentence, next);
      if (gap) pause = setTimeout(() => !cancelled && setSentence(next), gap / rate);
      else setSentence(next);
    };
    const text = spokenText(book, sentence, language);
    if (!text) {
      advance();
      return;
    }
    Speech.speak(text, { rate: rate * SYSTEM_RATE, voice: systemVoice, language, onDone: advance, onError: advance });
    return () => {
      cancelled = true;
      clearTimeout(pause);
      void Speech.stop();
    };
  }, [playing, sentence, book, rate, systemVoice, language, sleep, natural]);

  // Natural voice: sentences are generated a little ahead and played back to back.
  const clips = useRef(new Map<string, Promise<Clip>>());
  const stalls = useRef(0);
  const clipFor = useCallback(
    (s: Sentence) => {
      const key = `${naturalVoice}|${sentenceKey(s)}-${s.to}`;
      let clip = clips.current.get(key);
      if (!clip && book) {
        const text = spokenText(book, s, language);
        clip = synthesize(text || '.', naturalVoice);
        clip.catch(() => clips.current.delete(key));
        clips.current.set(key, clip);
        // Keep memory small: forget old clips.
        if (clips.current.size > 12) {
          const [oldest] = clips.current.keys();
          clips.current.get(oldest)?.then((c) => URL.revokeObjectURL(c.url)).catch(() => {});
          clips.current.delete(oldest);
        }
      }
      return clip!;
    },
    [book, language, naturalVoice],
  );

  useEffect(() => {
    if (!playing || !sentence || !book || !natural) return;
    let cancelled = false;
    let stop = () => {};
    let pause: ReturnType<typeof setTimeout> | undefined;
    const giveUp = (reason: string) => {
      setSystemOnly(true);
      setLoading(null);
      setNotice(reason);
      onNaturalFailed?.(reason);
    };

    (async () => {
      const t0 = Date.now();
      try {
        await loadNatural(naturalVoice, (f) => !cancelled && setLoading(f < 1 ? f : null));
        if (!cancelled) setLoading(null);
      } catch {
        if (!cancelled) giveUp("The natural voice couldn't load on this device, so a system voice is reading instead.");
        return;
      }
      let clip: Clip;
      try {
        clip = await clipFor(sentence);
      } catch {
        if (!cancelled) giveUp("The natural voice hit a problem, so a system voice is reading instead.");
        return;
      }
      if (cancelled) return;
      // Track waits between sentences (not the first one, which may include loading).
      const waited = Date.now() - t0;
      if (clips.current.size > 1 && waited > STALL_MS / rate) stalls.current += 1;
      if (stalls.current >= MAX_STALLS) {
        giveUp('This device is too slow for the natural voice at this speed, so a system voice is reading instead.');
        return;
      }
      // Queue the next sentences while this one plays.
      let ahead: Sentence | null = sentence;
      for (let i = 0; i < LOOKAHEAD && ahead; i++) {
        ahead = nextSentence(book, ahead);
        if (ahead) clipFor(ahead).catch(() => {});
      }
      const playback = playClip(clip, rate);
      setPreparing(false);
      stop = playback.stop;
      try {
        await playback.done;
      } catch {
        if (!cancelled) giveUp("Audio couldn't play here, so a system voice is reading instead.");
        return;
      }
      if (cancelled) return;
      const next = nextSentence(book, sentence);
      if (!next) {
        setPlaying(false);
        setFinished(true);
        return;
      }
      // The sleep timer stops between sentences (end of chapter, or once the time is up), never mid-word.
      if ((sleep?.kind === 'chapter' && next.chapter !== sleep.chapter) || (sleep?.kind === 'time' && Date.now() >= sleep.until)) {
        setPlaying(false);
        setSleep(null);
        return;
      }
      const gap = gapBefore(sentence, next);
      if (gap) pause = setTimeout(() => !cancelled && setSentence(next), gap / rate);
      else setSentence(next);
    })();
    return () => {
      cancelled = true;
      clearTimeout(pause);
      stop();
    };
  }, [playing, sentence, book, rate, naturalVoice, language, sleep, natural, onNaturalFailed, clipFor]);

  // Start the natural voice as soon as a book is open (it takes a few seconds), so it's ready when you press play.
  useEffect(() => {
    // Only once downloaded: the first download waits for you to press Listen.
    if (natural && cached) loadNatural(naturalVoice).catch(() => {});
  }, [natural, naturalVoice, cached]);

  /**
   * Get ready to read from a position without playing: load the natural voice and generate the first piece,
   * so pressing play starts at once. Cheap to call often; does nothing for system voices.
   */
  const warm = useCallback(
    (from: BookPosition) => {
      if (!book || !natural || !cached || playing) return;
      const s = sentenceAt(book, from);
      if (!s) return;
      loadNatural(naturalVoice)
        .then(() => clipFor(leadPiece(book, s, language)))
        .catch(() => {});
    },
    [book, natural, cached, playing, naturalVoice, clipFor, language],
  );

  // A new voice choice gets a fresh chance.
  useEffect(() => {
    stalls.current = 0;
  }, [chosen]);

  // Sleep timer by the clock.
  useEffect(() => {
    if (sleep?.kind !== 'time' || !playing) return;
    // Normally reading stops at the end of the sentence playing when time runs out (see above); this is a backstop
    // for a very long sentence.
    const t = setTimeout(() => {
      setPlaying(false);
      setSleep(null);
    }, Math.max(0, sleep.until - Date.now()) + 25000);
    return () => clearTimeout(t);
  }, [sleep, playing]);

  // Never keep talking after the reader closes.
  useEffect(() => () => void Speech.stop(), []);

  const start = useCallback(
    (from: BookPosition) => {
      if (!book) return;
      const s = sentenceAt(book, from);
      if (!s) return;
      unlockAudio();
      setFinished(false);
      setSentence(leadPiece(book, s, language));
      setPreparing(!!natural);
      setPlaying(true);
    },
    [book, natural, language],
  );
  const play = useCallback(
    (on: boolean) => {
      if (on) unlockAudio();
      setPreparing(on && !!natural);
      setPlaying(on);
    },
    [natural],
  );
  const skip = useCallback(
    (dir: 1 | -1) => {
      if (!book) return;
      unlockAudio();
      setSentence((s) => (s ? (dir === 1 ? nextSentence(book, s) ?? s : previousSentence(book, s)) : s));
    },
    [book],
  );
  const close = useCallback(() => {
    setPreparing(false);
    setPlaying(false);
    setSentence(null);
    setSleep(null);
  }, []);
  const tryNatural = useCallback(() => {
    setSystemOnly(false);
    setNotice(null);
  }, []);

  return useMemo(
    () => ({
      sentence, playing, sleep, finished, natural, naturalVoice, loading, notice, naturalAvailable, naturalCached: cached,
      preparing: preparing && playing, start, skip, close, setPlaying: play, setSleep, dismissNotice: () => setNotice(null), tryNatural, warm,
    }),
    [sentence, playing, sleep, finished, natural, naturalVoice, loading, notice, naturalAvailable, cached, preparing, start, skip, close, play, tryNatural, warm],
  );
}

let utterance = 0;

/**
 * Speak a short text (an idea card, a quiz question), stopping anything else. The language is detected when not
 * given; `voice` is the voice chosen for that language. Returns a stop function that only stops this text.
 */
export function speakOnce(text: string, onEnd: () => void, language: string = detectLang(text), voice?: string) {
  const mine = ++utterance;
  void Speech.stop();
  let stopClip = () => {};
  const spoken = speakable(text, language);
  const system = (v?: string) =>
    mine === utterance &&
    Speech.speak(spoken, { language: language.startsWith('fr') ? 'fr-FR' : 'en-US', voice: v, rate: SYSTEM_RATE, onDone: onEnd, onStopped: onEnd, onError: onEnd });
  const fallback = () => voicesFor(language).then((v) => system(v[0]?.id));
  // A chosen natural voice, or (with nothing chosen) the default one once it's downloaded.
  const defaultNatural = `${NATURAL_PREFIX}${naturalVoicesFor(language)[0]?.id}`;
  const naturalVoice = isNatural(voice) ? voice! : !voice && naturalDownloaded(defaultNatural) ? defaultNatural : null;
  // Not downloaded yet: this one is read by the device, and the natural voice downloads in the background for next time.
  if (!naturalVoice && !voice && naturalSupported() && naturalVoicesFor(language).length) loadNatural(defaultNatural).catch(() => {});
  if (naturalVoice && naturalSupported()) {
    unlockAudio();
    synthesize(spoken, naturalVoice)
      .then((clip) => {
        if (mine !== utterance) return;
        const playback = playClip(clip);
        stopClip = playback.stop;
        return playback.done.then(onEnd);
      })
      .catch(fallback);
  } else if (voice && !isNatural(voice)) system(voice);
  else void fallback();
  return () => {
    if (mine !== utterance) return;
    stopClip();
    void Speech.stop();
  };
}
