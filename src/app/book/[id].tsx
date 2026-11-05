import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { BookCover } from '@/components/BookCover';
import { Icon, type IconName } from '@/components/Icon';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Shelf } from '@/components/Shelf';
import { classicBySourceId, classicReaderId } from '@/lib/fullbook';
import { ownSourceId } from '@/lib/ownbooks';
import { useAiOnOpen } from '@/lib/useOwnIdeas';
import { usePushOrBack } from '@/lib/nav';
import { shareOwn, shareSource } from '@/lib/shareBook';
import { useStore } from '@/lib/store';
import { colors, readMinutes, serif, sourceKindIcon, sourceKindLabel } from '@/lib/theme';

/** Legal ways to read a book that's still in copyright: borrow it, preview it, or buy it. */
function GetThisBook({ title, author }: { title: string; author: string }) {
  const q = encodeURIComponent(`${title} ${author}`);
  const options = [
    { label: 'Borrow free on Open Library', note: 'Free online lending, like a library', url: `https://openlibrary.org/search?q=${q}&mode=everything` },
    { label: 'Borrow with Libby', note: 'Free e-book and audiobook loans with a library card', url: `https://libbyapp.com/search/everywhere/search/query-${encodeURIComponent(title)}/page-1` },
    { label: 'Preview on Google Books', note: 'Read the first pages', url: `https://www.google.com/search?tbm=bks&q=${q}` },
    { label: 'Buy on Kobo', note: 'E-book, DRM-free when the publisher allows', url: `https://www.kobo.com/search?query=${q}` },
    { label: 'Buy on Amazon', note: 'Kindle, paperback or audiobook', url: `https://www.amazon.com/s?k=${q}` },
    { label: 'Buy from Bookshop.org', note: 'Supports independent bookshops', url: `https://bookshop.org/search?keywords=${q}` },
  ];
  return (
    <View style={styles.getBox}>
      {options.map((o) => (
        <Pressable key={o.label} accessibilityLabel={o.label} onPress={() => Linking.openURL(o.url)} style={styles.getRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.getLabel}>{o.label}</Text>
            <Text style={styles.getNote}>{o.note}</Text>
          </View>
          <Icon name="share" size={18} color={colors.accent} strokeWidth={2} />
        </Pressable>
      ))}
      <Text style={styles.freeHint}>Got the EPUB? Open it in Library → “Open your own book” to read it here with voices and highlights.</Text>
    </View>
  );
}

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sourceById, ideasBySource, topicById, bookProgress, sources, readerProgress, ownBooks, account } = useStore();
  const pushOrBack = usePushOrBack();
  const book = sourceById[id];
  // One of your own books (its ideas were made by the app from its text).
  const own = id?.startsWith('own-') ? ownBooks.find((b) => ownSourceId(b.id) === id) : undefined;
  // Picked passages still? Ask the AI for summaries now, and say how it's going.
  const aiNote = useAiOnOpen(own);
  const [getOpen, setGetOpen] = useState(false);

  if (!book) return <Text style={styles.muted}>Book not found.</Text>;

  const ideas = ideasBySource[book.id] ?? [];
  const topic = topicById[book.topicId];
  const progress = bookProgress[book.id];
  const minutes = readMinutes(ideas.map((i) => `${i.title} ${i.body}`));
  const related = sources.filter((s) => s.topicId === book.topicId && s.id !== book.id && !s.id.startsWith('own-'));
  const ownProgress = own ? readerProgress[`own:${own.id}`] : undefined;
  const openOwn = () =>
    own &&
    (own.kind === 'epub'
      ? pushOrBack({ pathname: '/reader/[id]', params: { id: own.id, kind: 'own' } })
      : pushOrBack({ pathname: '/pdfbook/[id]', params: { id: own.id, source: 'own' } }));
  const fullText = classicBySourceId[book.id];
  const fullProgress = fullText ? readerProgress[classicReaderId(fullText.id)] : undefined;

  const read = (start: number) => router.push({ pathname: '/read/[id]', params: { id: book.id, start: String(start) } });
  const primaryLabel = progress?.finishedAt
    ? 'Read again'
    : progress
      ? `Continue · idea ${progress.position + 1} of ${ideas.length}`
      : 'Start reading';

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <LinearGradient colors={[topic?.color ?? '#2A2E37', `${topic?.color ?? '#2A2E37'}00`]} locations={[0, 0.62]} style={StyleSheet.absoluteFill} />
          <BookCover book={book} width={140} favoriteKey={null} onPress={() => read(progress?.finishedAt ? 0 : progress?.position ?? 0)} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>
            {book.author}
            {book.year ? ` · ${book.year < 0 ? `${-book.year} BC` : book.year}` : ''}
          </Text>
        </View>
        <View style={styles.stats}>
          <Stat icon={sourceKindIcon[book.kind]} label={sourceKindLabel[book.kind]} />
          <Stat icon="bulb" label={`${ideas.length} key ideas`} />
          <Stat icon="clock" label={`${minutes} min`} />
        </View>

        <View style={styles.section}>
          <Pressable
            accessibilityRole="button"
            onPress={() => read(progress?.finishedAt ? 0 : progress?.position ?? 0)}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
            <Icon name={progress?.finishedAt ? 'book' : 'bulb'} size={19} color={colors.onAccent} strokeWidth={2.2} />
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </Pressable>
          {own ? (
            <Pressable onPress={openOwn} style={styles.fullBook}>
              <Icon name="book" size={18} color={colors.accent} strokeWidth={2} />
              <Text style={styles.fullBookText}>
                {ownProgress ? `Continue your book · ${Math.round(ownProgress.fraction * 100)}%` : 'Read your book'}
              </Text>
            </Pressable>
          ) : fullText ? (
            <Pressable
              onPress={() => pushOrBack({ pathname: '/reader/[id]', params: { id: fullText.id, kind: 'classic' } })}
              style={styles.fullBook}>
              <Icon name="books" size={18} color={colors.accent} strokeWidth={2} />
              <Text style={styles.fullBookText}>
                {fullProgress ? `Continue the full book · ${Math.round(fullProgress.fraction * 100)}%` : 'Read the full book · free'}
              </Text>
            </Pressable>
          ) : book.free ? (
            <>
              <Pressable onPress={() => Linking.openURL(book.free!.url)} style={styles.fullBook}>
                <Icon name="gift" size={18} color={colors.accent} strokeWidth={2} />
                <Text style={styles.fullBookText}>Download free from the author</Text>
              </Pressable>
              <Text style={styles.freeHint}>
                Got the EPUB or PDF? Open it in Library → Your books → “Open your own book” to read it here.
              </Text>
            </>
          ) : (
            book.kind === 'book' && (
              <Pressable accessibilityLabel="Get this book" onPress={() => setGetOpen((o) => !o)} style={styles.fullBook}>
                <Icon name="book" size={18} color={colors.accent} strokeWidth={2} />
                <Text style={styles.fullBookText}>Get this book</Text>
                <View style={getOpen ? styles.flip : undefined}>
                  <Icon name="chevronDown" size={16} color={colors.accent} strokeWidth={2.4} />
                </View>
              </Pressable>
            )
          )}
          {getOpen && <GetThisBook title={book.title} author={book.author} />}
          <View style={styles.secondaryRow}>
            <FavoriteButton favoriteKey={own ? `own:${own.id}` : `book:${book.id}`} title={book.title} size="large" />
            <Pressable
              onPress={() => void (own ? shareOwn(own) : shareSource(book, ideas.length))}
              style={styles.secondary}>
              <Icon name="share" size={17} color={colors.text} strokeWidth={2} />
              <Text style={styles.secondaryText}>Share</Text>
            </Pressable>
          </View>

          <Text style={styles.description}>{book.description}</Text>
          {book.free && (
            <Text style={styles.freeHint}>
              {book.free.note}
              {book.free.license && (
                <>
                  {' '}License:{' '}
                  <Text style={styles.licenseLink} onPress={() => book.free?.licenseUrl && Linking.openURL(book.free.licenseUrl)}>
                    {book.free.license}
                  </Text>
                  , © {book.author}.
                </>
              )}
            </Text>
          )}
          {topic && (
            <Pressable onPress={() => router.push({ pathname: '/topic/[id]', params: { id: topic.id } })}>
              <View style={styles.topicChip}>
                <View style={[styles.topicDot, { backgroundColor: topic.color }]} />
                <Text style={styles.topic}>{topic.name}</Text>
                <Icon name="chevronRight" size={14} color={colors.muted} strokeWidth={2.4} />
              </View>
            </Pressable>
          )}

          <Text style={styles.heading}>Key ideas</Text>
          {own && aiNote && own.ideasBy !== 'ai' && <Text style={styles.aiNote}>{aiNote}</Text>}
          {own && (
            <Text style={styles.freeHint}>
              {own.ideasBy === 'ai'
                ? 'Summarised from your book by AI (Google Gemini), in its own words. Tap one to read it, then stash the cards you want to keep.'
                : account
                  ? 'For now, these are passages picked from your book. AI (Google Gemini) rewrites them as summaries in the background, usually within a minute of adding the book (a PDF: after you open it). Tap one to read it, then stash the cards you want to keep.'
                  : 'Picked out of your book by the app: the passages that carry each part’s main points. Sign in to have AI write them as summaries instead. Tap one to read it, then stash the cards you want to keep.'}
            </Text>
          )}
          <View style={styles.ideaList}>
            {ideas.map((idea, i) => {
              const done = progress?.finishedAt || (progress && i < progress.position);
              return (
                <Pressable key={idea.id} onPress={() => read(i)} style={({ pressed }) => [styles.ideaRow, i > 0 && styles.ideaRowLine, pressed && styles.ideaPressed]}>
                  <View style={[styles.ideaNumber, done && styles.ideaDone]}>
                    {done ? <Icon name="check" size={14} color={colors.onAccent} strokeWidth={2.8} /> : <Text style={styles.ideaNumberText}>{i + 1}</Text>}
                  </View>
                  <Text style={styles.ideaTitle}>{idea.title}</Text>
                  <Icon name="chevronRight" size={16} color={colors.muted} strokeWidth={2.2} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <Shelf title="More like this" books={related} />
      </ScrollView>
    </>
  );
}

function Stat({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} size={15} color={colors.muted} strokeWidth={2} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, gap: 18 },
  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 8, paddingHorizontal: 24, gap: 8 },
  stats: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  statText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  flip: { transform: [{ rotate: '180deg' }] },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', fontFamily: serif, textAlign: 'center', marginTop: 12 },
  author: { color: colors.muted, fontSize: 16 },
  section: { paddingHorizontal: 16, gap: 12 },
  primary: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  fullBook: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, alignItems: 'center', borderWidth: 1.5, borderColor: colors.accent },
  fullBookText: { color: colors.accent, fontWeight: '800', fontSize: 15 },
  aiNote: { color: colors.accent, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  freeHint: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  licenseLink: { color: colors.accent, fontWeight: '700' },
  secondary: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 7, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontWeight: '700' },
  description: { color: colors.text, fontSize: 16, lineHeight: 24, marginTop: 8 },
  topicChip: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.surface },
  topicDot: { width: 9, height: 9, borderRadius: 5 },
  topic: { color: colors.text, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 12 },
  ideaList: { borderRadius: 18, backgroundColor: colors.surface, overflow: 'hidden' },
  ideaRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 14 },
  ideaRowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  ideaPressed: { backgroundColor: colors.surfaceRaised },
  ideaNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  ideaNumberText: { color: colors.muted, fontWeight: '800', fontSize: 13 },
  ideaDone: { backgroundColor: colors.accent },
  ideaTitle: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  muted: { color: colors.muted, padding: 24 },
  getBox: { gap: 8, padding: 12, borderRadius: 18, backgroundColor: colors.surface },
  getRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 8, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  getLabel: { color: colors.text, fontWeight: '800', fontSize: 15 },
  getNote: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
