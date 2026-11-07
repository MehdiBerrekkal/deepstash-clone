import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/lib/store';
import { cardKindById, colors } from '@/lib/theme';
import type { Idea } from '@/lib/types';

export function IdeaRow({ idea }: { idea: Idea }) {
  const { topicById, sourceById } = useStore();
  const topic = topicById[idea.topicId];
  const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;
  const isQuote = idea.kind === 'quote';
  const byline = source ? `${source.title} · ${source.author}` : idea.author ?? cardKindById[idea.kind].label;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/idea/[id]', params: { id: idea.id } })}
      style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: topic?.color ?? colors.border }]}>
        <Text>{idea.kind === 'idea' ? topic?.emoji : cardKindById[idea.kind].emoji}</Text>
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, isQuote && styles.quote]} numberOfLines={isQuote ? 3 : 2}>
          {isQuote ? `“${idea.body}”` : idea.title}
        </Text>
        {!isQuote && (
          <Text style={styles.body} numberOfLines={2}>
            {idea.body}
          </Text>
        )}
        <Text style={styles.source} numberOfLines={1}>
          {byline}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surface },
  swatch: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  quote: { fontStyle: 'italic', fontWeight: '600' },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  source: { color: colors.muted, fontSize: 12, opacity: 0.8 },
});
