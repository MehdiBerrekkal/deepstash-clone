import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { VoicePicker } from '@/components/VoicePicker';
import { usePalette } from '@/lib/appearance';
import { BOOK_THEMES, READER_FONTS } from '@/lib/bookType';
import { voiceForLanguage, voiceSetting } from '@/lib/lang';
import { isNatural } from '@/lib/neuralVoice';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** You → Voices: the default English and French reading voices, used for books, idea cards and quizzes. */
export default function VoicesScreen() {
  const { readerSettings, setReaderSettings } = useStore();
  const p = usePalette();
  // The picker draws with a book theme; build one from the app's colours.
  const theme = { ...BOOK_THEMES.light, paper: p.surface, ink: p.text, soft: p.muted, rule: p.border };
  const font = READER_FONTS.sans;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Voices' }} />
      <Text style={styles.intro}>
        Pick the voice that reads to you in each language. French books, cards and quiz questions use your French voice; English ones use your
        English voice. You can also change them from any book.
      </Text>
      <VoicePicker
        theme={theme}
        fontRegular={font.regular}
        fontBold={font.bold}
        language="en"
        title={false}
        inline
        selectedFor={(lang) => voiceForLanguage(readerSettings, lang)}
        onSelect={(v, lang) => setReaderSettings({ ...voiceSetting(lang, v), ...(isNatural(v) ? { naturalOff: false } : {}) })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 48, maxWidth: 680, width: '100%', alignSelf: 'center' },
  intro: { color: colors.muted, lineHeight: 21 },
});
