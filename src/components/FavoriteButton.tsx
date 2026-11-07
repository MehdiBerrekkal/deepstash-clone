import { Pressable, StyleSheet, Text } from 'react-native';

import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

type Props = {
  /** "book:<id>", "classic:<id>" or "own:<id>". */
  favoriteKey: string;
  title: string;
  /** small: the round overlay on covers. large: a pill with a label, for book pages. */
  size?: 'small' | 'large';
};

/** Heart that adds a book to Favorites (separate from liking cards). */
export function FavoriteButton({ favoriteKey, title, size = 'small' }: Props) {
  const { isFavoriteBook, toggleFavoriteBook } = useStore();
  const on = isFavoriteBook(favoriteKey);
  const label = on ? `Remove ${title} from favorites` : `Add ${title} to favorites`;

  if (size === 'large') {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => toggleFavoriteBook(favoriteKey)} style={[styles.pill, on && styles.pillOn]}>
        <Text style={[styles.pillText, on && styles.heartOn]}>{on ? '♥ Favorite' : '♡ Favorite'}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => toggleFavoriteBook(favoriteKey)}
      style={styles.round}>
      <Text style={[styles.heart, on && styles.heartOn]}>{on ? '♥' : '♡'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  round: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heart: { color: '#FFFFFF', fontSize: 15, lineHeight: 18 },
  heartOn: { color: '#FF6B81' },
  pill: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surface },
  pillOn: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: '#FF6B81' },
  pillText: { color: colors.text, fontWeight: '700' },
});
