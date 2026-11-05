import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, typo } from '@/lib/theme';

/**
 * The title over a shelf or a list: a small icon in a soft accent tile, the title, an optional line under it and
 * an optional link on the right ("See all ›"). One look for every section in the app.
 */
export function SectionHeader({ title, subtitle, icon, tint, right, flush }: { title: string; subtitle?: string; icon?: IconName; tint?: string; right?: ReactNode; flush?: boolean }) {
  return (
    <View style={[styles.row, flush && styles.flush]}>
      {icon ? (
        <View style={[styles.badge, tint ? { backgroundColor: `${tint}33` } : null]}>
          <Icon name={icon} size={17} color={tint ?? colors.accent} strokeWidth={2} />
        </View>
      ) : tint ? (
        <View style={[styles.dot, { backgroundColor: tint }]} />
      ) : null}
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  flush: { paddingHorizontal: 0 },
  badge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  text: { flex: 1, gap: 1 },
  title: { ...typo.section, color: colors.text },
  subtitle: { ...typo.caption, color: colors.muted },
});
