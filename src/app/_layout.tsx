import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StoreProvider } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <StoreProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="idea/[id]" options={{ title: 'Card', presentation: 'modal' }} />
        <Stack.Screen name="stash/[id]" options={{ title: 'Stash' }} />
        <Stack.Screen name="book/[id]" options={{ title: '' }} />
        <Stack.Screen name="read/[id]" options={{ title: 'Reading' }} />
        <Stack.Screen name="topic/[id]" options={{ title: 'Topic' }} />
        <Stack.Screen name="classic/[id]" options={{ title: '' }} />
        <Stack.Screen name="reader/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="pdf/[id]" options={{ title: 'PDF' }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
      </Stack>
    </StoreProvider>
    </GestureHandlerRootView>
  );
}
