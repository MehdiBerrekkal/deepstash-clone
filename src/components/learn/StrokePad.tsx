import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Svg, { Circle, G, Line, Path, Polyline } from 'react-native-svg';

import { sfx } from '@/lib/brain/sfx';
import { haptic } from '@/lib/haptics';
import { gradeStroke, type Glyph, type Pt } from '@/lib/learn/strokes';

/**
 * watch: the strokes draw themselves in order. trace: write over a faint guide, with the start of each stroke
 * marked. hint: no guide, only the next stroke's start point. free: from memory; after two misses the next stroke
 * appears as a hint.
 */
export type PadMode = 'watch' | 'trace' | 'hint' | 'free';

type Props = {
  glyph: Glyph;
  mode: PadMode;
  size: number;
  ink: string;
  accent: string;
  faint: string;
  /** Called when every stroke is drawn (or the demo ends), with how many strokes needed a second try. */
  onDone: (mistakes: number) => void;
  /** Right-to-left scripts and the like can relax the shape check a little. */
  strictness?: number;
};

const toPoints = (pts: Pt[]) => pts.map((p) => `${p[0]},${p[1]}`).join(' ');

export function StrokePad({ glyph, mode, size, ink, accent, faint, onDone, strictness = 1 }: Props) {
  const box = glyph.box;
  const width = box * 0.075;
  const [done, setDone] = useState(0);
  const [drawing, setDrawing] = useState<Pt[]>([]);
  const [fails, setFails] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<{ pts: Pt[]; text: string } | null>(null);
  const [demo, setDemo] = useState({ stroke: 0, upto: 0 });
  const pts = useRef<Pt[]>([]);
  const state = useRef({ done: 0, fails: 0, mistakes: 0 });
  const scale = box / size;

  // Watch mode: reveal each stroke's points in turn, then report.
  useEffect(() => {
    if (mode !== 'watch') return;
    let s = 0;
    let p = 0;
    const t = setInterval(() => {
      const stroke = glyph.strokes[s];
      if (!stroke) {
        clearInterval(t);
        setTimeout(() => onDone(0), 400);
        return;
      }
      p += Math.max(1, Math.ceil(stroke.length / 12));
      if (p >= stroke.length) {
        sfx.tick();
        s += 1;
        p = 0;
      }
      setDemo({ stroke: s, upto: p });
    }, 45);
    return () => clearInterval(t);
    // A new glyph or mode restarts the demo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyph, mode]);

  const finish = () => {
    const drawn = pts.current;
    pts.current = [];
    setDrawing([]);
    const i = state.current.done;
    const target = glyph.strokes[i];
    if (!target || drawn.length < 1) return;
    const r = gradeStroke(drawn.length < 2 ? [drawn[0], drawn[0]] : drawn, target, box, strictness);
    if (r.ok) {
      sfx.click();
      haptic.tap();
      state.current.done = i + 1;
      state.current.fails = 0;
      setDone(i + 1);
      setFails(0);
      if (i + 1 >= glyph.strokes.length) {
        sfx.right(3);
        setTimeout(() => onDone(state.current.mistakes), 450);
      }
    } else {
      sfx.wrong();
      haptic.tick();
      if (state.current.fails === 0) state.current.mistakes += 1;
      state.current.fails += 1;
      setFails(state.current.fails);
      setMistakes(state.current.mistakes);
      setFlash({ pts: drawn, text: r.reversed ? 'Other direction' : 'Try again' });
      setTimeout(() => setFlash(null), 650);
    }
  };
  const add = (x: number, y: number, first: boolean) => {
    const p: Pt = [x * scale, y * scale];
    const last = pts.current[pts.current.length - 1];
    if (first) pts.current = [p];
    else if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > box * 0.008) pts.current = [...pts.current, p];
    else return;
    setDrawing(pts.current);
  };
  // Drawing runs on the JS thread: the grading is ordinary JavaScript.
  const pan = usePanGesture({
    runOnJS: true,
    minDistance: 0,
    enabled: mode !== 'watch',
    onActivate: (e) => add(e.x, e.y, true),
    onUpdate: (e) => add(e.x, e.y, false),
    onDeactivate: () => finish(),
  });

  // Reset when the glyph or mode changes.
  useEffect(() => {
    state.current = { done: 0, fails: 0, mistakes: 0 };
    const t = setTimeout(() => {
      setDone(0);
      setFails(0);
      setMistakes(0);
    }, 0);
    return () => clearTimeout(t);
  }, [glyph, mode]);

  const next = glyph.strokes[done];
  const showGuide = mode === 'trace' || mode === 'watch';
  const showNext = next && (mode === 'trace' || (mode === 'hint' && fails >= 1) || (mode === 'free' && fails >= 2));
  const drawStroke = (i: number, color: string, upto?: number) =>
    glyph.outlines && upto === undefined ? (
      <Path key={`o${i}`} d={glyph.outlines[i]} fill={color} />
    ) : (
      <Polyline key={`s${i}`} points={toPoints(upto === undefined ? glyph.strokes[i] : glyph.strokes[i].slice(0, Math.max(2, upto)))} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    );
  // Outlines are drawn in a flipped frame for Make Me a Hanzi; centre lines are already flipped.
  const outlineFrame = glyph.outlines ? 'scale(1,-1) translate(0,-900)' : undefined;

  return (
    <GestureDetector gesture={pan}>
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`}>
        {/* A writing grid, as in exercise books. */}
        <Line x1={box / 2} y1={0} x2={box / 2} y2={box} stroke={faint} strokeWidth={box * 0.004} strokeDasharray={`${box * 0.02} ${box * 0.02}`} />
        <Line x1={0} y1={box / 2} x2={box} y2={box / 2} stroke={faint} strokeWidth={box * 0.004} strokeDasharray={`${box * 0.02} ${box * 0.02}`} />
        {showGuide && <G transform={outlineFrame}>{glyph.strokes.map((_, i) => (glyph.outlines ? <Path key={i} d={glyph.outlines[i]} fill={faint} /> : null))}</G>}
        {showGuide && !glyph.outlines && glyph.strokes.map((s, i) => <Polyline key={`g${i}`} points={toPoints(s)} fill="none" stroke={faint} strokeWidth={width * 1.25} strokeLinecap="round" strokeLinejoin="round" />)}
        {mode === 'watch' ? (
          <>
            <G transform={outlineFrame}>{glyph.outlines && glyph.strokes.map((_, i) => (i < demo.stroke ? <Path key={i} d={glyph.outlines![i]} fill={ink} /> : null))}</G>
            {!glyph.outlines && glyph.strokes.map((_, i) => (i < demo.stroke ? drawStroke(i, ink) : null))}
            {glyph.strokes[demo.stroke] && (
              <Polyline points={toPoints(glyph.strokes[demo.stroke].slice(0, Math.max(2, demo.upto)))} fill="none" stroke={accent} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </>
        ) : (
          <>
            {showNext && !showGuide && <Polyline points={toPoints(next)} fill="none" stroke={faint} strokeWidth={width * 1.25} strokeLinecap="round" strokeLinejoin="round" />}
            <G transform={outlineFrame}>{glyph.outlines && glyph.strokes.map((_, i) => (i < done ? <Path key={i} d={glyph.outlines![i]} fill={ink} /> : null))}</G>
            {!glyph.outlines && glyph.strokes.map((_, i) => (i < done ? drawStroke(i, ink) : null))}
            {showNext && (
              <G>
                <Circle cx={next[0][0]} cy={next[0][1]} r={box * 0.035} fill={accent} />
                {next.length > 3 && (
                  <Line x1={next[0][0]} y1={next[0][1]} x2={next[Math.min(3, next.length - 1)][0]} y2={next[Math.min(3, next.length - 1)][1]} stroke={accent} strokeWidth={box * 0.012} strokeLinecap="round" />
                )}
              </G>
            )}
            {flash && <Polyline points={toPoints(flash.pts)} fill="none" stroke="#E5484D" strokeWidth={width * 0.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />}
            {drawing.length > 1 && <Polyline points={toPoints(drawing)} fill="none" stroke={accent} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />}
          </>
        )}
      </Svg>
      <View pointerEvents="none" style={styles.status}>
        <Text style={[styles.statusText, { color: flash ? '#E5484D' : ink }]}>
          {mode === 'watch' ? 'Watch the stroke order' : flash ? flash.text : `Stroke ${Math.min(done + 1, glyph.strokes.length)} of ${glyph.strokes.length}${mistakes ? ` · ${mistakes} retry` : ''}`}
        </Text>
      </View>
    </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  status: { position: 'absolute', bottom: 6, left: 0, right: 0, alignItems: 'center' },
  statusText: { fontSize: 12, fontWeight: '800', opacity: 0.75 },
});
