import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookCover } from '@/components/BookCover';
import { BookGrid } from '@/components/BookGrid';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Shelf } from '@/components/Shelf';
import { classicAsSource } from '@/lib/classicSource';
import { classicReaderId, classics } from '@/lib/fullbook';
import { deleteOwnBookFiles, pickOwnBook, previewPdf, type OwnBook } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function LibraryScreen() {
  const { sources, topics, followedTopicIds, bookProgress, sourceById, readerProgress, ownBooks, addOwnBook, removeOwnBook, favoriteBooks } = useStore();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [opening, setOpening] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Heart next to the "Library" title opens Favorites.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Favorites, ${favoriteBooks.length} books`}
          onPress={() => router.push('/favorites')}
          hitSlop={8}
          style={styles.headerHeart}>
          <Text style={styles.headerHeartIcon}>{favoriteBooks.length ? '♥' : '♡'}</Text>
          {favoriteBooks.length > 0 && <Text style={styles.headerHeartCount}>{favoriteBooks.length}</Text>}
        </Pressable>
      ),
    });
  }, [navigation, favoriteBooks.length]);

  // Books you dropped into books/, newest first.
  const recentlyAdded = useMemo(
    () => classics.filter((c) => c.origin === 'books').sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '')),
    [],
  );

  // Classics you've started come first.
  const sortedClassics = useMemo(
    () =>
      [...classics].sort(
        (a, b) => (readerProgress[classicReaderId(b.id)]?.updatedAt ?? '').localeCompare(readerProgress[classicReaderId(a.id)]?.updatedAt ?? ''),
      ),
    [readerProgress],
  );

  const openOwn = async (book: OwnBook) => {
    setFileError(null);
    if (book.kind === 'epub') return router.push({ pathname: '/reader/[id]', params: { id: book.id, kind: 'own' } });
    if (Platform.OS === 'web') return router.push({ pathname: '/pdf/[id]', params: { id: book.id } });
    try {
      await previewPdf(book);
    } catch (e) {
      setFileError((e as Error).message);
    }
  };

  const pick = async () => {
    setFileError(null);
    setOpening(true);
    try {
      const book = await pickOwnBook();
      if (book) {
        addOwnBook(book);
        await openOwn(book);
      }
    } catch (e) {
      setFileError((e as Error).message || 'That file could not be opened.');
    } finally {
      setOpening(false);
    }
  };

  const remove = (book: OwnBook) => {
    removeOwnBook(book.id);
    deleteOwnBookFiles(book).catch(() => {});
  };

  const shelves = useMemo(() => {
    const inProgress = Object.entries(bookProgress)
      .filter(([id, p]) => !p.finishedAt && sourceById[id])
      .sort(([, a], [, b]) => b.startedAt.localeCompare(a.startedAt))
      .map(([id]) => sourceById[id]);
    const finished = Object.entries(bookProgress)
      .filter(([id, p]) => p.finishedAt && sourceById[id])
      .map(([id]) => sourceById[id]);
    const free = sources.filter((s) => s.free);
    const followed = new Set(followedTopicIds);
    const byTopic = [...topics]
      .sort((a, b) => Number(followed.has(b.id)) - Number(followed.has(a.id)))
      .map((topic) => ({ topic, books: sources.filter((s) => s.topicId === topic.id) }))
      .filter((s) => s.books.length > 0);
    return { inProgress, finished, free, byTopic };
  }, [sources, topics, followedTopicIds, bookProgress, sourceById]);

  const q = query.trim().toLowerCase();
  const results = q ? sources.filter((s) => `${s.title} ${s.author}`.toLowerCase().includes(q)) : [];
  const classicResults = q ? classics.filter((c) => `${c.title} ${c.author}`.toLowerCase().includes(q)) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${sources.length} books and authors`}
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      {q ? (
        <>
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'book' : 'books'}
            {classicResults.length ? ` · ${classicResults.length} free full ${classicResults.length === 1 ? 'book' : 'books'}` : ''}
          </Text>
          <BookGrid books={results} />
          {classicResults.length > 0 && <ClassicShelf title="📚 Free full books" items={classicResults} />}
        </>
      ) : (
        <>
          {recentlyAdded.length > 0 && <ClassicShelf title="✨ Recently added" items={recentlyAdded} />}
          <Shelf title="Continue reading" books={shelves.inProgress} />
          <ClassicShelf title="📚 Free classics · read the full book" items={sortedClassics} />
          <Shelf title="🎁 Free from the author" books={shelves.free} />
          <View style={styles.own}>
            <Text style={styles.ownTitle}>Your books</Text>
            <Pressable disabled={opening} onPress={pick} style={styles.ownButton}>
              {opening ? <ActivityIndicator color={colors.onAccent} /> : <Text style={styles.ownButtonText}>＋ Open your own book (EPUB or PDF)</Text>}
            </Pressable>
            {fileError && <Text style={styles.error}>{fileError}</Text>}
            {ownBooks.map((b) => {
              const fraction = readerProgress[`own:${b.id}`]?.fraction;
              return (
                <View key={b.id} style={styles.ownRow}>
                  <Pressable onPress={() => openOwn(b)} style={styles.ownInfo}>
                    <Text style={styles.ownBadge}>{b.kind === 'pdf' ? 'PDF' : 'EPUB'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ownBook} numberOfLines={1}>
                        {b.title}
                      </Text>
                      <Text style={styles.ownMeta} numberOfLines={1}>
                        {b.kind === 'pdf' ? b.fileName : b.author}
                        {fraction != null ? ` · ${Math.round(fraction * 100)}%` : ''}
                      </Text>
                    </View>
                  </Pressable>
                  <View style={styles.ownHeart}>
                    <FavoriteButton favoriteKey={`own:${b.id}`} title={b.title} />
                  </View>
                  <Pressable accessibilityLabel={`Remove ${b.title}`} onPress={() => remove(b)} style={styles.ownRemove}>
                    <Text style={styles.ownMeta}>✕</Text>
                  </Pressable>
                </View>
              );
            })}
            <Text style={styles.footerText}>
              DRM-free files only. They stay on this device and are never uploaded.
              {Platform.OS === 'web' ? ' In the browser, PDFs stay open only until you close the tab.' : ''}
            </Text>
          </View>
          {shelves.byTopic.map(({ topic, books }) => (
            <Shelf key={topic.id} title={`${topic.emoji} ${topic.name}`} books={books} topicId={topic.id} />
          ))}
          <Shelf title="Finished" books={shelves.finished} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Covers from Open Library. Every summary is written in our own words. Full classics are public domain, from Project Gutenberg.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const NEW_DAYS = 7;
const isNew = (addedAt?: string) => !!addedAt && Date.now() - new Date(addedAt).getTime() < NEW_DAYS * 24 * 60 * 60 * 1000;

function ClassicShelf({ title, items }: { title: string; items: typeof classics }) {
  const { readerProgress } = useStore();
  return (
    <View style={styles.shelf}>
      <Text style={styles.shelfTitle}>{title}</Text>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(c) => c.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shelfRow}
        renderItem={({ item }) => {
          const fraction = readerProgress[classicReaderId(item.id)]?.fraction;
          return (
            <BookCover
              book={classicAsSource(item)}
              width={112}
              caption
              fraction={fraction}
              favoriteKey={classicReaderId(item.id)}
              badge={isNew(item.addedAt) ? 'NEW' : undefined}
              subtitle={fraction != null ? `${Math.round(fraction * 100)}% read` : item.author}
              onPress={() => router.push({ pathname: '/classic/[id]', params: { id: item.id } })}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: { gap: 10 },
  shelfTitle: { color: colors.text, fontSize: 20, fontWeight: '800', paddingHorizontal: 16 },
  shelfRow: { gap: 14, paddingHorizontal: 16 },
  own: { marginHorizontal: 16, padding: 16, borderRadius: 18, backgroundColor: colors.surface, gap: 10 },
  ownTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  ownButton: { paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  ownButtonText: { color: colors.onAccent, fontWeight: '800' },
  error: { color: colors.danger },
  ownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: colors.surfaceRaised },
  ownInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  ownBadge: { color: colors.onAccent, backgroundColor: colors.accent, fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, overflow: 'hidden' },
  ownBook: { color: colors.text, fontWeight: '700' },
  ownMeta: { color: colors.muted, fontSize: 12 },
  ownRemove: { padding: 8 },
  ownHeart: { width: 36, height: 36 },
  headerHeart: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 16, paddingHorizontal: 4 },
  headerHeartIcon: { color: '#FF6B81', fontSize: 20 },
  headerHeartCount: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  container: { flex: 1, backgroundColor: colors.background },
  content: { gap: 28, paddingBottom: 32 },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: -8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  count: { color: colors.muted, paddingHorizontal: 16 },
  footer: { paddingHorizontal: 16 },
  footerText: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
