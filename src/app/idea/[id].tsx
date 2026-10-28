import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useStore } from '@/lib/store';
import { colors, sourceKindLabel } from '@/lib/theme';

export default function IdeaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ideaById, topicById, sourceById, stashes, toggleInStash, createStash } = useStore();
  const [newName, setNewName] = useState('');
  const idea = ideaById[id];

  if (!idea) return <Text style={styles.muted}>Idea not found.</Text>;

  const topic = topicById[idea.topicId];
  const source = sourceById[idea.sourceId];

  const createAndAdd = () => {
    if (!newName.trim()) return;
    const stash = createStash(newName);
    toggleInStash(stash.id, idea.id);
    setNewName('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: topic?.color ?? colors.surface }]}>
        <Text style={styles.topic}>{topic ? `${topic.emoji}  ${topic.name}` : ''}</Text>
        <Text style={styles.title}>{idea.title}</Text>
        <Text style={styles.body}>{idea.body}</Text>
        {source && (
          <Text style={styles.source}>
            {sourceKindLabel[source.kind]} · {source.title} · {source.author}
          </Text>
        )}
      </View>

      <Text style={styles.heading}>Add to stash</Text>
      {stashes.map((stash) => {
        const inStash = stash.ideaIds.includes(idea.id);
        return (
          <Pressable key={stash.id} onPress={() => toggleInStash(stash.id, idea.id)} style={styles.stashRow}>
            <Text style={styles.stashName}>{stash.name}</Text>
            <Text style={[styles.check, inStash && styles.checkOn]}>{inStash ? '★' : '☆'}</Text>
          </Pressable>
        );
      })}
      <View style={styles.newRow}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          onSubmitEditing={createAndAdd}
          placeholder="New stash"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable onPress={createAndAdd} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  card: { borderRadius: 24, padding: 22, gap: 12, marginBottom: 12 },
  topic: { color: colors.text, fontWeight: '600', opacity: 0.9 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  body: { color: colors.text, fontSize: 17, lineHeight: 26 },
  source: { color: colors.text, opacity: 0.8, fontSize: 13 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  stashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  stashName: { color: colors.text, fontSize: 16 },
  check: { color: colors.muted, fontSize: 18 },
  checkOn: { color: colors.accent },
  newRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  button: { justifyContent: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: colors.accent },
  buttonText: { color: '#1A1300', fontWeight: '700' },
  muted: { color: colors.muted, padding: 24 },
});
