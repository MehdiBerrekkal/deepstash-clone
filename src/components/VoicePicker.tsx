import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { displayFont, type BookTheme } from '@/lib/bookType';
import { speakOnce, voicesFor, type ListenVoice } from '@/lib/listen';

const SAMPLE = {
  en: 'It was a bright cold day in April, and I had a book in my hands and nowhere else to be.',
  fr: "C'était une belle journée d'avril, avec un livre entre les mains et nulle part où aller.",
};
const IOS_VOICES_HELP = 'https://support.apple.com/guide/iphone/hear-iphone-speak-the-screen-iph96b214f0/ios';
const BADGE_COLORS = { Premium: '#B5862F', Natural: '#3E8A5A', Enhanced: '#4F86C6' };

type Props = {
  theme: BookTheme;
  fontRegular: string;
  fontBold: string;
  language: string;
  /** The chosen voice id, or undefined for "best available". */
  selected?: string;
  onSelect: (id: string | undefined) => void;
};

/** The voice list for Listen mode: most natural first, with quality badges and a preview for each. */
export function VoicePicker({ theme, fontRegular, fontBold, language, selected, onSelect }: Props) {
  const [voices, setVoices] = useState<ListenVoice[] | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const sample = language.startsWith('fr') ? SAMPLE.fr : SAMPLE.en;
  const iPhone = Platform.OS === 'ios' || (Platform.OS === 'web' && /iPhone|iPad/.test(globalThis.navigator?.userAgent ?? ''));

  useEffect(() => {
    let alive = true;
    voicesFor(language).then((v) => alive && setVoices(v));
    return () => {
      alive = false;
    };
  }, [language]);

  const preview = (id: string | undefined, key: string) => {
    setPreviewing(key);
    speakOnce(sample, () => setPreviewing((p) => (p === key ? null : p)), language, id ?? voices?.[0]?.id);
  };

  const rows: (ListenVoice & { key: string; auto?: boolean })[] = [
    { key: 'auto', id: '', name: voices?.[0] ? `Best available (${voices[0].name})` : 'Best available', language, auto: true },
    ...(voices ?? []).map((v) => ({ ...v, key: v.id })),
  ];
  const natural = (voices ?? []).some((v) => v.badge);

  return (
    <>
      <Text style={[styles.title, { color: theme.ink, fontFamily: displayFont }]}>Voice</Text>
      <ScrollView style={{ maxHeight: 360 }}>
        {rows.map((v) => {
          const on = v.auto ? !selected : selected === v.id;
          return (
            <View key={v.key} style={[styles.row, { borderColor: theme.rule }]}>
              <Pressable
                accessibilityLabel={`Use voice ${v.name}`}
                onPress={() => onSelect(v.auto ? undefined : v.id)}
                style={styles.choose}>
                <Text style={{ color: theme.ink, fontFamily: on ? fontBold : fontRegular, fontSize: 16 }} numberOfLines={1}>
                  {on ? '✓ ' : ''}
                  {v.name}
                </Text>
                <View style={styles.meta}>
                  {v.badge && (
                    <Text style={[styles.badge, { backgroundColor: BADGE_COLORS[v.badge] }]}>{v.badge.toUpperCase()}</Text>
                  )}
                  <Text style={{ color: theme.soft, fontSize: 12 }}>{v.auto ? 'Picked for you' : v.language}</Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityLabel={`Preview ${v.name}`}
                onPress={() => preview(v.auto ? undefined : v.id, v.key)}
                hitSlop={8}
                style={[styles.preview, { borderColor: theme.rule }]}>
                <Text style={{ color: theme.ink, fontSize: 12, fontWeight: '700' }}>{previewing === v.key ? '…' : '▶ Preview'}</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      {voices && !natural && (
        <Text style={[styles.hint, { color: theme.soft }]}>
          {iPhone
            ? 'For a much more human voice, download a free Premium voice on your iPhone: Settings → Accessibility → Spoken Content → Voices → English (or French), then pick one marked Premium, like Ava or Zoe. Then reopen the book.'
            : "For a more human voice, install a higher-quality voice in your device's text-to-speech settings."}
        </Text>
      )}
      {iPhone && (
        <Pressable onPress={() => Linking.openURL(IOS_VOICES_HELP)}>
          <Text style={[styles.hint, { color: theme.ink, textDecorationLine: 'underline' }]}>How to add voices on iPhone ↗</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  choose: { flex: 1, gap: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  preview: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  hint: { fontSize: 13, lineHeight: 19 },
});
