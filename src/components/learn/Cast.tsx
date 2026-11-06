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
  ko: {
    friend: { name: 'Jimin', emoji: '👩🏻', en: 'your friend in Seoul, a webtoon artist', fr: 'votre amie à Séoul, dessinatrice de webtoons' },
    barista: { name: 'Minsu', emoji: '🧑🏻‍🍳', en: 'runs a café in Mangwon, roasts his own beans', fr: 'tient un café à Mangwon, torréfie lui-même' },
    neighbour: { name: 'Grandpa Park', emoji: '👴🏻', en: 'Jimin’s neighbour, knows every alley', fr: 'le voisin de Jimin, connaît chaque ruelle' },
    receptionist: { name: 'Sua', emoji: '👩🏻‍💼', en: 'hotel receptionist, quick and cheerful', fr: 'réceptionniste d’hôtel, vive et joyeuse' },
    doctor: { name: 'Dr Kim', emoji: '👩🏻‍⚕️', en: 'the neighbourhood doctor', fr: 'la médecin du quartier' },
    brother: { name: 'Junho', emoji: '🧑🏻', en: 'Jimin’s younger brother, always in a rush', fr: 'le petit frère de Jimin, toujours pressé' },
  },
  de: {
    friend: { name: 'Lena', emoji: '👩🏼', en: 'your friend in Berlin, a sound engineer', fr: 'votre amie à Berlin, ingénieure du son' },
    barista: { name: 'Jonas', emoji: '🧔🏼', en: 'runs a café in Kreuzberg, bakes on Sundays', fr: 'tient un café à Kreuzberg, pâtisse le dimanche' },
    neighbour: { name: 'Herr Weber', emoji: '👴🏼', en: 'Lena’s neighbour, retired tram driver', fr: 'le voisin de Lena, conducteur de tram retraité' },
    receptionist: { name: 'Anna', emoji: '👩🏼‍💼', en: 'hotel receptionist, precise and warm', fr: 'réceptionniste d’hôtel, précise et chaleureuse' },
    doctor: { name: 'Dr Schmidt', emoji: '👩🏼‍⚕️', en: 'the family doctor', fr: 'la médecin de famille' },
    brother: { name: 'Felix', emoji: '🧑🏼', en: 'Lena’s brother, a cyclist who is always late', fr: 'le frère de Lena, cycliste toujours en retard' },
  },
  zh: {
    friend: { name: 'Xiaomei', emoji: '👩🏻', en: 'your friend in Hangzhou, a tea-shop designer', fr: 'votre amie à Hangzhou, designer de boutiques de thé' },
    barista: { name: 'Ah Ming', emoji: '🧑🏻‍🍳', en: 'runs a café by West Lake, loves puns', fr: 'tient un café près du lac de l’Ouest, adore les jeux de mots' },
    neighbour: { name: 'Grandpa Wang', emoji: '👴🏻', en: 'Xiaomei’s neighbour, does tai chi at dawn', fr: 'le voisin de Xiaomei, fait du tai-chi à l’aube' },
    receptionist: { name: 'Lin', emoji: '👩🏻‍💼', en: 'hotel receptionist, patient with beginners', fr: 'réceptionniste d’hôtel, patiente avec les débutants' },
    doctor: { name: 'Dr Zhang', emoji: '👨🏻‍⚕️', en: 'the neighbourhood doctor', fr: 'le médecin du quartier' },
    brother: { name: 'Xiaolong', emoji: '🧑🏻', en: 'Xiaomei’s brother, a student who oversleeps', fr: 'le frère de Xiaomei, étudiant qui dort trop' },
  },
  it: {
    friend: { name: 'Giulia', emoji: '👩🏻', en: 'your friend in Bologna, a restorer of old frescoes', fr: 'votre amie à Bologne, restauratrice de fresques' },
    barista: { name: 'Marco', emoji: '🧔🏻', en: 'runs the bar on the piazza, opinions on everything', fr: 'tient le bar de la place, un avis sur tout' },
    neighbour: { name: 'Signora Bianchi', emoji: '👵🏻', en: 'Giulia’s neighbour, knows every shortcut', fr: 'la voisine de Giulia, connaît tous les raccourcis' },
    receptionist: { name: 'Chiara', emoji: '👩🏻‍💼', en: 'hotel receptionist, warm and efficient', fr: 'réceptionniste d’hôtel, chaleureuse et efficace' },
    doctor: { name: 'Dottor Ferri', emoji: '👨🏻‍⚕️', en: 'the family doctor', fr: 'le médecin de famille' },
    brother: { name: 'Luca', emoji: '🧑🏻', en: 'Giulia’s brother, always late, always cheerful', fr: 'le frère de Giulia, toujours en retard, toujours gai' },
  },
  pt: {
    friend: { name: 'Ana', emoji: '👩🏾', en: 'your friend in Salvador, a dance teacher', fr: 'votre amie à Salvador, professeure de danse' },
    barista: { name: 'Rafael', emoji: '🧔🏾', en: 'runs the café by the beach, never stops smiling', fr: 'tient le café de la plage, toujours souriant' },
    neighbour: { name: 'Dona Cida', emoji: '👵🏾', en: 'Ana’s neighbour, the heart of the building', fr: 'la voisine d’Ana, le cœur de l’immeuble' },
    receptionist: { name: 'Beatriz', emoji: '👩🏾‍💼', en: 'hotel receptionist, quick and friendly', fr: 'réceptionniste d’hôtel, vive et sympathique' },
    doctor: { name: 'Dra. Souza', emoji: '👩🏾‍⚕️', en: 'the family doctor', fr: 'la médecin de famille' },
    brother: { name: 'Pedro', emoji: '🧑🏾', en: 'Ana’s brother, a surfer who loses track of time', fr: 'le frère d’Ana, surfeur qui oublie l’heure' },
  },
  en: {
    friend: { name: 'Emma', emoji: '👩🏼', en: 'your friend in Bristol, a podcast producer', fr: 'votre amie à Bristol, productrice de podcasts' },
    barista: { name: 'Sam', emoji: '🧔🏾', en: 'runs a café by the harbour, bakes the muffins himself', fr: 'tient un café près du port, fait lui-même ses muffins' },
    neighbour: { name: 'Mrs Patel', emoji: '👵🏽', en: 'Emma’s neighbour, knows everyone on the street', fr: 'la voisine d’Emma, connaît toute la rue' },
    receptionist: { name: 'Olivia', emoji: '👩🏻‍💼', en: 'hotel receptionist, unflappable', fr: 'réceptionniste d’hôtel, imperturbable' },
    doctor: { name: 'Dr Hughes', emoji: '👨🏻‍⚕️', en: 'the local GP', fr: 'le médecin généraliste du quartier' },
    brother: { name: 'Jack', emoji: '🧑🏼', en: 'Emma’s brother, a cyclist who is always late', fr: 'le frère d’Emma, cycliste toujours en retard' },
  },
  ru: {
    friend: { name: 'Masha', emoji: '👩🏼', en: 'your friend in St Petersburg, a museum guide', fr: 'votre amie à Saint-Pétersbourg, guide de musée' },
    barista: { name: 'Sasha', emoji: '🧔🏼', en: 'runs a café near the canal, bakes pirozhki', fr: 'tient un café près du canal, fait des pirojki' },
    neighbour: { name: 'Anna Petrovna', emoji: '👵🏼', en: 'Masha’s neighbour, has a dacha and an opinion', fr: 'la voisine de Macha, a une datcha et un avis sur tout' },
    receptionist: { name: 'Olga', emoji: '👩🏼‍💼', en: 'hotel receptionist, calm and precise', fr: 'réceptionniste d’hôtel, calme et précise' },
    doctor: { name: 'Dr Volkov', emoji: '👨🏼‍⚕️', en: 'the district doctor', fr: 'le médecin du quartier' },
    brother: { name: 'Dima', emoji: '🧑🏼', en: 'Masha’s brother, a student who oversleeps', fr: 'le frère de Macha, étudiant qui dort trop' },
  },
  ar: {
    friend: { name: 'Layla', emoji: '👩🏾', en: 'your friend in Amman, an architect', fr: 'votre amie à Amman, architecte' },
    barista: { name: 'Karim', emoji: '🧔🏾', en: 'runs a café in the old town, makes the best mint tea', fr: 'tient un café dans la vieille ville, fait le meilleur thé à la menthe' },
    neighbour: { name: 'Abu Samir', emoji: '👴🏾', en: 'Layla’s neighbour, generous with advice and figs', fr: 'le voisin de Layla, généreux en conseils et en figues' },
    receptionist: { name: 'Nour', emoji: '👩🏾‍💼', en: 'hotel receptionist, warm and quick', fr: 'réceptionniste d’hôtel, chaleureuse et rapide' },
    doctor: { name: 'Dr Haddad', emoji: '👨🏾‍⚕️', en: 'the family doctor', fr: 'le médecin de famille' },
    brother: { name: 'Omar', emoji: '🧑🏾', en: 'Layla’s brother, a student always in a rush', fr: 'le frère de Layla, étudiant toujours pressé' },
  },
  tr: {
    friend: { name: 'Elif', emoji: '👩🏼', en: 'your friend in Istanbul, a photographer', fr: 'votre amie à Istanbul, photographe' },
    barista: { name: 'Mehmet', emoji: '🧔🏼', en: 'runs a café by the Bosphorus, never stops pouring tea', fr: 'tient un café au bord du Bosphore, sert du thé sans arrêt' },
    neighbour: { name: 'Ayşe Teyze', emoji: '👵🏼', en: 'Elif’s neighbour, the building’s grandmother', fr: 'la voisine d’Elif, la grand-mère de l’immeuble' },
    receptionist: { name: 'Zeynep', emoji: '👩🏼‍💼', en: 'hotel receptionist, kind and efficient', fr: 'réceptionniste d’hôtel, gentille et efficace' },
    doctor: { name: 'Dr Yılmaz', emoji: '👨🏼‍⚕️', en: 'the neighbourhood doctor', fr: 'le médecin du quartier' },
    brother: { name: 'Can', emoji: '🧑🏼', en: 'Elif’s brother, a student who misses ferries', fr: 'le frère d’Elif, étudiant qui rate les ferries' },
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
