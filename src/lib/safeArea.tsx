import { useEffect, useState, type ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

import { currentScheme, palettes } from '@/lib/theme';

/**
 * Safe-area insets that are right in the iPhone home-screen web app.
 *
 * With a translucent status bar, iOS reports the notch and home-indicator areas through CSS env(), but it can fill
 * them in after the page has measured them (leaving 0, so content slides under the clock). This re-measures a little
 * later and on every resize, and if an iPhone home-screen app still reports nothing it uses the known sizes.
 */
function readEnvInsets(): EdgeInsets {
  const el = document.createElement('div');
  el.style.cssText =
    'position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)';
  document.body.appendChild(el);
  const s = getComputedStyle(el);
  const insets = { top: parseFloat(s.paddingTop) || 0, bottom: parseFloat(s.paddingBottom) || 0, left: parseFloat(s.paddingLeft) || 0, right: parseFloat(s.paddingRight) || 0 };
  el.remove();
  return insets;
}

/** Known iPhone safe areas by screen height (portrait points), for when the browser reports none. */
function iPhoneFallback(width: number, height: number): EdgeInsets | null {
  const nav = globalThis.navigator as Navigator & { standalone?: boolean };
  const standalone = nav?.standalone === true || globalThis.matchMedia?.('(display-mode: standalone)').matches;
  if (!standalone || !/iPhone/.test(nav?.userAgent ?? '')) return null;
  // Only a translucent status bar sits over the page; a solid one takes its own space.
  const translucent = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.getAttribute('content') === 'black-translucent';
  const long = Math.max(globalThis.screen?.width ?? 0, globalThis.screen?.height ?? 0);
  if (long < 812) return { top: translucent ? 20 : 0, bottom: 0, left: 0, right: 0 }; // Home-button iPhones.
  // Dynamic Island models (14 Pro and later, 15, 16, 17) vs. notch models.
  const side = [852, 874, 932, 956].includes(long) ? 59 : long === 812 ? 44 : 47;
  return width < height
    ? { top: translucent ? side : 0, bottom: 34, left: 0, right: 0 }
    : { top: 0, bottom: 21, left: side, right: side };
}

export function WebSafeArea({ children }: { children: ReactNode }) {
  const base = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [measured, setMeasured] = useState<EdgeInsets | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const measure = () => setMeasured(readEnvInsets());
    const timers = [0, 300, 1000, 2500].map((ms) => setTimeout(measure, ms));
    globalThis.addEventListener('resize', measure);
    globalThis.addEventListener('orientationchange', measure);
    document.addEventListener('visibilitychange', measure);
    return () => {
      timers.forEach(clearTimeout);
      globalThis.removeEventListener('resize', measure);
      globalThis.removeEventListener('orientationchange', measure);
      document.removeEventListener('visibilitychange', measure);
    };
  }, []);

  if (Platform.OS !== 'web') return children;
  let insets: EdgeInsets = {
    top: Math.max(base.top, measured?.top ?? 0),
    bottom: Math.max(base.bottom, measured?.bottom ?? 0),
    left: Math.max(base.left, measured?.left ?? 0),
    right: Math.max(base.right, measured?.right ?? 0),
  };
  const fallback = insets.bottom === 0 && insets.left === 0 && insets.right === 0 ? iPhoneFallback(width, height) : null;
  if (fallback) insets = fallback;
  return <SafeAreaInsetsContext.Provider value={insets}>{children}</SafeAreaInsetsContext.Provider>;
}

let screenOverride: string | null = null;

/** Paints the page behind the app and the status/browser bar: a screen's own colour if set, else the app's. */
export function paintScreen() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const color = screenOverride ?? palettes[currentScheme()].background;
  document.documentElement.style.background = color;
  document.body.style.background = color;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', color));
}

/**
 * Colours the page behind the app (the strips under the status bar and the home indicator) and the status/browser
 * bar, e.g. the reader's paper colour while a book is open. Returns a function that goes back to the app colour.
 */
export function setScreenColor(color: string) {
  screenOverride = color;
  paintScreen();
  return () => {
    if (screenOverride === color) screenOverride = null;
    paintScreen();
  };
}
