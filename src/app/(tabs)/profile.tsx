import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GoalRing } from '@/components/GoalRing';
import { Shelf } from '@/components/Shelf';
import { TopicChip } from '@/components/TopicChip';
import { classicAsSource } from '@/lib/classicSource';
import { classicById } from '@/lib/fullbook';
import { calendarWeeks, compactNumber, formatDuration, minutesOf, readingSpeed, readingStreak } from '@/lib/stats';
import { localDate, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const GOALS = [5, 10, 20, 30];
const WEEKS = 18;
const DAY_LETTERS = ['M', '', 'W', '', 'F', '', 'S'];

export default function ProfileScreen() {
  const {
    streak, readIdeaIds, likedIdeaIds, stashes, bookProgress, sourceById, topics, followedTopicIds, topicById, resetProgress,
    highlights, readingLog, minuteGoal, setMinuteGoal, finishedReaders, reviewQueue, reviews,
  } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const fullFinished = Object.keys(finishedReaders)
    .filter((key) => key.startsWith('classic:') && classicById[key.slice(8)])
    .map((key) => classicAsSource(classicById[key.slice(8)]));
  const finished = [
    ...fullFinished,
    ...Object.entries(bookProgress).filter(([id, p]) => p.finishedAt && sourceById[id]).map(([id]) => sourceById[id]),
  ];
  const stashed = new Set(stashes.flatMap((s) => s.ideaIds)).size;
  const followed = followedTopicIds.map((id) => topicById[id]).filter(Boolean);
  const todayMinutes = minutesOf(readingLog[localDate()]);
  const days = Object.values(readingLog);
  const totalMinutes = days.reduce((n, d) => n + d.seconds, 0) / 60;
  const words = days.reduce((n, d) => n + d.words, 0);
  const wpm = readingSpeed(readingLog);
  const weeks = calendarWeeks(WEEKS);
  const weekMinutes = weeks[WEEKS - 1].reduce((n, date) => n + (date ? minutesOf(readingLog[date]) : 0), 0);
  const goalStreak = readingStreak(readingLog, minuteGoal * 60);

  const stats = [
    { label: 'Day streak', value: `🔥 ${streak.count}` },
    { label: 'Goal streak', value: `🎯 ${goalStreak}` },
    { label: 'This week', value: formatDuration(weekMinutes) },
    { label: 'All time', value: formatDuration(totalMinutes) },
    { label: 'Words read', value: compactNumber(words) },
    { label: 'Speed', value: wpm ? `${wpm} wpm` : '—' },
    { label: 'Books finished', value: finished.length },
    { label: 'Cards read', value: compactNumber(readIdeaIds.length) },
    { label: 'Stashed', value: stashed },
    { label: 'Liked', value: likedIdeaIds.length },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.card, styles.today]}>
        <GoalRing progress={todayMinutes / minuteGoal} size={112} stroke={11} label={String(todayMinutes)} sublabel={`of ${minuteGoal} min`} />
        <View style={styles.todayText}>
          <Text style={styles.heading}>Today&apos;s reading</Text>
          <Text style={styles.muted}>
            {todayMinutes >= minuteGoal
              ? 'Goal reached. Nice work!'
              : `${minuteGoal - todayMinutes} more ${minuteGoal - todayMinutes === 1 ? 'minute' : 'minutes'} to reach your goal. Books and cards both count.`}
          </Text>
          <Text style={styles.small}>Daily goal (minutes)</Text>
          <View style={styles.goals}>
            {GOALS.map((g) => (
              <Pressable
                key={g}
                accessibilityLabel={`Goal ${g} minutes`}
                onPress={() => setMinuteGoal(g)}
                style={[styles.goal, g === minuteGoal && styles.goalOn]}>
                <Text style={[styles.goalText, g === minuteGoal && styles.goalTextOn]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>Reading calendar</Text>
          <Text style={styles.muted}>last {WEEKS} weeks</Text>
        </View>
        <View style={styles.heatmap}>
          <View style={styles.heatCol}>
            {DAY_LETTERS.map((l, i) => (
              <Text key={i} style={styles.dayLetter}>
                {l}
              </Text>
            ))}
          </View>
          {weeks.map((col, w) => (
            <View key={w} style={styles.heatCol}>
              {col.map((date, d) => {
                const m = date ? minutesOf(readingLog[date]) : 0;
                const level = !date ? -1 : m === 0 ? 0 : m < minuteGoal / 2 ? 1 : m < minuteGoal ? 2 : m < minuteGoal * 2 ? 3 : 4;
                return <View key={d} accessibilityLabel={date ? `${date}: ${m} min` : undefined} style={[styles.cell, HEAT[level + 1]]} />;
              })}
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <Text style={styles.small}>Less</Text>
          {HEAT.slice(1).map((h, i) => (
            <View key={i} style={[styles.cell, styles.legendCell, h]} />
          ))}
          <Text style={styles.small}>More</Text>
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

      <Pressable accessibilityLabel="Review" onPress={() => router.push('/review')} style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>🧠 Smart review</Text>
          <Text style={styles.link}>{reviewQueue.length ? `${reviewQueue.length} due ›` : 'Open ›'}</Text>
        </View>
        <Text style={styles.muted}>
          {Object.keys(reviews).length
            ? `${Object.keys(reviews).length} ideas and highlights in rotation. Each comes back just before you'd forget it.`
            : 'Stashed ideas and highlights come back on a spaced schedule so they stick.'}
        </Text>
      </Pressable>

      <Pressable accessibilityLabel="All highlights" onPress={() => router.push('/highlights')} style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>✎ Highlights and notes</Text>
          <Text style={styles.link}>Open ›</Text>
        </View>
        <Text style={styles.muted}>
          {highlights.length
            ? `${highlights.length} ${highlights.length === 1 ? 'highlight' : 'highlights'} in ${new Set(highlights.map((h) => h.readerId)).size} ${new Set(highlights.map((h) => h.readerId)).size === 1 ? 'book' : 'books'}, ready to search and export.`
            : 'Long-press a paragraph in any full book to highlight it or add a note.'}
        </Text>
        {highlights[0] && (
          <Text style={styles.latest} numberOfLines={2}>
            “{highlights[0].text}”
          </Text>
        )}
      </Pressable>

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

/** Calendar shades: future, none, a little, most of the goal, goal met, double. */
const HEAT = [
  { backgroundColor: 'transparent' },
  { backgroundColor: colors.surfaceRaised },
  { backgroundColor: 'rgba(242,184,75,0.3)' },
  { backgroundColor: 'rgba(242,184,75,0.55)' },
  { backgroundColor: 'rgba(242,184,75,0.85)' },
  { backgroundColor: colors.accent },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 20, paddingBottom: 40 },
  card: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  today: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  todayText: { flex: 1, gap: 6 },
  small: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  heatmap: { flexDirection: 'row', gap: 3 },
  heatCol: { gap: 3, flex: 1, alignItems: 'center' },
  dayLetter: { color: colors.muted, fontSize: 9, height: 13, lineHeight: 13 },
  cell: { width: '100%', maxWidth: 16, aspectRatio: 1, borderRadius: 3 },
  legendCell: { width: 12 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  muted: { color: colors.muted },
  goals: { flexDirection: 'row', gap: 8, marginTop: 4 },
  goal: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  goalOn: { backgroundColor: colors.accent },
  goalText: { color: colors.text, fontWeight: '700' },
  goalTextOn: { color: colors.onAccent },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexGrow: 1, flexBasis: '45%', padding: 14, borderRadius: 16, backgroundColor: colors.surface, gap: 4 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 12 },
  section: { gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  link: { color: colors.accent, fontWeight: '700' },
  latest: { color: colors.text, fontFamily: 'Literata_400Regular_Italic', fontSize: 15, lineHeight: 22, opacity: 0.85 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shelf: { marginHorizontal: -16 },
  confirm: { gap: 8 },
  danger: { backgroundColor: '#5A2229' },
  dangerText: { color: colors.danger, fontWeight: '600', textAlign: 'center' },
});
