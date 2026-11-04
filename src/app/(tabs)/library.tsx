import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookActions, openOwnBook, type BookActionTarget } from '@/components/BookActions';
import { BookCover } from '@/components/BookCover';
import { BookGrid } from '@/components/BookGrid';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Shelf } from '@/components/Shelf';
import { classicAsSource } from '@/lib/classicSource';
import { classicReaderId, classics, type Classic } from '@/lib/fullbook';
import { hasNarration } from '@/lib/narration';
import { ownSourceId, pickOwnBook, type OwnBook } from '@/lib/ownbooks';
import type { Source } from '@/lib/types';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { useT } from '@/lib/i18n';
import { KID_CLASSICS } from '@/lib/audience';

export default function LibraryScreen() {
  const { sources, topics, followedTopicIds, bookProgress, sourceById, readerProgress, ownBooks, addOwnBook, favoriteBooks, downloadedBooks, audience } = useStore();
  // The long-press menu for a book.
  const [actions, setActions] = useState<BookActionTarget | null>(null);
  const kid = audience === 'kid';
  // Kid mode only lists children's books (and the family's own private ones).
  const shown = useMemo(() => (kid ? classics.filter((c) => KID_CLASSICS.has(c.id) || c.origin === 'private') : classics), [kid]);
  const t = useT();
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
  // Books with a free human recording (LibriVox), bundled ones first.
  const narrated = useMemo(() => shown.filter((c) => hasNarration(c.id) && c.origin !== 'catalog').slice(0, 30), [shown]);
  const recentlyAdded = useMemo(
    () => shown.filter((c) => c.origin === 'books').sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '')),
    [shown],
  );

  // Your private my-books/ imports, newest first.
  const myBooks = useMemo(
    () => classics.filter((c) => c.origin === 'private').sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '')),
    [],
  );

  // Full books on shelves by kind; on each shelf, books you've started come first.
  const classicShelves = useMemo(() => {
    const started = (c: Classic) => readerProgress[classicReaderId(c.id)]?.updatedAt ?? '';
    const ready = shown.filter((c) => c.origin !== 'private' && c.origin !== 'catalog');
    return SHELVES.map((s) => ({ ...s, title: kid ? (KID_SHELF_TITLES[s.id] ?? s.title) : s.title, items: ready.filter((c) => shelfOf(c) === s.id).sort((a, b) => started(b).localeCompare(started(a))) })).filter(
      (s) => s.items.length > 0,
    );
  }, [readerProgress, shown, kid]);
  const toDownload = useMemo(
    () => shown.filter((c) => c.origin === 'catalog').sort((a, b) => Number(downloadedBooks.includes(b.id)) - Number(downloadedBooks.includes(a.id))),
    [downloadedBooks, shown],
  );

  const openOwn = async (book: OwnBook) => {
    setFileError(null);
    openOwnBook(book);
  };
  const ownActions = (book: OwnBook) => setActions({ kind: 'own', book });
  const classicActions = (book: Classic) => setActions({ kind: 'classic', book });

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
  const classicResults = q ? shown.filter((c) => `${c.title} ${c.author}`.toLowerCase().includes(q)) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('Search {n} books and authors', { n: sources.length })}
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      {!kid && (
      <Pressable accessibilityLabel="Find a free book" onPress={() => router.push('/find')} style={styles.find}>
        <Text style={styles.findIcon}>🔎</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.findTitle}>{t('Find a free book')}</Text>
          <Text style={styles.findSub}>{t('Thousands of classics in English and French, one tap to download')}</Text>
        </View>
        <Text style={styles.findChev}>›</Text>
      </Pressable>
      )}

      {q ? (
        <>
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'book' : 'books'}
            {classicResults.length ? ` · ${classicResults.length} free full ${classicResults.length === 1 ? 'book' : 'books'}` : ''}
          </Text>
          <BookGrid books={results} />
          {classicResults.length > 0 && <ClassicShelf title="📚 Free full books" items={classicResults} onLongPress={classicActions} />}
        </>
      ) : (
        <>
          {ownBooks.length > 0 && <OwnShelf title={t('📥 Your books · main ideas')} books={ownBooks} onOpen={openOwn} onLongPress={ownActions} />}
          {myBooks.length > 0 && <ClassicShelf title="🔒 My books" items={myBooks} onLongPress={classicActions} />}
          {recentlyAdded.length > 0 && <ClassicShelf title={t('✨ Recently added')} items={recentlyAdded} onLongPress={classicActions} />}
          <ClassicShelf title={t('🎙 Read aloud by a real narrator')} items={narrated} onLongPress={classicActions} />
          <Shelf title={t('Continue reading')} books={shelves.inProgress} />
          {classicShelves.map((s) => (
            <ClassicShelf key={s.id} title={s.title} items={s.items} onLongPress={classicActions} />
          ))}
          <ClassicShelf title="⬇ More full books · free to download" items={toDownload} onLongPress={classicActions} />
          <Shelf title="🎁 Free from the author" books={shelves.free} />
          <View style={styles.own}>
            <Text style={styles.ownTitle}>{t('Your books')}</Text>
            <Pressable disabled={opening} onPress={pick} style={styles.ownButton}>
              {opening ? <ActivityIndicator color={colors.onAccent} /> : <Text style={styles.ownButtonText}>{t('＋ Open your own book (EPUB or PDF)')}</Text>}
            </Pressable>
            {fileError && <Text style={styles.error}>{fileError}</Text>}
            {ownBooks.map((b) => {
              const fraction = readerProgress[`own:${b.id}`]?.fraction;
              return (
                <View key={b.id} style={styles.ownRow}>
                  <Pressable onPress={() => openOwn(b)} onLongPress={() => ownActions(b)} delayLongPress={450} style={styles.ownInfo}>
                    <Text style={styles.ownBadge}>{b.kind === 'pdf' ? 'PDF' : b.source ? (b.lang === 'fr' ? 'FR' : 'FREE') : 'EPUB'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ownBook} numberOfLines={1}>
                        {b.title}
                      </Text>
                      <Text style={styles.ownMeta} numberOfLines={1}>
                        {b.kind === 'pdf' ? b.fileName : b.source ? `${b.author} · ${b.source}` : b.author}
                        {fraction != null ? ` · ${Math.round(fraction * 100)}%` : ''}
                        {b.ideas?.length ? ` · 💡 ${b.ideas.length}` : ''}
                      </Text>
                    </View>
                  </Pressable>
                  <View style={styles.ownHeart}>
                    <FavoriteButton favoriteKey={`own:${b.id}`} title={b.title} />
                  </View>
                  <Pressable accessibilityLabel={`More for ${b.title}`} onPress={() => ownActions(b)} style={styles.ownRemove}>
                    <Text style={styles.ownMore}>⋯</Text>
                  </Pressable>
                </View>
              );
            })}
            <Text style={styles.footerText}>
              DRM-free files only. They stay on this device and are never uploaded. Long-press a book for more.
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
      {actions && <BookActions target={actions} onClose={() => setActions(null)} />}
    </ScrollView>
  );
}

