import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { CardBody, POEM_PREVIEW_LINES } from '@/components/CardBody';
import { Icon } from '@/components/Icon';
import { haptic } from '@/lib/haptics';
import { detectLang, voiceForLanguage } from '@/lib/lang';
import { cardAudioUrl } from '@/lib/cardAudio';
import { speakOnce } from '@/lib/listen';
import { isNatural, playClip, unlockAudio } from '@/lib/neuralVoice';
import { APP_URL, shareMessage } from '@/lib/share';
import { useStore } from '@/lib/store';
import { cardKindById, colors, onCard, onCardScope, sourceKindIcon, sourceKindLabel } from '@/lib/theme';
import type { Idea } from '@/lib/types';

type Props = {
  idea: Idea;
  height: number;
  /** Shown top right, e.g. "3 / 6" in the book reader. */
  counter?: string;
  /** Hide the source footer (the reader already shows which book you're in). */
  hideSource?: boolean;
  /** Let a long body scroll inside the card. Only safe where pages swipe sideways, not in the vertical feed. */
  scrollable?: boolean;
  /** Why the feed picked this card, e.g. "Because you liked Atomic Habits". */
  reason?: string;
  /** Shows a "Not interested" button. */
  onNotInterested?: () => void;
};

/** Room in a card taken by everything except the body: padding, header, title, source and buttons. */
const CARD_CHROME = 300;
const SOURCE_BLOCK = 76;
const BODY_LINE = 25;

export function shareText(idea: Idea, sourceTitle?: string, sourceAuthor?: string): string {
  if (idea.kind === 'quote') return `“${idea.body}” — ${idea.author}`;
  if (idea.kind === 'poem') return `${idea.title}\nby ${idea.author}\n\n${idea.body}`;
  return `${idea.title}\n\n${idea.body}${sourceTitle ? `\n\n— ${sourceTitle}, ${sourceAuthor}` : ''}`;
}

