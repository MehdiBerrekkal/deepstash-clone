import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/EmptyState';
import { HIGHLIGHT_COLORS, displayFont, displayItalic } from '@/lib/bookType';
import { haptic } from '@/lib/haptics';
import { GRADES, intervalLabel, schedule, type Grade } from '@/lib/review';
import { localDate, useStore } from '@/lib/store';
import { cardKindById, colors } from '@/lib/theme';

const GRADE_LOOK: Record<Grade, { label: string; color: string }> = {
  again: { label: 'Again', color: '#C2554A' },
  hard: { label: 'Hard', color: '#C98A3A' },
  good: { label: 'Good', color: '#5E9B5A' },
  easy: { label: 'Easy', color: '#4F86C6' },
};

/** Today's review: recall each saved idea or highlight, reveal it, and say how well you remembered. */
export default function ReviewScreen() {
  const { reviewQueue, reviews, gradeReview, ideaById, highlights, sourceById, topicById } = useStore();
  // The session keeps its own order so "Again" can send a card to the back.
  const [session, setSession] = useState(() => reviewQueue);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [tally, setTally] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const today = localDate();
  // Skip anything unstashed or deleted since the session began.
  const exists = (k: string) => (k.startsWith('idea:') ? !!ideaById[k.slice(5)] : highlights.some((h) => `hl:${h.id}` === k));
  let at = index;
  while (at < session.length && !exists(session[at])) at++;
  const key = session[at];
  const total = new Set(session).size;
  const done = at >= session.length;

  const grade = (g: Grade) => {
    haptic.tap();
    gradeReview(key, g);
    setTally((t) => ({ ...t, [g]: t[g] + 1 }));
    if (g === 'again') setSession((s) => [...s, key]);
    setIndex(at + 1);
    setShown(false);
  };

  if (!session.length || done) {
    const reviewed = Object.values(tally).reduce((a, b) => a + b, 0);
    if (!reviewed) {
      return (
        <View style={[styles.container, styles.finish]}>
          <Stack.Screen options={{ title: 'Review' }} />
          <EmptyState
            art="brain"
            title="All caught up"
            text="Nothing is due right now. Stash ideas from the feed or highlight passages in full books, and they come back here on a smart schedule."
            action="Back to the feed"
            onAction={() => router.replace('/')}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Review' }} />
        <Animated.View entering={FadeIn} style={styles.finish}>
          <Text style={styles.finishIcon}>{reviewed ? '🧠' : '🌱'}</Text>
          <Text style={styles.finishTitle}>{reviewed ? 'Review done' : 'Nothing to review yet'}</Text>
          <Text style={styles.muted}>
            {reviewed
              ? `${total} ${total === 1 ? 'item' : 'items'} reviewed. Each will come back right before you'd forget it.`
              : 'Stash ideas from the feed or highlight passages in full books, and they show up here on a smart schedule.'}
          </Text>
          {reviewed > 0 && (
            <View style={styles.tally}>
              {GRADES.map((g) => (
                <View key={g} style={styles.tallyItem}>
                  <Text style={[styles.tallyValue, { color: GRADE_LOOK[g].color }]}>{tally[g]}</Text>
                  <Text style={styles.muted}>{GRADE_LOOK[g].label}</Text>
                </View>
              ))}
            </View>
          )}
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.primary}>
            <Text style={styles.primaryText}>Done</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  const idea = kind === 'idea' ? ideaById[id] : undefined;
  const highlight = kind === 'hl' ? highlights.find((h) => h.id === id) : undefined;
  const source = idea?.sourceId ? sourceById[idea.sourceId] : undefined;
  const topic = idea ? topicById[idea.topicId] : undefined;
  const isNew = !reviews[key];

  // The prompt: an idea's title, the start of a quote or highlight; the answer: the rest.
  const prompt = idea
    ? idea.kind === 'quote' || !idea.title
      ? `${idea.body.split(/\s+/).slice(0, 6).join(' ')} …`
      : idea.title
    : `${highlight!.text.split(/\s+/).slice(0, 7).join(' ')} …`;
  const hint = idea
    ? idea.kind === 'quote'
      ? 'How does this quote go on?'
      : idea.kind === 'poem'
        ? 'How does the poem go?'
        : 'What was the idea, and how would you use it?'
    : 'Where does this passage go, and why did you mark it?';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Review' }} />
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${(at / session.length) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View key={`${key}-${at}`} entering={FadeInDown.duration(260)} style={[styles.card, { borderColor: topic?.color ?? (highlight ? HIGHLIGHT_COLORS[highlight.color].solid : colors.border) }]}>
          <View style={styles.cardHead}>
            <Text style={styles.muted}>
              {idea ? (topic ? `${topic.emoji} ${topic.name}` : cardKindById[idea.kind].label) : `✎ ${highlight!.bookTitle}`}
            </Text>
            <Text style={[styles.badge, isNew && styles.badgeNew]}>{isNew ? 'NEW' : `${at + 1} / ${session.length}`}</Text>
          </View>
          <Text style={styles.prompt}>{prompt}</Text>
          {!shown ? (
            <Text style={styles.hint}>{hint}</Text>
          ) : (
            <Animated.View entering={FadeIn.duration(220)} style={styles.answer}>
              <Text style={styles.body}>{idea ? idea.body : `“${highlight!.text}”`}</Text>
              {!!highlight?.note && <Text style={styles.note}>✎ {highlight.note}</Text>}
              <Text style={styles.source}>
                {source ? `${source.title} · ${source.author}` : idea?.author ?? (highlight ? `${highlight.author} · ${highlight.chapterTitle}` : '')}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {!shown ? (
          <Pressable accessibilityLabel="Show answer" onPress={() => setShown(true)} style={styles.primary}>
            <Text style={styles.primaryText}>Show</Text>
          </Pressable>
        ) : (
          <View style={styles.grades}>
            {GRADES.map((g) => (
              <Pressable key={g} accessibilityLabel={GRADE_LOOK[g].label} onPress={() => grade(g)} style={[styles.grade, { backgroundColor: GRADE_LOOK[g].color }]}>
                <Text style={styles.gradeText}>{GRADE_LOOK[g].label}</Text>
                <Text style={styles.gradeSub}>{intervalLabel(schedule(reviews[key], g, today))}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progress: { height: 4, backgroundColor: colors.surface },
  progressFill: { height: 4, backgroundColor: colors.accent },
  content: { padding: 16, paddingBottom: 24, maxWidth: 680, width: '100%', alignSelf: 'center' },
  card: { borderRadius: 24, padding: 24, gap: 18, backgroundColor: colors.surface, borderTopWidth: 5, minHeight: 320 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  badgeNew: { color: colors.onAccent, backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  prompt: { color: colors.text, fontFamily: displayFont, fontSize: 28, lineHeight: 34 },
  hint: { color: colors.muted, fontStyle: 'italic', fontSize: 15 },
  answer: { gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 16 },
  body: { color: colors.text, fontFamily: 'Literata_400Regular', fontSize: 17, lineHeight: 27 },
  note: { color: colors.accent, fontSize: 15, lineHeight: 21 },
  source: { color: colors.muted, fontFamily: displayItalic, fontSize: 15 },
  footer: { padding: 16, paddingBottom: 28, maxWidth: 680, width: '100%', alignSelf: 'center' },
  primary: { alignItems: 'center', paddingVertical: 16, borderRadius: 999, backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  grades: { flexDirection: 'row', gap: 8 },
  grade: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 16 },
  gradeText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  gradeSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  muted: { color: colors.muted, lineHeight: 20, textAlign: 'center' },
  finish: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  finishIcon: { fontSize: 56 },
  finishTitle: { color: colors.text, fontFamily: displayFont, fontSize: 32 },
  tally: { flexDirection: 'row', gap: 22, marginVertical: 8 },
  tallyItem: { alignItems: 'center' },
  tallyValue: { fontSize: 26, fontWeight: '800' },
});
