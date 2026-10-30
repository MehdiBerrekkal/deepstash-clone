import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
  type GestureResponderEvent, type LayoutChangeEvent, type TextStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageFlip, type PageFlipHandle } from '@/components/PageFlip';
import { Scrubber } from '@/components/Scrubber';
import { BOOK_THEMES, READER_FONTS, chapterLabel, displayFont, displayItalic, typeset, type BookTheme } from '@/lib/bookType';
import { classicById, loadClassic, type FullBook } from '@/lib/fullbook';
import { loadOwnBook } from '@/lib/ownbooks';
import { findPage, pageStart, paginate, type Page } from '@/lib/paginate';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Idea, ReaderFont, ReaderPosition, ReaderTheme } from '@/lib/types';

const MIN_FONT = 13;
const MAX_FONT = 30;
/** Room above the text for the running head, and below it for the page number. */
const HEAD = 42;
const FOOT = 40;
/** Open-book view when the reading area is landscape and wide enough for two pages. */
const SPREAD_MIN_WIDTH = 700;
/** Controls fade out after this long without a tap. */
const CHROME_HIDE_MS = 3500;

/** Hyphenation where the platform supports it (Android natively, browsers through CSS). */
const hyphenate = Platform.select<TextStyle>({
  web: { hyphens: 'auto', WebkitHyphens: 'auto' } as TextStyle,
  default: {},
});

/** Paginated full-book reader for bundled classics (kind=classic) and the user's own EPUBs (kind=own). */
export default function FullReaderScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: 'classic' | 'own' }>();
  const { ready } = useStore();
  // Wait for saved progress to load (e.g. when the reader is opened from a link) so it resumes in the right place.
  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: BOOK_THEMES.light.desk }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={BOOK_THEMES.light.soft} />
      </View>
    );
  }
  return <Reader id={id} kind={kind} />;
}

