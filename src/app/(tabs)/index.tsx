import { useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useNavigation } from 'expo-router';

import { IdeaCard } from '@/components/IdeaCard';
import { useFeed, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function FeedScreen() {
  const feed = useFeed();
  const { streak } = useStore();
  const navigation = useNavigation();
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={styles.streak}>🔥 {streak.count}</Text>,
    });
  }, [navigation, streak.count]);

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {height > 0 && (
        <FlatList
          data={feed}
          keyExtractor={(idea) => idea.id}
          renderItem={({ item, index }) => <IdeaCard idea={item} height={height} index={index} total={feed.length} />}
          pagingEnabled
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          windowSize={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  streak: { color: colors.accent, fontWeight: '700', fontSize: 16, marginRight: 16 },
});
