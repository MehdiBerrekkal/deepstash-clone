import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Idea } from '@/lib/types';

export function IdeaRow({ idea }: { idea: Idea }) {
  const { topicById, sourceById } = useStore();
  const topic = topicById[idea.topicId];
  const source = sourceById[idea.sourceId];

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/idea/[id]', params: { id: idea.id } })}
      style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: topic?.color ?? colors.border }]}>
        <Text>{topic?.emoji}</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{idea.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {idea.body}
        </Text>
        {source && <Text style={styles.source}>{source.title} · {source.author}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surface },
  swatch: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  source: { color: colors.muted, fontSize: 12, opacity: 0.8 },
});
