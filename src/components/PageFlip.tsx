import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useImperativeHandle, useLayoutEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from 'react-native-gesture-handler';
import Animated, {
  Easing, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export type PageFlipHandle = {
  /** Animate a turn forward (1) or back (-1), as for a tap or arrow key. */
  turn: (dir: 1 | -1) => void;
};

type Props = {
  width: number;
  height: number;
  /** Two pages side by side, turned two at a time, like an open book. */
  spread: boolean;
  pageCount: number;
  /** Current leaf: the page index, or the spread index (pages 2i and 2i+1) when spread. */
  index: number;
  onIndexChange: (index: number) => void;
  renderPage: (pageIndex: number, width: number) => ReactNode;
  /** Shadow and highlight colours that suit the reading theme. */
  shade: string;
  onPinchEnd?: (scale: number) => void;
};

const PERSPECTIVE = 1800;
const TURN_MS = 420;
const easing = Easing.bezier(0.22, 0.8, 0.3, 1);

/**
 * A page that turns like paper: it follows your finger, rotates around the spine with perspective and a
 * moving shadow, then finishes or springs back. Falls back to a plain slide when the system asks for
 * reduced motion. All animation runs on the UI thread.
 */
export const PageFlip = forwardRef<PageFlipHandle, Props>(function PageFlip(
  { width, height, spread, pageCount, index, onIndexChange, renderPage, shade, onPinchEnd },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const leafCount = spread ? Math.ceil(pageCount / 2) : pageCount;
  // -1..1: negative while turning back to the previous leaf, positive while turning forward.
  const progress = useSharedValue(0);
  const busy = useSharedValue(false);
  const pinch = useSharedValue(1);
  const canBack = index > 0;
  const canForward = index < leafCount - 1;

  // A finished turn shows exactly what the next leaf at rest shows, so resetting after React re-renders is seamless.
  useLayoutEffect(() => {
    progress.set(0);
    busy.set(false);
  }, [index, spread, progress, busy]);

  const commit = (dir: number) => onIndexChange(index + dir);

  const animateTo = (target: number, from: number) => {
    'worklet';
    const duration = Math.max(140, TURN_MS * Math.abs(target - from));
    progress.set(
      withTiming(target, { duration, easing }, (finished) => {
        if (!finished) return;
        if (target === 0) busy.set(false);
        else scheduleOnRN(commit, target);
      }),
    );
  };

  useImperativeHandle(ref, () => ({
    turn: (dir) => {
      if (busy.get() || (dir > 0 ? !canForward : !canBack)) return;
      busy.set(true);
      animateTo(dir, progress.get());
    },
  }));

  const distance = spread ? width * 0.5 : width * 0.8;
  const pan = usePanGesture({
    activeOffsetX: [-12, 12],
    failOffsetY: [-24, 24],
    maxPointers: 1,
    onActivate: () => {
      busy.set(true);
    },
    onUpdate: (e) => {
      let p = -e.translationX / distance;
      if (!canForward) p = Math.min(p, 0);
      if (!canBack) p = Math.max(p, 0);
      progress.set(Math.max(-1, Math.min(1, p)));
    },
    onDeactivate: (e) => {
      const p = progress.get();
      let target = 0;
      if (!e.canceled) {
        if ((p > 0.3 || e.velocityX < -700) && canForward && p >= 0) target = 1;
        else if ((p < -0.3 || e.velocityX > 700) && canBack && p <= 0) target = -1;
      }
      animateTo(target, p);
    },
  });
  const pinchGesture = usePinchGesture({
    onUpdate: (e) => {
      pinch.set(Math.min(2, Math.max(0.6, e.scale)));
    },
    onDeactivate: () => {
      const scale = pinch.get();
      pinch.set(withTiming(1, { duration: 150 }));
      if (onPinchEnd && Math.abs(scale - 1) > 0.05) scheduleOnRN(onPinchEnd, scale);
    },
  });
  const gestures = useSimultaneousGestures(pan, pinchGesture);
  const stageStyle = useAnimatedStyle(() => ({ transform: [{ scale: pinch.get() }] }));

  const page = (i: number, w: number) => (i >= 0 && i < pageCount ? renderPage(i, w) : null);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[{ width, height, overflow: 'hidden' }, stageStyle]}>
        {spread ? (
          <Spread
            width={width}
            height={height}
            progress={progress}
            reduceMotion={reduceMotion}
            shade={shade}
            page={(i) => page(i, width / 2)}
            index={index}
          />
        ) : (
          <Single width={width} height={height} progress={progress} reduceMotion={reduceMotion} shade={shade} page={(i) => page(i, width)} index={index} />
        )}
      </Animated.View>
    </GestureDetector>
  );
});

