import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

/** Speak a word or sentence in the course's language with the device's voice. */
export function say(text: string, voice: string, rate = 0.85) {
  void Speech.stop();
  Speech.speak(text, { language: voice, rate });
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (e: { results: { 0: { transcript: string }; length: number }[] }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};
const Ctor = () =>
  Platform.OS === 'web'
    ? ((globalThis as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition ??
      (globalThis as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition)
    : undefined;

/** Speech recognition exists in Safari (iOS 14.5+) and Chrome; elsewhere speaking practice is skipped. */
export const canListen = () => !!Ctor();

/** Listens once and resolves to what was heard (best guesses first), or rejects with a reason. */
export function listenOnce(lang: string): { result: Promise<string[]>; stop: () => void } {
  const C = Ctor();
  if (!C) return { result: Promise.reject(new Error('unsupported')), stop: () => {} };
  const r = new C();
  r.lang = lang;
  r.interimResults = false;
  r.maxAlternatives = 4;
  const result = new Promise<string[]>((resolve, reject) => {
    let heard: string[] = [];
    r.onresult = (e) => {
      const res = e.results[0] as unknown as { transcript: string }[] & { length: number };
      heard = Array.from({ length: res.length }, (_, i) => res[i].transcript);
    };
    r.onerror = (e) => reject(new Error(e.error));
    r.onend = () => (heard.length ? resolve(heard) : reject(new Error('no-speech')));
  });
  r.start();
  return { result, stop: () => r.stop() };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

/** How close two phrases are, 0..1 (edit distance on letters, ignoring accents, case and punctuation). */
export function similarity(a: string, b: string) {
  const x = norm(a);
  const y = norm(b);
  if (!x.length && !y.length) return 1;
  const d = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) d[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - d[x.length][y.length] / Math.max(x.length, y.length);
}
export const sameAnswer = (a: string, b: string) => norm(a) === norm(b);
