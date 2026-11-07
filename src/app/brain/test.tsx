import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';
import type { captureRef as CaptureRef } from 'react-native-view-shot';

import { OptionView, PromptView, pictureOptions } from '@/components/brain/ItemView';
import { useLeaveGuard } from '@/components/brain/LeaveGuard';
import { CodingTask, SpanTask } from '@/components/brain/TestTasks';
import { AGE_RANGE, ageFrom } from '@/lib/audience';
import { displayFont } from '@/lib/bookType';
import { gameById } from '@/lib/brain/catalog';
import { percentile, seeded, type Item, type Skill } from '@/lib/brain/core';
import {
  INDEXES, PLANS, SUBTESTS, band, codingTheta, estimate, indexOf, levelFor, norm, score, spanTheta,
  type Mode, type Response, type SubtestId, type SubtestResult,
} from '@/lib/brain/iq';
import { makeVerbalBank } from '@/lib/brain/verbalBank';
import { sfx } from '@/lib/brain/sfx';
import { celebrate } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { shareImage } from '@/lib/share';
import { localDate, useStore, type BrainTest } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Measurement error assumed for digit span and coding (on the ability scale), about a reliability of 0.8. */
const TASK_SE = 0.45;

/**
 * An IQ-style assessment built like standard batteries: eight short subtests (five in the quick version) across five
 * indexes, adaptive multiple-choice items with a time limit each, digit span and symbol coding, scored against the
 * test-taker's age.
 */
