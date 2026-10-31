import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { DOMAINS, type Skill } from '@/lib/brain/core';

type Snapshot = { date: string; skills: Partial<Record<Skill, number>> };

/** Area scores over the days you trained: one line per area; tap an area to focus it. */
export function ProgressChart({ history, width }: { history: Snapshot[]; width: number }) {
  const [focus, setFocus] = useState<Skill | null>(null);
  const h = 150;
  const pad = 8;
  const days = history.slice(-30);
  if (days.length < 2) {
    return <Text style={styles.empty}>Train on two different days to see your progress here.</Text>;
  }
  const x = (i: number) => pad + (i / (days.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - v / 100) * (h - pad * 2);
  const series = DOMAINS.map((d) => {
    const pts = days.map((s, i) => (s.skills[d.id] === undefined ? null : ([x(i), y(s.skills[d.id]!)] as const))).filter(Boolean) as (readonly [number, number])[];
    const first = days.find((s) => s.skills[d.id] !== undefined)?.skills[d.id];
    const last = days[days.length - 1].skills[d.id];
    return { d, pts, change: first !== undefined && last !== undefined ? last - first : null };
  }).filter((s) => s.pts.length);
  return (
    <View style={styles.wrap}>
      <Svg width={width} height={h}>
        {[25, 50, 75].map((v) => (
          <Line key={v} x1={pad} x2={width - pad} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        {series.map(({ d, pts }) => {
          const dim = focus && focus !== d.id;
          return (
            <Path
              key={d.id}
              d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
              stroke={d.color}
              strokeWidth={focus === d.id ? 3.5 : 2}
              strokeOpacity={dim ? 0.15 : 1}
              fill="none"
              strokeLinejoin="round"
            />
          );
        })}
        {series.map(({ d, pts }) => (focus && focus !== d.id ? null : <Circle key={d.id} cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.5} fill={d.color} />))}
      </Svg>
      <View style={styles.legend}>
        {series.map(({ d, change }) => (
          <Pressable key={d.id} accessibilityLabel={`Show ${d.name}`} onPress={() => setFocus(focus === d.id ? null : d.id)} style={[styles.chip, focus === d.id && { borderColor: d.color }]}>
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <Text style={styles.chipText}>
              {d.name}
              {change !== null && change !== 0 ? ` ${change > 0 ? '▲' : '▼'}${Math.abs(change)}` : ''}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.caption}>
        {days[0].date} → {days[days.length - 1].date} · {days.length} training days
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  empty: { color: '#8E97C8', fontSize: 13, lineHeight: 19 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, minHeight: 32, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { color: '#D5D9F0', fontSize: 12, fontWeight: '800' },
  caption: { color: '#8E97C8', fontSize: 11 },
});
