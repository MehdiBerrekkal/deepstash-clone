import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';

import { cardKinds, colors } from '@/lib/theme';
import type { CardKind } from '@/lib/types';
import { useT } from '@/lib/i18n';

type Props<T extends string> = {
  value: CardKind | NoInfer<T> | null;
  onChange: (kind: CardKind | NoInfer<T> | null) => void;
  /** More pills after the card kinds (e.g. Books, Highlights in search). */
  extras?: { id: T; label: string; icon?: IconName }[];
};

/** Pills for All / Book ideas / Quotes / Poems / Knowledge, plus any extras. */
export function KindFilter<T extends string = never>({ value, onChange, extras = [] }: Props<T>) {
  const t = useT();
  const options: { id: CardKind | T | null; label: string; icon?: IconName }[] = [
    { id: null, label: t('All') },
    ...cardKinds.map((k) => ({ id: k.id, label: t(k.plural), icon: k.icon as IconName })),
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
            {o.icon && <Icon name={o.icon} size={15} color={selected ? colors.background : colors.muted} strokeWidth={2} />}
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
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  pillSelected: { backgroundColor: colors.text, borderColor: colors.text },
  label: { color: colors.text, fontWeight: '600', fontSize: 14 },
  labelSelected: { color: colors.background },
});
