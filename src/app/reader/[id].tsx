import { useFonts } from 'expo-font';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, AppState, FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type GestureResponderEvent, type LayoutChangeEvent, type TextStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookOpening } from '@/components/BookOpening';
import { HighlightSheet } from '@/components/HighlightSheet';
import { PageFlip, type PageFlipHandle } from '@/components/PageFlip';
import { Scrubber } from '@/components/Scrubber';
import { VoicePicker } from '@/components/VoicePicker';
import { voiceForLanguage, voiceSetting } from '@/lib/lang';
import { BOOK_THEMES, HIGHLIGHT_COLORS, READER_FONTS, bookFonts, chooseReaderTheme, measuredCharWidth, readerThemeFor, chapterLabel, displayFont, displayItalic, typeset, type BookTheme } from '@/lib/bookType';
import { classicAsSource } from '@/lib/classicSource';
import { classicById, loadClassic, type FullBook } from '@/lib/fullbook';
import { LISTEN_RATES, useListen, type Sentence, type SleepTimer } from '@/lib/listen';
import { isNatural, naturalVoiceInfo } from '@/lib/neuralVoice';
import { loadOwnBook } from '@/lib/ownbooks';
import { findPage, pageStart, paginate, type Page } from '@/lib/paginate';
import { useScheme } from '@/lib/appearance';
import { celebrate } from '@/lib/celebrate';
import { setScreenColor } from '@/lib/safeArea';
import { searchBook, type BookHit } from '@/lib/search';
import { CHARS_PER_WORD, DEFAULT_WPM, formatDuration, readingSpeed } from '@/lib/stats';
import { useStore } from '@/lib/store';
import type { Highlight, ReaderFont, ReaderPosition, ReaderTheme } from '@/lib/types';

const MIN_FONT = 13;
const MAX_FONT = 30;
/** Room above the text for the running head, and below it for the page number. */
const HEAD = 50;
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
  const { id, kind, at } = useLocalSearchParams<{ id: string; kind?: 'classic' | 'own'; at?: string }>();
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
  const [chapter, para, char] = (at ?? '').split('.').map(Number);
  const start = at && [chapter, para, char].every(Number.isFinite) ? { chapter, para, char } : undefined;
  return <Reader key={at ?? ''} id={id} kind={kind} start={start} />;
}

