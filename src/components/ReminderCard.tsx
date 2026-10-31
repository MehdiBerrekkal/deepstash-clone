import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { shareTextFile } from '@/lib/share';
import { colors } from '@/lib/theme';

const TIMES = ['07:30', '12:30', '18:30', '21:30'];

/** A calendar event that repeats every day at a time, with an alert: the reminder lives in your own calendar. */
function reminderIcs(time: string) {
  const [h, m] = time.split(':');
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const url = 'https://mehdiberrekkal.github.io/deepstash-clone/';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Deepstash clone//Reading reminder//EN',
    'BEGIN:VEVENT',
    `UID:reading-reminder-${stamp}@deepstash-clone`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T${h}${m}00`,
    `DTEND:${day}T${h}${String(Number(m) + 10).padStart(2, '0')}00`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:📖 10 minutes of reading',
    `DESCRIPTION:Keep your streak going: a few idea cards, a chapter, or today's Brain session.\\n${url}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Time to read',
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * A daily reminder that works without an account or a server: it's added to your calendar, which notifies you
 * even when the app is closed. (A web app on GitHub Pages can't send push notifications by itself.)
 */
export function ReminderCard() {
  const [time, setTime] = useState('21:30');
  const [done, setDone] = useState(false);
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>⏰ Daily reminder</Text>
      <Text style={styles.muted}>Pick a time, then add it to your calendar. You’ll get a gentle alert every day, even when the app is closed.</Text>
      <View style={styles.row}>
        {TIMES.map((t) => (
          <Pressable key={t} accessibilityLabel={`Remind at ${t}`} onPress={() => setTime(t)} style={[styles.chip, time === t && styles.chipOn]}>
            <Text style={[styles.chipText, time === t && styles.chipTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityLabel="Add reminder to calendar"
        onPress={async () => {
          await shareTextFile('reading-reminder.ics', reminderIcs(time), 'text/calendar');
          setDone(true);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Add to my calendar</Text>
      </Pressable>
      {done && <Text style={styles.small}>On iPhone, tap “Add All” in the calendar sheet. To change the time later, delete the event in Calendar and add a new one.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  muted: { color: colors.muted, lineHeight: 20 },
  small: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  chipOn: { backgroundColor: colors.accent },
  chipText: { color: colors.text, fontWeight: '800' },
  chipTextOn: { color: colors.onAccent },
  button: { minHeight: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.accent },
  buttonText: { color: colors.accent, fontWeight: '800' },
});
