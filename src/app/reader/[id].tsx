import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Modal, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, View,
  type LayoutChangeEvent, type ListViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { classicById, loadClassic, type FullBook } from '@/lib/fullbook';
import { loadOwnBook } from '@/lib/ownbooks';
import { findPage, pageStart, paginate, type Page } from '@/lib/paginate';
import { useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';
import type { Idea, ReaderPosition, ReaderTheme } from '@/lib/types';

const THEMES: Record<ReaderTheme, { bg: string; text: string; muted: string; bar: string; label: string }> = {
  light: { bg: '#FFFFFF', text: '#1E1E1E', muted: '#707070', bar: '#F2F2F2', label: 'Light' },
  sepia: { bg: '#F4ECD8', text: '#3B2F1E', muted: '#7A6A55', bar: '#EADFC6', label: 'Sepia' },
  dark: { bg: '#121212', text: '#E6E1D6', muted: '#8F8A80', bar: '#1E1E1E', label: 'Dark' },
};
const MIN_FONT = 13;
const MAX_FONT = 34;
const PAD_X = 24;
const PAD_Y = 20;

/** Paginated full-book reader for bundled classics (kind=classic) and the user's own EPUBs (kind=own). */
export default function FullReaderScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: 'classic' | 'own' }>();
  const { ready } = useStore();
  // Wait for saved progress to load (e.g. when the reader is opened from a link) so it resumes in the right place.
  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={colors.muted} />
      </View>
    );
  }
  return <Reader id={id} kind={kind} />;
}

