import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';

import { OptionView, PromptView, pictureOptions } from '@/components/brain/ItemView';
import { displayFont } from '@/lib/bookType';
import { gameById } from '@/lib/brain/catalog';
import { DOMAINS, domainOf, estimateIQ, percentile, seeded, type Item, type Skill } from '@/lib/brain/core';
import { sfx } from '@/lib/brain/sfx';
import { celebrate } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { shareImage } from '@/lib/share';
import { localDate, useStore, type BrainTest } from '@/lib/store';
import { colors } from '@/lib/theme';

type Mode = 'full' | 'quick';
type Section = { name: string; skill: Skill; parts: [string, number][] };
const PLANS: Record<Mode, { minutes: number; sections: Section[] }> = {
  full: {
    minutes: 25,
    sections: [
      { name: 'Abstract reasoning', skill: 'logic', parts: [['matrix', 9], ['analogy', 4], ['syllogism', 3]] },
      { name: 'Spatial ability', skill: 'spatial', parts: [['folding', 4], ['cubenet', 3], ['rotation3d', 3]] },
      { name: 'Verbal reasoning', skill: 'verbal', parts: [['verbal', 4], ['letters', 2]] },
      { name: 'Numerical reasoning', skill: 'math', parts: [['series', 3], ['numgrid', 2], ['word', 1]] },
    ],
  },
  quick: {
    minutes: 12,
    sections: [
      { name: 'Abstract reasoning', skill: 'logic', parts: [['matrix', 4], ['analogy', 2]] },
      { name: 'Spatial ability', skill: 'spatial', parts: [['folding', 2], ['rotation3d', 1], ['cubenet', 1]] },
      { name: 'Verbal reasoning', skill: 'verbal', parts: [['verbal', 2], ['letters', 1]] },
      { name: 'Numerical reasoning', skill: 'math', parts: [['series', 2], ['numgrid', 1]] },
    ],
  },
};

type TestItem = { item: Item; section: number; skill: Skill };

/** Builds the test: each part ramps from easier to harder items. */
function build(mode: Mode, seed: string): TestItem[] {
  const rng = seeded(seed);
  const out: TestItem[] = [];
  PLANS[mode].sections.forEach((s, si) =>
    s.parts.forEach(([id, n]) => {
      for (let k = 0; k < n; k++) {
        const d = Math.round(2 + (7 * k) / Math.max(1, n - 1));
        out.push({ item: gameById[id].make!(d, rng), section: si, skill: s.skill });
      }
    }),
  );
  return out;
}

