import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { paintScreen } from '@/lib/safeArea';
import { useStore } from '@/lib/store';
import { applyScheme, palettes, resolveScheme, type Scheme } from '@/lib/theme';

/** The app's colour scheme now: the Appearance setting, or the device's when it's Automatic. */
export function useScheme(): Scheme {
  const { appearance } = useStore();
  return resolveScheme(appearance, useColorScheme());
}

/** Real colour values for the current scheme, for things that can't use CSS variables (navigation, SVG). */
export function usePalette() {
  return palettes[useScheme()];
}

/** Keeps the page colours, the status bar and the browser bar in step with the scheme. Mount once. */
export function AppearanceSync() {
  const scheme = useScheme();
  useEffect(() => {
    applyScheme(scheme);
    paintScreen();
  }, [scheme]);
  return <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />;
}
