import Svg, { Circle, Defs, LinearGradient, Line, Polygon, Stop, Text as SvgText } from 'react-native-svg';

import { usePalette } from '@/lib/appearance';
import { DOMAINS, type Skill } from '@/lib/brain/core';

/** A six-axis radar of the cognitive profile (0-100 per domain). */
export function SkillRadar({ skills, size }: { skills: Partial<Record<Skill, number>>; size: number }) {
  const colors = usePalette();
  const c = size / 2;
  const r = size * 0.31;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / DOMAINS.length - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v];
  };
  const ring = (v: number) => DOMAINS.map((_, i) => point(i, v).join(',')).join(' ');
  const value = (s: Skill) => Math.max(0.05, (skills[s] ?? 0) / 100);
  const shape = DOMAINS.map((d, i) => point(i, value(d.id)).join(',')).join(' ');
  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="radar" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7C8CFF" stopOpacity={0.55} />
          <Stop offset="1" stopColor="#4FD1FF" stopOpacity={0.25} />
        </LinearGradient>
      </Defs>
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <Polygon key={v} points={ring(v)} fill="none" stroke={colors.border} strokeWidth={1} />
      ))}
      {DOMAINS.map((_, i) => {
        const [x, y] = point(i, 1);
        return <Line key={i} x1={c} y1={c} x2={x} y2={y} stroke={colors.border} strokeWidth={1} />;
      })}
      <Polygon points={shape} fill="url(#radar)" stroke="#7C8CFF" strokeWidth={2} />
      {DOMAINS.map((d, i) => {
        const [x, y] = point(i, value(d.id));
        return <Circle key={d.id} cx={x} cy={y} r={4} fill={d.color} />;
      })}
      {DOMAINS.map((d, i) => {
        const [x, y] = point(i, 1.3);
        return (
          <SvgText key={d.id} x={x} y={y + 4} fontSize={11} fontWeight="800" fill={d.color} textAnchor="middle">
            {`${d.name} ${skills[d.id] ?? '–'}`}
          </SvgText>
        );
      })}
    </Svg>
  );
}
