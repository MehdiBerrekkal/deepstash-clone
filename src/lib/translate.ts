import AsyncStorage from '@react-native-async-storage/async-storage';

import { cleanWord } from '@/lib/dictionary';

/** Languages a word can be translated into, with their names in that language. */
export const TRANSLATE_TO = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
] as const;
export type TargetLang = (typeof TRANSLATE_TO)[number]['code'];

export type Translation = {
  /** The best single translation. */
  main: string;
  /** Other translations grouped by part of speech ("adjective": ["spectral", …]), when the service knows them. */
  senses: { partOfSpeech: string; terms: string[] }[];
};
export type TranslationLookup = { status: 'found'; entry: Translation } | { status: 'missing' } | { status: 'offline' };

const CACHE_KEY = 'deepstash-clone/translate/';
const TARGET_KEY = 'deepstash-clone/translate-target';
const memory = new Map<string, TranslationLookup>();

/** The language the reader last chose to translate into, or a sensible default: French for English books, English otherwise. */
export async function savedTarget(bookLanguage: string, uiLanguage: string): Promise<TargetLang> {
  const saved = (await AsyncStorage.getItem(TARGET_KEY).catch(() => null)) as TargetLang | null;
  if (saved && TRANSLATE_TO.some((l) => l.code === saved)) return saved;
  const book = bookLanguage.slice(0, 2);
  if (uiLanguage !== book && TRANSLATE_TO.some((l) => l.code === uiLanguage)) return uiLanguage as TargetLang;
  return book === 'fr' ? 'en' : 'fr';
}

export const saveTarget = (lang: TargetLang) => AsyncStorage.setItem(TARGET_KEY, lang).catch(() => {});

type GtxResponse = [[string, string, ...unknown[]][] | null, [string, string[], ...unknown[]][] | null, ...unknown[]];

/** Google Translate's public web endpoint: a main translation plus dictionary alternatives for single words. */
async function fromGoogle(word: string, from: string, to: string): Promise<TranslationLookup> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&q=${encodeURIComponent(word)}`;
  const res = await fetch(url).catch(() => null);
  if (!res?.ok) return { status: 'offline' };
  const data = (await res.json().catch(() => null)) as GtxResponse | null;
  const main = (data?.[0] ?? []).map((p) => p[0]).join('').trim();
  if (!main) return { status: 'missing' };
  const senses = (data?.[1] ?? [])
    .map(([partOfSpeech, terms]) => ({ partOfSpeech, terms: terms.filter((t) => t.toLowerCase() !== main.toLowerCase()).slice(0, 5) }))
    .filter((s) => s.terms.length || s.partOfSpeech);
  // Same word back means the service didn't know it (a name, an old spelling…).
  if (main.toLowerCase() === word.toLowerCase() && !senses.length) return { status: 'missing' };
  return { status: 'found', entry: { main, senses } };
}

/** MyMemory, a free translation memory, as a fallback. */
async function fromMyMemory(word: string, from: string, to: string): Promise<TranslationLookup> {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${from}|${to}`).catch(() => null);
  if (!res?.ok) return { status: 'offline' };
  const data = (await res.json().catch(() => null)) as { responseData?: { translatedText?: string } } | null;
  const main = data?.responseData?.translatedText?.trim();
  if (!main || main.toLowerCase() === word.toLowerCase()) return { status: 'missing' };
  return { status: 'found', entry: { main, senses: [] } };
}

/** Translates one word from a book's language. Answers are cached on the device, so repeat look-ups work offline. */
export async function translateWord(raw: string, from: string, to: TargetLang): Promise<TranslationLookup> {
  const word = cleanWord(raw);
  const source = from.slice(0, 2);
  if (!word) return { status: 'missing' };
  const key = `${source}>${to}:${word}`;
  if (memory.has(key)) return memory.get(key)!;
  const cached = await AsyncStorage.getItem(CACHE_KEY + key).catch(() => null);
  if (cached) {
    const hit = JSON.parse(cached) as TranslationLookup;
    memory.set(key, hit);
    return hit;
  }
  let result = await fromGoogle(word, source, to);
  if (result.status !== 'found') {
    const next = await fromMyMemory(word, source, to);
    if (next.status === 'found' || result.status === 'offline') result = next;
  }
  if (result.status !== 'offline') {
    memory.set(key, result);
    AsyncStorage.setItem(CACHE_KEY + key, JSON.stringify(result)).catch(() => {});
  }
  return result;
}
