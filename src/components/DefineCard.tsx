import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SkeletonText } from '@/components/Skeleton';
import { displayFont } from '@/lib/bookType';
import { cleanWord, define, wiktionaryUrl, type Lookup } from '@/lib/dictionary';
import { useUiLang } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { TRANSLATE_TO, saveTarget, savedTarget, translateWord, type TargetLang, type TranslationLookup } from '@/lib/translate';

type Props = {
  word: string;
  language: string;
  /** Shows "‹ Back" (from the passage) when given, "Close" with onClose. */
  onBack?: () => void;
  onClose?: () => void;
};

/**
 * A card for one word: its translation (into the language the reader picks) and its dictionary definitions, with a
 * link to the full Wiktionary entry (French Wiktionary for French books).
 */
export function DefineCard({ word, language, onBack, onClose }: Props) {
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
        {onBack ? (
          <Pressable accessibilityLabel="Back to the passage" onPress={onBack} hitSlop={10}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityLabel="Close" onPress={onClose} hitSlop={10}>
            <Text style={styles.back}>Close</Text>
          </Pressable>
        )}
        <Pressable accessibilityLabel="Say it" onPress={say} hitSlop={10}>
          <Text style={styles.back}>🔊</Text>
        </Pressable>
      </View>
      <Text style={styles.word}>{lookup?.status === 'found' ? lookup.entry.word : clean}</Text>
      {lookup?.status === 'found' && !!lookup.entry.phonetic && <Text style={styles.phonetic}>{lookup.entry.phonetic}</Text>}

      <TranslationBox word={word} language={language} />

      <Text style={styles.section}>Meaning</Text>
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

/** The word's translation, with chips to pick the language (remembered for next time). */
function TranslationBox({ word, language }: { word: string; language: string }) {
  const ui = useUiLang();
  const [target, setTarget] = useState<TargetLang | null>(null);
  const [answer, setAnswer] = useState<{ key: string; lookup: TranslationLookup } | null>(null);
  const source = language.slice(0, 2);
  const key = `${word}>${target}`;
  const result = answer?.key === key ? answer.lookup : null;

  useEffect(() => {
    savedTarget(language, ui).then(setTarget);
  }, [language, ui]);

  useEffect(() => {
    if (!target || target === source) return;
    let alive = true;
    translateWord(word, language, target).then((lookup) => alive && setAnswer({ key: `${word}>${target}`, lookup }));
    return () => {
      alive = false;
    };
  }, [word, language, target, source]);

  const pick = (lang: TargetLang) => {
    setTarget(lang);
    saveTarget(lang);
  };

  return (
    <View style={styles.translation}>
      <View style={styles.chips}>
        {TRANSLATE_TO.filter((l) => l.code !== source).map((l) => (
          <Pressable
            key={l.code}
            accessibilityLabel={`Translate into ${l.label}`}
            onPress={() => pick(l.code)}
            style={[styles.chip, target === l.code && styles.chipOn]}>
            <Text style={[styles.chipText, target === l.code && styles.chipTextOn]}>{l.label}</Text>
          </Pressable>
        ))}
      </View>
      {!target || target === source ? null : !result ? (
        <SkeletonText lines={1} lineHeight={26} />
      ) : result.status === 'offline' ? (
        <Text style={styles.muted}>The translation can&apos;t be reached right now. Check your connection.</Text>
      ) : result.status === 'missing' ? (
        <Text style={styles.muted}>No translation found.</Text>
      ) : (
        <View style={{ gap: 4 }}>
          <Text style={[styles.translated, target === 'ar' && styles.rtl]}>{result.entry.main}</Text>
          {result.entry.senses.map((s) =>
            s.terms.length ? (
              <Text key={s.partOfSpeech} style={[styles.alt, target === 'ar' && styles.rtl]}>
                <Text style={styles.pos}>{s.partOfSpeech}</Text> {s.terms.join(', ')}
              </Text>
            ) : null,
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 },
  translation: { gap: 8, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  chipTextOn: { color: colors.onAccent },
  translated: { color: colors.text, fontFamily: displayFont, fontSize: 26 },
  alt: { color: colors.text, fontSize: 14, lineHeight: 20 },
  rtl: { writingDirection: 'rtl', textAlign: 'right' },
  card: { gap: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  back: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  word: { color: colors.text, fontFamily: displayFont, fontSize: 34 },
  phonetic: { color: colors.muted, fontSize: 15, marginTop: -6 },
  muted: { color: colors.muted, lineHeight: 21, marginVertical: 8 },
  meanings: { maxHeight: 280 },
  meaning: { gap: 6, marginBottom: 14 },
  pos: { color: colors.accent, fontStyle: 'italic', fontWeight: '700' },
  def: { gap: 3 },
  defText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  example: { color: colors.muted, fontStyle: 'italic', lineHeight: 20, paddingLeft: 14 },
  syn: { color: colors.muted, fontSize: 13 },
  wiki: { alignSelf: 'flex-start', paddingVertical: 8 },
  wikiText: { color: colors.muted, fontWeight: '700' },
});
