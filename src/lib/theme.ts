import { Platform, type ViewStyle } from 'react-native';

import type { CardKind } from '@/lib/types';

export type Palette = {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  danger: string;
};
export type Scheme = 'light' | 'dark';
export type Appearance = 'auto' | Scheme;

export const palettes: Record<Scheme, Palette> = {
  dark: {
    background: '#0F1115',
    surface: '#1A1D24',
    surfaceRaised: '#232731',
    border: '#2A2E37',
    text: '#F4F1EA',
    muted: '#A3A7B1',
    accent: '#F2B84B',
    onAccent: '#1A1300',
    danger: '#FF7A7A',
  },
  // Warm paper tones; the accent is darkened so it keeps its contrast as text on light backgrounds.
  light: {
    background: '#F6F2EA',
    surface: '#FFFFFF',
    surfaceRaised: '#EEE8DC',
    border: '#DED6C6',
    text: '#1E1A16',
    muted: '#6E665C',
    accent: '#B9770E',
    onAccent: '#FFFFFF',
    danger: '#C23B3B',
  },
};

/**
 * Text colours for the always-dark topic-coloured cards and covers, whatever the app's appearance.
 * Use these (not colors.text) on anything whose background is a topic colour.
 */
export const onCard = { text: '#F4F1EA', muted: 'rgba(244,241,234,0.75)' };

const KEYS = Object.keys(palettes.dark) as (keyof Palette)[];

/**
 * Put on a topic-coloured card or cover: inside it, colors.text and colors.muted become the light card colours,
 * so cards look the same in light and dark mode (web; phones are always dark).
 */
export const onCardScope: ViewStyle =
  Platform.OS === 'web' ? ({ '--c-text': onCard.text, '--c-muted': onCard.muted } as unknown as ViewStyle) : {};

/**
 * App colours. In the browser they are CSS variables, so switching light/dark recolours every screen at once
 * (see applyScheme); on phones they are the dark palette.
 */
export const colors: Palette =
  Platform.OS === 'web' ? (Object.fromEntries(KEYS.map((k) => [k, `var(--c-${k})`])) as Palette) : palettes.dark;

let current: Scheme = 'dark';
export const currentScheme = () => current;

/** Sets the CSS variables for a scheme (web only). */
export function applyScheme(scheme: Scheme) {
  current = scheme;
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const root = document.documentElement.style;
  for (const k of KEYS) root.setProperty(`--c-${k}`, palettes[scheme][k]);
  root.setProperty('color-scheme', scheme);
}

/** The appearance saved in the app's state, read straight from storage so the first paint has the right colours. */
function savedAppearance(): Appearance {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem('deepstash-clone/user-state/v1') ?? '{}').appearance;
    return saved === 'light' || saved === 'dark' ? saved : 'auto';
  } catch {
    return 'auto';
  }
}

export function resolveScheme(appearance: Appearance, system: Scheme | null | undefined): Scheme {
  return appearance === 'auto' ? (system === 'light' ? 'light' : 'dark') : appearance;
}

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const system = globalThis.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyScheme(resolveScheme(savedAppearance(), system));
}

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' });

export const sourceKindLabel = {
  book: '📖 Book',
  article: '📰 Article',
  podcast: '🎧 Podcast',
  video: '🎬 Video',
} as const;

export const cardKinds: { id: CardKind; label: string; plural: string; emoji: string }[] = [
  { id: 'idea', label: 'Book idea', plural: 'Book ideas', emoji: '📖' },
  { id: 'quote', label: 'Quote', plural: 'Quotes', emoji: '❝' },
  { id: 'poem', label: 'Poem', plural: 'Poems', emoji: '🪶' },
  { id: 'fact', label: 'Did you know?', plural: 'Knowledge', emoji: '💡' },
];

export const cardKindById = Object.fromEntries(cardKinds.map((k) => [k.id, k])) as Record<CardKind, (typeof cardKinds)[number]>;

/** About 200 words a minute, rounded up. */
export function readMinutes(texts: string[]): number {
  const words = texts.join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
