import { Stack, useLocalSearchParams } from 'expo-router';
import { createElement } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { webPdfUrl } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Web only: shows a PDF the user picked this session in the browser's built-in viewer (zoom, search, page thumbnails). */
export default function PdfScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ownBooks } = useStore();
  const book = ownBooks.find((b) => b.id === id);
  const url = webPdfUrl(id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: book?.title ?? 'PDF' }} />
      {Platform.OS === 'web' && url ? (
        createElement('iframe', { src: url, title: book?.title ?? 'PDF', style: { border: 0, width: '100%', height: '100%', background: '#fff' } })
      ) : (
        <Text style={styles.message}>
          Browsers only keep a picked PDF open for the current session. Go back to the Library and open the file again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  message: { color: colors.muted, padding: 24, textAlign: 'center', lineHeight: 22 },
});