function Reader({ id, kind, start }: { id: string; kind?: 'classic' | 'own'; start?: ReaderPosition }) {
  const readerId = `${kind === 'own' ? 'own' : 'classic'}:${id}`;
  const { readerSettings, setReaderSettings, readerProgress, setReaderPosition, bookmarks, toggleBookmark, removeBookmark, highlights } = useStore();
  const { logReading, markReaderFinished, readingLog, finishedReaders, ownBooks } = useStore();
  const [rawBook, setBook] = useState<FullBook | null>(null);
  // Typeset once, before paginating, so page offsets line up with the text that's drawn.
  const book = useMemo<FullBook | null>(
    () => (rawBook ? { ...rawBook, chapters: rawBook.chapters.map((c) => ({ title: typeset(c.title), paragraphs: c.paragraphs.map(typeset) })) } : null),
    [rawBook],
  );
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [panel, setPanel] = useState<null | 'settings' | 'contents' | 'voice' | 'sleep' | 'search'>(null);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<BookHit | null>(null);
  const [marking, setMarking] = useState<{ chapter: number; para: number } | null>(null);
  const [chrome, setChrome] = useState(true);
  const flip = useRef<PageFlipHandle>(null);
  const insets = useSafeAreaInsets();
  // The position survives re-pagination, so changing the text size keeps your place.
  const [anchor, setAnchor] = useState<ReaderPosition | null>(() => start ?? readerProgress[readerId] ?? null);
  const bookHighlights = useMemo(() => highlights.filter((h) => h.readerId === readerId), [highlights, readerId]);

  // The paper follows the app's light/dark appearance unless a theme was picked here by hand.
  const scheme = useScheme();
  const themeKey = readerThemeFor(readerSettings, scheme);
  const theme = BOOK_THEMES[themeKey] ?? BOOK_THEMES.light;
  const pickTheme = (t: ReaderTheme) => setReaderSettings(chooseReaderTheme(readerSettings, scheme, t));
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  // The cover shown while the book opens.
  const [opening] = useState(() => {
    const meta = kind === 'own' ? undefined : classicById[id];
    const src = meta ? classicAsSource(meta) : undefined;
    return {
      title: meta?.title ?? '',
      author: meta?.author ?? '',
      coverUri: src?.coverUrl ?? (src?.coverId ? `https://covers.openlibrary.org/b/id/${src.coverId}-L.jpg` : undefined),
    };
  });
  const fontKey: ReaderFont = readerSettings.font ?? 'literata';
  const font = READER_FONTS[fontKey];
  const fontSize = readerSettings.fontSize;
  const lineHeight = Math.round(fontSize * font.leading);
  const language = (kind === 'own' ? ownBooks.find((b) => b.id === id)?.lang : classicById[id]?.lang) ?? 'en';
  const listenRate = readerSettings.listenRate ?? 1;
  // If the natural voice proves too slow here, stop choosing it automatically.
  const onNaturalFailed = useCallback(() => setReaderSettings({ naturalOff: true }), [setReaderSettings]);
  const listen = useListen(book, {
    rate: listenRate,
    voice: voiceForLanguage(readerSettings, language),
    language,
    preferNatural: !readerSettings.naturalOff,
    onNaturalFailed,
  });

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

  // In the browser, measure the real font so pages fill to the bottom (re-paginates once the font has loaded).
  const [fontsLoaded] = useFonts(bookFonts);
  const charWidth = useMemo(() => (fontsLoaded && measuredCharWidth(font.regular)) || font.charWidth, [fontsLoaded, font]);
  const spread = size.width > size.height && size.width >= SPREAD_MIN_WIDTH;
  // The strips behind the status bar and home indicator take the page's colour.
  useEffect(() => setScreenColor(spread ? theme.desk : theme.paper), [spread, theme]);
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
        ? paginate(book, { width: textWidth, height: textHeight, fontSize, lineHeight, charWidth, paragraphGap: 0.15, openerLines })
        : [],
    [book, size.width, textWidth, textHeight, fontSize, lineHeight, charWidth, openerLines],
  );

  // The page shown is derived from a text position, so rotating or resizing the text keeps your place.
  const anchorPage = pages.length && anchor ? findPage(pages, anchor) : 0;
  const leaf = spread ? Math.floor(anchorPage / 2) : anchorPage;
  const current = spread ? leaf * 2 : leaf;

  const [hits, setHits] = useState<BookHit[] | null>(null);
  useEffect(() => {
    if (!book) return;
    const t = setTimeout(() => setHits(query.trim().length >= 2 ? searchBook(book, query) : null), 250);
    return () => clearTimeout(t);
  }, [book, query]);

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

  // Listening turns the page with the voice. Turning pages yourself stops that until you press play or skip again.
  const following = useRef(true);
  const autoTurn = useRef(false);
  useEffect(() => {
    const s = listen.sentence;
    if (!s || !pages.length || !following.current) return;
    const target = findPage(pages, { chapter: s.chapter, para: s.para, char: s.from });
    const shown = spread ? [current, current + 1] : [current];
    if (shown.includes(target)) return;
    const ahead = spread ? Math.floor(target / 2) - leaf : target - current;
    // Turn after this render: the next page animates like a real turn, anything further jumps.
    const t = setTimeout(() => {
      if (ahead === 1) {
        autoTurn.current = true;
        flip.current?.turn(1);
      } else goTo(target);
    }, 0);
    return () => clearTimeout(t);
    // Only a new sentence should move the page, not your own page turns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listen.sentence, pages]);

  const listenControl = useCallback(
    (action: () => void) => {
      following.current = true;
      action();
    },
    [],
  );
  // While you read, get the voice ready for this page so pressing play starts at once.
  const warm = listen.warm;
  useEffect(() => {
    const target = pages[current];
    if (!target) return;
    const t = setTimeout(() => warm(pageStart(target)), 150);
    return () => clearTimeout(t);
  }, [pages, current, warm]);

  const toggleListen = useCallback(() => {
    following.current = true;
    if (listen.sentence) listen.setPlaying(!listen.playing);
    else if (pages[current]) listen.start(pageStart(pages[current]));
  }, [listen, pages, current]);


  const onLeafChange = useCallback(
    (next: number) => {
      if (!autoTurn.current) following.current = false;
      autoTurn.current = false;
      setFound(null);
      goTo(spread ? next * 2 : next);
    },
    [goTo, spread],
  );
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

  // Reading time: counted in 15-second ticks while you're turning pages (or listening) and the app is in front.
  const lastActive = useRef(0);
  const playing = useRef(false);
  useEffect(() => {
    playing.current = listen.playing;
  }, [listen.playing]);
  useEffect(() => {
    if (!book) return;
    const tick = setInterval(() => {
      const visible = Platform.OS === 'web' ? globalThis.document?.visibilityState !== 'hidden' : AppState.currentState === 'active';
      if (visible && (playing.current || Date.now() - lastActive.current < 120_000)) logReading({ seconds: 15 });
    }, 15_000);
    return () => clearInterval(tick);
  }, [book, logReading]);

  // Characters before each page, for words read and time left.
  const charsBefore = useMemo(() => {
    const out = [0];
    for (const p of pages) out.push(out[out.length - 1] + p.pieces.reduce((n, piece) => n + piece.to - piece.from, 0));
    return out;
  }, [pages]);

  // Pages turned forward count as read; reaching the last page finishes the book.
  const seen = useRef<{ pages: Page[]; index: number } | null>(null);
  useEffect(() => {
    const before = seen.current;
    seen.current = { pages, index: current };
    lastActive.current = Date.now();
    if (!pages.length || !before || before.pages !== pages) return;
    const step = current - before.index;
    if (step > 0 && step <= 2) {
      logReading({ pages: step, words: Math.round((charsBefore[current] - charsBefore[before.index]) / CHARS_PER_WORD) });
    }
    if (step > 0 && current >= pages.length - (spread ? 2 : 1) && !finishedReaders[readerId]) {
      markReaderFinished(readerId);
      celebrate({ emoji: '📖', title: 'Book finished!', subtitle: `You read ${book?.title ?? 'it'} to the last page.` });
    }
  }, [current, pages, charsBefore, spread, readerId, logReading, markReaderFinished, finishedReaders, book]);

  const wpm = useMemo(() => readingSpeed(readingLog) ?? DEFAULT_WPM, [readingLog]);
  const minutesLeft = (end: number) => Math.max(0, charsBefore[end] - charsBefore[current]) / CHARS_PER_WORD / wpm;

  const marks = bookmarks[readerId] ?? [];
  const page = pages[current];
  const visible = spread ? [current, current + 1] : [current];
  const markedHere = page ? marks.find((b) => visible.includes(findPage(pages, b))) : undefined;
  const chapterTitle = page && book ? book.chapters[page.chapter]?.title ?? '' : '';
  const percent = pages.length > 1 ? Math.round((current / (pages.length - 1)) * 100) : 100;
  const pageLabel = spread && current + 1 < pages.length ? `Pages ${current + 1}–${current + 2}` : `Page ${current + 1}`;

  // The player sits just above the controls when they're shown, otherwise low over the home indicator
  // (the page number hides while it's there, so it never covers text).
  const playerBottom = chrome && bottomBarHeight ? bottomBarHeight + 8 : Math.max(8, insets.bottom - 18);
  const hideFolio = !!listen.sentence;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (Math.abs(width - size.width) > 1 || Math.abs(height - size.height) > 1) setSize({ width, height });
  };

  // Pages turn only with a swipe, like a book; a tap anywhere shows or hides the controls.
  const onTap = (_e: GestureResponderEvent) => {
    lastActive.current = Date.now();
    setChrome((c) => !c);
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
      onLongPressParagraph={(chapter, para) => setMarking({ chapter, para })}
      spoken={listen.sentence}
      highlights={bookHighlights}
      found={found}
      hideFolio={hideFolio}
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
              paper={theme.paper}
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
          <Pressable accessibilityLabel={listen.sentence ? 'Listening controls' : 'Listen to this book'} onPress={toggleListen} style={styles.iconButton}>
            <Text style={[styles.icon, { color: listen.sentence ? '#B5492F' : theme.chromeText }]}>{listen.playing ? '❚❚' : '🎧'}</Text>
          </Pressable>
          <Pressable accessibilityLabel="Search in this book" onPress={() => setPanel('search')} style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText, fontSize: 20 }]}>⌕</Text>
          </Pressable>
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
          <Pressable
            accessibilityLabel={themeKey === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onPress={() => pickTheme(themeKey === 'dark' ? (readerSettings.theme === 'sepia' ? 'sepia' : 'light') : 'dark')}
            style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText, fontSize: 19 }]}>{themeKey === 'dark' ? '☀︎' : '☾'}</Text>
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
          onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}
          style={[styles.bottomBar, { backgroundColor: theme.chrome, paddingBottom: insets.bottom + 8, borderTopColor: theme.rule }]}>
          <Scrubber
            theme={theme}
            count={pages.length}
            current={current}
            chapterStarts={chapterStarts}
            onSeek={(i) => {
              following.current = false;
              goTo(i);
              setChrome(true);
            }}
          />
          <Text style={[styles.pageLabel, { color: theme.soft }]}>
            {pageLabel} of {pages.length} · {percent}%
          </Text>
          {page && (
            <Text style={[styles.pageLabel, { color: theme.soft }]}>
              {formatDuration(minutesLeft(chapterStarts[page.chapter + 1] ?? pages.length))} left in chapter ·{' '}
              {formatDuration(minutesLeft(pages.length))} in book
            </Text>
          )}
        </Animated.View>
      )}

      {(listen.loading !== null || listen.notice) && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[styles.listenNotice, { backgroundColor: theme.ink, bottom: playerBottom + (listen.sentence ? 58 : 0) }]}>
          {listen.loading !== null ? (
            <>
              <Text style={[styles.listenNoticeText, { color: theme.paper }]}>
                ✨ Downloading the natural voice · {Math.round(listen.loading * 100)}% of {naturalVoiceInfo(listen.naturalVoice)?.sizeMB ?? 63} MB (only once)
              </Text>
              <View style={[styles.noticeTrack, { backgroundColor: theme.soft }]}>
                <View style={[styles.noticeFill, { backgroundColor: theme.paper, width: `${Math.round(listen.loading * 100)}%` }]} />
              </View>
            </>
          ) : (
            <Pressable onPress={listen.dismissNotice}>
              <Text style={[styles.listenNoticeText, { color: theme.paper }]}>{listen.notice} ✕</Text>
            </Pressable>
          )}
        </Animated.View>
      )}

      {listen.sentence && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[
            styles.listenBar,
            { backgroundColor: theme.chrome, borderColor: theme.rule, bottom: playerBottom },
          ]}>
          <Pressable accessibilityLabel="Previous sentence" onPress={() => listenControl(() => listen.skip(-1))} style={styles.listenButton}>
            <Text style={[styles.listenIcon, { color: theme.chromeText }]}>⏮</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={listen.playing ? 'Pause' : 'Play'}
            onPress={() => listenControl(() => listen.setPlaying(!listen.playing))}
            style={[styles.playButton, { backgroundColor: theme.ink }]}>
            {listen.preparing ? (
              <ActivityIndicator size="small" color={theme.paper} accessibilityLabel="Preparing voice" />
            ) : (
              <Text style={[styles.playIcon, { color: theme.paper }]}>{listen.playing ? '❚❚' : '▶'}</Text>
            )}
          </Pressable>
          <Pressable accessibilityLabel="Next sentence" onPress={() => listenControl(() => listen.skip(1))} style={styles.listenButton}>
            <Text style={[styles.listenIcon, { color: theme.chromeText }]}>⏭</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Reading speed"
            onPress={() => setReaderSettings({ listenRate: LISTEN_RATES[(LISTEN_RATES.indexOf(listenRate) + 1) % LISTEN_RATES.length] })}
            style={[styles.listenChip, { borderColor: theme.rule }]}>
            <Text style={[styles.listenChipText, { color: theme.chromeText }]}>{listenRate}×</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Voice"
            onPress={() => {
              listen.setPlaying(false);
              setPanel('voice');
            }} style={[styles.listenChip, { borderColor: theme.rule }]}>
            <Text style={[styles.listenChipText, { color: theme.chromeText }]}>{listen.natural ? '✨ Natural' : listen.naturalAvailable ? '✨ Voice' : 'Voice'}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Sleep timer"
            onPress={() => setPanel('sleep')}
            style={[styles.listenChip, { borderColor: listen.sleep ? theme.ink : theme.rule }]}>
            <Text style={[styles.listenChipText, { color: theme.chromeText }]}>{sleepLabel(listen.sleep)}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={themeKey === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onPress={() => pickTheme(themeKey === 'dark' ? (readerSettings.theme === 'sepia' ? 'sepia' : 'light') : 'dark')}
            style={styles.listenButton}>
            <Text style={[styles.listenIcon, { color: theme.chromeText }]}>{themeKey === 'dark' ? '☀︎' : '☾'}</Text>
          </Pressable>
          <Pressable accessibilityLabel="Stop listening" onPress={listen.close} style={styles.listenButton}>
            <Text style={[styles.listenIcon, { color: theme.soft }]}>✕</Text>
          </Pressable>
        </Animated.View>
      )}

      <Modal visible={panel === 'voice' || panel === 'sleep'} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPanel(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.paper, borderColor: theme.rule }]} onPress={() => {}}>
            {panel === 'voice' ? (
              <VoicePicker
                theme={theme}
                fontRegular={font.regular}
                fontBold={font.bold}
                language={language}
                selectedFor={(lang) => voiceForLanguage(readerSettings, lang)}
                naturalActive={listen.natural ? listen.naturalVoice : null}
                onSelect={(v, lang) => {
                  setReaderSettings({ ...voiceSetting(lang, v), ...(isNatural(v) ? { naturalOff: false } : {}) });
                  if (isNatural(v)) listen.tryNatural();
                }}
              />
            ) : (
              <>
                <Text style={[styles.sheetTitle, { color: theme.ink, fontFamily: displayFont }]}>Sleep timer</Text>
                {SLEEP_OPTIONS.map((o) => (
                  <Pressable
                    key={o.label}
                    onPress={() => {
                      listen.setSleep(
                        o.minutes === undefined
                          ? null
                          : o.minutes === 0
                            ? { kind: 'chapter', chapter: listen.sentence?.chapter ?? 0 }
                            : { kind: 'time', until: Date.now() + o.minutes * 60_000 },
                      );
                      setPanel(null);
                    }}
                    style={[styles.contentsRow, { borderColor: theme.rule }]}>
                    <Text style={[styles.contentsText, { color: theme.ink, fontFamily: font.regular }]}>{o.label}</Text>
                  </Pressable>
                ))}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
                  onPress={() => pickTheme(t)}
                  style={[styles.choice, { backgroundColor: BOOK_THEMES[t].paper, borderColor: t === themeKey ? theme.ink : theme.rule }]}>
                  <Text style={{ color: BOOK_THEMES[t].ink, fontFamily: font.regular, fontSize: 18 }}>Aa</Text>
                  <Text style={{ color: BOOK_THEMES[t].soft, fontSize: 12 }}>{BOOK_THEMES[t].label}</Text>
                </Pressable>
              ))}
            </View>
            {readerSettings.themeOverride ? (
              <Pressable accessibilityLabel="Match the app's appearance" onPress={() => setReaderSettings({ themeOverride: undefined })}>
                <Text style={[styles.hint, { color: theme.ink, textDecorationLine: 'underline' }]}>
                  ↺ Follow the app&apos;s light/dark setting again
                </Text>
              </Pressable>
            ) : (
              <Text style={[styles.hint, { color: theme.soft }]}>
                Follows the app&apos;s light/dark setting (You → Appearance). Picking a paper here overrides it.
              </Text>
            )}
            <Text style={[styles.hint, { color: theme.soft }]}>
              Swipe a page to turn it, and tap anywhere to show or hide these controls. Pinch to zoom, turn
              your phone sideways for an open book, and long-press a paragraph to save it.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={panel === 'search'} transparent animationType="slide" onRequestClose={() => setPanel(null)}>
        <View style={[styles.full, { backgroundColor: theme.paper }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contentsHeader}>
              <TextInput
                accessibilityLabel="Search text"
                autoFocus
                value={query}
                onChangeText={setQuery}
                placeholder={`Search in ${book?.title ?? 'this book'}`}
                placeholderTextColor={theme.soft}
                returnKeyType="search"
                style={[styles.searchInput, { color: theme.ink, borderColor: theme.rule, fontFamily: font.regular }]}
              />
              <Pressable accessibilityLabel="Close search" onPress={() => setPanel(null)} style={styles.iconButton}>
                <Text style={[styles.icon, { color: theme.ink }]}>✕</Text>
              </Pressable>
            </View>
            {hits && (
              <Text style={[styles.section, { color: theme.soft, marginHorizontal: 20 }]}>
                {hits.length >= 300 ? '300+ results' : `${hits.length} ${hits.length === 1 ? 'result' : 'results'}`}
              </Text>
            )}
            <FlatList
              data={hits ?? []}
              keyExtractor={(h) => `${h.chapter}.${h.para}.${h.char}`}
              contentContainerStyle={styles.contentsList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={[styles.hint, { color: theme.soft, marginTop: 24, textAlign: 'center' }]}>
                  {hits ? 'No matches. Check the spelling or try a shorter phrase.' : 'Type a word or phrase to find every place it appears.'}
                </Text>
              }
              renderItem={({ item: h }) => (
                <Pressable
                  onPress={() => {
                    setPanel(null);
                    following.current = false;
                    setFound(h);
                    goTo(findPage(pages, h));
                  }}
                  style={[styles.hitRow, { borderColor: theme.rule }]}>
                  <Text style={{ color: theme.soft, fontSize: 12, fontFamily: displayFont }} numberOfLines={1}>
                    {(book?.chapters[h.chapter]?.title ?? '').toUpperCase()} · PAGE {findPage(pages, h) + 1}
                  </Text>
                  <Text style={{ color: theme.ink, fontFamily: font.regular, fontSize: 15, lineHeight: 22 }}>
                    {h.before}
                    <Text style={{ backgroundColor: theme.highlight, fontFamily: font.bold }}>{h.match}</Text>
                    {h.after}
                  </Text>
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
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
              {bookHighlights.length > 0 && (
                <Pressable
                  accessibilityLabel="All highlights in this book"
                  onPress={() => {
                    setPanel(null);
                    router.push({ pathname: '/highlights', params: { book: readerId } });
                  }}
                  style={[styles.contentsRow, { borderColor: theme.rule }]}>
                  <Text style={[styles.contentsText, { color: theme.ink, fontFamily: font.bold }]}>
                    ✎ Highlights and notes ({bookHighlights.length})
                  </Text>
                  <Text style={{ color: theme.soft }}>›</Text>
                </Pressable>
              )}
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

      {!error && <BookOpening {...opening} theme={theme} open={!!book && pages.length > 0} />}

      {marking && book && (
        <HighlightSheet
          key={`${marking.chapter}-${marking.para}`}
          at={marking}
          book={book}
          readerId={readerId}
          topicId={kind === 'own' ? '' : classicById[id]?.topicId ?? ''}
          language={language}
          onClose={() => setMarking(null)}
        />
      )}
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
  onLongPressParagraph: (chapter: number, para: number) => void;
  /** The sentence being read aloud, highlighted where it falls on this page. */
  spoken?: Sentence | null;
  highlights: Highlight[];
  /** A search result to point out on the page. */
  found?: BookHit | null;
  /** Hide the page number (while the listen player covers that spot). */
  hideFolio?: boolean;
};

/** One printed page: running head, text block (or chapter opener), and folio, on toned paper. */
function BookPage({
  book, page, index, width, height, margin, spreadSide, theme, fontKey, fontSize, lineHeight, openerSink, onTap, onLongPressParagraph, spoken, highlights, found, hideFolio,
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
          const marks: Mark[] = highlights
            .filter((h) => h.chapter === page.chapter && h.para === piece.para && h.to > piece.from && h.char < piece.to)
            .map((h) => ({ from: h.char, to: h.to, color: HIGHLIGHT_COLORS[h.color].fill, note: !!h.note }));
          if (found && found.chapter === page.chapter && found.para === piece.para) {
            marks.push({ from: found.char, to: found.char + found.length, color: theme.found, spoken: true });
          }
          if (spoken && spoken.chapter === page.chapter && spoken.para === piece.para) {
            marks.push({ from: spoken.from, to: spoken.to, color: theme.highlight, spoken: true });
          }
          // Draws the slice from an offset, with highlights and the sentence being read aloud.
          const run = (start: number) => (marks.length ? paintRuns(text, piece.from + start, piece.to, marks, theme.soft) : slice.slice(start));
          return (
            <Pressable
              key={`${index}-${piece.para}-${piece.from}`}
              accessibilityHint="Long-press to highlight, add a note or share"
              delayLongPress={450}
              onPress={onTap}
              onLongPress={() => onLongPressParagraph(page.chapter, piece.para)}>
              <Text style={[body, hyphenate, { marginBottom: lineHeight * 0.15 }]} android_hyphenationFrequency="full">
                {opener && i === 0 ? (
                  <>
                    {/* A raised initial opens each chapter. */}
                    <Text style={{ fontFamily: displayFont, fontSize: fontSize * 2.4, color: theme.ink }}>{slice.charAt(0)}</Text>
                    {run(1)}
                  </>
                ) : (
                  <>
                    {indent ? ' ' : ''}
                    {run(0)}
                  </>
                )}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {!hideFolio && (
        <Text
          style={[
            styles.folio,
            { color: theme.soft, fontFamily: displayItalic, left: margin, right: margin, textAlign: spreadSide === 'left' ? 'left' : spreadSide === 'right' ? 'right' : 'center' },
          ]}>
          {index + 1}
        </Text>
      )}
    </Pressable>
  );
}

type Mark = { from: number; to: number; color: string; note?: boolean; spoken?: boolean };

/** Splits text[from, to) into runs coloured by the highlights over them; the spoken sentence wins. A ✎ marks notes. */
function paintRuns(text: string, from: number, to: number, marks: Mark[], noteColor: string) {
  const cuts = [...new Set([from, to, ...marks.flatMap((m) => [m.from, m.to]).filter((x) => x > from && x < to)])].sort((a, b) => a - b);
  const runs = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const [a, b] = [cuts[i], cuts[i + 1]];
    const over = marks.filter((m) => m.from < b && m.to > a);
    const top = over.find((m) => m.spoken) ?? over[over.length - 1];
    const chunk = text.slice(a, b);
    runs.push(top ? <Text key={a} style={{ backgroundColor: top.color }}>{chunk}</Text> : chunk);
    for (const m of marks) {
      if (m.note && m.to === b) runs.push(<Text key={`n${a}`} style={{ color: noteColor, fontSize: 12 }}> ✎</Text>);
    }
  }
  return <>{runs}</>;
}

/** minutes: undefined turns the timer off, 0 means the end of the chapter. */
const SLEEP_OPTIONS: { label: string; minutes?: number }[] = [
  { label: '15 minutes', minutes: 15 },
  { label: '30 minutes', minutes: 30 },
  { label: '60 minutes', minutes: 60 },
  { label: 'End of this chapter', minutes: 0 },
  { label: 'Off' },
];

function sleepLabel(sleep: SleepTimer) {
  if (!sleep) return '⏲ Sleep';
  if (sleep.kind === 'chapter') return '⏲ Ch.';
  return `⏲ ${Math.max(1, Math.round((sleep.until - Date.now()) / 60_000))}m`;
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
  listenBar: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  listenButton: { width: 32, height: 40, alignItems: 'center', justifyContent: 'center' },
  listenIcon: { fontSize: 16 },
  playButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 16, fontWeight: '800' },
  listenNotice: { position: 'absolute', left: 16, right: 16, alignSelf: 'center', maxWidth: 520, borderRadius: 14, padding: 12, gap: 8 },
  listenNoticeText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  noticeTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  noticeFill: { height: 4 },
  listenChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
  listenChipText: { fontSize: 12, fontWeight: '700' },
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
  searchInput: { flex: 1, fontSize: 17, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, marginRight: 6 },
  hitRow: { paddingVertical: 12, gap: 4, borderBottomWidth: StyleSheet.hairlineWidth },
});
