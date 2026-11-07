import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing, FadeIn, FadeOut, ZoomIn, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';

import { displayFont } from '@/lib/bookType';
import { onCelebrate, type Celebration } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { minutesOf } from '@/lib/stats';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const COLORS = ['#F2B84B', '#E8735A', '#6FB062', '#5E97D6', '#DE6E98', '#F4F1EA'];
const PIECES = 46;
const SHOW_MS = 3200;

/** One falling, spinning scrap of paper. */
function Piece({ i, width, height }: { i: number; width: number; height: number }) {
  // Deterministic per index, so pieces don't change between renders.
  const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
  const x = r(1) * width;
  const drift = (r(2) - 0.5) * 160;
  const size = 6 + r(3) * 7;
  const fall = useSharedValue(0);
  useEffect(() => {
    fall.set(withDelay(r(4) * 500, withTiming(1, { duration: 1700 + r(5) * 1200, easing: Easing.out(Easing.quad) })));
    // r depends only on i, which never changes for a mounted piece.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fall]);
  const style = useAnimatedStyle(() => ({
    opacity: fall.get() < 0.85 ? 1 : (1 - fall.get()) / 0.15,
    transform: [
      { translateX: x + drift * fall.get() },
      { translateY: -30 + (height + 60) * fall.get() },
      { rotate: `${fall.get() * (360 + i * 37)}deg` },
      { rotateX: `${fall.get() * 540}deg` },
    ],
  }));
  return <Animated.View style={[styles.piece, { width: size, height: size * 0.45, backgroundColor: COLORS[i % COLORS.length] }, style]} />;
}

export function Confetti() {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECES }, (_, i) => (
        <Piece key={i} i={i} width={width} height={height} />
      ))}
    </View>
  );
}

/**
 * Shows confetti and a short message when a book or the daily goal is finished. Mounted once in the root layout;
 * anything can trigger it with celebrate(). It also watches the daily reading goal itself.
 */
export function CelebrationHost() {
  const [current, setCurrent] = useState<(Celebration & { id: number }) | null>(null);
  const { readingLog, minuteGoal, ready } = useStore();
  const minutes = minutesOf(readingLog[localDate()]);
  const before = useRef<number | null>(null);

  useEffect(() => onCelebrate((c) => setCurrent({ ...c, id: Date.now() })), []);

  // Celebrate the moment today's minutes cross the goal (not on app start if it was already met).
  useEffect(() => {
    if (!ready) return;
    const prev = before.current;
    before.current = minutes;
    if (prev !== null && prev < minuteGoal && minutes >= minuteGoal) {
      setCurrent({ id: Date.now(), emoji: '🎯', title: 'Daily goal reached', subtitle: `${minuteGoal} minutes of reading today. See you tomorrow!` });
    }
  }, [minutes, minuteGoal, ready]);

  useEffect(() => {
    if (!current) return;
    haptic.success();
    const t = setTimeout(() => setCurrent(null), SHOW_MS);
    return () => clearTimeout(t);
  }, [current]);

  if (!current) return null;
  return (
    <Animated.View key={current.id} entering={FadeIn.duration(150)} exiting={FadeOut.duration(300)} style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Confetti />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View entering={ZoomIn.springify().damping(14)}>
          <Pressable accessibilityRole="alert" onPress={() => setCurrent(null)} style={styles.card}>
            <Text style={styles.emoji}>{current.emoji}</Text>
            <Text style={styles.title}>{current.title}</Text>
            {!!current.subtitle && <Text style={styles.subtitle}>{current.subtitle}</Text>}
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, left: 0, borderRadius: 1.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(242,184,75,0.5)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    maxWidth: 340,
  },
  emoji: { fontSize: 44 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 28, textAlign: 'center' },
  subtitle: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
