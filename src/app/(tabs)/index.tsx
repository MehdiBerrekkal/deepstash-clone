import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, type LayoutChangeEvent, type ListViewToken } from 'react-native';
import { useNavigation } from 'expo-router';

import { IdeaCard } from '@/components/IdeaCard';
import { KindFilter } from '@/components/KindFilter';
import { useFeed, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { CardKind, Idea } from '@/lib/types';

export default function FeedScreen() {
  const [kind, setKind] = useState<CardKind | null>(null);
  const feed = useFeed(kind);
  const { streak, today, dailyGoal, markRead } = useStore();
  const navigation = useNavigation();
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Text style={styles.goal}>
            {Math.min(today.count, dailyGoal)}/{dailyGoal} today
          </Text>
          <Text style={styles.streak}>🔥 {streak.count}</Text>
        </View>
      ),
    });
  }, [navigation, streak.count, today.count, dailyGoal]);

  const onViewable = useCallback(
    ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
      for (const v of viewableItems) if (v.isViewable && v.item) markRead((v.item as Idea).id);
    },
    [markRead],
  );

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  return (
    <View style={styles.container}>
      <KindFilter value={kind} onChange={setKind} />
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
});
