import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

type Props = {
  title: string;
  books: Source[];
  /** Topic id for a "See all" link to the topic page. */
  topicId?: string;
  coverWidth?: number;
};

/** A titled horizontal row of book covers. */
export function Shelf({ title, books, topicId, coverWidth = 112 }: Props) {
  if (books.length === 0) return null;
  return (
    <View style={styles.shelf}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {topicId && (
          <Pressable onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topicId } })}>
            <Text style={styles.seeAll}>See all ›</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        data={books}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => <BookCover book={item} width={coverWidth} caption />}
        contentContainerStyle={styles.row}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  seeAll: { color: colors.accent, fontWeight: '700' },
  row: { gap: 14, paddingHorizontal: 16 },
});
