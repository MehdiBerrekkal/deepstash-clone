import { router } from 'expo-router';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { useStore } from '@/lib/store';
import { colors, sourceKindLabel } from '@/lib/theme';
import type { Idea } from '@/lib/types';

type Props = {
  idea: Idea;
  height: number;
  index: number;
  total: number;
};

export function IdeaCard({ idea, height, index, total }: Props) {
  const { topicById, sourceById, isSaved } = useStore();
  const topic = topicById[idea.topicId];
  const source = sourceById[idea.sourceId];
  const saved = isSaved(idea.id);

  const share = () =>
    Share.share({ message: `${idea.title}\n\n${idea.body}${source ? `\n\n— ${source.title}, ${source.author}` : ''}` });

  return (
    <View style={[styles.page, { height }]}>
      <View style={[styles.card, { backgroundColor: topic?.color ?? colors.surface }]}>
        <View style={styles.header}>
          <Text style={styles.topic}>
            {topic ? `${topic.emoji}  ${topic.name}` : ''}
          </Text>
          <Text style={styles.counter}>
            {index + 1} / {total}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{idea.title}</Text>
          <Text style={styles.body}>{idea.body}</Text>
        </View>

        {source && (
          <View style={styles.source}>
            <Text style={styles.sourceKind}>{sourceKindLabel[source.kind]}</Text>
            <Text style={styles.sourceTitle}>{source.title}</Text>
            <Text style={styles.sourceAuthor}>{source.author}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/idea/[id]', params: { id: idea.id } })}
            style={[styles.action, saved && styles.actionActive]}>
            <Text style={[styles.actionText, saved && styles.actionTextActive]}>{saved ? '★ Stashed' : '☆ Stash'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={share} style={styles.action}>
            <Text style={styles.actionText}>↗ Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingVertical: 12 },
  card: { flex: 1, borderRadius: 28, padding: 24, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  topic: { color: colors.text, fontSize: 14, fontWeight: '600', opacity: 0.9 },
  counter: { color: colors.text, fontSize: 13, opacity: 0.6 },
  content: { gap: 16 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  body: { color: colors.text, fontSize: 18, lineHeight: 28, opacity: 0.92 },
  source: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.3)', paddingTop: 14, gap: 2 },
  sourceKind: { color: colors.text, fontSize: 12, opacity: 0.7 },
  sourceTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sourceAuthor: { color: colors.text, fontSize: 14, opacity: 0.8 },
  actions: { flexDirection: 'row', gap: 12 },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  actionActive: { backgroundColor: colors.accent },
  actionText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  actionTextActive: { color: '#1A1300' },
});
