import { router } from 'expo-router';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { CardBody, POEM_PREVIEW_LINES } from '@/components/CardBody';
import { useStore } from '@/lib/store';
import { cardKindById, colors, sourceKindLabel } from '@/lib/theme';
import type { Idea } from '@/lib/types';

type Props = {
  idea: Idea;
  height: number;
  /** Shown top right, e.g. "3 / 6" in the book reader. */
  counter?: string;
  /** Hide the source footer (the reader already shows which book you're in). */
  hideSource?: boolean;
};

export function shareText(idea: Idea, sourceTitle?: string, sourceAuthor?: string): string {
  if (idea.kind === 'quote') return `“${idea.body}” — ${idea.author}`;
  if (idea.kind === 'poem') return `${idea.title}\nby ${idea.author}\n\n${idea.body}`;
  return `${idea.title}\n\n${idea.body}${sourceTitle ? `\n\n— ${sourceTitle}, ${sourceAuthor}` : ''}`;
}

export function IdeaCard({ idea, height, counter, hideSource = false }: Props) {
  const { topicById, sourceById, isSaved, likedIdeaIds, toggleLike } = useStore();
  const topic = topicById[idea.topicId];
  const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;
  const saved = isSaved(idea.id);
  const liked = likedIdeaIds.includes(idea.id);
  const poemCut = idea.kind === 'poem' && idea.body.split('\n').length > POEM_PREVIEW_LINES;
  const compact = idea.body.length > 420;

  const open = () => router.push({ pathname: '/idea/[id]', params: { id: idea.id } });
  const share = () => Share.share({ message: shareText(idea, source?.title, source?.author) });

  return (
    <View style={[styles.page, { height }]}>
      <View style={[styles.card, { backgroundColor: topic?.color ?? colors.surface }]}>
        <View style={styles.header}>
          <Text style={styles.topic}>{topic ? `${topic.emoji}  ${topic.name}` : ''}</Text>
          <Text style={styles.counter}>{counter ?? cardKindById[idea.kind].label}</Text>
        </View>

        <Pressable onPress={open} style={styles.content}>
          <CardBody idea={idea} maxPoemLines={POEM_PREVIEW_LINES} compact={compact} />
          {poemCut && <Text style={styles.more}>Read the full poem →</Text>}
        </Pressable>

        {source && !hideSource && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: source.id } })}
            style={styles.source}>
            <View style={styles.sourceText}>
              <Text style={styles.sourceKind}>{sourceKindLabel[source.kind]}</Text>
              <Text style={styles.sourceTitle} numberOfLines={1}>
                {source.title}
              </Text>
              <Text style={styles.sourceAuthor} numberOfLines={1}>
                {source.author}
              </Text>
            </View>
            <Text style={styles.sourceCta}>Read book ›</Text>
          </Pressable>
        )}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Unlike' : 'Like'}
            onPress={() => toggleLike(idea.id)}
            style={[styles.action, styles.actionSmall, liked && styles.actionLiked]}>
            <Text style={styles.actionText}>{liked ? '♥' : '♡'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={open} style={[styles.action, saved && styles.actionActive]}>
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
  card: { flex: 1, borderRadius: 28, padding: 24, justifyContent: 'space-between', gap: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  topic: { color: colors.text, fontSize: 14, fontWeight: '600', opacity: 0.9 },
  counter: { color: colors.text, fontSize: 13, opacity: 0.6 },
  content: { flexShrink: 1, gap: 12 },
  more: { color: colors.text, fontWeight: '700', opacity: 0.85 },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 14,
    gap: 12,
  },
  sourceText: { flex: 1, gap: 2 },
  sourceKind: { color: colors.text, fontSize: 12, opacity: 0.7 },
  sourceTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sourceAuthor: { color: colors.text, fontSize: 14, opacity: 0.8 },
  sourceCta: { color: colors.text, fontWeight: '700', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  actionSmall: { flex: 0, paddingHorizontal: 18 },
  actionLiked: { backgroundColor: 'rgba(255,90,110,0.55)' },
  actionActive: { backgroundColor: colors.accent },
  actionText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  actionTextActive: { color: colors.onAccent },
});
