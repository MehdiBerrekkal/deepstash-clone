import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { displayFont } from '@/lib/bookType';
import { seeded, type Rng } from '@/lib/brain/core';
import { sfx } from '@/lib/brain/sfx';
import { celebrate } from '@/lib/celebrate';
import { QUIZ, QUIZ_CATEGORIES, type QuizCategory, type QuizQuestion } from '@/data/brain/quiz';
import { haptic } from '@/lib/haptics';
import { detectLang, voiceForLanguage } from '@/lib/lang';
import { speakOnce } from '@/lib/listen';
import { prewarmNatural } from '@/lib/neuralVoice';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const SET_SIZE = 10;
const QUESTION_SECONDS = 20;

function shuffle<T>(rng: Rng, xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A set of questions: easy first, harder later. The daily set is three questions everyone gets that day. */
function buildSet(category: QuizCategory | 'daily', seed: string, hard: boolean): QuizQuestion[] {
  const rng = seeded(seed);
  if (category === 'daily') return shuffle(rng, QUIZ.filter((q) => q.category !== 'culture' && q.level === 3)).slice(0, 3);
  const pool = QUIZ.filter((q) => q.category === category);
  const by = (l: number, n: number) => shuffle(rng, pool.filter((q) => q.level === l)).slice(0, n);
  const set = hard ? [...by(2, 4), ...by(3, 6)] : [...by(1, 2), ...by(2, 4), ...by(3, 4)];
  // Top up from any level if a category is short of one level.
  const rest = shuffle(rng, pool.filter((q) => !set.includes(q)));
  return [...set, ...rest].slice(0, SET_SIZE);
}

/** Answer options shuffled, with the right one's new position. */
function shuffled(q: QuizQuestion, rng: Rng) {
  const order = shuffle(rng, q.options.map((_, i) => i));
  return { options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

/** A quiz: one question at a time, feedback and the reason right after each answer, a score at the end. */
export default function QuizScreen() {
  const { category, mode } = useLocalSearchParams<{ category: QuizCategory | 'daily'; mode?: 'standard' | 'timed' | 'hard' }>();
  const timed = mode === 'timed';
  const { recordBrain, markBrainDaily, brain, readerSettings } = useStore();
  const daily = category === 'daily';
  const meta = QUIZ_CATEGORIES.find((c) => c.id === category);
  const french = meta?.lang === 'fr';
  const [seed] = useState(() => (daily ? `quiz-${localDate()}` : `${category}-${Math.random()}`));
  const [questions] = useState(() => buildSet(category, seed, mode === 'hard'));
  const [left, setLeft] = useState(QUESTION_SECONDS);
  const [rng] = useState(() => seeded(`${seed}-options`));
  const [order] = useState(() => questions.map((q) => shuffled(q, rng)));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState(false);
  const id = `quiz-${category}`;

  const q = questions[i];
  const o = order[i];
  // Read the question and its options aloud, in the question's language with the voice chosen for it.
  const [speaking, setSpeaking] = useState<null | (() => void)>(null);
  const readAloud = () => {
    if (speaking) return speaking();
    const lang = french ? 'fr' : detectLang(q.question);
    const text = `${q.question} ... ${o.options.map((x, k) => `${'ABCD'[k]}: ${x}.`).join(' ')}`;
    setSpeaking(() => speakOnce(text, () => setSpeaking(null), lang, voiceForLanguage(readerSettings, lang)));
  };
  // Get the reading voice ready in the background, so 🔊 starts quickly.
  const quizLang = french ? 'fr' : 'en';
  const quizVoice = voiceForLanguage(readerSettings, quizLang);
  useEffect(() => {
    const t = setTimeout(() => prewarmNatural(quizVoice, quizLang, readerSettings.naturalOff), 800);
    return () => clearTimeout(t);
  }, [quizVoice, quizLang, readerSettings.naturalOff]);
  // Stop reading when the question changes or the quiz closes.
  useEffect(() => () => speaking?.(), [speaking, i]);
  const t = french
    ? { right: 'Bonne réponse !', wrong: 'Pas tout à fait.', next: 'Suivante', end: 'Voir le résultat', again: 'Recommencer', back: 'Terminé', of: 'sur' }
    : { right: 'Correct!', wrong: 'Not quite.', next: 'Next', end: 'See result', again: 'Try another set', back: 'Done', of: 'of' };

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === o.answer) {
      haptic.tap();
      sfx.right();
      setScore((s) => s + 1);
    } else {
      haptic.tick();
      sfx.wrong();
    }
  };

  // Timed mode: 20 seconds per question; running out counts as wrong.
  useEffect(() => {
    if (!timed || picked !== null || done) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timed, picked, done, i]);
  const expired = timed && left <= 0 && picked === null;
  useEffect(() => {
    if (!expired) return;
    const t = setTimeout(() => choose(-1), 0);
    return () => clearTimeout(t);
    // Only reacting to the clock running out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      setLeft(QUESTION_SECONDS);
      return;
    }
    const accuracy = score / questions.length;
    const skill = daily ? 'logic' : meta!.skill;
    const isBest = score * 10 > (brain.best[id] ?? 0);
    recordBrain({ id, skill, points: score * 10, perf: Math.round(accuracy * 100), xp: score * 8 + (timed ? 20 : 0) + (mode === 'hard' ? 20 : 0), seconds: questions.length * 20 });
    if (daily) {
      markBrainDaily('quiz');
      if (brain.daily.date === localDate() && brain.daily.game) celebrate({ emoji: '⚡', title: 'Daily challenge done!', subtitle: 'See you tomorrow for a new one.' });
    }
    if (isBest && score > 0 && !daily) celebrate({ emoji: '🏆', title: 'Personal best!', subtitle: `${score} / ${questions.length} in ${meta?.name}.` });
    setBest(isBest && !daily);
    setDone(true);
  };

  if (!q && !done) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No questions here yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: daily ? '🧠 Daily questions' : `${meta?.emoji} ${meta?.name}` }} />
      {done ? (
        <Animated.View entering={FadeInDown} style={styles.result}>
          <Text style={styles.bigEmoji}>{score / questions.length >= 0.8 ? '🎉' : score / questions.length >= 0.5 ? '👏' : '💪'}</Text>
          <Text style={styles.title}>
            {score} {t.of} {questions.length}
          </Text>
          {best && <Text style={styles.accent}>New personal best!</Text>}
          <Text style={styles.muted}>Best in this set: {Math.max(brain.best[id] ?? 0, score * 10) / 10} correct</Text>
          <View style={styles.row}>
            {!daily && (
              <Pressable onPress={() => router.replace({ pathname: '/brain/quiz', params: { category } })} style={[styles.primary, styles.flex]}>
                <Text style={styles.primaryText}>{t.again}</Text>
              </Pressable>
            )}
            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={[styles.secondary, styles.flex]}>
              <Text style={styles.secondaryText}>{t.back}</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>Brain score is for fun and practice, not an IQ test.</Text>
        </Animated.View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.progressRow}>
            <Text style={styles.muted}>
              {i + 1} / {questions.length}
            </Text>
            <Text style={styles.muted}>
              ✓ {score} · {'●'.repeat(q.level)}
              {'○'.repeat(3 - q.level)}
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(i / questions.length) * 100}%` }]} />
          </View>
          {timed && (
            <View style={styles.track}>
              <View style={[styles.fill, styles.timer, { width: `${(Math.max(0, left) / QUESTION_SECONDS) * 100}%` }]} />
            </View>
          )}
          <View style={styles.questionRow}>
            <Animated.Text key={i} entering={FadeIn.duration(200)} style={[styles.question, styles.flex]}>
              {q.question}
            </Animated.Text>
            <Pressable accessibilityLabel={french ? 'Lire la question' : 'Read the question aloud'} onPress={readAloud} hitSlop={8} style={[styles.speak, !!speaking && styles.speakOn]}>
              <Text style={styles.speakText}>{speaking ? '■' : '🔊'}</Text>
            </Pressable>
          </View>
          <View style={styles.options}>
            {o.options.map((text, k) => {
              const state = picked === null ? null : k === o.answer ? 'right' : k === picked ? 'wrong' : 'dim';
              return (
                <Pressable
                  key={`${i}-${k}`}
                  accessibilityLabel={text}
                  onPress={() => choose(k)}
                  style={[styles.option, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && styles.dim]}>
                  <Text style={styles.letter}>{'ABCD'[k]}</Text>
                  <Text style={styles.optionText}>{text}</Text>
                </Pressable>
              );
            })}
          </View>
          {picked !== null && (
            <Animated.View entering={ZoomIn.duration(200)} style={styles.feedback}>
              <Text style={[styles.feedbackTitle, { color: picked === o.answer ? '#4FA45F' : colors.danger }]}>
                {picked === o.answer ? t.right : picked === -1 ? (french ? 'Temps écoulé.' : 'Time’s up.') : t.wrong}
              </Text>
              <Text style={styles.feedbackText}>{q.why}</Text>
              <Pressable accessibilityLabel="Next question" onPress={next} style={styles.primary}>
                <Text style={styles.primaryText}>{i + 1 < questions.length ? t.next : t.end}</Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  content: { padding: 16, gap: 14, maxWidth: 600, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.accent },
  timer: { backgroundColor: '#FF6FB5' },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  speak: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, marginTop: 10 },
  speakOn: { backgroundColor: '#FF6FB5' },
  speakText: { fontSize: 18, color: colors.text },
  question: { color: colors.text, fontFamily: displayFont, fontSize: 26, lineHeight: 32, marginVertical: 8 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  letter: { color: colors.accent, fontWeight: '900', width: 18 },
  optionText: { color: colors.text, fontSize: 16, flex: 1, lineHeight: 22 },
  right: { borderColor: '#4FA45F', backgroundColor: 'rgba(79,164,95,0.18)' },
  wrong: { borderColor: '#D64545', backgroundColor: 'rgba(214,69,69,0.15)' },
  dim: { opacity: 0.5 },
  feedback: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  feedbackTitle: { fontWeight: '900', fontSize: 18 },
  feedbackText: { color: colors.text, lineHeight: 21 },
  primary: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 15, borderRadius: 999, backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondary: { alignItems: 'center', paddingVertical: 15, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  bigEmoji: { fontSize: 64 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 36 },
  accent: { color: colors.accent, fontWeight: '800' },
  muted: { color: colors.muted, textAlign: 'center' },
  note: { color: colors.muted, fontSize: 12, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  flex: { flex: 1 },
});