/** An IQ-style assessment: timed sections, one item at a time, no going back, then a report. */
export default function TestScreen() {
  const { mode: m } = useLocalSearchParams<{ mode?: Mode }>();
  const mode: Mode = m === 'quick' ? 'quick' : 'full';
  const plan = PLANS[mode];
  const { brain, addBrainTest, recordBrain } = useStore();
  const [phase, setPhase] = useState<'intro' | 'section' | 'item' | 'report'>('intro');
  const [seed, setSeed] = useState('');
  const items = useMemo(() => (seed ? build(mode, seed) : []), [mode, seed]);
  const [k, setK] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ d: number; right: boolean; skill: Skill }[]>([]);
  const [left, setLeft] = useState(plan.minutes * 60);
  const [result, setResult] = useState<BrainTest | null>(null);
  const started = useRef(0);
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 32;

  const running = phase === 'item' || phase === 'section';
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const finish = (all: typeof answers) => {
    // Items not reached when time runs out count as wrong.
    const full = [...all, ...items.slice(all.length).map((t) => ({ d: t.item.difficulty, right: false, skill: t.skill }))];
    const iq = estimateIQ(full);
    const domains: BrainTest['domains'] = {};
    for (const a of full) {
      const cur = domains[a.skill] ?? { right: 0, total: 0 };
      domains[a.skill] = { right: cur.right + (a.right ? 1 : 0), total: cur.total + 1 };
    }
    const t: BrainTest = { date: new Date().toISOString(), mode, iq, correct: full.filter((a) => a.right).length, total: full.length, seconds: Math.round((Date.now() - started.current) / 1000), domains };
    addBrainTest(t);
    for (const [skill, v] of Object.entries(domains)) recordBrain({ id: `test-${skill}`, skill: skill as Skill, points: v.right * 10, perf: Math.round((v.right / v.total) * 100), xp: 0, seconds: 0 });
    sfx.levelUp();
    if (!brain.tests?.length || iq > Math.max(...brain.tests.map((x) => x.iq))) celebrate({ emoji: '🧠', title: `Estimate: ${iq}`, subtitle: 'Your best result so far.' });
    setResult(t);
    setPhase('report');
  };

  const outOfTime = left <= 0 && running;
  useEffect(() => {
    if (!outOfTime) return;
    const t = setTimeout(() => finish(answers), 0);
    return () => clearTimeout(t);
    // Only reacting to the clock running out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outOfTime]);

  const submit = (skip = false) => {
    const t = items[k];
    const right = !skip && choice === t.item.answer;
    haptic.tap();
    sfx.click();
    const all = [...answers, { d: t.item.difficulty, right, skill: t.skill }];
    setAnswers(all);
    setChoice(null);
    if (k + 1 >= items.length) return finish(all);
    setK(k + 1);
    if (items[k + 1].section !== t.section) setPhase('section');
  };

  const mins = `${Math.floor(Math.max(0, left) / 60)}:${String(Math.max(0, left) % 60).padStart(2, '0')}`;
  const section = items[k] ? plan.sections[items[k].section] : plan.sections[0];
  const sectionColor = domainOf(section.skill).color;

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.page}>
        <Stack.Screen options={{ title: mode === 'full' ? 'IQ-style test' : 'Quick test' }} />
        <LinearGradient colors={['#1B2140', '#0B0E1C']} style={styles.hero}>
          <Text style={styles.kicker}>{mode === 'full' ? 'FULL ASSESSMENT' : 'QUICK ASSESSMENT'}</Text>
          <Text style={styles.heroTitle}>{mode === 'full' ? 'IQ-style test' : '15-minute test'}</Text>
          <Text style={styles.heroText}>
            {PLANS[mode].sections.reduce((n, s) => n + s.parts.reduce((x, p) => x + p[1], 0), 0)} items in {plan.sections.length} sections · {plan.minutes} minutes
          </Text>
        </LinearGradient>
        <View style={styles.card}>
          {plan.sections.map((s, i) => (
            <View key={s.name} style={styles.sectionRow}>
              <Text style={[styles.sectionNum, { color: domainOf(s.skill).color }]}>{i + 1}</Text>
              <Text style={styles.sectionName}>{s.name}</Text>
              <Text style={styles.muted}>{s.parts.reduce((x, p) => x + p[1], 0)} items</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before you start</Text>
          <Text style={styles.cardText}>• One timer runs for the whole test. Items get harder within each part.</Text>
          <Text style={styles.cardText}>• You can’t go back. If you’re stuck, skip: an unanswered item simply counts as wrong.</Text>
          <Text style={styles.cardText}>• Find a quiet spot and don’t use pen and paper for the spatial items.</Text>
          <Text style={styles.disclaimer}>The result is an estimate for practice, based on how many items you solve and how hard they are. It is not a clinically validated IQ test.</Text>
        </View>
        <Pressable
          accessibilityLabel="Begin test"
          onPress={() => {
            sfx.unlock();
            setSeed(String(Date.now()));
            started.current = Date.now();
            setPhase('section');
          }}
          style={styles.primary}>
          <Text style={styles.primaryText}>Begin</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (phase === 'section') {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ title: section.name }} />
        <Animated.View entering={FadeInDown.duration(380)} style={styles.sectionIntro}>
          <Text style={[styles.kicker, { color: sectionColor }]}>
            SECTION {items[k]?.section + 1} OF {plan.sections.length}
          </Text>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          <Text style={styles.muted}>
            {section.parts.map(([id, n]) => `${gameById[id].name} (${n})`).join(' · ')}
          </Text>
          <Text style={[styles.clock, { color: sectionColor }]}>{mins} left</Text>
          <Pressable accessibilityLabel="Start section" onPress={() => setPhase('item')} style={[styles.primary, { backgroundColor: sectionColor, alignSelf: 'stretch' }]}>
            <Text style={styles.primaryText}>Start section</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (phase === 'item' && items[k]) {
    const it = items[k].item;
    const pics = pictureOptions(it.kind);
    const cols = pics ? (it.options.length > 6 ? 4 : it.options.length > 4 ? 3 : 2) : 1;
    const tile = pics ? Math.floor((w - (cols - 1) * 8) / cols) : 0;
    return (
      <ScrollView style={styles.container} contentContainerStyle={[styles.page, { width: w + 32, alignSelf: 'center' }]}>
        <Stack.Screen options={{ title: section.name }} />
        <View style={styles.hud}>
          <Text style={styles.hudText}>
            Item {k + 1} / {items.length}
          </Text>
          <Text style={[styles.hudClock, left < 60 && { color: '#FF5C70' }]}>{mins}</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(k / items.length) * 100}%`, backgroundColor: sectionColor }]} />
        </View>
        <Text style={styles.ask}>{it.ask}</Text>
        <Animated.View key={k} entering={FadeIn.duration(200)} style={styles.prompt}>
          <PromptView item={it} width={w} accent={sectionColor} />
        </Animated.View>
        <View style={[styles.options, cols > 1 && styles.grid]}>
          {it.options.map((o, i) => (
            <Pressable
              key={i}
              accessibilityLabel={`Option ${i + 1}`}
              onPress={() => {
                sfx.click();
                setChoice(i);
              }}
              style={[styles.option, pics ? { width: tile, height: tile, paddingVertical: 9, paddingHorizontal: 9 } : null, choice === i && { borderColor: sectionColor, backgroundColor: `${sectionColor}22` }]}>
              {pics && <Text style={styles.optLetter}>{'ABCDEFGH'[i]}</Text>}
              <OptionView item={it} value={o} size={pics ? tile - 30 : 0} accent={sectionColor} />
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          <Pressable accessibilityLabel="Skip" onPress={() => submit(true)} style={styles.secondary}>
            <Text style={styles.secondaryText}>Skip</Text>
          </Pressable>
          <Pressable accessibilityLabel="Confirm answer" disabled={choice === null} onPress={() => submit()} style={[styles.primary, styles.flex, { backgroundColor: sectionColor }, choice === null && { opacity: 0.4 }]}>
            <Text style={styles.primaryText}>{k + 1 >= items.length ? 'Finish' : 'Confirm'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'report' && result) return <Report result={result} history={[result, ...(brain.tests ?? []).filter((t) => t.date !== result.date)]} />;
  return null;
}

// ---------- report ----------

function BellCurve({ iq, width }: { iq: number; width: number }) {
  const h = 150;
  const x = (v: number) => ((v - 55) / 90) * width;
  const y = (v: number) => h - 20 - Math.exp(-((v - 100) ** 2) / (2 * 15 * 15)) * (h - 40);
  const pts: string[] = [];
  for (let v = 55; v <= 145; v += 1) pts.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
  const shade: string[] = [];
  for (let v = 55; v <= Math.min(iq, 145); v += 1) shade.push(`${x(v).toFixed(1)},${y(v).toFixed(1)}`);
  return (
    <Svg width={width} height={h}>
      <Path d={`M${x(55)},${h - 20} L${shade.join(' L')} L${x(Math.min(iq, 145))},${h - 20} Z`} fill="#7C8CFF" opacity={0.25} />
      <Path d={`M${pts.join(' L')}`} fill="none" stroke="#7C8CFF" strokeWidth={2.5} />
      <Line x1={0} y1={h - 20} x2={width} y2={h - 20} stroke={colors.border} strokeWidth={1} />
      {[70, 85, 100, 115, 130].map((v) => (
        <SvgText key={v} x={x(v)} y={h - 4} fontSize={10} fill="#8E97C8" textAnchor="middle">
          {v}
        </SvgText>
      ))}
      <Line x1={x(Math.min(145, Math.max(55, iq)))} y1={10} x2={x(Math.min(145, Math.max(55, iq)))} y2={h - 20} stroke="#FF6FB5" strokeWidth={2.5} />
    </Svg>
  );
}

function Report({ result, history }: { result: BrainTest; history: BrainTest[] }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 620) - 64;
  const card = useRef<ComponentRef<typeof View>>(null);
  const [sharing, setSharing] = useState(false);
  const pct = percentile(result.iq);
  const domainStats = DOMAINS.filter((d) => result.domains[d.id]).map((d) => ({ d, ...result.domains[d.id]!, p: result.domains[d.id]!.right / result.domains[d.id]!.total }));
  const sorted = [...domainStats].sort((a, b) => b.p - a.p);
  const share = async () => {
    setSharing(true);
    try {
      const uri = await captureRef(card as Parameters<typeof captureRef>[0], { format: 'png', quality: 1, result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile' });
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
          <Text style={styles.kicker}>{result.mode === 'full' ? 'IQ-STYLE TEST' : 'QUICK TEST'} · {new Date(result.date).toLocaleDateString()}</Text>
          <Animated.Text entering={FadeInDown.duration(500)} style={styles.iq}>
            {result.iq}
          </Animated.Text>
          <Text style={styles.heroText}>
            Estimated score · higher than about {pct}% of people · {result.correct}/{result.total} correct
          </Text>
          <BellCurve iq={result.iq} width={w} />
          {domainStats.map((s) => (
            <View key={s.d.id} style={styles.domainRow}>
              <Text style={[styles.domainName, { color: s.d.color }]}>{s.d.name}</Text>
              <View style={styles.domainTrack}>
                <View style={[styles.domainFill, { width: `${s.p * 100}%`, backgroundColor: s.d.color }]} />
              </View>
              <Text style={styles.domainVal}>
                {s.right}/{s.total}
              </Text>
            </View>
          ))}
          <Text style={styles.brand}>DEEPSTACH · BRAIN</Text>
        </LinearGradient>
      </View>
      {sorted.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Strengths and areas to train</Text>
          <Text style={styles.cardText}>
            Strongest: <Text style={{ color: sorted[0].d.color, fontWeight: '900' }}>{sorted[0].d.name}</Text> ({Math.round(sorted[0].p * 100)}%). Weakest:{' '}
            <Text style={{ color: sorted[sorted.length - 1].d.color, fontWeight: '900' }}>{sorted[sorted.length - 1].d.name}</Text> ({Math.round(sorted[sorted.length - 1].p * 100)}%).
          </Text>
          <Text style={styles.muted}>Your weekly plan on the Brain tab now leans on the weaker areas.</Text>
        </View>
      )}
      {history.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>History</Text>
          {history.slice(0, 8).map((t) => (
            <View key={t.date} style={styles.historyRow}>
              <Text style={styles.muted}>{new Date(t.date).toLocaleDateString()} · {t.mode}</Text>
              <View style={styles.historyBar}>
                <View style={[styles.domainFill, { width: `${((t.iq - 55) / 105) * 100}%`, backgroundColor: '#7C8CFF' }]} />
              </View>
              <Text style={styles.historyIq}>{t.iq}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.disclaimer}>
        This is an estimate for practice: it compares how many items you solved with how hard they were. It is not a clinically validated IQ test, and scores vary from one attempt to the next.
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
  hud: { flexDirection: 'row', justifyContent: 'space-between' },
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
});
