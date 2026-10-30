import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { OptionView, PromptView, pictureOptions } from '@/components/brain/ItemView';
import { displayFont } from '@/lib/bookType';
import { gameById, type GameDef } from '@/lib/brain/catalog';
import { domainOf, rankFor, seeded, stair, type Item } from '@/lib/brain/core';
import { setMuted, sfx } from '@/lib/brain/sfx';
import { celebrate } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

type Outcome = { points: number; right: number; total: number; perf: number; rating: number; seconds: number; mistakes: { item: Item; picked: number }[] };
type Phase = 'intro' | 'countdown' | 'play' | 'done';

const secondsSince = (t: number) => Math.round((Date.now() - t) / 1000);
const now = () => Date.now();

/** A training game: intro with how-to, a 3-2-1 countdown, the game, and a results report. */
export default function GameScreen() {
  const { game: id, daily } = useLocalSearchParams<{ game: string; daily?: string }>();
  const game = gameById[id];
  const { brain, recordBrain, markBrainHowTo, markBrainDaily, setBrainSound } = useStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [run, setRun] = useState(0);
  const [seed, setSeed] = useState('');
  const [before, setBefore] = useState({ xp: 0, best: 0 });
  const sound = brain.sound !== false;
  useEffect(() => setMuted(!sound), [sound]);

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>That game doesn’t exist.</Text>
      </View>
    );
  }
  const dom = domainOf(game.skill);
  const rating = brain.levels[id] ?? 2;

  const start = () => {
    sfx.unlock();
    markBrainHowTo(id);
    setSeed(daily ? `daily-${localDate()}-${id}` : String(now()));
    setBefore({ xp: brain.xp ?? 0, best: brain.best[id] ?? 0 });
    setRun((r) => r + 1);
    setPhase('countdown');
  };

  const finish = (o: Outcome) => {
    const xp = Math.round(o.points / 4) + 10;
    recordBrain({ id, skill: game.skill, points: o.points, perf: o.perf, xp, rating: o.rating, seconds: o.seconds });
    if (daily) {
      markBrainDaily('game');
      if (brain.daily.date === localDate() && brain.daily.quiz) celebrate({ emoji: '⚡', title: 'Daily challenge done', subtitle: 'A new one tomorrow.' });
    }
    if (rankFor(before.xp + xp).index > rankFor(before.xp).index) {
      sfx.levelUp();
      celebrate({ emoji: '⬆️', title: `${rankFor(before.xp + xp).name} rank`, subtitle: 'You moved up a rank.' });
    } else if (o.points > before.best && o.points > 0) {
      sfx.levelUp();
      celebrate({ emoji: '🏆', title: 'Personal best', subtitle: `${o.points} points in ${game.name}.` });
    } else haptic.success();
    setOutcome(o);
    setPhase('done');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: game.name }} />
      {phase === 'intro' && (
        <ScrollView contentContainerStyle={styles.intro}>
          <Animated.View entering={FadeInDown.duration(380)}>
            <LinearGradient colors={[`${dom.color}33`, `${dom.color}08`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderColor: `${dom.color}55` }]}>
              <Text style={[styles.domain, { color: dom.color }]}>
                {dom.glyph} {dom.name.toUpperCase()}
              </Text>
              <Text style={styles.title}>{game.name}</Text>
              <Text style={styles.heroBlurb}>{game.blurb}</Text>
              <View style={styles.statRow}>
                <Stat label="Difficulty" value={`${rating}/10`} color={dom.color} />
                <Stat label="Best" value={String(brain.best[id] ?? '—')} color={dom.color} />
                <Stat label="Played" value={String(brain.played[id] ?? 0)} color={dom.color} />
              </View>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).duration(380)} style={styles.card}>
            <Text style={styles.cardTitle}>{brain.seen.includes(id) ? 'Reminder' : 'How it works'}</Text>
            <Text style={styles.cardText}>{game.howTo}</Text>
            <Text style={styles.cardHint}>Difficulty adapts as you play: two right in a row steps up, a mistake steps down. Fast answers and streaks score more.</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(160).duration(380)} style={styles.actions}>
            <Pressable accessibilityLabel="Start" onPress={start} style={[styles.primary, { backgroundColor: dom.color }]}>
              <Text style={styles.primaryText}>Start</Text>
            </Pressable>
            <Pressable accessibilityLabel={sound ? 'Mute sounds' : 'Turn sounds on'} onPress={() => setBrainSound(!sound)} style={styles.iconBtn}>
              <Text style={styles.iconBtnText}>{sound ? '🔊' : '🔇'}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      )}
      {phase === 'countdown' && <Countdown color={dom.color} onDone={() => setPhase('play')} />}
      {phase === 'play' && (
        <View style={styles.flex}>
          {game.type === 'items' || game.type === 'sprint' ? (
            <ItemsRun key={run} game={game} rating={rating} seed={seed} color={dom.color} onDone={finish} />
          ) : game.type === 'nback' ? (
            <NBack key={run} rating={rating} color={dom.color} onDone={finish} />
          ) : game.type === 'span' ? (
            <DigitSpan key={run} rating={rating} color={dom.color} onDone={finish} />
          ) : game.type === 'corsi' ? (
            <Corsi key={run} rating={rating} color={dom.color} seed={seed} onDone={finish} />
          ) : (
            <Tower key={run} rating={rating} color={dom.color} seed={seed} onDone={finish} />
          )}
        </View>
      )}
      {phase === 'done' && outcome && <Results game={game} outcome={outcome} xpBefore={before.xp} bestBefore={before.best} color={dom.color} onAgain={() => setPhase('intro')} />}
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Countdown({ color, onDone }: { color: string; onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) {
      sfx.go();
      const t = setTimeout(onDone, 450);
      return () => clearTimeout(t);
    }
    sfx.tick();
    const t = setTimeout(() => setN(n - 1), 700);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <View style={styles.center}>
      <Animated.Text key={n} entering={ZoomIn.springify().damping(12)} exiting={FadeOut.duration(150)} style={[styles.count, { color }]}>
        {n === 0 ? 'GO' : n}
      </Animated.Text>
    </View>
  );
}

