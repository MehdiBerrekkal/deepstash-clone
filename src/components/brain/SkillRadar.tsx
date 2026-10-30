import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { SKILLS, type Skill } from '@/lib/brain/games';
import { usePalette } from '@/lib/appearance';

/** A six-sided radar of Brain scores per skill (0-100). */
export function SkillRadar({ skills, size }: { skills: Partial<Record<Skill, number>>; size: number }) {
  const colors = usePalette();
  const c = size / 2;
  const r = size * 0.32;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v];
  };
  const ring = (v: number) => SKILLS.map((_, i) => point(i, v).join(',')).join(' ');
  const shape = SKILLS.map((s, i) => point(i, Math.max(0.04, (skills[s.id] ?? 0) / 100)).join(',')).join(' ');
  return (
    <Svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <Polygon key={v} points={ring(v)} fill="none" stroke={colors.border} strokeWidth={1} />
      ))}
      {SKILLS.map((_, i) => {
        const [x, y] = point(i, 1);
        return <Line key={i} x1={c} y1={c} x2={x} y2={y} stroke={colors.border} strokeWidth={1} />;
      })}
      <Polygon points={shape} fill={colors.accent} fillOpacity={0.28} stroke={colors.accent} strokeWidth={2} />
      {SKILLS.map((s, i) => {
        const [x, y] = point(i, Math.max(0.04, (skills[s.id] ?? 0) / 100));
        return <Circle key={s.id} cx={x} cy={y} r={3.5} fill={colors.accent} />;
      })}
      <G>
        {SKILLS.map((s, i) => {
          const [x, y] = point(i, 1.32);
          return (
            <SvgText key={s.id} x={x} y={y + 4} fontSize={11} fontWeight="700" fill={colors.muted} textAnchor="middle">
              {`${s.name} ${skills[s.id] ?? '–'}`}
            </SvgText>
          );
        })}
      </G>
    </Svg>
  );
}
