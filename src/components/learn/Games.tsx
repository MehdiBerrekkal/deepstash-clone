import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Pic } from '@/components/learn/Pic';
import type { Course, LItem } from '@/data/learn/courses';
import { sfx } from '@/lib/brain/sfx';
import { haptic } from '@/lib/haptics';
import type { FullStep } from '@/lib/learn/lessons';
import { say } from '@/lib/learn/speech';
import { colors } from '@/lib/theme';

type Grade = (ok: boolean, right: string) => void;
type Base = { course: Course; fr: boolean; locked: boolean; onGrade: Grade };

function mix<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const meaningOf = (it: LItem, fr: boolean) => (fr ? it.fr : it.en);

/** A card that shakes when wrong and pops when right. */
function useShake() {
  const x = useSharedValue(0);
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { scale: s.value }] }));
  return {
    style,
    shake: () => x.set(withSequence(withTiming(-9, { duration: 50 }), withTiming(9, { duration: 50 }), withTiming(-6, { duration: 50 }), withTiming(0, { duration: 50 }))),
    pop: () => s.set(withSequence(withTiming(1.12, { duration: 110 }), withSpring(1))),
  };
}

/** Picture → word: which word is this? */
export function PictureStep({ step, course, fr, locked, onGrade }: Base & { step: Extract<FullStep, { type: 'picture' }> }) {
  const [picked, setPicked] = useState<LItem | null>(null);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Qu’est-ce que c’est ?' : 'What is this?'}</Text>
      <Animated.View entering={ZoomIn.springify().damping(11)} style={[styles.picCard, { shadowColor: course.color }]}>
        <Pic emoji={step.item.emoji} size={150} />
      </Animated.View>
      <View style={styles.options}>
        {step.options.map((o) => {
          const state = picked === null ? null : o === step.item ? 'right' : o === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={o.text}
              accessibilityLabel={`Option ${o.text}`}
              disabled={locked}
              onPress={() => {
                setPicked(o);
                say(o.text, course.voice);
                onGrade(o === step.item, `${step.item.text} · ${meaningOf(step.item, fr)}`);
              }}
              style={[styles.option, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && styles.dim]}>
              <Text style={styles.optionText}>{o.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Word (heard and read) → picture: tap the right one of four. */
export function PictureOfStep({ step, course, fr, locked, onGrade }: Base & { step: Extract<FullStep, { type: 'pictureOf' }> }) {
  const [picked, setPicked] = useState<LItem | null>(null);
  const { width } = useWindowDimensions();
  const size = Math.min(150, (Math.min(width, 560) - 32 - 12) / 2 - 24);
  useEffect(() => {
    const t = setTimeout(() => say(step.item.text, course.voice), 250);
    return () => clearTimeout(t);
  }, [step.item, course.voice]);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Touchez l’image de…' : 'Tap the picture of…'}</Text>
      <Pressable accessibilityLabel="Play sound" onPress={() => say(step.item.text, course.voice)}>
        <Text style={[styles.bigWord, { color: course.color }]}>🔊 {step.item.text}</Text>
      </Pressable>
      <View style={styles.grid}>
        {step.options.map((o) => {
          const state = picked === null ? null : o === step.item ? 'right' : o === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={o.text}
              accessibilityLabel={`Option ${o.text}`}
              disabled={locked}
              onPress={() => {
                setPicked(o);
                onGrade(o === step.item, `${step.item.text} · ${meaningOf(step.item, fr)}`);
              }}
              style={[styles.tile, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && styles.dim]}>
              <Pic emoji={o.emoji} size={size} />
              {picked !== null && <Text style={styles.tileLabel}>{o.text}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Memory: flip two cards, find each picture's word. */
export function MemoryStep({ step, course, fr, locked, onGrade }: Base & { step: Extract<FullStep, { type: 'memory' }> }) {
  const cards = useMemo(() => mix(step.items.flatMap((it, k) => [{ id: `p${k}`, k, pic: true, it }, { id: `w${k}`, k, pic: false, it }])), [step.items]);
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const busy = useRef(false);
  const { width } = useWindowDimensions();
  const cw = (Math.min(width, 560) - 32 - 3 * 10) / 4;
  const flip = (c: (typeof cards)[number]) => {
    if (busy.current || locked || open.includes(c.id) || found.includes(c.k)) return;
    haptic.tap();
    if (!c.pic) say(c.it.text, course.voice);
    const now = [...open, c.id];
    setOpen(now);
    if (now.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = now.map((id) => cards.find((x) => x.id === id)!);
    if (a.k === b.k) {
      sfx.click();
      const f = [...found, a.k];
      setFound(f);
      setOpen([]);
      if (f.length === step.items.length) setTimeout(() => onGrade(moves + 1 <= step.items.length + 3, fr ? 'Bien trouvé, mais en plus de coups.' : 'All found, in a few extra moves.'), 500);
    } else {
      busy.current = true;
      setTimeout(() => {
        setOpen([]);
        busy.current = false;
      }, 850);
    }
  };
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Memory : retrouvez les paires' : 'Memory: find the pairs'}</Text>
      <Text style={styles.sub}>
        {fr ? 'Coups' : 'Moves'} {moves} · {found.length}/{step.items.length}
      </Text>
      <View style={styles.memory}>
        {cards.map((c) => {
          const shown = open.includes(c.id) || found.includes(c.k);
          return (
            <Pressable key={c.id} accessibilityLabel={`Card ${c.id}`} onPress={() => flip(c)} style={[styles.card, { width: cw, height: cw * 1.25 }, shown ? styles.cardOpen : { backgroundColor: course.color }, found.includes(c.k) && styles.right]}>
              {shown ? (
                <Animated.View entering={FadeIn.duration(160)} style={styles.cardFace}>
                  {c.pic ? <Pic emoji={c.it.emoji} size={cw * 0.7} /> : <Text style={styles.cardWord} numberOfLines={3} adjustsFontSizeToFit>{c.it.text}</Text>}
                </Animated.View>
              ) : (
                <Text style={styles.cardBack}>?</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const SPEED_SECONDS = 30;
/** Speed round: as many picture → word answers as possible in 30 seconds. */
export function SpeedStep({ step, course, fr, locked, onGrade }: Base & { step: Extract<FullStep, { type: 'speed' }> }) {
  const deal = (): { item: LItem; options: LItem[] } => {
    const [item, other] = mix(step.pool);
    return { item, options: mix([item, other]) };
  };
  const [q, setQ] = useState(deal);
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(SPEED_SECONDS);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0 });
  const shake = useShake();
  const ended = left <= 0;
  useEffect(() => {
    if (!started || ended) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, left, ended]);
  useEffect(() => {
    if (!ended || locked) return;
    const ok = score.total >= 5 && score.right / score.total >= 0.7;
    onGrade(ok, fr ? `${score.right}/${score.total} : visez 5 bonnes réponses et 70 %.` : `${score.right}/${score.total}: aim for 5 right and 70%.`);
    // Once, when the clock runs out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended]);
  const answer = (o: LItem) => {
    if (ended) return;
    const ok = o === q.item;
    if (ok) {
      sfx.right(score.streak + 1);
      shake.pop();
    } else {
      sfx.wrong();
      shake.shake();
    }
    haptic.tap();
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1, streak: ok ? s.streak + 1 : 0 }));
    setQ(deal());
  };
  if (!started)
    return (
      <View style={styles.center}>
        <Text style={styles.huge}>⚡</Text>
        <Text style={styles.prompt}>{fr ? 'Partie rapide' : 'Speed round'}</Text>
        <Text style={styles.sub}>{fr ? `${SPEED_SECONDS} secondes. Une image, deux mots : touchez le bon, le plus vite possible.` : `${SPEED_SECONDS} seconds. One picture, two words: tap the right one, as fast as you can.`}</Text>
        <Pressable accessibilityLabel="Start speed round" onPress={() => setStarted(true)} style={[styles.primary, { backgroundColor: course.color }]}>
          <Text style={styles.primaryText}>{fr ? 'Go !' : 'Go!'}</Text>
        </Pressable>
      </View>
    );
  return (
    <View style={styles.center}>
      <View style={styles.speedHud}>
        <Text style={[styles.timer, left <= 5 && { color: '#E5484D' }]}>⏱ {Math.max(0, left)}s</Text>
        <Text style={[styles.timer, { color: course.color }]}>
          ✓ {score.right}
          {score.streak >= 3 ? `  🔥${score.streak}` : ''}
        </Text>
      </View>
      <View style={styles.timeTrack}>
        <View style={[styles.timeFill, { width: `${(Math.max(0, left) / SPEED_SECONDS) * 100}%`, backgroundColor: left <= 5 ? '#E5484D' : course.color }]} />
      </View>
      <Animated.View style={[styles.picCard, shake.style]}>
        <Pic emoji={q.item.emoji} size={140} />
      </Animated.View>
      <View style={[styles.row, { alignSelf: 'stretch' }]}>
        {q.options.map((o) => (
          <Pressable key={o.text} accessibilityLabel={`Option ${o.text}`} disabled={ended} onPress={() => answer(o)} style={[styles.option, styles.flex]}>
            <Text style={styles.optionText}>{o.text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const HUES: Record<string, [string, string]> = {};
const hueOf = (id: string, color: string): [string, string] => HUES[id] ?? [`${color}55`, '#141A2E'];
/** Positions on the backdrop (fractions of the width/height): a shelf of three, a table of three. */
const SPOTS = [
  [0.18, 0.2],
  [0.5, 0.16],
  [0.82, 0.22],
  [0.2, 0.62],
  [0.52, 0.66],
  [0.83, 0.6],
];

/** Tap the thing in the scene: the topic's objects on a drawn backdrop, find the ones you hear. */
export function SceneStep({ step, course, fr, locked, onGrade }: Base & { step: Extract<FullStep, { type: 'scene' }> }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 560) - 32;
  const h = w * 0.8;
  const [n, setN] = useState(0);
  const [miss, setMiss] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const target = step.ask[n];
  const [top, bottom] = hueOf(step.topic.id, course.color);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => say(target.text, course.voice), 300);
    return () => clearTimeout(t);
  }, [target, course.voice]);
  const tap = (it: LItem) => {
    if (locked || !target || found.includes(it.text)) return;
    if (it === target) {
      sfx.click();
      haptic.tap();
      setFound((f) => [...f, it.text]);
      setWrong(null);
      if (n + 1 >= step.ask.length) setTimeout(() => onGrade(miss <= 1, fr ? 'Écoutez bien le mot, puis cherchez-le.' : 'Listen to the word, then look for it.'), 450);
      setN(n + 1);
    } else {
      sfx.wrong();
      haptic.tick();
      setWrong(it.text);
      setMiss((m) => m + 1);
    }
  };
  const size = Math.min(84, w / 4.4);
  return (
    <View style={styles.center}>
      <Text style={[styles.kicker, { color: course.color }]}>
        {step.topic.icon} {fr ? step.topic.fr : step.topic.en}
      </Text>
      <Text style={styles.prompt}>{target ? (fr ? 'Touchez :' : 'Tap:') : fr ? 'Bravo !' : 'Well done!'}</Text>
      {target && (
        <Pressable accessibilityLabel="Play sound" onPress={() => say(target.text, course.voice)}>
          <Text style={[styles.bigWord, { color: course.color }]}>🔊 {target.text}</Text>
        </Pressable>
      )}
      <View style={[styles.scene, { width: w, height: h }]}>
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={top} />
              <Stop offset="1" stopColor={bottom} />
            </LinearGradient>
            <LinearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7A5A3F" />
              <Stop offset="1" stopColor="#4A3424" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={w} height={h} fill="url(#wall)" />
          {/* Window light */}
          <Rect x={w * 0.06} y={h * 0.05} width={w * 0.3} height={h * 0.28} rx={10} fill="rgba(255,255,255,0.06)" />
          {/* Shelf */}
          <Rect x={w * 0.04} y={h * 0.37} width={w * 0.92} height={h * 0.035} rx={4} fill="url(#wood)" />
          {/* Table */}
          <Rect x={0} y={h * 0.8} width={w} height={h * 0.2} fill="url(#wood)" />
          <Rect x={0} y={h * 0.8} width={w} height={h * 0.02} fill="rgba(255,255,255,0.15)" />
          {SPOTS.slice(0, step.items.length).map(([x, y], k) => (
            <Ellipse key={k} cx={x * w} cy={y * h + size * 0.95} rx={size * 0.38} ry={size * 0.08} fill="rgba(0,0,0,0.35)" />
          ))}
        </Svg>
        {step.items.map((it, k) => {
          const [x, y] = SPOTS[k];
          const done = found.includes(it.text);
          return (
            <Pressable
              key={it.text}
              accessibilityLabel={`Scene ${it.text}`}
              onPress={() => tap(it)}
              style={[styles.spot, { left: x * w - size / 2, top: y * h, width: size, height: size }, wrong === it.text && styles.spotWrong]}>
              <Pic emoji={it.emoji} size={size * 0.92} style={done ? { opacity: 0.35 } : undefined} />
              {done && (
                <Animated.Text entering={ZoomIn} style={styles.spotTick}>
                  ✓
                </Animated.Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.sub}>
        {n}/{step.ask.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 14, alignSelf: 'stretch' },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  kicker: { fontSize: 12, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center' },
  prompt: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sub: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  huge: { fontSize: 64 },
  bigWord: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  picCard: { width: 190, height: 190, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  options: { gap: 10, alignSelf: 'stretch' },
  option: { minHeight: 54, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 12 },
  optionText: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  right: { borderColor: '#2FAE77', backgroundColor: 'rgba(61,220,151,0.15)' },
  wrong: { borderColor: '#E5484D', backgroundColor: 'rgba(229,72,77,0.15)' },
  dim: { opacity: 0.45 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignSelf: 'stretch' },
  tile: { width: '47%', aspectRatio: 1, borderRadius: 22, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tileLabel: { color: colors.text, fontWeight: '800', fontSize: 14 },
  memory: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignSelf: 'stretch' },
  card: { borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  cardOpen: { backgroundColor: colors.surface, borderColor: colors.border },
  cardFace: { alignItems: 'center', justifyContent: 'center', padding: 4 },
  cardWord: { color: colors.text, fontWeight: '900', fontSize: 15, textAlign: 'center' },
  cardBack: { color: '#0B0D14', fontSize: 28, fontWeight: '900', opacity: 0.5 },
  speedHud: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' },
  timer: { color: colors.text, fontSize: 20, fontWeight: '900' },
  timeTrack: { alignSelf: 'stretch', height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  timeFill: { height: 8, borderRadius: 4 },
  primary: { minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, alignSelf: 'stretch' },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 17 },
  scene: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  spot: { position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  spotWrong: { backgroundColor: 'rgba(229,72,77,0.25)' },
  spotTick: { position: 'absolute', color: '#3DDC97', fontSize: 40, fontWeight: '900' },
});
