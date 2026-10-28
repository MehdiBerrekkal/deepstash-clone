import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CardBody } from '@/components/CardBody';
import { useStore } from '@/lib/store';
import { colors, sourceKindLabel } from '@/lib/theme';

export default function IdeaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ideaById, topicById, sourceById, stashes, toggleInStash, createStash } = useStore();
  const [newName, setNewName] = useState('');
  const idea = ideaById[id];

  if (!idea) return <Text style={styles.muted}>Card not found.</Text>;

  const topic = topicById[idea.topicId];
  const source = idea.sourceId ? sourceById[idea.sourceId] : undefined;

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
        <CardBody idea={idea} />
        {source && (
          <Pressable
            onPress={() => {
              router.back();
              router.push({ pathname: '/book/[id]', params: { id: source.id } });
            }}>
            <Text style={styles.source}>
              {sourceKindLabel[source.kind]} · {source.title} · {source.author} ›
            </Text>
          </Pressable>
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
  card: { borderRadius: 24, padding: 22, gap: 16, marginBottom: 12 },
  topic: { color: colors.text, fontWeight: '600', opacity: 0.9 },
  source: { color: colors.text, opacity: 0.85, fontSize: 13, fontWeight: '600' },
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
  buttonText: { color: colors.onAccent, fontWeight: '700' },
  muted: { color: colors.muted, padding: 24 },
});
