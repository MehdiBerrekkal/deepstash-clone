import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopicChip } from '@/components/TopicChip';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const MIN_TOPICS = 3;

export default function OnboardingScreen() {
  const { topics, followedTopicIds, setFollowedTopics } = useStore();
  const [selected, setSelected] = useState<string[]>(followedTopicIds);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((t) => t !== id) : [...s, id]));

  const done = () => {
    setFollowedTopics(selected);
    router.replace('/');
  };

  const canContinue = selected.length >= MIN_TOPICS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What do you want to get smarter about?</Text>
        <Text style={styles.subtitle}>Pick at least {MIN_TOPICS} topics. Your feed starts with these.</Text>
        <View style={styles.chips}>
          {topics.map((topic) => (
            <TopicChip key={topic.id} topic={topic} selected={selected.includes(topic.id)} onPress={() => toggle(topic.id)} />
          ))}
        </View>
      </ScrollView>
      <Pressable disabled={!canContinue} onPress={done} style={[styles.button, !canContinue && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>
          {canContinue ? 'Start reading' : `Choose ${MIN_TOPICS - selected.length} more`}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 12 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36, marginTop: 24 },
  subtitle: { color: colors.muted, fontSize: 16, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: { margin: 24, paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#1A1300', fontWeight: '800', fontSize: 16 },
});
