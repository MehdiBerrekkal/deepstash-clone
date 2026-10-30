import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { displayFont, type BookTheme } from '@/lib/bookType';
import { speakOnce, voicesFor, type ListenVoice } from '@/lib/listen';
import {
  NATURAL_PREFIX, loadNatural, naturalDownloaded, naturalVoicesFor, playClip, synthesize, unlockAudio,
} from '@/lib/neuralVoice';

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
  /** Offer the on-device natural voices (web, English and French books). */
  natural?: boolean;
  /** The natural voice reading now (chosen, or picked automatically), if any. */
  naturalActive?: string | null;
};

/** The voice list for Listen mode: most natural first, with quality badges and a preview for each. */
export function VoicePicker({ theme, fontRegular, fontBold, language, selected, onSelect, natural, naturalActive }: Props) {
  const [voices, setVoices] = useState<ListenVoice[] | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  // Download progress per natural voice (0..1) while one downloads.
  const [downloading, setDownloading] = useState<Record<string, number>>({});
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [modelError, setModelError] = useState<string | null>(null);
  const naturalVoices = natural ? naturalVoicesFor(language) : [];
  const isReady = (id: string) => downloaded[id] ?? naturalDownloaded(id);

  /** Downloads a natural voice if needed (the first preview or choice does this). */
  const fetchVoice = async (id: string) => {
    setModelError(null);
    try {
      await loadNatural(id, (f) => setDownloading((d) => ({ ...d, [id]: f })));
      setDownloaded((d) => ({ ...d, [id]: true }));
    } catch (e) {
      setModelError(`That voice couldn't load here (${(e as Error).message}). The device's voices still work.`);
      throw e;
    } finally {
      setDownloading(({ [id]: _, ...rest }) => rest);
    }
  };

  const previewNatural = async (id: string) => {
    unlockAudio();
    setPreviewing(id);
    try {
      await fetchVoice(id);
      await playClip(await synthesize(sample, id)).done;
    } catch {
      // shown by fetchVoice
    }
    setPreviewing((p) => (p === id ? null : p));
  };
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
  const hasGoodSystemVoice = (voices ?? []).some((v) => v.badge);

  return (
    <>
      <Text style={[styles.title, { color: theme.ink, fontFamily: displayFont }]}>Voice</Text>
      <ScrollView style={{ maxHeight: 440 }}>
        {naturalVoices.length > 0 && (
          <View style={styles.naturalBox}>
            <Text style={[styles.section, { color: theme.ink }]}>✨ Natural voices</Text>
            <Text style={[styles.hint, { color: theme.soft }]}>
              AI voices that sound like a real narrator. They run on this device, free and offline, after a one-time download (best on
              Wi-Fi). Tap Preview to download and hear one.
            </Text>
            {!!modelError && <Text style={[styles.hint, { color: '#B5492F' }]}>{modelError}</Text>}
            {naturalVoices.map((v) => {
              const id = NATURAL_PREFIX + v.id;
              const on = selected === id || (!selected && naturalActive === id);
              const progress = downloading[id];
              return (
                <View key={id} style={[styles.row, { borderColor: theme.rule }]}>
                  <Pressable accessibilityLabel={`Use voice ${v.name}`} onPress={() => onSelect(id)} style={styles.choose}>
                    <Text style={{ color: theme.ink, fontFamily: on ? fontBold : fontRegular, fontSize: 16 }}>
                      {on ? '✓ ' : ''}
                      {v.name}
                    </Text>
                    <View style={styles.meta}>
                      <Text style={[styles.badge, { backgroundColor: '#7A4FC6' }]}>NATURAL</Text>
                      <Text style={{ color: theme.soft, fontSize: 12 }}>
                        {v.note} · {progress !== undefined ? `downloading ${Math.round(progress * 100)}%` : isReady(id) ? 'downloaded ✓' : `${v.sizeMB} MB`}
                      </Text>
                    </View>
                    {progress !== undefined && (
                      <View style={[styles.track, { backgroundColor: theme.rule }]}>
                        <View style={[styles.fill, { backgroundColor: theme.ink, width: `${Math.round(progress * 100)}%` }]} />
                      </View>
                    )}
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Preview ${v.name}`}
                    onPress={() => previewNatural(id)}
                    hitSlop={8}
                    style={[styles.preview, { borderColor: theme.rule }]}>
                    <Text style={{ color: theme.ink, fontSize: 12, fontWeight: '700' }}>{previewing === id ? '…' : '▶ Preview'}</Text>
                  </Pressable>
                </View>
              );
            })}
            <Text style={[styles.credit, { color: theme.soft }]}>
              Piper voices: {naturalVoices.map((v) => v.license).filter((l, i, a) => a.indexOf(l) === i).join('; ')}.
            </Text>
          </View>
        )}
        {naturalVoices.length > 0 && <Text style={[styles.section, { color: theme.ink, marginTop: 14 }]}>This device&apos;s voices</Text>}
        {rows.map((v) => {
          const on = v.auto ? !selected && !naturalActive : selected === v.id;
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
      {voices && !hasGoodSystemVoice && (
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
  naturalBox: { gap: 8, paddingBottom: 6 },
  section: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 4 },
  credit: { fontSize: 10, lineHeight: 14 },
});
