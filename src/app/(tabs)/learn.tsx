import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COURSES, courseById } from '@/data/learn/courses';
import { useUiLang } from '@/lib/i18n';
import { localDate, useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';

const SOON = [
  { flag: '🇫🇷', en: 'French', fr: 'Français' },
  { flag: '🇬🇧', en: 'English', fr: 'Anglais' },
  { flag: '🇩🇪', en: 'German', fr: 'Allemand' },
  { flag: '🇮🇹', en: 'Italian', fr: 'Italien' },
  { flag: '🇵🇹', en: 'Portuguese', fr: 'Portugais' },
  { flag: '🇸🇦', en: 'Arabic', fr: 'Arabe' },
  { flag: '🇷🇺', en: 'Russian', fr: 'Russe' },
  { flag: '🇹🇷', en: 'Turkish', fr: 'Turc' },
  { flag: '🇮🇳', en: 'Hindi', fr: 'Hindi' },
  { flag: '🇳🇱', en: 'Dutch', fr: 'Néerlandais' },
];
const isDue = (iso: string) => new Date(iso).getTime() <= Date.now();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400e3);

/** Learn a language: pick a course, follow its path of short units, review what's due. */
export default function LearnScreen() {
  const { learn, setLearnCourse, streak } = useStore();
  const lang = useUiLang();
  const fr = lang === 'fr';
  const course = courseById[learn?.course ?? ''] ?? COURSES[0];
  const units = learn?.units ?? {};
  const items = Object.entries(learn?.items ?? {}).filter(([k]) => k.startsWith(`${course.id}:`));
  const learned = items.filter(([, v]) => v.level >= 1).length;
  const due = items.filter(([, v]) => isDue(v.due)).length;
  const nextUnit = course.units.find((u) => !units[u.id]) ?? course.units[course.units.length - 1];
  // A unit opens once the one before it is done (the first two are always open).
  const open = (i: number) => i < 2 || !!units[course.units[i - 1].id];
  const start = (unitId?: string) => router.push({ pathname: '/learn/session', params: { course: course.id, ...(unitId ? { unit: unitId } : {}) } });
  const week = Array.from({ length: 7 }, (_, k) => {
    const d = daysAgo(6 - k);
    const key = localDate(d);
    return { label: d.toLocaleDateString(fr ? 'fr' : 'en', { weekday: 'narrow' }), xp: learn?.days?.[key] ?? 0 };
  });
  const maxXp = Math.max(30, ...week.map((d) => d.xp));
  const cans = course.units.filter((u) => units[u.id]).map((u) => u.can[lang]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(380)}>
        <LinearGradient colors={[`${course.color}55`, '#141A3A', '#0B0E1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.rowBetween}>
            <Text style={styles.heroKicker}>{fr ? 'APPRENDRE UNE LANGUE' : 'LEARN A LANGUAGE'}</Text>
            <Text style={styles.heroMeta}>🔥 {streak.count}</Text>
          </View>
          <Text style={styles.heroFlag}>{course.flag}</Text>
          <Text style={styles.heroTitle}>
            {course.name[lang]} <Text style={styles.heroNative}>{course.native}</Text>
          </Text>
          <View style={styles.heroStats}>
            <Text style={styles.heroStat}>⭐ {learn?.xp ?? 0} XP</Text>
            <Text style={styles.heroStat}>📚 {learned} {fr ? 'acquis' : 'learned'}</Text>
            <Text style={styles.heroStat}>
              ✅ {course.units.filter((u) => units[u.id]).length}/{course.units.length} {fr ? 'unités' : 'units'}
            </Text>
          </View>
          <Pressable accessibilityLabel="Continue learning" onPress={() => start(nextUnit.id)} style={[styles.heroBtn, { backgroundColor: course.color }]}>
            <Text style={styles.heroBtnText}>
              {nextUnit.icon} {units[nextUnit.id] ? (fr ? 'Rejouer' : 'Play again') : fr ? 'Continuer' : 'Continue'} · {nextUnit.title[lang]}
            </Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courses}>
        {COURSES.map((c) => (
          <Pressable key={c.id} accessibilityLabel={`Course ${c.name.en}`} onPress={() => setLearnCourse(c.id)} style={[styles.courseChip, c.id === course.id && { borderColor: c.color, backgroundColor: `${c.color}22` }]}>
            <Text style={styles.courseFlag}>{c.flag}</Text>
            <Text style={styles.courseName}>{c.name[lang]}</Text>
          </Pressable>
        ))}
        {SOON.map((s) => (
          <View key={s.en} style={[styles.courseChip, styles.soon]}>
            <Text style={styles.courseFlag}>{s.flag}</Text>
            <Text style={styles.courseName}>{fr ? s.fr : s.en}</Text>
            <Text style={styles.soonText}>{fr ? 'bientôt' : 'soon'}</Text>
          </View>
        ))}
      </ScrollView>

      {due > 0 && (
        <Pressable accessibilityLabel="Review due" onPress={() => start()} style={[styles.review, { borderColor: course.color }]}>
          <Text style={styles.reviewIcon}>🔁</Text>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{fr ? `${due} à réviser` : `${due} to review`}</Text>
            <Text style={styles.muted}>{fr ? 'Revoyez-les avant de les oublier.' : 'Bring them back before you forget them.'}</Text>
          </View>
          <Text style={[styles.chev, { color: course.color }]}>›</Text>
        </Pressable>
      )}

      <Text style={styles.section}>{fr ? 'Votre parcours' : 'Your path'}</Text>
      <View style={styles.path}>
        {course.units.map((u, i) => {
          const res = units[u.id];
          const unlocked = open(i);
          return (
            <Animated.View key={u.id} entering={FadeInDown.delay(i * 30).duration(300)}>
              <Pressable accessibilityLabel={`Unit ${u.title.en}`} disabled={!unlocked} onPress={() => start(u.id)} style={[styles.unit, !unlocked && { opacity: 0.45 }, u.id === nextUnit.id && { borderColor: course.color }]}>
                <View style={[styles.unitIcon, { backgroundColor: res ? course.color : colors.surfaceRaised }]}>
                  <Text style={[styles.unitIconText, res && { color: '#0B0D14' }]}>{unlocked ? u.icon : '🔒'}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.unitTitle}>{u.title[lang]}</Text>
                  <Text style={styles.muted} numberOfLines={1}>
                    {u.kind === 'script' && u.script !== undefined ? '✍️ ' : u.kind === 'blocks' ? '🧱 ' : u.kind === 'tones' ? '🎵 ' : u.kind === 'phrases' ? '💬 ' : '🗂 '}
                    {u.can[lang]}
                  </Text>
                </View>
                <Text style={[styles.unitStars, { color: course.color }]}>{res ? '★'.repeat(res.stars) + '☆'.repeat(3 - res.stars) : ''}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{fr ? 'Cette semaine' : 'This week'}</Text>
        <View style={styles.bars}>
          {week.map((d, k) => (
            <View key={k} style={styles.barCol}>
              <View style={[styles.bar, { height: 6 + (d.xp / maxXp) * 70, backgroundColor: d.xp ? course.color : colors.surfaceRaised }]} />
              <Text style={styles.barLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {cans.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{fr ? 'Ce que vous savez faire' : 'What you can do'}</Text>
          {cans.map((c) => (
            <Text key={c} style={styles.can}>
              ✓ {c}
            </Text>
          ))}
        </View>
      )}

      <Pressable accessibilityLabel="Credits" onPress={() => router.push('/learn/credits')}>
        <Text style={styles.credits}>{fr ? 'Sources et licences des tracés ›' : 'Stroke data sources and licences ›'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 40, maxWidth: 760, width: '100%', alignSelf: 'center' },
  flex: { flex: 1, gap: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hero: { borderRadius: 26, padding: 20, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  heroKicker: { color: '#AEB5DA', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  heroMeta: { color: '#FFB547', fontWeight: '900' },
  heroFlag: { fontSize: 44 },
  heroTitle: { color: '#F2F4FF', fontSize: 30, fontWeight: '900', fontFamily: serif },
  heroNative: { color: '#AEB5DA', fontSize: 20, fontWeight: '600' },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  heroStat: { color: '#D5D9F0', fontWeight: '800', fontSize: 13 },
  heroBtn: { marginTop: 8, minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  heroBtnText: { color: '#0B0D14', fontWeight: '900', fontSize: 15 },
  courses: { gap: 8, paddingVertical: 2 },
  courseChip: { width: 92, paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', gap: 2 },
  courseFlag: { fontSize: 26 },
  courseName: { color: colors.text, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  soon: { opacity: 0.5 },
  soonText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  review: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 18, borderWidth: 2, backgroundColor: colors.surface },
  reviewIcon: { fontSize: 26 },
  chev: { fontSize: 30, fontWeight: '300' },
  section: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 4 },
  path: { gap: 10 },
  unit: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.surface, minHeight: 68 },
  unitIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  unitIconText: { color: colors.text, fontSize: 22, fontWeight: '800' },
  unitTitle: { color: colors.text, fontWeight: '900', fontSize: 15 },
  unitStars: { fontSize: 14, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 13 },
  card: { padding: 16, borderRadius: 20, backgroundColor: colors.surface, gap: 10 },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  bars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 96 },
  barCol: { alignItems: 'center', gap: 4, flex: 1 },
  bar: { width: 18, borderRadius: 6 },
  barLabel: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  can: { color: colors.text, lineHeight: 22 },
  credits: { color: colors.muted, fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', paddingVertical: 8 },
});
