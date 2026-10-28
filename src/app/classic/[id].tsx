import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { FavoriteButton } from '@/components/FavoriteButton';
import { classicAsSource } from '@/lib/classicSource';
import { classicById, classicReaderId, formatYear, loadClassic, readMinutesForWords, type FullBook } from '@/lib/fullbook';
import { useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';

export default function ClassicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { topicById, readerProgress, sourceById } = useStore();
  const classic = classicById[id];
  const [book, setBook] = useState<FullBook | null>(null);

  useEffect(() => {
    if (classic) loadClassic(classic.id).then(setBook).catch(() => {});
  }, [classic]);

  if (!classic) return <Text style={styles.muted}>Book not found.</Text>;

  const topic = topicById[classic.topicId];
  const progress = readerProgress[classicReaderId(classic.id)];
  const hours = readMinutesForWords(classic.words) / 60;
  const linked = classic.sourceId ? sourceById[classic.sourceId] : undefined;
  const open = () => router.push({ pathname: '/reader/[id]', params: { id: classic.id, kind: 'classic' } });

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: topic?.color ?? colors.surface }]}>
          <BookCover book={classicAsSource(classic)} width={140} favoriteKey={null} onPress={open} fraction={progress?.fraction} />
          <Text style={styles.title}>{classic.title}</Text>
          <Text style={styles.author}>
            {classic.author} · {formatYear(classic.year)}
          </Text>
          {classic.translator && <Text style={styles.meta}>Translated by {classic.translator}</Text>}
          <Text style={styles.meta}>
            📚 Full book · {classic.chapters} chapters · {hours >= 1 ? `about ${Math.round(hours)} h` : `${readMinutesForWords(classic.words)} min`} read
          </Text>
        </View>

        <View style={styles.section}>
          <Pressable onPress={open} style={styles.primary}>
            <Text style={styles.primaryText}>
              {progress ? `Continue reading · ${Math.round(progress.fraction * 100)}%` : 'Read the full book'}
            </Text>
          </Pressable>
          <View style={styles.secondaryRow}>
            <FavoriteButton favoriteKey={classicReaderId(classic.id)} title={classic.title} size="large" />
            {linked && (
              <Pressable onPress={() => router.push({ pathname: '/book/[id]', params: { id: linked.id } })} style={styles.secondary}>
                <Text style={styles.secondaryText}>Key ideas</Text>
              </Pressable>
            )}
          </View>
          {classic.description && <Text style={styles.description}>{classic.description}</Text>}
          {classic.license && /^public domain$/i.test(classic.license) ? (
            <Text style={styles.note}>
              <Text style={styles.link} onPress={() => classic.licenseUrl && Linking.openURL(classic.licenseUrl)}>
                Public domain
              </Text>
              . Free to read and share.{' '}
              <Text style={styles.link} onPress={() => classic.homepage && Linking.openURL(classic.homepage)}>
                Source ↗
              </Text>
            </Text>
          ) : classic.license ? (
            <Text style={styles.note}>
              © {classic.author}. Shared under the{' '}
              <Text style={styles.link} onPress={() => classic.licenseUrl && Linking.openURL(classic.licenseUrl)}>
                {classic.license}
              </Text>{' '}
              license: free to read and share with credit{/NC/.test(classic.license) ? ', for non-commercial use only' : ''}.{' '}
              <Text style={styles.link} onPress={() => classic.homepage && Linking.openURL(classic.homepage)}>
                Source ↗
              </Text>
            </Text>
          ) : (
            <Text style={styles.note}>
              Public domain, from Project Gutenberg (ebook #{classic.gutenberg}). Free to read and share.{' '}
              <Text style={styles.link} onPress={() => Linking.openURL(`https://www.gutenberg.org/ebooks/${classic.gutenberg}`)}>
                Source ↗
              </Text>
            </Text>
          )}

          <Text style={styles.heading}>Contents</Text>
          {book?.chapters.map((c, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rowNumber}>{i + 1}</Text>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {c.title}
              </Text>
            </View>
          )) ?? <Text style={styles.mutedInline}>Loading…</Text>}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, gap: 24 },
  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 24, paddingHorizontal: 24, gap: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', fontFamily: serif, textAlign: 'center', marginTop: 12 },
  author: { color: colors.text, fontSize: 16, opacity: 0.85 },
  meta: { color: colors.text, fontSize: 13, opacity: 0.75, textAlign: 'center' },
  section: { paddingHorizontal: 16, gap: 12 },
  primary: { paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondary: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontWeight: '700' },
  note: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  description: { color: colors.text, fontSize: 16, lineHeight: 24 },
  link: { color: colors.accent, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 8 },
  row: { flexDirection: 'row', gap: 14, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowNumber: { color: colors.muted, width: 26, textAlign: 'right', fontWeight: '700' },
  rowTitle: { color: colors.text, flex: 1, fontSize: 15 },
  muted: { color: colors.muted, padding: 24 },
  mutedInline: { color: colors.muted },
});
