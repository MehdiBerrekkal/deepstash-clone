import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors } from '@/lib/theme';

/** The heading inside a settings card: icon tile, title, and an optional "Open ›" style link on the right. */
export function CardHeading({ icon, title, link, tint }: { icon: IconName; title: string; link?: string; tint?: string }) {
  return (
    <View style={styles.row}>
      <View style={[styles.badge, tint ? { backgroundColor: `${tint}26` } : null]}>
        <Icon name={icon} size={17} color={tint ?? colors.accent} strokeWidth={2} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {link !== undefined && (
        <View style={styles.link}>
          {!!link && <Text style={styles.linkText}>{link}</Text>}
          <Icon name="chevronRight" size={16} color={colors.accent} strokeWidth={2.4} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  title: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  linkText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
});
