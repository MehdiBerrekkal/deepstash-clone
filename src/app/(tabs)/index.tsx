import { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type LayoutChangeEvent, type ListViewToken } from 'react-native';
import { router, useNavigation } from 'expo-router';

import { GoalRing } from '@/components/GoalRing';
import { Icon } from '@/components/Icon';
import { IdeaCard } from '@/components/IdeaCard';
import { KindFilter } from '@/components/KindFilter';
import { TodayCard, useContinueReading } from '@/components/TodayCard';
import { minutesOf } from '@/lib/stats';
import { localDate, useFeed, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { FeedItem } from '@/lib/feed';
import type { CardKind } from '@/lib/types';
import { useT } from '@/lib/i18n';

export default function FeedScreen() {
  const [kind, setKind] = useState<CardKind | null>(null);
  const feed = useFeed(kind);
  const { streak, markRead, readingLog, minuteGoal, reviewQueue, setNotInterested, stashes } = useStore();
  const stashedCount = new Set(stashes.flatMap((s) => s.ideaIds)).size;
  const t = useT();
  const [undo, setUndo] = useState<string | null>(null);
  const continueBook = useContinueReading();
  // The first page is "Today" (your book, goal and review) when there's something to show and no filter is on.
  const showToday = !kind && (!!continueBook || reviewQueue.length > 0);
  const data: (FeedItem | 'today')[] = showToday ? ['today', ...feed] : feed;
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(t);
  }, [undo]);
  const minutes = minutesOf(readingLog[localDate()]);
  const navigation = useNavigation();
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Your stashes, ${stashedCount} ideas`}
          onPress={() => router.push('/stashes')}
          hitSlop={8}
          style={styles.headerStash}>
          <Icon name={stashedCount ? 'bookmarkFull' : 'bookmark'} size={21} color={colors.accent} strokeWidth={2} />
        </Pressable>
        <Pressable
          accessibilityLabel={`${minutes} of ${minuteGoal} minutes read today. Open your stats.`}
          onPress={() => router.push('/profile')}
          style={styles.headerRight}>
          <GoalRing progress={minutes / minuteGoal} size={30} stroke={3.5} label={minutes >= minuteGoal ? '✓' : String(minutes)} />
          <Text style={styles.goal}>{minutes >= minuteGoal ? t('Goal reached') : t('{n} min to go', { n: minuteGoal - minutes })}</Text>
          <View style={styles.streakRow}>
            <Icon name="flame" size={17} color="#FF8A4C" strokeWidth={2.2} />
            <Text style={styles.streak}>{streak.count}</Text>
          </View>
        </Pressable>
        </View>
      ),
    });
  }, [navigation, streak.count, minutes, minuteGoal, t, stashedCount]);

  // FlatList doesn't allow this callback to change after mount; markRead is stable.
  const [onViewable] = useState(() => ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    for (const v of viewableItems) if (v.isViewable && v.item && v.item !== 'today') markRead((v.item as FeedItem).idea.id);
  });

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  return (
    <View style={styles.container}>
      <KindFilter value={kind} onChange={setKind} />
      <View style={styles.list} onLayout={onLayout}>
        {height > 0 && (
          <FlatList
            key={kind ?? 'all'}
            data={data}
            keyExtractor={(item) => (item === 'today' ? 'today' : item.idea.id)}
            renderItem={({ item }) =>
              item === 'today' ? (
                <TodayCard height={height} book={continueBook} />
              ) : (
                <IdeaCard
                  idea={item.idea}
                  height={height}
                  reason={item.reason}
                  onNotInterested={() => {
                    setNotInterested(item.idea.id, true);
                    setUndo(item.idea.id);
                  }}
                />
              )
            }
            pagingEnabled
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
            windowSize={3}
            initialNumToRender={2}
            onViewableItemsChanged={onViewable}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60, minimumViewTime: 800 }}
          />
        )}
      </View>
      {undo && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Got it. You&apos;ll see fewer cards like that.</Text>
          <Pressable
            accessibilityLabel="Undo"
            onPress={() => {
              setNotInterested(undo, false);
              setUndo(null);
            }}>
            <Text style={styles.toastUndo}>Undo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerStash: { padding: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 },
  goal: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  streak: { color: colors.text, fontWeight: '800', fontSize: 16 },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.text,
  },
  toastText: { flex: 1, color: colors.background, fontWeight: '600' },
  toastUndo: { color: '#B5492F', fontWeight: '800' },
});
