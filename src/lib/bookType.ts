import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { EBGaramond_400Regular, EBGaramond_400Regular_Italic, EBGaramond_600SemiBold } from '@expo-google-fonts/eb-garamond';
import { Literata_400Regular, Literata_400Regular_Italic, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { Platform } from 'react-native';

import type { Scheme } from '@/lib/theme';
import type { HighlightColor, ReaderFont, ReaderSettings, ReaderTheme } from '@/lib/types';

/** Fonts loaded once at startup (see src/app/_layout.tsx). */
export const bookFonts = {
  Literata_400Regular,
  Literata_400Regular_Italic,
  Literata_600SemiBold,
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_600SemiBold,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_500Medium_Italic,
};

/** Display face for chapter openers and running headers. */
export const displayFont = 'CormorantGaramond_600SemiBold';
export const displayItalic = 'CormorantGaramond_500Medium_Italic';

const systemSans = Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' });

/** charWidth is the average glyph width in ems, used to estimate how much text fits on a page. */
export const READER_FONTS: Record<ReaderFont, { label: string; regular: string; italic: string; bold: string; charWidth: number; leading: number }> = {
  literata: { label: 'Literata', regular: 'Literata_400Regular', italic: 'Literata_400Regular_Italic', bold: 'Literata_600SemiBold', charWidth: 0.5, leading: 1.55 },
  garamond: { label: 'Garamond', regular: 'EBGaramond_400Regular', italic: 'EBGaramond_400Regular_Italic', bold: 'EBGaramond_600SemiBold', charWidth: 0.42, leading: 1.5 },
  sans: { label: 'Sans', regular: systemSans, italic: systemSans, bold: systemSans, charWidth: 0.52, leading: 1.55 },
};

/**
 * paper: the page; desk: what's behind an open book; ink/soft: text and secondary text; rule: hairlines and
 * ornaments; shade: page-turn and fold shadows; vignette: the faint darkening toward a page's edges.
 */
export type BookTheme = { label: string; paper: string; desk: string; ink: string; soft: string; rule: string; shade: string; vignette: string; chrome: string; chromeText: string; highlight: string; found: string };

export const BOOK_THEMES: Record<ReaderTheme, BookTheme> = {
  light: {
    label: 'Paper',
    paper: '#FBF7EE',
    desk: '#CFC6B4',
    ink: '#1C1712',
    soft: '#7B6F5E',
    rule: '#C9B99A',
    shade: 'rgba(40,28,10,0.26)',
    vignette: 'rgba(120,96,60,0.10)',
    chrome: 'rgba(251,247,238,0.97)',
    chromeText: '#1C1712',
    highlight: 'rgba(214,170,60,0.32)',
    found: 'rgba(230,120,40,0.45)',
  },
  sepia: {
    label: 'Sepia',
    paper: '#F1E4C8',
    desk: '#A88F66',
    ink: '#2E2214',
    soft: '#7D6646',
    rule: '#BFA275',
    shade: 'rgba(60,36,8,0.32)',
    vignette: 'rgba(110,80,35,0.16)',
    chrome: 'rgba(241,228,200,0.97)',
    chromeText: '#2E2214',
    highlight: 'rgba(190,130,40,0.30)',
    found: 'rgba(210,100,30,0.45)',
  },
  dark: {
    label: 'Night',
    paper: '#1B1916',
    desk: '#0B0A09',
    ink: '#DCD3C4',
    soft: '#8E8577',
    rule: '#4A4339',
    shade: 'rgba(0,0,0,0.65)',
    vignette: 'rgba(0,0,0,0.35)',
    chrome: 'rgba(27,25,22,0.97)',
    chromeText: '#DCD3C4',
    highlight: 'rgba(200,160,80,0.28)',
    found: 'rgba(230,130,60,0.45)',
  },
};

/** Book-style punctuation: curly quotes, real dashes and ellipses. Safe to run on text that's already typeset. */
export function typeset(text: string): string {
  return text
    .replace(/---/g, '—')
    .replace(/--/g, '—')
    .replace(/\.\.\./g, '…')
    .replace(/(^|[\s([{—–-])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s([{—–-])'/g, '$1‘')
    .replace(/'/g, '’');
}

/** Chapter numbers in running heads and openers look better without the "Chapter" boilerplate repeated. */
export function chapterLabel(title: string): { kicker?: string; title: string } {
  const m = title.match(/^(chapter|book|part|letter)\s+([\divxlc]+)\.?\s*[:.—-]?\s*(.*)$/i);
  if (!m) return { title };
  const kicker = `${m[1][0].toUpperCase()}${m[1].slice(1).toLowerCase()} ${m[2].toUpperCase()}`;
  return m[3] ? { kicker, title: m[3] } : { title: kicker };
}

/** Highlighter inks, translucent so they work on every paper. */
export const HIGHLIGHT_COLORS: Record<HighlightColor, { label: string; fill: string; solid: string }> = {
  yellow: { label: 'Yellow', fill: 'rgba(245,200,66,0.45)', solid: '#E9B93A' },
  green: { label: 'Green', fill: 'rgba(120,190,110,0.42)', solid: '#6FB062' },
  blue: { label: 'Blue', fill: 'rgba(100,160,230,0.40)', solid: '#5E97D6' },
  pink: { label: 'Pink', fill: 'rgba(235,120,160,0.40)', solid: '#DE6E98' },
};

const SAMPLE_PROSE =
  'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness. She said, “I never thought so,” and smiled.';

/**
 * Average glyph width (in ems) of a font, measured in the browser once the font has loaded, so pages are filled
 * properly instead of by a cautious estimate. Includes a small margin so a page never overflows. Null elsewhere.
 */
export function measuredCharWidth(fontFamily: string): number | null {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return null;
  try {
    if (!document.fonts?.check(`20px ${fontFamily}`)) return null;
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return null;
    ctx.font = `100px ${fontFamily}`;
    return (ctx.measureText(SAMPLE_PROSE).width / SAMPLE_PROSE.length / 100) * 1.03;
  } catch {
    return null;
  }
}

/** The reader's paper: a hand-picked theme if any, else Night when the app is dark and the chosen light paper otherwise. */
export function readerThemeFor(settings: ReaderSettings, scheme: Scheme): ReaderTheme {
  if (settings.themeOverride) return settings.themeOverride;
  if (scheme === 'dark') return 'dark';
  return settings.theme === 'sepia' ? 'sepia' : 'light';
}

/** The settings change for choosing a reader theme by hand (Aa panel or the sun/moon button). */
export function chooseReaderTheme(settings: ReaderSettings, scheme: Scheme, pick: ReaderTheme): Partial<ReaderSettings> {
  const light = pick === 'dark' ? undefined : pick;
  const next = { ...settings, ...(light ? { theme: light } : {}), themeOverride: undefined };
  // Only keep an override when it differs from what the app's appearance would give.
  return { ...(light ? { theme: light } : {}), themeOverride: readerThemeFor(next, scheme) === pick ? undefined : pick };
}
