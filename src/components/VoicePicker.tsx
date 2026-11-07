import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { displayFont, type BookTheme } from '@/lib/bookType';
import type { SpeechLang } from '@/lib/lang';
import { speakOnce, voicesFor, type ListenVoice } from '@/lib/listen';
import {
  NATURAL_PREFIX, loadNatural, naturalDownloaded, naturalSupported, naturalVoicesFor, playClip, synthesize, unlockAudio,
} from '@/lib/neuralVoice';

const SAMPLE = {
  en: 'It was a bright cold day in April, and I had a book in my hands and nowhere else to be.',
  fr: "C'était une belle journée d'avril, avec un livre entre les mains et nulle part où aller.",
};
const IOS_VOICES_HELP = 'https://support.apple.com/guide/iphone/hear-iphone-speak-the-screen-iph96b214f0/ios';
const BADGE_COLORS = { Premium: '#B5862F', Natural: '#3E8A5A', Enhanced: '#4F86C6' };
const LANG_NAME: Record<SpeechLang, string> = { en: 'English', fr: 'Français' };

type Props = {
  theme: BookTheme;
  fontRegular: string;
  fontBold: string;
  /** The language shown first (the book's); the other one follows in its own section. */
  language: string;
  /** The chosen voice for a language, or undefined for "best available". */
  selectedFor: (lang: SpeechLang) => string | undefined;
  onSelect: (id: string | undefined, lang: SpeechLang) => void;
  /** The natural voice reading the book now (chosen, or picked automatically), if any. */
  naturalActive?: string | null;
  /** Show a title above the list (the reader's sheet does; a full screen has its own header). */
  title?: boolean;
  /** Let the list grow with the screen instead of scrolling inside a sheet. */
  inline?: boolean;
};

/** Voices for reading aloud, in an English and a French section: natural voices first, then this device's voices. */
export function VoicePicker({ theme, fontRegular, fontBold, language, selectedFor, onSelect, naturalActive, title = true, inline }: Props) {
  const first: SpeechLang = language.startsWith('fr') ? 'fr' : 'en';
  const order: SpeechLang[] = first === 'fr' ? ['fr', 'en'] : ['en', 'fr'];
  const [error, setError] = useState<string | null>(null);
  const iPhone = Platform.OS === 'ios' || (Platform.OS === 'web' && /iPhone|iPad/.test(globalThis.navigator?.userAgent ?? ''));
  const body = (
    <>
      {!!error && <Text style={[styles.hint, { color: '#B5492F' }]}>{error}</Text>}
      {order.map((lang) => (
        <LanguageVoices
          key={lang}
          lang={lang}
          theme={theme}
          fontRegular={fontRegular}
          fontBold={fontBold}
          selected={selectedFor(lang)}
          onSelect={(id) => onSelect(id, lang)}
          naturalActive={naturalActive}
          onError={setError}
          prefetch={lang === first}
        />
      ))}
      <Text style={[styles.hint, { color: theme.soft }]}>
        The app reads French text with your French voice and English text with your English voice, in books, idea cards and quizzes.
      </Text>
      {iPhone && (
        <Pressable onPress={() => Linking.openURL(IOS_VOICES_HELP)}>
          <Text style={[styles.hint, { color: theme.ink, textDecorationLine: 'underline' }]}>How to add more voices on iPhone ↗</Text>
        </Pressable>
      )}
    </>
  );
  return (
    <>
      {title && <Text style={[styles.title, { color: theme.ink, fontFamily: displayFont }]}>Voices</Text>}
      {inline ? <View style={styles.gap}>{body}</View> : <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={styles.gap}>{body}</ScrollView>}
    </>
  );
}

