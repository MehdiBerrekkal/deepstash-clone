import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BookCover } from '@/components/BookCover';
import type { Source } from '@/lib/types';

const GAP = 14;
const PADDING = 16;

/** Covers in rows of 3 (more on wide screens). */
export function BookGrid({ books }: { books: Source[] }) {
  const { width } = useWindowDimensions();
  const columns = width > 900 ? 6 : width > 600 ? 4 : 3;
  const coverWidth = Math.floor((Math.min(width, 1100) - PADDING * 2 - GAP * (columns - 1)) / columns);
  return (
    <View style={styles.grid}>
      {books.map((book) => (
        <BookCover key={book.id} book={book} width={coverWidth} caption />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: PADDING },
});
