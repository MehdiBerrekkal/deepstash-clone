import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, onCardScope } from '@/lib/theme';
import type { Topic } from '@/lib/types';

type Props = {
  topic: Topic;
  selected: boolean;
  onPress: () => void;
};

export function TopicChip({ topic, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && onCardScope, selected && { backgroundColor: topic.color, borderColor: topic.color }]}>
      <Text style={styles.label}>
        {topic.emoji} {topic.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