/** Your own books as covers; a tap opens the book's page with its main ideas (or the book, until they're ready). */
function OwnShelf({ title, books, onOpen, onLongPress }: { title: string; books: OwnBook[]; onOpen: (b: OwnBook) => void; onLongPress: (b: OwnBook) => void }) {
  const { readerProgress, topics } = useStore();
  return (
    <View style={styles.shelf}>
      <Text style={styles.shelfTitle}>{title}</Text>
      <FlatList
        horizontal
        data={books}
        keyExtractor={(b) => b.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shelfRow}
        renderItem={({ item }) => {
          const fraction = readerProgress[`own:${item.id}`]?.fraction;
          const n = item.ideas?.length ?? 0;
          const source: Source = {
            id: ownSourceId(item.id),
            title: item.title,
            author: item.author === 'PDF' ? 'Your PDF' : item.author,
            kind: 'book',
            topicId: item.topicId ?? topics[0]?.id ?? '',
            description: '',
          };
          return (
            <BookCover
              book={source}
              width={112}
              caption
              fraction={fraction}
              favoriteKey={`own:${item.id}`}
              subtitle={n ? `💡 ${n} main ideas` : item.kind === 'pdf' ? 'Open it to make its ideas' : 'Making its ideas…'}
              onPress={() => (n ? router.push({ pathname: '/book/[id]', params: { id: source.id } }) : onOpen(item))}
              onLongPress={() => onLongPress(item)}
            />
          );
        }}
      />
    </View>
  );
}

/** Shelves for full books. Older bundled books have no shelf field, so they're placed by topic. */
const SHELVES: { id: NonNullable<Classic['shelf']>; title: string }[] = [
  { id: 'wisdom', title: '🏛️ Wisdom & philosophy · full books' },
  { id: 'lives', title: '🌱 Lives & self-improvement' },
  { id: 'novels', title: '📖 Great novels & stories' },
  { id: 'ideas', title: '💡 Big ideas & science' },
  { id: 'poetry', title: '🪶 Poetry & plays' },
  { id: 'french', title: '🇫🇷 En français' },
];
/** Shelf names in kid mode. */
const KID_SHELF_TITLES: Partial<Record<NonNullable<Classic['shelf']>, string>> = {
  novels: '🧸 Adventures & stories for kids',
  lives: '🧭 True adventures',
  ideas: '🔭 Science stories',
  french: '🇫🇷 Pour les enfants, en français',
};
const NOVELS = new Set(['frankenstein', 'pride-and-prejudice', 'alice-in-wonderland', 'little-brother', 'down-and-out']);

function shelfOf(c: Classic): NonNullable<Classic['shelf']> {
  if (c.shelf) return c.shelf;
  if (NOVELS.has(c.id)) return 'novels';
  if (c.topicId === 'poetry') return 'poetry';
  if (['philosophy', 'mindfulness', 'leadership'].includes(c.topicId)) return 'wisdom';
  if (c.topicId === 'science') return 'ideas';
  return 'lives';
}

const NEW_DAYS = 7;
const isNew = (addedAt?: string) => !!addedAt && Date.now() - new Date(addedAt).getTime() < NEW_DAYS * 24 * 60 * 60 * 1000;

function ClassicShelf({ title, items, onLongPress }: { title: string; items: typeof classics; onLongPress?: (c: Classic) => void }) {
  const { readerProgress, downloadedBooks } = useStore();
  if (items.length === 0) return null;
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
              subtitle={
                fraction != null
                  ? `${Math.round(fraction * 100)}% read`
                  : item.origin === 'catalog' && !downloadedBooks.includes(item.id)
                    ? '⬇ Free download'
                    : item.author
              }
              onPress={() => router.push({ pathname: '/classic/[id]', params: { id: item.id } })}
              onLongPress={onLongPress && (() => onLongPress(item))}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  find: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, marginHorizontal: 16, marginTop: -12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.accent },
  findIcon: { fontSize: 24 },
  findTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  findSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  findChev: { color: colors.accent, fontSize: 28, fontWeight: '300' },
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
  ownMore: { color: colors.text, fontSize: 20, fontWeight: '800' },
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
