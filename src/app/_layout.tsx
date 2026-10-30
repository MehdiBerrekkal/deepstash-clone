import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CelebrationHost } from '@/components/Celebration';
import { AppearanceSync, usePalette } from '@/lib/appearance';
import { bookFonts } from '@/lib/bookType';
import { WebSafeArea } from '@/lib/safeArea';
import { StoreProvider } from '@/lib/store';

export default function RootLayout() {
  // Book fonts for the reader; text falls back to system fonts until they finish loading.
  useFonts(bookFonts);
  // Browsers only hyphenate justified text when they know its language.
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.documentElement.lang) document.documentElement.lang = 'en';
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <WebSafeArea>
    <StoreProvider>
      <AppearanceSync />
      <ThemedStack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="idea/[id]" options={{ title: 'Card', presentation: 'modal' }} />
        <Stack.Screen name="stash/[id]" options={{ title: 'Stash' }} />
        <Stack.Screen name="book/[id]" options={{ title: '' }} />
        <Stack.Screen name="read/[id]" options={{ title: 'Reading' }} />
        <Stack.Screen name="topic/[id]" options={{ title: 'Topic' }} />
        <Stack.Screen name="classic/[id]" options={{ title: '' }} />
        <Stack.Screen name="reader/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="pdfbook/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
        <Stack.Screen name="highlights" options={{ title: 'Highlights' }} />
        <Stack.Screen name="review" options={{ title: 'Review' }} />
        <Stack.Screen name="brain/[game]" options={{ title: 'Brain' }} />
        <Stack.Screen name="brain/quiz" options={{ title: 'Quiz' }} />
      </ThemedStack>
      <CelebrationHost />
    </StoreProvider>
    </WebSafeArea>
    </GestureHandlerRootView>
  );
}

/** The app's stack, coloured for the current light/dark scheme. */
function ThemedStack({ children }: { children: ReactNode }) {
  const palette = usePalette();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.text,
        contentStyle: { backgroundColor: palette.background },
      }}>
      {children}
    </Stack>
  );
}
