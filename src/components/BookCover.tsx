import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { useStore } from '@/lib/store';
import { colors, onCardScope, serif } from '@/lib/theme';
import type { Source } from '@/lib/types';

type Props = {
  book: Source;
  width: number;
  /** Show title and progress under the cover. */
  caption?: boolean;
  onPress?: () => void;
  /** Reading progress 0–1, when it isn't the key-ideas progress (e.g. a full classic). */
  fraction?: number;
  /** Replaces the author line under the cover. */
  subtitle?: string;
  /** Key for the favorite heart; defaults to the library book. Pass null to hide the heart. */
  favoriteKey?: string | null;
  /** Small label on the cover, e.g. "NEW". */
  badge?: string;
  /** Long press: a menu of actions for this book. */
  onLongPress?: () => void;
};

// iOS Safari: a long press on a cover shouldn't select its text or offer to save the image, so the menu can open.
// !important beats the inline user-select React Native Web puts on text.
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('longpress-style')) {
  const style = document.createElement('style');
  style.id = 'longpress-style';
  style.textContent =
    '[data-longpress], [data-longpress] * { -webkit-touch-callout: none !important; -webkit-user-select: none !important; user-select: none !important; -webkit-user-drag: none !important; } [data-longpress] img { pointer-events: none !important; }';
  document.head.appendChild(style);
  document.addEventListener('contextmenu', (e) => {
    if ((e.target as Element | null)?.closest?.('[data-longpress]')) e.preventDefault();
  });
  // If iOS still starts a selection inside a cover, drop it.
  document.addEventListener('selectionchange', () => {
    const node = document.getSelection()?.anchorNode;
    const el = node && (node.nodeType === 1 ? (node as Element) : node.parentElement);
    if (el?.closest?.('[data-longpress]')) document.getSelection()?.removeAllRanges();
  });
}

/** A typographic cover in the topic's colour, with the Open Library cover on top once it loads. */
export function BookCover({
  book,
  width,
  caption = false,
  onPress,
  fraction: fractionOverride,
  subtitle,
  favoriteKey,
  badge,
  onLongPress,
}: Props) {
  const { topicById, bookProgress, ideasBySource } = useStore();
  const [failed, setFailed] = useState(false);
  const topic = topicById[book.topicId];
  const height = width * 1.5;
  const progress = bookProgress[book.id];
  const total = ideasBySource[book.id]?.length ?? 0;
  const fraction = fractionOverride ?? (progress?.finishedAt ? 1 : progress && total ? progress.position / total : 0);

  // The heart sits beside the cover's button rather than inside it: nested buttons aren't valid on the web.
  return (
    <View style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${book.title} by ${book.author}`}
        onPress={onPress ?? (() => router.push({ pathname: '/book/[id]', params: { id: book.id } }))}
        onLongPress={onLongPress}
        delayLongPress={450}
        {...(onLongPress && Platform.OS === 'web' ? ({ dataSet: { longpress: '1' } } as object) : {})}
        style={{ width }}>
        <View style={[styles.cover, onCardScope, { width, height, backgroundColor: topic?.color ?? colors.surface }]}>
          <View style={styles.spine} />
          <Text style={[styles.title, { fontSize: titleSize(book.title, width) }, favoriteKey !== null && styles.titleBesideHeart]} numberOfLines={5}>
            {book.title}
          </Text>
          <Text style={[styles.author, { fontSize: Math.max(9, width / 13) }]} numberOfLines={2}>
            {book.author}
          </Text>
          {(book.coverUrl || book.coverId) && !failed && (
            <Image
              source={{
                uri: book.coverUrl ?? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`,
              }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onError={() => setFailed(true)}
            />
          )}
          {badge && <Text style={styles.badge}>{badge}</Text>}
          {fraction > 0 && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(fraction * 100)}%` }]} />
            </View>
          )}
        </View>
        {caption && (
          <View style={styles.caption}>
            <Text style={styles.captionTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.captionAuthor} numberOfLines={1}>
              {subtitle ?? (progress?.finishedAt ? '✓ Finished' : book.author)}
            </Text>
          </View>
        )}
      </Pressable>
      {favoriteKey !== null && <FavoriteButton favoriteKey={favoriteKey ?? `book:${book.id}`} title={book.title} />}
    </View>
  );
}

/**
 * The cover title's font size: width / 8, made smaller when its longest word wouldn't fit on one line, so
 * "Enchiridion" never breaks in two. A bold serif letter is about half the font size wide.
 */
function titleSize(title: string, width: number): number {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  return Math.max(9, Math.min(width / 8, (width - 28) / (longest * 0.52)));
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    paddingLeft: 16,
    justifyContent: 'space-between',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: { color: colors.text, fontWeight: '800', fontFamily: serif },
  // The title starts below the heart in the top-right corner, so the heart never covers it.
  titleBesideHeart: { marginTop: 24 },
  author: { color: colors.text, opacity: 0.8 },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  progressFill: { height: 4, backgroundColor: colors.accent },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  caption: { marginTop: 8, gap: 2 },
  captionTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
  captionAuthor: { color: colors.muted, fontSize: 12 },
});