function Reader({ id, kind }: { id: string; kind?: 'classic' | 'own' }) {
  const readerId = `${kind === 'own' ? 'own' : 'classic'}:${id}`;
  const store = useStore();
  const { readerSettings, setReaderSettings, readerProgress, setReaderPosition, bookmarks, toggleBookmark, removeBookmark } = store;
  const [book, setBook] = useState<FullBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [current, setCurrent] = useState(0);
  const [panel, setPanel] = useState<null | 'settings' | 'contents'>(null);
  const [clip, setClip] = useState<{ text: string; position: ReaderPosition } | null>(null);
  const [pinch, setPinch] = useState(1);
  const list = useRef<FlatList<Page>>(null);
  // The position survives re-pagination, so changing the text size keeps your place.
  const [anchor, setAnchor] = useState<ReaderPosition | null>(() => readerProgress[readerId] ?? null);

  const theme = THEMES[readerSettings.theme];
  const fontSize = readerSettings.fontSize;
  const lineHeight = Math.round(fontSize * 1.55);

  useEffect(() => {
    let alive = true;
    const load = kind === 'own' ? loadOwnBook(id) : classicById[id] ? loadClassic(id) : Promise.resolve(null);
    load
      .then((b) => {
        if (!alive) return;
        if (b) setBook(b);
        else setError(kind === 'own' ? "This book isn't stored on this device anymore. Open the file again from the Library." : 'Book not found.');
      })
      .catch((e: Error) => alive && setError(e.message || 'The book could not be opened.'));
    return () => {
      alive = false;
    };
  }, [id, kind]);

  const pages = useMemo(
    () => (book && size.width > 0 ? paginate(book, { width: size.width - PAD_X * 2, height: size.height - PAD_Y * 2, fontSize, lineHeight }) : []),
    [book, size.width, size.height, fontSize, lineHeight],
  );
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  const startIndex = pages.length && anchor ? findPage(pages, anchor) : 0;

  const chapterStarts = useMemo(() => {
    const starts: number[] = [];
    pages.forEach((p, i) => {
      if (starts[p.chapter] === undefined) starts[p.chapter] = i;
    });
    return starts;
  }, [pages]);

  // FlatList doesn't allow this callback to change after mount, so it's created once and reads pages from a ref.
  const [onViewable] = useState(() => ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const index = viewableItems.find((v) => v.isViewable)?.index;
    const all = pagesRef.current;
    if (index == null || !all[index]) return;
    const start = pageStart(all[index]);
    setCurrent(index);
    setAnchor(start);
    setReaderPosition(readerId, start, all.length > 1 ? index / (all.length - 1) : 1);
  });

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= pages.length) return;
      list.current?.scrollToIndex({ index, animated: Math.abs(index - current) < 3 });
    },
    [pages.length, current],
  );

  const step = useCallback((delta: number) => goTo(current + delta), [goTo, current]);

  const changeFont = useCallback(
    (next: number) => setReaderSettings({ fontSize: Math.min(MAX_FONT, Math.max(MIN_FONT, Math.round(next))) }),
    [setReaderSettings],
  );

  // Arrow keys turn pages on the web.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') step(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  // Two-finger pinch scales the text; the new size applies when the fingers lift.
  const pinchStart = useRef(0);
  const pinchScale = useRef(1);
  const fontRef = useRef(fontSize);
  useEffect(() => {
    fontRef.current = fontSize;
  }, [fontSize]);
  const responder = useMemo(() => {
    const distance = (touches: readonly { pageX: number; pageY: number }[]) =>
      Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
    // The refs below are only read inside gesture callbacks, never while rendering.
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: (e) => e.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponderCapture: (e) => e.nativeEvent.touches.length === 2,
      onPanResponderGrant: (e) => {
        const t = e.nativeEvent.touches;
        pinchStart.current = t.length === 2 ? distance(t) : 0;
        pinchScale.current = 1;
      },
      onPanResponderMove: (e) => {
        const t = e.nativeEvent.touches;
        if (t.length !== 2) return;
        if (!pinchStart.current) pinchStart.current = distance(t);
        pinchScale.current = Math.min(2, Math.max(0.6, distance(t) / pinchStart.current));
        setPinch(pinchScale.current);
      },
      onPanResponderRelease: () => {
        if (Math.abs(pinchScale.current - 1) > 0.05) changeFont(fontRef.current * pinchScale.current);
        pinchStart.current = 0;
        pinchScale.current = 1;
        setPinch(1);
      },
      onPanResponderTerminate: () => setPinch(1),
    });
  }, [changeFont]);

  const marks = bookmarks[readerId] ?? [];
  const page = pages[current];
  const markedHere = page ? marks.find((b) => findPage(pages, b) === current) : undefined;
  const chapterTitle = page && book ? book.chapters[page.chapter]?.title : '';
  const percent = pages.length > 1 ? Math.round((current / (pages.length - 1)) * 100) : 100;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (Math.abs(width - size.width) > 1 || Math.abs(height - size.height) > 1) setSize({ width, height });
  };

  // Tapping the left or right edge of the page turns it, like an e-reader.
  const tapTurn = (pageX: number) => {
    if (pageX < size.width * 0.28) step(-1);
    else if (pageX > size.width * 0.72) step(1);
  };

  const renderPage = ({ item, index }: { item: Page; index: number }) => {
    const chapter = book!.chapters[item.chapter];
    return (
      <Pressable
        accessible={false}
        onPress={(e) => tapTurn(e.nativeEvent.pageX)}
        style={[styles.page, { width: size.width, height: size.height, backgroundColor: theme.bg }]}>
        {item.chapterTitle && (
          <Text style={[styles.chapterTitle, { color: theme.text, fontSize: fontSize * 1.3, lineHeight: lineHeight * 1.3 }]}>
            {item.chapterTitle}
          </Text>
        )}
        {item.pieces.map((piece) => {
          const text = chapter.paragraphs[piece.para];
          // Pressable rather than Text's own onLongPress, which react-native-web doesn't support.
          return (
            <Pressable
              key={`${index}-${piece.para}-${piece.from}`}
              accessibilityHint="Long-press to save this passage"
              delayLongPress={450}
              onPress={(e) => tapTurn(e.nativeEvent.pageX)}
              onLongPress={() => setClip({ text, position: { chapter: item.chapter, para: piece.para, char: 0 } })}>
              <Text style={[styles.paragraph, { color: theme.text, fontSize, lineHeight, marginBottom: lineHeight * 0.5 }]}>
                {text.slice(piece.from, piece.to)}
              </Text>
            </Pressable>
          );
        })}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.topBar, { backgroundColor: theme.bar }]}>
        <Pressable accessibilityLabel="Close book" onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))} style={styles.iconButton}>
          <Text style={[styles.icon, { color: theme.text }]}>‹</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1}>
            {book?.title ?? ''}
          </Text>
          <Text style={[styles.chapterLabel, { color: theme.muted }]} numberOfLines={1}>
            {chapterTitle}
          </Text>
        </View>
        <Pressable accessibilityLabel="Contents and bookmarks" onPress={() => setPanel('contents')} style={styles.iconButton}>
          <Text style={[styles.icon, { color: theme.text }]}>☰</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={markedHere ? 'Remove bookmark' : 'Bookmark this page'}
          disabled={!page}
          onPress={() => page && toggleBookmark(readerId, markedHere ?? pageStart(page), `${chapterTitle} · page ${current + 1}`)}
          style={styles.iconButton}>
          <Text style={[styles.icon, { color: markedHere ? colors.accent : theme.text }]}>{markedHere ? '★' : '☆'}</Text>
        </Pressable>
        <Pressable accessibilityLabel="Text size and theme" onPress={() => setPanel('settings')} style={styles.iconButton}>
          <Text style={[styles.aa, { color: theme.text }]}>Aa</Text>
        </Pressable>
      </View>

      <View style={styles.list} onLayout={onLayout} {...responder.panHandlers}>
        {error ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: theme.text }]}>{error}</Text>
          </View>
        ) : !book || !pages.length ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.muted} />
            <Text style={[styles.message, { color: theme.muted }]}>Opening book…</Text>
          </View>
        ) : (
          <View style={{ flex: 1, transform: [{ scale: pinch }] }}>
            <FlatList
              key={`${fontSize}-${size.width}-${size.height}`}
              ref={list}
              horizontal
              pagingEnabled
              data={pages}
              renderItem={renderPage}
              keyExtractor={(_, i) => String(i)}
              initialScrollIndex={startIndex}
              getItemLayout={(_, index) => ({ length: size.width, offset: size.width * index, index })}
              initialNumToRender={2}
              windowSize={5}
              maxToRenderPerBatch={3}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewable}
              viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            />
          </View>
        )}
      </View>

      <View style={[styles.bottomBar, { backgroundColor: theme.bar }]}>
        <Pressable accessibilityLabel="Previous page" onPress={() => step(-1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: theme.text }]}>‹</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <View style={[styles.track, { backgroundColor: theme.muted + '44' }]}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
          <Text style={[styles.pageLabel, { color: theme.muted }]}>
            {pages.length ? `Page ${current + 1} of ${pages.length} · ${percent}%` : ' '}
          </Text>
        </View>
        <Pressable accessibilityLabel="Next page" onPress={() => step(1)} style={styles.navButton}>
          <Text style={[styles.navText, { color: theme.text }]}>›</Text>
        </Pressable>
      </View>

      <Modal visible={panel === 'settings'} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPanel(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.bar }]} onPress={() => {}}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Text size</Text>
            <View style={styles.row}>
              <Pressable onPress={() => changeFont(fontSize - 2)} style={[styles.sizeButton, { borderColor: theme.muted }]}>
                <Text style={[styles.sizeSmall, { color: theme.text }]}>A−</Text>
              </Pressable>
              <Text style={[styles.sizeValue, { color: theme.text }]}>{fontSize}</Text>
              <Pressable onPress={() => changeFont(fontSize + 2)} style={[styles.sizeButton, { borderColor: theme.muted }]}>
                <Text style={[styles.sizeLarge, { color: theme.text }]}>A+</Text>
              </Pressable>
            </View>
            <Text style={[styles.hint, { color: theme.muted }]}>
              Tips: pinch with two fingers to zoom, tap the page edges or use the arrow keys to turn pages, and long-press a
              paragraph to save it to a stash.
            </Text>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Theme</Text>
            <View style={styles.row}>
              {(Object.keys(THEMES) as ReaderTheme[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setReaderSettings({ theme: t })}
                  style={[styles.themeButton, { backgroundColor: THEMES[t].bg, borderColor: t === readerSettings.theme ? colors.accent : theme.muted }]}>
                  <Text style={{ color: THEMES[t].text, fontWeight: '700' }}>{THEMES[t].label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={panel === 'contents'} transparent animationType="slide" onRequestClose={() => setPanel(null)}>
        <View style={[styles.full, { backgroundColor: theme.bg }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contentsHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Contents</Text>
              <Pressable onPress={() => setPanel(null)} style={styles.iconButton}>
                <Text style={[styles.icon, { color: theme.text }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.contentsList}>
              {marks.length > 0 && (
                <>
                  <Text style={[styles.section, { color: theme.muted }]}>Bookmarks</Text>
                  {marks.map((b) => (
                    <View key={b.id} style={[styles.contentsRow, { borderColor: theme.muted + '33' }]}>
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() => {
                          setPanel(null);
                          goTo(findPage(pages, b));
                        }}>
                        <Text style={[styles.contentsText, { color: theme.text }]}>★ {b.label}</Text>
                      </Pressable>
                      <Pressable accessibilityLabel="Delete bookmark" onPress={() => removeBookmark(readerId, b.id)}>
                        <Text style={{ color: theme.muted }}>Remove</Text>
                      </Pressable>
                    </View>
                  ))}
                  <Text style={[styles.section, { color: theme.muted }]}>Chapters</Text>
                </>
              )}
              {book?.chapters.map((c, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setPanel(null);
                    goTo(chapterStarts[i] ?? 0);
                  }}
                  style={[styles.contentsRow, { borderColor: theme.muted + '33' }]}>
                  <Text style={[styles.contentsText, { color: theme.text }, page?.chapter === i && styles.contentsCurrent]} numberOfLines={2}>
                    {c.title}
                  </Text>
                  <Text style={{ color: theme.muted }}>{(chapterStarts[i] ?? 0) + 1}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Keyed so each long-press starts with a fresh sheet. */}
      <ClipSheet
        key={clip ? `${clip.position.chapter}-${clip.position.para}` : 'none'}
        clip={clip}
        book={book}
        bookId={id}
        kind={kind}
        onClose={() => setClip(null)}
      />
    </SafeAreaView>
  );
}

/** Long-press a paragraph to save it as a quote card in a stash. */
function ClipSheet({
  clip, book, bookId, kind, onClose,
}: {
  clip: { text: string; position: ReaderPosition } | null;
  book: FullBook | null;
  bookId: string;
  kind?: string;
  onClose: () => void;
}) {
  const { stashes, saveClip, toggleInStash } = useStore();
  const [saved, setSaved] = useState<Idea | null>(null);
  const [savedTo, setSavedTo] = useState<string[]>([]);

  if (!clip || !book) return null;
  const passage = clip.text.length > 700 ? `${clip.text.slice(0, 700).replace(/\s+\S*$/, '')}…` : clip.text;

  const save = (stashId: string) => {
    const idea =
      saved ??
      saveClip({
        topicId: kind === 'own' ? '' : classicById[bookId]?.topicId ?? '',
        title: '',
        body: passage,
        author: book.author,
        cite: `${book.title}, ${book.chapters[clip.position.chapter]?.title ?? ''}`.replace(/, $/, ''),
      });
    setSaved(idea);
    if (!savedTo.includes(stashId)) {
      toggleInStash(stashId, idea.id);
      setSavedTo((s) => [...s, stashId]);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>Save this passage</Text>
          <ScrollView style={styles.passageBox}>
            <Text style={styles.passage}>“{passage}”</Text>
          </ScrollView>
          {stashes.map((s) => {
            const done = savedTo.includes(s.id);
            return (
              <Pressable key={s.id} onPress={() => save(s.id)} style={styles.stashRow}>
                <Text style={styles.stashName}>{s.name}</Text>
                <Text style={{ color: done ? colors.accent : colors.muted }}>{done ? '★ Saved' : '☆'}</Text>
              </Pressable>
            );
          })}
          <Pressable onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneText}>{savedTo.length ? 'Done' : 'Cancel'}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, height: 52, gap: 2 },
  iconButton: { minWidth: 40, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  icon: { fontSize: 22, fontWeight: '600' },
  aa: { fontSize: 17, fontWeight: '800' },
  titleWrap: { flex: 1, paddingHorizontal: 4 },
  bookTitle: { fontSize: 15, fontWeight: '700' },
  chapterLabel: { fontSize: 12 },
  list: { flex: 1, overflow: 'hidden' },
  page: { paddingHorizontal: PAD_X, paddingVertical: PAD_Y, overflow: 'hidden' },
  chapterTitle: { fontFamily: serif, fontWeight: '800', marginBottom: 16 },
  paragraph: { fontFamily: serif },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  message: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 6, gap: 6 },
  navButton: { width: 44, height: 40, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 26, fontWeight: '600' },
  progressWrap: { flex: 1, gap: 4 },
  track: { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { height: 3, backgroundColor: colors.accent },
  pageLabel: { fontSize: 12, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { padding: 20, paddingBottom: 32, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12, maxHeight: '85%' },
  sheetTitle: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sizeButton: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  sizeSmall: { fontSize: 15, fontWeight: '700' },
  sizeLarge: { fontSize: 22, fontWeight: '700' },
  sizeValue: { fontSize: 16, fontWeight: '700', width: 32, textAlign: 'center' },
  hint: { fontSize: 13 },
  themeButton: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 2 },
  full: { flex: 1 },
  contentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  contentsList: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 4 },
  contentsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  contentsText: { flex: 1, fontSize: 16 },
  contentsCurrent: { fontWeight: '800' },
  passageBox: { maxHeight: 180 },
  passage: { color: colors.text, fontFamily: serif, fontStyle: 'italic', fontSize: 16, lineHeight: 24 },
  stashRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 12, backgroundColor: colors.surfaceRaised },
  stashName: { color: colors.text, fontSize: 16 },
  doneButton: { alignItems: 'center', paddingVertical: 14, borderRadius: 999, backgroundColor: colors.accent },
  doneText: { color: colors.onAccent, fontWeight: '800' },
});
