import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SkeletonText } from '@/components/Skeleton';
import { displayFont, displayItalic, type BookTheme } from '@/lib/bookType';

type Props = {
  title: string;
  author: string;
  coverUri?: string;
  theme: BookTheme;
  /** True once the pages are ready: the cover swings open and the overlay goes away. */
  open: boolean;
};

/**
 * The book's cover fills the screen while the text loads, then swings open on its spine to reveal the first page,
 * so going from a cover in the Library to the reader feels like opening the book.
 */
export function BookOpening({ title, author, coverUri, theme, open }: Props) {
  const reduced = useReducedMotion();
  const swing = useSharedValue(0);
  const [gone, setGone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const finish = () => setGone(true);
    swing.set(
      withTiming(1, { duration: reduced ? 180 : 900, easing: Easing.inOut(Easing.cubic) }, (done) => {
        if (done) scheduleOnRN(finish);
      }),
    );
  }, [open, reduced, swing]);

  const cover = useAnimatedStyle(() =>
    reduced
      ? { opacity: 1 - swing.get() }
      : {
          opacity: swing.get() < 0.75 ? 1 : (1 - swing.get()) * 4,
          transform: [{ perspective: 1400 }, { rotateY: `${-105 * swing.get()}deg` }],
          transformOrigin: 'left center',
        },
  );
  const backdrop = useAnimatedStyle(() => ({ opacity: 1 - swing.get() }));

  if (gone) return null;
  return (
    <View pointerEvents={open ? 'none' : 'auto'} style={StyleSheet.absoluteFill}>
      {/* The first page, waiting under the cover. */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.paper, padding: 32, paddingTop: 120, gap: 28 }, backdrop]}>
        <SkeletonText lines={5} lineHeight={24} color={theme.rule} />
        <SkeletonText lines={6} lineHeight={24} color={theme.rule} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styles.cover, cover]}>
        {coverUri && !failed ? (
          <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFill} resizeMode="cover" onError={() => setFailed(true)} />
        ) : (
          <LinearGradient colors={['#3B2A20', '#1E1612']} style={[StyleSheet.absoluteFill, styles.plain]}>
            <Text style={styles.plainTitle}>{title}</Text>
            <Text style={styles.plainAuthor}>{author}</Text>
          </LinearGradient>
        )}
        {/* The spine's shadow. */}
        <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.spine} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { backgroundColor: '#2A211B', overflow: 'hidden' },
  plain: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  plainTitle: { color: '#F1E4C8', fontFamily: displayFont, fontSize: 40, textAlign: 'center' },
  plainAuthor: { color: '#C9B99A', fontFamily: displayItalic, fontSize: 20 },
  spine: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 28 },
});