function Hud({ left, right, progress, combo, color, popup }: { left: string; right: string; progress: number; combo: number; color: string; popup: { id: number; text: string } | null }) {
  return (
    <View style={styles.hud}>
      <View style={styles.hudRow}>
        <Text style={styles.hudText}>{left}</Text>
        {combo >= 2 && (
          <Animated.View key={combo} entering={ZoomIn.duration(200)} style={[styles.combo, { borderColor: color }]}>
            <Text style={[styles.comboText, { color }]}>✦ {combo} streak</Text>
          </Animated.View>
        )}
        <Text style={[styles.hudScore, { color }]}>{right}</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%`, backgroundColor: color }]} />
      </View>
      {popup && (
        <Animated.Text key={popup.id} entering={FadeInUp.duration(250)} exiting={FadeOut.duration(400)} style={[styles.popup, { color }]}>
          {popup.text}
        </Animated.Text>
      )}
    </View>
  );
}

// ---------- multiple-choice runs (puzzles and sprints) ----------

function ItemsRun({ game, rating, seed, color, onDone }: { game: GameDef; rating: number; seed: string; color: string; onDone: (o: Outcome) => void }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 32;
  const rng = useMemo(() => seeded(`${game.id}-${seed}`), [game.id, seed]);
  const sprint = game.type === 'sprint';
  const total = game.items ?? 0;
  const [d, setD] = useState(rating);
  const [item, setItem] = useState<Item>(() => game.make!(rating, rng));
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ id: number; text: string } | null>(null);
  const [left, setLeft] = useState(game.seconds ?? game.perItem ?? 60);
  const [mistakes, setMistakes] = useState<Outcome['mistakes']>([]);
  const [hardest, setHardest] = useState(rating);
  const started = useRef(0);
  const shown = useRef(0);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  useEffect(() => {
    started.current = now();
    shown.current = now();
  }, []);
  // One clock: the whole sprint, or the time allowed for each puzzle.
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);

  const end = (r: number, count: number, pts: number) => {
    const acc = count ? r / count : 0;
    // Performance blends how hard it got with how accurate you were.
    const perf = Math.round(Math.min(100, (hardest / 10) * 70 + acc * 30));
    onDone({ points: pts, right: r, total: count, perf, rating: Math.max(1, Math.min(10, d)), seconds: secondsSince(started.current), mistakes });
  };
  const nextItem = (nd: number) => {
    setItem(game.make!(nd, rng));
    setPicked(null);
    shown.current = now();
    if (!sprint) setLeft(game.perItem ?? 60);
  };
  const answer = (i: number) => {
    if (picked !== null) return;
    const ok = i === item.answer;
    const ns = ok ? streak + 1 : 0;
    const nd = stair(d, ok, ns);
    const secs = (now() - shown.current) / 1000;
    let gain = 0;
    if (ok) {
      const speed = sprint ? 1 : Math.max(0, 1 - secs / (game.perItem ?? 60));
      gain = Math.round(10 * d * (1 + Math.min(2, Math.floor(ns / 3) * 0.5)) * (1 + speed * 0.5));
      sfx.right();
      if (ns >= 3 && ns % 3 === 0) sfx.combo(ns);
      haptic.tap();
      setPopup({ id: now(), text: `+${gain}` });
    } else {
      sfx.wrong();
      haptic.tick();
      shake.set(withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-6, { duration: 50 }), withTiming(0, { duration: 50 })));
      if (sprint) setLeft((s) => s - 2);
      else setMistakes((m) => [...m, { item, picked: i }]);
    }
    setPicked(i);
    setStreak(ns);
    setD(nd);
    if (ok) setHardest((h) => Math.max(h, d));
    const r2 = right + (ok ? 1 : 0);
    const p2 = points + gain;
    setRight(r2);
    setPoints(p2);
    const count = n + 1;
    setN(count);
    // Right answers move on quickly; wrong ones pause on the explanation (puzzles) or flash (sprints).
    if (sprint) setTimeout(() => nextItem(nd), ok ? 160 : 420);
    else if (ok) setTimeout(() => (count >= total ? end(r2, count, p2) : nextItem(nd)), 650);
  };

  // The clock running out ends a sprint, or counts the puzzle as missed.
  const expired = left <= 0;
  useEffect(() => {
    if (!expired) return;
    if (sprint) end(right, n, points);
    else if (picked === null) answer(-1);
    // Reacting only to the clock running out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const pics = pictureOptions(item.kind);
  const cols = pics ? (item.options.length > 6 ? 4 : item.options.length > 4 ? 3 : 2) : item.kind === 'code' ? Math.min(5, item.options.length) : item.options.length === 4 && sprint ? 2 : 1;
  const tile = pics ? Math.floor((w - (cols - 1) * 8) / cols) : 0;

  return (
    <ScrollView contentContainerStyle={[styles.play, { width: w + 32 }]} keyboardShouldPersistTaps="handled">
      <Hud
        left={sprint ? `${Math.max(0, left)}s` : `${Math.min(n + (picked === null ? 1 : 0), total)} / ${total} · D${d}`}
        right={`${points}`}
        progress={sprint ? left / (game.seconds ?? 60) : left / (game.perItem ?? 60)}
        combo={streak}
        color={color}
        popup={popup}
      />
      {!!item.ask && <Text style={styles.ask}>{item.ask}</Text>}
      <Animated.View key={`${n}-${item.answer}`} entering={FadeIn.duration(220)} style={[styles.prompt, shakeStyle]}>
        <PromptView item={item} width={w} accent={color} />
      </Animated.View>
      <View style={[styles.options, cols > 1 && styles.grid]}>
        {item.options.map((o, i) => {
          const state = picked === null ? null : i === item.answer ? 'right' : i === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={i}
              accessibilityLabel={`Option ${i + 1}`}
              onPress={() => answer(i)}
              style={[
                styles.option,
                pics ? { width: tile, height: tile, paddingVertical: 9, paddingHorizontal: 9 } : cols > 1 ? { width: (w - (cols - 1) * 8) / cols } : null,
                state === 'right' && styles.optRight,
                state === 'wrong' && styles.optWrong,
                state === 'dim' && { opacity: 0.45 },
              ]}>
              {pics && <Text style={styles.optLetter}>{'ABCDEFGH'[i]}</Text>}
              <OptionView item={item} value={o} size={pics ? tile - 30 : 0} accent={color} />
            </Pressable>
          );
        })}
      </View>
      {!sprint && picked !== null && picked !== item.answer && (
        <Animated.View entering={FadeInDown.duration(220)} style={styles.explain}>
          <Text style={styles.explainTitle}>{picked === -1 ? 'Time’s up' : 'Not this one'}</Text>
          {!!item.explain && <Text style={styles.cardText}>{item.explain}</Text>}
          <Pressable accessibilityLabel="Next" onPress={() => (n >= total ? end(right, n, points) : nextItem(d))} style={[styles.primary, { backgroundColor: color }]}>
            <Text style={styles.primaryText}>{n >= total ? 'See results' : 'Next'}</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

// ---------- dual n-back ----------

const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

function makeNBack(N: number, total: number) {
  // About a third of trials match on each channel.
  const pos: number[] = [];
  const letters: string[] = [];
  for (let i = 0; i < total; i++) {
    pos.push(i >= N && Math.random() < 0.3 ? pos[i - N] : Math.floor(Math.random() * 9));
    letters.push(i >= N && Math.random() < 0.3 ? letters[i - N] : LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  return { pos, letters };
}

function NBack({ rating, color, onDone }: { rating: number; color: string; onDone: (o: Outcome) => void }) {
  const N = Math.max(1, Math.min(5, Math.ceil(rating / 2)));
  const total = 20 + N;
  const [seq] = useState(() => makeNBack(N, total));
  const [i, setI] = useState(-1);
  const [lit, setLit] = useState(false);
  const pressed = useRef({ pos: false, snd: false });
  const score = useRef({ hits: 0, false_: 0, chances: 0 });
  const [flash, setFlash] = useState<{ pos?: 'ok' | 'bad'; snd?: 'ok' | 'bad' }>({});
  const started = useRef(0);

  useEffect(() => {
    started.current = now();
    const t = setTimeout(() => setI(0), 400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (i < 0) return;
    if (i >= total) {
      const s = score.current;
      const acc = s.chances ? Math.max(0, (s.hits - s.false_) / s.chances) : 0;
      onDone({
        points: Math.max(0, s.hits * 20 * N - s.false_ * 10),
        right: s.hits,
        total: s.chances,
        perf: Math.round(Math.min(100, N * 15 + acc * 40)),
        rating: acc >= 0.8 ? Math.min(10, rating + 2) : acc < 0.5 ? Math.max(1, rating - 2) : rating,
        seconds: secondsSince(started.current),
        mistakes: [],
      });
      return;
    }
    const on = setTimeout(() => {
      setLit(true);
      setFlash({});
      pressed.current = { pos: false, snd: false };
      Speech.speak(seq.letters[i], { rate: 1.1 });
    }, 0);
    const off = setTimeout(() => setLit(false), 700);
    const next = setTimeout(() => {
      if (i >= N) {
        if (seq.pos[i] === seq.pos[i - N]) score.current.chances++;
        if (seq.letters[i] === seq.letters[i - N]) score.current.chances++;
      }
      setI(i + 1);
    }, 2500);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
      clearTimeout(next);
    };
    // The sequence is fixed for the run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const press = (ch: 'pos' | 'snd') => {
    if (i < N || i >= total || pressed.current[ch]) return;
    pressed.current[ch] = true;
    const match = ch === 'pos' ? seq.pos[i] === seq.pos[i - N] : seq.letters[i] === seq.letters[i - N];
    if (match) {
      score.current.hits++;
      sfx.right();
      haptic.tap();
    } else {
      score.current.false_++;
      sfx.wrong();
      haptic.tick();
    }
    setFlash((f) => ({ ...f, [ch]: match ? 'ok' : 'bad' }));
  };

  return (
    <View style={styles.custom}>
      <Hud left={`${Math.max(0, i + 1)} / ${total}`} right={`${N}-back`} progress={(i + 1) / total} combo={0} color={color} popup={null} />
      <Text style={styles.ask}>
        Match with {N} step{N > 1 ? 's' : ''} back
      </Text>
      <View style={styles.nbGrid}>
        {Array.from({ length: 9 }, (_, k) => (
          <View key={k} style={[styles.nbCell, lit && seq.pos[i] === k && { backgroundColor: color, borderColor: color }]} />
        ))}
      </View>
      <Text style={styles.nbLetter}>{lit && i >= 0 && i < total ? seq.letters[i] : ' '}</Text>
      <View style={styles.row2}>
        <Pressable accessibilityLabel="Position match" onPress={() => press('pos')} style={[styles.bigBtn, flash.pos === 'ok' && styles.ok, flash.pos === 'bad' && styles.bad]}>
          <Text style={styles.bigBtnText}>Position</Text>
        </Pressable>
        <Pressable accessibilityLabel="Sound match" onPress={() => press('snd')} style={[styles.bigBtn, flash.snd === 'ok' && styles.ok, flash.snd === 'bad' && styles.bad]}>
          <Text style={styles.bigBtnText}>Sound</Text>
        </Pressable>
      </View>
      <Text style={styles.cardHint}>The letter is spoken and shown. Press only when it matches {N} back.</Text>
    </View>
  );
}

// ---------- digit span ----------

const randomDigits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10));

function DigitSpan({ rating, color, onDone }: { rating: number; color: string; onDone: (o: Outcome) => void }) {
  const backward = rating >= 5;
  const [len, setLen] = useState(backward ? 3 : 4);
  const [digits, setDigits] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [typed, setTyped] = useState<number[]>([]);
  const [lives, setLives] = useState(2);
  const [best, setBest] = useState(0);
  const [result, setResult] = useState<'ok' | 'bad' | null>(null);
  const started = useRef(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    started.current = now();
  }, []);
  // A new list of digits for each round.
  useEffect(() => {
    const ds = randomDigits(len);
    const kick = setTimeout(() => {
      setDigits(ds);
      setTyped([]);
      setResult(null);
      setShowing(0);
    }, 500);
    return () => clearTimeout(kick);
  }, [len, round]);
  // Show each digit for a moment, one after another.
  useEffect(() => {
    if (showing < 0 || showing >= digits.length) return;
    sfx.tick();
    const t = setTimeout(() => setShowing(showing + 1), 900);
    return () => clearTimeout(t);
  }, [showing, digits.length]);

  const done = showing >= digits.length && digits.length > 0;
  const key = (k: number) => {
    if (!done || result) return;
    const t = [...typed, k];
    setTyped(t);
    if (t.length < digits.length) return;
    const target = backward ? [...digits].reverse() : digits;
    const ok = t.every((x, j) => x === target[j]);
    setResult(ok ? 'ok' : 'bad');
    if (ok) {
      sfx.right();
      haptic.tap();
    } else {
      sfx.wrong();
      haptic.tick();
    }
    setTimeout(() => {
      if (ok) {
        setBest(len);
        setLen(len + 1);
      } else if (lives <= 1) {
        const span = best;
        onDone({
          points: span * 30 * (backward ? 2 : 1),
          right: span,
          total: span,
          perf: Math.round(Math.min(100, Math.max(0, ((span - (backward ? 2 : 3)) / 6) * 100))),
          rating: span >= (backward ? 6 : 8) ? Math.min(10, rating + 2) : span <= 4 ? Math.max(1, rating - 1) : rating,
          seconds: secondsSince(started.current),
          mistakes: [],
        });
      } else {
        setLives(lives - 1);
        setRound(round + 1);
      }
    }, 800);
  };

  return (
    <View style={styles.custom}>
      <Hud left={`${backward ? 'Backward' : 'Forward'} · ${'●'.repeat(lives)}`} right={`${len} digits`} progress={Math.min(1, best / 10)} combo={0} color={color} popup={null} />
      <Text style={styles.ask}>{done ? (backward ? 'Type them in REVERSE order' : 'Type them in the same order') : 'Remember the digits…'}</Text>
      <View style={styles.spanBox}>
        {!done ? (
          <Animated.Text key={showing} entering={ZoomIn.duration(200)} style={[styles.spanDigit, { color }]}>
            {showing >= 0 && showing < digits.length ? digits[showing] : ''}
          </Animated.Text>
        ) : (
          <Text style={[styles.spanTyped, result === 'ok' && { color: '#3DDC97' }, result === 'bad' && { color: '#FF5C70' }]}>{typed.join(' ') || '·'.repeat(digits.length)}</Text>
        )}
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((k) => (
          <Pressable key={k} accessibilityLabel={`Digit ${k}`} disabled={!done} onPress={() => key(k)} style={[styles.key, !done && { opacity: 0.4 }]}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityLabel="Delete" disabled={!done} onPress={() => setTyped(typed.slice(0, -1))} style={[styles.key, !done && { opacity: 0.4 }]}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------- block span ----------

function scatter(seed: string) {
  // Nine blocks spread out without overlapping.
  const rng = seeded(`corsi-${seed}`);
  const out: [number, number][] = [];
  while (out.length < 9) {
    const p: [number, number] = [0.06 + rng() * 0.78, 0.06 + rng() * 0.78];
    if (out.every(([x, y]) => Math.abs(x - p[0]) > 0.2 || Math.abs(y - p[1]) > 0.2)) out.push(p);
  }
  return out;
}
function randomPath(len: number) {
  const p: number[] = [];
  while (p.length < len) {
    const k = Math.floor(Math.random() * 9);
    if (p[p.length - 1] !== k) p.push(k);
  }
  return p;
}

function Corsi({ rating, color, seed, onDone }: { rating: number; color: string; seed: string; onDone: (o: Outcome) => void }) {
  const { width } = useWindowDimensions();
  const box = Math.min(width - 48, 360);
  const [blocks] = useState(() => scatter(seed));
  const [len, setLen] = useState(Math.max(3, Math.min(6, 2 + Math.ceil(rating / 2))));
  const [path, setPath] = useState<number[]>([]);
  const [show, setShow] = useState(-1);
  const [taps, setTaps] = useState<number[]>([]);
  const [lives, setLives] = useState(2);
  const [best, setBest] = useState(0);
  const [round, setRound] = useState(0);
  const started = useRef(0);
  useEffect(() => {
    started.current = now();
  }, []);
  useEffect(() => {
    const p = randomPath(len);
    const t = setTimeout(() => {
      setPath(p);
      setTaps([]);
      setShow(0);
    }, 600);
    return () => clearTimeout(t);
  }, [len, round]);
  useEffect(() => {
    if (show < 0 || show >= path.length) return;
    sfx.tick();
    const t = setTimeout(() => setShow(show + 1), 650);
    return () => clearTimeout(t);
  }, [show, path.length]);
  const ready = show >= path.length && path.length > 0;
  const tap = (k: number) => {
    if (!ready) return;
    const t = [...taps, k];
    setTaps(t);
    if (t[t.length - 1] !== path[t.length - 1]) {
      sfx.wrong();
      haptic.tick();
      setTimeout(() => {
        if (lives <= 1) {
          onDone({ points: best * 35, right: best, total: best, perf: Math.round(Math.min(100, Math.max(0, ((best - 2) / 6) * 100))), rating: best >= 7 ? Math.min(10, rating + 2) : best <= 4 ? Math.max(1, rating - 1) : rating, seconds: secondsSince(started.current), mistakes: [] });
        } else {
          setLives(lives - 1);
          setRound(round + 1);
        }
      }, 600);
      return;
    }
    sfx.click();
    if (t.length === path.length) {
      sfx.right();
      haptic.tap();
      setBest(len);
      setTimeout(() => setLen(len + 1), 500);
    }
  };
  const active = ready ? null : path[show];
  return (
    <View style={styles.custom}>
      <Hud left={`Lives ${'●'.repeat(lives)}`} right={`${len} blocks`} progress={Math.min(1, best / 9)} combo={0} color={color} popup={null} />
      <Text style={styles.ask}>{ready ? 'Tap the blocks in the same order' : 'Watch the order…'}</Text>
      <View style={[styles.corsi, { width: box, height: box }]}>
        {blocks.map(([x, y], k) => (
          <Pressable
            key={k}
            accessibilityLabel={`Block ${k + 1}`}
            onPress={() => tap(k)}
            style={[styles.block, { left: x * box, top: y * box, width: box * 0.16, height: box * 0.16 }, (active === k || taps.includes(k)) && { backgroundColor: color, borderColor: color }]}
          />
        ))}
      </View>
    </View>
  );
}

// ---------- tower planning ----------

type Pegs = number[][];
const keyPegs = (p: Pegs) => p.map((x) => x.join('.')).join('|');
function solveMoves(start: Pegs, goal: Pegs) {
  const target = keyPegs(goal);
  let frontier: Pegs[] = [start];
  const seen = new Set([keyPegs(start)]);
  for (let depth = 0; depth < 40; depth++) {
    if (frontier.some((p) => keyPegs(p) === target)) return depth;
    const next: Pegs[] = [];
    for (const p of frontier)
      for (let a = 0; a < 3; a++)
        for (let b = 0; b < 3; b++) {
          if (a === b || !p[a].length) continue;
          const disc = p[a][p[a].length - 1];
          if (p[b].length && p[b][p[b].length - 1] < disc) continue;
          const q = p.map((x) => [...x]);
          q[b].push(q[a].pop()!);
          const k = keyPegs(q);
          if (!seen.has(k)) {
            seen.add(k);
            next.push(q);
          }
        }
    frontier = next;
  }
  return 99;
}
function randomPegs(n: number, rng: () => number): Pegs {
  const p: Pegs = [[], [], []];
  for (let d = n; d >= 1; d--) p[Math.floor(rng() * 3)].push(d);
  return p;
}
function makeTower(discs: number, rng: () => number) {
  for (;;) {
    const s = randomPegs(discs, rng);
    const g = randomPegs(discs, rng);
    const m = solveMoves(s, g);
    if (m >= discs + 1 && m <= discs * 3) return { start: s, goal: g, optimal: m };
  }
}

function Tower({ rating, color, seed, onDone }: { rating: number; color: string; seed: string; onDone: (o: Outcome) => void }) {
  const puzzles = 3;
  const discs = rating <= 3 ? 3 : rating <= 7 ? 4 : 5;
  const rng = useMemo(() => seeded(`tower-${seed}`), [seed]);
  const [puzzle, setPuzzle] = useState(() => makeTower(discs, rng));
  const [pegs, setPegs] = useState<Pegs>(puzzle.start);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [k, setK] = useState(0);
  const [score, setScore] = useState({ points: 0, perfect: 0, ratio: 0 });
  const started = useRef(0);
  const { width } = useWindowDimensions();
  const pegW = Math.min(110, (width - 64) / 3);
  useEffect(() => {
    started.current = now();
  }, []);

  const tapPeg = (i: number) => {
    if (held === null) {
      if (!pegs[i].length) return;
      sfx.click();
      setHeld(i);
      return;
    }
    if (held === i) return setHeld(null);
    const disc = pegs[held][pegs[held].length - 1];
    if (pegs[i].length && pegs[i][pegs[i].length - 1] < disc) {
      sfx.wrong();
      haptic.tick();
      setHeld(null);
      return;
    }
    const q = pegs.map((x) => [...x]);
    q[i].push(q[held].pop()!);
    setPegs(q);
    setHeld(null);
    const m = moves + 1;
    setMoves(m);
    sfx.click();
    if (keyPegs(q) !== keyPegs(puzzle.goal)) return;
    sfx.right();
    haptic.tap();
    const eff = puzzle.optimal / m;
    const s = { points: score.points + Math.round(100 * eff * discs), perfect: score.perfect + (m === puzzle.optimal ? 1 : 0), ratio: score.ratio + eff };
    setScore(s);
    if (k + 1 >= puzzles) {
      const avg = s.ratio / puzzles;
      onDone({ points: s.points, right: s.perfect, total: puzzles, perf: Math.round(Math.min(100, (discs / 5) * 50 + avg * 50)), rating: avg > 0.9 ? Math.min(10, rating + 2) : avg < 0.6 ? Math.max(1, rating - 1) : rating, seconds: secondsSince(started.current), mistakes: [] });
      return;
    }
    setTimeout(() => {
      const p = makeTower(discs, rng);
      setPuzzle(p);
      setPegs(p.start);
      setMoves(0);
      setK(k + 1);
    }, 700);
  };

  const drawPegs = (p: Pegs, interactive: boolean, scale = 1) => (
    <View style={[styles.pegs, { transform: [{ scale }] }]}>
      {p.map((stack, i) => (
        <Pressable key={i} accessibilityLabel={interactive ? `Peg ${i + 1}` : undefined} disabled={!interactive} onPress={() => tapPeg(i)} style={[styles.peg, { width: pegW }, interactive && held === i && { backgroundColor: `${color}22` }]}>
          <View style={styles.pole} />
          <View style={styles.stack}>
            {stack.map((disc, j) => (
              <View
                key={j}
                style={[styles.disc, { width: 22 + disc * ((pegW - 26) / discs), backgroundColor: color, opacity: 0.45 + disc / (discs * 2) }, interactive && held === i && j === stack.length - 1 && { transform: [{ translateY: -14 }] }]}
              />
            ))}
          </View>
          <View style={styles.base} />
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={styles.custom}>
      <Hud left={`Puzzle ${k + 1} / ${puzzles}`} right={`${moves} moves · best ${puzzle.optimal}`} progress={k / puzzles} combo={0} color={color} popup={null} />
      <Text style={styles.ask}>Goal</Text>
      <View style={{ opacity: 0.6 }}>{drawPegs(puzzle.goal, false, 0.7)}</View>
      <Text style={styles.ask}>Tap a peg to lift its top disc, then tap where it goes</Text>
      {drawPegs(pegs, true)}
    </View>
  );
}

// ---------- results ----------

function Results({ game, outcome, xpBefore, bestBefore, color, onAgain }: { game: GameDef; outcome: Outcome; xpBefore: number; bestBefore: number; color: string; onAgain: () => void }) {
  const xpGain = Math.round(outcome.points / 4) + 10;
  const rank = rankFor(xpBefore + xpGain);
  const acc = outcome.total ? outcome.right / outcome.total : 0;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.45 ? 1 : 0;
  const [shown, setShown] = useState(0);
  // Count the score up.
  useEffect(() => {
    let v = 0;
    const step = Math.max(1, Math.round(outcome.points / 30));
    const t = setInterval(() => {
      v = Math.min(outcome.points, v + step);
      setShown(v);
      if (v >= outcome.points) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [outcome.points]);
  return (
    <ScrollView contentContainerStyle={styles.results}>
      <Animated.View entering={FadeInDown.duration(380)} style={styles.resultHero}>
        <Text style={[styles.domain, { color }]}>RESULTS · {game.name.toUpperCase()}</Text>
        <Text style={[styles.bigScore, { color }]}>{shown}</Text>
        <Text style={styles.muted}>points{outcome.points > bestBefore && outcome.points > 0 ? ' · new personal best' : ''}</Text>
        <Text style={[styles.stars, { color }]}>
          {'★'.repeat(stars)}
          <Text style={{ color: colors.border }}>{'★'.repeat(3 - stars)}</Text>
        </Text>
        <View style={styles.statRow}>
          <Stat label={game.type === 'items' || game.type === 'sprint' ? 'Correct' : 'Score'} value={`${outcome.right}/${outcome.total}`} color={color} />
          <Stat label="Reached" value={`D${outcome.rating}`} color={color} />
          <Stat label="Time" value={`${outcome.seconds}s`} color={color} />
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).duration(380)} style={styles.card}>
        <View style={styles.rankRow}>
          <Text style={[styles.rankName, { color: rank.color }]}>◆ {rank.name}</Text>
          <Text style={styles.muted}>+{xpGain} XP</Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${rank.progress * 100}%`, backgroundColor: rank.color }]} />
        </View>
        <Text style={styles.cardHint}>{rank.next ? `${rank.next.xp - (xpBefore + xpGain)} XP to ${rank.next.name}` : 'Top rank reached.'}</Text>
      </Animated.View>
      {outcome.mistakes.length > 0 && (
        <Animated.View entering={FadeInDown.delay(220).duration(380)} style={styles.card}>
          <Text style={styles.cardTitle}>Review your mistakes</Text>
          {outcome.mistakes.slice(0, 6).map((m, i) => (
            <View key={i} style={styles.mistake}>
              <Text style={styles.mistakeAsk}>{m.item.ask}</Text>
              <View style={styles.mistakeRow}>
                <Text style={styles.mistakeLabel}>Right answer</Text>
                <View style={styles.mistakeOpt}>
                  <OptionView item={m.item} value={m.item.options[m.item.answer]} size={64} accent={color} />
                </View>
              </View>
              {!!m.item.explain && <Text style={styles.cardText}>{m.item.explain}</Text>}
            </View>
          ))}
        </Animated.View>
      )}
      <View style={styles.actions}>
        <Pressable onPress={onAgain} style={[styles.primary, { backgroundColor: color }]}>
          <Text style={styles.primaryText}>Play again</Text>
        </Pressable>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={styles.secondary}>
          <Text style={styles.secondaryText}>Done</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  muted: { color: colors.muted, textAlign: 'center' },
  intro: { padding: 16, gap: 14, maxWidth: 620, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  hero: { borderRadius: 24, padding: 22, gap: 8, borderWidth: 1 },
  domain: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 36, lineHeight: 40 },
  heroBlurb: { color: colors.muted, fontSize: 15 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 8, alignSelf: 'stretch' },
  stat: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: 'rgba(127,127,127,0.08)', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  card: { borderRadius: 20, padding: 18, gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  cardText: { color: colors.text, lineHeight: 21, opacity: 0.9 },
  cardHint: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  primary: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
  secondary: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  iconBtn: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  iconBtnText: { fontSize: 20 },
  count: { fontSize: 120, fontWeight: '900', fontFamily: displayFont },
  hud: { gap: 8 },
  hudRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  hudText: { color: colors.muted, fontWeight: '800', fontVariant: ['tabular-nums'] },
  hudScore: { fontWeight: '900', fontSize: 20, fontVariant: ['tabular-nums'] },
  combo: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  comboText: { fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  bar: { height: 5, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  popup: { position: 'absolute', right: 0, top: 26, fontWeight: '900', fontSize: 18 },
  play: { padding: 16, gap: 14, alignSelf: 'center', paddingBottom: 48 },
  ask: { color: colors.text, fontWeight: '800', fontSize: 16, textAlign: 'center' },
  prompt: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  options: { gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  option: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  optRight: { borderColor: '#3DDC97', backgroundColor: 'rgba(61,220,151,0.14)' },
  optWrong: { borderColor: '#FF5C70', backgroundColor: 'rgba(255,92,112,0.14)' },
  optLetter: { position: 'absolute', top: 4, left: 7, color: colors.muted, fontSize: 10, fontWeight: '900' },
  explain: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,92,112,0.35)' },
  explainTitle: { color: '#FF5C70', fontWeight: '900', fontSize: 16 },
  custom: { flex: 1, padding: 16, gap: 16, maxWidth: 620, width: '100%', alignSelf: 'center', alignItems: 'stretch' },
  nbGrid: { width: 252, height: 252, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  nbCell: { width: 80, height: 80, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  nbLetter: { color: colors.text, fontSize: 36, fontWeight: '900', textAlign: 'center', height: 44 },
  row2: { flexDirection: 'row', gap: 12 },
  bigBtn: { flex: 1, paddingVertical: 20, borderRadius: 18, alignItems: 'center', backgroundColor: colors.surfaceRaised, borderWidth: 1.5, borderColor: colors.border },
  bigBtnText: { color: colors.text, fontWeight: '900', fontSize: 16 },
  ok: { borderColor: '#3DDC97', backgroundColor: 'rgba(61,220,151,0.15)' },
  bad: { borderColor: '#FF5C70', backgroundColor: 'rgba(255,92,112,0.15)' },
  spanBox: { height: 120, alignItems: 'center', justifyContent: 'center' },
  spanDigit: { fontSize: 96, fontWeight: '900', fontFamily: displayFont },
  spanTyped: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: 4 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  key: { width: '30%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  keyText: { color: colors.text, fontSize: 24, fontWeight: '800' },
  corsi: { alignSelf: 'center', borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  block: { position: 'absolute', borderRadius: 10, backgroundColor: colors.surfaceRaised, borderWidth: 1.5, borderColor: colors.border },
  pegs: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  peg: { height: 170, alignItems: 'center', justifyContent: 'flex-end', borderRadius: 12, paddingBottom: 6 },
  pole: { position: 'absolute', bottom: 12, width: 6, height: 140, borderRadius: 3, backgroundColor: colors.border },
  stack: { flexDirection: 'column-reverse', alignItems: 'center', gap: 3, marginBottom: 4 },
  disc: { height: 18, borderRadius: 9 },
  base: { width: '90%', height: 6, borderRadius: 3, backgroundColor: colors.border },
  results: { padding: 16, gap: 14, maxWidth: 620, width: '100%', alignSelf: 'center', paddingBottom: 48 },
  resultHero: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  bigScore: { fontSize: 72, fontWeight: '900', fontFamily: displayFont, fontVariant: ['tabular-nums', 'lining-nums'] },
  stars: { fontSize: 28, letterSpacing: 4 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankName: { fontWeight: '900', fontSize: 18 },
  mistake: { gap: 6, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  mistakeAsk: { color: colors.muted, fontWeight: '700' },
  mistakeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mistakeLabel: { color: '#3DDC97', fontWeight: '800' },
  mistakeOpt: { minWidth: 70, minHeight: 50, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: '#3DDC97', alignItems: 'center', justifyContent: 'center' },
});
