import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useImperativeHandle, useLayoutEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { haptic } from '@/lib/haptics';

export type PageFlipHandle = {
  /** Animate a turn forward (1) or back (-1), as for an arrow key or listen mode's auto page-turn. */
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
  /** Shadow colour that suits the reading theme. */
  shade: string;
  /** Paper colour, for the back of a turning page. */
  paper?: string;
  onPinchEnd?: (scale: number) => void;
};

const TURN_MS = 520;
const easing = Easing.bezier(0.3, 0.1, 0.25, 1);
/** How far the fold line tilts (degrees) when you grab a page near its top or bottom corner. */
const MAX_TILT = 14;
/** Swipe this far (px) sideways before a turn starts, so taps and small slips never turn the page. */
const START_DISTANCE = 18;

/**
 * Pages that turn like paper. Swiping bends the page along a fold that follows your finger: the part past the
 * fold lifts over, showing the back of the page, with a highlight along the bend and shadows on the page beneath.
 * Grabbing near a corner tilts the fold so that corner lifts first. Release past about a quarter (or flick) to
 * finish the turn, otherwise it settles back. Everything is drawn with transforms on the UI thread; with reduced
 * motion the pages simply slide.
 */
export const PageFlip = forwardRef<PageFlipHandle, Props>(function PageFlip(
  { width, height, spread, pageCount, index, onIndexChange, renderPage, shade, paper = '#FBF7EE', onPinchEnd },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const leafCount = spread ? Math.ceil(pageCount / 2) : pageCount;
  // -1..1: negative while turning back to the previous leaf, positive while turning forward.
  const progress = useSharedValue(0);
  // Where the page was grabbed, from -1 (top) to 1 (bottom); sets the tilt of the fold.
  const grab = useSharedValue(0.6);
  const startX = useSharedValue(0);
  const busy = useSharedValue(false);
  const pinch = useSharedValue(1);
  const canBack = index > 0;
  const canForward = index < leafCount - 1;

  // A finished turn shows exactly what the next leaf at rest shows, so resetting after React re-renders is seamless.
  useLayoutEffect(() => {
    progress.set(0);
    busy.set(false);
  }, [index, spread, progress, busy]);

  const commit = (dir: number) => {
    haptic.tick();
    onIndexChange(index + dir);
  };

  const animateTo = (target: number, from: number) => {
    'worklet';
    const duration = Math.max(160, TURN_MS * Math.abs(target - from));
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
      // Like a reader lifting the bottom corner.
      grab.set(0.65);
      animateTo(dir, progress.get());
    },
  }));

  const pageWidth = spread ? width / 2 : width;
  const pan = usePanGesture({
    activeOffsetX: [-START_DISTANCE, START_DISTANCE],
    failOffsetY: [-22, 22],
    maxPointers: 1,
    onActivate: (e) => {
      busy.set(true);
      startX.set(e.x - e.translationX);
      grab.set(Math.max(-1, Math.min(1, (e.y / height) * 2 - 1)));
    },
    onUpdate: (e) => {
      // The page's edge follows the finger: a full turn takes the finger from where it started to past the spine.
      const forwardSpan = spread ? Math.max(startX.get() - pageWidth, pageWidth * 0.3) + pageWidth : startX.get() + pageWidth;
      const backSpan = spread ? width - startX.get() + pageWidth * 0.2 : pageWidth * 1.4 - startX.get() * 0.4;
      let p = e.translationX < 0 ? -e.translationX / Math.max(forwardSpan, 1) : -e.translationX / Math.max(backSpan, 1);
      if (!canForward) p = Math.min(p, 0);
      if (!canBack) p = Math.max(p, 0);
      progress.set(Math.max(-1, Math.min(1, p)));
    },
    onDeactivate: (e) => {
      const p = progress.get();
      let target = 0;
      if (!e.canceled) {
        if ((p > 0.25 || (e.velocityX < -600 && p > 0.03)) && canForward && p >= 0) target = 1;
        else if ((p < -0.25 || (e.velocityX > 600 && p < -0.03)) && canBack && p <= 0) target = -1;
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
        {reduceMotion ? (
          <Slide width={width} height={height} progress={progress} spread={spread} page={(i) => page(i, pageWidth)} index={index} shade={shade} />
        ) : spread ? (
          <Spread width={width} height={height} progress={progress} shade={shade} paper={paper} page={(i) => page(i, pageWidth)} index={index} />
        ) : (
          <Single width={width} height={height} progress={progress} grab={grab} shade={shade} paper={paper} page={(i) => page(i, width)} index={index} />
        )}
      </Animated.View>
    </GestureDetector>
  );
});

type CurlProps = {
  width: number;
  height: number;
  progress: SharedValue<number>;
  shade: string;
  paper: string;
  page: (i: number) => ReactNode;
  index: number;
};

/**
 * The fold geometry for a page of width W turning to the left around its left edge, as t goes 0 → 1:
 * the fold line crosses x = F = W(1 - t) at height y0, tilted by `tilt` degrees; the part of the page right of the
 * fold is reflected over to the left of it (the lifted flap).
 */
function foldAt(t: number, W: number, H: number, grabY: number) {
  'worklet';
  const F = W * (1 - t);
  // The corner you grabbed lifts first; the tilt relaxes as the page comes down flat.
  const tilt = MAX_TILT * grabY * Math.sin(Math.min(1, t * 1.6) * Math.PI) * (t < 0.62 ? 1 : 1 - (t - 0.62) / 0.38);
  return { F, y0: H * (0.5 + grabY * 0.5), tilt };
}

// Clip boxes are much bigger than a page so they still cover it when rotated.
const box = (W: number, H: number) => ({ w: W * 2 + H, h: H * 3 });

/** A sheen along the bend: bright on light paper, faint on night paper. */
function sheen(paper: string) {
  const hex = paper.replace('#', '');
  const lum = hex.length === 6 ? (parseInt(hex.slice(0, 2), 16) * 299 + parseInt(hex.slice(2, 4), 16) * 587 + parseInt(hex.slice(4, 6), 16) * 114) / 255000 : 1;
  return (alpha: number) => `rgba(255,255,255,${(alpha * (lum > 0.5 ? 1 : 0.22)).toFixed(3)})`;
}

/** One page lifting from the right edge and folding over to the left, over the page beneath it. */
function Curl({
  width: W, height: H, progress, dir, grabY, shade, paper, turning, beneath,
}: {
  width: number;
  height: number;
  /** The flipper's progress; this curl runs while it's on its side of zero. */
  progress: SharedValue<number>;
  /** 1: the turning page goes forward (t = progress). -1: a backward turn, played as this page turning in reverse. */
  dir: 1 | -1;
  grabY: SharedValue<number>;
  shade: string;
  paper: string;
  turning: ReactNode;
  beneath: ReactNode;
}) {
  const { w: BW, h: BH } = box(W, H);
  // Read the progress directly in each style below, so Reanimated re-runs them as it changes.
  const t = () => {
    'worklet';
    const p = progress.get();
    return dir === 1 ? Math.max(p, 0) : 1 + Math.min(p, 0);
  };
  const active = () => {
    'worklet';
    return dir === 1 ? progress.get() >= 0 : progress.get() < 0;
  };

  // The part of the page still lying flat: everything left of the fold.
  const keepBox = useAnimatedStyle(() => {
    progress.get();
    const { F, y0, tilt } = foldAt(t(), W, H, grabY.get());
    return { opacity: active() ? 1 : 0, transform: [{ translateX: F - BW }, { translateY: y0 - BH / 2 }, { rotate: `${tilt}deg` }] };
  });
  // Undo the box's rotation so the page inside stays put.
  const keepPage = useAnimatedStyle(() => {
    progress.get();
    const { F, y0, tilt } = foldAt(t(), W, H, grabY.get());
    return { transform: [{ translateX: BW }, { translateY: BH / 2 }, { rotate: `${-tilt}deg` }, { translateX: -F }, { translateY: -y0 }] };
  });
  // The lifted flap: the page reflected across the fold, seen from behind.
  const flapBox = useAnimatedStyle(() => {
    progress.get();
    const tt = t();
    const { F, y0, tilt } = foldAt(tt, W, H, grabY.get());
    return { opacity: active() && tt > 0.001 ? 1 : 0, transform: [{ translateX: F - BW }, { translateY: y0 - BH / 2 }, { rotate: `${tilt}deg` }] };
  });
  // Bend highlight and shading along the fold, sized to the flap.
  const bend = useAnimatedStyle(() => {
    progress.get();
    const tt = t();
    const flap = Math.max(0, Math.min(W * tt, 90));
    return { width: flap, opacity: Math.min(1, tt * 8) };
  });
  // Shadow the lifted page casts on the page beneath, just right of the fold.
  const castBox = useAnimatedStyle(() => {
    progress.get();
    const tt = t();
    const { F, y0, tilt } = foldAt(tt, W, H, grabY.get());
    return {
      opacity: active() ? Math.sin(Math.min(1, tt) * Math.PI) * 0.9 + (tt > 0 && tt < 1 ? 0.1 : 0) : 0,
      transform: [{ translateX: F }, { translateY: y0 - BH / 2 }, { rotate: `${tilt}deg` }],
    };
  });

  const pageBox = { width: W, height: H };
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {beneath}
      <Animated.View pointerEvents="none" style={[styles.foldBox, { width: 60, height: BH, transformOrigin: 'left center' }, castBox]}>
        <LinearGradient colors={[shade, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.foldBox, { width: BW, height: BH, transformOrigin: 'right center' }, keepBox]}>
        <Animated.View style={[styles.pageAt, pageBox, keepPage]}>{turning}</Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.foldBox, { width: BW, height: BH, transformOrigin: 'right center' }, flapBox]}>
        <View style={[StyleSheet.absoluteFill, styles.mirror]}>
          <Animated.View style={[styles.pageAt, pageBox, keepPage]}>
            {turning}
            {/* The back of the paper: the text shows through faintly, mirrored. */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: paper, opacity: 0.9 }]} />
            {/* Shadow of the flap's edge on the page under it. */}
            <LinearGradient colors={[shade, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.edgeShadow, { left: W, height: H }]} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.bend, { height: BH }, bend]}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', sheen(paper)(0.32), sheen(paper)(0.08), shade]}
            locations={[0, 0.55, 0.8, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

type SingleProps = CurlProps & { grab: SharedValue<number> };

/** Portrait: one page. Forward: the current page curls away to the left. Back: the previous page curls back in. */
function Single({ width, height, progress, grab, shade, paper, page, index }: SingleProps) {
  const full = { width, height };
  const nextVisible = useAnimatedStyle(() => ({ opacity: progress.get() > 0 ? 1 : 0 }));
  const currentUnder = useAnimatedStyle(() => ({ opacity: progress.get() < 0 ? 1 : 0 }));

  return (
    <View style={full}>
      <Curl
        width={width}
        height={height}
        progress={progress}
        dir={1}
        grabY={grab}
        shade={shade}
        paper={paper}
        turning={page(index)}
        beneath={<Animated.View style={[StyleSheet.absoluteFill, nextVisible]}>{page(index + 1)}</Animated.View>}
      />
      <Curl
        width={width}
        height={height}
        progress={progress}
        dir={-1}
        grabY={grab}
        shade={shade}
        paper={paper}
        turning={page(index - 1)}
        beneath={<Animated.View style={[StyleSheet.absoluteFill, currentUnder]}>{page(index)}</Animated.View>}
      />
    </View>
  );
}

/**
 * Landscape: an open book. Turning forward, the right page bends at a fold that sweeps from its outer edge to the
 * spine, and its back (the next left page) lands on the left. Turning back is the mirror image.
 */
function Spread({ width, height, progress, shade, paper, page, index }: CurlProps) {
  const h = width / 2;
  const L = (s: number) => page(2 * s);
  const R = (s: number) => page(2 * s + 1);
  const half = { width: h, height };

  // Pages lying flat, depending on the direction of the turn.
  const prevLeft = useAnimatedStyle(() => ({ opacity: progress.get() < 0 ? 1 : 0 }));
  const curLeft = useAnimatedStyle(() => ({ opacity: progress.get() >= 0 ? 1 : 0 }));
  const nextRight = useAnimatedStyle(() => ({ opacity: progress.get() > 0 ? 1 : 0 }));
  const curRight = useAnimatedStyle(() => ({ opacity: progress.get() <= 0 ? 1 : 0 }));

  // Forward: fold F sweeps h..2h → h; the right page shows left of... its part between the spine and F stays,
  // the part beyond F flips over: its back (next spread's left page) occupies [2F - 2h, F].
  const fwdKeep = useAnimatedStyle(() => {
    const t = Math.max(progress.get(), 0);
    const F = h + h * (1 - t);
    return { opacity: progress.get() > 0 ? 1 : 0, width: F - h };
  });
  const fwdFlapBox = useAnimatedStyle(() => {
    const t = Math.max(progress.get(), 0);
    const F = h + h * (1 - t);
    const X = 2 * F - 2 * h;
    return { opacity: t > 0.001 ? 1 : 0, transform: [{ translateX: X }], width: F - X };
  });
  const fwdCast = useAnimatedStyle(() => {
    const t = Math.max(progress.get(), 0);
    const F = h + h * (1 - t);
    return { opacity: t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.9 + 0.1 : 0, transform: [{ translateX: F }] };
  });
  // Backward: fold F' sweeps 0 → h; the left page's part right of F' stays, the part left of it flips over to the
  // right: its back (previous spread's right page) occupies [F', 2F'].
  const backKeep = useAnimatedStyle(() => {
    const t = Math.max(-progress.get(), 0);
    const F = h * t;
    return { opacity: progress.get() < 0 ? 1 : 0, transform: [{ translateX: F }], width: h - F };
  });
  const backKeepPage = useAnimatedStyle(() => ({ transform: [{ translateX: -h * Math.max(-progress.get(), 0) }] }));
  const backFlapBox = useAnimatedStyle(() => {
    const t = Math.max(-progress.get(), 0);
    const F = h * t;
    return { opacity: t > 0.001 ? 1 : 0, transform: [{ translateX: F }], width: F };
  });
  const backFlapPage = useAnimatedStyle(() => {
    const F = h * Math.max(-progress.get(), 0);
    // The previous right page sits with its outer edge at 2F', i.e. left = 2F' - h, inside a box starting at F'.
    return { transform: [{ translateX: F - h }] };
  });
  const backCast = useAnimatedStyle(() => {
    const t = Math.max(-progress.get(), 0);
    return { opacity: t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.9 + 0.1 : 0, transform: [{ translateX: h * t - 60 }] };
  });
  const bendFwd = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(progress.get(), 0) * 8) }));
  const bendBack = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(-progress.get(), 0) * 8) }));

  return (
    <View style={{ width, height }}>
      <Animated.View style={[styles.layer, half, { left: 0 }, prevLeft]}>{L(index - 1)}</Animated.View>
      <Animated.View style={[styles.layer, half, { left: 0 }, curLeft]}>{L(index)}</Animated.View>
      <Animated.View style={[styles.layer, half, { left: h }, nextRight]}>{R(index + 1)}</Animated.View>
      <Animated.View style={[styles.layer, half, { left: h }, curRight]}>{R(index)}</Animated.View>

      {/* Forward turn. */}
      <Animated.View pointerEvents="none" style={[styles.layer, { width: 60, height, left: 0 }, fwdCast]}>
        <LinearGradient colors={[shade, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.layer, { height, left: h }, fwdKeep]}>
        <View style={half}>{R(index)}</View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.layer, { height, left: 0 }, fwdFlapBox]}>
        <View style={[half, { backgroundColor: paper }]}>{L(index + 1)}</View>
        <Animated.View style={[styles.spreadBend, { height, right: 0 }, bendFwd]}>
          <LinearGradient colors={['rgba(255,255,255,0)', sheen(paper)(0.28), shade]} locations={[0, 0.6, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>

      {/* Backward turn. */}
      <Animated.View pointerEvents="none" style={[styles.layer, { width: 60, height, left: h }, backCast]}>
        <LinearGradient colors={['transparent', shade]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.layer, { height, left: 0 }, backKeep]}>
        <Animated.View style={[half, backKeepPage]}>{L(index)}</Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.layer, { height, left: 0 }, backFlapBox]}>
        <Animated.View style={[half, { backgroundColor: paper }, backFlapPage]}>{R(index - 1)}</Animated.View>
        <Animated.View style={[styles.spreadBend, { height, left: 0 }, bendBack]}>
          <LinearGradient colors={[shade, sheen(paper)(0.28), 'rgba(255,255,255,0)']} locations={[0, 0.4, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>

      <Crease height={height} shade={shade} left={h} />
    </View>
  );
}

