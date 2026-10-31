import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SkeletonText } from '@/components/Skeleton';
import { displayFont } from '@/lib/bookType';
import { cleanWord, define, wiktionaryUrl, type Lookup } from '@/lib/dictionary';
import { colors } from '@/lib/theme';

type Props = { word: string; language: string; onBack: () => void };

/** A dictionary card for one word, with a link to the full Wiktionary entry (French Wiktionary for French books). */
export function DefineCard({ word, language, onBack }: Props) {
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const clean = cleanWord(word);

  useEffect(() => {
    let alive = true;
    define(word, language).then((r) => alive && setLookup(r));
    return () => {
      alive = false;
    };
  }, [word, language]);

  const wiki = () => Linking.openURL(wiktionaryUrl(word, language));
  const say = () => Speech.speak(clean, { language });

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Pressable accessibilityLabel="Back to the passage" onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Pressable accessibilityLabel="Say it" onPress={say} hitSlop={10}>
          <Text style={styles.back}>🔊</Text>
        </Pressable>
      </View>
      <Text style={styles.word}>{lookup?.status === 'found' ? lookup.entry.word : clean}</Text>
      {lookup?.status === 'found' && !!lookup.entry.phonetic && <Text style={styles.phonetic}>{lookup.entry.phonetic}</Text>}

      {!lookup ? (
        <View style={{ marginVertical: 12 }}>
          <SkeletonText lines={4} lineHeight={22} />
        </View>
      ) : lookup.status === 'offline' ? (
        <Text style={styles.muted}>
          The dictionary can&apos;t be reached right now. Check your connection and try again. Words you&apos;ve looked up before still
          work offline.
        </Text>
      ) : lookup.status === 'missing' ? (
        <Text style={styles.muted}>No definition found. It may be a name, an old spelling or a rare form.</Text>
      ) : (
        <ScrollView style={styles.meanings}>
          {lookup.entry.meanings.map((m) => (
            <View key={m.partOfSpeech} style={styles.meaning}>
              <Text style={styles.pos}>{m.partOfSpeech}</Text>
              {m.definitions.map((d, i) => (
                <View key={i} style={styles.def}>
                  <Text style={styles.defText}>
                    {i + 1}. {d.definition}
                  </Text>
                  {!!d.example && <Text style={styles.example}>“{d.example}”</Text>}
                </View>
              ))}
              {m.synonyms.length > 0 && <Text style={styles.syn}>Similar: {m.synonyms.join(', ')}</Text>}
            </View>
          ))}
          {!!lookup.entry.source && <Text style={styles.syn}>Definitions from {lookup.entry.source} (CC BY-SA).</Text>}
        </ScrollView>
      )}

      <Pressable accessibilityLabel="Open in Wiktionary" onPress={wiki} style={styles.wiki}>
        <Text style={styles.wikiText}>{language.startsWith('fr') ? 'Open in the French Wiktionary ↗' : 'Open in Wiktionary ↗'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  back: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  word: { color: colors.text, fontFamily: displayFont, fontSize: 34 },
  phonetic: { color: colors.muted, fontSize: 15, marginTop: -6 },
  muted: { color: colors.muted, lineHeight: 21, marginVertical: 8 },
  meanings: { maxHeight: 340 },
  meaning: { gap: 6, marginBottom: 14 },
  pos: { color: colors.accent, fontStyle: 'italic', fontWeight: '700' },
  def: { gap: 3 },
  defText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  example: { color: colors.muted, fontStyle: 'italic', lineHeight: 20, paddingLeft: 14 },
  syn: { color: colors.muted, fontSize: 13 },
  wiki: { alignSelf: 'flex-start', paddingVertical: 8 },
  wikiText: { color: colors.muted, fontWeight: '700' },
});
