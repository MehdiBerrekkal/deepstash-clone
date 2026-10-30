import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { cardKinds, colors } from '@/lib/theme';
import type { CardKind } from '@/lib/types';

type Props<T extends string> = {
  value: CardKind | NoInfer<T> | null;
  onChange: (kind: CardKind | NoInfer<T> | null) => void;
  /** More pills after the card kinds (e.g. Books, Highlights in search). */
  extras?: { id: T; label: string }[];
};

/** Pills for All / Book ideas / Quotes / Poems / Knowledge, plus any extras. */
export function KindFilter<T extends string = never>({ value, onChange, extras = [] }: Props<T>) {
  const options: { id: CardKind | T | null; label: string }[] = [
    { id: null, label: 'All' },
    ...cardKinds.map((k) => ({ id: k.id, label: `${k.emoji} ${k.plural}` })),
    ...extras,
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.row}>
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <Pressable
            key={o.id ?? 'all'}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.id)}
            style={[styles.pill, selected && styles.pillSelected]}>
            <Text style={[styles.label, selected && styles.labelSelected]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface },
  pillSelected: { backgroundColor: colors.text },
  label: { color: colors.text, fontWeight: '600', fontSize: 14 },
  labelSelected: { color: colors.background },
});
