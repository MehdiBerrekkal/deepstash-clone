import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing, FadeIn, FadeInDown, FadeInUp, FadeOut, ZoomIn, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';

import { OptionView, PromptView, pictureOptions } from '@/components/brain/ItemView';
import { displayFont } from '@/lib/bookType';
import { GAMES, gameById, type GameDef } from '@/lib/brain/catalog';
import { DOMAINS, domainOf, rankFor, seeded, stair, type Item } from '@/lib/brain/core';
import { setMuted, setVolume, sfx } from '@/lib/brain/sfx';
import { haptic } from '@/lib/haptics';
import { localDate, useStore, type BrainRun } from '@/lib/store';
import { colors } from '@/lib/theme';

type Outcome = { points: number; right: number; total: number; perf: number; rating: number; seconds: number; mistakes: { item: Item; picked: number }[] };
type Phase = 'intro' | 'practice' | 'countdown' | 'play' | 'done';

const secondsSince = (t: number) => Math.round((Date.now() - t) / 1000);
const now = () => Date.now();
/** Streak multiplier: ×1 → ×3 in half steps every three right answers in a row. */
const multiplier = (streak: number) => 1 + Math.min(2, Math.floor(streak / 3) * 0.5);
/** The combo chip warms up from the area colour to gold, amber and pink as the multiplier climbs. */
const comboColor = (m: number, base: string) => (m >= 3 ? '#FF6FB5' : m >= 2.5 ? '#FF9F5A' : m >= 2 ? '#FFD166' : base);
const RESUME_HOURS = 24;

/** A training game: intro, an optional practice round, a 3-2-1 countdown, the game, and a results report. */
export default function GameScreen() {
  const { game: id, daily, session } = useLocalSearchParams<{ game: string; daily?: string; session?: string }>();
  const game = gameById[id];
  const { brain, recordBrain, markBrainHowTo, markBrainDaily, setBrainSound, patchBrain } = useStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [run, setRun] = useState(0);
  const [seed, setSeed] = useState('');
  const [resume, setResume] = useState<BrainRun | null>(null);
  const [before, setBefore] = useState({ xp: 0, best: 0, level: 2 });
  const sound = brain.sound !== false;
  useEffect(() => {
    setMuted(!sound);
    setVolume(brain.volume ?? 0.7);
  }, [sound, brain.volume]);

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>That game doesn’t exist.</Text>
      </View>
    );
  }
  const dom = domainOf(game.skill);
  const rating = brain.levels[id] ?? 2;
  const seen = brain.seen.includes(id);
  const saved = brain.run && brain.run.id === id && now() - brain.run.saved < RESUME_HOURS * 3600e3 ? brain.run : null;
  const today = localDate();
  const inSession = !!session && brain.session?.date === today && brain.session.games.includes(id);

  const begin = (from: BrainRun | null) => {
    sfx.unlock();
    markBrainHowTo(id);
    setResume(from);
    if (!from && brain.run?.id === id) patchBrain({ run: undefined });
    setSeed(daily ? `daily-${localDate()}-${id}` : String(now()));
    setBefore({ xp: brain.xp ?? 0, best: brain.best[id] ?? 0, level: rating });
    setRun((r) => r + 1);
    setPhase('countdown');
  };

  const finish = (o: Outcome) => {
    const xp = Math.round(o.points / 4) + 10;
    recordBrain({ id, skill: game.skill, points: o.points, perf: o.perf, xp, rating: o.rating, seconds: o.seconds });
    if (brain.run?.id === id) patchBrain({ run: undefined });
    if (inSession && brain.session) {
      patchBrain({ session: { ...brain.session, done: { ...brain.session.done, [id]: { points: o.points, right: o.right, total: o.total, xp, from: before.level, to: o.rating } } } });
    }
    if (daily) markBrainDaily('game');
    if (rankFor(before.xp + xp).index > rankFor(before.xp).index || (o.points > before.best && o.points > 0)) sfx.levelUp();
    haptic.success();
    setOutcome(o);
    setPhase('done');
  };

  const playProps = { rating, color: dom.color, seed, onDone: finish };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: game.name }} />
      <Ambient color={dom.color} />
      {phase === 'intro' && (
        <ScrollView contentContainerStyle={styles.intro}>
          <Animated.View entering={FadeInDown.duration(380)}>
            <LinearGradient colors={[`${dom.color}33`, `${dom.color}08`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderColor: `${dom.color}55` }]}>
              <Text style={[styles.domain, { color: dom.color }]}>
                {dom.glyph} {dom.name.toUpperCase()}
                {inSession ? `  ·  TODAY’S SESSION ${brain.session!.games.indexOf(id) + 1}/3` : daily ? '  ·  DAILY CHALLENGE' : ''}
              </Text>
              <Text style={styles.title}>{game.name}</Text>
              <Text style={styles.heroBlurb}>{game.blurb}</Text>
              <View style={styles.statRow}>
                <Stat label="Level" value={`${rating}`} color={dom.color} />
                <Stat label="Best" value={String(brain.best[id] ?? '—')} color={dom.color} />
                <Stat label="Played" value={String(brain.played[id] ?? 0)} color={dom.color} />
              </View>
            </LinearGradient>
          </Animated.View>
          {saved && (
            <Animated.View entering={FadeInDown.delay(40).duration(380)}>
              <Pressable accessibilityLabel="Resume" onPress={() => begin(saved)} style={[styles.resume, { borderColor: dom.color }]}>
                <View style={styles.flex}>
                  <Text style={[styles.resumeKicker, { color: dom.color }]}>UNFINISHED RUN</Text>
                  <Text style={styles.cardTitle}>
                    Resume at question {saved.n + 1} / {game.items} · Level {saved.d}
                  </Text>
                  <Text style={styles.cardHint2}>{saved.points} points so far</Text>
                </View>
                <Text style={[styles.resumeArrow, { color: dom.color }]}>›</Text>
              </Pressable>
            </Animated.View>
          )}
          <Animated.View entering={FadeInDown.delay(80).duration(380)} style={styles.card}>
            <Text style={styles.cardTitle}>{seen ? 'Reminder' : 'How it works'}</Text>
            <Text style={styles.cardText}>{game.howTo}</Text>
            {!!game.why && (
              <View style={styles.whyRow}>
                <Text style={[styles.whyLabel, { color: dom.color }]}>WHY</Text>
                <Text style={styles.whyText}>{game.why}</Text>
              </View>
            )}
            <Text style={styles.cardHint}>The level adapts as you play: two right in a row moves up, a mistake moves down. Streaks multiply your points up to ×3.</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(160).duration(380)} style={styles.actions}>
            {seen ? (
              <Pressable accessibilityLabel="Start" onPress={() => begin(null)} style={[styles.primary, { backgroundColor: dom.color }]}>
                <Text style={styles.primaryText}>{saved ? 'Start over' : 'Start'}</Text>
              </Pressable>
            ) : (
              <Pressable accessibilityLabel="Practice first" onPress={() => (sfx.unlock(), setPhase('practice'))} style={[styles.primary, { backgroundColor: dom.color }]}>
                <Text style={styles.primaryText}>Try a practice round</Text>
              </Pressable>
            )}
            <Pressable accessibilityLabel={sound ? 'Mute sounds' : 'Turn sounds on'} onPress={() => setBrainSound(!sound)} style={styles.iconBtn}>
              <Text style={styles.iconBtnText}>{sound ? '🔊' : '🔇'}</Text>
            </Pressable>
          </Animated.View>
          {seen ? (
            <Pressable accessibilityLabel="Practice" onPress={() => setPhase('practice')} style={styles.linkBtn}>
              <Text style={styles.linkText}>Practice round (not scored)</Text>
            </Pressable>
          ) : (
            <Pressable accessibilityLabel="Start" onPress={() => begin(null)} style={styles.linkBtn}>
              <Text style={styles.linkText}>Skip practice and start</Text>
            </Pressable>
          )}
        </ScrollView>
      )}
      {phase === 'practice' && <Practice game={game} color={dom.color} onDone={() => begin(null)} />}
      {phase === 'countdown' && <Countdown color={dom.color} onDone={() => setPhase('play')} />}
      {phase === 'play' && (
        <View style={styles.flex}>
          {game.type === 'items' || game.type === 'sprint' ? (
            <ItemsRun key={run} game={game} resume={resume} save={(r) => patchBrain({ run: r })} {...playProps} />
          ) : game.type === 'nback' ? (
            <NBack key={run} {...playProps} />
          ) : game.type === 'span' ? (
            <DigitSpan key={run} {...playProps} />
          ) : game.type === 'corsi' ? (
            <Corsi key={run} {...playProps} />
          ) : (
            <Tower key={run} {...playProps} />
          )}
        </View>
      )}
      {phase === 'done' && outcome && (
        <Results game={game} outcome={outcome} before={before} color={dom.color} session={inSession} onAgain={() => setPhase('intro')} />
      )}
    </View>
  );
}

