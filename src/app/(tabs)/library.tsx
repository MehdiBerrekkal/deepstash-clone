import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookGrid } from '@/components/BookGrid';
import { Shelf } from '@/components/Shelf';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function LibraryScreen() {
  const { sources, topics, followedTopicIds, bookProgress, savedBookIds, sourceById } = useStore();
  const [query, setQuery] = useState('');

  const shelves = useMemo(() => {
    const inProgress = Object.entries(bookProgress)
      .filter(([id, p]) => !p.finishedAt && sourceById[id])
      .sort(([, a], [, b]) => b.startedAt.localeCompare(a.startedAt))
      .map(([id]) => sourceById[id]);
    const finished = Object.entries(bookProgress)
      .filter(([id, p]) => p.finishedAt && sourceById[id])
      .map(([id]) => sourceById[id]);
    const saved = savedBookIds.map((id) => sourceById[id]).filter(Boolean);
    const followed = new Set(followedTopicIds);
    const byTopic = [...topics]
      .sort((a, b) => Number(followed.has(b.id)) - Number(followed.has(a.id)))
      .map((topic) => ({ topic, books: sources.filter((s) => s.topicId === topic.id) }))
      .filter((s) => s.books.length > 0);
    return { inProgress, finished, saved, byTopic };
  }, [sources, topics, followedTopicIds, bookProgress, savedBookIds, sourceById]);

  const q = query.trim().toLowerCase();
  const results = q ? sources.filter((s) => `${s.title} ${s.author}`.toLowerCase().includes(q)) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${sources.length} books and authors`}
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      {q ? (
        <>
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'book' : 'books'}
          </Text>
          <BookGrid books={results} />
        </>
      ) : (
        <>
          <Shelf title="Continue reading" books={shelves.inProgress} />
          <Shelf title="Want to read" books={shelves.saved} />
          {shelves.byTopic.map(({ topic, books }) => (
            <Shelf key={topic.id} title={`${topic.emoji} ${topic.name}`} books={books} topicId={topic.id} />
          ))}
          <Shelf title="Finished" books={shelves.finished} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Covers from Open Library. Every summary is written in our own words.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { gap: 28, paddingBottom: 32 },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: -8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  count: { color: colors.muted, paddingHorizontal: 16 },
  footer: { paddingHorizontal: 16 },
  footerText: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
