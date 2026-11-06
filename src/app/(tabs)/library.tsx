import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookActions, openOwnBook, type BookActionTarget } from '@/components/BookActions';
import { BookCover } from '@/components/BookCover';
import { BookGrid } from '@/components/BookGrid';
import { Icon, type IconName } from '@/components/Icon';
import { MyBooks } from '@/components/MyBooks';
import { SearchField } from '@/components/SearchField';
import { SectionHeader } from '@/components/SectionHeader';
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
  // Library has two places: every book, and the books you added yourself.
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<'all' | 'mine'>(params.view === 'mine' ? 'mine' : 'all');
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
          <Icon name={favoriteBooks.length ? 'heartFull' : 'heart'} size={22} color="#FF6B81" strokeWidth={2} />
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
    return SHELVES.map((s) => ({ ...s, ...(kid && KID_SHELF_TITLES[s.id] ? { ...KID_SHELF_TITLES[s.id], subtitle: undefined } : {}), items: ready.filter((c) => shelfOf(c) === s.id).sort((a, b) => started(b).localeCompare(started(a))) })).filter(
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
        setView('mine');
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
      <View style={styles.segment}>
        {(['all', 'mine'] as const).map((v) => (
          <Pressable
            key={v}
            accessibilityRole="tab"
            accessibilityState={{ selected: view === v }}
            accessibilityLabel={v === 'all' ? 'All books' : 'My books'}
            onPress={() => setView(v)}
            style={[styles.segmentItem, view === v && styles.segmentOn]}>
            <Icon name={v === 'all' ? 'books' : 'inbox'} size={16} color={view === v ? colors.background : colors.muted} strokeWidth={2.2} />
            <Text style={[styles.segmentText, view === v && styles.segmentTextOn]}>
              {v === 'all' ? t('All books') : t('My books')}
              {v === 'mine' && ownBooks.length ? ` · ${ownBooks.length}` : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      {view === 'mine' ? (
        <MyBooks books={ownBooks} opening={opening} error={fileError} onAdd={pick} onOpen={(b) => (b.ideas?.length ? router.push({ pathname: '/book/[id]', params: { id: ownSourceId(b.id) } }) : openOwn(b))} onLongPress={ownActions} />
      ) : (
      <>
      <SearchField
        accessibilityLabel="Search the library"
        value={query}
        onChangeText={setQuery}
        placeholder={t('Search {n} books and authors', { n: sources.length })}
        containerStyle={styles.search}
      />

      {!kid && (
      <Pressable accessibilityLabel="Find a free book" onPress={() => router.push('/find')} style={styles.find}>
        <View style={styles.findIcon}>
          <Icon name="search" size={22} color={colors.onAccent} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.findTitle}>{t('Find a free book')}</Text>
          <Text style={styles.findSub}>{t('Thousands of classics in English and French, one tap to download')}</Text>
        </View>
        <Icon name="chevronRight" size={20} color={colors.accent} strokeWidth={2.2} />
      </Pressable>
      )}

      {q ? (
        <>
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'book' : 'books'}
            {classicResults.length ? ` · ${classicResults.length} free full ${classicResults.length === 1 ? 'book' : 'books'}` : ''}
          </Text>
          <BookGrid books={results} />
          {classicResults.length > 0 && <ClassicShelf title="Free full books" icon="books" items={classicResults} onLongPress={classicActions} />}
        </>
      ) : (
        <>
          {myBooks.length > 0 && <ClassicShelf title="Private books" icon="lock" subtitle="Only in this app" items={myBooks} onLongPress={classicActions} />}
          {recentlyAdded.length > 0 && <ClassicShelf title={t('Recently added')} icon="sparkle" items={recentlyAdded} onLongPress={classicActions} />}
          <ClassicShelf title={t('Read aloud by a real narrator')} icon="mic" subtitle="Listen while the words light up" items={narrated} onLongPress={classicActions} />
          <Shelf title={t('Continue reading')} icon="bookmark" books={shelves.inProgress} />
          {classicShelves.map((s) => (
            <ClassicShelf key={s.id} title={s.title} icon={s.icon} subtitle={s.subtitle} items={s.items} onLongPress={classicActions} />
          ))}
          <ClassicShelf title="More full books" icon="download" subtitle="Free to download, one tap" items={toDownload} onLongPress={classicActions} />
          <Shelf title="Free from the author" icon="gift" books={shelves.free} />
          {shelves.byTopic.map(({ topic, books }) => (
            <Shelf key={topic.id} title={topic.name} tint={topic.color} books={books} topicId={topic.id} />
          ))}
          <Shelf title="Finished" icon="checkCircle" books={shelves.finished} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Covers from Open Library. Every summary is written in our own words. Full classics are public domain, from Project Gutenberg.
            </Text>
          </View>
        </>
      )}
      </>
      )}
      {actions && <BookActions target={actions} onClose={() => setActions(null)} />}
    </ScrollView>
  );
}

/** Shelves for full books. Older bundled books have no shelf field, so they're placed by topic. */
const SHELVES: { id: NonNullable<Classic['shelf']>; title: string; icon: IconName; subtitle?: string }[] = [
  { id: 'wisdom', title: 'Wisdom & philosophy', icon: 'columns', subtitle: 'Full books' },
  { id: 'lives', title: 'Lives & self-improvement', icon: 'sprout' },
  { id: 'novels', title: 'Great novels & stories', icon: 'book' },
  { id: 'ideas', title: 'Big ideas & science', icon: 'bulb' },
  { id: 'poetry', title: 'Poetry & plays', icon: 'feather' },
  { id: 'french', title: 'En français', icon: 'globe' },
];
/** Shelf names in kid mode. */
const KID_SHELF_TITLES: Partial<Record<NonNullable<Classic['shelf']>, { title: string; icon: IconName }>> = {
  novels: { title: 'Adventures & stories for kids', icon: 'teddy' },
  lives: { title: 'True adventures', icon: 'compass' },
  ideas: { title: 'Science stories', icon: 'telescope' },
  french: { title: 'Pour les enfants, en français', icon: 'globe' },
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

function ClassicShelf({ title, items, onLongPress, icon, subtitle }: { title: string; items: typeof classics; onLongPress?: (c: Classic) => void; icon?: IconName; subtitle?: string }) {
  const { readerProgress, downloadedBooks } = useStore();
  if (items.length === 0) return null;
  return (
    <View style={styles.shelf}>
      <SectionHeader title={title} icon={icon} subtitle={subtitle} />
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
                    ? 'Free download'
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
  find: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, marginHorizontal: 16, marginTop: -12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  findIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
  segment: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, marginBottom: -12, padding: 4, borderRadius: 14, backgroundColor: colors.surface },
  segmentItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  segmentOn: { backgroundColor: colors.text },
  segmentText: { color: colors.muted, fontWeight: '700', fontSize: 14 },
  segmentTextOn: { color: colors.background },
  findTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  findSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  shelf: { gap: 12 },
  shelfRow: { gap: 14, paddingHorizontal: 16 },
  headerHeart: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 16, paddingHorizontal: 4 },
  headerHeartCount: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  container: { flex: 1, backgroundColor: colors.background },
  content: { gap: 28, paddingBottom: 32 },
  search: { marginHorizontal: 16, marginTop: 12, marginBottom: -8 },
  count: { color: colors.muted, paddingHorizontal: 16 },
  footer: { paddingHorizontal: 16 },
  footerText: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
