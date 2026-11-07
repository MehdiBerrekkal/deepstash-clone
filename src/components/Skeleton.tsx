import { useEffect } from 'react';
import { View, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { colors } from '@/lib/theme';

/** A softly pulsing placeholder block shown while something loads. */
export function Skeleton({ width = '100%', height = 14, radius = 6, color = colors.surfaceRaised, style }: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  color?: string;
  style?: ViewStyle;
}) {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0.55);
  useEffect(() => {
    if (!reduced) pulse.set(withRepeat(withTiming(1, { duration: 750 }), -1, true));
  }, [pulse, reduced]);
  const animated = useAnimatedStyle(() => ({ opacity: pulse.get() }));
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: color }, animated, style]} />;
}

/** Placeholder lines shaped like a paragraph. */
export function SkeletonText({ lines = 4, lineHeight = 22, color }: { lines?: number; lineHeight?: number; color?: string }) {
  return (
    <View style={{ gap: lineHeight * 0.45 }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={lineHeight * 0.55} color={color} width={i === lines - 1 ? '62%' : i % 3 === 1 ? '94%' : '100%'} />
      ))}
    </View>
  );
}
