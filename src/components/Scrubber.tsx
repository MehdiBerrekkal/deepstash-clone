import { useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';

import type { BookTheme } from '@/lib/bookType';

type Props = {
  theme: BookTheme;
  count: number;
  current: number;
  /** Page indexes where chapters start, drawn as ticks. */
  chapterStarts?: number[];
  onSeek: (index: number) => void;
};

/** Progress bar you can tap or drag to jump through a book, with chapter ticks. */
export function Scrubber({ theme, count, current, chapterStarts = [], onSeek }: Props) {
  const [trackWidth, setTrackWidth] = useState(1);
  const [drag, setDrag] = useState<number | null>(null);
  const fraction = drag ?? (count > 1 ? current / (count - 1) : 1);
  // The children ignore touches, so locationX is always measured from the track's left edge.
  const at = (e: GestureResponderEvent) => Math.min(1, Math.max(0, e.nativeEvent.locationX / trackWidth));

  return (
    <View
      onLayout={(e) => setTrackWidth(Math.max(1, e.nativeEvent.layout.width))}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => setDrag(at(e))}
      onResponderMove={(e) => setDrag(at(e))}
      onResponderRelease={(e) => {
        const f = at(e);
        setDrag(null);
        onSeek(Math.round(f * (count - 1)));
      }}
      onResponderTerminate={() => setDrag(null)}
      accessibilityRole="adjustable"
      accessibilityLabel="Reading progress"
      accessibilityValue={{ min: 1, max: count, now: current + 1 }}
      style={styles.scrubber}>
      <View pointerEvents="none" style={[styles.track, { backgroundColor: theme.rule }]}>
        {count > 1 &&
          chapterStarts.slice(1, 60).map((s, i) => (
            <View key={i} style={[styles.tick, { left: `${(s / (count - 1)) * 100}%`, backgroundColor: theme.soft }]} />
          ))}
        <View style={[styles.fill, { width: `${fraction * 100}%`, backgroundColor: theme.ink }]} />
      </View>
      <View pointerEvents="none" style={[styles.knob, { left: `${fraction * 100}%`, backgroundColor: theme.ink, borderColor: theme.paper }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrubber: { height: 28, justifyContent: 'center' },
  track: { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  tick: { position: 'absolute', top: 0, bottom: 0, width: 1, opacity: 0.6 },
  knob: { position: 'absolute', width: 16, height: 16, marginLeft: -8, borderRadius: 8, borderWidth: 2, top: 6 },
});
