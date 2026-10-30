import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { SkillRadar } from '@/components/brain/SkillRadar';
import { displayFont } from '@/lib/bookType';
import { GAMES, dailyGame } from '@/lib/brain/catalog';
import { DOMAINS, rankFor, type Skill } from '@/lib/brain/core';
import { QUIZ, QUIZ_CATEGORIES } from '@/data/brain/quiz';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** The training hub: rank and cognitive profile, tests, the daily challenge, a weekly plan, games by domain, quizzes. */
export default function BrainScreen() {
  const { brain } = useStore();
  const [mode, setMode] = useState<'training' | 'quizzes'>('training');
  const [quizMode, setQuizMode] = useState<'standard' | 'timed' | 'hard'>('standard');
  const { width } = useWindowDimensions();
  const today = localDate();
  const daily = brain.daily.date === today ? brain.daily : { game: false, quiz: false };
  const dg = dailyGame(today);
  const rank = rankFor(brain.xp ?? 0);
  const scores = DOMAINS.map((d) => brain.skills[d.id]).filter((v): v is number => v !== undefined);
  const profile = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const lastTest = brain.tests?.[0];
  // The weekly plan leans on your weakest domains (or ones you haven't tried).
  const weakest = [...DOMAINS].sort((a, b) => (brain.skills[a.id] ?? -1) - (brain.skills[b.id] ?? -1)).slice(0, 2);
  const plan = weakest.flatMap((d) => GAMES.filter((g) => g.skill === d.id).sort((a, b) => (brain.played[a.id] ?? 0) - (brain.played[b.id] ?? 0)).slice(0, 2));
  const open = (id: string, params: Record<string, string> = {}) => router.push({ pathname: '/brain/[game]', params: { game: id, ...params } });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient colors={['#1B2140', '#11152A', '#0B0E1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroKicker}>COGNITIVE PROFILE</Text>
              <Text style={styles.heroScore}>{profile ?? '—'}</Text>
            </View>
            <View style={[styles.rankBadge, { borderColor: rank.color }]}>
              <Text style={[styles.rankText, { color: rank.color }]}>◆ {rank.name}</Text>
              <Text style={styles.rankXp}>{brain.xp ?? 0} XP</Text>
            </View>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${rank.progress * 100}%`, backgroundColor: rank.color }]} />
          </View>
          <Text style={styles.heroSmall}>{rank.next ? `${rank.next.xp - (brain.xp ?? 0)} XP to ${rank.next.name}` : 'Top rank'}</Text>
          <View style={styles.radar}>
            <SkillRadar skills={brain.skills} size={Math.min(width - 72, 320)} />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.testRow}>
        <Pressable accessibilityLabel="Full IQ-style test" onPress={() => router.push({ pathname: '/brain/test', params: { mode: 'full' } })} style={[styles.testCard, styles.testMain]}>
          <Text style={styles.testKicker}>ASSESSMENT</Text>
          <Text style={styles.testTitle}>IQ-style test</Text>
          <Text style={styles.testSub}>38 items · 25 min · 4 sections</Text>
          {lastTest && (
            <Text style={styles.testLast}>
              Last: {lastTest.iq} ({lastTest.mode === 'full' ? 'full' : 'quick'})
            </Text>
          )}
        </Pressable>
        <Pressable accessibilityLabel="Quick test" onPress={() => router.push({ pathname: '/brain/test', params: { mode: 'quick' } })} style={styles.testCard}>
          <Text style={styles.testKicker}>QUICK</Text>
          <Text style={styles.testTitle}>15-min test</Text>
          <Text style={styles.testSub}>16 items</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Daily challenge</Text>
          <Text style={styles.accent}>{daily.game && daily.quiz ? 'Complete ✓' : `${Number(daily.game) + Number(daily.quiz)}/2`}</Text>
        </View>
        <View style={styles.row}>
          <Pressable accessibilityLabel="Daily game" onPress={() => open(dg.id, { daily: '1' })} style={[styles.step, daily.game && styles.done]}>
            <Text style={[styles.stepGlyph, { color: DOMAINS.find((d) => d.id === dg.skill)!.color }]}>{daily.game ? '✓' : DOMAINS.find((d) => d.id === dg.skill)!.glyph}</Text>
            <Text style={styles.stepText}>{dg.name}</Text>
          </Pressable>
          <Pressable accessibilityLabel="Daily questions" onPress={() => router.push({ pathname: '/brain/quiz', params: { category: 'daily' } })} style={[styles.step, daily.quiz && styles.done]}>
            <Text style={[styles.stepGlyph, { color: '#FF6FB5' }]}>{daily.quiz ? '✓' : '?'}</Text>
            <Text style={styles.stepText}>3 hard questions</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.card}>
        <Text style={styles.cardTitle}>This week’s plan</Text>
        <Text style={styles.muted}>
          {scores.length ? `Focus on ${weakest.map((d) => d.name).join(' and ')}, your lowest areas. Three short sessions a week beats one long one.` : 'Start with these to build your profile. Three short sessions a week works best.'}
        </Text>
        <View style={styles.chips}>
          {plan.map((g) => (
            <Pressable key={g.id} onPress={() => open(g.id)} style={[styles.chip, { borderColor: DOMAINS.find((d) => d.id === g.skill)!.color }]}>
              <Text style={styles.chipText}>{g.name}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <View style={styles.segment}>
        {(['training', 'quizzes'] as const).map((m) => (
          <Pressable key={m} accessibilityLabel={m === 'training' ? 'Training' : 'Quizzes'} onPress={() => setMode(m)} style={[styles.segmentItem, mode === m && styles.segmentOn]}>
            <Text style={[styles.segmentText, mode === m && styles.segmentTextOn]}>{m === 'training' ? `Training · ${GAMES.length}` : `Quizzes · ${QUIZ.length}`}</Text>
          </Pressable>
        ))}
      </View>

      {mode === 'training' ? (
        <Animated.View key="training" entering={FadeIn} style={styles.sections}>
          {DOMAINS.map((d) => {
            const games = GAMES.filter((g) => g.skill === d.id);
            if (!games.length) return null;
            return (
              <View key={d.id} style={styles.section}>
                <View style={styles.sectionHead}>
                  <Text style={[styles.sectionGlyph, { color: d.color }]}>{d.glyph}</Text>
                  <Text style={styles.sectionTitle}>{d.name}</Text>
                  <Text style={[styles.sectionScore, { color: d.color }]}>{brain.skills[d.id as Skill] ?? '—'}</Text>
                </View>
                <View style={styles.grid}>
                  {games.map((g) => {
                    const lv = brain.levels[g.id] ?? 2;
                    return (
                      <Pressable key={g.id} accessibilityLabel={`Play ${g.name}`} onPress={() => open(g.id)} style={styles.tileWrap}>
                        <LinearGradient colors={[`${d.color}26`, `${d.color}05`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.tile, { borderColor: `${d.color}40` }]}>
                          <Text style={styles.tileTitle}>{g.name}</Text>
                          <Text style={styles.tileBlurb} numberOfLines={2}>
                            {g.blurb}
                          </Text>
                          <View style={styles.levelTrack}>
                            <View style={[styles.levelFill, { width: `${lv * 10}%`, backgroundColor: d.color }]} />
                          </View>
                          <View style={styles.rowBetween}>
                            <Text style={styles.tileMeta}>D{lv}</Text>
                            <Text style={styles.tileMeta}>{brain.best[g.id] ? `Best ${brain.best[g.id]}` : 'New'}</Text>
                          </View>
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </Animated.View>
      ) : (
        <Animated.View key="quizzes" entering={FadeIn} style={styles.sections}>
          <View style={styles.row}>
            {(['standard', 'timed', 'hard'] as const).map((m) => (
              <Pressable key={m} onPress={() => setQuizMode(m)} style={[styles.modeChip, quizMode === m && styles.modeOn]}>
                <Text style={[styles.modeText, quizMode === m && styles.modeTextOn]}>{m === 'standard' ? 'Standard' : m === 'timed' ? 'Timed · 20 s' : 'Hard only'}</Text>
              </Pressable>
            ))}
          </View>
          {QUIZ_CATEGORIES.map((c) => (
            <Pressable key={c.id} accessibilityLabel={`Quiz ${c.name}`} onPress={() => router.push({ pathname: '/brain/quiz', params: { category: c.id, mode: quizMode } })} style={styles.quizRow}>
              <View style={styles.flex}>
                <Text style={styles.tileTitle}>{c.name}</Text>
                <Text style={styles.tileBlurb}>
                  {c.blurb} · {QUIZ.filter((q) => q.category === c.id).length} questions
                </Text>
              </View>
              <Text style={styles.accent}>{brain.best[`quiz-${c.id}`] ? `${brain.best[`quiz-${c.id}`] / 10}/10` : '›'}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
      <Text style={styles.disclaimer}>Scores here are estimates for practice and fun. They are not a clinically validated IQ test.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 40, maxWidth: 760, width: '100%', alignSelf: 'center' },
  flex: { flex: 1 },
  hero: { borderRadius: 26, padding: 20, gap: 10, borderWidth: 1, borderColor: 'rgba(124,140,255,0.25)' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroKicker: { color: '#8E97C8', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  heroScore: { color: '#F2F4FF', fontFamily: displayFont, fontSize: 56, lineHeight: 60, fontVariant: ['lining-nums'] },
  rankBadge: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.04)' },
  rankText: { fontWeight: '900', fontSize: 16 },
  rankXp: { color: '#8E97C8', fontSize: 12, fontWeight: '700' },
  xpTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  xpFill: { height: 6, borderRadius: 3 },
  heroSmall: { color: '#8E97C8', fontSize: 12 },
  radar: { alignItems: 'center', marginTop: 4 },
  testRow: { flexDirection: 'row', gap: 10 },
  testCard: { flex: 1, borderRadius: 20, padding: 16, gap: 4, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  testMain: { flex: 1.5, borderColor: 'rgba(124,140,255,0.5)', backgroundColor: 'rgba(124,140,255,0.08)' },
  testKicker: { color: '#7C8CFF', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  testTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },
  testSub: { color: colors.muted, fontSize: 12 },
  testLast: { color: '#7C8CFF', fontSize: 12, fontWeight: '800', marginTop: 4 },
  card: { borderRadius: 20, padding: 16, gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  muted: { color: colors.muted, lineHeight: 20 },
  accent: { color: '#7C8CFF', fontWeight: '900' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  step: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  done: { opacity: 0.55 },
  stepGlyph: { fontSize: 24, fontWeight: '900' },
  stepText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  chipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  segment: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 12 },
  segmentOn: { backgroundColor: colors.surface },
  segmentText: { color: colors.muted, fontWeight: '800' },
  segmentTextOn: { color: colors.text },
  sections: { gap: 18 },
  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionGlyph: { fontSize: 18, fontWeight: '900' },
  sectionTitle: { color: colors.text, fontWeight: '900', fontSize: 17, flex: 1 },
  sectionScore: { fontWeight: '900', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tileWrap: { flexBasis: '47%', flexGrow: 1 },
  tile: { borderRadius: 18, padding: 14, gap: 6, minHeight: 130, borderWidth: 1 },
  tileTitle: { color: colors.text, fontWeight: '900', fontSize: 15 },
  tileBlurb: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  levelTrack: { height: 4, borderRadius: 2, backgroundColor: colors.surfaceRaised, overflow: 'hidden', marginTop: 'auto' },
  levelFill: { height: 4, borderRadius: 2 },
  tileMeta: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  modeChip: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 12, backgroundColor: colors.surfaceRaised },
  modeOn: { backgroundColor: '#FF6FB5' },
  modeText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  modeTextOn: { color: '#0B0D14' },
  quizRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  disclaimer: { color: colors.muted, fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 6 },
});
