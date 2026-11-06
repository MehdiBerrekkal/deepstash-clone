import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { courseById } from '@/data/learn/courses';
import { useUiLang } from '@/lib/i18n';
import { lessonKey, type PlanUnit } from '@/lib/learn/plan';
import { useCoursePath } from '@/lib/learn/useCourse';
import { colors, serif } from '@/lib/theme';

const TYPE_ICON: Record<PlanUnit['type'], string> = { basics: '🔤', topic: '🗂', grammar: '📐', dialogue: '💬', story: '📖', checkpoint: '🏁' };

/** The whole course as a map: levels, their units and lessons, what's done and what's locked. */
export default function CourseMapScreen() {
  const { course: courseId } = useLocalSearchParams<{ course: string }>();
  const course = courseById[courseId] ?? courseById.es;
  const lang = useUiLang();
  const fr = lang === 'fr';
  const path = useCoursePath(course);
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const shown = openUnit ?? path.next?.unit.id ?? null;
  const start = (u: PlanUnit, lessonId: string) => router.push({ pathname: '/learn/session', params: { course: course.id, unit: u.id, lesson: lessonId } });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: course.name[lang] }} />
      <View style={styles.head}>
        <Text style={styles.flag}>{course.flag}</Text>
        <View style={styles.flex}>
          <Text style={styles.title}>{course.name[lang]}</Text>
          <Text style={styles.muted}>
            {path.doneCount}/{path.flat.length} {fr ? 'leçons' : 'lessons'} · {path.known} {fr ? 'mots acquis' : 'words known'}
          </Text>
        </View>
        {!!path.level && <Text style={[styles.badge, { backgroundColor: course.color }]}>{path.level}</Text>}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(path.doneCount / Math.max(1, path.flat.length)) * 100}%`, backgroundColor: course.color }]} />
      </View>
      {!path.ready && <ActivityIndicator color={course.color} />}

      {path.sections.map((s, si) => {
        const unlocked = path.open[si];
        const lessons = s.units.flatMap((u) => u.lessons.map((l) => lessonKey(course, u, l)));
        const doneHere = lessons.filter((k) => path.done(k) > 0).length;
        return (
          <View key={s.id} style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>
                {unlocked ? '' : '🔒 '}
                {s.title[lang]}
              </Text>
              <Text style={styles.muted}>
                {doneHere}/{lessons.length}
              </Text>
            </View>
            {!unlocked && <Text style={styles.muted}>{fr ? 'Réussissez la validation du niveau précédent (2 étoiles) pour ouvrir ce niveau.' : 'Pass the previous level’s checkpoint (2 stars) to open this level.'}</Text>}
            {s.units.map((u, ui) => {
              const keys = u.lessons.map((l) => lessonKey(course, u, l));
              const n = keys.filter((k) => path.done(k) > 0).length;
              const complete = n === keys.length;
              const isNext = path.next?.unit.id === u.id;
              const expanded = shown === u.id && unlocked;
              return (
                <Animated.View key={u.id} entering={FadeInDown.delay(Math.min(ui, 12) * 25).duration(260)}>
                  <Pressable
                    accessibilityLabel={`Unit ${u.title.en}`}
                    disabled={!unlocked}
                    onPress={() => (u.lessons.length === 1 ? start(u, u.lessons[0].id) : setOpenUnit(expanded ? '' : u.id))}
                    style={[styles.unit, !unlocked && { opacity: 0.45 }, isNext && { borderColor: course.color }, u.type === 'checkpoint' && styles.check]}>
                    <View style={[styles.unitIcon, { backgroundColor: complete ? course.color : colors.surfaceRaised }]}>
                      <Text style={styles.unitIconText}>{u.icon}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.unitTitle}>{u.title[lang]}</Text>
                      <Text style={styles.muted} numberOfLines={1}>
                        {TYPE_ICON[u.type]} {u.can[lang]}
                      </Text>
                    </View>
                    <Text style={[styles.count, { color: complete ? course.color : colors.muted }]}>{complete ? '✓' : `${n}/${keys.length}`}</Text>
                  </Pressable>
                  {expanded && u.lessons.length > 1 && (
                    <View style={styles.lessons}>
                      {u.lessons.map((l, li) => {
                        const st = path.done(keys[li]);
                        return (
                          <Pressable key={l.id} accessibilityLabel={`Lesson ${l.title.en}`} onPress={() => start(u, l.id)} style={[styles.lesson, st > 0 && { borderColor: `${course.color}88` }]}>
                            <Text style={[styles.lessonDot, { color: st ? course.color : colors.muted }]}>{st ? '●' : '○'}</Text>
                            <Text style={styles.lessonTitle}>{l.title[lang]}</Text>
                            <Text style={[styles.stars, { color: course.color }]}>{st ? '★'.repeat(st) : ''}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        );
      })}
      {path.ready && !path.full && <Text style={styles.muted}>{fr ? 'Les niveaux A1 → B1 de ce cours arrivent bientôt. Les bases sont déjà là.' : 'Levels A1 → B1 for this course are on the way. The basics are ready now.'}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12, paddingBottom: 48, maxWidth: 760, width: '100%', alignSelf: 'center' },
  flex: { flex: 1, gap: 2 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flag: { fontSize: 40 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', fontFamily: serif },
  badge: { color: '#0B0D14', fontWeight: '900', fontSize: 15, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  section: { gap: 8, marginTop: 8 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  unit: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.surface, minHeight: 66 },
  check: { borderStyle: 'dashed', borderColor: colors.border },
  unitIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  unitIconText: { fontSize: 20 },
  unitTitle: { color: colors.text, fontWeight: '900', fontSize: 15 },
  count: { fontWeight: '900', fontSize: 13, minWidth: 30, textAlign: 'right' },
  lessons: { gap: 6, paddingLeft: 28, paddingTop: 6 },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 46, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  lessonDot: { fontSize: 14 },
  lessonTitle: { color: colors.text, fontWeight: '800', flex: 1 },
  stars: { fontSize: 12, fontWeight: '900' },
});
