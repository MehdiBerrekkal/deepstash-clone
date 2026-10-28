import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { FavoriteButton } from '@/components/FavoriteButton';
import { classicAsSource } from '@/lib/classicSource';
import { classicById } from '@/lib/fullbook';
import { previewPdf } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

const GAP = 14;

/** Every book you hearted: library books, full classics and your own files, newest first. */
export default function FavoritesScreen() {
  const { favoriteBooks, sourceById, ownBooks } = useStore();
  const { width } = useWindowDimensions();
  const columns = width > 900 ? 6 : width > 600 ? 4 : 3;
  const coverWidth = Math.floor((Math.min(width, 1100) - 32 - GAP * (columns - 1)) / columns);

  const covers = favoriteBooks.flatMap((key): { key: string; book: Source; onPress?: () => void }[] => {
    const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
    if (kind === 'book' && sourceById[id]) return [{ key, book: sourceById[id], onPress: undefined }];
    if (kind === 'classic' && classicById[id]) {
      return [{ key, book: classicAsSource(classicById[id]), onPress: () => router.push({ pathname: '/classic/[id]', params: { id } }) }];
    }
    return [];
  });
  const files = favoriteBooks
    .filter((k) => k.startsWith('own:'))
    .map((k) => ownBooks.find((b) => `own:${b.id}` === k))
    .filter((b) => b !== undefined);

  if (covers.length === 0 && files.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyHeart}>♡</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>Tap the heart on any book cover or book page and it shows up here.</Text>
        <Pressable onPress={() => router.replace('/library')} style={styles.button}>
          <Text style={styles.buttonText}>Browse the Library</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.count}>
        {covers.length + files.length} {covers.length + files.length === 1 ? 'book' : 'books'}
      </Text>
      <View style={styles.grid}>
        {covers.map(({ key, book, onPress }) => (
          <BookCover key={key} book={book} width={coverWidth} caption favoriteKey={key} onPress={onPress} />
        ))}
      </View>
      {files.length > 0 && (
        <View style={styles.files}>
          <Text style={styles.heading}>Your files</Text>
          {files.map((b) => (
            <View key={b.id} style={styles.fileRow}>
              <Pressable
                style={styles.fileInfo}
                onPress={() => {
                  if (b.kind === 'epub') router.push({ pathname: '/reader/[id]', params: { id: b.id, kind: 'own' } });
                  else if (Platform.OS === 'web') router.push({ pathname: '/pdf/[id]', params: { id: b.id } });
                  else previewPdf(b).catch(() => {});
                }}>
                <Text style={styles.badge}>{b.kind === 'pdf' ? 'PDF' : 'EPUB'}</Text>
                <Text style={styles.fileTitle} numberOfLines={1}>
                  {b.title}
                </Text>
              </Pressable>
              <View style={styles.fileHeart}>
                <FavoriteButton favoriteKey={`own:${b.id}`} title={b.title} />
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  count: { color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  files: { gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  fileRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.surface },
  fileInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { color: colors.onAccent, backgroundColor: colors.accent, fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, overflow: 'hidden' },
  fileTitle: { color: colors.text, fontWeight: '700', flex: 1 },
  fileHeart: { width: 36, height: 36 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10, backgroundColor: colors.background },
  emptyHeart: { color: '#FF6B81', fontSize: 48 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  emptyText: { color: colors.muted, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  button: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999, backgroundColor: colors.accent },
  buttonText: { color: colors.onAccent, fontWeight: '800' },
});
