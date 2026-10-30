import { useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type LayoutChangeEvent, type ListViewToken } from 'react-native';
import { router, useNavigation } from 'expo-router';

import { GoalRing } from '@/components/GoalRing';
import { IdeaCard } from '@/components/IdeaCard';
import { KindFilter } from '@/components/KindFilter';
import { minutesOf } from '@/lib/stats';
import { localDate, useFeed, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { CardKind, Idea } from '@/lib/types';

export default function FeedScreen() {
  const [kind, setKind] = useState<CardKind | null>(null);
  const feed = useFeed(kind);
  const { streak, markRead, readingLog, minuteGoal, reviewQueue } = useStore();
  const minutes = minutesOf(readingLog[localDate()]);
  const navigation = useNavigation();
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          accessibilityLabel={`${minutes} of ${minuteGoal} minutes read today. Open your stats.`}
          onPress={() => router.push('/profile')}
          style={styles.headerRight}>
          <GoalRing progress={minutes / minuteGoal} size={30} stroke={3.5} label={minutes >= minuteGoal ? '✓' : String(minutes)} />
          <Text style={styles.goal}>
            {minutes >= minuteGoal ? 'Goal met' : `${minuteGoal - minutes} min to go`}
          </Text>
          <Text style={styles.streak}>🔥 {streak.count}</Text>
        </Pressable>
      ),
    });
  }, [navigation, streak.count, minutes, minuteGoal]);

  // FlatList doesn't allow this callback to change after mount; markRead is stable.
  const [onViewable] = useState(() => ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    for (const v of viewableItems) if (v.isViewable && v.item) markRead((v.item as Idea).id);
  });

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  return (
    <View style={styles.container}>
      <KindFilter value={kind} onChange={setKind} />
      {reviewQueue.length > 0 && (
        <Pressable accessibilityLabel="Start today's review" onPress={() => router.push('/review')} style={styles.review}>
          <Text style={styles.reviewIcon}>🧠</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewTitle}>Today&apos;s review</Text>
            <Text style={styles.reviewSub}>
              {reviewQueue.length} {reviewQueue.length === 1 ? 'idea' : 'ideas'} to recall · about {Math.max(1, Math.round(reviewQueue.length * 0.4))} min
            </Text>
          </View>
          <Text style={styles.reviewGo}>Start ›</Text>
        </Pressable>
      )}
      <View style={styles.list} onLayout={onLayout}>
        {height > 0 && (
          <FlatList
            key={kind ?? 'all'}
            data={feed}
            keyExtractor={(idea) => idea.id}
            renderItem={({ item }) => <IdeaCard idea={item} height={height} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 },
  goal: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  streak: { color: colors.accent, fontWeight: '700', fontSize: 16 },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(242,184,75,0.35)',
  },
  reviewIcon: { fontSize: 22 },
  reviewTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  reviewSub: { color: colors.muted, fontSize: 13 },
  reviewGo: { color: colors.accent, fontWeight: '800' },
});
