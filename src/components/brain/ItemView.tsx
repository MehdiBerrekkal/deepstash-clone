import { StyleSheet, Text, View } from 'react-native';

import { CubeSvg, FigureSvg, FoldSteps, HoleSheet, NetSvg, PolySvg, VoxelSvg } from '@/components/brain/Figures';
import { usePalette } from '@/lib/appearance';
import type { CodePrompt, InkPrompt, SwitchPrompt } from '@/lib/brain/catalog';
import type { Item } from '@/lib/brain/core';
import type { Figure } from '@/lib/brain/figures';
import type { CubeView, FoldPrompt, HoleSet, NetPrompt, Poly, Voxel } from '@/lib/brain/spatial';
import { colors } from '@/lib/theme';

export function useInk() {
  const p = usePalette();
  return { ink: p.text, soft: p.muted, paper: p.surface, accent: p.accent };
}

/** The question part of an item, sized to the available width. */
export function PromptView({ item, width, accent }: { item: Item; width: number; accent: string }) {
  const ink = useInk();
  const k = item.kind;
  if (k === 'matrix') {
    const cells = item.prompt as Figure[];
    const s = Math.min(98, Math.floor((width - 24) / 3));
    return (
      <View style={[styles.matrix, { width: s * 3 + 12 }]}>
        {[...cells, null].map((f, i) => (
          <View key={i} style={[styles.matrixCell, { width: s, height: s, borderColor: f ? colors.border : accent }]}>
            {f ? <FigureSvg f={f} size={s - 8} ink={ink} /> : <Text style={[styles.q, { color: accent }]}>?</Text>}
          </View>
        ))}
      </View>
    );
  }
  if (k === 'analogy') {
    const [a, b, c] = item.prompt as Figure[];
    const s = Math.min(84, Math.floor((width - 60) / 4));
    const box = (f: Figure | null, label: string) => (
      <View style={styles.anaBox}>
        <View style={[styles.matrixCell, { width: s, height: s, borderColor: f ? colors.border : accent }]}>
          {f ? <FigureSvg f={f} size={s - 8} ink={ink} /> : <Text style={[styles.q, { color: accent }]}>?</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    );
    return (
      <View style={styles.row}>
        {box(a, 'A')}
        <Text style={styles.colon}>:</Text>
        {box(b, 'B')}
        <Text style={styles.colon}>::</Text>
        {box(c, 'C')}
        <Text style={styles.colon}>:</Text>
        {box(null, '?')}
      </View>
    );
  }
  if (k === 'series' || k === 'letters') {
    const xs = item.prompt as (number | string)[];
    return (
      <View style={styles.seriesRow}>
        {xs.map((x, i) => (
          <View key={i} style={styles.seriesCell}>
            <Text style={styles.seriesText}>{x}</Text>
          </View>
        ))}
        <View style={[styles.seriesCell, { borderColor: accent }]}>
          <Text style={[styles.seriesText, { color: accent }]}>?</Text>
        </View>
      </View>
    );
  }
  if (k === 'numgrid') {
    const xs = item.prompt as number[];
    const s = Math.min(84, Math.floor((width - 24) / 3));
    return (
      <View style={[styles.matrix, { width: s * 3 + 12 }]}>
        {[...xs, null].map((x, i) => (
          <View key={i} style={[styles.matrixCell, { width: s, height: s * 0.7, borderColor: x === null ? accent : colors.border }]}>
            <Text style={[styles.seriesText, x === null && { color: accent }]}>{x ?? '?'}</Text>
          </View>
        ))}
      </View>
    );
  }
  if (k === 'syllogism') {
    const p = item.prompt as { premises: string[]; conclusion: string };
    return (
      <View style={styles.textBlock}>
        {p.premises.map((t) => (
          <Text key={t} style={styles.premise}>
            {t}
          </Text>
        ))}
        <View style={[styles.rule, { backgroundColor: accent }]} />
        <Text style={[styles.premise, styles.conclusion]}>Therefore: {p.conclusion}</Text>
      </View>
    );
  }
  if (k === 'seating') {
    const p = item.prompt as { n: number; clues: string[] };
    return (
      <View style={styles.textBlock}>
        <View style={styles.seats}>
          {Array.from({ length: p.n }, (_, i) => (
            <View key={i} style={[styles.seat, { borderColor: accent }]}>
              <Text style={styles.seatText}>{i + 1}</Text>
            </View>
          ))}
        </View>
        {p.clues.map((c, i) => (
          <Text key={c} style={styles.clue}>
            <Text style={{ color: accent }}>{i + 1}. </Text>
            {c}
          </Text>
        ))}
      </View>
    );
  }
  if (k === 'verbal' || k === 'word' || k === 'arith') {
    return <Text style={[styles.bigText, k === 'arith' && styles.huge]}>{item.prompt as string}</Text>;
  }
  if (k === 'folding') {
    const p = item.prompt as FoldPrompt;
    const n = p.folds.length + 1;
    return <FoldSteps p={p} size={Math.min(110, (width - 8 * n) / n)} ink={ink} />;
  }
  if (k === 'cubenet') {
    return <NetSvg p={item.prompt as NetPrompt} size={Math.min(230, width * 0.62)} ink={ink} />;
  }
  if (k === 'rotation3d') {
    return (
      <View style={[styles.target, { borderColor: accent }]}>
        <VoxelSvg cells={item.prompt as Voxel[]} size={Math.min(170, width * 0.48)} ink={ink} accent={accent} />
        <Text style={styles.label}>TARGET</Text>
      </View>
    );
  }
  if (k === 'rotation2d') {
    const cells = item.prompt as Poly;
    return (
      <View style={[styles.target, { borderColor: accent }]}>
        <PolySvg cells={cells} size={Math.min(170, width * 0.46)} ink={ink} accent={`${accent}`} frame={Math.max(5, ...(item.options as Poly[]).map((o) => Math.max(...o.map((c) => Math.max(c[0], c[1]) + 1))))} />
        <Text style={styles.label}>TARGET</Text>
      </View>
    );
  }
  if (k === 'code') {
    const p = item.prompt as CodePrompt;
    return (
      <View style={styles.textBlock}>
        <View style={styles.codeKey}>
          {[...p.key].sort((a, b) => a.digit - b.digit).map((e) => (
            <View key={e.glyph} style={styles.codePair}>
              <Text style={styles.codeGlyph}>{e.glyph}</Text>
              <Text style={styles.codeDigit}>{e.digit}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.codeTarget, { color: accent }]}>{p.glyph}</Text>
      </View>
    );
  }
  if (k === 'switch') {
    const p = item.prompt as SwitchPrompt;
    const tint = p.rule === 'parity' ? '#FFB547' : '#4FD1FF';
    return (
      <View style={[styles.switchFrame, { borderColor: tint }]}>
        <Text style={[styles.switchRule, { color: tint }]}>{p.rule === 'parity' ? 'ODD OR EVEN?' : 'LOWER OR HIGHER THAN 5?'}</Text>
        <Text style={styles.switchNum}>{p.n}</Text>
      </View>
    );
  }
  if (k === 'ink') {
    const p = item.prompt as InkPrompt;
    return (
      <View style={styles.textBlock}>
        <Text style={[styles.inkRule, p.rule === 'word' && { color: accent }]}>{p.rule === 'ink' ? 'Name the INK colour' : 'Name the WORD'}</Text>
        <Text style={[styles.inkWord, { color: p.ink }]}>{p.word}</Text>
      </View>
    );
  }
  return null;
}

/** One answer option, drawn to fit a tile. */
export function OptionView({ item, value, size, accent }: { item: Item; value: unknown; size: number; accent: string }) {
  const ink = useInk();
  switch (item.kind) {
    case 'matrix':
    case 'analogy':
      return <FigureSvg f={value as Figure} size={size} ink={ink} />;
    case 'folding':
      return <HoleSheet holes={value as HoleSet} n={(item.prompt as FoldPrompt).n} size={size} ink={ink} />;
    case 'cubenet':
      return <CubeSvg v={value as CubeView} size={size} ink={ink} />;
    case 'rotation2d':
      return <PolySvg cells={value as Poly} size={size} ink={ink} accent={accent} frame={Math.max(5, ...(item.options as Poly[]).map((o) => Math.max(...o.map((c) => Math.max(c[0], c[1]) + 1))), ...(item.prompt as Poly).map((c) => Math.max(c[0], c[1]) + 1))} />;
    case 'rotation3d':
      return <VoxelSvg cells={value as Voxel[]} size={size} ink={ink} accent={accent} />;
    case 'ink': {
      const v = value as { name: string; color: string };
      return (
        <View style={styles.inkOption}>
          <View style={[styles.swatch, { backgroundColor: v.color }]} />
          <Text style={styles.optText}>{v.name.toLowerCase()}</Text>
        </View>
      );
    }
    default:
      return <Text style={[styles.optText, item.kind === 'code' && styles.optBig]}>{String(value)}</Text>;
  }
}

/** Options drawn as pictures sit in a grid of square tiles; text options in full-width rows. */
export const pictureOptions = (kind: string) => ['matrix', 'analogy', 'folding', 'cubenet', 'rotation3d', 'rotation2d'].includes(kind);

const styles = StyleSheet.create({
  matrix: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignSelf: 'center' },
  matrixCell: { alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, backgroundColor: colors.surface },
  q: { fontSize: 30, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  anaBox: { alignItems: 'center', gap: 4 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  colon: { color: colors.muted, fontSize: 20, fontWeight: '700', marginBottom: 14 },
  seriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  seriesCell: { minWidth: 46, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center' },
  seriesText: { color: colors.text, fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
  textBlock: { alignSelf: 'stretch', gap: 10 },
  premise: { color: colors.text, fontSize: 17, lineHeight: 25 },
  conclusion: { fontWeight: '800' },
  rule: { height: 2, width: 48, borderRadius: 1, opacity: 0.8 },
  seats: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 4 },
  seat: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  seatText: { color: colors.text, fontWeight: '800' },
  clue: { color: colors.text, fontSize: 15, lineHeight: 22 },
  bigText: { color: colors.text, fontSize: 20, lineHeight: 29, fontWeight: '600', textAlign: 'center' },
  huge: { fontSize: 38, fontWeight: '900', fontVariant: ['tabular-nums'] },
  target: { alignItems: 'center', borderWidth: 1.5, borderRadius: 18, padding: 8, gap: 2, alignSelf: 'center' },
  codeKey: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  codePair: { alignItems: 'center', width: 40, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  codeGlyph: { color: colors.text, fontSize: 20 },
  codeDigit: { color: colors.muted, fontWeight: '800' },
  codeTarget: { fontSize: 64, textAlign: 'center' },
  switchFrame: { alignSelf: 'center', width: 190, height: 190, borderRadius: 26, borderWidth: 5, alignItems: 'center', justifyContent: 'center', gap: 6 },
  switchRule: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center' },
  switchNum: { color: colors.text, fontSize: 84, fontWeight: '900' },
  inkRule: { color: colors.muted, fontWeight: '800', letterSpacing: 1.2, textAlign: 'center', fontSize: 12 },
  inkWord: { fontSize: 52, fontWeight: '900', letterSpacing: 3, textAlign: 'center' },
  inkOption: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatch: { width: 20, height: 20, borderRadius: 10 },
  optText: { color: colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center' },
  optBig: { fontSize: 24, fontWeight: '900' },
});
