import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { IdeaRow } from '@/components/IdeaRow';
import { KindFilter } from '@/components/KindFilter';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { CardKind } from '@/lib/types';

const PAGE = 60;

export default function ExploreScreen() {
  const { ideas, topics, sources, sourceById } = useStore();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<CardKind | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    return ideas.filter((idea) => {
      if (kind && idea.kind !== kind) return false;
      if (!q) return true;
      const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;
      return [idea.title, idea.body, idea.author, source?.title, source?.author].some((s) => s?.toLowerCase().includes(q));
    });
  }, [ideas, q, kind, sourceById]);

  const books = useMemo(
    () => (q && (!kind || kind === 'idea') ? sources.filter((s) => `${s.title} ${s.author}`.toLowerCase().includes(q)) : []),
    [sources, q, kind],
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setLimit(PAGE);
        }}
        placeholder="Search ideas, quotes, poems, books, authors"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <KindFilter
        value={kind}
        onChange={(k) => {
          setKind(k);
          setLimit(PAGE);
        }}
      />
      <FlatList
        data={results.slice(0, limit)}
        keyExtractor={(idea) => idea.id}
        renderItem={({ item }) => <IdeaRow idea={item} />}
        contentContainerStyle={styles.list}
        onEndReached={() => setLimit((l) => l + PAGE)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          q ? (
            books.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.heading}>Books</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.books}>
                  {books.map((b) => (
                    <BookCover key={b.id} book={b} width={92} caption />
                  ))}
                </ScrollView>
                <Text style={styles.heading}>Cards · {results.length}</Text>
              </View>
            ) : (
              <Text style={styles.count}>{results.length} cards</Text>
            )
          ) : (
            <View style={styles.section}>
              <Text style={styles.heading}>Topics</Text>
              <View style={styles.topics}>
                {topics.map((topic) => (
                  <Pressable
                    key={topic.id}
                    onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topic.id } })}
                    style={[styles.topic, { backgroundColor: topic.color }]}>
                    <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                    <Text style={styles.topicName}>{topic.name}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.heading}>Everything · {results.length}</Text>
            </View>
          )
        }
        ListEmptyComponent={<Text style={styles.empty}>Nothing matches that search.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  search: {
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  list: { gap: 10, padding: 16, paddingTop: 4 },
  section: { gap: 12, marginBottom: 4 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  count: { color: colors.muted, marginBottom: 4 },
  books: { gap: 12 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topic: { flexGrow: 1, flexBasis: '45%', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 14 },
  topicEmoji: { fontSize: 18 },
  topicName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 32 },
});
