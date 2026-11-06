import { useState } from 'react';
import { Image, Text, type StyleProp, type ImageStyle } from 'react-native';

import FLUENT from '@/data/learn/fluent3d.json';

const MAP = FLUENT as Record<string, string>;
const BASE = 'https://cdn.jsdelivr.net/npm/@lobehub/fluent-emoji-3d@1.1.0/assets/';

/** The 3D picture of an emoji (Microsoft Fluent Emoji, MIT); falls back to the plain emoji. */
export function Pic({ emoji, size = 64, style }: { emoji?: string; size?: number; style?: StyleProp<ImageStyle> }) {
  const [failed, setFailed] = useState(false);
  if (!emoji) return null;
  const file = MAP[emoji];
  if (!file || failed) return <Text style={{ fontSize: size * 0.8, lineHeight: size, textAlign: 'center', width: size }}>{emoji}</Text>;
  return <Image accessibilityIgnoresInvertColors source={{ uri: `${BASE}${file}.webp` }} onError={() => setFailed(true)} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export const hasPic = (emoji?: string) => !!emoji && !!MAP[emoji];
/** Warm the cache for the next pictures of a lesson. */
export function prefetchPics(emojis: (string | undefined)[]) {
  for (const e of emojis) if (e && MAP[e]) void Image.prefetch(`${BASE}${MAP[e]}.webp`).catch(() => {});
}