export default function TestScreen() {
  const { mode: m } = useLocalSearchParams<{ mode?: Mode }>();
  const mode: Mode = m === 'quick' ? 'quick' : 'full';
  const plan = PLANS[mode];
  const { brain, addBrainTest, recordBrain, audience, birthYear, setBirthYear } = useStore();
  const kid = audience === 'kid';
  // The saved age (or the group's typical one) until the test-taker changes it; the store may load after the first render.
  const [ageEdit, setAge] = useState<number | null>(null);
  const age = ageEdit ?? Math.max(6, Math.min(90, ageFrom(birthYear, audience)));
  const [phase, setPhase] = useState<'intro' | 'sub' | 'item' | 'task' | 'report'>('intro');
  const [si, setSi] = useState(0);
  const [seed, setSeed] = useState('');
  const rng = useMemo(() => seeded(seed || 'x'), [seed]);
  const bank = useRef(makeVerbalBank());
  const [item, setItem] = useState<Item | null>(null);
  const [n, setN] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const responses = useRef<Partial<Record<SubtestId, Response[]>>>({});
  const results = useRef<SubtestResult[]>([]);
  const [result, setResult] = useState<BrainTest | null>(null);
  const started = useRef(0);
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 32;

  const subId = plan.order[si];
  const sub = SUBTESTS[subId];
  const color = indexOf(sub.index).color;
  const count = plan.items[subId] ?? 0;

  const running = phase !== 'intro' && phase !== 'report';
  const guard = useLeaveGuard(running, {
    title: 'Quit the test?',
    message: 'Your answers so far will be lost.',
    quitLabel: 'Quit the test',
  });

  /** The next item, pitched at the current ability estimate (starting from the age group's typical level). */
  const nextItem = (id: SubtestId) => {
    const s = SUBTESTS[id];
    const rs = responses.current[id] ?? [];
    const prior = norm(age, s.index).mu;
    const theta = rs.length ? estimate(rs, prior).theta : prior;
    // A little jitter so the same answers don't always give the same items.
    const d = levelFor(theta + (rng() - 0.5) * 0.4);
    if (id === 'vocab') return bank.current.vocab(d, rng);
    if (id === 'similar') return bank.current.similar(d, rng);
    return gameById[s.game!].make!(d, rng);
  };

  const startSub = () => {
    sfx.go();
    if (sub.kind === 'mc') {
      setN(0);
      setChoice(null);
      setItem(nextItem(subId));
      setLeft(sub.perItem!);
      setPhase('item');
    } else setPhase('task');
  };

  const finish = () => {
    const rs = results.current;
    const s = score(rs, age);
    const domains: BrainTest['domains'] = {};
    for (const r of rs) {
      const sk = SUBTESTS[r.id].skill;
      const cur = domains[sk] ?? { right: 0, total: 0 };
      domains[sk] = { right: cur.right + r.right, total: cur.total + r.total };
    }
    const t: BrainTest = {
      date: new Date().toISOString(),
      mode,
      iq: s.iq,
      correct: rs.reduce((a, r) => a + r.right, 0),
      total: rs.reduce((a, r) => a + r.total, 0),
      seconds: Math.round((Date.now() - started.current) / 1000),
      domains,
      age,
      range: s.range,
      indexes: s.indexes as Record<string, number>,
      subtests: s.scaled as Record<string, number>,
      version: 2,
    };
    addBrainTest(t);
    // Each subtest feeds its skill on the Brain profile, as a percentile for the test-taker's age.
    const bySkill: Partial<Record<Skill, number[]>> = {};
    for (const r of rs) (bySkill[SUBTESTS[r.id].skill] ??= []).push(s.z[r.id]!);
    for (const [skill, zs] of Object.entries(bySkill)) {
      const z = zs!.reduce((a, b) => a + b, 0) / zs!.length;
      recordBrain({ id: `test-${skill}`, skill: skill as Skill, points: 0, perf: Math.round(percentile(100 + 15 * z)), xp: 0, seconds: 0 });
    }
    sfx.levelUp();
    if (!brain.tests?.length || s.iq > Math.max(...brain.tests.map((x) => x.iq))) celebrate({ emoji: '🧠', title: `Estimate: ${s.iq}`, subtitle: 'Your best result so far.' });
    setResult(t);
    setPhase('report');
  };

  const endSub = (r: SubtestResult) => {
    results.current = [...results.current.filter((x) => x.id !== r.id), r];
    if (si + 1 < plan.order.length) {
      setSi(si + 1);
      setPhase('sub');
    } else finish();
  };

  const answer = (picked: number | null) => {
    if (!item) return;
    const right = picked === item.answer;
    haptic.tap();
    sfx.click();
    const rs = [...(responses.current[subId] ?? []), { d: item.difficulty, options: item.options.length, right }];
    responses.current[subId] = rs;
    setChoice(null);
    if (n + 1 >= count) {
      const e = estimate(rs, norm(age, sub.index).mu);
      return endSub({ id: subId, theta: e.theta, se: e.se, right: rs.filter((x) => x.right).length, total: rs.length });
    }
    setN(n + 1);
    setItem(nextItem(subId));
    setLeft(sub.perItem!);
  };

  // Each item has its own time limit; running out counts as a wrong answer.
  useEffect(() => {
    if (phase !== 'item') return;
    const t = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);
  const timedOut = phase === 'item' && left <= 0;
  useEffect(() => {
    if (!timedOut) return;
    const t = setTimeout(() => answer(null), 0);
    return () => clearTimeout(t);
    // Only reacting to the clock running out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut]);

  const [minAge, maxAge] = [6, 90];
  const total = plan.order.length;

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.page}>
        <Stack.Screen options={{ title: mode === 'full' ? 'IQ-style test' : 'Quick test' }} />
        <LinearGradient colors={['#1B2140', '#0B0E1C']} style={styles.hero}>
          <Text style={styles.kicker}>{mode === 'full' ? 'FULL ASSESSMENT' : 'QUICK ASSESSMENT'}</Text>
          <Text style={styles.heroTitle}>{mode === 'full' ? (kid ? 'Kids’ IQ-style test' : 'IQ-style test') : 'Quick test'}</Text>
          <Text style={styles.heroText}>
            {total} subtests · 5 abilities · about {plan.minutes} minutes · scored for your age
          </Text>
        </LinearGradient>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{kid ? 'How old are you?' : 'Your age'}</Text>
          <View style={styles.ageRow}>
            <Pressable accessibilityLabel="Younger" onPress={() => setAge(Math.max(minAge, age - 1))} style={styles.ageBtn}>
              <Text style={styles.ageBtnText}>−</Text>
            </Pressable>
            <Text style={styles.ageValue}>{age}</Text>
            <Pressable accessibilityLabel="Older" onPress={() => setAge(Math.min(maxAge, age + 1))} style={styles.ageBtn}>
              <Text style={styles.ageBtnText}>＋</Text>
            </Pressable>
          </View>
          <Text style={styles.muted}>
            Scores compare you with people of the same age, like real IQ tests do. {kid && age > AGE_RANGE.kid[1] ? 'Older than 12? You can switch to adult mode in You.' : ''}
          </Text>
        </View>
        <View style={styles.card}>
          {plan.order.map((id, i) => {
            const st = SUBTESTS[id];
            const ix = indexOf(st.index);
            return (
              <View key={id} style={styles.sectionRow}>
                <Text style={[styles.sectionNum, { color: ix.color }]}>{i + 1}</Text>
                <View style={styles.flex}>
                  <Text style={styles.sectionName}>{st.name}</Text>
                  <Text style={styles.muted}>{ix.name}</Text>
                </View>
                <Text style={styles.muted}>{st.kind === 'mc' ? `${plan.items[id]} items` : st.kind === 'span' ? 'memory' : `${plan.codingSeconds} s`}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <Text style={styles.cardText}>• Like modern IQ tests, questions adapt: get one right and the next is harder, miss one and it gets easier. Nobody is expected to get everything right.</Text>
          <Text style={styles.cardText}>• Each question has its own time limit. You can’t go back; if you’re stuck, skip (it counts as wrong).</Text>
          <Text style={styles.cardText}>• Find a quiet spot, no pen and paper, no calculator.</Text>
          <Text style={styles.disclaimer}>
            The result is an estimate for practice: an IQ-style score (average 100) with a likely range, compared with typical results for your age. It is not a clinical or official IQ test; only a psychologist can give one{kid ? ', and a child’s score can change a lot as they grow' : ''}.
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Begin test"
          onPress={() => {
            sfx.unlock();
            setBirthYear(new Date().getFullYear() - age);
            responses.current = {};
            results.current = [];
            bank.current = makeVerbalBank();
            setSeed(String(Date.now()));
            setSi(0);
            started.current = Date.now();
            setPhase('sub');
          }}
          style={styles.primary}>
          <Text style={styles.primaryText}>Begin</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (phase === 'sub') {
    const ix = indexOf(sub.index);
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ title: sub.name }} />
        {guard.sheet}
        <Animated.View entering={FadeInDown.duration(380)} style={styles.sectionIntro}>
          <Text style={[styles.kicker, { color }]}>
            SUBTEST {si + 1} OF {total} · {ix.name.toUpperCase()}
          </Text>
          <Text style={styles.sectionTitle}>{sub.name}</Text>
          <Text style={[styles.cardText, styles.centerText]}>{sub.how}</Text>
          <Text style={styles.muted}>
            {sub.kind === 'mc' ? `${count} questions · up to ${sub.perItem} s each` : sub.kind === 'span' ? 'Lists grow until you miss two in a row' : `3 practice symbols, then ${plan.codingSeconds} seconds`}
          </Text>
          <Pressable accessibilityLabel="Start subtest" onPress={startSub} style={[styles.primary, { backgroundColor: color, alignSelf: 'stretch' }]}>
            <Text style={styles.primaryText}>Start</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (phase === 'task') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={[styles.page, { width: w + 32, alignSelf: 'center' }]}>
        <Stack.Screen options={{ title: sub.name }} />
        {guard.sheet}
        <Hud onQuit={guard.leave} label={`${sub.name} · ${si + 1}/${total}`} />
        {sub.kind === 'span' ? (
          <SpanTask
            color={color}
            startForward={age < 9 ? 2 : 3}
            onDone={(r) => endSub({ id: 'digits', theta: spanTheta(r.forward, r.backward), se: TASK_SE, right: r.forward + r.backward, total: r.forward + r.backward, raw: `${r.forward} forward · ${r.backward} backward` })}
          />
        ) : (
          <CodingTask
            color={color}
            seconds={plan.codingSeconds}
            onDone={(r) => endSub({ id: 'coding', theta: codingTheta(r.right, r.wrong, r.seconds), se: TASK_SE, right: r.right, total: r.right + r.wrong, raw: `${r.right} right · ${r.wrong} wrong` })}
          />
        )}
      </ScrollView>
    );
  }

  if (phase === 'item' && item) {
    const pics = pictureOptions(item.kind);
    const cols = pics ? (item.options.length > 6 ? 4 : item.options.length > 4 ? 3 : 2) : 1;
    const tile = pics ? Math.floor((w - (cols - 1) * 8) / cols) : 0;
    return (
      <ScrollView style={styles.container} contentContainerStyle={[styles.page, { width: w + 32, alignSelf: 'center' }]}>
        <Stack.Screen options={{ title: sub.name }} />
        {guard.sheet}
        <Hud onQuit={guard.leave} label={`${sub.name} · ${n + 1}/${count}`} clock={left} />
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(Math.max(0, left) / sub.perItem!) * 100}%`, backgroundColor: left < 10 ? '#FF5C70' : color }]} />
        </View>
        <Text style={styles.ask}>{item.ask}</Text>
        <Animated.View key={`${si}-${n}`} entering={FadeIn.duration(200)} style={styles.prompt}>
          <PromptView item={item} width={w} accent={color} />
        </Animated.View>
        <View style={[styles.options, cols > 1 && styles.grid]}>
          {item.options.map((o, i) => (
            <Pressable
              key={i}
              accessibilityLabel={`Option ${i + 1}`}
              onPress={() => {
                sfx.click();
                setChoice(i);
              }}
              style={[styles.option, pics ? { width: tile, height: tile, paddingVertical: 9, paddingHorizontal: 9 } : null, choice === i && { borderColor: color, backgroundColor: `${color}22` }]}>
              {pics && <Text style={styles.optLetter}>{'ABCDEFGH'[i]}</Text>}
              <OptionView item={item} value={o} size={pics ? tile - 30 : 0} accent={color} />
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          <Pressable accessibilityLabel="Skip" onPress={() => answer(null)} style={styles.secondary}>
            <Text style={styles.secondaryText}>Skip</Text>
          </Pressable>
          <Pressable accessibilityLabel="Confirm answer" disabled={choice === null} onPress={() => answer(choice)} style={[styles.primary, styles.flex, { backgroundColor: color }, choice === null && { opacity: 0.4 }]}>
            <Text style={styles.primaryText}>Confirm</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'report' && result) return <Report result={result} history={[result, ...(brain.tests ?? []).filter((t) => t.date !== result.date)]} kid={kid} />;
  return null;
}

function Hud({ onQuit, label, clock }: { onQuit: () => void; label: string; clock?: number }) {
  return (
    <View style={styles.hud}>
      <Pressable accessibilityLabel="Quit test" onPress={onQuit} hitSlop={10} style={styles.quitBtn}>
        <Text style={styles.quitText}>✕</Text>
      </Pressable>
      <Text style={[styles.hudText, styles.flex]} numberOfLines={1}>
        {label}
      </Text>
      {clock !== undefined && <Text style={[styles.hudClock, clock < 10 && { color: '#FF5C70' }]}>{Math.max(0, clock)} s</Text>}
    </View>
  );
}

// ---------- report ----------

function BellCurve({ iq, range, width }: { iq: number; range?: [number, number]; width: number }) {
  const h = 150;
  const x = (v: number) => ((Math.min(145, Math.max(55, v)) - 55) / 90) * width;
  const y = (v: number) => h - 20 - Math.exp(-((v - 100) ** 2) / (2 * 15 * 15)) * (h - 40);
  const pts: string[] = [];
  for (let v = 55; v <= 145; v += 1) pts.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
  const [lo, hi] = range ?? [iq, iq];
  const shade: string[] = [];
  for (let v = Math.max(55, lo); v <= Math.min(145, hi); v += 1) shade.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
  return (
    <Svg width={width} height={h}>
      {shade.length > 1 && <Path d={`M${x(lo)},${h - 20} L${shade.join(' L')} L${x(hi)},${h - 20} Z`} fill="#7C8CFF" opacity={0.3} />}
      <Path d={`M${pts.join(' L')}`} fill="none" stroke="#7C8CFF" strokeWidth={2.5} />
      <Line x1={0} y1={h - 20} x2={width} y2={h - 20} stroke={colors.border} strokeWidth={1} />
      {[70, 85, 100, 115, 130].map((v) => (
        <SvgText key={v} x={x(v)} y={h - 4} fontSize={10} fill="#8E97C8" textAnchor="middle">
          {v}
        </SvgText>
      ))}
      <Line x1={x(iq)} y1={10} x2={x(iq)} y2={h - 20} stroke="#FF6FB5" strokeWidth={2.5} />
    </Svg>
  );
}

function Report({ result, history, kid }: { result: BrainTest; history: BrainTest[]; kid: boolean }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 64;
  const card = useRef<ComponentRef<typeof View>>(null);
  const [sharing, setSharing] = useState(false);
  const pct = percentile(result.iq);
  const indexes = INDEXES.filter((ix) => result.indexes?.[ix.id] !== undefined).map((ix) => ({ ix, v: result.indexes![ix.id] }));
  const sorted = [...indexes].sort((a, b) => b.v - a.v);
  const subs = Object.entries(result.subtests ?? {}) as [SubtestId, number][];
  const share = async () => {
    setSharing(true);
    try {
      // Loaded only when sharing: the image library is large and not needed to open the app.
      const { captureRef } = await import('react-native-view-shot');
      const uri = await captureRef(card as Parameters<typeof CaptureRef>[0], { format: 'png', quality: 1, result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile' });
      await shareImage(uri, `brain-test-${localDate()}.png`);
    } catch {
      // nothing to do: the button just stops spinning
    }
    setSharing(false);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: 'Your report' }} />
      <View ref={card} collapsable={false}>
        <LinearGradient colors={['#1B2140', '#0B0E1C']} style={styles.hero}>
          <Text style={styles.kicker}>
            {result.mode === 'full' ? 'IQ-STYLE TEST' : 'QUICK TEST'} · {new Date(result.date).toLocaleDateString()}
            {result.age ? ` · AGE ${result.age}` : ''}
          </Text>
          <Animated.Text entering={FadeInDown.duration(500)} style={styles.iq}>
            {result.iq}
          </Animated.Text>
          <Text style={styles.band}>{band(result.iq)}</Text>
          <Text style={styles.heroText}>
            Estimated IQ-style score{result.range ? `, likely between ${result.range[0]} and ${result.range[1]}` : ''}. Higher than about {pct}% of people {result.age ? 'your age' : ''}.
          </Text>
          <BellCurve iq={result.iq} range={result.range} width={w} />
          {indexes.map(({ ix, v }) => (
            <View key={ix.id} style={styles.domainRow}>
              <Text style={[styles.domainName, { color: ix.color }]}>{ix.short}</Text>
              <View style={styles.domainTrack}>
                <View style={[styles.domainFill, { width: `${Math.max(3, Math.min(100, ((v - 55) / 90) * 100))}%`, backgroundColor: ix.color }]} />
                <View style={styles.mid} />
              </View>
              <Text style={styles.domainVal}>{v}</Text>
            </View>
          ))}
          <Text style={styles.brand}>DEEPSTACH · BRAIN</Text>
        </LinearGradient>
      </View>
      {sorted.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Strengths and areas to train</Text>
          <Text style={styles.cardText}>
            Strongest: <Text style={{ color: sorted[0].ix.color, fontWeight: '900' }}>{sorted[0].ix.name}</Text> ({sorted[0].v}). Weakest:{' '}
            <Text style={{ color: sorted[sorted.length - 1].ix.color, fontWeight: '900' }}>{sorted[sorted.length - 1].ix.name}</Text> ({sorted[sorted.length - 1].v}).
          </Text>
          <Text style={styles.muted}>
            {sorted[0].v - sorted[sorted.length - 1].v >= 23
              ? 'Your abilities are quite uneven, so the overall number summarises them less well than usual.'
              : 'Index scores use the same scale as the total: 100 is average for your age, and 85 to 115 covers about two people in three.'}
          </Text>
        </View>
      )}
      {subs.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subtests</Text>
          <Text style={styles.muted}>Scaled scores from 1 to 19; 10 is average for your age.</Text>
          {subs.map(([id, v]) => (
            <View key={id} style={styles.subRow}>
              <Text style={styles.subName}>{SUBTESTS[id]?.name ?? id}</Text>
              <View style={styles.dots}>
                {Array.from({ length: 19 }, (_, i) => (
                  <View key={i} style={[styles.dot, i === 9 && styles.dotMid, i < v && { backgroundColor: indexOf(SUBTESTS[id].index).color }]} />
                ))}
              </View>
              <Text style={styles.subVal}>{v}</Text>
            </View>
          ))}
        </View>
      )}
      {history.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>History</Text>
          {history.slice(0, 8).map((t) => (
            <View key={t.date} style={styles.historyRow}>
              <Text style={styles.muted}>
                {new Date(t.date).toLocaleDateString()} · {t.mode}
                {t.version ? '' : ' · old test'}
              </Text>
              <View style={styles.historyBar}>
                <View style={[styles.domainFill, { width: `${((t.iq - 55) / 105) * 100}%`, backgroundColor: '#7C8CFF' }]} />
              </View>
              <Text style={styles.historyIq}>{t.iq}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.disclaimer}>
        This is an estimate for practice. It uses the same kinds of tasks as real IQ tests, adapts to your level and compares you with typical results for your age, but its norms are approximations, not a standardised sample. It is not a clinical or official IQ test{kid ? '; for children, scores change a lot with age and with the day' : ''}. Expect a few points of difference between attempts.
      </Text>
      <View style={styles.row}>
        <Pressable accessibilityLabel="Share result" onPress={share} disabled={sharing} style={[styles.primary, styles.flex]}>
          <Text style={styles.primaryText}>{sharing ? 'Preparing…' : 'Share result'}</Text>
        </Pressable>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/brain'))} style={[styles.secondary, styles.flex]}>
          <Text style={styles.secondaryText}>Done</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  page: { padding: 16, gap: 14, paddingBottom: 48, maxWidth: 620, width: '100%', alignSelf: 'center' },
  flex: { flex: 1 },
  hero: { borderRadius: 24, padding: 20, gap: 8, borderWidth: 1, borderColor: 'rgba(124,140,255,0.25)' },
  kicker: { color: '#7C8CFF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  heroTitle: { color: '#F2F4FF', fontFamily: displayFont, fontSize: 38, lineHeight: 42 },
  heroText: { color: '#AEB5DA', lineHeight: 20 },
  card: { borderRadius: 20, padding: 16, gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  cardText: { color: colors.text, lineHeight: 21 },
  muted: { color: colors.muted, lineHeight: 19 },
  disclaimer: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  sectionNum: { fontWeight: '900', fontSize: 18, width: 20 },
  sectionName: { color: colors.text, fontWeight: '800', flex: 1 },
  primary: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, borderRadius: 16, backgroundColor: '#7C8CFF' },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 16 },
  secondary: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 22, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  sectionIntro: { width: '100%', maxWidth: 520, gap: 12, alignItems: 'center' },
  sectionTitle: { color: colors.text, fontFamily: displayFont, fontSize: 34, textAlign: 'center' },
  clock: { fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'], marginVertical: 8 },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  quitBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  quitText: { color: colors.text, fontWeight: '900' },
  hudText: { color: colors.muted, fontWeight: '800' },
  hudClock: { color: colors.text, fontWeight: '900', fontVariant: ['tabular-nums'] },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
  ask: { color: colors.text, fontWeight: '800', fontSize: 16, textAlign: 'center' },
  prompt: { alignItems: 'center', minHeight: 120, justifyContent: 'center' },
  options: { gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  option: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  optLetter: { position: 'absolute', top: 4, left: 7, color: colors.muted, fontSize: 10, fontWeight: '900' },
  row: { flexDirection: 'row', gap: 10 },
  iq: { color: '#F2F4FF', fontFamily: displayFont, fontSize: 84, lineHeight: 88, fontVariant: ['lining-nums'] },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  domainName: { width: 92, fontWeight: '800', fontSize: 13 },
  domainTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  domainFill: { height: 8, borderRadius: 4 },
  domainVal: { color: '#AEB5DA', fontWeight: '800', width: 40, textAlign: 'right', fontVariant: ['tabular-nums'] },
  brand: { color: '#5D6491', fontSize: 9, fontWeight: '900', letterSpacing: 2.5, alignSelf: 'flex-end', marginTop: 6 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyBar: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  historyIq: { color: colors.text, fontWeight: '900', width: 36, textAlign: 'right' },
  centerText: { textAlign: 'center' },
  ageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, paddingVertical: 6 },
  ageBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  ageBtnText: { color: colors.text, fontSize: 26, fontWeight: '800' },
  ageValue: { color: colors.text, fontSize: 44, fontWeight: '900', minWidth: 70, textAlign: 'center', fontVariant: ['tabular-nums'] },
  band: { color: '#FF6FB5', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
  mid: { position: 'absolute', left: '50%', top: -2, bottom: -2, width: 1.5, backgroundColor: 'rgba(255,255,255,0.35)' },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subName: { color: colors.text, fontWeight: '700', width: 118, fontSize: 13 },
  dots: { flex: 1, flexDirection: 'row', gap: 2 },
  dot: { flex: 1, height: 10, borderRadius: 3, backgroundColor: colors.surfaceRaised },
  dotMid: { borderWidth: 1, borderColor: colors.muted },
  subVal: { color: colors.text, fontWeight: '900', width: 24, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
