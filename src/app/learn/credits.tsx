import { Stack } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/lib/theme';

const SOURCES = [
  {
    name: 'KanjiVG',
    use: 'Stroke order and shapes for Japanese hiragana, katakana and kanji.',
    licence: 'Copyright © 2009–2024 Ulrich Apel. Creative Commons Attribution-Share Alike 3.0. The stroke file derived from it (kana-strokes.json) is shared under the same licence.',
    url: 'https://kanjivg.tagaini.net',
  },
  {
    name: 'Make Me a Hanzi (via hanzi-writer-data)',
    use: 'Stroke order, outlines and centre lines for Chinese characters, loaded when needed.',
    licence: 'Derived from fonts by Arphic Technology; redistributed under the Arphic Public License.',
    url: 'https://github.com/skishore/makemeahanzi',
  },
  {
    name: 'Hangul strokes',
    use: 'Stroke paths for the 24 basic Korean letters.',
    licence: 'Written for this app.',
    url: '',
  },
  {
    name: 'Cyrillic, Arabic and Devanagari strokes',
    use: 'Stroke paths for the Russian capitals, the 28 Arabic letters and 36 Hindi letters, checked against the printed letter forms.',
    licence: 'Written for this app.',
    url: '',
  },
  {
    name: 'Fluent Emoji 3D (Microsoft), packaged by LobeHub',
    use: 'The 3D pictures of words, scenes and characters, loaded when needed and kept for offline use.',
    licence: 'Copyright © Microsoft Corporation. MIT License.',
    url: 'https://github.com/microsoft/fluentui-emoji',
  },
  {
    name: 'Lessons and vocabulary',
    use: 'Words, phrases, example sentences, grammar notes, role-plays, stories and characters in every course.',
    licence: 'Written for this app.',
    url: '',
  },
];

/** Where the language data comes from, with its licences. */
export default function CreditsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Credits' }} />
      {SOURCES.map((s) => (
        <Text key={s.name} style={styles.block}>
          <Text style={styles.name}>{s.name}</Text>
          {'\n'}
          <Text style={styles.text}>{s.use}</Text>
          {'\n'}
          <Text style={styles.muted}>{s.licence}</Text>
          {!!s.url && (
            <>
              {'\n'}
              <Text style={styles.link} onPress={() => Linking.openURL(s.url)}>
                {s.url}
              </Text>
            </>
          )}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 18, maxWidth: 680, width: '100%', alignSelf: 'center' },
  block: { lineHeight: 22 },
  name: { color: colors.text, fontWeight: '900', fontSize: 16 },
  text: { color: colors.text },
  muted: { color: colors.muted, fontSize: 13 },
  link: { color: colors.accent, fontSize: 13 },
});
