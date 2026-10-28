import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Shelf } from '@/components/Shelf';
import { TopicChip } from '@/components/TopicChip';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const GOALS = [5, 10, 20, 50];

export default function ProfileScreen() {
  const {
    streak, today, dailyGoal, setDailyGoal, readIdeaIds, likedIdeaIds, stashes, bookProgress, sourceById,
    topics, followedTopicIds, topicById, resetProgress,
  } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const finished = Object.entries(bookProgress).filter(([id, p]) => p.finishedAt && sourceById[id]).map(([id]) => sourceById[id]);
  const stashed = new Set(stashes.flatMap((s) => s.ideaIds)).size;
  const goalFraction = Math.min(today.count / dailyGoal, 1);
  const followed = followedTopicIds.map((id) => topicById[id]).filter(Boolean);

  const stats = [
    { label: 'Day streak', value: `🔥 ${streak.count}` },
    { label: 'Cards read', value: readIdeaIds.length },
    { label: 'Books finished', value: finished.length },
    { label: 'Liked', value: likedIdeaIds.length },
    { label: 'Stashed', value: stashed },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.heading}>Today&apos;s goal</Text>
        <Text style={styles.big}>
          {Math.min(today.count, dailyGoal)} / {dailyGoal} cards
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(goalFraction * 100)}%` }]} />
        </View>
        <Text style={styles.muted}>{goalFraction >= 1 ? 'Goal reached. Nice work!' : 'Swipe through the feed or a book to fill it up.'}</Text>
        <View style={styles.goals}>
          {GOALS.map((g) => (
            <Pressable key={g} onPress={() => setDailyGoal(g)} style={[styles.goal, g === dailyGoal && styles.goalOn]}>
              <Text style={[styles.goalText, g === dailyGoal && styles.goalTextOn]}>{g}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>Your topics</Text>
          <Pressable onPress={() => router.push('/onboarding')}>
            <Text style={styles.link}>Edit ›</Text>
          </Pressable>
        </View>
        <View style={styles.chips}>
          {followed.map((t) => (
            <TopicChip key={t.id} topic={t} selected onPress={() => router.push({ pathname: '/topic/[id]', params: { id: t.id } })} />
          ))}
        </View>
        <Text style={styles.muted}>
          Following {followed.length} of {topics.length} topics.
        </Text>
      </View>

      <View style={styles.shelf}>
        <Shelf title="Books you finished" books={finished} />
      </View>

      <View style={styles.section}>
        {confirmReset ? (
          <View style={styles.confirm}>
            <Text style={styles.muted}>Clear reading progress and history? Stashes and likes stay.</Text>
            <View style={styles.goals}>
              <Pressable
                onPress={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
                style={[styles.goal, styles.danger]}>
                <Text style={styles.goalText}>Clear</Text>
              </Pressable>
              <Pressable onPress={() => setConfirmReset(false)} style={styles.goal}>
                <Text style={styles.goalText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable onPress={() => setConfirmReset(true)}>
            <Text style={styles.dangerText}>Reset reading progress</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 20, paddingBottom: 40 },
  card: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  big: { color: colors.text, fontSize: 28, fontWeight: '800' },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: colors.accent },
  muted: { color: colors.muted },
  goals: { flexDirection: 'row', gap: 8, marginTop: 4 },
  goal: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  goalOn: { backgroundColor: colors.accent },
  goalText: { color: colors.text, fontWeight: '700' },
  goalTextOn: { color: colors.onAccent },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexGrow: 1, flexBasis: '30%', padding: 14, borderRadius: 16, backgroundColor: colors.surface, gap: 4 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 12 },
  section: { gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  link: { color: colors.accent, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shelf: { marginHorizontal: -16 },
  confirm: { gap: 8 },
  danger: { backgroundColor: '#5A2229' },
  dangerText: { color: colors.danger, fontWeight: '600', textAlign: 'center' },
});
