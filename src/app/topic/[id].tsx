import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BookGrid } from '@/components/BookGrid';
import { IdeaRow } from '@/components/IdeaRow';
import { KindFilter } from '@/components/KindFilter';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { CardKind } from '@/lib/types';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { topicById, sources, ideas, followedTopicIds, setFollowedTopics } = useStore();
  const [kind, setKind] = useState<CardKind | null>(null);
  const topic = topicById[id];

  const books = useMemo(() => sources.filter((s) => s.topicId === id), [sources, id]);
  const cards = useMemo(() => ideas.filter((i) => i.topicId === id && (!kind || i.kind === kind)), [ideas, id, kind]);

  if (!topic) return <Text style={styles.muted}>Topic not found.</Text>;

  const following = followedTopicIds.includes(topic.id);
  const toggleFollow = () =>
    setFollowedTopics(following ? followedTopicIds.filter((t) => t !== topic.id) : [...followedTopicIds, topic.id]);

  return (
    <>
      <Stack.Screen options={{ title: topic.name }} />
      <FlatList
        data={cards}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.rowWrap}>
            <IdeaRow idea={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={[styles.banner, { backgroundColor: topic.color }]}>
              <Text style={styles.emoji}>{topic.emoji}</Text>
              <Text style={styles.name}>{topic.name}</Text>
              <Text style={styles.meta}>
                {books.length} books · {ideas.filter((i) => i.topicId === id).length} cards
              </Text>
              <Pressable
                disabled={following && followedTopicIds.length <= 1}
                onPress={toggleFollow}
                style={[styles.follow, following && styles.following]}>
                <Text style={[styles.followText, following && styles.followingText]}>{following ? '✓ Following' : '+ Follow'}</Text>
              </Pressable>
            </View>
            {books.length > 0 && (
              <>
                <Text style={styles.heading}>Books</Text>
                <BookGrid books={books} />
              </>
            )}
            <Text style={styles.heading}>Cards</Text>
            <KindFilter value={kind} onChange={setKind} />
          </View>
        }
        ListEmptyComponent={<Text style={styles.muted}>No cards of this kind in {topic.name} yet.</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32, gap: 10 },
  header: { gap: 12 },
  banner: { padding: 24, alignItems: 'center', gap: 6 },
  emoji: { fontSize: 44 },
  name: { color: colors.text, fontSize: 28, fontWeight: '800' },
  meta: { color: colors.text, opacity: 0.8 },
  follow: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 999, backgroundColor: colors.text },
  following: { backgroundColor: 'rgba(0,0,0,0.3)' },
  followText: { color: colors.background, fontWeight: '800' },
  followingText: { color: colors.text },
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', paddingHorizontal: 16, marginTop: 12 },
  rowWrap: { paddingHorizontal: 16 },
  muted: { color: colors.muted, padding: 24, textAlign: 'center' },
});
