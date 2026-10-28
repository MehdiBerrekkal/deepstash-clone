import { Platform } from 'react-native';

import type { CardKind } from '@/lib/types';

export const colors = {
  background: '#0F1115',
  surface: '#1A1D24',
  surfaceRaised: '#232731',
  border: '#2A2E37',
  text: '#F4F1EA',
  muted: '#A3A7B1',
  accent: '#F2B84B',
  onAccent: '#1A1300',
  danger: '#FF7A7A',
};

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
