import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Pic } from '@/components/learn/Pic';
import type { Course } from '@/data/learn/courses';
import { colors } from '@/lib/theme';

/** The recurring characters of a course: the same faces come back across role-plays and stories. */
export type Person = { name: string; emoji: string; en: string; fr: string };
const SPANISH: Record<string, Person> = {
  lucia: { name: 'Lucía', emoji: '👩🏽', en: 'your friend in Valencia, a designer', fr: 'votre amie à Valence, designer' },
  mateo: { name: 'Mateo', emoji: '🧔🏽', en: 'runs the café on the corner, loves a joke', fr: 'tient le café du coin, adore plaisanter' },
  pepe: { name: 'Don Pepe', emoji: '👴🏼', en: 'Lucía’s neighbour, knows every street', fr: 'le voisin de Lucía, connaît chaque rue' },
  sofia: { name: 'Sofía', emoji: '👩🏻‍💼', en: 'hotel receptionist, calm and precise', fr: 'réceptionniste d’hôtel, calme et précise' },
  ruiz: { name: 'Dra. Ruiz', emoji: '👩🏽‍⚕️', en: 'the family doctor', fr: 'la médecin de famille' },
  marcos: { name: 'Marcos', emoji: '🧑🏻', en: 'Lucía’s brother, always running late', fr: 'le frère de Lucía, toujours en retard' },
};
/** Who you meet in each scene (by the dialogue or story id's last part). */
const ROLES: Record<string, string[]> = {
  cafe: ['mateo'],
  directions: ['pepe'],
  hotel: ['sofia'],
  doctor: ['ruiz'],
  plans: ['lucia'],
  market: ['lucia', 'mateo'],
  train: ['marcos'],
  garden: ['pepe', 'lucia'],
};
export function castOf(course: Course, id: string): Person[] {
  const cast = course.id === 'es' ? SPANISH : SPANISH;
  const key = id.split('-').pop() ?? '';
  return (ROLES[key] ?? []).map((k) => cast[k]).filter(Boolean);
}

/** A drawn banner for a role-play or story: the place, and the people in it. */
export function SceneBanner({ course, id, icon, title, fr }: { course: Course; id: string; icon: string; title: string; fr: boolean }) {
  const people = castOf(course, id);
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.banner}>
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 50">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={course.color} stopOpacity="0.55" />
            <Stop offset="1" stopColor="#10142A" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="50" fill="url(#sky)" />
        <Circle cx="86" cy="8" r="16" fill="rgba(255,255,255,0.07)" />
        <Rect x="0" y="40" width="100" height="10" fill="rgba(0,0,0,0.25)" />
      </Svg>
      <View style={styles.row}>
        <Animated.View entering={ZoomIn.springify().damping(12)}>
          <Pic emoji={icon} size={74} />
        </Animated.View>
        <View style={styles.flex}>
          <Text style={styles.title}>{title}</Text>
          {people.map((p) => (
            <View key={p.name} style={styles.person}>
              <Pic emoji={p.emoji} size={30} />
              <Text style={styles.personText} numberOfLines={2}>
                <Text style={styles.name}>{p.name}</Text> · {fr ? p.fr : p.en}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 22, overflow: 'hidden', padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 120, justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  flex: { flex: 1, gap: 6 },
  title: { color: '#F2F4FF', fontWeight: '900', fontSize: 18 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  personText: { color: '#D5D9F0', fontSize: 12.5, flex: 1 },
  name: { fontWeight: '900', color: '#F2F4FF' },
  muted: { color: colors.muted },
});
