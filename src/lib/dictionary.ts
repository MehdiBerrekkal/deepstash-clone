import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meaning = { partOfSpeech: string; definitions: { definition: string; example?: string }[]; synonyms: string[] };
export type Definition = { word: string; phonetic?: string; audio?: string; meanings: Meaning[]; source?: string };
export type Lookup = { status: 'found'; entry: Definition } | { status: 'missing' } | { status: 'offline' };

const CACHE_KEY = 'deepstash-clone/dictionary/';
const memory = new Map<string, Lookup>();

/** "Ghostly," -> "ghostly"; keeps inner apostrophes and hyphens. */
export function cleanWord(raw: string) {
  return raw
    .replace(/[’‘]/g, "'")
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
    .toLowerCase();
}

/** Simple English stems to try when the exact form isn't in the dictionary ("walked" -> "walk"). */
function stems(word: string) {
  const out: string[] = [];
  const add = (w: string) => w.length > 2 && !out.includes(w) && out.push(w);
  if (word.endsWith("'s")) add(word.slice(0, -2));
  if (word.endsWith('ies')) add(`${word.slice(0, -3)}y`);
  if (word.endsWith('es')) add(word.slice(0, -2));
  if (word.endsWith('s')) add(word.slice(0, -1));
  if (word.endsWith('ied')) add(`${word.slice(0, -3)}y`);
  if (word.endsWith('ed')) {
    add(word.slice(0, -2));
    add(word.slice(0, -1));
  }
  if (word.endsWith('ing')) {
    add(word.slice(0, -3));
    add(`${word.slice(0, -3)}e`);
  }
  if (word.endsWith('ly')) add(word.slice(0, -2));
  return out;
}

type ApiEntry = {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings?: { partOfSpeech: string; definitions: { definition: string; example?: string }[]; synonyms?: string[] }[];
};

async function fetchEntry(word: string): Promise<Lookup> {
  let res: Response | null = null;
  // The free dictionary API has frequent hiccups (5xx), so try twice before giving up on it.
  for (let attempt = 0; attempt < 2 && (!res || res.status >= 500); attempt++) {
    res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`).catch(() => null);
  }
  if (!res) return { status: 'offline' };
  if (res.status === 404) return { status: 'missing' };
  if (!res.ok) return { status: 'offline' };
  const data = (await res.json()) as ApiEntry[];
  // The API returns one entry per etymology; merge them into one card.
  const meanings: Meaning[] = [];
  for (const e of data) {
    for (const m of e.meanings ?? []) {
      const same = meanings.find((x) => x.partOfSpeech === m.partOfSpeech);
      const defs = m.definitions.slice(0, 4).map((d) => ({ definition: d.definition, example: d.example }));
      if (same) same.definitions.push(...defs);
      else meanings.push({ partOfSpeech: m.partOfSpeech, definitions: defs, synonyms: (m.synonyms ?? []).slice(0, 6) });
    }
  }
  const phonetics = data.flatMap((e) => e.phonetics ?? []);
  return {
    status: 'found',
    entry: {
      word: data[0]?.word ?? word,
      phonetic: data.find((e) => e.phonetic)?.phonetic ?? phonetics.find((p) => p.text)?.text,
      audio: phonetics.find((p) => p.audio)?.audio || undefined,
      meanings: meanings.map((m) => ({ ...m, definitions: m.definitions.slice(0, 4) })),
    },
  };
}

type WikiSense = { partOfSpeech: string; definitions: { definition: string; parsedExamples?: { example: string }[] }[] };

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

/** English Wiktionary's definitions of a word in a language (it defines French words in English too). */
async function fetchWiktionary(word: string, language: string): Promise<Lookup> {
  const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`).catch(() => null);
  if (!res) return { status: 'offline' };
  if (res.status === 404) return { status: 'missing' };
  if (!res.ok) return { status: 'offline' };
  const data = (await res.json()) as Record<string, WikiSense[]>;
  const senses = data[language.slice(0, 2)] ?? [];
  const meanings: Meaning[] = senses
    .map((m) => ({
      partOfSpeech: m.partOfSpeech.toLowerCase(),
      definitions: m.definitions
        .map((d) => ({ definition: stripHtml(d.definition), example: d.parsedExamples?.[0] ? stripHtml(d.parsedExamples[0].example) : undefined }))
        .filter((d) => d.definition)
        .slice(0, 4),
      synonyms: [],
    }))
    .filter((m) => m.definitions.length);
  return meanings.length ? { status: 'found', entry: { word, meanings, source: 'Wiktionary' } } : { status: 'missing' };
}

/**
 * Looks up a word: English through the free dictionary API (with simple stemming) and Wiktionary as a fallback,
 * other languages through Wiktionary. Answers are cached on the device so repeat lookups work offline.
 */
export async function define(raw: string, language = 'en'): Promise<Lookup> {
  const word = cleanWord(raw);
  if (!word) return { status: 'missing' };
  const key = `${language.slice(0, 2)}:${word}`;
  if (memory.has(key)) return memory.get(key)!;
  const cached = await AsyncStorage.getItem(CACHE_KEY + key).catch(() => null);
  if (cached) {
    const hit = JSON.parse(cached) as Lookup;
    memory.set(key, hit);
    return hit;
  }
  let result: Lookup = { status: 'missing' };
  if (language.startsWith('en')) {
    result = await fetchEntry(word);
    for (const stem of result.status === 'missing' ? stems(word) : []) {
      const next = await fetchEntry(stem);
      if (next.status !== 'missing') {
        result = next;
        break;
      }
    }
  }
  if (result.status !== 'found') {
    const wiki = await fetchWiktionary(word, language);
    if (wiki.status === 'found' || result.status === 'missing' || !language.startsWith('en')) result = wiki;
  }
  // Only cache real answers; "offline" should be retried next time.
  if (result.status !== 'offline') {
    memory.set(key, result);
    AsyncStorage.setItem(CACHE_KEY + key, JSON.stringify(result)).catch(() => {});
  }
  return result;
}

export const wiktionaryUrl = (word: string, language: string) =>
  `https://${language.startsWith('fr') ? 'fr' : 'en'}.wiktionary.org/wiki/${encodeURIComponent(cleanWord(word))}`;
