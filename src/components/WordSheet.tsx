import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { DefineCard } from '@/components/DefineCard';
import { colors } from '@/lib/theme';

type Props = {
  word: string;
  /** Book language, for the dictionary and the translation. */
  language: string;
  /** Opens the highlight sheet for the paragraph the word is in. */
  onHighlight: () => void;
  onClose: () => void;
};

/** Long-press a word in the reader: its translation and meaning, straight away. */
export function WordSheet({ word, language, onHighlight, onClose }: Props) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <ScrollView contentContainerStyle={{ gap: 8 }}>
            <DefineCard word={word} language={language} onClose={onClose} />
            <Pressable accessibilityLabel="Highlight this passage" onPress={onHighlight} style={styles.highlight}>
              <Text style={styles.highlightText}>✎ Highlight this passage</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  highlight: { alignSelf: 'flex-start', paddingVertical: 6 },
  highlightText: { color: colors.accent, fontWeight: '700' },
});
