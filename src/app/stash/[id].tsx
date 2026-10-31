import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { IdeaRow } from '@/components/IdeaRow';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function StashScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stashes, ideaById, deleteStash } = useStore();
  const stash = stashes.find((s) => s.id === id);

  if (!stash) return <Text style={styles.empty}>This stash no longer exists.</Text>;

  const ideas = stash.ideaIds.map((ideaId) => ideaById[ideaId]).filter(Boolean);

  return (
    <>
      <Stack.Screen
        options={{
          title: stash.name,
          headerRight:
            stash.id === 'saved'
              ? undefined
              : () => (
                  <Pressable
                    onPress={() => {
                      deleteStash(stash.id);
                      router.back();
                    }}>
                    <Text style={styles.delete}>Delete</Text>
                  </Pressable>
                ),
        }}
      />
      <FlatList
        data={ideas}
        keyExtractor={(idea) => idea.id}
        renderItem={({ item }) => <IdeaRow idea={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState art="books" title="Nothing here yet" text="Tap ☆ Stash on any idea, or long-press a passage in a full book, to save it here." />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, padding: 16 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 32, paddingHorizontal: 24 },
  delete: { color: '#FF7A7A', fontWeight: '600', marginRight: 16 },
});
