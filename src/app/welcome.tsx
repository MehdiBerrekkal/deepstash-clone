import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Audience } from '@/lib/audience';
import { useT } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const CHOICES: { id: Audience; emoji: string; title: string; ages: string; text: string; color: string }[] = [
  { id: 'kid', emoji: '🧒', title: 'A kid', ages: '6 to 12 years old', text: 'Fun facts, children’s classics, kids’ quizzes and games that start easy.', color: '#3DDC97' },
  { id: 'adult', emoji: '🧑', title: 'An adult', ages: '13 and older', text: 'Book ideas, great literature, poems and the full brain training.', color: '#7C8CFF' },
];

/** The very first screen: kid or adult. Everything in the app adapts to the answer; it can be changed later in You. */
export default function WelcomeScreen() {
  const { audience, setAudience, followedTopicIds } = useStore();
  const t = useT();
  const choose = (a: Audience) => {
    setAudience(a);
    // Topics follow the choice; first-time users pick theirs next.
    router.replace(followedTopicIds.length && a === audience ? '/' : '/onboarding');
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.Text entering={FadeInDown.duration(400)} style={styles.logo}>
          DeepStach
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(80).duration(400)} style={styles.title}>
          {t('Who is using the app?')}
        </Animated.Text>
        <Text style={styles.subtitle}>{t('Books, cards, games and tests adapt to your answer. You can change it any time in You.')}</Text>
        {CHOICES.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.delay(160 + i * 90).duration(400)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={c.title}
              onPress={() => choose(c.id)}
              style={({ pressed }) => [styles.card, { borderColor: c.color }, audience === c.id && { backgroundColor: `${c.color}1F` }, pressed && styles.pressed]}>
              <Text style={styles.emoji}>{c.emoji}</Text>
              <View style={styles.flex}>
                <Text style={[styles.cardTitle, { color: c.color }]}>{t(c.title)}</Text>
                <Text style={styles.ages}>{t(c.ages)}</Text>
                <Text style={styles.cardText}>{t(c.text)}</Text>
              </View>
              <Text style={[styles.chev, { color: c.color }]}>›</Text>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 16, maxWidth: 560, width: '100%', alignSelf: 'center', flexGrow: 1, justifyContent: 'center' },
  logo: { color: colors.accent, fontSize: 14, fontWeight: '900', letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 22, borderWidth: 2, backgroundColor: colors.surface },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  emoji: { fontSize: 46 },
  flex: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 22, fontWeight: '900' },
  ages: { color: colors.text, fontWeight: '700' },
  cardText: { color: colors.muted, lineHeight: 20 },
  chev: { fontSize: 30, fontWeight: '300' },
});
