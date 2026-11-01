import { Platform } from 'react-native';

import rendered from '@/data/card-audio.json';

/**
 * Idea cards read by a studio-quality voice (Kokoro, rendered ahead of time and served with the site as small MP3s),
 * so 🔊 sounds close to a person and starts at once with nothing to download first. Cards without a recording use
 * the live voice instead.
 */
const ids = new Set(rendered as string[]);

/** Where the site is served from ("/deepstash-clone/" on GitHub Pages, "/" locally), read from the manifest link. */
function base() {
  if (Platform.OS !== 'web') return null;
  const href = globalThis.document?.querySelector('link[rel="manifest"]')?.getAttribute('href');
  return href ? href.replace(/manifest\.webmanifest$/, '') : '/';
}

export function cardAudioUrl(ideaId: string): string | null {
  const b = base();
  return b !== null && ids.has(ideaId) ? `${b}card-audio/${encodeURIComponent(ideaId)}.mp3` : null;
}
