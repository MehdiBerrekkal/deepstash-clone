import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { BlockShape, ShapeTile } from '@/components/brain/Shapes';
import { usePalette } from '@/lib/appearance';
import { displayFont } from '@/lib/bookType';
import { gameById, performance, seeded, type Level, type Round } from '@/lib/brain/games';
import { celebrate } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

type Phase = 'intro' | 'play' | 'done';

const secondsSince = (t: number) => Math.round((Date.now() - t) / 1000);
const randomPattern = (cells: number, count: number) =>
  Array.from({ length: cells }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, cells - 1));
type Result = { points: number; accuracy: number; perf: number; best: boolean; level: Level; prevLevel: Level; correct: number; total: number };

/** One Brain game: a short how-to, the game, then the result with your Brain score change. */
export default function GameScreen() {
  const { game: id, daily } = useLocalSearchParams<{ game: string; daily?: string }>();
  const game = gameById[id];
  const { brain, recordBrain, markBrainHowTo, markBrainDaily } = useStore();
  const level = (brain.levels[id] ?? 1) as Level;
  const seen = brain.seen.includes(id);
  const [phase, setPhase] = useState<Phase>('intro');
  const [result, setResult] = useState<Result | null>(null);
  const [run, setRun] = useState(0);
  const [seed, setSeed] = useState('');

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>That game doesn’t exist.</Text>
      </View>
    );
  }

  const finish = (correct: number, total: number, accuracy: number, perfAcc: number, seconds: number) => {
    const points = correct * 10 * level;
    const perf = performance(perfAcc, level);
    const r = recordBrain({ id, skill: game.skill, points, accuracy, perf, seconds });
    if (daily) {
      markBrainDaily('game');
      if (brain.daily.date === localDate() && brain.daily.quiz) celebrate({ emoji: '⚡', title: 'Daily challenge done!', subtitle: 'See you tomorrow for a new one.' });
    }
    if (r.best && points > 0) celebrate({ emoji: '🏆', title: 'Personal best!', subtitle: `${points} points in ${game.name}.` });
    else haptic.success();
    setResult({ points, accuracy, perf, best: r.best, level: r.level, prevLevel: level, correct, total });
    setPhase('done');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${game.emoji} ${game.name}` }} />
      {phase === 'intro' && (
        <Animated.View entering={FadeIn} style={styles.intro}>
          <Text style={styles.bigEmoji}>{game.emoji}</Text>
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.levelLine}>Level {level} of 3 · best {brain.best[id] ?? 0} points</Text>
          <View style={styles.howTo}>
            <Text style={styles.howToTitle}>{seen ? 'Reminder' : 'How to play'}</Text>
            <Text style={styles.howToText}>{game.howTo}</Text>
          </View>
          <Pressable
            accessibilityLabel="Start"
            onPress={() => {
              markBrainHowTo(id);
              setSeed(daily ? `daily-${new Date().toDateString()}` : String(Date.now()));
              setRun((r) => r + 1);
              setPhase('play');
            }}
            style={styles.primary}>
            <Text style={styles.primaryText}>Start</Text>
          </Pressable>
        </Animated.View>
      )}
      {phase === 'play' &&
        (id === 'memory' ? (
          <MemoryGame key={run} level={level} onDone={finish} />
        ) : (
          <RoundGame key={run} id={id} level={level} seed={seed} onDone={finish} />
        ))}
      {phase === 'done' && result && (
        <Animated.View entering={FadeInDown} style={styles.intro}>
          <Text style={styles.bigEmoji}>{result.best ? '🏆' : result.accuracy >= 0.7 ? '🎉' : '💪'}</Text>
          <Text style={styles.title}>{result.points} points</Text>
          <Text style={styles.levelLine}>
            {result.correct} / {result.total} right{result.best ? ' · new personal best!' : ''}
          </Text>
          <Text style={styles.muted}>
            {result.level > result.prevLevel
              ? `Great work: next time is level ${result.level}.`
              : result.level < result.prevLevel
                ? `Next time is a little easier (level ${result.level}).`
                : `You stay on level ${result.level}.`}
          </Text>
          <View style={styles.row}>
            <Pressable onPress={() => setPhase('intro')} style={[styles.primary, styles.flex]}>
              <Text style={styles.primaryText}>Play again</Text>
            </Pressable>
            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={[styles.secondary, styles.flex]}>
              <Text style={styles.secondaryText}>Done</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>Brain score is for fun and practice, not an IQ test.</Text>
        </Animated.View>
      )}
    </View>
  );
}

/** Multiple-choice games, by rounds or against the clock. */
function RoundGame({ id, level, seed, onDone }: { id: string; level: Level; seed: string; onDone: (c: number, t: number, acc: number, perfAcc: number, secs: number) => void }) {
  const game = gameById[id];
  const palette = usePalette();
  const rng = useMemo(() => seeded(`${id}-${seed}`), [id, seed]);
  const [round, setRound] = useState<Round>(() => game.make!(level, rng));
  const [n, setN] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [left, setLeft] = useState(game.seconds ?? 0);
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const timed = !!game.seconds;
  const total = game.rounds ?? 0;
  const { width } = useWindowDimensions();
  const w = Math.min(width, 560) - 32;

  // The clock for sprint games.
  useEffect(() => {
    if (!timed) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timed]);
  useEffect(() => {
    if (timed && left <= 0) {
      const target = game.target![level - 1];
      onDone(correct, n, n ? correct / n : 0, correct / target, game.seconds!);
    }
    // Only the clock reaching zero should end the game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const next = () => {
    const done = n + 1;
    if (!timed && done >= total) {
      onDone(correct, total, correct / total, correct / total, secondsSince(started.current));
      return;
    }
    setN(done);
    setPicked(null);
    setRound(game.make!(level, rng));
  };

  const choose = (i: number) => {
    if (picked !== null) return;
    const right = i === round.answer;
    if (right) {
      haptic.tap();
      setCorrect((c) => c + 1);
    } else {
      haptic.tick();
      if (timed) setLeft((s) => s - 1);
    }
    setPicked(i);
    // Sprint games move on at once; others pause to show the answer (tap Next when there's an explanation).
    if (timed) setTimeout(() => {
      setN((x) => x + 1);
      setPicked(null);
      setRound(game.make!(level, rng));
    }, right ? 180 : 450);
  };

  const shapeChoices = round.choices.some((c) => c.shape);
  const colorChoices = round.choices.some((c) => c.color);
  const tile = shapeChoices ? Math.floor((w - 24) / 3) : 0;

  return (
    <ScrollView contentContainerStyle={styles.play}>
      <View style={styles.progressRow}>
        <Text style={styles.muted}>{timed ? `${Math.max(0, left)} s` : `${Math.min(n + 1, total)} / ${total}`}</Text>
        <Text style={styles.muted}>
          ✓ {correct} · level {level}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${timed ? (Math.max(0, left) / game.seconds!) * 100 : (n / total) * 100}%` }]} />
      </View>

      <Animated.View key={n} entering={FadeIn.duration(180)} style={styles.prompt}>
        <PromptView round={round} width={w} />
      </Animated.View>

      <View style={[styles.choices, shapeChoices && styles.choicesWrap]}>
        {round.choices.map((c, i) => {
          const state = picked === null ? null : i === round.answer ? 'right' : i === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={`${n}-${c.key}-${i}`}
              accessibilityLabel={c.text ?? c.colorName ?? `Option ${i + 1}`}
              onPress={() => choose(i)}
              style={[
                styles.choice,
                shapeChoices && { width: tile, height: tile, padding: 4 },
                !shapeChoices && round.choices.length > 2 && !colorChoices && styles.choiceHalf,
                state === 'right' && styles.right,
                state === 'wrong' && styles.wrong,
                state === 'dim' && styles.dim,
              ]}>
              {c.shape ? (
                <ShapeTile spec={c.shape} size={tile - 12} color={palette.text} />
              ) : c.color ? (
                <View style={styles.colorChoice}>
                  <View style={[styles.swatch, { backgroundColor: c.color }]} />
                  <Text style={styles.choiceText}>{c.colorName}</Text>
                </View>
              ) : (
                <Text style={[styles.choiceText, round.prompt.type === 'text' && round.prompt.big && styles.choiceBig]}>{c.text}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {picked !== null && !timed && (
        <Animated.View entering={ZoomIn.duration(200)} style={styles.feedback}>
          <Text style={[styles.feedbackTitle, { color: picked === round.answer ? '#4FA45F' : colors.danger }]}>
            {picked === round.answer ? 'Correct!' : 'Not quite.'}
          </Text>
          {!!round.explain && <Text style={styles.feedbackText}>{round.explain}</Text>}
          <Pressable accessibilityLabel="Next" onPress={next} style={styles.primary}>
            <Text style={styles.primaryText}>{n + 1 >= total ? 'See result' : 'Next'}</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

function PromptView({ round, width }: { round: Round; width: number }) {
  const palette = usePalette();
  const p = round.prompt;
  if (p.type === 'text') {
    return (
      <View style={styles.promptText}>
        {!!p.title && <Text style={styles.promptTitle}>{p.title}</Text>}
        {!!p.body && <Text style={[styles.promptBody, p.big && styles.promptBig]}>{p.body}</Text>}
      </View>
    );
  }
  if (p.type === 'word') {
    return (
      <View style={styles.wordBox}>
        <Text style={[styles.word, { color: p.ink }]}>{p.word}</Text>
        <Text style={styles.muted}>Tap the colour of the ink</Text>
      </View>
    );
  }
  if (p.type === 'matrix') {
    const cell = Math.min(96, Math.floor((width - 16) / 3));
    return (
      <View style={[styles.matrix, { width: cell * 3 + 12 }]}>
        {p.cells.map((c, i) => (
          <View key={i} style={[styles.matrixCell, { width: cell, height: cell }]}>
            {c ? <ShapeTile spec={c} size={cell - 10} color={palette.text} /> : <Text style={styles.question}>?</Text>}
          </View>
        ))}
      </View>
    );
  }
  if (p.type === 'rotation') {
    const s = Math.min(150, (width - 24) / 2);
    return (
      <View style={styles.rotation}>
        <View style={styles.rotationBox}>
          <BlockShape cells={p.a} size={s} color={palette.accent} />
        </View>
        <View style={styles.rotationBox}>
          <BlockShape cells={p.b} size={s} color={palette.accent} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.promptText}>
      <Text style={styles.promptTitle}>{p.title}</Text>
      <View style={styles.seats}>
        {Array.from({ length: p.seats }, (_, i) => (
          <View key={i} style={styles.seat}>
            <Text style={styles.seatText}>🪑 {i + 1}</Text>
          </View>
        ))}
      </View>
      {p.clues.map((c) => (
        <Text key={c} style={styles.clue}>
          • {c}
        </Text>
      ))}
      <Text style={[styles.promptTitle, { marginTop: 8 }]}>{p.question}</Text>
    </View>
  );
}

/** Memory grid: tiles flash, you tap the same ones; each success adds a tile, two misses end the game. */
function MemoryGame({ level, onDone }: { level: Level; onDone: (c: number, t: number, acc: number, perfAcc: number, secs: number) => void }) {
  const size = level === 1 ? 3 : level === 2 ? 4 : 5;
  const startCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const { width } = useWindowDimensions();
  const board = Math.min(width - 48, 380);
  const gap = 8;
  const tile = (board - gap * (size - 1)) / size;
  const [count, setCount] = useState(startCount);
  const [lit, setLit] = useState<number[]>(() => randomPattern(size * size, startCount));
  const [showing, setShowing] = useState(true);
  const [tapped, setTapped] = useState<number[]>([]);
  const [lives, setLives] = useState(2);
  const [rounds, setRounds] = useState(0);
  const [wins, setWins] = useState(0);
  const [miss, setMiss] = useState<number | null>(null);
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  // Each pattern shows for a moment, longer for more tiles.
  useEffect(() => {
    if (!showing) return;
    const t = setTimeout(() => setShowing(false), 900 + lit.length * 250);
    return () => clearTimeout(t);
  }, [showing, lit]);

  const newRound = (tiles: number) => {
    setLit(randomPattern(size * size, tiles));
    setTapped([]);
    setShowing(true);
  };

  const end = (w: number, r: number) => {
    onDone(w, r, r ? w / r : 0, Math.min(1, w / 5), secondsSince(started.current));
  };

  const tap = (i: number) => {
    if (showing || tapped.includes(i)) return;
    if (!lit.includes(i)) {
      haptic.tick();
      setMiss(i);
      setTimeout(() => setMiss(null), 400);
      const l = lives - 1;
      setLives(l);
      const r = rounds + 1;
      if (l <= 0) return end(wins, r);
      setRounds(r);
      setTimeout(() => newRound(count), 450);
      return;
    }
    haptic.tap();
    const now = [...tapped, i];
    setTapped(now);
    if (now.length === lit.length) {
      const w = wins + 1;
      setWins(w);
      if (count + 1 >= size * size - 1) return end(w, rounds + 1);
      setTimeout(() => {
        setCount(count + 1);
        setRounds(rounds + 1);
        newRound(count + 1);
      }, 350);
    }
  };

  return (
    <View style={styles.memory}>
      <Text style={styles.promptTitle}>{showing ? `Remember these ${lit.length} tiles…` : `Tap the ${lit.length} tiles`}</Text>
      <Text style={styles.muted}>
        {'❤️'.repeat(lives)}
        {'🤍'.repeat(2 - lives)} · {wins} cleared
      </Text>
      <View style={[styles.board, { width: board, height: board, gap }]}>
        {Array.from({ length: size * size }, (_, i) => {
          const on = (showing && lit.includes(i)) || tapped.includes(i);
          return (
            <Pressable
              key={i}
              accessibilityLabel={`Tile ${i + 1}`}
              onPress={() => tap(i)}
              style={[styles.tile, { width: tile, height: tile }, on && styles.tileOn, miss === i && styles.tileMiss]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  intro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, maxWidth: 560, width: '100%', alignSelf: 'center' },
  bigEmoji: { fontSize: 64 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 34, textAlign: 'center' },
  levelLine: { color: colors.accent, fontWeight: '700' },
  howTo: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, gap: 6, alignSelf: 'stretch' },
  howToTitle: { color: colors.text, fontWeight: '800' },
  howToText: { color: colors.muted, lineHeight: 21 },
  primary: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 15, borderRadius: 999, backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondary: { alignItems: 'center', paddingVertical: 15, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  row: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  flex: { flex: 1 },
  muted: { color: colors.muted, textAlign: 'center' },
  note: { color: colors.muted, fontSize: 12, marginTop: 6 },
  play: { padding: 16, gap: 14, maxWidth: 560, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.accent },
  prompt: { alignItems: 'center', minHeight: 140, justifyContent: 'center' },
  promptText: { alignSelf: 'stretch', gap: 8 },
  promptTitle: { color: colors.text, fontWeight: '800', fontSize: 17, textAlign: 'center' },
  promptBody: { color: colors.text, fontSize: 20, textAlign: 'center' },
  promptBig: { fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
  wordBox: { alignItems: 'center', gap: 8, paddingVertical: 20 },
  word: { fontSize: 54, fontWeight: '900', letterSpacing: 2 },
  matrix: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  matrixCell: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.surface },
  question: { color: colors.accent, fontSize: 34, fontWeight: '900' },
  rotation: { flexDirection: 'row', gap: 12 },
  rotationBox: { borderRadius: 16, backgroundColor: colors.surface, padding: 4 },
  seats: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 4 },
  seat: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surfaceRaised },
  seatText: { color: colors.text, fontWeight: '700' },
  clue: { color: colors.text, fontSize: 15, lineHeight: 22 },
  choices: { gap: 10 },
  choicesWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  choice: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  choiceHalf: {},
  choiceText: { color: colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center' },
  choiceBig: { fontSize: 22 },
  colorChoice: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatch: { width: 22, height: 22, borderRadius: 11 },
  right: { borderColor: '#4FA45F', backgroundColor: 'rgba(79,164,95,0.18)' },
  wrong: { borderColor: '#D64545', backgroundColor: 'rgba(214,69,69,0.15)' },
  dim: { opacity: 0.5 },
  feedback: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  feedbackTitle: { fontWeight: '900', fontSize: 18 },
  feedbackText: { color: colors.text, lineHeight: 21 },
  memory: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  board: { flexDirection: 'row', flexWrap: 'wrap' },
  tile: { borderRadius: 12, backgroundColor: colors.surfaceRaised },
  tileOn: { backgroundColor: colors.accent },
  tileMiss: { backgroundColor: '#D64545' },
});
