import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { GestureDetector, useCompetingGestures, usePanGesture, usePinchGesture, useSimultaneousGestures, useTapGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const MIN = 1;
const MAX = 3;

type Props = {
  uri: string;
  /** The page's size at 1×. */
  width: number;
  height: number;
  zoom: number;
  onZoom: (z: number) => void;
};

/**
 * A zoomed page you can move around: one finger pans (with momentum, never past the page's edges), two fingers
 * zoom around the fingers (1×–3×), and a double tap goes back to the whole page. Page turns wait until you're back
 * at 1×, so swipes never turn the page by accident while zoomed.
 */
export function ZoomPane({ uri, width, height, zoom, onZoom }: Props) {
  const scale = useSharedValue(zoom);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(zoom);

  useEffect(() => {
    scale.set(withTiming(zoom, { duration: 160 }));
  }, [zoom, scale]);

  const clamp = (v: number, s: number, size: number) => {
    'worklet';
    const max = Math.max(0, (size * s - size) / 2);
    return Math.min(max, Math.max(-max, v));
  };

  const pan = usePanGesture({
    maxPointers: 1,
    onActivate: () => {
      startX.set(tx.get());
      startY.set(ty.get());
    },
    onUpdate: (e) => {
      tx.set(clamp(startX.get() + e.translationX, scale.get(), width));
      ty.set(clamp(startY.get() + e.translationY, scale.get(), height));
    },
    onDeactivate: (e) => {
      const maxX = Math.max(0, (width * scale.get() - width) / 2);
      const maxY = Math.max(0, (height * scale.get() - height) / 2);
      tx.set(withDecay({ velocity: e.velocityX, clamp: [-maxX, maxX] }));
      ty.set(withDecay({ velocity: e.velocityY, clamp: [-maxY, maxY] }));
    },
  });
  const pinch = usePinchGesture({
    onActivate: () => startScale.set(scale.get()),
    onUpdate: (e) => {
      const s = Math.min(MAX, Math.max(MIN * 0.9, startScale.get() * e.scale));
      scale.set(s);
      tx.set(clamp(tx.get(), s, width));
      ty.set(clamp(ty.get(), s, height));
    },
    onDeactivate: () => {
      const s = Math.min(MAX, Math.max(MIN, Math.round(scale.get() * 10) / 10));
      scale.set(withTiming(s, { duration: 160 }));
      tx.set(withTiming(clamp(tx.get(), s, width), { duration: 160 }));
      ty.set(withTiming(clamp(ty.get(), s, height), { duration: 160 }));
      scheduleOnRN(onZoom, s);
    },
  });
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      tx.set(withTiming(0));
      ty.set(withTiming(0));
      scheduleOnRN(onZoom, 1);
    },
  });
  const gestures = useSimultaneousGestures(useCompetingGestures(pinch, pan), doubleTap);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: tx.get() }, { translateY: ty.get() }, { scale: scale.get() }] }));

  return (
    <GestureDetector gesture={gestures}>
      <View style={[styles.frame, { width, height }]}>
        <Animated.View style={[{ width, height }, style]}>
          <Image source={{ uri }} style={{ width, height }} resizeMode="contain" />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', alignSelf: 'center' },
});
