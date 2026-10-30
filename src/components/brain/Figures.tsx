import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';

import type { Figure, Outer } from '@/lib/brain/figures';
import type { CubeView, FoldPrompt, HoleSet, NetPrompt, Symbol, Voxel } from '@/lib/brain/spatial';

type Ink = { ink: string; soft: string; paper: string };

const SHAPE_PATH: Record<Exclude<Outer, 'none'>, (r: number) => string> = {
  circle: () => '',
  square: (r) => `M${-r * 0.82},${-r * 0.82}H${r * 0.82}V${r * 0.82}H${-r * 0.82}Z`,
  triangle: (r) => `M0,${-r}L${r * 0.9},${r * 0.62}L${-r * 0.9},${r * 0.62}Z`,
  diamond: (r) => `M0,${-r}L${r * 0.8},0L0,${r}L${-r * 0.8},0Z`,
  hexagon: (r) => `M0,${-r}L${r * 0.87},${-r / 2}L${r * 0.87},${r / 2}L0,${r}L${-r * 0.87},${r / 2}L${-r * 0.87},${-r / 2}Z`,
};

function Shape({ kind, r, fill, stroke, turn }: { kind: Outer; r: number; fill: string; stroke: string; turn: number }) {
  if (kind === 'none') return null;
  return (
    <G transform={`rotate(${turn * 45})`}>
      {kind === 'circle' ? <Circle r={r * 0.9} fill={fill} stroke={stroke} strokeWidth={2.4} /> : <Path d={SHAPE_PATH[kind](r)} fill={fill} stroke={stroke} strokeWidth={2.4} strokeLinejoin="round" />}
    </G>
  );
}

/** One abstract figure, drawn in a 100×100 box: lines behind, outer shape, inner shape, then dots. */
export function FigureSvg({ f, size, ink }: { f: Figure; size: number; ink: Ink }) {
  const fillOf = (v: number) => (v === 0 ? 'none' : v === 1 ? ink.soft : ink.ink);
  const r = [24, 32, 40][f.size];
  const angles = [0, 45, 90, 135].filter((_, i) => f.lines & (1 << i));
  const dots = [[-34, -34], [34, -34], [34, 34], [-34, 34]].slice(0, f.dots);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G transform="translate(50 50)">
        {angles.map((a) => (
          <Line key={a} x1={-46} y1={0} x2={46} y2={0} stroke={ink.ink} strokeWidth={2.2} transform={`rotate(${-a})`} />
        ))}
        <Shape kind={f.outer} r={r} fill={fillOf(f.fill)} stroke={ink.ink} turn={f.turn} />
        {f.inner !== 'none' && <Shape kind={f.inner} r={11} fill={fillOf(f.innerFill)} stroke={ink.ink} turn={0} />}
        {dots.map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={4.2} fill={ink.ink} />
        ))}
      </G>
    </Svg>
  );
}

// ---------- paper folding ----------

type Region = { x: number; y: number; w: number; h: number };

