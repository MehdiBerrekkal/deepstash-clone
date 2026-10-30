import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageFlip, type PageFlipHandle } from '@/components/PageFlip';
import { PdfEngine, type PdfApi } from '@/components/PdfEngine';
import { Scrubber } from '@/components/Scrubber';
import { BOOK_THEMES, displayFont, displayItalic } from '@/lib/bookType';
import { classicById } from '@/lib/fullbook';
import { myBookPdfAssets } from '@/lib/myBooks';
import { loadPdfData } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';

const SPREAD_MIN_WIDTH = 700;
const CHROME_HIDE_MS = 3500;
/** Paper margin around each rendered PDF page. */
const MARGIN = 14;

/** A PDF read like a printed book: rendered pages on paper, the page-curl, two-page spreads, zoom and progress. */
export default function PdfBookScreen() {
  const { id, source } = useLocalSearchParams<{ id: string; source?: 'own' | 'private' }>();
  const { ready } = useStore();
  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: BOOK_THEMES.light.desk }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={BOOK_THEMES.light.soft} />
      </View>
    );
  }
  return <PdfBook id={id} source={source === 'private' ? 'private' : 'own'} />;
}

async function pdfBytes(id: string, source: 'own' | 'private', ownBooks: ReturnType<typeof useStore>['ownBooks']) {
  if (source === 'own') {
    const book = ownBooks.find((b) => b.id === id);
    if (!book) throw new Error('This PDF is no longer in your Library.');
    return loadPdfData(book);
  }
  const asset = Asset.fromModule(myBookPdfAssets[id]);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (Platform.OS === 'web') return { bytes: await (await fetch(uri)).arrayBuffer() };
  return { base64: await new File(uri).base64() };
}

