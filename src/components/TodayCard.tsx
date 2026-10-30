import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GoalRing } from '@/components/GoalRing';
import { displayFont, displayItalic } from '@/lib/bookType';
import { classicAsSource } from '@/lib/classicSource';
import { classicById } from '@/lib/fullbook';
import { DEFAULT_WPM, formatDuration, minutesOf, readingSpeed } from '@/lib/stats';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export type ContinueBook = { title: string; author: string; cover?: string; fraction: number; words: number; open: () => void };

/** The book you were reading most recently and haven't finished, if any. */
export function useContinueReading(): ContinueBook | null {
  const { readerProgress, ownBooks, finishedReaders } = useStore();
  const recent = Object.entries(readerProgress)
    .filter(([key, p]) => p.fraction < 0.995 && !finishedReaders[key])
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));
  for (const [key, p] of recent) {
    if (key.startsWith('classic:') && classicById[key.slice(8)]) {
      const c = classicById[key.slice(8)];
      const src = classicAsSource(c);
      return {
        title: c.title,
        author: c.author,
        cover: src.coverUrl ?? (src.coverId ? `https://covers.openlibrary.org/b/id/${src.coverId}-L.jpg` : undefined),
        fraction: p.fraction,
        words: c.words,
        open: () => router.push({ pathname: '/reader/[id]', params: { id: c.id, kind: 'classic' } }),
      };
    }
    if (key.startsWith('own:')) {
      const b = ownBooks.find((o) => o.id === key.slice(4));
      if (b) {
        return {
          title: b.title,
          author: b.author,
          fraction: p.fraction,
          words: 0,
          open: () => router.push({ pathname: '/reader/[id]', params: { id: b.id, kind: 'own' } }),
        };
      }
    }
  }
  return null;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Reading late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/** The first page of the For you feed: continue your book, your goal for today and today's review. */
export function TodayCard({ height, book }: { height: number; book: ContinueBook | null }) {
  const { readingLog, minuteGoal, streak, reviewQueue } = useStore();
  const minutes = minutesOf(readingLog[localDate()]);
  const wpm = readingSpeed(readingLog) ?? DEFAULT_WPM;
  const left = book && book.words ? formatDuration((book.words * (1 - book.fraction)) / wpm) : null;

  return (
    <View style={[styles.page, { height }]}>
      <LinearGradient colors={['#2A2118', '#15171D']} style={styles.card}>
        <Animated.Text entering={FadeInDown.duration(400)} style={styles.greeting}>
          {greeting()}
        </Animated.Text>

        {book && (
          <Animated.View entering={FadeInDown.delay(80).duration(450)}>
            <Pressable accessibilityLabel={`Continue reading ${book.title}`} onPress={book.open} style={styles.hero}>
              <View style={styles.coverWrap}>
                {book.cover ? (
                  <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="cover" />
                ) : (
                  <LinearGradient colors={['#5B3A2A', '#2E1E16']} style={[styles.cover, styles.plainCover]}>
                    <Text style={styles.plainTitle} numberOfLines={4}>
                      {book.title}
                    </Text>
                  </LinearGradient>
                )}
              </View>
              <View style={styles.heroText}>
                <Text style={styles.kicker}>CONTINUE READING</Text>
                <Text style={styles.title} numberOfLines={3}>
                  {book.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                  {book.author}
                </Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.round(book.fraction * 100)}%` }]} />
                </View>
                <Text style={styles.meta}>
                  {Math.round(book.fraction * 100)}% read{left ? ` · about ${left} left` : ''}
                </Text>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Open book ›</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(160).duration(450)} style={styles.row}>
          <Pressable accessibilityLabel="Your reading goal" onPress={() => router.push('/profile')} style={styles.tile}>
            <GoalRing progress={minutes / minuteGoal} size={56} stroke={6} label={minutes >= minuteGoal ? '✓' : String(minutes)} />
            <Text style={styles.tileTitle} numberOfLines={1}>
              {minutes >= minuteGoal ? 'Goal met' : `${minuteGoal - minutes} min to go`}
            </Text>
            <Text style={styles.tileSub}>🔥 {streak.count}-day streak</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Start today's review"
            disabled={!reviewQueue.length}
            onPress={() => router.push('/review')}
            style={[styles.tile, !reviewQueue.length && { opacity: 0.6 }]}>
            <Text style={styles.tileIcon}>🧠</Text>
            <Text style={styles.tileTitle} numberOfLines={1}>
              {reviewQueue.length ? `${reviewQueue.length} to review` : 'All reviewed'}
            </Text>
            <Text style={styles.tileSub}>{reviewQueue.length ? 'Start review ›' : 'Nice work'}</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.hint}>Swipe up for your ideas ↓</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingVertical: 12 },
  card: { flex: 1, borderRadius: 28, padding: 22, gap: 20, justifyContent: 'center', overflow: 'hidden' },
  greeting: { color: colors.text, fontFamily: displayFont, fontSize: 34 },
  hero: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  coverWrap: {
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 4, height: 10 },
    elevation: 10,
  },
  cover: { width: 118, height: 177, borderRadius: 6, backgroundColor: '#2E1E16' },
  plainCover: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  plainTitle: { color: '#F1E4C8', fontFamily: displayFont, fontSize: 18, textAlign: 'center' },
  heroText: { flex: 1, gap: 6 },
  kicker: { color: colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 24, lineHeight: 27 },
  author: { color: colors.muted, fontFamily: displayItalic, fontSize: 16 },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginTop: 4 },
  fill: { height: 5, backgroundColor: colors.accent },
  meta: { color: colors.muted, fontSize: 12 },
  button: { alignSelf: 'flex-start', marginTop: 6, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accent },
  buttonText: { color: colors.onAccent, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, alignItems: 'center', gap: 6, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)' },
  tileIcon: { fontSize: 34, height: 56, lineHeight: 56, textAlign: 'center' },
  tileTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  tileSub: { color: colors.muted, fontSize: 12 },
  hint: { color: colors.muted, textAlign: 'center', fontSize: 13 },
});
