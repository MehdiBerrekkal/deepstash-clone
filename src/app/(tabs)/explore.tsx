import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { EmptyState } from '@/components/EmptyState';
import { IdeaRow } from '@/components/IdeaRow';
import { KindFilter } from '@/components/KindFilter';
import { HIGHLIGHT_COLORS } from '@/lib/bookType';
import { classicAsSource } from '@/lib/classicSource';
import { classics } from '@/lib/fullbook';
import { matchesAll } from '@/lib/search';
import { useStore } from '@/lib/store';
import { colors, onCardScope } from '@/lib/theme';
import type { CardKind, Highlight, Idea, Source } from '@/lib/types';

const PAGE = 60;

type Scope = CardKind | 'books' | 'highlights' | null;
type BookResult = { key: string; book: Source; full: boolean; onPress?: () => void };
type Row = { type: 'idea'; idea: Idea } | { type: 'book'; item: BookResult } | { type: 'highlight'; h: Highlight };

const openHighlight = (h: Highlight) => {
  const i = h.readerId.indexOf(':');
  router.push({ pathname: '/reader/[id]', params: { id: h.readerId.slice(i + 1), kind: h.readerId.slice(0, i), at: `${h.chapter}.${h.para}.${h.char}` } });
};

/** Search everything: card text, library books, full books (bundled and downloadable) and your highlights. */
export default function ExploreScreen() {
  const { ideas, topics, sources, sourceById, highlights } = useStore();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>(null);
  const [limit, setLimit] = useState(PAGE);
  const q = query.trim();
  const cardKind = scope && scope !== 'books' && scope !== 'highlights' ? scope : null;

  const cards = useMemo(() => {
    if (scope === 'books' || scope === 'highlights') return [];
    return ideas.filter((idea) => {
      if (cardKind && idea.kind !== cardKind) return false;
      if (!q) return true;
      const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;
      return matchesAll([idea.title, idea.body, idea.author, source?.title, source?.author].join(' '), q);
    });
  }, [ideas, q, scope, cardKind, sourceById]);

  // Full books come first: you can read them cover to cover.
  const books = useMemo((): BookResult[] => {
    if (scope !== 'books' && (scope !== null || !q)) return [];
    const full = classics
      .filter((c) => !q || matchesAll(`${c.title} ${c.author} ${c.translator ?? ''}`, q))
      .map((c) => ({
        key: `classic:${c.id}`,
        book: classicAsSource(c),
        full: true,
        onPress: () => router.push({ pathname: '/classic/[id]', params: { id: c.id } }),
      }));
    const summaries = sources
      .filter((s) => !q || matchesAll(`${s.title} ${s.author}`, q))
      .map((s) => ({ key: `book:${s.id}`, book: s, full: false }));
    return [...full, ...summaries];
  }, [sources, q, scope]);

  const marks = useMemo(
    () =>
      (scope === 'highlights' || (scope === null && q)) && highlights.length
        ? highlights.filter((h) => !q || matchesAll(`${h.text} ${h.note ?? ''} ${h.bookTitle} ${h.author}`, q))
        : [],
    [highlights, q, scope],
  );

  const rows: Row[] = useMemo(() => {
    if (scope === 'books') return books.map((item) => ({ type: 'book', item }));
    if (scope === 'highlights') return marks.map((h) => ({ type: 'highlight', h }));
    return cards.map((idea) => ({ type: 'idea', idea }));
  }, [scope, books, marks, cards]);
  const total = rows.length;

  const header = () => {
    if (!q && scope === null) {
      return (
        <View style={styles.section}>
          <Text style={styles.heading}>Topics</Text>
          <View style={styles.topics}>
            {topics.map((topic) => (
              <Pressable
                key={topic.id}
                onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topic.id } })}
                style={[styles.topic, onCardScope, { backgroundColor: topic.color }]}>
                <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                <Text style={styles.topicName}>{topic.name}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.heading}>Everything · {total}</Text>
        </View>
      );
    }
    if (scope !== null) return <Text style={styles.count}>{countLabel(total, scope)}</Text>;
    return (
      <View style={styles.section}>
        {books.length > 0 && (
          <>
            <Text style={styles.heading}>Books · {books.length}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.books}>
              {books.slice(0, 30).map((b) => (
                <BookCover key={b.key} book={b.book} width={92} caption favoriteKey={b.key} onPress={b.onPress} badge={b.full ? 'FULL' : undefined} />
              ))}
            </ScrollView>
          </>
        )}
        {marks.length > 0 && (
          <>
            <Text style={styles.heading}>Your highlights · {marks.length}</Text>
            {marks.slice(0, 3).map((h) => (
              <HighlightRow key={h.id} h={h} />
            ))}
            {marks.length > 3 && (
              <Pressable onPress={() => setScope('highlights')}>
                <Text style={styles.more}>See all {marks.length} highlights ›</Text>
              </Pressable>
            )}
          </>
        )}
        <Text style={styles.heading}>Cards · {cards.length}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Search"
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setLimit(PAGE);
        }}
        placeholder="Search books, ideas, quotes, poems, highlights"
        placeholderTextColor={colors.muted}
        style={styles.search}
        clearButtonMode="while-editing"
      />
      {!!q && (
        <Pressable accessibilityLabel="Search free libraries" onPress={() => router.push({ pathname: '/find', params: { q } })} style={styles.findLink}>
          <Text style={styles.findLinkText}>🔎 Find “{q}” in free libraries (Gutenberg, Standard Ebooks) ›</Text>
        </Pressable>
      )}
      <KindFilter
        value={scope}
        onChange={(k) => {
          setScope(k);
          setLimit(PAGE);
        }}
        extras={[
          { id: 'books', label: '📚 Books' },
          { id: 'highlights', label: '✎ Highlights' },
        ]}
      />
      <FlatList
        data={rows.slice(0, limit)}
        keyExtractor={(r) => (r.type === 'idea' ? r.idea.id : r.type === 'book' ? r.item.key : r.h.id)}
        renderItem={({ item: r }) =>
          r.type === 'idea' ? <IdeaRow idea={r.idea} /> : r.type === 'book' ? <BookRow item={r.item} /> : <HighlightRow h={r.h} />
        }
        contentContainerStyle={styles.list}
        onEndReached={() => setLimit((l) => l + PAGE)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header()}
        ListEmptyComponent={
          <EmptyState
            art={scope === 'highlights' ? 'pen' : 'search'}
            title={scope === 'highlights' && !highlights.length ? 'No highlights yet' : 'No matches'}
            text={
              scope === 'highlights' && !highlights.length
                ? 'Long-press a paragraph in any full book to make one.'
                : books.length || marks.length
                  ? 'No cards match, but see the results above.'
                  : 'Nothing matches that search. Try fewer or different words.'
            }
          />
        }
      />
    </View>
  );
}