function Reader({ id, kind }: { id: string; kind?: 'classic' | 'own' }) {
  const readerId = `${kind === 'own' ? 'own' : 'classic'}:${id}`;
  const { readerSettings, setReaderSettings, readerProgress, setReaderPosition, bookmarks, toggleBookmark, removeBookmark } = useStore();
  const [rawBook, setBook] = useState<FullBook | null>(null);
  // Typeset once, before paginating, so page offsets line up with the text that's drawn.
  const book = useMemo<FullBook | null>(
    () => (rawBook ? { ...rawBook, chapters: rawBook.chapters.map((c) => ({ title: typeset(c.title), paragraphs: c.paragraphs.map(typeset) })) } : null),
    [rawBook],
  );
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [panel, setPanel] = useState<null | 'settings' | 'contents'>(null);
  const [clip, setClip] = useState<{ text: string; position: ReaderPosition } | null>(null);
  const [chrome, setChrome] = useState(true);
  const flip = useRef<PageFlipHandle>(null);
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // The position survives re-pagination, so changing the text size keeps your place.
  const [anchor, setAnchor] = useState<ReaderPosition | null>(() => readerProgress[readerId] ?? null);

  const theme = BOOK_THEMES[readerSettings.theme] ?? BOOK_THEMES.light;
  const fontKey: ReaderFont = readerSettings.font ?? 'literata';
  const font = READER_FONTS[fontKey];
  const fontSize = readerSettings.fontSize;
  const lineHeight = Math.round(fontSize * font.leading);

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

  // Controls fade away while you read; any tap in the middle of the page brings them back.
  useEffect(() => {
    if (!chrome || panel || !book) return;
    const t = setTimeout(() => setChrome(false), CHROME_HIDE_MS);
    return () => clearTimeout(t);
  }, [chrome, panel, book]);

  const spread = size.width > size.height && size.width >= SPREAD_MIN_WIDTH;
  const pageWidth = spread ? size.width / 2 : size.width;
  // A comfortable measure: generous margins that grow with the page, wider toward the outside edge in a spread.
  const margin = Math.round(Math.min(64, Math.max(24, pageWidth * 0.085)));
  const textWidth = pageWidth - margin * 2;
  const textHeight = size.height - HEAD - FOOT;
  const openerSink = Math.round(size.height * 0.12);
  const openerLines = Math.ceil((openerSink + fontSize * 1.9 * 1.25 * 2 + 64) / lineHeight);

  const pages = useMemo(
    () =>
      book && size.width > 0
        ? paginate(book, { width: textWidth, height: textHeight, fontSize, lineHeight, charWidth: font.charWidth, paragraphGap: 0.15, openerLines })
        : [],
    [book, size.width, textWidth, textHeight, fontSize, lineHeight, font.charWidth, openerLines],
  );

  // The page shown is derived from a text position, so rotating or resizing the text keeps your place.
  const anchorPage = pages.length && anchor ? findPage(pages, anchor) : 0;
  const leaf = spread ? Math.floor(anchorPage / 2) : anchorPage;
  const current = spread ? leaf * 2 : leaf;

  const chapterStarts = useMemo(() => {
    const starts: number[] = [];
    pages.forEach((p, i) => {
      if (starts[p.chapter] === undefined) starts[p.chapter] = i;
    });
    return starts;
  }, [pages]);

  /** Jump straight to a page (contents, bookmarks, the scrubber) without the turn animation. */
  const goTo = useCallback(
    (index: number) => {
      const target = pages[Math.min(Math.max(index, 0), pages.length - 1)];
      if (!target) return;
      const start = pageStart(target);
      setAnchor(start);
      setReaderPosition(readerId, start, pages.length > 1 ? index / (pages.length - 1) : 1);
    },
    [pages, readerId, setReaderPosition],
  );

  const onLeafChange = useCallback((next: number) => goTo(spread ? next * 2 : next), [goTo, spread]);
  const step = useCallback((dir: 1 | -1) => flip.current?.turn(dir), []);

  const changeFont = useCallback(
    (next: number) => setReaderSettings({ fontSize: Math.min(MAX_FONT, Math.max(MIN_FONT, Math.round(next))) }),
    [setReaderSettings],
  );

  // Arrow keys turn pages on the web.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof globalThis.addEventListener !== 'function') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') step(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') step(-1);
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [step]);

  const marks = bookmarks[readerId] ?? [];
  const page = pages[current];
  const visible = spread ? [current, current + 1] : [current];
  const markedHere = page ? marks.find((b) => visible.includes(findPage(pages, b))) : undefined;
  const chapterTitle = page && book ? book.chapters[page.chapter]?.title ?? '' : '';
  const percent = pages.length > 1 ? Math.round((current / (pages.length - 1)) * 100) : 100;
  const pageLabel = spread && current + 1 < pages.length ? `Pages ${current + 1}–${current + 2}` : `Page ${current + 1}`;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (Math.abs(width - size.width) > 1 || Math.abs(height - size.height) > 1) setSize({ width, height });
  };

  // Tap the outer edges to turn the page, like an e-reader; tap the middle to show or hide the controls.
  const onTap = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.pageX;
    if (x < window.width * 0.22) step(-1);
    else if (x > window.width * 0.78) step(1);
    else setChrome((c) => !c);
  };

  const renderPage = (index: number, width: number) => (
    <BookPage
      book={book!}
      page={pages[index]}
      index={index}
      width={width}
      height={size.height}
      margin={margin}
      spreadSide={spread ? (index % 2 === 0 ? 'left' : 'right') : undefined}
      theme={theme}
      fontKey={fontKey}
      fontSize={fontSize}
      lineHeight={lineHeight}
      openerSink={openerSink}
      onTap={onTap}
      onLongPressParagraph={(text, position) => setClip({ text, position })}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: spread ? theme.desk : theme.paper }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[styles.stage, spread && styles.stageSpread]} onLayout={onLayout}>
          {error ? (
            <View style={styles.center}>
              <Text style={[styles.message, { color: theme.ink, fontFamily: font.regular }]}>{error}</Text>
            </View>
          ) : !book || !pages.length ? (
            <View style={styles.center}>
              <ActivityIndicator color={theme.soft} />
              <Text style={[styles.message, { color: theme.soft, fontFamily: displayItalic }]}>Opening the book…</Text>
            </View>
          ) : (
            <PageFlip
              ref={flip}
              width={size.width}
              height={size.height}
              spread={spread}
              pageCount={pages.length}
              index={leaf}
              onIndexChange={onLeafChange}
              renderPage={renderPage}
              shade={theme.shade}
              onPinchEnd={(scale) => changeFont(fontSize * scale)}
            />
          )}
        </View>
      </SafeAreaView>

      {chrome && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(260)}
          style={[styles.topBar, { backgroundColor: theme.chrome, paddingTop: insets.top + 4, borderBottomColor: theme.rule }]}>
          <Pressable
            accessibilityLabel="Close book"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}
            style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText }]}>‹</Text>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={[styles.bookTitle, { color: theme.chromeText, fontFamily: displayFont }]} numberOfLines={1}>
              {book?.title ?? ''}
            </Text>
            <Text style={[styles.chapterLabel, { color: theme.soft }]} numberOfLines={1}>
              {chapterTitle}
            </Text>
          </View>
          <Pressable accessibilityLabel="Contents and bookmarks" onPress={() => setPanel('contents')} style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText }]}>☰</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={markedHere ? 'Remove bookmark' : 'Bookmark this page'}
            disabled={!page}
            onPress={() => page && toggleBookmark(readerId, markedHere ?? pageStart(page), `${chapterTitle} · ${pageLabel.toLowerCase()}`)}
            style={styles.iconButton}>
            <Text style={[styles.icon, { color: markedHere ? '#B5492F' : theme.chromeText }]}>{markedHere ? '★' : '☆'}</Text>
          </Pressable>
          <Pressable accessibilityLabel="Text size, font and theme" onPress={() => setPanel('settings')} style={styles.iconButton}>
            <Text style={[styles.aa, { color: theme.chromeText, fontFamily: displayFont }]}>Aa</Text>
          </Pressable>
        </Animated.View>
      )}

      {chrome && pages.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(260)}
          style={[styles.bottomBar, { backgroundColor: theme.chrome, paddingBottom: insets.bottom + 8, borderTopColor: theme.rule }]}>
          <Scrubber
            theme={theme}
            count={pages.length}
            current={current}
            chapterStarts={chapterStarts}
            onSeek={(i) => {
              goTo(i);
              setChrome(true);
            }}
          />
          <Text style={[styles.pageLabel, { color: theme.soft }]}>
            {pageLabel} of {pages.length} · {percent}%
          </Text>
        </Animated.View>
      )}

      <Modal visible={panel === 'settings'} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPanel(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.paper, borderColor: theme.rule }]} onPress={() => {}}>
            <Text style={[styles.sheetTitle, { color: theme.ink, fontFamily: displayFont }]}>Font</Text>
            <View style={styles.row}>
              {(Object.keys(READER_FONTS) as ReaderFont[]).map((f) => (
                <Pressable
                  key={f}
                  accessibilityLabel={`Font ${READER_FONTS[f].label}`}
                  onPress={() => setReaderSettings({ font: f })}
                  style={[styles.choice, { borderColor: f === fontKey ? theme.ink : theme.rule }]}>
                  <Text style={{ color: theme.ink, fontFamily: READER_FONTS[f].regular, fontSize: 20 }}>Ag</Text>
                  <Text style={{ color: theme.soft, fontSize: 12 }}>{READER_FONTS[f].label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sheetTitle, { color: theme.ink, fontFamily: displayFont }]}>Size</Text>
            <View style={styles.row}>
              <Pressable onPress={() => changeFont(fontSize - 1)} style={[styles.sizeButton, { borderColor: theme.rule }]}>
                <Text style={{ color: theme.ink, fontFamily: font.regular, fontSize: 15 }}>A−</Text>
              </Pressable>
              <Text style={[styles.sizeValue, { color: theme.ink }]}>{fontSize}</Text>
              <Pressable onPress={() => changeFont(fontSize + 1)} style={[styles.sizeButton, { borderColor: theme.rule }]}>
                <Text style={{ color: theme.ink, fontFamily: font.regular, fontSize: 22 }}>A+</Text>
              </Pressable>
            </View>

            <Text style={[styles.sheetTitle, { color: theme.ink, fontFamily: displayFont }]}>Paper</Text>
            <View style={styles.row}>
              {(Object.keys(BOOK_THEMES) as ReaderTheme[]).map((t) => (
                <Pressable
                  key={t}
                  accessibilityLabel={`Theme ${BOOK_THEMES[t].label}`}
                  onPress={() => setReaderSettings({ theme: t })}
                  style={[styles.choice, { backgroundColor: BOOK_THEMES[t].paper, borderColor: t === readerSettings.theme ? theme.ink : theme.rule }]}>
                  <Text style={{ color: BOOK_THEMES[t].ink, fontFamily: font.regular, fontSize: 18 }}>Aa</Text>
                  <Text style={{ color: BOOK_THEMES[t].soft, fontSize: 12 }}>{BOOK_THEMES[t].label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.hint, { color: theme.soft }]}>
              Drag a page or tap the edges to turn it, and tap the middle to show or hide these controls. Pinch to zoom, turn
              your phone sideways for an open book, and long-press a paragraph to save it.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={panel === 'contents'} transparent animationType="slide" onRequestClose={() => setPanel(null)}>
        <View style={[styles.full, { backgroundColor: theme.paper }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contentsHeader}>
              <Text style={[styles.contentsTitle, { color: theme.ink, fontFamily: displayFont }]}>Contents</Text>
              <Pressable onPress={() => setPanel(null)} style={styles.iconButton}>
                <Text style={[styles.icon, { color: theme.ink }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.contentsList}>
              {marks.length > 0 && (
                <>
                  <Text style={[styles.section, { color: theme.soft }]}>Bookmarks</Text>
                  {marks.map((b) => (
                    <View key={b.id} style={[styles.contentsRow, { borderColor: theme.rule }]}>
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() => {
                          setPanel(null);
                          goTo(findPage(pages, b));
                        }}>
                        <Text style={[styles.contentsText, { color: theme.ink, fontFamily: font.regular }]}>★ {b.label}</Text>
                      </Pressable>
                      <Pressable accessibilityLabel="Delete bookmark" onPress={() => removeBookmark(readerId, b.id)}>
                        <Text style={{ color: theme.soft }}>Remove</Text>
                      </Pressable>
                    </View>
                  ))}
                  <Text style={[styles.section, { color: theme.soft }]}>Chapters</Text>
                </>
              )}
              {book?.chapters.map((c, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setPanel(null);
                    goTo(chapterStarts[i] ?? 0);
                  }}
                  style={[styles.contentsRow, { borderColor: theme.rule }]}>
                  <Text
                    style={[styles.contentsText, { color: theme.ink, fontFamily: page?.chapter === i ? font.bold : font.regular }]}
                    numberOfLines={2}>
                    {c.title}
                  </Text>
                  <Text style={{ color: theme.soft, fontFamily: displayItalic, fontSize: 16 }}>{(chapterStarts[i] ?? 0) + 1}</Text>
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
    </View>
  );
}

type BookPageProps = {
  book: FullBook;
  page: Page;
  index: number;
  width: number;
  height: number;
  margin: number;
  spreadSide?: 'left' | 'right';
  theme: BookTheme;
  fontKey: ReaderFont;
  fontSize: number;
  lineHeight: number;
  openerSink: number;
  onTap: (e: GestureResponderEvent) => void;
  onLongPressParagraph: (text: string, position: ReaderPosition) => void;
};

/** One printed page: running head, text block (or chapter opener), and folio, on toned paper. */
function BookPage({
  book, page, index, width, height, margin, spreadSide, theme, fontKey, fontSize, lineHeight, openerSink, onTap, onLongPressParagraph,
}: BookPageProps) {
  const font = READER_FONTS[fontKey];
  const chapter = book.chapters[page.chapter];
  const opener = page.chapterTitle ? chapterLabel(page.chapterTitle) : null;
  // Left pages of a spread carry the book title, right pages the chapter, as in a printed book.
  const runningHead = spreadSide === 'left' ? book.title : chapter.title;
  // Justify only when lines are long enough (or Android can hyphenate); short ragged lines beat rivers of space.
  const textWidth = width - margin * 2;
  const justify = Platform.OS === 'android' || textWidth / (fontSize * font.charWidth) >= 44;
  const body: TextStyle = { color: theme.ink, fontFamily: font.regular, fontSize, lineHeight, textAlign: justify ? 'justify' : 'left' };

  return (
    <Pressable accessible={false} onPress={onTap} style={{ width, height, backgroundColor: theme.paper }}>
      {/* Faint toning toward the edges, and the inner gutter shadow, like real paper. */}
      <LinearGradient pointerEvents="none" colors={[theme.vignette, 'transparent', 'transparent', theme.vignette]} locations={[0, 0.1, 0.9, 1]} style={StyleSheet.absoluteFill} />
      <LinearGradient
        pointerEvents="none"
        colors={spreadSide === 'left' ? ['transparent', theme.vignette] : [theme.vignette, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.sideTone, spreadSide === 'left' ? { right: 0 } : { left: 0 }]}
      />

      {!opener && (
        <Text numberOfLines={1} style={[styles.runningHead, { color: theme.soft, fontFamily: displayFont, left: margin, right: margin }]}>
          {runningHead.toUpperCase()}
        </Text>
      )}

      <View style={{ position: 'absolute', top: HEAD, left: margin, right: margin, bottom: FOOT, overflow: 'hidden' }}>
        {opener && (
          <View style={{ paddingTop: openerSink, marginBottom: lineHeight * 0.9, alignItems: 'center' }}>
            {opener.kicker && <Text style={[styles.kicker, { color: theme.soft, fontFamily: displayFont }]}>{opener.kicker.toUpperCase()}</Text>}
            <Text style={[styles.openerTitle, { color: theme.ink, fontFamily: displayFont, fontSize: fontSize * 1.9, lineHeight: fontSize * 1.9 * 1.15 }]}>
              {opener.title}
            </Text>
            <Text style={[styles.ornament, { color: theme.rule }]}>❦</Text>
          </View>
        )}
        {page.pieces.map((piece, i) => {
          const text = chapter.paragraphs[piece.para];
          const slice = text.slice(piece.from, piece.to);
          const firstOfChapter = piece.para === 0 && piece.from === 0;
          // Book convention: no indent on a chapter's first paragraph, indents (not gaps) between the rest.
          const indent = piece.from === 0 && !firstOfChapter && !(opener && i === 0) && !slice.includes('\n');
          const position = { chapter: page.chapter, para: piece.para, char: 0 };
          return (
            <Pressable
              key={`${index}-${piece.para}-${piece.from}`}
              accessibilityHint="Long-press to save this passage"
              delayLongPress={450}
              onPress={onTap}
              onLongPress={() => onLongPressParagraph(text, position)}>
              <Text style={[body, hyphenate, { marginBottom: lineHeight * 0.15 }]} android_hyphenationFrequency="full">
                {opener && i === 0 ? (
                  <>
                    {/* A raised initial opens each chapter. */}
                    <Text style={{ fontFamily: displayFont, fontSize: fontSize * 2.4, color: theme.ink }}>{slice.charAt(0)}</Text>
                    {slice.slice(1)}
                  </>
                ) : (
                  <>
                    {indent ? ' ' : ''}
                    {slice}
                  </>
                )}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[
          styles.folio,
          { color: theme.soft, fontFamily: displayItalic, left: margin, right: margin, textAlign: spreadSide === 'left' ? 'left' : spreadSide === 'right' ? 'right' : 'center' },
        ]}>
        {index + 1}
      </Text>
    </Pressable>
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
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {}}>
          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: displayFont }]}>Save this passage</Text>
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
  stage: { flex: 1, overflow: 'hidden' },
  stageSpread: { margin: 14, borderRadius: 4, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  sideTone: { position: 'absolute', top: 0, bottom: 0, width: 28 },
  runningHead: { position: 'absolute', top: 18, fontSize: 11, letterSpacing: 2, textAlign: 'center' },
  kicker: { fontSize: 13, letterSpacing: 3, marginBottom: 10 },
  openerTitle: { textAlign: 'center' },
  ornament: { fontSize: 20, marginTop: 14 },
  folio: { position: 'absolute', bottom: 14, fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  message: { fontSize: 18, textAlign: 'center', lineHeight: 26 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingBottom: 6,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: { minWidth: 40, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  icon: { fontSize: 22, fontWeight: '500' },
  aa: { fontSize: 20 },
  titleWrap: { flex: 1, paddingHorizontal: 4 },
  bookTitle: { fontSize: 18 },
  chapterLabel: { fontSize: 12 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 10, gap: 4, borderTopWidth: StyleSheet.hairlineWidth },
  pageLabel: { fontSize: 12, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { padding: 20, paddingBottom: 32, borderTopLeftRadius: 22, borderTopRightRadius: 22, gap: 12, maxHeight: '88%', borderWidth: StyleSheet.hairlineWidth },
  sheetTitle: { fontSize: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  choice: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, gap: 2 },
  sizeButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  sizeValue: { fontSize: 16, fontWeight: '700', width: 32, textAlign: 'center' },
  hint: { fontSize: 13, lineHeight: 19 },
  full: { flex: 1 },
  contentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  contentsTitle: { fontSize: 28 },
  contentsList: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 16, marginBottom: 4 },
  contentsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  contentsText: { flex: 1, fontSize: 17 },
  passageBox: { maxHeight: 180 },
  passage: { color: colors.text, fontFamily: 'Literata_400Regular_Italic', fontSize: 16, lineHeight: 25 },
  stashRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 12, backgroundColor: colors.surfaceRaised },
  stashName: { color: colors.text, fontSize: 16 },
  doneButton: { alignItems: 'center', paddingVertical: 14, borderRadius: 999, backgroundColor: colors.accent },
  doneText: { color: colors.onAccent, fontWeight: '800' },
});
