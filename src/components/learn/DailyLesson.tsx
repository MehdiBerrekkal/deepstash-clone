import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pic } from '@/components/learn/Pic';
import { COURSES, courseById } from '@/data/learn/courses';
import { useUiLang } from '@/lib/i18n';
import { useCoursePath } from '@/lib/learn/useCourse';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Today's language lesson: the next one in your course, one tap away (or an invitation if you haven't started). */
export function DailyLesson({ delay = 220 }: { delay?: number }) {
  const { learn } = useStore();
  const lang = useUiLang();
  const fr = lang === 'fr';
  const started = !!learn?.course;
  const course = courseById[learn?.course ?? ''] ?? COURSES[0];
  const path = useCoursePath(course);
  const next = path.next;
  const xpToday = learn?.days?.[localDate()] ?? 0;
  const open = () =>
    started && next ? router.push({ pathname: '/learn/session', params: { course: course.id, unit: next.unit.id, lesson: next.lesson.id } }) : router.push('/learn');
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)}>
      <Pressable accessibilityLabel="Today's language lesson" onPress={open} style={[styles.strip, xpToday > 0 && styles.done]}>
        {started ? <Pic emoji={next?.unit.icon ?? '🎓'} size={40} /> : <Pic emoji="🌍" size={40} />}
        <View style={styles.flex}>
          <Text style={styles.kicker}>
            {started ? `${course.flag} ${fr ? 'LEÇON DU JOUR' : 'TODAY’S LESSON'}${path.level ? ` · ${path.level}` : ''}` : fr ? 'APPRENDRE UNE LANGUE' : 'LEARN A LANGUAGE'}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {started && next ? `${next.unit.title[lang]}${next.unit.lessons.length > 1 ? ` · ${next.lesson.title[lang]}` : ''}` : fr ? '14 langues, 5 minutes par jour' : '14 languages, 5 minutes a day'}
          </Text>
          {started && (
            <Text style={styles.sub} numberOfLines={1}>
              {xpToday > 0 ? `✓ ${fr ? 'Fait aujourd’hui' : 'Done today'} · +${xpToday} XP` : `${path.known} ${fr ? 'mots acquis' : 'words known'}`}
            </Text>
          )}
        </View>
        <Text style={styles.go}>{xpToday > 0 ? '›' : fr ? 'Go' : 'Go'}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)' },
  done: { borderColor: 'rgba(61,220,151,0.5)' },
  flex: { flex: 1, gap: 1 },
  kicker: { color: colors.accent, fontSize: 10.5, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontWeight: '800', fontSize: 15 },
  sub: { color: colors.muted, fontSize: 12 },
  go: { color: colors.onAccent, backgroundColor: colors.accent, fontWeight: '900', fontSize: 14, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, overflow: 'hidden' },
});