type LayerProps = {
  width: number;
  height: number;
  progress: SharedValue<number>;
  reduceMotion: boolean;
  shade: string;
  page: (i: number) => ReactNode;
  index: number;
};

/** Portrait: one page. Turning forward lifts the current page off the spine on the left. */
function Single({ width, height, progress, reduceMotion, shade, page, index }: LayerProps) {
  const full = { width, height };

  const nextStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return reduceMotion ? { transform: [{ translateX: p > 0 ? width * (1 - p) : width }] } : {};
  });
  const currentStyle = useAnimatedStyle(() => {
    const p = progress.get();
    if (reduceMotion) return { transform: [{ translateX: -p * width }] };
    const angle = p > 0 ? interpolate(p, [0, 1], [0, -92]) : 0;
    return { opacity: angle <= -90 ? 0 : 1, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${angle}deg` }] };
  });
  const previousStyle = useAnimatedStyle(() => {
    const p = progress.get();
    if (reduceMotion) return { transform: [{ translateX: p < 0 ? -width * (1 + p) : -width }] };
    const angle = p < 0 ? interpolate(p, [-1, 0], [0, -92]) : -92;
    return { opacity: angle <= -90 ? 0 : 1, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${angle}deg` }] };
  });
  // Darkens a page as it tilts away from the light, and the page underneath near the spine.
  const currentShade = useAnimatedStyle(() => ({ opacity: reduceMotion ? 0 : Math.max(progress.get(), 0) * 0.55 }));
  const previousShade = useAnimatedStyle(() => {
    const t = Math.max(-progress.get(), 0);
    return { opacity: reduceMotion || t === 0 ? 0 : (1 - t) * 0.55 };
  });
  const underShade = useAnimatedStyle(() => {
    const t = Math.abs(progress.get());
    return { opacity: reduceMotion ? 0 : Math.sin(Math.min(t, 1) * Math.PI) * 0.8 };
  });

  return (
    <View style={full}>
      <Animated.View style={[styles.layer, full, nextStyle]}>
        {page(index + 1)}
      </Animated.View>
      <Animated.View style={[styles.layer, full, styles.originLeft, currentStyle]}>
        {page(index)}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, currentShade]}>
          <LinearGradient colors={['transparent', shade]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.spineShadow, { height }, underShade]}>
        <LinearGradient colors={[shade, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.layer, full, styles.originLeft, previousStyle]}>
        {page(index - 1)}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, previousShade]}>
          <LinearGradient colors={['transparent', shade]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/**
 * Landscape: an open book. Turning forward lifts the right page around the centre fold; its back (the next
 * left page) lands on the left. Turning back does the mirror image.
 */
function Spread({ width, height, progress, reduceMotion, shade, page, index }: LayerProps) {
  const half = width / 2;
  const leftBox = { width: half, height, left: 0 };
  const rightBox = { width: half, height, left: half };
  const L = (s: number) => page(2 * s);
  const R = (s: number) => page(2 * s + 1);

  // Static pages underneath, swapped depending on the direction of the turn.
  const prevLeft = useAnimatedStyle(() => ({ opacity: progress.get() < 0 ? 1 : 0 }));
  const curLeft = useAnimatedStyle(() => ({ opacity: progress.get() >= 0 ? 1 : 0 }));
  const nextRight = useAnimatedStyle(() => ({ opacity: progress.get() > 0 ? 1 : 0 }));
  const curRight = useAnimatedStyle(() => ({ opacity: progress.get() <= 0 ? 1 : 0 }));

  // Forward leaf: front is this spread's right page, back is the next spread's left page.
  const fwdFront = useAnimatedStyle(() => {
    const a = progress.get() > 0 ? -180 * progress.get() : 0;
    return { opacity: a > -90 ? 1 : 0, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${a}deg` }] };
  });
  const fwdBack = useAnimatedStyle(() => {
    const a = progress.get() > 0 ? -180 * progress.get() : 0;
    return { opacity: a < -90 ? 1 : 0, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${a + 180}deg` }] };
  });
  // Backward leaf: front is this spread's left page, back is the previous spread's right page.
  const backFront = useAnimatedStyle(() => {
    const a = progress.get() < 0 ? -180 * progress.get() : 0;
    return { opacity: a < 90 ? 1 : 0, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${a}deg` }] };
  });
  const backBack = useAnimatedStyle(() => {
    const a = progress.get() < 0 ? -180 * progress.get() : 0;
    return { opacity: a > 90 ? 1 : 0, transform: [{ perspective: PERSPECTIVE }, { rotateY: `${a - 180}deg` }] };
  });
  // Shadow on the turning leaf peaks when it stands upright; the pages underneath darken near the fold.
  const leafShade = useAnimatedStyle(() => ({ opacity: Math.sin(Math.min(Math.abs(progress.get()), 1) * Math.PI) * 0.45 }));
  const slide = useAnimatedStyle(() =>
    reduceMotion ? { transform: [{ translateX: -progress.get() * width }] } : { transform: [{ translateX: 0 }] },
  );

  if (reduceMotion) {
    // A plain slide of whole spreads.
    return (
      <Animated.View style={[{ width: width * 3, height, flexDirection: 'row', marginLeft: -width }, slide]}>
        {[index - 1, index, index + 1].map((s) => (
          <View key={s} style={{ width, height, flexDirection: 'row' }}>
            <View style={{ width: half, height }}>{L(s)}</View>
            <View style={{ width: half, height }}>{R(s)}</View>
            <Crease height={height} shade={shade} left={half} />
          </View>
        ))}
      </Animated.View>
    );
  }

  const leafShadeOverlay = (side: 'left' | 'right') => (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, leafShade]}>
      <LinearGradient
        colors={side === 'right' ? [shade, 'transparent'] : ['transparent', shade]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );

  return (
    <View style={{ width, height }}>
      <Animated.View style={[styles.layer, leftBox, prevLeft]}>{L(index - 1)}</Animated.View>
      <Animated.View style={[styles.layer, leftBox, curLeft]}>{L(index)}</Animated.View>
      <Animated.View style={[styles.layer, rightBox, nextRight]}>{R(index + 1)}</Animated.View>
      <Animated.View style={[styles.layer, rightBox, curRight]}>{R(index)}</Animated.View>

      <Animated.View style={[styles.layer, rightBox, styles.originLeft, fwdFront]}>
        {R(index)}
        {leafShadeOverlay('right')}
      </Animated.View>
      <Animated.View style={[styles.layer, leftBox, styles.originRight, fwdBack]}>
        {L(index + 1)}
        {leafShadeOverlay('left')}
      </Animated.View>
      <Animated.View style={[styles.layer, leftBox, styles.originRight, backFront]}>
        {L(index)}
        {leafShadeOverlay('left')}
      </Animated.View>
      <Animated.View style={[styles.layer, rightBox, styles.originLeft, backBack]}>
        {R(index - 1)}
        {leafShadeOverlay('right')}
      </Animated.View>

      <Crease height={height} shade={shade} left={half} />
    </View>
  );
}

/** The gutter down the middle of an open book: both pages darken into the fold. */
function Crease({ height, shade, left }: { height: number; shade: string; left: number }) {
  return (
    <View pointerEvents="none" style={[styles.crease, { height, left: left - 36 }]}>
      <LinearGradient colors={['transparent', shade]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.creaseHalf} />
      <LinearGradient colors={[shade, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.creaseHalf} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
  originLeft: { transformOrigin: 'left center' },
  originRight: { transformOrigin: 'right center' },
  spineShadow: { position: 'absolute', left: 0, top: 0, width: 40 },
  crease: { position: 'absolute', top: 0, width: 72, flexDirection: 'row' },
  creaseHalf: { flex: 1 },
});
