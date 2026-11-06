import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Pic } from '@/components/learn/Pic';
import type { Course } from '@/data/learn/courses';
import { colors } from '@/lib/theme';

/** The recurring characters of a course: the same faces come back across role-plays and stories. */
export type Person = { name: string; emoji: string; en: string; fr: string };
type Cast = Record<'friend' | 'barista' | 'neighbour' | 'receptionist' | 'doctor' | 'brother', Person>;

const CASTS: Record<string, Cast> = {
  es: {
    friend: { name: 'Lucía', emoji: '👩🏽', en: 'your friend in Valencia, a designer', fr: 'votre amie à Valence, designer' },
    barista: { name: 'Mateo', emoji: '🧔🏽', en: 'runs the café on the corner, loves a joke', fr: 'tient le café du coin, adore plaisanter' },
    neighbour: { name: 'Don Pepe', emoji: '👴🏼', en: 'Lucía’s neighbour, knows every street', fr: 'le voisin de Lucía, connaît chaque rue' },
    receptionist: { name: 'Sofía', emoji: '👩🏻‍💼', en: 'hotel receptionist, calm and precise', fr: 'réceptionniste d’hôtel, calme et précise' },
    doctor: { name: 'Dra. Ruiz', emoji: '👩🏽‍⚕️', en: 'the family doctor', fr: 'la médecin de famille' },
    brother: { name: 'Marcos', emoji: '🧑🏻', en: 'Lucía’s brother, always running late', fr: 'le frère de Lucía, toujours en retard' },
  },
  fr: {
    friend: { name: 'Camille', emoji: '👩🏻', en: 'your friend in Lyon, an architect', fr: 'votre amie à Lyon, architecte' },
    barista: { name: 'Julien', emoji: '🧔🏻', en: 'owns the café on the square, knows everyone', fr: 'tient le café de la place, connaît tout le monde' },
    neighbour: { name: 'Madame Petit', emoji: '👵🏻', en: 'Camille’s neighbour, has lived here sixty years', fr: 'la voisine de Camille, ici depuis soixante ans' },
    receptionist: { name: 'Inès', emoji: '👩🏽‍💼', en: 'hotel receptionist, speaks four languages', fr: 'réceptionniste d’hôtel, parle quatre langues' },
    doctor: { name: 'Dr Martin', emoji: '👨🏻‍⚕️', en: 'the local GP, gentle and thorough', fr: 'le médecin du quartier, doux et minutieux' },
    brother: { name: 'Hugo', emoji: '🧑🏼', en: 'Camille’s brother, a cyclist who is never on time', fr: 'le frère de Camille, cycliste, jamais à l’heure' },
  },
  ja: {
    friend: { name: 'Yui', emoji: '👩🏻', en: 'your friend in Kyoto, a potter', fr: 'votre amie à Kyoto, céramiste' },
    barista: { name: 'Kenji', emoji: '👨🏻‍🍳', en: 'runs a tiny café near the river, bakes every cake himself', fr: 'tient un petit café près de la rivière, fait tous ses gâteaux' },
    neighbour: { name: 'Satō-san', emoji: '👴🏻', en: 'Yui’s neighbour, gardener and walking map', fr: 'le voisin de Yui, jardinier et plan vivant' },
    receptionist: { name: 'Aiko', emoji: '👩🏻‍💼', en: 'hotel receptionist, unfailingly polite', fr: 'réceptionniste d’hôtel, d’une politesse parfaite' },
    doctor: { name: 'Dr Tanaka', emoji: '👨🏻‍⚕️', en: 'the neighbourhood doctor', fr: 'le médecin du quartier' },
    brother: { name: 'Ren', emoji: '🧑🏻', en: 'Yui’s younger brother, a student who oversleeps', fr: 'le petit frère de Yui, étudiant qui dort trop' },
  },
};
/** Who you meet in each scene (by the last part of the dialogue or story id). */
const ROLES: Record<string, (keyof Cast)[]> = {
  cafe: ['barista'],
  directions: ['neighbour'],
  hotel: ['receptionist'],
  doctor: ['doctor'],
  plans: ['friend'],
  market: ['friend', 'barista'],
  train: ['brother'],
  garden: ['neighbour', 'friend'],
};
export function castOf(course: Course, id: string): Person[] {
  const cast = CASTS[course.id];
  if (!cast) return [];
  const key = id.split('-').pop() ?? '';
  return (ROLES[key] ?? []).map((k) => cast[k]);
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
