import { useEffect, useLayoutEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, ZoomIn } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Saved with the account, like the games' "how to play" notes, so the tour shows once. */
export const READER_TOUR_ID = 'tour:reader-2';

/** Spread on the area a page-gesture step points at, so the tour can find it. */
export const tourPageMark = Platform.OS === 'web' ? ({ dataSet: { tour: 'page' } } as object) : {};

type Gesture = 'swipe' | 'tap' | 'press';
export type TourStep = {
  id: string;
  title: string;
  body: string;
  /** A control's accessibility label, or 'page' for the book page itself. */
  target: string;
  gesture?: Gesture;
  /** "Next" first shows this: turns the page, opens the panel… */
  demo?: () => void;
  /** The demo opens something; the tour waits until it's closed again. */
  waits?: boolean;
};

type Rect = { x: number; y: number; width: number; height: number };

function findTarget(target: string): Rect | null {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return null;
  const el = target === 'page' ? document.querySelector('[data-tour="page"]') : document.querySelector(`[aria-label="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width ? { x: r.left, y: r.top, width: r.width, height: r.height } : null;
}

/**
 * The first time someone opens a book: one small pop-up at a time, pointing at the control it's about (or showing
 * the gesture on the page), and "Next" gives a live example (the page turns, the panel opens…) before moving on.
 * Skip or close it at any time; it doesn't come back.
 */
export function ReaderTour({ steps, busy, onActive, tourId = READER_TOUR_ID }: { steps: TourStep[]; busy: boolean; onActive?: (on: boolean) => void; tourId?: string }) {
  const { brain, markBrainHowTo, ready } = useStore();
  const [closed, setClosed] = useState(false);
  const [i, setI] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const { width: W, height: H } = useWindowDimensions();
  const active = ready && !closed && !brain.seen?.includes(tourId) && steps.length > 0;
  const step = steps[Math.min(i, steps.length - 1)];

  useEffect(() => onActive?.(active), [active, onActive]);

  // Find what this step points at once it's on screen (the controls fade in, so look again shortly after).
  const target = step?.target;
  useLayoutEffect(() => {
    if (!active || !target) return;
    const look = () => setRect(findTarget(target));
    const t1 = setTimeout(look, 0);
    const t2 = setTimeout(look, 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, target, i, W, H, waiting, playing]);

  // After a demo that opened something, carry on once it's closed.
  useEffect(() => {
    if (!waiting || busy) return;
    const t = setTimeout(() => {
      setWaiting(false);
      setI((n) => n + 1);
    }, 250);
    return () => clearTimeout(t);
  }, [waiting, busy]);

  // Ran past the end (e.g. a step disappeared): the tour is done.
  useEffect(() => {
    if (active && i >= steps.length) markBrainHowTo(tourId);
  }, [active, i, steps.length, markBrainHowTo, tourId]);

  if (!active || !step || i >= steps.length || waiting || playing) return null;

  const finish = () => {
    setClosed(true);
    markBrainHowTo(tourId);
  };
  const last = i + 1 === steps.length;
  const next = () => {
    haptic.tap();
    if (last) return finish();
    if (!step.demo) return setI((n) => n + 1);
    step.demo();
    if (step.waits) return setWaiting(true);
    // Hide the pop-up while the example plays, then show the next one.
    setPlaying(true);
    setTimeout(() => {
      setPlaying(false);
      setI((n) => n + 1);
    }, 1100);
  };

  const onPage = step.target === 'page' || !rect;
  const pad = 6;
  const hole = rect && !onPage ? { x: rect.x - pad, y: rect.y - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;
  const bubbleW = Math.min(320, W - 32);
  const below = hole ? hole.y + hole.height / 2 < H / 2 : false;
  const arrowX = hole ? Math.min(Math.max(hole.x + hole.width / 2, 28), W - 28) : W / 2;
  const left = Math.min(Math.max(arrowX - bubbleW / 2, 16), W - bubbleW - 16);
  const bubblePos = hole
    ? below
      ? { top: hole.y + hole.height + 12, left }
      : { bottom: H - hole.y + 12, left }
    : { top: rect ? rect.y + rect.height * 0.52 : H * 0.5, left: (W - bubbleW) / 2 };

  return (
    <Modal visible transparent animationType="none" onRequestClose={finish}>
      <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
        {/* Dims everything but the control the step is about. */}
        {hole ? (
          <>
            <View style={[styles.dim, { left: 0, top: 0, right: 0, height: Math.max(0, hole.y) }]} />
            <View style={[styles.dim, { left: 0, top: hole.y + hole.height, right: 0, bottom: 0 }]} />
            <View style={[styles.dim, { left: 0, top: hole.y, width: Math.max(0, hole.x), height: hole.height }]} />
            <View style={[styles.dim, { left: hole.x + hole.width, top: hole.y, right: 0, height: hole.height }]} />
            <View pointerEvents="none" style={[styles.ring, { left: hole.x, top: hole.y, width: hole.width, height: hole.height }]} />
          </>
        ) : (
          <View style={[styles.dim, StyleSheet.absoluteFill, styles.dimLight]} />
        )}
        {onPage && step.gesture && <Hand gesture={step.gesture} x={W / 2} y={rect ? rect.y + rect.height * 0.32 : H * 0.32} />}

        <Animated.View key={step.id} entering={ZoomIn.springify().damping(16).stiffness(200)} style={[styles.bubble, { width: bubbleW }, bubblePos]}>
          {hole && <View style={[styles.arrow, below ? styles.arrowUp : styles.arrowDown, { left: arrowX - left - 8 }]} />}
          <View style={styles.top}>
            <Text style={styles.kicker}>
              {i + 1} of {steps.length}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close the tour" onPress={finish} hitSlop={12}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.text}>{step.body}</Text>
          <View style={styles.buttons}>
            {!last && (
              <Pressable accessibilityRole="button" onPress={finish} hitSlop={6}>
                <Text style={styles.skip}>Skip tour</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" onPress={next} style={styles.primary}>
              <Text style={styles.primaryText}>{last ? 'Start reading' : step.demo ? 'Show me ›' : 'Next ›'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/** A finger showing the gesture on the page: a swipe to the left, a tap, or a long press. */
function Hand({ gesture, x, y }: { gesture: Gesture; x: number; y: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);
    t.value =
      gesture === 'swipe'
        ? withRepeat(withSequence(withTiming(1, { duration: 900, easing: ease }), withTiming(0, { duration: 0 }), withTiming(0, { duration: 400 })), -1)
        : gesture === 'tap'
          ? withRepeat(withSequence(withTiming(1, { duration: 180 }), withTiming(0, { duration: 260 }), withTiming(0, { duration: 600 })), -1)
          : withRepeat(withSequence(withTiming(1, { duration: 250 }), withTiming(1, { duration: 900 }), withTiming(0, { duration: 250 }), withTiming(0, { duration: 500 })), -1);
  }, [gesture, t]);
  const hand = useAnimatedStyle(() =>
    gesture === 'swipe'
      ? { transform: [{ translateX: 60 - t.value * 120 }, { rotate: `${-10 - t.value * 8}deg` }], opacity: t.value < 0.05 ? 0.4 : 1 }
      : { transform: [{ scale: 1 - t.value * 0.15 }] },
  );
  const ripple = useAnimatedStyle(() => ({ opacity: gesture === 'swipe' ? 0 : t.value * 0.5, transform: [{ scale: 0.6 + t.value * 0.8 }] }));
  return (
    <View pointerEvents="none" style={[styles.handWrap, { left: x - 40, top: y - 40 }]}>
      <Animated.View style={[styles.ripple, ripple]} />
      <Animated.Text style={[styles.hand, hand]}>👆</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.58)' },
  dimLight: { backgroundColor: 'rgba(0,0,0,0.35)' },
  ring: { position: 'absolute', borderRadius: 14, borderWidth: 2, borderColor: colors.accent },
  bubble: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  arrow: { position: 'absolute', width: 16, height: 16, backgroundColor: colors.surface, transform: [{ rotate: '45deg' }], borderColor: colors.border },
  arrowUp: { top: -8, borderLeftWidth: 1, borderTopWidth: 1 },
  arrowDown: { bottom: -8, borderRightWidth: 1, borderBottomWidth: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  closeText: { color: colors.muted, fontSize: 15, fontWeight: '700' },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  text: { color: colors.muted, fontSize: 14.5, lineHeight: 20 },
  buttons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  skip: { color: colors.muted, fontSize: 14, fontWeight: '700', paddingVertical: 8 },
  primary: { marginLeft: 'auto', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 14.5 },
  handWrap: { position: 'absolute', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ripple: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff' },
  hand: { fontSize: 44 },
});
