import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function StashesScreen() {
  const { stashes, createStash } = useStore();
  const [name, setName] = useState('');

  const create = () => {
    if (!name.trim()) return;
    createStash(name);
    setName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.newRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={create}
          placeholder="New stash name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable onPress={create} style={styles.button}>
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
      </View>
      <FlatList
        data={stashes}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/stash/[id]', params: { id: item.id } })}
            style={styles.stash}>
            <Text style={styles.stashName}>{item.name}</Text>
            <Text style={styles.stashCount}>
              {item.ideaIds.length} {item.ideaIds.length === 1 ? 'idea' : 'ideas'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  newRow: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 0 },
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
  list: { gap: 10, padding: 16 },
  stash: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  stashName: { color: colors.text, fontSize: 17, fontWeight: '700' },
  stashCount: { color: colors.muted },
});