/** Two soft glows drifting slowly behind the game, in the area's colour. Still when reduce-motion is on. */
function Ambient({ color }: { color: string }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduced) t.set(withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [reduced, t]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: -40 + t.get() * 80 }, { translateY: t.get() * 40 }], opacity: 0.05 + t.get() * 0.04 }));
  const b = useAnimatedStyle(() => ({ transform: [{ translateX: 30 - t.get() * 60 }, { translateY: -t.get() * 30 }], opacity: 0.08 - t.get() * 0.04 }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.glow, { top: -120, left: -80, backgroundColor: color }, a]} />
      <Animated.View style={[styles.glow, { bottom: -140, right: -100, backgroundColor: color }, b]} />
    </View>
  );
}

function Stat({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {!!sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

function Countdown({ color, onDone }: { color: string; onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) {
      sfx.go();
      const t = setTimeout(onDone, 420);
      return () => clearTimeout(t);
    }
    sfx.tick();
    const t = setTimeout(() => setN(n - 1), 650);
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

type Popup = { id: number; text: string; tone?: 'good' | 'bad' | 'level' };

function Hud({ left, right, progress, streak, color, popup, onPause, dots }: { left: string; right: string; progress: number; streak: number; color: string; popup: Popup | null; onPause?: () => void; dots?: (boolean | null)[] }) {
  const m = multiplier(streak);
  const hot = comboColor(m, color);
  return (
    <View style={styles.hud}>
      <View style={styles.hudRow}>
        {onPause && (
          <Pressable accessibilityLabel="Pause" onPress={onPause} hitSlop={10} style={styles.pauseBtn}>
            <Text style={styles.pauseText}>❚❚</Text>
          </Pressable>
        )}
        <Text style={[styles.hudText, styles.flex]}>{left}</Text>
        {streak >= 2 && (
          <Animated.View key={m} entering={ZoomIn.springify().damping(10)} style={[styles.combo, { borderColor: hot, backgroundColor: `${hot}1F`, shadowColor: hot, shadowOpacity: m > 1 ? 0.8 : 0, shadowRadius: 4 + m * 4 }]}>
            <Text style={[styles.comboText, { color: hot }]}>
              ✦ {streak}
              {m > 1 ? `  ×${m}` : ''}
            </Text>
          </Animated.View>
        )}
        <Text style={[styles.hudScore, { color }]}>{right}</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%`, backgroundColor: progress < 0.25 ? '#FF5C70' : color }]} />
      </View>
      {dots && (
        <View style={styles.dots}>
          {dots.map((d, i) => (
            <View key={i} style={[styles.dot, d === true && { backgroundColor: '#3DDC97' }, d === false && { backgroundColor: '#FF5C70' }, d === null && i === dots.findIndex((x) => x === null) && { borderColor: color, borderWidth: 1.5 }]} />
          ))}
        </View>
      )}
      {popup && (
        <Animated.Text
          key={popup.id}
          entering={FadeInUp.duration(220)}
          exiting={FadeOut.duration(400)}
          style={[styles.popup, popup.tone === 'bad' && { color: '#FF5C70' }, popup.tone === 'level' && styles.popupLevel, popup.tone !== 'bad' && popup.tone !== 'level' && { color: hot }]}>
          {popup.text}
        </Animated.Text>
      )}
    </View>
  );
}

/** "So close": a numeric or letter answer just off the right one. */
function nearMiss(item: Item, picked: number) {
  const a = item.options[item.answer];
  const p = item.options[picked];
  if (typeof a === 'number' && typeof p === 'number') return Math.abs(a - p) <= Math.max(2, Math.abs(a) * 0.05);
  if (typeof a === 'string' && typeof p === 'string' && a.length <= 2 && p.length === a.length) return Math.abs(a.charCodeAt(0) - p.charCodeAt(0)) === 1;
  return false;
}

// ---------- practice ----------

/** One guided easy item (or a short round of the memory games), not scored. */
function Practice({ game, color, onDone }: { game: GameDef; color: string; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 32;
  const [item] = useState(() => game.make?.(1, seeded(`practice-${game.id}-${now()}`)));
  const [picked, setPicked] = useState<number | null>(null);
  const [customDone, setCustomDone] = useState(false);
  const banner = (
    <View style={[styles.practiceBanner, { borderColor: color }]}>
      <Text style={[styles.practiceKicker, { color }]}>PRACTICE · NOT SCORED</Text>
    </View>
  );
  const ready = (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.explainOk}>
      <Text style={[styles.explainTitle, { color: '#3DDC97' }]}>{picked === null || !item || picked === item.answer ? 'You’ve got it.' : 'Now you know the trick.'}</Text>
      {!!item?.explain && <Text style={styles.cardText}>{item.explain}</Text>}
      <Pressable accessibilityLabel="Start the real game" onPress={onDone} style={[styles.primary, { backgroundColor: color }]}>
        <Text style={styles.primaryText}>Start the real game</Text>
      </Pressable>
    </Animated.View>
  );
  if (!item) {
    const props = { rating: 1, color, seed: 'practice', practice: true, onDone: () => setCustomDone(true) };
    return (
      <View style={styles.flex}>
        <View style={styles.practicePad}>{banner}</View>
        {customDone ? (
          <View style={styles.practicePad}>{ready}</View>
        ) : game.type === 'nback' ? (
          <NBack {...props} />
        ) : game.type === 'span' ? (
          <DigitSpan {...props} />
        ) : game.type === 'corsi' ? (
          <Corsi {...props} />
        ) : (
          <Tower {...props} />
        )}
      </View>
    );
  }
  const pics = pictureOptions(item.kind);
  const cols = pics ? (item.options.length > 6 ? 4 : item.options.length > 4 ? 3 : 2) : item.kind === 'code' ? Math.min(5, item.options.length) : item.options.length === 4 && game.type === 'sprint' ? 2 : 1;
  const tile = pics ? Math.floor((w - (cols - 1) * 8) / cols) : 0;
  return (
    <ScrollView contentContainerStyle={[styles.play, { width: w + 32 }]}>
      {banner}
      {!!item.ask && <Text style={styles.ask}>{item.ask}</Text>}
      <View style={styles.prompt}>
        <PromptView item={item} width={w} accent={color} />
      </View>
      <View style={[styles.options, cols > 1 && styles.grid]}>
        {item.options.map((o, i) => (
          <Pressable
            key={i}
            accessibilityLabel={`Option ${i + 1}`}
            onPress={() => {
              if (picked !== null) return;
              setPicked(i);
              if (i === item.answer) sfx.right();
              else sfx.wrong();
            }}
            style={[styles.option, pics ? { width: tile, height: tile, paddingVertical: 9, paddingHorizontal: 9 } : cols > 1 ? { width: (w - (cols - 1) * 8) / cols } : null, picked !== null && i === item.answer && styles.optRight, picked === i && i !== item.answer && styles.optWrong]}>
            {pics && <Text style={styles.optLetter}>{'ABCDEFGH'[i]}</Text>}
            <OptionView item={item} value={o} size={pics ? tile - 30 : 0} accent={color} />
          </Pressable>
        ))}
      </View>
      {picked !== null && ready}
    </ScrollView>
  );
}

// ---------- multiple-choice runs (puzzles and sprints) ----------

function ItemsRun({ game, rating, seed, color, onDone, resume, save }: { game: GameDef; rating: number; seed: string; color: string; onDone: (o: Outcome) => void; resume: BrainRun | null; save: (r: BrainRun) => void }) {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const w = Math.min(width, 620) - 32;
  const rng = useMemo(() => seeded(`${game.id}-${seed}`), [game.id, seed]);
  const sprint = game.type === 'sprint';
  const total = game.items ?? 0;
  const start = resume?.d ?? rating;
  const [d, setD] = useState(start);
  const [item, setItem] = useState<Item>(() => game.make!(start, rng));
  const [n, setN] = useState(resume?.n ?? 0);
  const [right, setRight] = useState(resume?.right ?? 0);
  const [points, setPoints] = useState(resume?.points ?? 0);
  const [streak, setStreak] = useState(resume?.streak ?? 0);
  const [history, setHistory] = useState<boolean[]>(resume?.history ?? []);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [left, setLeft] = useState(game.seconds ?? game.perItem ?? 60);
  const [mistakes, setMistakes] = useState<Outcome['mistakes']>([]);
  const [hardest, setHardest] = useState(resume?.hardest ?? start);
  const [paused, setPaused] = useState(false);
  const started = useRef(0);
  const shown = useRef(0);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  useEffect(() => {
    started.current = now() - (resume?.seconds ?? 0) * 1000;
    shown.current = now();
    // Mount only: the resume point is fixed for this run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // One clock: the whole sprint, or the time allowed for each puzzle. It stops while paused.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  const end = (r: number, count: number, pts: number) => {
    const acc = count ? r / count : 0;
    // Performance blends how hard it got with how accurate you were.
    const perf = Math.round(Math.min(100, (hardest / 10) * 70 + acc * 30));
    onDone({ points: pts, right: r, total: count, perf, rating: Math.max(1, Math.min(10, d)), seconds: secondsSince(started.current), mistakes });
  };
  const nextItem = (nd: number) => {
    setItem(game.make!(nd, rng));
    setPicked(null);
    setRevealed(false);
    shown.current = now();
    if (!sprint) setLeft(game.perItem ?? 60);
  };
  const answer = (i: number) => {
    if (picked !== null || paused) return;
    const ok = i === item.answer;
    const ns = ok ? streak + 1 : 0;
    const nd = stair(d, ok, ns, n < 3);
    const secs = (now() - shown.current) / 1000;
    let gain = 0;
    setPicked(i);
    // A short beat between choosing and the reveal (instant in sprints, where speed is the point).
    const reveal = () => {
      setRevealed(true);
      if (ok) {
        const speed = sprint ? 1 : Math.max(0, 1 - secs / (game.perItem ?? 60));
        gain = Math.round(10 * d * multiplier(ns) * (1 + speed * 0.5));
        sfx.right(ns);
        if (ns >= 3 && ns % 3 === 0) sfx.combo(ns);
        haptic.tap();
        setPopup({ id: now(), text: nd > d ? `+${gain}  ·  Level ${nd} ↑` : `+${gain}${!sprint && speed > 0.7 ? '  ⚡ fast' : ''}`, tone: nd > d ? 'level' : 'good' });
        if (nd > d) sfx.levelStep(true);
      } else {
        sfx.wrong();
        haptic.tick();
        if (!reduced) shake.set(withSequence(withTiming(-9, { duration: 50 }), withTiming(9, { duration: 50 }), withTiming(-5, { duration: 50 }), withTiming(0, { duration: 50 })));
        if (sprint) {
          setLeft((s) => s - 2);
          setPopup({ id: now(), text: '−2 s', tone: 'bad' });
        } else {
          setMistakes((m) => [...m, { item, picked: i }]);
          if (nd < d) setPopup({ id: now(), text: `Level ${nd} ↓`, tone: 'bad' });
        }
      }
      setStreak(ns);
      setD(nd);
      if (ok) setHardest((h) => Math.max(h, d));
      const r2 = right + (ok ? 1 : 0);
      const p2 = points + gain;
      const h2 = [...history, ok];
      setRight(r2);
      setPoints(p2);
      setHistory(h2);
      const count = n + 1;
      setN(count);
      if (!sprint && count < total) save({ id: game.id, n: count, right: r2, points: p2, d: nd, streak: ns, hardest: Math.max(hardest, ok ? d : 0), seconds: secondsSince(started.current), history: h2, saved: now() });
      // Right answers move on quickly; wrong ones pause on the explanation (puzzles) or flash (sprints).
      if (sprint) setTimeout(() => nextItem(nd), ok ? 150 : 400);
      else if (ok) setTimeout(() => (count >= total ? end(r2, count, p2) : nextItem(nd)), 700);
    };
    if (sprint) reveal();
    else setTimeout(reveal, 220);
  };

  // The clock running out ends a sprint, or counts the puzzle as missed.
  const expired = left <= 0;
  useEffect(() => {
    if (!expired) return;
    const t = setTimeout(() => {
      if (sprint) end(right, n, points);
      else if (picked === null) answer(-1);
    }, 0);
    return () => clearTimeout(t);
    // Reacting only to the clock running out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const pics = pictureOptions(item.kind);
  const cols = pics ? (item.options.length > 6 ? 4 : item.options.length > 4 ? 3 : 2) : item.kind === 'code' ? Math.min(5, item.options.length) : item.options.length === 4 && sprint ? 2 : 1;
  const tile = pics ? Math.floor((w - (cols - 1) * 8) / cols) : 0;
  const wrongPick = revealed && picked !== null && picked !== item.answer;

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.play, { width: w + 32 }]} keyboardShouldPersistTaps="handled">
        <Hud
          left={sprint ? `${Math.max(0, left)} s · Level ${d}` : `${Math.min(n + (picked === null ? 1 : 0), total)} / ${total} · Level ${d}`}
          right={`${points}`}
          progress={sprint ? left / (game.seconds ?? 60) : left / (game.perItem ?? 60)}
          streak={streak}
          color={color}
          popup={popup}
          onPause={() => setPaused(true)}
          dots={sprint ? undefined : Array.from({ length: total }, (_, k) => history[k] ?? null)}
        />
        {!!item.ask && <Text style={styles.ask}>{item.ask}</Text>}
        <Animated.View key={`${n}-${item.answer}`} entering={FadeIn.duration(200)} style={[styles.prompt, shakeStyle]}>
          <PromptView item={item} width={w} accent={color} />
        </Animated.View>
        <View style={[styles.options, cols > 1 && styles.grid]}>
          {item.options.map((o, i) => {
            const state = picked === null ? null : !revealed ? (i === picked ? 'chosen' : null) : i === item.answer ? 'right' : i === picked ? 'wrong' : 'dim';
            return (
              <Pressable
                key={i}
                accessibilityLabel={`Option ${i + 1}`}
                onPress={() => answer(i)}
                style={({ pressed }) => [
                  styles.option,
                  pics ? { width: tile, height: tile, paddingVertical: 9, paddingHorizontal: 9 } : cols > 1 ? { width: (w - (cols - 1) * 8) / cols } : null,
                  pressed && picked === null && styles.optPressed,
                  state === 'chosen' && { borderColor: color, backgroundColor: `${color}22` },
                  state === 'right' && styles.optRight,
                  state === 'wrong' && styles.optWrong,
                  state === 'dim' && { opacity: 0.4 },
                ]}>
                {pics && <Text style={styles.optLetter}>{'ABCDEFGH'[i]}</Text>}
                <OptionView item={item} value={o} size={pics ? tile - 30 : 0} accent={color} />
                {state === 'right' && (
                  <Animated.View entering={ZoomIn.springify().damping(11)} style={styles.badge}>
                    <Text style={styles.badgeText}>✓</Text>
                  </Animated.View>
                )}
              </Pressable>
            );
          })}
        </View>
        {!sprint && wrongPick && (
          <Animated.View entering={FadeInDown.duration(220)} style={styles.explain}>
            <Text style={styles.explainTitle}>{picked === -1 ? 'Time’s up' : nearMiss(item, picked) ? 'So close' : 'Not this one'}</Text>
            {!!item.explain && <Text style={styles.cardText}>{item.explain}</Text>}
            <Pressable accessibilityLabel="Next" onPress={() => (n >= total ? end(right, n, points) : nextItem(d))} style={[styles.primary, { backgroundColor: color }]}>
              <Text style={styles.primaryText}>{n >= total ? 'See results' : 'Next'}</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
      {paused && (
        <Animated.View entering={FadeIn.duration(160)} style={styles.pauseLayer}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>Paused</Text>
            <Text style={styles.cardHint}>{sprint ? 'The clock is stopped.' : 'The clock is stopped. If you leave, you can resume this run later from the game page.'}</Text>
            <Pressable accessibilityLabel="Continue" onPress={() => setPaused(false)} style={[styles.primary, styles.full, { backgroundColor: color }]}>
              <Text style={styles.primaryText}>Continue</Text>
            </Pressable>
            <Pressable accessibilityLabel="Quit" onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={[styles.secondary, styles.full]}>
              <Text style={styles.secondaryText}>{sprint ? 'Quit' : 'Save and quit'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
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

type Flash = 'ok' | 'bad' | 'miss';
type CustomProps = { rating: number; color: string; seed: string; onDone: (o: Outcome) => void; practice?: boolean };

function NBack({ rating, color, onDone, practice }: CustomProps) {
  const N = practice ? 1 : Math.max(1, Math.min(5, Math.ceil(rating / 2)));
  const total = practice ? 9 : 20 + N;
  const trialMs = practice ? 3000 : 2500;
  const [seq] = useState(() => makeNBack(N, total));
  const [i, setI] = useState(-1);
  const [lit, setLit] = useState(false);
  const pressed = useRef({ pos: false, snd: false });
  const score = useRef({ hits: 0, false_: 0, chances: 0 });
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<{ pos?: Flash; snd?: Flash }>({});
  const started = useRef(0);

  useEffect(() => {
    started.current = now();
    const t = setTimeout(() => setI(0), 900);
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
      pressed.current = { pos: false, snd: false };
      Speech.speak(seq.letters[i], { rate: 1.1 });
    }, 0);
    const clear = setTimeout(() => setFlash({}), 500);
    const off = setTimeout(() => setLit(false), 800);
    const next = setTimeout(() => {
      if (i >= N) {
        const posMatch = seq.pos[i] === seq.pos[i - N];
        const sndMatch = seq.letters[i] === seq.letters[i - N];
        if (posMatch) score.current.chances++;
        if (sndMatch) score.current.chances++;
        // Missed matches flash amber, so you learn what you didn't catch.
        const missed = { pos: posMatch && !pressed.current.pos ? 'miss' : undefined, snd: sndMatch && !pressed.current.snd ? 'miss' : undefined } as { pos?: Flash; snd?: Flash };
        if (missed.pos || missed.snd) setFlash(missed);
      }
      setI(i + 1);
    }, trialMs);
    return () => {
      clearTimeout(on);
      clearTimeout(clear);
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
      setHits(score.current.hits);
      sfx.right(score.current.hits);
      haptic.tap();
    } else {
      score.current.false_++;
      sfx.wrong();
      haptic.tick();
    }
    setFlash((f) => ({ ...f, [ch]: match ? 'ok' : 'bad' }));
  };
  const hint = practice && i >= N && i < total ? [seq.pos[i] === seq.pos[i - N] && 'same square', seq.letters[i] === seq.letters[i - N] && 'same letter'].filter(Boolean).join(' and ') : '';

  return (
    <View style={styles.custom}>
      <Hud left={i < 0 ? 'Get ready…' : `${Math.max(0, i + 1)} / ${total}`} right={`${N}-back · ${hits} ✓`} progress={(i + 1) / total} streak={0} color={color} popup={null} />
      <Text style={styles.ask}>{i < N ? `Remember the first ${N === 1 ? 'one' : N}…` : `Same as ${N} step${N > 1 ? 's' : ''} back?`}</Text>
      <View style={styles.nbGrid}>
        {Array.from({ length: 9 }, (_, k) => (
          <View key={k} style={[styles.nbCell, lit && seq.pos[i] === k && { backgroundColor: color, borderColor: color, shadowColor: color, shadowOpacity: 0.7, shadowRadius: 14 }]} />
        ))}
      </View>
      <Text style={styles.nbLetter}>{lit && i >= 0 && i < total ? seq.letters[i] : ' '}</Text>
      {practice && <Text style={[styles.hint, { color }]}>{hint ? `Match: ${hint} — press now` : ' '}</Text>}
      <View style={styles.row2}>
        {(['pos', 'snd'] as const).map((ch) => (
          <Pressable key={ch} accessibilityLabel={ch === 'pos' ? 'Position match' : 'Sound match'} onPress={() => press(ch)} style={({ pressed: p }) => [styles.bigBtn, p && styles.optPressed, flash[ch] === 'ok' && styles.ok, flash[ch] === 'bad' && styles.bad, flash[ch] === 'miss' && styles.miss]}>
            <Text style={styles.bigBtnText}>{ch === 'pos' ? 'Position' : 'Sound'}</Text>
            <Text style={styles.bigBtnSub}>{flash[ch] === 'miss' ? 'missed a match' : flash[ch] === 'bad' ? 'not a match' : flash[ch] === 'ok' ? 'match ✓' : ' '}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.cardHint}>The letter is spoken and shown. Press only when it matches {N} back. Turn your sound on for the letters.</Text>
    </View>
  );
}

// ---------- digit span ----------

const randomDigits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10));

function DigitSpan({ rating, color, onDone, practice }: CustomProps) {
  const backward = !practice && rating >= 5;
  const [len, setLen] = useState(practice ? 3 : backward ? 3 : 4);
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
    }, 700);
    return () => clearTimeout(kick);
  }, [len, round]);
  // Show each digit for a moment, one after another.
  useEffect(() => {
    if (showing < 0 || showing >= digits.length) return;
    sfx.tick();
    const t = setTimeout(() => setShowing(showing + 1), 900);
    return () => clearTimeout(t);
  }, [showing, digits.length]);

  const finish = (span: number) =>
    onDone({
      points: span * 30 * (backward ? 2 : 1),
      right: span,
      total: span,
      perf: Math.round(Math.min(100, Math.max(0, ((span - (backward ? 2 : 3)) / 6) * 100))),
      rating: span >= (backward ? 6 : 8) ? Math.min(10, rating + 2) : span <= 4 ? Math.max(1, rating - 1) : rating,
      seconds: secondsSince(started.current),
      mistakes: [],
    });
  const done = showing >= digits.length && digits.length > 0;
  const key = (k: number) => {
    if (!done || result) return;
    sfx.click();
    const t = [...typed, k];
    setTyped(t);
    if (t.length < digits.length) return;
    const target = backward ? [...digits].reverse() : digits;
    const ok = t.every((x, j) => x === target[j]);
    setResult(ok ? 'ok' : 'bad');
    if (ok) {
      sfx.right(len - 3);
      haptic.tap();
    } else {
      sfx.wrong();
      haptic.tick();
    }
    setTimeout(() => {
      if (practice) return finish(ok ? len : 0);
      if (ok) {
        setBest(len);
        setLen(len + 1);
      } else if (lives <= 1) finish(best);
      else {
        setLives(lives - 1);
        setRound(round + 1);
      }
    }, 900);
  };

  const target = backward ? [...digits].reverse() : digits;
  return (
    <View style={styles.custom}>
      <Hud left={`${backward ? 'Backward' : 'Forward'} · lives ${'●'.repeat(lives)}${'○'.repeat(2 - lives)}`} right={`${len} digits`} progress={Math.min(1, best / 10)} streak={0} color={color} popup={null} />
      <Text style={styles.ask}>{done ? (backward ? 'Type them in REVERSE order' : 'Type them in the same order') : 'Remember the digits…'}</Text>
      <View style={styles.spanBox}>
        {!done ? (
          <Animated.Text key={showing} entering={ZoomIn.duration(200)} style={[styles.spanDigit, { color }]}>
            {showing >= 0 && showing < digits.length ? digits[showing] : ''}
          </Animated.Text>
        ) : (
          <View style={styles.slots}>
            {digits.map((_, j) => (
              <View key={j} style={[styles.slot, j === typed.length && !result && { borderColor: color }, result === 'ok' && { borderColor: '#3DDC97' }, result === 'bad' && { borderColor: typed[j] === target[j] ? '#3DDC97' : '#FF5C70' }]}>
                <Text style={styles.slotText}>{typed[j] ?? ''}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {result === 'bad' && <Text style={styles.cardHint}>It was {target.join(' ')}</Text>}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((k) => (
          <Pressable key={k} accessibilityLabel={`Digit ${k}`} disabled={!done} onPress={() => key(k)} style={({ pressed }) => [styles.key, pressed && styles.optPressed, !done && { opacity: 0.35 }]}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityLabel="Delete" disabled={!done} onPress={() => setTyped(typed.slice(0, -1))} style={[styles.key, !done && { opacity: 0.35 }]}>
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
    const p: [number, number] = [0.06 + rng() * 0.74, 0.06 + rng() * 0.74];
    if (out.every(([x, y]) => Math.abs(x - p[0]) > 0.21 || Math.abs(y - p[1]) > 0.21)) out.push(p);
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

function Corsi({ rating, color, seed, onDone, practice }: CustomProps) {
  const { width } = useWindowDimensions();
  const box = Math.min(width - 48, 360);
  const [blocks] = useState(() => scatter(seed));
  const [len, setLen] = useState(practice ? 3 : Math.max(3, Math.min(6, 2 + Math.ceil(rating / 2))));
  const [path, setPath] = useState<number[]>([]);
  const [show, setShow] = useState(-1);
  const [taps, setTaps] = useState<number[]>([]);
  const [lives, setLives] = useState(2);
  const [best, setBest] = useState(0);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<'ok' | 'bad' | null>(null);
  const started = useRef(0);
  useEffect(() => {
    started.current = now();
  }, []);
  useEffect(() => {
    const p = randomPath(len);
    const t = setTimeout(() => {
      setPath(p);
      setTaps([]);
      setResult(null);
      setShow(0);
    }, 700);
    return () => clearTimeout(t);
  }, [len, round]);
  useEffect(() => {
    if (show < 0 || show >= path.length) return;
    sfx.tick();
    const t = setTimeout(() => setShow(show + 1), 650);
    return () => clearTimeout(t);
  }, [show, path.length]);
  const ready = show >= path.length && path.length > 0;
  const finish = (b: number) =>
    onDone({ points: b * 35, right: b, total: b, perf: Math.round(Math.min(100, Math.max(0, ((b - 2) / 6) * 100))), rating: b >= 7 ? Math.min(10, rating + 2) : b <= 4 ? Math.max(1, rating - 1) : rating, seconds: secondsSince(started.current), mistakes: [] });
  const tap = (k: number) => {
    if (!ready || result) return;
    const t = [...taps, k];
    setTaps(t);
    if (t[t.length - 1] !== path[t.length - 1]) {
      sfx.wrong();
      haptic.tick();
      setResult('bad');
      setTimeout(() => {
        if (practice) finish(0);
        else if (lives <= 1) finish(best);
        else {
          setLives(lives - 1);
          setRound(round + 1);
        }
      }, 900);
      return;
    }
    sfx.right(t.length - 1);
    if (t.length === path.length) {
      haptic.tap();
      setResult('ok');
      setBest(len);
      setTimeout(() => (practice ? finish(len) : setLen(len + 1)), 600);
    }
  };
  const active = ready ? null : path[show];
  return (
    <View style={styles.custom}>
      <Hud left={`Lives ${'●'.repeat(lives)}${'○'.repeat(2 - lives)}`} right={`${len} blocks`} progress={Math.min(1, best / 9)} streak={0} color={color} popup={null} />
      <Text style={styles.ask}>{result === 'bad' ? 'Not that one — the right path is shown' : ready ? `Tap the ${len} blocks in the same order` : 'Watch the order…'}</Text>
      <View style={[styles.corsi, { width: box, height: box }]}>
        {blocks.map(([x, y], k) => {
          const order = taps.indexOf(k);
          const wrongShow = result === 'bad' && path.includes(k);
          return (
            <Pressable
              key={k}
              accessibilityLabel={`Block ${k + 1}`}
              onPress={() => tap(k)}
              style={[
                styles.block,
                { left: x * box, top: y * box, width: box * 0.18, height: box * 0.18 },
                active === k && { backgroundColor: color, borderColor: color, shadowColor: color, shadowOpacity: 0.8, shadowRadius: 14 },
                order >= 0 && !result && { borderColor: color, backgroundColor: `${color}55` },
                result === 'ok' && order >= 0 && { backgroundColor: '#3DDC97', borderColor: '#3DDC97' },
                wrongShow && { borderColor: '#FFB547' },
              ]}>
              {wrongShow && <Text style={styles.blockNum}>{path.indexOf(k) + 1}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ---------- tower planning ----------

type Pegs = number[][];
const DISC_COLORS = ['#7C8CFF', '#4FD1FF', '#3DDC97', '#FFB547', '#FF6FB5'];
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

function Tower({ rating, color, seed, onDone, practice }: CustomProps) {
  const puzzles = practice ? 1 : 3;
  const discs = practice ? 2 : rating <= 3 ? 3 : rating <= 7 ? 4 : 5;
  const rng = useMemo(() => seeded(`tower-${seed}`), [seed]);
  const [puzzle, setPuzzle] = useState(() => makeTower(discs, rng));
  const [pegs, setPegs] = useState<Pegs>(puzzle.start);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [k, setK] = useState(0);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState({ points: 0, perfect: 0, ratio: 0 });
  const started = useRef(0);
  const { width } = useWindowDimensions();
  const pegW = Math.min(110, (width - 64) / 3);
  useEffect(() => {
    started.current = now();
  }, []);

  const tapPeg = (i: number) => {
    if (solved) return;
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
    sfx.right(m === puzzle.optimal ? 5 : 1);
    haptic.tap();
    setSolved(true);
    const eff = puzzle.optimal / m;
    const s = { points: score.points + Math.round(100 * eff * discs), perfect: score.perfect + (m === puzzle.optimal ? 1 : 0), ratio: score.ratio + eff };
    setScore(s);
    setTimeout(() => {
      if (k + 1 >= puzzles) {
        const avg = s.ratio / puzzles;
        onDone({ points: s.points, right: s.perfect, total: puzzles, perf: Math.round(Math.min(100, (discs / 5) * 50 + avg * 50)), rating: avg > 0.9 ? Math.min(10, rating + 2) : avg < 0.6 ? Math.max(1, rating - 1) : rating, seconds: secondsSince(started.current), mistakes: [] });
        return;
      }
      const p = makeTower(discs, rng);
      setPuzzle(p);
      setPegs(p.start);
      setMoves(0);
      setSolved(false);
      setK(k + 1);
    }, 1100);
  };

  const drawPegs = (p: Pegs, interactive: boolean, w: number, h: number) => (
    <View style={styles.pegs}>
      {p.map((stack, i) => (
        <Pressable key={i} accessibilityLabel={interactive ? `Peg ${i + 1}` : undefined} disabled={!interactive} onPress={() => tapPeg(i)} style={[styles.peg, { width: w, height: h }, interactive && held === i && { backgroundColor: `${color}22` }]}>
          <View style={[styles.pole, { height: h - 30 }]} />
          <View style={styles.stack}>
            {stack.map((disc, j) => (
              <View
                key={j}
                style={[styles.disc, { height: h / 9, width: 18 + disc * ((w - 22) / discs), backgroundColor: DISC_COLORS[disc - 1] }, interactive && held === i && j === stack.length - 1 && { transform: [{ translateY: -16 }] }]}
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
      <Hud left={`Puzzle ${k + 1} / ${puzzles}`} right={`${moves} moves · best ${puzzle.optimal}`} progress={(k + (solved ? 1 : 0)) / puzzles} streak={0} color={color} popup={null} />
      <View style={styles.goalBox}>
        <Text style={styles.goalLabel}>GOAL</Text>
        {drawPegs(puzzle.goal, false, pegW * 0.72, 110)}
      </View>
      <Text style={styles.ask}>{solved ? (moves === puzzle.optimal ? 'Perfect — fewest moves possible' : `Solved in ${moves} (best ${puzzle.optimal})`) : 'Tap a peg to lift its top disc, then tap where it goes'}</Text>
      {drawPegs(pegs, true, pegW, 170)}
      <Pressable
        accessibilityLabel="Reset puzzle"
        disabled={solved || !moves}
        onPress={() => {
          setPegs(puzzle.start);
          setHeld(null);
          setMoves(0);
        }}
        style={[styles.linkBtn, (!moves || solved) && { opacity: 0.35 }]}>
        <Text style={styles.linkText}>↺ Reset this puzzle</Text>
      </Pressable>
    </View>
  );
}

// ---------- results ----------

function Results({ game, outcome, before, color, session, onAgain }: { game: GameDef; outcome: Outcome; before: { xp: number; best: number; level: number }; color: string; session: boolean; onAgain: () => void }) {
  const { brain } = useStore();
  const xpGain = Math.round(outcome.points / 4) + 10;
  const rank = rankFor(before.xp + xpGain);
  const rankedUp = rank.index > rankFor(before.xp).index;
  const best = outcome.points > before.best && outcome.points > 0;
  const acc = outcome.total ? outcome.right / outcome.total : 0;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.45 ? 1 : 0;
  const itemsGame = game.type === 'items' || game.type === 'sprint';
  const [shown, setShown] = useState(0);
  // Count the score up, easing out at the end.
  useEffect(() => {
    let f = 0;
    const t = setInterval(() => {
      f = Math.min(30, f + 1);
      setShown(Math.round(outcome.points * (1 - (1 - f / 30) ** 3)));
      if (f >= 30) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [outcome.points]);
  const levelDelta = outcome.rating - before.level;
  const today = localDate();
  const sess = session && brain.session?.date === today ? brain.session : null;
  const nextInSession = sess?.games.find((g) => !sess.done[g] && g !== game.id);
  // Another game to try: the least-played one in your weakest area.
  const other = useMemo(() => {
    const weak = [...DOMAINS].sort((a, b) => (brain.skills[a.id] ?? -1) - (brain.skills[b.id] ?? -1));
    for (const d of weak) {
      const g = GAMES.filter((x) => x.skill === d.id && x.id !== game.id).sort((a, b) => (brain.played[a.id] ?? 0) - (brain.played[b.id] ?? 0))[0];
      if (g) return g;
    }
    return GAMES[0];
    // Picked once when the results open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const go = (id: string, params: Record<string, string> = {}) => router.replace({ pathname: '/brain/[game]', params: { game: id, ...params } });

  return (
    <ScrollView contentContainerStyle={styles.results}>
      <Animated.View entering={FadeInDown.duration(380)} style={styles.resultHero}>
        <Text style={[styles.domain, { color }]}>RESULTS · {game.name.toUpperCase()}</Text>
        <Text style={[styles.bigScore, { color }]}>{shown}</Text>
        <Text style={styles.muted}>points</Text>
        <Animated.Text entering={ZoomIn.delay(700).springify().damping(10)} style={[styles.stars, { color }]}>
          {'★'.repeat(stars)}
          <Text style={{ color: colors.border }}>{'★'.repeat(3 - stars)}</Text>
        </Animated.Text>
        {(rankedUp || best) && (
          <Animated.View entering={ZoomIn.delay(900).springify().damping(12)} style={[styles.banner, { borderColor: rankedUp ? rank.color : color, backgroundColor: `${rankedUp ? rank.color : color}1A` }]}>
            <Text style={[styles.bannerText, { color: rankedUp ? rank.color : color }]}>{rankedUp ? `⬆ Promoted to ${rank.name}` : `🏆 New personal best${before.best ? ` (was ${before.best})` : ''}`}</Text>
          </Animated.View>
        )}
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(100).duration(380)} style={styles.statGrid}>
        <Stat label={itemsGame ? 'Accuracy' : game.type === 'tower' ? 'Perfect' : game.type === 'nback' ? 'Matches' : 'Span'} value={itemsGame ? `${Math.round(acc * 100)}%` : `${outcome.right}${game.type === 'tower' || game.type === 'nback' ? `/${outcome.total}` : ''}`} sub={itemsGame ? `${outcome.right}/${outcome.total}` : undefined} color={color} />
        <Stat label={itemsGame ? 'Per answer' : 'Time'} value={itemsGame && outcome.total ? `${(outcome.seconds / outcome.total).toFixed(1)}s` : `${outcome.seconds}s`} sub={itemsGame ? `${outcome.seconds}s total` : undefined} color={color} />
        <Stat label="Level" value={`${outcome.rating}`} sub={levelDelta > 0 ? `↑ from ${before.level}` : levelDelta < 0 ? `↓ from ${before.level}` : 'steady'} color={color} />
        <Stat label="XP" value={`+${xpGain}`} sub={rank.name} color={rank.color} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(180).duration(380)} style={styles.card}>
        <View style={styles.rankRow}>
          <Text style={styles.cardTitle}>Against your best</Text>
          <Text style={styles.muted}>{before.best ? `${Math.round((outcome.points / before.best) * 100)}%` : 'first score'}</Text>
        </View>
        <CompareBar label="This run" value={outcome.points} max={Math.max(outcome.points, before.best, 1)} color={color} />
        <CompareBar label="Best before" value={before.best} max={Math.max(outcome.points, before.best, 1)} color={colors.muted as string} />
        <View style={[styles.bar, { marginTop: 6 }]}>
          <View style={[styles.barFill, { width: `${rank.progress * 100}%`, backgroundColor: rank.color }]} />
        </View>
        <Text style={styles.cardHint}>
          ◆ {rank.name} · {rank.next ? `${rank.next.xp - (before.xp + xpGain)} XP to ${rank.next.name}` : 'top rank reached'}
        </Text>
      </Animated.View>
      {sess && (
        <Animated.View entering={FadeInDown.delay(240).duration(380)} style={[styles.card, { borderColor: color }]}>
          <Text style={styles.cardTitle}>{nextInSession ? `Today’s session · ${Object.keys(sess.done).length}/3` : 'Today’s session complete'}</Text>
          {sess.games.map((g) => {
            const r = sess.done[g];
            const gd = gameById[g];
            return (
              <View key={g} style={styles.sessRow}>
                <Text style={[styles.sessGlyph, { color: domainOf(gd.skill).color }]}>{r ? '✓' : domainOf(gd.skill).glyph}</Text>
                <Text style={[styles.cardText, styles.flex]}>{gd.name}</Text>
                <Text style={styles.muted}>{r ? `${r.points} pts · L${r.from}→${r.to}` : 'next'}</Text>
              </View>
            );
          })}
          {!nextInSession && (
            <Text style={styles.cardHint}>
              {Object.values(sess.done).reduce((a, r) => a + r.xp, 0)} XP today · {Math.round((Object.values(sess.done).reduce((a, r) => a + r.right, 0) / Math.max(1, Object.values(sess.done).reduce((a, r) => a + r.total, 0))) * 100)}% accuracy. Come back tomorrow for a new mix.
            </Text>
          )}
        </Animated.View>
      )}
      {outcome.mistakes.length > 0 && (
        <Animated.View entering={FadeInDown.delay(300).duration(380)} style={styles.card}>
          <Text style={styles.cardTitle}>Review your mistakes</Text>
          {outcome.mistakes.slice(0, 6).map((m, i) => (
            <View key={i} style={styles.mistake}>
              <Text style={styles.mistakeAsk}>{m.item.ask}</Text>
              <View style={styles.mistakeRow}>
                {m.picked >= 0 && (
                  <View style={styles.mistakeCol}>
                    <View style={[styles.mistakeOpt, { borderColor: '#FF5C70' }]}>
                      <OptionView item={m.item} value={m.item.options[m.picked]} size={58} accent={color} />
                    </View>
                    <Text style={[styles.mistakeLabel, { color: '#FF5C70' }]}>Yours</Text>
                  </View>
                )}
                <View style={styles.mistakeCol}>
                  <View style={styles.mistakeOpt}>
                    <OptionView item={m.item} value={m.item.options[m.item.answer]} size={58} accent={color} />
                  </View>
                  <Text style={styles.mistakeLabel}>Right</Text>
                </View>
              </View>
              {!!m.item.explain && <Text style={styles.cardText}>{m.item.explain}</Text>}
            </View>
          ))}
        </Animated.View>
      )}
      <View style={styles.actionsCol}>
        {nextInSession ? (
          <Pressable accessibilityLabel="Next game" onPress={() => go(nextInSession, { session: '1' })} style={[styles.primary, styles.full, { backgroundColor: color }]}>
            <Text style={styles.primaryText}>Next: {gameById[nextInSession].name} ›</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityLabel="Play again" onPress={onAgain} style={[styles.primary, styles.full, { backgroundColor: color }]}>
            <Text style={styles.primaryText}>Play again · Level {outcome.rating}</Text>
          </Pressable>
        )}
        <View style={styles.actions}>
          {!nextInSession && (
            <Pressable accessibilityLabel="Try another game" onPress={() => go(other.id)} style={styles.secondary}>
              <Text style={styles.secondaryText} numberOfLines={1}>
                Try {other.name}
              </Text>
            </Pressable>
          )}
          <Pressable accessibilityLabel="Done" onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={styles.secondary}>
            <Text style={styles.secondaryText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function CompareBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <View style={styles.cmpRow}>
      <Text style={styles.cmpLabel}>{label}</Text>
      <View style={styles.cmpTrack}>
        <View style={[styles.cmpFill, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.cmpVal}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  full: { flex: 0, alignSelf: 'stretch' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.muted, textAlign: 'center' },
  glow: { position: 'absolute', width: 360, height: 360, borderRadius: 180 },
  intro: { padding: 16, gap: 14, maxWidth: 620, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  hero: { borderRadius: 24, padding: 22, gap: 8, borderWidth: 1 },
  domain: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 36, lineHeight: 40 },
  heroBlurb: { color: colors.muted, fontSize: 15 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 8, alignSelf: 'stretch' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flex: 1, minWidth: 74, paddingVertical: 10, paddingHorizontal: 4, borderRadius: 14, backgroundColor: 'rgba(127,127,127,0.1)', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  statSub: { color: colors.muted, fontSize: 11, marginTop: 2 },
  card: { borderRadius: 20, padding: 18, gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  cardText: { color: colors.text, lineHeight: 21, opacity: 0.9 },
  cardHint: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  cardHint2: { color: colors.muted, fontSize: 13 },
  whyRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 4 },
  whyLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 3 },
  whyText: { color: colors.text, flex: 1, lineHeight: 20, fontStyle: 'italic', opacity: 0.85 },
  resume: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, padding: 16, borderWidth: 1.5, backgroundColor: colors.surface },
  resumeKicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  resumeArrow: { fontSize: 34, fontWeight: '300' },
  actions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  actionsCol: { gap: 10 },
  primary: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 14, borderRadius: 16, minHeight: 52, justifyContent: 'center' },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 16, letterSpacing: 0.3 },
  secondary: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.surfaceRaised, minHeight: 52, justifyContent: 'center' },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  linkBtn: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
  linkText: { color: colors.muted, fontWeight: '800', textDecorationLine: 'underline' },
  iconBtn: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  iconBtnText: { fontSize: 20 },
  count: { fontSize: 120, fontWeight: '900', fontFamily: displayFont, fontVariant: ['lining-nums'] },
  hud: { gap: 8 },
  hudRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 30 },
  hudText: { color: colors.muted, fontWeight: '800', fontVariant: ['tabular-nums'] },
  hudScore: { fontWeight: '900', fontSize: 20, fontVariant: ['tabular-nums'] },
  pauseBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  pauseText: { color: colors.text, fontSize: 11, fontWeight: '900', letterSpacing: -1 },
  combo: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  comboText: { fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  bar: { height: 5, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  dots: { flexDirection: 'row', gap: 5, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised },
  popup: { position: 'absolute', alignSelf: 'center', top: 44, fontWeight: '900', fontSize: 15, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  popupLevel: { color: '#FFD166' },
  play: { padding: 16, gap: 14, alignSelf: 'center', paddingBottom: 48 },
  ask: { color: colors.text, fontWeight: '800', fontSize: 16, textAlign: 'center' },
  hint: { textAlign: 'center', fontWeight: '800', minHeight: 20 },
  prompt: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  options: { gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  option: { alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  optPressed: { transform: [{ scale: 0.96 }] },
  optRight: { borderColor: '#3DDC97', backgroundColor: 'rgba(61,220,151,0.14)' },
  optWrong: { borderColor: '#FF5C70', backgroundColor: 'rgba(255,92,112,0.14)' },
  optLetter: { position: 'absolute', top: 4, left: 7, color: colors.muted, fontSize: 10, fontWeight: '900' },
  badge: { position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: 11, backgroundColor: '#3DDC97', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#0B0D14', fontWeight: '900', fontSize: 13 },
  explain: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,92,112,0.35)' },
  explainOk: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(61,220,151,0.4)' },
  explainTitle: { color: '#FF5C70', fontWeight: '900', fontSize: 16 },
  practicePad: { paddingHorizontal: 16, paddingTop: 12, maxWidth: 620, width: '100%', alignSelf: 'center' },
  practiceBanner: { alignSelf: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  practiceKicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  pauseLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5,7,15,0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pauseCard: { width: '100%', maxWidth: 380, gap: 12, padding: 22, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pauseTitle: { color: colors.text, fontFamily: displayFont, fontSize: 30, textAlign: 'center' },
  custom: { flex: 1, padding: 16, gap: 16, maxWidth: 620, width: '100%', alignSelf: 'center', alignItems: 'stretch' },
  nbGrid: { width: 252, height: 252, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  nbCell: { width: 80, height: 80, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  nbLetter: { color: colors.text, fontSize: 36, fontWeight: '900', textAlign: 'center', height: 44 },
  row2: { flexDirection: 'row', gap: 12 },
  bigBtn: { flex: 1, paddingVertical: 16, borderRadius: 18, alignItems: 'center', backgroundColor: colors.surfaceRaised, borderWidth: 1.5, borderColor: colors.border, minHeight: 64 },
  bigBtnText: { color: colors.text, fontWeight: '900', fontSize: 16 },
  bigBtnSub: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  ok: { borderColor: '#3DDC97', backgroundColor: 'rgba(61,220,151,0.15)' },
  bad: { borderColor: '#FF5C70', backgroundColor: 'rgba(255,92,112,0.15)' },
  miss: { borderColor: '#FFB547', backgroundColor: 'rgba(255,181,71,0.15)' },
  spanBox: { height: 120, alignItems: 'center', justifyContent: 'center' },
  spanDigit: { fontSize: 96, fontWeight: '900', fontFamily: displayFont, fontVariant: ['lining-nums'] },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  slot: { width: 38, height: 50, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  slotText: { color: colors.text, fontSize: 24, fontWeight: '900' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  key: { width: '30%', minHeight: 54, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  keyText: { color: colors.text, fontSize: 24, fontWeight: '800' },
  corsi: { alignSelf: 'center', borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  block: { position: 'absolute', borderRadius: 12, backgroundColor: colors.surfaceRaised, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  blockNum: { color: '#FFB547', fontWeight: '900', fontSize: 16 },
  goalBox: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', paddingTop: 8, paddingBottom: 4, alignItems: 'center' },
  goalLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  pegs: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  peg: { alignItems: 'center', justifyContent: 'flex-end', borderRadius: 12, paddingBottom: 6 },
  pole: { position: 'absolute', bottom: 12, width: 6, borderRadius: 3, backgroundColor: colors.border },
  stack: { flexDirection: 'column-reverse', alignItems: 'center', gap: 3, marginBottom: 4 },
  disc: { borderRadius: 9 },
  base: { width: '90%', height: 6, borderRadius: 3, backgroundColor: colors.border },
  results: { padding: 16, gap: 14, maxWidth: 620, width: '100%', alignSelf: 'center', paddingBottom: 48 },
  resultHero: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  bigScore: { fontSize: 72, fontWeight: '900', fontFamily: displayFont, fontVariant: ['tabular-nums', 'lining-nums'] },
  stars: { fontSize: 28, letterSpacing: 4 },
  banner: { marginTop: 8, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  bannerText: { fontWeight: '900', fontSize: 14 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cmpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cmpLabel: { color: colors.muted, width: 84, fontSize: 12, fontWeight: '700' },
  cmpTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  cmpFill: { height: 10, borderRadius: 5 },
  cmpVal: { color: colors.text, width: 48, textAlign: 'right', fontWeight: '800', fontVariant: ['tabular-nums'] },
  sessRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  sessGlyph: { width: 18, fontWeight: '900', fontSize: 16 },
  mistake: { gap: 8, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  mistakeAsk: { color: colors.muted, fontWeight: '700' },
  mistakeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  mistakeCol: { alignItems: 'center', gap: 4 },
  mistakeLabel: { color: '#3DDC97', fontWeight: '800', fontSize: 12 },
  mistakeOpt: { minWidth: 70, minHeight: 50, padding: 6, borderRadius: 12, borderWidth: 1.5, borderColor: '#3DDC97', alignItems: 'center', justifyContent: 'center' },
});