/** The folding steps: the sheet with each fold line and arrow, then the folded sheet with the punched holes. */
export function FoldSteps({ p, size, ink }: { p: FoldPrompt; size: number; ink: Ink }) {
  const S = 100;
  const cell = S / p.n;
  // The sheet before each fold, and what's left after all of them.
  const shrink = (r: Region, f: FoldPrompt['folds'][number]): Region =>
    f === 'left' ? { ...r, x: r.x + r.w / 2, w: r.w / 2 } : f === 'right' ? { ...r, w: r.w / 2 } : f === 'top' ? { ...r, y: r.y + r.h / 2, h: r.h / 2 } : f === 'bottom' ? { ...r, h: r.h / 2 } : r;
  const befores = p.folds.reduce<Region[]>((acc, f, i) => [...acc, i === 0 ? { x: 0, y: 0, w: S, h: S } : shrink(acc[i - 1], p.folds[i - 1])], []);
  const steps = p.folds.map((f, i) => ({ f, before: befores[i] }));
  const region = p.folds.length ? shrink(befores[befores.length - 1], p.folds[p.folds.length - 1]) : { x: 0, y: 0, w: S, h: S };
  const guide = (f: FoldPrompt['folds'][number], r: Region) => {
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    switch (f) {
      case 'left':
        return { line: [cx, r.y, cx, r.y + r.h], from: [r.x + r.w * 0.2, cy], via: [cx, cy - r.h * 0.32], to: [r.x + r.w * 0.8, cy] };
      case 'right':
        return { line: [cx, r.y, cx, r.y + r.h], from: [r.x + r.w * 0.8, cy], via: [cx, cy - r.h * 0.32], to: [r.x + r.w * 0.2, cy] };
      case 'top':
        return { line: [r.x, cy, r.x + r.w, cy], from: [cx, r.y + r.h * 0.2], via: [cx + r.w * 0.32, cy], to: [cx, r.y + r.h * 0.8] };
      case 'bottom':
        return { line: [r.x, cy, r.x + r.w, cy], from: [cx, r.y + r.h * 0.8], via: [cx + r.w * 0.32, cy], to: [cx, r.y + r.h * 0.2] };
      default:
        return { line: [r.x, r.y, r.x + r.w, r.y + r.h], from: [r.x + r.w * 0.22, r.y + r.h * 0.78], via: [r.x + r.w * 0.15, r.y + r.h * 0.15], to: [r.x + r.w * 0.78, r.y + r.h * 0.22] };
    }
  };
  const frame = (key: number, r: Region, children: ReactNode) => (
    <Svg key={key} width={size} height={size} viewBox={`-4 -4 ${S + 8} ${S + 8}`}>
      <Rect x={0} y={0} width={S} height={S} fill="none" stroke={ink.soft} strokeDasharray="3 3" strokeWidth={1} />
      <Rect x={r.x} y={r.y} width={r.w} height={r.h} fill={ink.paper} stroke={ink.ink} strokeWidth={2} />
      {children}
    </Svg>
  );
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      {steps.map((st, i) => {
        const g = guide(st.f, st.before);
        return frame(
          i,
          st.before,
          <>
            <Line x1={g.line[0]} y1={g.line[1]} x2={g.line[2]} y2={g.line[3]} stroke={ink.ink} strokeDasharray="5 4" strokeWidth={1.6} />
            <Path d={`M${g.from[0]},${g.from[1]} Q${g.via[0]},${g.via[1]} ${g.to[0]},${g.to[1]}`} fill="none" stroke={ink.ink} strokeWidth={2.2} />
            <Circle cx={g.to[0]} cy={g.to[1]} r={3.6} fill={ink.ink} />
          </>,
        );
      })}
      {frame(
        99,
        region,
        <>
          {p.folds.includes('diag') && (
            <Polygon points={`${region.x},${region.y} ${region.x},${region.y + region.h} ${region.x + region.w},${region.y + region.h}`} fill={ink.soft} opacity={0.3} />
          )}
          {p.holes.map(([x, y], i) => (
            <Circle key={i} cx={x * cell + cell / 2} cy={y * cell + cell / 2} r={cell * 0.22} fill={ink.ink} />
          ))}
        </>,
      )}
    </View>
  );
}

/** An unfolded sheet with holes (an answer option). */
export function HoleSheet({ holes, n, size, ink }: { holes: HoleSet; n: number; size: number; ink: Ink }) {
  const cell = size / n;
  return (
    <Svg width={size} height={size}>
      <Rect x={1} y={1} width={size - 2} height={size - 2} fill={ink.paper} stroke={ink.ink} strokeWidth={2} />
      {[1, 2, 3].map((i) => (
        <G key={i}>
          <Line x1={(size * i) / 4} y1={2} x2={(size * i) / 4} y2={size - 2} stroke={ink.soft} strokeWidth={0.6} opacity={0.4} />
          <Line x1={2} y1={(size * i) / 4} x2={size - 2} y2={(size * i) / 4} stroke={ink.soft} strokeWidth={0.6} opacity={0.4} />
        </G>
      ))}
      {holes.map(([x, y], i) => (
        <Circle key={i} cx={x * cell + cell / 2} cy={y * cell + cell / 2} r={cell * 0.22} fill={ink.ink} />
      ))}
    </Svg>
  );
}

// ---------- cube nets ----------

/** A face symbol drawn in a unit square (0..1). Every symbol looks the same turned 90°, so face turns don't matter. */
function SymbolPath({ s, ink }: { s: Symbol; ink: Ink }) {
  const w = 0.07;
  switch (s) {
    case 'dot':
      return <Circle cx={0.5} cy={0.5} r={0.22} fill={ink.ink} />;
    case 'ring':
      return <Circle cx={0.5} cy={0.5} r={0.22} fill="none" stroke={ink.ink} strokeWidth={w} />;
    case 'block':
      return <Rect x={0.3} y={0.3} width={0.4} height={0.4} fill={ink.ink} />;
    case 'box':
      return <Rect x={0.3} y={0.3} width={0.4} height={0.4} fill="none" stroke={ink.ink} strokeWidth={w} />;
    case 'plus':
      return <Path d="M0.5,0.24V0.76M0.24,0.5H0.76" stroke={ink.ink} strokeWidth={w * 1.4} />;
    case 'cross':
      return <Path d="M0.3,0.3L0.7,0.7M0.7,0.3L0.3,0.7" stroke={ink.ink} strokeWidth={w * 1.4} />;
  }
}

