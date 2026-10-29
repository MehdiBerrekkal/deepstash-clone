import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type LayoutChangeEvent, type ListViewToken } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { IdeaCard } from '@/components/IdeaCard';
import { useStore } from '@/lib/store';
import { colors, serif } from '@/lib/theme';
import type { Idea } from '@/lib/types';

type Page = { type: 'idea'; idea: Idea; index: number } | { type: 'end' };

/** Swipe through one book's ideas, one card per screen, with a progress bar and a finish page. */
export default function ReaderScreen() {
  const { id, start } = useLocalSearchParams<{ id: string; start?: string }>();
  const { sourceById, ideasBySource, sources, setBookPosition, finishBook, markRead } = useStore();
  const book = sourceById[id];
  const ideas = ideasBySource[id] ?? [];
  const [size, setSize] = useState({ width: 0, height: 0 });
  const startIndex = Math.min(Math.max(Number(start) || 0, 0), Math.max(ideas.length - 1, 0));
  const [current, setCurrent] = useState(startIndex);
  const list = useRef<FlatList<Page>>(null);

  const pages: Page[] = [...ideas.map((idea, index) => ({ type: 'idea' as const, idea, index })), { type: 'end' }];

  const onViewable = useCallback(({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const page = viewableItems.find((v) => v.isViewable)?.item as Page | undefined;
    if (!page) return;
    if (page.type === 'idea') {
      setCurrent(page.index);
      setBookPosition(id, page.index);
      markRead(page.idea.id);
    } else {
      setCurrent(ideas.length);
      finishBook(id);
    }
  }, [id, ideas.length, setBookPosition, markRead, finishBook]);

  const goTo = useCallback((index: number) => list.current?.scrollToIndex({ index, animated: true }), []);

  if (!book || ideas.length === 0) return <Text style={styles.muted}>Book not found.</Text>;

  const onLayout = (e: LayoutChangeEvent) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
  const next = sources.filter((s) => s.topicId === book.topicId && s.id !== book.id).slice(0, 3);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: book.title }} />
      <View style={styles.progress}>
        {ideas.map((idea, i) => (
          <Pressable key={idea.id} onPress={() => goTo(i)} style={styles.segmentHit}>
            <View style={[styles.segment, i <= current && styles.segmentDone]} />
          </Pressable>
        ))}
      </View>
      <View style={styles.list} onLayout={onLayout}>
        {size.height > 0 && (
          <FlatList
            ref={list}
            horizontal
            pagingEnabled
            data={pages}
            initialScrollIndex={startIndex}
            keyExtractor={(p) => (p.type === 'idea' ? p.idea.id : 'end')}
            getItemLayout={(_, index) => ({ length: size.width, offset: size.width * index, index })}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewable}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            renderItem={({ item }) =>
              item.type === 'idea' ? (
                <View style={{ width: size.width }}>
                  <IdeaCard idea={item.idea} height={size.height} counter={`${item.index + 1} / ${ideas.length}`} hideSource scrollable />
                </View>
              ) : (
                <View style={[styles.end, { width: size.width, height: size.height }]}>
                  <Text style={styles.endEmoji}>🎉</Text>
                  <Text style={styles.endTitle}>You finished {book.title}</Text>
                  <Text style={styles.endText}>
                    {ideas.length} ideas read. Stash the ones you want to remember, or pick your next book.
                  </Text>
                  <View style={styles.nextRow}>
                    {next.map((b) => (
                      <BookCover key={b.id} book={b} width={92} onPress={() => router.replace({ pathname: '/book/[id]', params: { id: b.id } })} />
                    ))}
                  </View>
                  <Pressable onPress={() => router.back()} style={styles.button}>
                    <Text style={styles.buttonText}>Done</Text>
                  </Pressable>
                  <Pressable onPress={() => goTo(0)}>
                    <Text style={styles.link}>Read again</Text>
                  </Pressable>
                </View>
              )
            }
          />
        )}
      </View>
      <View style={styles.footer}>
        <Pressable disabled={current === 0} onPress={() => goTo(current - 1)} style={[styles.nav, current === 0 && styles.navOff]}>
          <Text style={styles.navText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.hint}>Swipe to read</Text>
        <Pressable
          disabled={current >= ideas.length}
          onPress={() => goTo(current + 1)}
          style={[styles.nav, current >= ideas.length && styles.navOff]}>
          <Text style={styles.navText}>Next ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingTop: 10 },
  segmentHit: { flex: 1, paddingVertical: 6 },
  segment: { height: 4, borderRadius: 2, backgroundColor: colors.border },
  segmentDone: { backgroundColor: colors.accent },
  list: { flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  nav: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: colors.surface },
  navOff: { opacity: 0.3 },
  navText: { color: colors.text, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 12 },
  end: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  endEmoji: { fontSize: 56 },
  endTitle: { color: colors.text, fontSize: 26, fontWeight: '800', fontFamily: serif, textAlign: 'center' },
  endText: { color: colors.muted, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  nextRow: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  button: { paddingVertical: 14, paddingHorizontal: 48, borderRadius: 999, backgroundColor: colors.accent },
  buttonText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  link: { color: colors.accent, fontWeight: '700' },
  muted: { color: colors.muted, padding: 24 },
});