/** With reduced motion: whole pages (or spreads) slide sideways. */
function Slide({
  width, height, progress, spread, page, index, shade,
}: { width: number; height: number; progress: SharedValue<number>; spread: boolean; page: (i: number) => ReactNode; index: number; shade: string }) {
  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: -progress.get() * width }] }));
  const half = width / 2;
  return (
    <Animated.View style={[{ width: width * 3, height, flexDirection: 'row', marginLeft: -width }, slide]}>
      {[index - 1, index, index + 1].map((s) => (
        <View key={s} style={{ width, height, flexDirection: 'row' }}>
          {spread ? (
            <>
              <View style={{ width: half, height }}>{page(2 * s)}</View>
              <View style={{ width: half, height }}>{page(2 * s + 1)}</View>
              <Crease height={height} shade={shade} left={half} />
            </>
          ) : (
            page(s)
          )}
        </View>
      ))}
    </Animated.View>
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
  foldBox: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
  pageAt: { position: 'absolute', top: 0, left: 0, transformOrigin: '0px 0px' },
  mirror: { transform: [{ scaleX: -1 }], transformOrigin: 'right center' },
  edgeShadow: { position: 'absolute', top: 0, width: 26, opacity: 0.6 },
  bend: { position: 'absolute', top: 0, right: 0 },
  spreadBend: { position: 'absolute', top: 0, width: 70 },
  crease: { position: 'absolute', top: 0, width: 72, flexDirection: 'row' },
  creaseHalf: { flex: 1 },
});
