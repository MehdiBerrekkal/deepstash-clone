import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { captureRef as CaptureRef } from 'react-native-view-shot';

import { displayFont, displayItalic } from '@/lib/bookType';
import { shareImage } from '@/lib/share';
import { colors } from '@/lib/theme';

const STYLES = [
  { key: 'paper', label: 'Paper', colors: ['#FBF7EE', '#EFE5D0'] as const, ink: '#1C1712', soft: '#7B6F5E', mark: '#C9A86A' },
  { key: 'night', label: 'Night', colors: ['#1F2433', '#0E1018'] as const, ink: '#EDE6D6', soft: '#9A9384', mark: '#D9B26A' },
  { key: 'sage', label: 'Sage', colors: ['#DDE6D5', '#B9C9AE'] as const, ink: '#1F2A1C', soft: '#4F5E48', mark: '#6E8B5E' },
  { key: 'rose', label: 'Rose', colors: ['#F6DCD3', '#E7B7A8'] as const, ink: '#3A1E18', soft: '#7A4E44', mark: '#B5492F' },
];

type Props = { text: string; author: string; source?: string; onClose: () => void };

/** A quote laid out as a shareable square image, in a choice of styles. */
export function QuoteImage({ text, author, source, onClose }: Props) {
  const card = useRef<ComponentRef<typeof View>>(null);
  const [style, setStyle] = useState(STYLES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quote = text.length > 520 ? `${text.slice(0, 520).replace(/\s+\S*$/, '')}…` : text;
  const size = quote.length > 320 ? 17 : quote.length > 160 ? 21 : 26;

  const share = async () => {
    setBusy(true);
    setError(null);
    try {
      // Loaded only when sharing: the image library is large and not needed to open the app.
      const { captureRef } = await import('react-native-view-shot');
      const uri = await captureRef(card as Parameters<typeof CaptureRef>[0], { format: 'png', quality: 1, result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile' });
      await shareImage(uri, `${author.replace(/[^\w]+/g, '-').toLowerCase() || 'quote'}.png`);
    } catch (e) {
      setError((e as Error).message || 'Could not make the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View ref={card} collapsable={false} style={styles.cardWrap}>
            <LinearGradient colors={style.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <Text style={[styles.mark, { color: style.mark, fontFamily: displayFont }]}>“</Text>
              <Text style={[styles.quote, { color: style.ink, fontFamily: displayItalic, fontSize: size, lineHeight: size * 1.35 }]}>{quote}</Text>
              <View style={[styles.rule, { backgroundColor: style.mark }]} />
              <Text style={[styles.author, { color: style.ink, fontFamily: displayFont }]}>{author}</Text>
              {!!source && <Text style={[styles.source, { color: style.soft }]}>{source}</Text>}
              <Text style={[styles.brand, { color: style.soft }]}>DEEPSTASH CLONE</Text>
            </LinearGradient>
          </View>

          <View style={styles.row}>
            {STYLES.map((s) => (
              <Pressable
                key={s.key}
                accessibilityLabel={`Style ${s.label}`}
                onPress={() => setStyle(s)}
                style={[styles.swatch, { backgroundColor: s.colors[0], borderColor: s.key === style.key ? colors.accent : 'transparent' }]}
              />
            ))}
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.row}>
            <Pressable onPress={onClose} style={[styles.button, styles.secondary]}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
            <Pressable accessibilityLabel="Share image" onPress={share} disabled={busy} style={[styles.button, styles.primary]}>
              {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={[styles.buttonText, { color: colors.onAccent }]}>Share image</Text>}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 },
  sheet: { alignSelf: 'center', width: '100%', maxWidth: 420, gap: 14 },
  cardWrap: { borderRadius: 24, overflow: 'hidden' },
  card: { aspectRatio: 1, padding: 30, justifyContent: 'center' },
  mark: { fontSize: 76, lineHeight: 70, marginBottom: -8 },
  quote: {},
  rule: { width: 36, height: 2, marginTop: 20, marginBottom: 12, opacity: 0.8 },
  author: { fontSize: 19 },
  source: { fontSize: 13, marginTop: 2, fontStyle: 'italic' },
  brand: { position: 'absolute', bottom: 16, right: 22, fontSize: 9, letterSpacing: 2.5, opacity: 0.7 },
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 3 },
  button: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 999 },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surfaceRaised },
  buttonText: { color: colors.text, fontWeight: '800' },
  error: { color: colors.danger, textAlign: 'center' },
});