function PdfBook({ id, source }: { id: string; source: 'own' | 'private' }) {
  const readerId = `pdf:${source}:${id}`;
  const { ownBooks, readerSettings, readerProgress, setReaderPosition } = useStore();
  const title = source === 'own' ? ownBooks.find((b) => b.id === id)?.title ?? 'PDF' : classicById[id]?.title ?? 'PDF';
  const theme = BOOK_THEMES[readerSettings.theme] ?? BOOK_THEMES.light;
  const [api, setApi] = useState<PdfApi | null>(null);
  const [count, setCount] = useState(0);
  const [ratio, setRatio] = useState(1.414);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<Record<string, string>>({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [current, setCurrent] = useState(() => readerProgress[readerId]?.para ?? 0);
  const [chrome, setChrome] = useState(true);
  const [zoom, setZoom] = useState(1);
  const flip = useRef<PageFlipHandle>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const requested = useRef(new Set<string>());
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const spread = size.width > size.height && size.width >= SPREAD_MIN_WIDTH;
  const leaf = spread ? Math.floor(current / 2) : current;
  const pageWidth = spread ? size.width / 2 : size.width;
  // Render at the screen's pixel density (capped) so text stays sharp, and higher when zoomed.
  const renderWidth = Math.min(2000, Math.round((pageWidth - MARGIN * 2) * Math.min(3, (Platform.OS === 'web' ? globalThis.devicePixelRatio : 2) || 2) * Math.min(zoom, 2)));

  // Open the PDF once the engine is ready.
  useEffect(() => {
    if (!api) return;
    let alive = true;
    pdfBytes(id, source, ownBooks)
      .then((data) => api.open(data))
      .then((n) => alive && setCount(n))
      .catch((e: Error) => alive && setError(e.message || 'This PDF could not be opened.'));
    return () => {
      alive = false;
    };
    // ownBooks only matters for the first open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, id, source]);

  // Render the visible pages and their neighbours, one at a time.
  useEffect(() => {
    if (!api || !count || !size.width) return;
    const first = spread ? leaf * 2 - 2 : current - 1;
    const last = spread ? leaf * 2 + 3 : current + 2;
    for (let i = Math.max(0, first); i <= Math.min(count - 1, last); i++) {
      const key = `${i}@${renderWidth}`;
      if (requested.current.has(key)) continue;
      requested.current.add(key);
      queue.current = queue.current.then(() =>
        api.render(i, renderWidth).then(
          (r) => {
            setRatio(r.ratio);
            setPages((p) => ({ ...p, [key]: r.uri }));
          },
          () => requested.current.delete(key),
        ),
      );
    }
  }, [api, count, current, leaf, spread, size.width, renderWidth]);

  // Controls fade away while reading.
  useEffect(() => {
    if (!chrome || !count) return;
    const t = setTimeout(() => setChrome(false), CHROME_HIDE_MS);
    return () => clearTimeout(t);
  }, [chrome, count]);

  const goTo = useCallback(
    (page: number) => {
      const p = Math.min(Math.max(page, 0), Math.max(count - 1, 0));
      setCurrent(p);
      setReaderPosition(readerId, { chapter: 0, para: p, char: 0 }, count > 1 ? p / (count - 1) : 1);
    },
    [count, readerId, setReaderPosition],
  );
  const step = useCallback((dir: 1 | -1) => flip.current?.turn(dir), []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof globalThis.addEventListener !== 'function') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') step(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') step(-1);
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [step]);

  const onTap = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.pageX;
    if (zoom > 1) return setChrome((c) => !c);
    if (x < window.width * 0.22) step(-1);
    else if (x > window.width * 0.78) step(1);
    else setChrome((c) => !c);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (Math.abs(width - size.width) > 1 || Math.abs(height - size.height) > 1) setSize({ width, height });
  };

  const renderPage = (index: number, width: number) => {
    const uri = pages[`${index}@${renderWidth}`] ?? Object.entries(pages).find(([k]) => k.startsWith(`${index}@`))?.[1];
    // Fit the page inside the paper, keeping its shape.
    const boxW = width - MARGIN * 2;
    const boxH = size.height - MARGIN * 2 - 18;
    const w = Math.min(boxW, boxH / ratio);
    const h = w * ratio;
    return (
      <Pressable accessible={false} onPress={onTap} style={[styles.paper, { width, height: size.height, backgroundColor: theme.paper }]}>
        <View style={[styles.sheet, { width: w, height: h, overflow: 'hidden' }]}>
          {uri ? (
            <Image source={{ uri }} style={{ width: w, height: h, transform: [{ scale: zoom }] }} resizeMode="contain" />
          ) : (
            <View style={[styles.center, { backgroundColor: '#fff' }]}>
              <ActivityIndicator color={theme.soft} />
            </View>
          )}
        </View>
        <Text style={[styles.folio, { color: theme.soft, fontFamily: displayItalic }]}>{index + 1}</Text>
      </Pressable>
    );
  };

  const label = spread && current + 1 < count ? `Pages ${leaf * 2 + 1}–${leaf * 2 + 2}` : `Page ${current + 1}`;

  return (
    <View style={[styles.container, { backgroundColor: spread ? theme.desk : theme.paper }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <PdfEngine onReady={setApi} onError={setError} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[styles.stage, spread && styles.stageSpread]} onLayout={onLayout}>
          {error ? (
            <View style={styles.center}>
              <Text style={[styles.message, { color: theme.ink }]}>{error}</Text>
            </View>
          ) : !count || !size.width ? (
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
              pageCount={count}
              index={leaf}
              onIndexChange={(next) => goTo(spread ? next * 2 : next)}
              renderPage={renderPage}
              shade={theme.shade}
              onPinchEnd={(scale) => setZoom((z) => Math.min(3, Math.max(1, Math.round(z * scale * 10) / 10)))}
            />
          )}
        </View>
      </SafeAreaView>

      {chrome && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(260)}
          style={[styles.topBar, { backgroundColor: theme.chrome, paddingTop: insets.top + 4, borderBottomColor: theme.rule }]}>
          <Pressable accessibilityLabel="Close book" onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))} style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText }]}>‹</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.chromeText, fontFamily: displayFont }]} numberOfLines={1}>
            {title}
          </Text>
          {zoom > 1 && (
            <Pressable accessibilityLabel="Reset zoom" onPress={() => setZoom(1)} style={styles.iconButton}>
              <Text style={[styles.zoom, { color: theme.chromeText }]}>{zoom.toFixed(1)}× ⤢</Text>
            </Pressable>
          )}
          <Pressable accessibilityLabel="Zoom in" onPress={() => setZoom((z) => Math.min(3, Math.round((z + 0.5) * 10) / 10))} style={styles.iconButton}>
            <Text style={[styles.icon, { color: theme.chromeText }]}>＋</Text>
          </Pressable>
        </Animated.View>
      )}
      {chrome && count > 0 && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(260)}
          style={[styles.bottomBar, { backgroundColor: theme.chrome, paddingBottom: insets.bottom + 8, borderTopColor: theme.rule }]}>
          <Scrubber theme={theme} count={count} current={current} onSeek={goTo} />
          <Text style={[styles.pageLabel, { color: theme.soft }]}>
            {label} of {count} · {count > 1 ? Math.round((current / (count - 1)) * 100) : 100}%
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stage: { flex: 1, overflow: 'hidden' },
  stageSpread: { margin: 14, borderRadius: 4, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  paper: { alignItems: 'center', paddingTop: MARGIN },
  sheet: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  folio: { position: 'absolute', bottom: 2, fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  message: { fontSize: 17, textAlign: 'center', lineHeight: 25 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  iconButton: { minWidth: 40, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  icon: { fontSize: 22, fontWeight: '500' },
  zoom: { fontSize: 14, fontWeight: '600' },
  title: { flex: 1, fontSize: 18, paddingHorizontal: 4 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 10, gap: 4, borderTopWidth: StyleSheet.hairlineWidth },
  pageLabel: { fontSize: 12, textAlign: 'center' },
});
