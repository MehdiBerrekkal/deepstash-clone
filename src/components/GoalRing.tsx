import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/lib/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0..1 (more than 1 shows a full ring). */
  progress: number;
  size: number;
  stroke?: number;
  color?: string;
  track?: string;
  /** Centre text, e.g. "7" or "✓". */
  label?: string;
  sublabel?: string;
};

/** A circular progress ring that fills smoothly, for the daily reading goal. */
export function GoalRing({ progress, size, stroke = Math.max(3, size / 10), color = colors.accent, track = colors.border, label, sublabel }: Props) {
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const reduced = useReducedMotion();
  const shown = useSharedValue(0);
  const target = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    shown.set(reduced ? target : withTiming(target, { duration: 700 }));
  }, [target, reduced, shown]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: length * (1 - shown.get()) }));

  return (
    <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(target * 100) }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${length} ${length}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {(label || sublabel) && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {!!label && <Text style={[styles.label, { fontSize: size * (sublabel ? 0.28 : 0.36), color: target >= 1 ? color : colors.text }]}>{label}</Text>}
          {!!sublabel && <Text style={[styles.sub, { fontSize: Math.max(9, size * 0.11) }]}>{sublabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '800' },
  sub: { color: colors.muted, fontWeight: '600', marginTop: -2 },
});