export function NetSvg({ p, size, ink }: { p: NetPrompt; size: number; ink: Ink }) {
  const w = Math.max(...p.cells.map((c) => c[0])) + 1;
  const h = Math.max(...p.cells.map((c) => c[1])) + 1;
  const u = size / Math.max(w, h);
  return (
    <Svg width={w * u + 4} height={h * u + 4}>
      {p.cells.map(([x, y], i) => (
        <G key={i} transform={`translate(${x * u + 2} ${y * u + 2})`}>
          <Rect width={u} height={u} fill={ink.paper} stroke={ink.ink} strokeWidth={2} />
          <G transform={`scale(${u})`}>
            <SymbolPath s={p.symbols[i]} ink={ink} />
          </G>
        </G>
      ))}
    </Svg>
  );
}

/** A cube seen from above-front-right, with a symbol on each visible face. */
export function CubeSvg({ v, size, ink }: { v: CubeView; size: number; ink: Ink }) {
  const s = size * 0.42;
  const c = Math.cos(Math.PI / 6);
  const ox = size / 2;
  const oy = size * 0.5;
  // Face transforms map the unit square onto each parallelogram.
  const top = `matrix(${s * c} ${-s * 0.5} ${s * c} ${s * 0.5} ${ox - s * c} ${oy - s * 0.5})`;
  const front = `matrix(${s * c} ${s * 0.5} 0 ${s} ${ox - s * c} ${oy - s * 0.5})`;
  const right = `matrix(${s * c} ${-s * 0.5} 0 ${s} ${ox} ${oy})`;
  const face = (t: string, sym: Symbol, shade: string) => (
    <G transform={t}>
      <Rect width={1} height={1} fill={shade} stroke={ink.ink} strokeWidth={2 / s} />
      <SymbolPath s={sym} ink={ink} />
    </G>
  );
  return (
    <Svg width={size} height={size}>
      {face(top, v.top, ink.paper)}
      {face(front, v.front, ink.paper)}
      {face(right, v.right, ink.paper)}
    </Svg>
  );
}

// ---------- block figures ----------

/** Isometric voxels with three shaded faces each, drawn back to front. */
export function VoxelSvg({ cells, size, ink, accent }: { cells: Voxel[]; size: number; ink: Ink; accent: string }) {
  const has = new Set(cells.map((c) => c.join(',')));
  const span = Math.max(...cells.flatMap((c) => c)) + 1;
  const u = size / (span * 2.2 + 1);
  const c = Math.cos(Math.PI / 6);
  const P = (x: number, y: number, z: number) => [(x - y) * c * u, (x + y) * 0.5 * u - z * u];
  const minX = Math.min(...cells.flatMap(([x, y, z]) => [P(x, y + 1, z)[0]]));
  const maxX = Math.max(...cells.flatMap(([x, y, z]) => [P(x + 1, y, z)[0]]));
  const minY = Math.min(...cells.flatMap(([x, y, z]) => [P(x, y, z + 1)[1]]));
  const maxY = Math.max(...cells.flatMap(([x, y, z]) => [P(x + 1, y + 1, z)[1]]));
  const offX = (size - (maxX - minX)) / 2 - minX;
  const offY = (size - (maxY - minY)) / 2 - minY;
  const pt = (x: number, y: number, z: number) => {
    const [px, py] = P(x, y, z);
    return `${px + offX},${py + offY}`;
  };
  const order = [...cells].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2]);
  return (
    <Svg width={size} height={size}>
      {order.map(([x, y, z]) => (
        <G key={`${x},${y},${z}`}>
          {!has.has(`${x},${y},${z + 1}`) && (
            <Polygon points={[pt(x, y, z + 1), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)].join(' ')} fill={accent} stroke={ink.ink} strokeWidth={1.2} strokeLinejoin="round" />
          )}
          {!has.has(`${x + 1},${y},${z}`) && (
            <Polygon points={[pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x + 1, y, z + 1)].join(' ')} fill={accent} opacity={0.72} stroke={ink.ink} strokeWidth={1.2} strokeLinejoin="round" />
          )}
          {!has.has(`${x},${y + 1},${z}`) && (
            <Polygon points={[pt(x, y + 1, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)].join(' ')} fill={accent} opacity={0.45} stroke={ink.ink} strokeWidth={1.2} strokeLinejoin="round" />
          )}
        </G>
      ))}
    </Svg>
  );
}
