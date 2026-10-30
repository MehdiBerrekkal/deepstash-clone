import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { QuoteImage } from '@/components/QuoteImage';
import { HIGHLIGHT_COLORS, displayFont } from '@/lib/bookType';
import { copyText, highlightsMarkdown, shareTextFile } from '@/lib/share';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Highlight, HighlightColor } from '@/lib/types';

/** Every highlight and note, or one book's (?book=<readerId>), with filters and Markdown export. */
export default function HighlightsScreen() {
  const { book } = useLocalSearchParams<{ book?: string }>();
  const { highlights, removeHighlight } = useStore();
  const [color, setColor] = useState<HighlightColor | null>(null);
  const [notesOnly, setNotesOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [image, setImage] = useState<Highlight | null>(null);
  const [status, setStatus] = useState('');

  const inBook = useMemo(() => (book ? highlights.filter((h) => h.readerId === book) : highlights), [highlights, book]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = inBook.filter(
      (h) =>
        (!color || h.color === color) &&
        (!notesOnly || h.note) &&
        (!q || `${h.text} ${h.note ?? ''} ${h.bookTitle} ${h.author}`.toLowerCase().includes(q)),
    );
    // One book reads in book order; across books, newest first.
    return book ? [...list].sort((a, b) => a.chapter - b.chapter || a.para - b.para || a.char - b.char) : list;
  }, [inBook, color, notesOnly, query, book]);
  const title = book ? inBook[0]?.bookTitle ?? 'Highlights' : 'All highlights';

  const open = (h: Highlight) => {
    const [kind, id] = [h.readerId.slice(0, h.readerId.indexOf(':')), h.readerId.slice(h.readerId.indexOf(':') + 1)];
    router.push({ pathname: '/reader/[id]', params: { id, kind, at: `${h.chapter}.${h.para}.${h.char}` } });
  };
  const exportMd = async () => {
    const name = `${title.replace(/[^\w]+/g, '-').toLowerCase()}-highlights.md`;
    await shareTextFile(name, highlightsMarkdown(shown, title));
    setStatus('Exported as Markdown');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: book ? 'Highlights' : 'All highlights' }} />
      <FlatList
        data={shown}
        keyExtractor={(h) => h.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.muted}>
              {inBook.length} {inBook.length === 1 ? 'highlight' : 'highlights'}
              {book ? '' : ` in ${plural(new Set(inBook.map((h) => h.readerId)).size, 'book')}`} · {plural(inBook.filter((h) => h.note).length, 'note')}
            </Text>
            {inBook.length > 0 && (
              <>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search highlights and notes"
                  placeholderTextColor={colors.muted}
                  style={styles.search}
                />
                <View style={styles.filters}>
                  <Pressable onPress={() => setColor(null)} style={[styles.filter, !color && styles.filterOn]}>
                    <Text style={[styles.filterText, !color && styles.filterTextOn]}>All</Text>
                  </Pressable>
                  {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((c) => (
                    <Pressable
                      key={c}
                      accessibilityLabel={`Only ${HIGHLIGHT_COLORS[c].label}`}
                      onPress={() => setColor(color === c ? null : c)}
                      style={[styles.dot, { backgroundColor: HIGHLIGHT_COLORS[c].solid }, color === c && styles.dotOn]}
                    />
                  ))}
                  <Pressable onPress={() => setNotesOnly(!notesOnly)} style={[styles.filter, notesOnly && styles.filterOn]}>
                    <Text style={[styles.filterText, notesOnly && styles.filterTextOn]}>✎ Notes</Text>
                  </Pressable>
                </View>
                <View style={styles.filters}>
                  <Pressable accessibilityLabel="Export Markdown" onPress={exportMd} style={styles.export}>
                    <Text style={styles.exportText}>⇩ Export Markdown</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Copy all"
                    onPress={async () => {
                      await copyText(highlightsMarkdown(shown, title));
                      setStatus('Copied as Markdown');
                    }}
                    style={styles.export}>
                    <Text style={styles.exportText}>⧉ Copy all</Text>
                  </Pressable>
                </View>
                {!!status && <Text style={styles.status}>{status}</Text>}
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            art={inBook.length ? 'search' : 'pen'}
            title={inBook.length ? 'Nothing matches' : 'No highlights yet'}
            text={
              inBook.length
                ? 'Try another colour or search.'
                : 'In any full book, long-press a paragraph, pick the sentences and choose a colour. Your notes live here too.'
            }
            action={inBook.length ? undefined : 'Find a book'}
            onAction={() => router.push('/library')}
          />
        }
        renderItem={({ item: h }) => (
          <Pressable onPress={() => open(h)} style={styles.item}>
            <View style={[styles.bar, { backgroundColor: HIGHLIGHT_COLORS[h.color].solid }]} />
            <View style={styles.body}>
              <Text style={styles.quote}>“{h.text}”</Text>
              {!!h.note && <Text style={styles.note}>✎ {h.note}</Text>}
              <Text style={styles.meta} numberOfLines={1}>
                {book ? h.chapterTitle : `${h.bookTitle} · ${h.chapterTitle}`}
              </Text>
              <View style={styles.itemActions}>
                <Pressable onPress={() => setImage(h)} hitSlop={8}>
                  <Text style={styles.link}>▣ Image</Text>
                </Pressable>
                <Pressable onPress={() => copyText(`“${h.text}” — ${h.author}, ${h.bookTitle}`)} hitSlop={8}>
                  <Text style={styles.link}>⧉ Copy</Text>
                </Pressable>
                <Pressable accessibilityLabel="Delete highlight" onPress={() => removeHighlight(h.id)} hitSlop={8}>
                  <Text style={[styles.link, { color: colors.danger }]}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
      {image && <QuoteImage text={image.text} author={image.author} source={image.bookTitle} onClose={() => setImage(null)} />}
    </View>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 12, paddingBottom: 48, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { gap: 10, marginBottom: 6 },
  title: { color: colors.text, fontSize: 30, fontFamily: displayFont },
  muted: { color: colors.muted, lineHeight: 20 },
  search: { backgroundColor: colors.surface, color: colors.text, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  filters: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  filter: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  filterOn: { backgroundColor: colors.accent },
  filterText: { color: colors.text, fontWeight: '600' },
  filterTextOn: { color: colors.onAccent },
  dot: { width: 28, height: 28, borderRadius: 14 },
  dotOn: { borderWidth: 3, borderColor: colors.text },
  export: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  exportText: { color: colors.text, fontWeight: '700' },
  status: { color: colors.accent, fontSize: 13 },
  item: { flexDirection: 'row', borderRadius: 16, backgroundColor: colors.surface, overflow: 'hidden' },
  bar: { width: 5 },
  body: { flex: 1, padding: 14, gap: 8 },
  quote: { color: colors.text, fontFamily: 'Literata_400Regular_Italic', fontSize: 16, lineHeight: 25 },
  note: { color: colors.accent, fontSize: 14, lineHeight: 20 },
  meta: { color: colors.muted, fontSize: 12 },
  itemActions: { flexDirection: 'row', gap: 18 },
  link: { color: colors.muted, fontWeight: '700', fontSize: 13 },
});
