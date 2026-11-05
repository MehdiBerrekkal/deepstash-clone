import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOut, ZoomIn } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Saved with the account, like the games' "how to play" notes, so the tour shows once. */
export const READER_TOUR_ID = 'tour:reader';

type Step = { icon: string; title: string; body: string };

const steps = (own: boolean, pdf: boolean): Step[] =>
  [
    { icon: '👆', title: 'Turn the pages', body: 'Swipe left to go forward and right to go back, like a real book.' },
    { icon: '✋', title: 'Show or hide the controls', body: 'Tap the page. The bar on top and the page slider come and go.' },
    !pdf && { icon: '🖍️', title: 'Highlight and translate', body: 'Long-press a word to translate it or see what it means. From there, ✎ highlights the passage and lets you add a note.' },
    !pdf && { icon: '🎧', title: 'Listen', body: 'The headphones read the book aloud and follow along on the page.' },
    own && { icon: '💡', title: 'Main ideas', body: 'The lamp opens the book’s main-idea cards. Stash the ones you want to keep.' },
    { icon: 'Aa', title: 'Make it yours', body: 'Aa changes the text size, font and paper colour. ☰ shows the chapters, ☆ bookmarks the page.' },
    { icon: '⤺', title: 'Going back', body: 'Tap ‹ at the top left, or swipe from the very left edge of the screen.' },
  ].filter(Boolean) as Step[];

/**
 * A short pop-up tour the first time someone opens a book. Each step can be skipped, and the tour closed at any
 * time; it doesn't come back afterwards.
 */
export function ReaderTour({ own = false, pdf = false }: { own?: boolean; pdf?: boolean }) {
  const { brain, markBrainHowTo, ready } = useStore();
  const [closed, setClosed] = useState(false);
  const [i, setI] = useState(0);
  const list = steps(own, pdf);
  if (!ready || closed || brain.seen?.includes(READER_TOUR_ID)) return null;

  const close = () => {
    setClosed(true);
    markBrainHowTo(READER_TOUR_ID);
  };
  const next = () => {
    haptic.tap();
    if (i + 1 >= list.length) close();
    else setI(i + 1);
  };
  const step = list[i];
  const last = i + 1 === list.length;

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(160)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close the tour" />
        <Animated.View entering={ZoomIn.springify().damping(16).stiffness(190)} style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.kicker}>
              Quick tour · {i + 1} of {list.length}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close the tour" onPress={close} hitSlop={10} style={styles.close}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <Animated.View key={i} entering={FadeInRight.duration(220)} style={styles.body}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{step.icon}</Text>
            </View>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.text}>{step.body}</Text>
          </Animated.View>
          <View style={styles.dots}>
            {list.map((_, n) => (
              <View key={n} style={[styles.dot, n === i && styles.dotOn]} />
            ))}
          </View>
          <View style={styles.buttons}>
            {!last && (
              <Pressable accessibilityRole="button" onPress={close} style={styles.secondary}>
                <Text style={styles.secondaryText}>Skip the tour</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" onPress={next} style={styles.primary}>
              <Text style={styles.primaryText}>{last ? 'Start reading' : 'Next'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.surface, borderRadius: 24, padding: 20, gap: 16, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  close: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  closeText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  body: { alignItems: 'center', gap: 10, minHeight: 170 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, marginBottom: 4 },
  icon: { fontSize: 32, color: colors.text, fontWeight: '800' },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  text: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotOn: { width: 18, backgroundColor: colors.accent },
  buttons: { flexDirection: 'row', gap: 10 },
  primary: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 15 },
  secondary: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '700', fontSize: 15 },
});
