import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ProgressChart } from '@/components/brain/ProgressChart';
import { SkillRadar } from '@/components/brain/SkillRadar';
import { GoalRing } from '@/components/GoalRing';
import { displayFont } from '@/lib/bookType';
import { GAMES, dailyGame, gameById, sessionGames } from '@/lib/brain/catalog';
import { DOMAINS, rankFor, type Skill } from '@/lib/brain/core';
import { QUIZ, QUIZ_CATEGORIES } from '@/data/brain/quiz';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Unfinished runs can be resumed for a day. */
const isRecent = (t: number) => Date.now() - t < 24 * 3600e3;

/** The training hub: rank and cognitive profile, tests, the daily challenge, a weekly plan, games by domain, quizzes. */
export default function BrainScreen() {
  const { brain, streak, patchBrain, setBrainSound } = useStore();
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
  // Today's session: three games aimed at your weaker areas, the same all day.
  const session = brain.session?.date === today ? brain.session : null;
  const sessionList = session?.games ?? sessionGames(brain.skills, brain.played, today);
  const sessionDone = session ? sessionList.filter((g) => session.done[g]).length : 0;
  const nextGame = sessionList.find((g) => !session?.done[g]);
  const startSession = () => {
    if (!session) patchBrain({ session: { date: today, games: sessionList, done: {} } });
    if (nextGame) open(nextGame, { session: '1' });
  };
  const run = brain.run && isRecent(brain.run.saved) && gameById[brain.run.id] ? brain.run : null;
  const sound = brain.sound !== false;
  const volume = brain.volume ?? 0.7;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient colors={['#2A2160', '#141A3A', '#0B0E1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.session}>
          <View style={styles.rowBetween}>
            <Text style={styles.heroKicker}>TODAY’S SESSION</Text>
            <Text style={styles.sessionMeta}>{streak.count > 0 ? `🔥 ${streak.count}-day streak` : 'about 6 min'}</Text>
          </View>
          <Text style={styles.sessionTitle}>{sessionDone >= 3 ? 'Session complete' : sessionDone ? `${sessionDone} of 3 done` : 'Three games, picked for you'}</Text>
          <View style={styles.sessionGames}>
            {sessionList.map((g, i) => {
              const gd = gameById[g];
              const dm = DOMAINS.find((d) => d.id === gd.skill)!;
              const r = session?.done[g];
              return (
                <View key={g} style={[styles.sessionGame, { borderColor: r ? '#3DDC97' : `${dm.color}66` }, g === nextGame && { borderColor: dm.color, backgroundColor: `${dm.color}1A` }]}>
                  <Text style={[styles.sessionGlyph, { color: r ? '#3DDC97' : dm.color }]}>{r ? '✓' : `${i + 1}`}</Text>
                  <Text style={styles.sessionName} numberOfLines={2}>
                    {gd.name}
                  </Text>
                  <Text style={[styles.sessionArea, { color: dm.color }]}>{r ? `${r.points} pts` : dm.name}</Text>
                </View>
              );
            })}
          </View>
          {nextGame ? (
            <Pressable accessibilityLabel="Start today's session" onPress={startSession} style={styles.sessionBtn}>
              <Text style={styles.sessionBtnText}>{sessionDone ? `Continue · ${gameById[nextGame].name}` : 'Start session'}</Text>
            </Pressable>
          ) : (
            <Text style={styles.heroSmall}>
              +{Object.values(session?.done ?? {}).reduce((a, r) => a + r.xp, 0)} XP today. A new mix tomorrow, or keep training below.
            </Text>
          )}
        </LinearGradient>
      </Animated.View>

      {run && (
        <Animated.View entering={FadeInDown.delay(30).duration(400)}>
          <Pressable accessibilityLabel="Continue unfinished game" onPress={() => open(run.id)} style={styles.continueCard}>
            <View style={styles.flex}>
              <Text style={styles.testKicker}>CONTINUE</Text>
              <Text style={styles.cardTitle}>{gameById[run.id].name}</Text>
              <Text style={styles.muted}>
                Question {run.n + 1} of {gameById[run.id].items} · Level {run.d} · {run.points} pts
              </Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(60).duration(400)}>
        <LinearGradient colors={['#1B2140', '#11152A', '#0B0E1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroKicker}>COGNITIVE PROFILE</Text>
              {profile !== null ? <Text style={styles.heroScore}>{profile}</Text> : <Text style={styles.heroEmpty}>Play a few games to build it</Text>}
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
          <View style={styles.rings}>
            {DOMAINS.map((d) => (
              <View key={d.id} style={styles.ringItem}>
                <GoalRing progress={(brain.skills[d.id] ?? 0) / 100} size={44} stroke={4} color={d.color} track="rgba(255,255,255,0.1)" label={brain.skills[d.id] !== undefined ? String(brain.skills[d.id]) : '–'} />
                <Text style={[styles.ringLabel, { color: d.color }]}>{d.short}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.heroKicker, { marginTop: 10 }]}>YOUR PROGRESS</Text>
          <ProgressChart history={brain.history ?? []} width={Math.min(width - 72, 640)} />
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
                            <Text style={styles.tileMeta}>Level {lv}</Text>
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
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Sound</Text>
          <Pressable accessibilityLabel={sound ? 'Mute brain sounds' : 'Turn brain sounds on'} onPress={() => setBrainSound(!sound)} style={[styles.toggle, sound && styles.toggleOn]}>
            <Text style={[styles.modeText, sound && styles.modeTextOn]}>{sound ? 'On' : 'Off'}</Text>
          </Pressable>
        </View>
        <View style={[styles.row, !sound && { opacity: 0.4 }]}>
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <Pressable key={v} accessibilityLabel={`Volume ${v * 100}%`} disabled={!sound} onPress={() => patchBrain({ volume: v })} style={[styles.modeChip, Math.abs(volume - v) < 0.13 && styles.volOn]}>
              <Text style={[styles.modeText, Math.abs(volume - v) < 0.13 && styles.modeTextOn]}>{v === 0.25 ? 'Soft' : v === 1 ? 'Loud' : `${v * 100}%`}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.muted}>Sounds play in the web app; the phone app adds haptics. Animations follow your device’s reduce-motion setting.</Text>
      </View>
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
  heroEmpty: { color: '#AEB5DA', fontSize: 15, marginTop: 8, maxWidth: 190 },
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
  session: { borderRadius: 26, padding: 20, gap: 12, borderWidth: 1, borderColor: 'rgba(183,140,255,0.35)' },
  sessionMeta: { color: '#FFB547', fontSize: 12, fontWeight: '800' },
  sessionTitle: { color: '#F2F4FF', fontFamily: displayFont, fontSize: 28, lineHeight: 32 },
  sessionGames: { flexDirection: 'row', gap: 8 },
  sessionGame: { flex: 1, minHeight: 96, borderRadius: 16, borderWidth: 1, padding: 10, gap: 4, backgroundColor: 'rgba(255,255,255,0.03)' },
  sessionGlyph: { fontWeight: '900', fontSize: 16 },
  sessionName: { color: '#F2F4FF', fontWeight: '800', fontSize: 13, lineHeight: 17 },
  sessionArea: { fontSize: 11, fontWeight: '800', marginTop: 'auto' },
  sessionBtn: { alignItems: 'center', paddingVertical: 15, borderRadius: 16, backgroundColor: '#B78CFF', minHeight: 50 },
  sessionBtnText: { color: '#0B0D14', fontWeight: '900', fontSize: 16 },
  continueCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: '#7C8CFF' },
  chev: { color: '#7C8CFF', fontSize: 32, fontWeight: '300' },
  rings: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  ringItem: { alignItems: 'center', gap: 4 },
  ringLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  toggle: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surfaceRaised, minWidth: 60, alignItems: 'center' },
  toggleOn: { backgroundColor: '#3DDC97' },
  volOn: { backgroundColor: '#7C8CFF' },
  disclaimer: { color: colors.muted, fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 6 },
});