function countLabel(n: number, scope: Scope) {
  const noun = scope === 'books' ? 'book' : scope === 'highlights' ? 'highlight' : 'card';
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

function BookRow({ item }: { item: BookResult }) {
  const open = item.onPress ?? (() => router.push({ pathname: '/book/[id]', params: { id: item.book.id } }));
  return (
    <View style={styles.row}>
      <BookCover book={item.book} width={52} favoriteKey={null} onPress={open} />
      <Pressable onPress={open} style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.book.title}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {item.book.author}
        </Text>
        <Text style={[styles.tag, item.full && styles.tagFull]}>{item.full ? 'Full book' : 'Key ideas'}</Text>
      </Pressable>
    </View>
  );
}

function HighlightRow({ h }: { h: Highlight }) {
  return (
    <Pressable onPress={() => openHighlight(h)} style={styles.row}>
      <View style={[styles.bar, { backgroundColor: HIGHLIGHT_COLORS[h.color].solid }]} />
      <View style={styles.rowText}>
        <Text style={styles.quote} numberOfLines={3}>
          “{h.text}”
        </Text>
        {!!h.note && (
          <Text style={styles.note} numberOfLines={2}>
            ✎ {h.note}
          </Text>
        )}
        <Text style={styles.rowSub} numberOfLines={1}>
          {h.bookTitle} · {h.chapterTitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  findLink: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.accent },
  findLinkText: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  container: { flex: 1, backgroundColor: colors.background },
  search: {
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  list: { gap: 10, padding: 16, paddingTop: 4 },
  section: { gap: 12, marginBottom: 4 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  count: { color: colors.muted, marginBottom: 4 },
  more: { color: colors.accent, fontWeight: '700' },
  books: { gap: 12 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topic: { flexGrow: 1, flexBasis: '45%', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 14 },
  topicEmoji: { fontSize: 18 },
  topicName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.surface, overflow: 'hidden' },
  rowText: { flex: 1, gap: 4, justifyContent: 'center' },
  rowTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  rowSub: { color: colors.muted, fontSize: 13 },
  tag: { alignSelf: 'flex-start', color: colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  tagFull: { color: colors.accent },
  bar: { width: 4, borderRadius: 2, marginVertical: -12, marginLeft: -12 },
  quote: { color: colors.text, fontFamily: 'Literata_400Regular_Italic', fontSize: 15, lineHeight: 22 },
  note: { color: colors.accent, fontSize: 13 },
});
