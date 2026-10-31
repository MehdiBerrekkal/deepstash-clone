import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { usePalette } from '@/lib/appearance';
import { confirmFound, downloadFound, findBooks, publicDomainEU, withDeathYears, type FoundBook, type Lang } from '@/lib/findBooks';
import { saveBook } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';

const SUGGESTIONS = ['Victor Hugo', 'Dostoevsky', 'Seneca', 'Jane Austen', 'Proust', 'Marcus Aurelius', 'Maupassant', 'Tolstoy'];
const SOURCE_NAME = { gutenberg: 'Project Gutenberg', standard: 'Standard Ebooks' } as const;
const FLAG = { en: '🇬🇧', fr: '🇫🇷', other: '🌐' } as const;
const year = () => new Date().getFullYear();

/** Find a book: search free public-domain libraries and download a book into the Library in one tap. */
export default function FindScreen() {
  const { ownBooks, addOwnBook } = useStore();
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState<Lang | 'all'>('all');
  // Every candidate from the sources, then each one's check result (the book, or null when it can't be offered).
  const [candidates, setCandidates] = useState<FoundBook[] | null>(null);
  const [checked, setChecked] = useState<Record<string, FoundBook | null>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState<FoundBook | null>(null);
  const searchId = useRef(0);

  const search = async (q = query, l = lang) => {
    const text = q.trim();
    if (!text) return;
    const mine = ++searchId.current;
    setSearching(true);
    setErrors([]);
    try {
      const { books, errors: errs } = await findBooks(text, l);
      if (mine !== searchId.current) return;
      setCandidates(books);
      setChecked({});
      setErrors(errs);
      // Only books that really download here are shown: they appear as their check finishes, a few at a time.
      let next = 0;
      const worker = async () => {
        while (next < books.length && mine === searchId.current) {
          const b = books[next++];
          const ok = await confirmFound(b);
          if (mine === searchId.current) setChecked((c) => ({ ...c, [b.key]: ok }));
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
    } catch (e) {
      if (mine === searchId.current) setErrors([(e as Error).message || 'Search failed. Check your connection.']);
    } finally {
      if (mine === searchId.current) setSearching(false);
    }
  };

  // Arriving from Explore with a search already typed.
  const { q: initial } = useLocalSearchParams<{ q?: string }>();
  useEffect(() => {
    if (!initial) return;
    const t = setTimeout(() => {
      setQuery(initial);
      search(initial, 'all');
    }, 0);
    return () => clearTimeout(t);
    // Only when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // In the sources' order (Standard Ebooks, then most downloaded), French editions with their accents first.
  const results = candidates
    ?.map((b) => checked[b.key])
    .filter((b): b is FoundBook => !!b)
    .sort((a, b) => Number(b.accented !== false) - Number(a.accented !== false));
  const pending = candidates ? candidates.filter((b) => !(b.key in checked)).length : 0;

  const downloaded = (b: FoundBook) => ownBooks.find((o) => o.sourceUrl === b.pageUrl);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Find a free book' }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Search thousands of free classics in English and French. Books that are public domain in Europe download straight into your Library.</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search()}
            returnKeyType="search"
            placeholder="Title or author, e.g. Victor Hugo"
            placeholderTextColor={colors.muted}
            style={styles.search}
            accessibilityLabel="Search free books"
          />
          <Pressable accessibilityLabel="Search" onPress={() => search()} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
        <View style={styles.chips}>
          {(['all', 'en', 'fr'] as const).map((l) => (
            <Pressable
              key={l}
              accessibilityLabel={`Language ${l}`}
              onPress={() => {
                setLang(l);
                if (query.trim()) search(query, l);
              }}
              style={[styles.chip, lang === l && styles.chipOn]}>
              <Text style={[styles.chipText, lang === l && styles.chipTextOn]}>{l === 'all' ? 'All' : l === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}</Text>
            </Pressable>
          ))}
        </View>

        {searching && !results?.length && <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />}
        {errors.map((e) => (
          <Text key={e} style={styles.error}>
            {e}
          </Text>
        ))}
        {!candidates && !searching && (
          <View style={styles.suggest}>
            <Text style={styles.label}>Try</Text>
            <View style={styles.chips}>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    setQuery(s);
                    search(s);
                  }}
                  style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {results && (
          <Text style={styles.label}>
            {results.length
              ? `${results.length} free ${results.length === 1 ? 'book' : 'books'} to download${pending ? ` · checking ${pending} more…` : ''}`
              : pending
                ? 'Checking which books can be downloaded…'
                : 'No downloadable book found. Try an author’s surname or the original title.'}
          </Text>
        )}
        {results?.map((b) => {
            return (
              <Pressable key={b.key} accessibilityLabel={`Book ${b.title}`} onPress={() => setOpen(b)} style={styles.row}>
                <Image source={{ uri: b.cover }} style={styles.cover} resizeMode="cover" />
                <View style={styles.flex}>
                  <Text style={styles.title} numberOfLines={2}>
                    {b.title}
                  </Text>
                  <Text style={styles.author} numberOfLines={1}>
                    {FLAG[b.lang]} {b.authors.join(', ') || 'Unknown author'}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.source}>{SOURCE_NAME[b.source]}</Text>
                    {downloaded(b) ? <Text style={[styles.badge, styles.badgeDone]}>In your Library</Text> : <Text style={styles.badge}>Public domain</Text>}
                  </View>
                </View>
              </Pressable>
            );
          })}
        <Text style={styles.foot}>
          Sources: Project Gutenberg (via the Internet Archive) and Standard Ebooks. A book downloads only when everyone who wrote or translated it died before {year() - 70}, so it’s public domain in Europe; books that can’t be downloaded here aren’t listed.
        </Text>
      </ScrollView>
      {open && (
        <BookSheet
          book={open}
          inLibrary={downloaded(open)?.id}
          onClose={() => setOpen(null)}
          onDone={(id) => {
            setOpen(null);
            router.push({ pathname: '/reader/[id]', params: { id, kind: 'own' } });
          }}
          onAdd={addOwnBook}
        />
      )}
    </View>
  );
}

function BookSheet({ book: initial, inLibrary, onClose, onDone, onAdd }: { book: FoundBook; inLibrary?: string; onClose: () => void; onDone: (id: string) => void; onAdd: ReturnType<typeof useStore>['addOwnBook'] }) {
  // Modals render outside the app's colour scope on the web, so paint the sheet with real colours.
  const palette = usePalette();
  const [book, setBook] = useState(initial);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    withDeathYears(initial).then((b) => alive && setBook(b));
    return () => {
      alive = false;
    };
  }, [initial]);
  const pd = publicDomainEU(book.people);
  const unknown = book.people.some((p) => p.died === undefined);

  const download = async () => {
    setError(null);
    setProgress(0);
    try {
      const full = await downloadFound(book, setProgress);
      const id = `find-${Date.now().toString(36)}`;
      await saveBook(id, full);
      onAdd({
        id,
        kind: 'epub',
        fileName: SOURCE_NAME[book.source],
        title: full.title || book.title,
        author: full.author || book.authors.join(', '),
        addedAt: new Date().toISOString(),
        lang: book.lang === 'fr' ? 'fr' : 'en',
        source: SOURCE_NAME[book.source],
        sourceUrl: book.pageUrl,
      });
      onDone(id);
    } catch (e) {
      setError((e as Error).message || 'The download failed. Check your connection and try again.');
      setProgress(null);
    }
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: palette.background }]} onPress={() => {}}>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            <View style={styles.sheetTop}>
              <Image source={{ uri: book.cover }} style={styles.bigCover} resizeMode="cover" />
              <View style={styles.flex}>
                <Text style={styles.sheetTitle}>{book.title}</Text>
                <Text style={styles.author}>{book.authors.join(', ')}</Text>
                <Text style={styles.source}>
                  {FLAG[book.lang]} {SOURCE_NAME[book.source]}
                  {book.downloads ? ` · ${book.downloads.toLocaleString()} downloads` : ''}
                </Text>
              </View>
            </View>
            {!!book.description && <Text style={styles.desc}>{book.description}</Text>}
            <View style={styles.people}>
              {book.people.map((p) => (
                <Text key={`${p.name}${p.role}`} style={styles.person}>
                  {p.role ? `${p.role}: ` : ''}
                  {p.name} · {p.died !== undefined ? `died ${p.died < 0 ? `${-p.died} BC` : p.died}` : unknown ? 'dates not found' : ''}
                </Text>
              ))}
            </View>
            {inLibrary ? (
              <Pressable accessibilityLabel="Read now" onPress={() => onDone(inLibrary)} style={styles.primary}>
                <Text style={styles.primaryText}>Read now · in your Library</Text>
              </Pressable>
            ) : pd ? (
              <Pressable accessibilityLabel="Download and read" disabled={progress !== null} onPress={download} style={styles.primary}>
                <Text style={styles.primaryText}>{progress === null ? '⬇ Download & read' : `Downloading… ${Math.round(progress * 100)}%`}</Text>
              </Pressable>
            ) : (
              <Text style={styles.note}>
                {unknown
                  ? 'We couldn’t confirm that this edition is public domain in Europe, so it opens on its source site instead.'
                  : 'This edition may still be under copyright in Europe (someone involved died less than 70 years ago), so it opens on its source site instead.'}
              </Text>
            )}
            {progress !== null && (
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
            )}
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable accessibilityLabel="Open source page" onPress={() => Linking.openURL(book.pageUrl)} style={styles.secondary}>
              <Text style={styles.secondaryText}>Open on {SOURCE_NAME[book.source]} ↗</Text>
            </Pressable>
            {pd && <Text style={styles.pdNote}>Public domain in Europe and the US. Free to read, keep and share.</Text>}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12, paddingBottom: 48, maxWidth: 720, width: '100%', alignSelf: 'center' },
  flex: { flex: 1, gap: 3 },
  intro: { color: colors.muted, lineHeight: 21 },
  searchRow: { flexDirection: 'row', gap: 8 },
  search: { flex: 1, minHeight: 48, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, color: colors.text, fontSize: 16, borderWidth: 1, borderColor: colors.border },
  searchBtn: { paddingHorizontal: 16, borderRadius: 14, justifyContent: 'center', backgroundColor: colors.accent, minHeight: 48 },
  searchBtnText: { color: colors.onAccent, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  chipTextOn: { color: colors.onAccent },
  suggest: { gap: 8, marginTop: 8 },
  label: { color: colors.muted, fontWeight: '800', fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12, padding: 10, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center' },
  cover: { width: 54, height: 80, borderRadius: 6, backgroundColor: colors.surfaceRaised },
  title: { color: colors.text, fontWeight: '800', fontSize: 15, fontFamily: serif },
  author: { color: colors.text, opacity: 0.8, fontSize: 13 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  source: { color: colors.muted, fontSize: 12 },
  badge: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6, color: '#2F7A4A', backgroundColor: 'rgba(61,170,110,0.15)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  badgeOff: { color: colors.muted, backgroundColor: colors.surfaceRaised },
  badgeDone: { color: colors.accent, backgroundColor: colors.surfaceRaised },
  error: { color: '#C2452D', lineHeight: 20 },
  foot: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '88%', borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.background, width: '100%', maxWidth: 720, alignSelf: 'center' },
  sheetBody: { padding: 20, gap: 12, paddingBottom: 40 },
  sheetTop: { flexDirection: 'row', gap: 14 },
  bigCover: { width: 96, height: 144, borderRadius: 8, backgroundColor: colors.surfaceRaised },
  sheetTitle: { color: colors.text, fontFamily: serif, fontSize: 21, fontWeight: '800' },
  desc: { color: colors.text, lineHeight: 21, opacity: 0.9 },
  people: { gap: 2 },
  person: { color: colors.muted, fontSize: 12 },
  primary: { paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent, minHeight: 52 },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondary: { paddingVertical: 13, borderRadius: 999, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryText: { color: colors.text, fontWeight: '700' },
  note: { color: colors.muted, lineHeight: 20 },
  pdNote: { color: colors.muted, fontSize: 12, textAlign: 'center' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.accent },
});
