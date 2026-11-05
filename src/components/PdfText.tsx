import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type ListViewToken } from 'react-native';

import { READER_FONTS, type BookTheme } from '@/lib/bookType';
import type { ReaderFont } from '@/lib/types';

/** A PDF page's text as paragraphs: lines joined, words split across lines put back together. */
export function pageParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/(\w)-\n(\w)/g, '$1$2').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .filter((p) => p.length > 0);
}

/** True when the PDF has real text (not scanned images): on average a few lines per page. */
export function hasReadableText(texts: string[]): boolean {
  const chars = texts.reduce((n, t) => n + t.trim().length, 0);
  return texts.length > 0 && chars / texts.length > 120;
}

type Props = {
  texts: string[];
  theme: BookTheme;
  fontSize: number;
  font: ReaderFont;
  /** Page to start on (0-based). */
  start: number;
  topInset: number;
  bottomInset: number;
  onPage: (page: number) => void;
  onTap: () => void;
};

/**
 * A PDF read as text: every page's words flow at your text size and font, like an e-book, so a printed A4 page is
 * comfortable on a phone. Page numbers stay in the margin so you know where you are in the printed book.
 */
export function PdfText({ texts, theme, fontSize, font, start, topInset, bottomInset, onPage, onTap }: Props) {
  const f = READER_FONTS[font] ?? READER_FONTS.literata;
  const pages = useMemo(() => texts.map((t, i) => ({ i, paras: pageParagraphs(t) })), [texts]);
  const list = useRef<FlatList<(typeof pages)[number]>>(null);
  // FlatList wants the same callback for its whole life, so it reads the latest onPage from a ref.
  const pageRef = useRef(onPage);
  useEffect(() => {
    pageRef.current = onPage;
  }, [onPage]);
  const [onViewable] = useState(() => ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first?.index != null) pageRef.current(first.index);
  });

  return (
    <FlatList
      ref={list}
      data={pages}
      keyExtractor={(p) => String(p.i)}
      initialScrollIndex={Math.min(start, Math.max(0, pages.length - 1))}
      onScrollToIndexFailed={({ index, averageItemLength }) => list.current?.scrollToOffset({ offset: index * averageItemLength, animated: false })}
      onViewableItemsChanged={onViewable}
      viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
      windowSize={7}
      initialNumToRender={3}
      contentContainerStyle={[styles.content, { paddingTop: topInset, paddingBottom: bottomInset }]}
      style={{ backgroundColor: theme.paper }}
      renderItem={({ item }) => (
        <Pressable accessible={false} onPress={onTap} style={styles.page}>
          {item.paras.length ? (
            item.paras.map((p, k) => (
              <Text key={k} selectable style={{ color: theme.ink, fontFamily: f.regular, fontSize, lineHeight: Math.round(fontSize * f.leading), marginBottom: fontSize * 0.75 }}>
                {p}
              </Text>
            ))
          ) : (
            <Text style={[styles.empty, { color: theme.soft }]}>This page has no text (a picture or a blank page).</Text>
          )}
          <View style={styles.folioRow}>
            <View style={[styles.rule, { backgroundColor: theme.rule }]} />
            <Text style={[styles.folio, { color: theme.soft }]}>{item.i + 1}</Text>
            <View style={[styles.rule, { backgroundColor: theme.rule }]} />
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, maxWidth: 720, width: '100%', alignSelf: 'center' },
  page: { paddingVertical: 8 },
  empty: { fontStyle: 'italic', textAlign: 'center', paddingVertical: 24 },
  folioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  folio: { fontSize: 13, fontVariant: ['tabular-nums'] },
});
