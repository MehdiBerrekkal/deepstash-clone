import { useId } from 'react';
import Svg, { Circle, Defs, G, Line, Pattern, Polygon, Rect } from 'react-native-svg';

import type { Cell, ShapeKind, ShapeSpec } from '@/lib/brain/games';

const POINTS: Record<Exclude<ShapeKind, 'circle' | 'square'>, string> = {
  triangle: '0,-1 0.87,0.5 -0.87,0.5',
  diamond: '0,-1 0.75,0 0,1 -0.75,0',
  star: '0,-1 0.24,-0.31 0.95,-0.31 0.38,0.12 0.59,0.81 0,0.38 -0.59,0.81 -0.38,0.12 -0.95,-0.31 -0.24,-0.31',
  hexagon: '0.87,-0.5 0.87,0.5 0,1 -0.87,0.5 -0.87,-0.5 0,-1',
};

function One({ kind, x, y, r, rotation, fill, stroke, patternId }: { kind: ShapeKind; x: number; y: number; r: number; rotation: number; fill: string; stroke: string; patternId: string }) {
  const paint = fill === 'striped' ? `url(#${patternId})` : fill;
  const common = { fill: paint, stroke, strokeWidth: 2 };
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotation})`}>
      {kind === 'circle' ? (
        <Circle r={r} {...common} />
      ) : kind === 'square' ? (
        <Rect x={-r * 0.8} y={-r * 0.8} width={r * 1.6} height={r * 1.6} {...common} />
      ) : (
        <Polygon points={POINTS[kind].split(' ').map((p) => p.split(',').map((n) => Number(n) * r).join(',')).join(' ')} {...common} />
      )}
    </G>
  );
}

/** One puzzle tile: 1-3 copies of a shape, solid, outlined or striped, turned to an angle. */
export function ShapeTile({ spec, size, color }: { spec: ShapeSpec; size: number; color: string }) {
  const id = `stripes-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = spec.count === 1 ? size * 0.3 : spec.count === 2 ? size * 0.2 : size * 0.15;
  const xs = spec.count === 1 ? [size / 2] : spec.count === 2 ? [size * 0.3, size * 0.7] : [size * 0.2, size * 0.5, size * 0.8];
  const fill = spec.fill === 'solid' ? color : spec.fill === 'empty' ? 'none' : 'striped';
  return (
    <Svg width={size} height={size}>
      <Defs>
        <Pattern id={id} patternUnits="userSpaceOnUse" width={6} height={6} patternTransform="rotate(45)">
          <Line x1={0} y1={0} x2={0} y2={6} stroke={color} strokeWidth={2.5} />
        </Pattern>
      </Defs>
      {xs.map((x, i) => (
        <One key={i} kind={spec.kind} x={x} y={size / 2} r={r} rotation={spec.rotation} fill={fill} stroke={color} patternId={id} />
      ))}
    </Svg>
  );
}

/** A polyomino drawn on a small grid, for the rotation game. */
export function BlockShape({ cells, size, color }: { cells: Cell[]; size: number; color: string }) {
  const w = Math.max(...cells.map((c) => c[0])) + 1;
  const h = Math.max(...cells.map((c) => c[1])) + 1;
  const n = Math.max(w, h);
  const unit = size / (n + 0.5);
  const ox = (size - w * unit) / 2;
  const oy = (size - h * unit) / 2;
  return (
    <Svg width={size} height={size}>
      {cells.map(([x, y], i) => (
        <Rect key={i} x={ox + x * unit + 1} y={oy + y * unit + 1} width={unit - 2} height={unit - 2} rx={3} fill={color} />
      ))}
    </Svg>
  );
}
