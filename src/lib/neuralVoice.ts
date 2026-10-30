import { Platform } from 'react-native';

/**
 * "Natural" voices: open neural Piper voices (VITS) running on the device in a web worker, through
 * piper-tts-web (MIT) and ONNX Runtime. They work in the web app, including on iPhone; the phone apps keep using
 * system voices. Each voice (about 63 MB) downloads once on first use and is kept by the browser.
 * Piper was chosen over Kokoro because it's several times faster: Kokoro couldn't keep up with speech on a phone.
 */

const PIPER = 'https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.5/+esm';
// Must match the onnxruntime-web version jsDelivr bundles into the import above.
const WASM_PATHS = {
  onnxWasm: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/',
  piperData: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data',
  piperWasm: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm',
};

export type NaturalVoice = { id: string; name: string; note: string; language: 'en' | 'fr'; sizeMB: number; license: string };
/** Good-sounding Piper voices, best first for each language. */
export const NATURAL_VOICES: NaturalVoice[] = [
  { id: 'en_US-hfc_female-medium', name: 'American woman', note: 'Warm, clear narrator', language: 'en', sizeMB: 63, license: 'Hi-Fi Captain, CC BY-NC-SA 4.0' },
  { id: 'en_US-hfc_male-medium', name: 'American man', note: 'Calm, steady narrator', language: 'en', sizeMB: 63, license: 'Hi-Fi Captain, CC BY-NC-SA 4.0' },
  { id: 'en_GB-cori-medium', name: 'British woman', note: 'Audiobook style', language: 'en', sizeMB: 63, license: 'LibriVox, public domain' },
  { id: 'en_GB-alba-medium', name: 'Scottish woman', note: 'Gentle and bright', language: 'en', sizeMB: 63, license: 'CSTR, CC BY 4.0' },
  { id: 'fr_FR-siwis-medium', name: 'Voix féminine', note: 'Française, claire', language: 'fr', sizeMB: 63, license: 'SIWIS, CC BY 4.0' },
  { id: 'fr_FR-upmc-medium', name: 'Voix masculine', note: 'Français, posé', language: 'fr', sizeMB: 76, license: 'UPMC Pierre, CC BY-SA 4.0' },
];
export const NATURAL_PREFIX = 'piper:';
export const isNatural = (voice?: string) => !!voice?.startsWith(NATURAL_PREFIX);
export const naturalVoicesFor = (language: string) => NATURAL_VOICES.filter((v) => language.startsWith(v.language));
export const naturalVoiceInfo = (voice?: string) => NATURAL_VOICES.find((v) => NATURAL_PREFIX + v.id === voice);

const WORKER = `
let session;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') {
      const tts = await import(${JSON.stringify(PIPER)});
      session = await tts.TtsSession.create({
        voiceId: data.voice,
        wasmPaths: ${JSON.stringify(WASM_PATHS)},
        progress: (p) => p && p.total && self.postMessage({ type: 'progress', loaded: p.loaded, total: p.total }),
      });
      self.postMessage({ type: 'ready' });
    } else if (data.type === 'generate') {
      const t0 = performance.now();
      const wav = await session.predict(data.text);
      const buffer = await wav.arrayBuffer();
      self.postMessage({ type: 'audio', id: data.id, wav: buffer, seconds: (buffer.byteLength - 44) / 2 / 22050, ms: performance.now() - t0 }, [buffer]);
    }
  } catch (e) {
    self.postMessage({ type: 'error', id: data.id, message: String((e && e.message) || e) });
  }
};
`;

type Pending = { resolve: (r: Clip) => void; reject: (e: Error) => void };
export type Clip = { url: string; seconds: number; ms: number };

// One worker holds one voice (the Piper session is single-voice); switching voices starts a fresh worker.
let worker: Worker | null = null;
let workerVoice: string | null = null;
let ready: Promise<void> | null = null;
let seq = 0;
const pending = new Map<number, Pending>();
const progress = new Set<(fraction: number) => void>();
const DOWNLOADED_KEY = 'deepstash-clone/natural-voices';

