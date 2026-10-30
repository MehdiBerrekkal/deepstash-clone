import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { SkillRadar } from '@/components/brain/SkillRadar';
import { displayFont } from '@/lib/bookType';
import { GAMES, SKILLS, dailyGame } from '@/lib/brain/games';
import { QUIZ, QUIZ_CATEGORIES } from '@/data/brain/quiz';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** The Brain hub: pick Games or Quizzes, see your Brain score by skill, and today's challenge. */
export default function BrainScreen() {
  const { brain } = useStore();
  const [mode, setMode] = useState<'games' | 'quizzes'>('games');
  const { width } = useWindowDimensions();
  const today = localDate();
  const daily = brain.daily.date === today ? brain.daily : { game: false, quiz: false };
  const game = dailyGame(today);
  const scores = SKILLS.map((s) => brain.skills[s.id]).filter((v): v is number => v !== undefined);
  const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.segment}>
        {(['games', 'quizzes'] as const).map((m) => (
          <Pressable
            key={m}
            accessibilityLabel={m === 'games' ? 'Games' : 'Quizzes'}
            accessibilityState={{ selected: mode === m }}
            onPress={() => setMode(m)}
            style={[styles.segmentItem, mode === m && styles.segmentOn]}>
            <Text style={[styles.segmentText, mode === m && styles.segmentTextOn]}>{m === 'games' ? '🎮 Games' : '❓ Quizzes'}</Text>
          </Pressable>
        ))}
      </View>

      <Animated.View entering={FadeInDown.duration(350)} style={[styles.card, styles.daily]}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>⚡ Daily challenge</Text>
          <Text style={styles.done}>{daily.game && daily.quiz ? 'Done ✓' : `${Number(daily.game) + Number(daily.quiz)} / 2`}</Text>
        </View>
        <Text style={styles.muted}>One game and three questions, new every day. Counts toward your streak and daily minutes.</Text>
        <View style={styles.row}>
          <Pressable
            accessibilityLabel="Daily game"
            onPress={() => router.push({ pathname: '/brain/[game]', params: { game: game.id, daily: '1' } })}
            style={[styles.step, daily.game && styles.stepDone]}>
            <Text style={styles.stepEmoji}>{daily.game ? '✅' : game.emoji}</Text>
            <Text style={styles.stepText}>{game.name}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Daily questions"
            onPress={() => router.push({ pathname: '/brain/quiz', params: { category: 'daily' } })}
            style={[styles.step, daily.quiz && styles.stepDone]}>
            <Text style={styles.stepEmoji}>{daily.quiz ? '✅' : '❓'}</Text>
            <Text style={styles.stepText}>3 questions</Text>
          </Pressable>
        </View>
      </Animated.View>

      <View style={[styles.card, styles.scoreCard]}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>Brain score</Text>
          <Text style={styles.overall}>{overall ?? '–'}</Text>
        </View>
        <SkillRadar skills={brain.skills} size={Math.min(width - 64, 320)} />
        <Text style={styles.note}>
          {scores.length ? 'Each skill is a running average of your recent games and quizzes, out of 100.' : 'Play a few games and quizzes to see your skills.'} For fun
          and practice: it is not an IQ test.
        </Text>
      </View>

      {mode === 'games' ? (
        <Animated.View key="games" entering={FadeIn} style={styles.grid}>
          {GAMES.map((g, i) => (
            <Animated.View key={g.id} entering={FadeInDown.delay(i * 40).duration(300)} style={styles.tileWrap}>
              <Pressable accessibilityLabel={`Play ${g.name}`} onPress={() => router.push({ pathname: '/brain/[game]', params: { game: g.id } })} style={styles.tile}>
                <Text style={styles.tileEmoji}>{g.emoji}</Text>
                <Text style={styles.tileTitle}>{g.name}</Text>
                <Text style={styles.tileBlurb} numberOfLines={2}>
                  {g.blurb}
                </Text>
                <View style={styles.rowBetween}>
                  <Text style={styles.level}>
                    {'●'.repeat(brain.levels[g.id] ?? 1)}
                    {'○'.repeat(3 - (brain.levels[g.id] ?? 1))}
                  </Text>
                  <Text style={styles.best}>{brain.best[g.id] ? `🏆 ${brain.best[g.id]}` : 'New'}</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      ) : (
        <Animated.View key="quizzes" entering={FadeIn} style={styles.list}>
          {QUIZ_CATEGORIES.map((c, i) => (
            <Animated.View key={c.id} entering={FadeInDown.delay(i * 40).duration(300)}>
              <Pressable accessibilityLabel={`Quiz ${c.name}`} onPress={() => router.push({ pathname: '/brain/quiz', params: { category: c.id } })} style={styles.quizRow}>
                <Text style={styles.quizEmoji}>{c.emoji}</Text>
                <View style={styles.flex}>
                  <Text style={styles.tileTitle}>{c.name}</Text>
                  <Text style={styles.tileBlurb}>
                    {c.blurb} · {QUIZ.filter((q) => q.category === c.id).length} questions
                  </Text>
                </View>
                <Text style={styles.best}>{brain.best[`quiz-${c.id}`] ? `🏆 ${brain.best[`quiz-${c.id}`] / 10}/10` : '›'}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 40, maxWidth: 760, width: '100%', alignSelf: 'center' },
  segment: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  segmentOn: { backgroundColor: colors.accent },
  segmentText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  segmentTextOn: { color: colors.onAccent },
  card: { padding: 18, borderRadius: 22, backgroundColor: colors.surface, gap: 10 },
  daily: { borderWidth: 1, borderColor: 'rgba(242,184,75,0.4)' },
  scoreCard: { alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' },
  row: { flexDirection: 'row', gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  done: { color: colors.accent, fontWeight: '800' },
  overall: { color: colors.accent, fontFamily: displayFont, fontSize: 34 },
  muted: { color: colors.muted, lineHeight: 20 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 17, textAlign: 'center' },
  step: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  stepDone: { opacity: 0.6 },
  stepEmoji: { fontSize: 26 },
  stepText: { color: colors.text, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileWrap: { flexBasis: '47%', flexGrow: 1 },
  tile: { padding: 16, borderRadius: 20, backgroundColor: colors.surface, gap: 6, minHeight: 150 },
  tileEmoji: { fontSize: 30 },
  tileTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  tileBlurb: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  level: { color: colors.accent, letterSpacing: 2 },
  best: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  list: { gap: 10 },
  quizRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  quizEmoji: { fontSize: 28 },
  flex: { flex: 1, gap: 2 },
});