function LanguageVoices({ lang, theme, fontRegular, fontBold, selected, onSelect, naturalActive, onError, prefetch }: {
  lang: SpeechLang; theme: BookTheme; fontRegular: string; fontBold: string; selected?: string; onSelect: (id: string | undefined) => void; naturalActive?: string | null; onError: (e: string | null) => void; prefetch: boolean;
}) {
  const [voices, setVoices] = useState<ListenVoice[] | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  // Download progress per natural voice (0..1) while one downloads.
  const [downloading, setDownloading] = useState<Record<string, number>>({});
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const naturalVoices = naturalSupported() ? naturalVoicesFor(lang) : [];
  const isReady = (id: string) => downloaded[id] ?? naturalDownloaded(id);
  const sample = SAMPLE[lang];

  useEffect(() => {
    let alive = true;
    voicesFor(lang).then((v) => alive && setVoices(v));
    return () => {
      alive = false;
    };
  }, [lang]);

  /** Downloads a natural voice if needed (the first preview or choice does this). */
  const fetchVoice = async (id: string) => {
    onError(null);
    try {
      await loadNatural(id, (f) => setDownloading((d) => ({ ...d, [id]: f })));
      setDownloaded((d) => ({ ...d, [id]: true }));
    } catch (e) {
      onError(`That voice couldn't load here (${(e as Error).message}). The device's voices still work.`);
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
  const choose = (id: string) => {
    onSelect(id);
    // Choosing a natural voice for the language at hand starts its download right away, so it's ready when you listen.
    if (prefetch && !isReady(id)) fetchVoice(id).catch(() => {});
  };
  const preview = (id: string | undefined, key: string) => {
    setPreviewing(key);
    speakOnce(sample, () => setPreviewing((p) => (p === key ? null : p)), lang, id ?? voices?.[0]?.id);
  };

  const rows: (ListenVoice & { key: string; auto?: boolean })[] = [
    { key: 'auto', id: '', name: voices?.[0] ? `Best available (${voices[0].name})` : 'Best available', language: lang, auto: true },
    ...(voices ?? []).slice(0, 8).map((v) => ({ ...v, key: v.id })),
  ];
  const activeHere = naturalActive && naturalVoices.some((v) => NATURAL_PREFIX + v.id === naturalActive) ? naturalActive : null;

  return (
    <View style={[styles.langBox, { borderColor: theme.rule }]}>
      <Text style={[styles.langTitle, { color: theme.ink, fontFamily: displayFont }]}>{lang === 'fr' ? '🇫🇷 ' : '🇬🇧 '}{LANG_NAME[lang]}</Text>
      {naturalVoices.length > 0 && (
        <View style={styles.naturalBox}>
          <Text style={[styles.section, { color: theme.ink }]}>{lang === 'fr' ? '✨ Voix naturelles' : '✨ Natural voices'}</Text>
          <Text style={[styles.hint, { color: theme.soft }]}>
            {lang === 'fr'
              ? 'AI voices that sound like a real narrator, free and offline after a one-time download (best on Wi-Fi).'
              : 'AI voices that sound like a real narrator. They run on this device, free and offline, after a one-time download (best on Wi-Fi).'}
          </Text>
          {naturalVoices.map((v) => {
            const id = NATURAL_PREFIX + v.id;
            const on = selected === id || (!selected && activeHere === id);
            const progress = downloading[id];
            return (
              <View key={id} style={[styles.row, { borderColor: theme.rule }]}>
                <Pressable accessibilityLabel={`Use voice ${v.name}`} onPress={() => choose(id)} style={styles.choose}>
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
                <Pressable accessibilityLabel={`Preview ${v.name}`} onPress={() => previewNatural(id)} hitSlop={8} style={[styles.preview, { borderColor: theme.rule }]}>
                  <Text style={{ color: theme.ink, fontSize: 12, fontWeight: '700' }}>{previewing === id ? '…' : '▶ Preview'}</Text>
                </Pressable>
              </View>
            );
          })}
          <Text style={[styles.credit, { color: theme.soft }]}>Piper voices: {naturalVoices.map((v) => v.license).filter((l, i, a) => a.indexOf(l) === i).join('; ')}.</Text>
        </View>
      )}
      <Text style={[styles.section, { color: theme.ink, marginTop: 6 }]}>{lang === 'fr' ? 'Voix de l’appareil' : 'This device’s voices'}</Text>
      {rows.map((v) => {
        const on = v.auto ? !selected && !activeHere : selected === v.id;
        return (
          <View key={v.key} style={[styles.row, { borderColor: theme.rule }]}>
            <Pressable accessibilityLabel={`Use voice ${v.name}`} onPress={() => onSelect(v.auto ? undefined : v.id)} style={styles.choose}>
              <Text style={{ color: theme.ink, fontFamily: on ? fontBold : fontRegular, fontSize: 16 }} numberOfLines={1}>
                {on ? '✓ ' : ''}
                {v.name}
              </Text>
              <View style={styles.meta}>
                {v.badge && <Text style={[styles.badge, { backgroundColor: BADGE_COLORS[v.badge] }]}>{v.badge.toUpperCase()}</Text>}
                <Text style={{ color: theme.soft, fontSize: 12 }}>{v.auto ? 'Picked for you' : v.language}</Text>
              </View>
            </Pressable>
            <Pressable accessibilityLabel={`Preview ${v.name}`} onPress={() => preview(v.auto ? undefined : v.id, v.key)} hitSlop={8} style={[styles.preview, { borderColor: theme.rule }]}>
              <Text style={{ color: theme.ink, fontSize: 12, fontWeight: '700' }}>{previewing === v.key ? '…' : '▶ Preview'}</Text>
            </Pressable>
          </View>
        );
      })}
      {voices && voices.length === 0 && <Text style={[styles.hint, { color: theme.soft }]}>No {lang === 'fr' ? 'French' : 'English'} voice is installed on this device.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20 },
  gap: { gap: 14 },
  langBox: { gap: 6, paddingBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  langTitle: { fontSize: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 52 },
  choose: { flex: 1, gap: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  preview: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
  hint: { fontSize: 13, lineHeight: 19 },
  naturalBox: { gap: 6, paddingBottom: 6 },
  section: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 4 },
  credit: { fontSize: 10, lineHeight: 14 },
});