export function naturalSupported() {
  return Platform.OS === 'web' && typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
}

function downloadedList(): string[] {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(DOWNLOADED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Whether this voice has been downloaded on this device before (the browser may still evict it). */
export function naturalDownloaded(voice: string) {
  return downloadedList().includes(voice);
}

/** Downloads (first time) and starts a natural voice. onProgress gets 0..1 while downloading. */
export function loadNatural(voice: string, onProgress?: (fraction: number) => void): Promise<void> {
  if (onProgress) progress.add(onProgress);
  const done = () => onProgress && progress.delete(onProgress);
  if (ready && workerVoice === voice) {
    ready.then(done, done);
    return ready;
  }
  worker?.terminate();
  for (const job of pending.values()) job.reject(new Error('Voice changed'));
  pending.clear();
  workerVoice = voice;
  const id = voice.replace(NATURAL_PREFIX, '');
  ready = new Promise<void>((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }));
    const w = new Worker(url, { type: 'module' });
    worker = w;
    w.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        for (const p of progress) p(Math.min(0.99, data.loaded / data.total));
      } else if (data.type === 'ready') {
        for (const p of progress) p(1);
        try {
          globalThis.localStorage?.setItem(DOWNLOADED_KEY, JSON.stringify([...new Set([...downloadedList(), voice])]));
        } catch {
          // storage full or blocked: it just downloads again next time
        }
        resolve();
      } else if (data.type === 'audio') {
        const job = pending.get(data.id);
        pending.delete(data.id);
        job?.resolve({ url: URL.createObjectURL(new Blob([data.wav], { type: 'audio/wav' })), seconds: data.seconds, ms: data.ms });
      } else if (data.type === 'error') {
        const job = data.id === undefined ? null : pending.get(data.id);
        if (job) {
          pending.delete(data.id);
          job.reject(new Error(data.message));
        } else {
          if (worker === w) ready = null;
          reject(new Error(data.message));
        }
      }
    };
    w.onerror = (e) => {
      if (worker === w) ready = null;
      reject(new Error(e.message || 'The natural voice could not start.'));
    };
    w.postMessage({ type: 'load', voice: id });
  });
  ready.then(done, done);
  return ready;
}

/** Turns one sentence into audio. Requests are handled in order, so the next sentences can be queued ahead. */
export async function synthesize(text: string, voice: string): Promise<Clip> {
  await loadNatural(voice);
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker!.postMessage({ type: 'generate', id, text });
  });
}

// One audio element for all playback: iPhones only let a page play sound it has played before in a tap.
let player: HTMLAudioElement | null = null;
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';

/** Call from a tap (Listen / Play) so later sentences can play without one. */
export function unlockAudio() {
  if (Platform.OS !== 'web' || typeof Audio === 'undefined') return;
  if (!player) player = new Audio();
  // Play through the ring/silent switch like other audio apps.
  const session = (globalThis.navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session) session.type = 'playback';
  if (player.paused && !player.src.startsWith('blob:')) {
    player.src = SILENCE;
    player.play().catch(() => {});
  }
}

/** Plays a clip at a speed (pitch kept); resolves when it ends. stop() ends it early. */
export function playClip(clip: Clip, rate = 1): { done: Promise<void>; stop: () => void } {
  if (!player) player = new Audio();
  const audio = player;
  let finish: () => void = () => {};
  let fail: (e: Error) => void = () => {};
  const done = new Promise<void>((resolve, reject) => {
    finish = resolve;
    fail = reject;
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Playback failed'));
  });
  audio.defaultPlaybackRate = rate;
  audio.src = clip.url;
  audio.playbackRate = rate;
  audio.play().catch((e: Error) => fail(e));
  return {
    done,
    stop: () => {
      audio.onended = null;
      audio.pause();
      finish();
    },
  };
}
