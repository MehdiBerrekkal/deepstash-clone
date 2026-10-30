import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Shelf } from '@/components/Shelf';
import { classicBySourceId, classicReaderId } from '@/lib/fullbook';
import { useStore } from '@/lib/store';
import { colors, onCardScope, readMinutes, serif, sourceKindLabel } from '@/lib/theme';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sourceById, ideasBySource, topicById, bookProgress, sources, readerProgress } = useStore();
  const book = sourceById[id];

  if (!book) return <Text style={styles.muted}>Book not found.</Text>;

  const ideas = ideasBySource[book.id] ?? [];
  const topic = topicById[book.topicId];
  const progress = bookProgress[book.id];
  const minutes = readMinutes(ideas.map((i) => `${i.title} ${i.body}`));
  const related = sources.filter((s) => s.topicId === book.topicId && s.id !== book.id);
  const fullText = classicBySourceId[book.id];
  const fullProgress = fullText ? readerProgress[classicReaderId(fullText.id)] : undefined;

  const read = (start: number) => router.push({ pathname: '/read/[id]', params: { id: book.id, start: String(start) } });
  const primaryLabel = progress?.finishedAt
    ? 'Read again'
    : progress
      ? `Continue · idea ${progress.position + 1} of ${ideas.length}`
      : 'Start reading';

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, topic && onCardScope, { backgroundColor: topic?.color ?? colors.surface }]}>
          <BookCover book={book} width={140} favoriteKey={null} onPress={() => read(progress?.finishedAt ? 0 : progress?.position ?? 0)} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>
            {book.author}
            {book.year ? ` · ${book.year < 0 ? `${-book.year} BC` : book.year}` : ''}
          </Text>
          <Text style={styles.meta}>
            {sourceKindLabel[book.kind]} · {ideas.length} key ideas · {minutes} min read
          </Text>
        </View>

        <View style={styles.section}>
          <Pressable
            accessibilityRole="button"
            onPress={() => read(progress?.finishedAt ? 0 : progress?.position ?? 0)}
            style={styles.primary}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </Pressable>
          {fullText ? (
            <Pressable
              onPress={() => router.push({ pathname: '/reader/[id]', params: { id: fullText.id, kind: 'classic' } })}
              style={styles.fullBook}>
              <Text style={styles.fullBookText}>
                📚 {fullProgress ? `Continue the full book · ${Math.round(fullProgress.fraction * 100)}%` : 'Read the full book · free'}
              </Text>
            </Pressable>
          ) : book.free ? (
            <>
              <Pressable onPress={() => Linking.openURL(book.free!.url)} style={styles.fullBook}>
                <Text style={styles.fullBookText}>🎁 Download free from the author ↗</Text>
              </Pressable>
              <Text style={styles.freeHint}>
                Got the EPUB or PDF? Open it in Library → Your books → “Open your own book” to read it here.
              </Text>
            </>
          ) : (
            book.kind === 'book' && (
              <Pressable
                onPress={() => Linking.openURL(`https://openlibrary.org/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`)}
                style={styles.fullBook}>
                <Text style={styles.fullBookText}>Get the full book on Open Library ↗</Text>
              </Pressable>
            )
          )}
          <View style={styles.secondaryRow}>
            <FavoriteButton favoriteKey={`book:${book.id}`} title={book.title} size="large" />
            <Pressable
              onPress={() => Share.share({ message: `${book.title} by ${book.author}\n\n${book.description}` })}
              style={styles.secondary}>
              <Text style={styles.secondaryText}>↗ Share</Text>
            </Pressable>
          </View>

          <Text style={styles.description}>{book.description}</Text>
          {book.free && (
            <Text style={styles.freeHint}>
              {book.free.note}
              {book.free.license && (
                <>
                  {' '}License:{' '}
                  <Text style={styles.licenseLink} onPress={() => book.free?.licenseUrl && Linking.openURL(book.free.licenseUrl)}>
                    {book.free.license}
                  </Text>
                  , © {book.author}.
                </>
              )}
            </Text>
          )}
          {topic && (
            <Pressable onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topic.id } })}>
              <Text style={styles.topic}>
                {topic.emoji} {topic.name} ›
              </Text>
            </Pressable>
          )}

          <Text style={styles.heading}>Key ideas</Text>
          {ideas.map((idea, i) => {
            const done = progress?.finishedAt || (progress && i < progress.position);
            return (
              <Pressable key={idea.id} onPress={() => read(i)} style={styles.ideaRow}>
                <Text style={[styles.ideaNumber, done && styles.ideaDone]}>{done ? '✓' : i + 1}</Text>
                <Text style={styles.ideaTitle}>{idea.title}</Text>
              </Pressable>
            );
          })}
        </View>

        <Shelf title="More like this" books={related} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, gap: 24 },
  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 24, paddingHorizontal: 24, gap: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', fontFamily: serif, textAlign: 'center', marginTop: 12 },
  author: { color: colors.text, fontSize: 16, opacity: 0.85 },
  meta: { color: colors.text, fontSize: 13, opacity: 0.7 },
  section: { paddingHorizontal: 16, gap: 12 },
  primary: { paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  fullBook: { paddingVertical: 14, borderRadius: 999, alignItems: 'center', borderWidth: 1, borderColor: colors.accent },
  fullBookText: { color: colors.accent, fontWeight: '800', fontSize: 15 },
  freeHint: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  licenseLink: { color: colors.accent, fontWeight: '700' },
  secondary: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontWeight: '700' },
  description: { color: colors.text, fontSize: 16, lineHeight: 24, marginTop: 8 },
  topic: { color: colors.accent, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 12 },
  ideaRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, backgroundColor: colors.surface },
  ideaNumber: { color: colors.muted, fontWeight: '800', width: 22, textAlign: 'center' },
  ideaDone: { color: colors.accent },
  ideaTitle: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  muted: { color: colors.muted, padding: 24 },
});
