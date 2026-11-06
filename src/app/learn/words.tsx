import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Pic } from '@/components/learn/Pic';
import { courseById } from '@/data/learn/courses';
import { useUiLang } from '@/lib/i18n';
import { allWords } from '@/lib/learn/lessons';
import { say } from '@/lib/learn/speech';
import { useCoursePath } from '@/lib/learn/useCourse';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const plain = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
type Filter = 'all' | 'known' | 'learning' | 'new';

/** Every word of the course: search it, hear it, see how well you know it. */
export default function WordBankScreen() {
  const { course: courseId } = useLocalSearchParams<{ course: string }>();
  const course = courseById[courseId] ?? courseById.es;
  const lang = useUiLang();
  const fr = lang === 'fr';
  const { learn } = useStore();
  const path = useCoursePath(course);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const words = useMemo(() => allWords(course, path.full), [course, path.full]);
  const items = learn?.items;
  const list = useMemo(() => {
    const needle = plain(q.trim());
    return words.filter((w) => {
      const lv = items?.[w.key!]?.level;
      const state: Filter = lv === undefined ? 'new' : lv >= 2 ? 'known' : 'learning';
      if (filter !== 'all' && state !== filter) return false;
      return !needle || plain(w.text).includes(needle) || plain(fr ? w.fr : w.en).includes(needle);
    });
  }, [words, items, q, filter, fr]);
  const count = (f: Filter) => words.filter((w) => {
    const lv = items?.[w.key!]?.level;
    return f === 'all' || (f === 'new' ? lv === undefined : f === 'known' ? (lv ?? -1) >= 2 : lv !== undefined && lv < 2);
  }).length;
  const FILTERS: { id: Filter; en: string; fr: string }[] = [
    { id: 'all', en: 'All', fr: 'Tous' },
    { id: 'known', en: 'Known', fr: 'Acquis' },
    { id: 'learning', en: 'Learning', fr: 'En cours' },
    { id: 'new', en: 'New', fr: 'Nouveaux' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: fr ? 'Mes mots' : 'Word bank' }} />
      <FlatList
        data={list}
        keyExtractor={(w) => w.key!}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <TextInput accessibilityLabel="Search words" value={q} onChangeText={setQ} placeholder={fr ? 'Chercher un mot…' : 'Search a word…'} placeholderTextColor={colors.muted} autoCorrect={false} autoCapitalize="none" style={styles.search} />
            <View style={styles.filters}>
              {FILTERS.map((f) => (
                <Pressable key={f.id} accessibilityLabel={`Filter ${f.en}`} onPress={() => setFilter(f.id)} style={[styles.chip, filter === f.id && { backgroundColor: course.color, borderColor: course.color }]}>
                  <Text style={[styles.chipText, filter === f.id && { color: '#0B0D14' }]}>
                    {fr ? f.fr : f.en} · {count(f.id)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={styles.muted}>{path.ready ? (fr ? 'Aucun mot ne correspond.' : 'No matching words.') : '…'}</Text>}
        renderItem={({ item: w }) => {
          const lv = items?.[w.key!]?.level;
          return (
            <Pressable accessibilityLabel={`Word ${w.text}`} onPress={() => say(w.text, course.voice)} style={styles.row}>
              <Pic emoji={w.emoji ?? '•'} size={36} />
              <View style={styles.flex}>
                <Text style={styles.word}>{w.text}</Text>
                <Text style={styles.muted} numberOfLines={1}>
                  {fr ? w.fr : w.en} · {w.topic.level} · {fr ? w.topic.fr : w.topic.en}
                </Text>
              </View>
              <View style={styles.meter}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <View key={k} style={[styles.pip, { backgroundColor: lv !== undefined && lv > k ? course.color : colors.surfaceRaised }]} />
                ))}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 8, paddingBottom: 48, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { gap: 10, marginBottom: 6 },
  search: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, fontSize: 16, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border },
  chipText: { color: colors.text, fontWeight: '800', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.surface, minHeight: 60 },
  emoji: { fontSize: 24, width: 32, textAlign: 'center' },
  flex: { flex: 1, gap: 2 },
  word: { color: colors.text, fontWeight: '900', fontSize: 17 },
  muted: { color: colors.muted, fontSize: 13 },
  meter: { flexDirection: 'row', gap: 3 },
  pip: { width: 6, height: 14, borderRadius: 3 },
});