export function IdeaCard({ idea, height, counter, hideSource = false, scrollable = false, reason, onNotInterested }: Props) {
  const { topicById, sourceById, isSaved, likedIdeaIds, toggleLike, readerSettings } = useStore();
  const topic = topicById[idea.topicId];
  const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;
  const saved = isSaved(idea.id);
  const liked = likedIdeaIds.includes(idea.id);
  const poemCut = idea.kind === 'poem' && idea.body.split('\n').length > POEM_PREVIEW_LINES;
  const compact = idea.body.length > 300;
  const { width } = useWindowDimensions();
  // In the feed, long cards show what fits and link to the full text; nothing is silently cut off.
  const showSource = !!source && !hideSource;
  const bodyLines = Math.max(4, Math.floor((height - CARD_CHROME - (reason ? 18 : 0) - (showSource ? SOURCE_BLOCK : 0)) / BODY_LINE));
  const charsPerLine = Math.max(20, Math.floor((Math.min(width, 700) - 112) / 7.1));
  const cut = !scrollable && (idea.kind === 'idea' || idea.kind === 'fact') && idea.body.length / charsPerLine > bodyLines;

  const open = () => router.push({ pathname: '/idea/[id]', params: { id: idea.id } });
  const share = () => void shareMessage(idea.title || 'An idea', `${shareText(idea, source?.title, source?.author)}\n\nMore like this on DeepStach:`, idea.id.startsWith('own-') ? `${APP_URL}/` : `${APP_URL}/idea/${encodeURIComponent(idea.id)}`);
  const [speaking, setSpeaking] = useState<null | (() => void)>(null);
  const listen = () => {
    if (speaking) return speaking();
    const words = idea.kind === 'quote' ? `${idea.body} ... ${idea.author}` : `${idea.title}. ${idea.body}`;
    const lang = detectLang(words);
    const chosen = voiceForLanguage(readerSettings, lang);
    const fallback = () => setSpeaking(() => speakOnce(words, () => setSpeaking(null), lang, chosen));
    // The studio recording, unless you picked a specific device voice.
    const recorded = !chosen || isNatural(chosen) ? cardAudioUrl(idea.id) : null;
    if (!recorded) return fallback();
    unlockAudio();
    const playback = playClip({ url: recorded, seconds: 0, ms: 0 });
    setSpeaking(() => playback.stop);
    playback.done.then(() => setSpeaking(null), fallback);
  };
  // Stop reading when the card scrolls away and unmounts.
  useEffect(() => () => speaking?.(), [speaking]);

  return (
    <View style={[styles.page, { height }]}>
      <View style={[styles.card, topic && onCardScope, { backgroundColor: topic?.color ?? colors.surface }]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.topic}>{topic ? topic.name : ''}</Text>
            {!!reason && (
              <Text style={styles.reason} numberOfLines={1}>
                {reason}
              </Text>
            )}
          </View>
          <Text style={styles.counter}>{counter ?? cardKindById[idea.kind].label}</Text>
          {onNotInterested && (
            <Pressable accessibilityRole="button" accessibilityLabel="Not interested" onPress={onNotInterested} hitSlop={10} style={styles.hide}>
              <Icon name="close" size={12} color={onCard.text} strokeWidth={2.6} />
            </Pressable>
          )}
        </View>

        {scrollable ? (
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <CardBody idea={idea} compact={compact} />
          </ScrollView>
        ) : (
          <Pressable onPress={open} style={styles.content}>
            <CardBody idea={idea} maxPoemLines={POEM_PREVIEW_LINES} compact={compact} bodyLines={cut ? bodyLines : undefined} />
            {poemCut && <Text style={styles.more}>Read the full poem →</Text>}
            {cut && <Text style={styles.more}>Read more ›</Text>}
          </Pressable>
        )}

        {source && !hideSource && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: source.id } })}
            style={styles.source}>
            <View style={styles.sourceText}>
              <View style={styles.sourceKindRow}>
                <Icon name={sourceKindIcon[source.kind]} size={13} color={onCard.muted} strokeWidth={2} />
                <Text style={styles.sourceKind}>{sourceKindLabel[source.kind]}</Text>
              </View>
              <Text style={styles.sourceTitle} numberOfLines={1}>
                {source.title}
              </Text>
              <Text style={styles.sourceAuthor} numberOfLines={1}>
                {source.author}
              </Text>
            </View>
            <View style={styles.sourceCta}>
              <Text style={styles.sourceCtaText}>Open</Text>
              <Icon name="chevronRight" size={15} color={onCard.text} strokeWidth={2.4} />
            </View>
          </Pressable>
        )}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Unlike' : 'Like'}
            onPress={() => {
              if (!liked) haptic.tap();
              toggleLike(idea.id);
            }}
            style={[styles.action, styles.actionSmall, liked && styles.actionLiked]}>
            <Icon name={liked ? 'heartFull' : 'heart'} size={21} color={onCard.text} strokeWidth={2} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Stashed' : 'Stash'} onPress={open} style={({ pressed }) => [styles.action, saved && styles.actionActive, pressed && styles.actionPressed]}>
            <Icon name={saved ? 'bookmarkFull' : 'bookmark'} size={18} color={saved ? colors.onAccent : onCard.text} strokeWidth={2} />
            <Text style={[styles.actionText, saved && styles.actionTextActive]}>{saved ? 'Stashed' : 'Stash'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={speaking ? 'Stop listening' : 'Listen'}
            onPress={listen}
            style={[styles.action, styles.actionSmall, speaking && styles.actionLiked]}>
            <Icon name={speaking ? 'stop' : 'speaker'} size={21} color={onCard.text} strokeWidth={2} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Share" onPress={share} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
            <Icon name="share" size={18} color={onCard.text} strokeWidth={2} />
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingVertical: 12 },
  card: { flex: 1, borderRadius: 28, padding: 24, justifyContent: 'space-between', gap: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  headerText: { flex: 1, gap: 3 },
  reason: { color: colors.text, fontSize: 12, fontWeight: '600', opacity: 0.75 },
  hide: { marginTop: -2, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  hideText: { color: colors.text, fontSize: 11, fontWeight: '800', opacity: 0.8 },
  topic: { color: colors.text, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.85 },
  counter: { color: colors.text, fontSize: 12, fontWeight: '600', opacity: 0.6 },
  content: { flexShrink: 1, gap: 12 },
  scrollContent: { paddingBottom: 8 },
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
  sourceKindRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sourceKind: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 },
  sourceTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sourceAuthor: { color: colors.text, fontSize: 14, opacity: 0.8 },
  sourceCta: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 8, paddingLeft: 14, paddingRight: 10, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.22)' },
  sourceCtaText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 46,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  actionPressed: { transform: [{ scale: 0.96 }], opacity: 0.85 },
  actionSmall: { flexGrow: 0, flexShrink: 0, flexBasis: 52, width: 52 },
  actionLiked: { backgroundColor: 'rgba(255,90,110,0.55)' },
  actionActive: { backgroundColor: colors.accent },
  actionText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  actionTextActive: { color: colors.onAccent },
});
