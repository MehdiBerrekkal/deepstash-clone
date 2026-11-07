import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import type { IconName } from '@/components/Icon';
import { SectionHeader } from '@/components/SectionHeader';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

type Props = {
  title: string;
  books: Source[];
  /** Topic id for a "See all" link to the topic page. */
  topicId?: string;
  coverWidth?: number;
  icon?: IconName;
  subtitle?: string;
  /** A topic colour (hex) for the header's dot or icon. */
  tint?: string;
};

/** A titled horizontal row of book covers. */
export function Shelf({ title, books, topicId, coverWidth = 112, icon, subtitle, tint }: Props) {
  if (books.length === 0) return null;
  return (
    <View style={styles.shelf}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        tint={tint}
        right={
          topicId ? (
            <Pressable onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topicId } })} hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          ) : undefined
        }
      />
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
  shelf: { gap: 12 },
  seeAll: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  row: { gap: 14, paddingHorizontal: 16 },
});
