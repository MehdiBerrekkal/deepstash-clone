import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { Icon } from '@/components/Icon';
import { ReaderTour } from '@/components/ReaderTour';
import { ownSourceId, type OwnBook } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

const TOUR_ID = 'tour:my-books-1';

type Props = {
  books: OwnBook[];
  opening: boolean;
  error: string | null;
  onAdd: () => void;
  onOpen: (b: OwnBook) => void;
  onLongPress: (b: OwnBook) => void;
};

/**
 * Library → My books: the books you added yourself (EPUB and PDF files, free classics you downloaded, books from your
 * family), as a grid of covers. Adding a book is one button at the top; the family library sits next to it. The
 * first visit shows a short tour.
 */
export function MyBooks({ books, opening, error, onAdd, onOpen, onLongPress }: Props) {
  const { readerProgress, topics, audience } = useStore();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 5 : 3;
  const gap = 14;
  const coverW = Math.floor((Math.min(width, 900) - 32 - gap * (columns - 1)) / columns);

  const steps = [
    { id: 'add', target: 'Add a book', title: 'Add your own books', body: 'Tap here to open an EPUB or PDF from your phone. It stays on this device, and the app makes its main-idea cards.' },
    ...(audience === 'kid'
      ? []
      : [{ id: 'find', target: 'Find a free book', title: 'Or get a free classic', body: 'Thousands of public-domain books in English and French, one tap to download into My books.' }]),
    ...(books.length
      ? [{ id: 'book', target: `Open ${books[0].title}`, gesture: 'press' as const, title: 'Tap to read, hold for more', body: 'Tap a cover to read or see its main ideas. Hold it to share it with your family, rename it or delete it.' }]
      : []),
    { id: 'family', target: 'Family library', title: 'Your family library', body: 'Books your family shares with you appear here. Share one of yours by holding its cover.' },
  ];

  return (
    <View style={styles.wrap}>
      <ReaderTour steps={steps} busy={false} tourId={TOUR_ID} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add a book" disabled={opening} onPress={onAdd} style={({ pressed }) => [styles.add, pressed && styles.pressed]}>
          {opening ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <>
              <Icon name="plus" size={20} color={colors.onAccent} strokeWidth={2.6} />
              <Text style={styles.addText}>Add a book</Text>
            </>
          )}
        </Pressable>
        {audience !== 'kid' && (
          <Pressable accessibilityRole="button" accessibilityLabel="Find a free book" onPress={() => router.push('/find')} style={({ pressed }) => [styles.side, pressed && styles.pressed]}>
            <Icon name="search" size={18} color={colors.text} strokeWidth={2.2} />
            <Text style={styles.sideText}>Free books</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable accessibilityLabel="Family library" onPress={() => router.push('/family')} style={({ pressed }) => [styles.family, pressed && styles.pressed]}>
        <View style={styles.familyIcon}>
          <Icon name="users" size={20} color={colors.accent} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.familyTitle}>Family library</Text>
          <Text style={styles.sub}>Books your family shares with each other</Text>
        </View>
        <Icon name="chevronRight" size={20} color={colors.muted} strokeWidth={2.2} />
      </Pressable>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="inbox" size={36} color={colors.muted} strokeWidth={1.6} />
          <Text style={styles.emptyTitle}>No books of your own yet</Text>
          <Text style={styles.sub}>Add an EPUB or PDF from your phone, or download a free classic. They’ll all be here, in one place.</Text>
        </View>
      ) : (
        <View style={[styles.grid, { gap }]}>
          {books.map((b) => {
            const n = b.ideas?.length ?? 0;
            const fraction = readerProgress[`own:${b.id}`]?.fraction;
            const cover: Source = {
              id: ownSourceId(b.id),
              title: b.title,
              author: b.author === 'PDF' ? 'Your PDF' : b.author,
              kind: 'book',
              topicId: b.topicId ?? topics[0]?.id ?? '',
              description: '',
            };
            const tag = b.family ? `From ${b.family.from ?? 'family'}` : b.kind === 'pdf' ? 'PDF' : b.source ? 'Free classic' : 'EPUB';
            return (
              <View key={b.id} accessibilityLabel={`Open ${b.title}`} style={{ width: coverW }}>
                <BookCover
                  book={cover}
                  width={coverW}
                  caption
                  fraction={fraction}
                  favoriteKey={`own:${b.id}`}
                  subtitle={[tag, fraction != null ? `${Math.round(fraction * 100)}%` : n ? `${n} ideas` : ''].filter(Boolean).join(' · ')}
                  onPress={() => onOpen(b)}
                  onLongPress={() => onLongPress(b)}
                />
              </View>
            );
          })}
        </View>
      )}
      <Text style={styles.footer}>EPUB and PDF files without DRM. They stay on this device unless you share them with your family. Hold a cover for more.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16, paddingHorizontal: 16 },
  actions: { flexDirection: 'row', gap: 10 },
  add: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, backgroundColor: colors.accent },
  addText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  side: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 999, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  sideText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  error: { color: colors.danger, fontWeight: '600' },
  family: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.surface },
  familyIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  familyTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  sub: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  empty: { alignItems: 'center', gap: 8, padding: 28, borderRadius: 18, backgroundColor: colors.surface },
  emptyTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  footer: { color: colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
