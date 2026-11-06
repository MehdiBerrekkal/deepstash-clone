import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COURSES, courseById } from '@/data/learn/courses';
import { useUiLang } from '@/lib/i18n';
import { lessonKey } from '@/lib/learn/plan';
import { useCoursePath } from '@/lib/learn/useCourse';
import { localDate, useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';

const SOON: { flag: string; en: string; fr: string }[] = [];
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
  const path = useCoursePath(course);
  const next = path.next ?? (path.flat[0] ? { unit: path.flat[0].unit, lesson: path.flat[0].lesson } : null);
  const start = (unitId?: string, lessonId?: string) => router.push({ pathname: '/learn/session', params: { course: course.id, ...(unitId ? { unit: unitId } : {}), ...(lessonId ? { lesson: lessonId } : {}) } });
  const openMap = () => router.push({ pathname: '/learn/course', params: { course: course.id } });
  const week = Array.from({ length: 7 }, (_, k) => {
    const d = daysAgo(6 - k);
    const key = localDate(d);
    return { label: d.toLocaleDateString(fr ? 'fr' : 'en', { weekday: 'narrow' }), xp: learn?.days?.[key] ?? 0 };
  });
  const maxXp = Math.max(30, ...week.map((d) => d.xp));
  const cans = path.sections.flatMap((s) => s.units).filter((u) => u.lessons.every((l) => units[lessonKey(course, u, l)])).map((u) => u.can[lang]).slice(-8);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(380)}>
        <LinearGradient colors={[`${course.color}55`, '#141A3A', '#0B0E1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.rowBetween}>
            <Text style={styles.heroKicker}>{fr ? 'APPRENDRE UNE LANGUE' : 'LEARN A LANGUAGE'}</Text>
            <View style={styles.badges}>
              {!!path.level && <Text style={[styles.level, { backgroundColor: course.color }]}>{path.level}</Text>}
              <Text style={styles.heroMeta}>🔥 {streak.count}</Text>
            </View>
          </View>
          <Text style={styles.heroFlag}>{course.flag}</Text>
          <Text style={styles.heroTitle}>
            {course.name[lang]} <Text style={styles.heroNative}>{course.native}</Text>
          </Text>
          <View style={styles.heroStats}>
            <Text style={styles.heroStat}>⭐ {learn?.xp ?? 0} XP</Text>
            <Text style={styles.heroStat}>📚 {learned} {fr ? 'mots et signes acquis' : 'words & signs known'}</Text>
            <Text style={styles.heroStat}>
              ✅ {path.doneCount}/{path.flat.length} {fr ? 'leçons' : 'lessons'}
            </Text>
          </View>
          {next && (
            <Pressable accessibilityLabel="Continue learning" onPress={() => start(next.unit.id, next.lesson.id)} style={[styles.heroBtn, { backgroundColor: course.color }]}>
              <Text style={styles.heroBtnText} numberOfLines={1}>
                {next.unit.icon} {fr ? 'Continuer' : 'Continue'} · {next.unit.title[lang]}
                {next.unit.lessons.length > 1 ? ` · ${next.lesson.title[lang]}` : ''}
              </Text>
            </Pressable>
          )}
          <View style={styles.heroLinks}>
            <Pressable accessibilityLabel="Course map" onPress={openMap} style={styles.heroLink}>
              <Text style={styles.heroLinkText}>🗺 {fr ? 'Plan du cours' : 'Course map'}</Text>
            </Pressable>
            {!!path.full && (
              <Pressable accessibilityLabel="Word bank" onPress={() => router.push({ pathname: '/learn/words', params: { course: course.id } })} style={styles.heroLink}>
                <Text style={styles.heroLinkText}>📒 {fr ? 'Mes mots' : 'Word bank'}</Text>
              </Pressable>
            )}
          </View>
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
        {path.sections.map((sec, i) => {
          const keys = sec.units.flatMap((u) => u.lessons.map((l) => lessonKey(course, u, l)));
          const n = keys.filter((k) => units[k]).length;
          const unlocked = path.open[i];
          return (
            <Animated.View key={sec.id} entering={FadeInDown.delay(i * 40).duration(300)}>
              <Pressable accessibilityLabel={`Section ${sec.title.en}`} onPress={openMap} style={[styles.unit, !unlocked && { opacity: 0.5 }, next?.unit.section === sec.id && { borderColor: course.color }]}>
                <View style={[styles.unitIcon, { backgroundColor: n === keys.length && n > 0 ? course.color : colors.surfaceRaised }]}>
                  <Text style={styles.unitIconText}>{unlocked ? (sec.level ?? '🔤') : '🔒'}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.unitTitle}>{sec.title[lang]}</Text>
                  <Text style={styles.muted}>
                    {sec.units.length} {fr ? 'unités' : 'units'} · {n}/{keys.length} {fr ? 'leçons' : 'lessons'}
                  </Text>
                  <View style={styles.miniTrack}>
                    <View style={[styles.miniFill, { width: `${(n / Math.max(1, keys.length)) * 100}%`, backgroundColor: course.color }]} />
                  </View>
                </View>
                <Text style={[styles.chev, { color: course.color }]}>›</Text>
              </Pressable>
            </Animated.View>
          );
        })}
        {path.ready && !path.full && <Text style={styles.muted}>{fr ? 'Niveaux A1 → B1 bientôt disponibles pour ce cours.' : 'Levels A1 → B1 coming soon for this course.'}</Text>}
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
  heroLinks: { flexDirection: 'row', gap: 8 },
  heroLink: { flex: 1, minHeight: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  heroLinkText: { color: '#F2F4FF', fontWeight: '800', fontSize: 14 },
  badges: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  level: { color: '#0B0D14', fontWeight: '900', fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  miniTrack: { height: 5, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden', marginTop: 4 },
  miniFill: { height: 5, borderRadius: 3 },
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
