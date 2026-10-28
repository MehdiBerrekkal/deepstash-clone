import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IdeaRow } from '@/components/IdeaRow';
import { TopicChip } from '@/components/TopicChip';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function ExploreScreen() {
  const { ideas, topics, sourceById } = useStore();
  const [query, setQuery] = useState('');
  const [topicId, setTopicId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (topicId && idea.topicId !== topicId) return false;
      if (!q) return true;
      const source = sourceById[idea.sourceId];
      return [idea.title, idea.body, source?.title, source?.author].some((s) => s?.toLowerCase().includes(q));
    });
  }, [ideas, query, topicId, sourceById]);

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search ideas, books, authors"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {topics.map((topic) => (
            <TopicChip
              key={topic.id}
              topic={topic}
              selected={topicId === topic.id}
              onPress={() => setTopicId(topicId === topic.id ? null : topic.id)}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={results}
        keyExtractor={(idea) => idea.id}
        renderItem={({ item }) => <IdeaRow idea={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No ideas match that search.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  search: {
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  chips: { gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  list: { gap: 10, padding: 16 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 32 },
});
