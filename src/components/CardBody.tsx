import { StyleSheet, Text, View } from 'react-native';

import { colors, serif } from '@/lib/theme';
import type { Idea } from '@/lib/types';

type Props = {
  idea: Idea;
  /** Cut long poems short in the feed; the detail screen shows them in full. */
  maxPoemLines?: number;
  /** Shrink text for long cards so they fit on one screen. */
  compact?: boolean;
  /** Cut the body to this many lines (the feed links to the full card). */
  bodyLines?: number;
};

/** The text of a card, laid out for its kind. Shared by the feed, the book reader and the detail screen. */
export function CardBody({ idea, maxPoemLines, compact = false, bodyLines }: Props) {
  if (idea.kind === 'quote') {
    const long = idea.body.length > 140;
    return (
      <View style={styles.gap}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={[styles.quote, long && styles.quoteLong]}>{idea.body}</Text>
        <Text style={styles.attribution}>
          — {idea.author}
          {idea.cite ? <Text style={styles.cite}>, {idea.cite}</Text> : null}
        </Text>
      </View>
    );
  }

  if (idea.kind === 'poem') {
    const lines = idea.body.split('\n');
    const cut = maxPoemLines !== undefined && lines.length > maxPoemLines;
    const shown = cut ? lines.slice(0, maxPoemLines).join('\n').trimEnd() + '\n…' : idea.body;
    return (
      <View style={styles.gap}>
        <View>
          <Text style={styles.poemTitle}>{idea.title}</Text>
          <Text style={styles.poemAuthor}>
            {idea.author}
            {idea.year ? ` · ${idea.year}` : ''}
          </Text>
        </View>
        <Text style={[styles.poem, compact && styles.poemCompact]}>{shown}</Text>
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      {idea.kind === 'fact' && <Text style={styles.label}>💡 Did you know?</Text>}
      <Text style={[styles.title, compact && styles.titleCompact]}>{idea.title}</Text>
      <Text style={[styles.body, compact && styles.bodyCompact]} numberOfLines={bodyLines}>
        {idea.body}
      </Text>
    </View>
  );
}

export const POEM_PREVIEW_LINES = 14;

const styles = StyleSheet.create({
  gap: { gap: 14 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  titleCompact: { fontSize: 24, lineHeight: 30 },
  body: { color: colors.text, fontSize: 18, lineHeight: 28, opacity: 0.94, fontFamily: 'Literata_400Regular' },
  bodyCompact: { fontSize: 16, lineHeight: 25 },
  quoteMark: { color: colors.text, fontSize: 72, lineHeight: 72, fontFamily: serif, opacity: 0.5, marginBottom: -24 },
  quote: { color: colors.text, fontSize: 28, lineHeight: 38, fontFamily: serif, fontStyle: 'italic' },
  quoteLong: { fontSize: 22, lineHeight: 32 },
  attribution: { color: colors.text, fontSize: 16, fontWeight: '700', opacity: 0.9 },
  cite: { fontWeight: '400', opacity: 0.8 },
  poemTitle: { color: colors.text, fontSize: 24, fontWeight: '800', fontFamily: serif },
  poemAuthor: { color: colors.text, fontSize: 14, opacity: 0.75, marginTop: 4 },
  poem: { color: colors.text, fontSize: 17, lineHeight: 26, fontFamily: serif },
  poemCompact: { fontSize: 15, lineHeight: 22 },
});
