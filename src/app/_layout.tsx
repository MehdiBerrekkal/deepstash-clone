import { router, Stack } from 'expo-router';
import { Stack as JSStack, TransitionPresets } from 'expo-router/js-stack';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CelebrationHost } from '@/components/Celebration';
import { AppearanceSync, usePalette } from '@/lib/appearance';
import { bookFonts } from '@/lib/bookType';
import { WebSafeArea } from '@/lib/safeArea';
import { StoreProvider } from '@/lib/store';

/** Every screen outside the tabs, with its header. */
const SCREENS: { name: string; options: { title?: string; headerShown?: boolean; presentation?: 'modal' } }[] = [
  { name: '(tabs)', options: { headerShown: false } },
  { name: 'auth', options: { headerShown: false } },
  { name: 'reset-password', options: { headerShown: false } },
  { name: 'welcome', options: { headerShown: false } },
  { name: 'onboarding', options: { headerShown: false } },
  { name: 'idea/[id]', options: { title: 'Card', presentation: 'modal' } },
  { name: 'stash/[id]', options: { title: 'Stash' } },
  { name: 'book/[id]', options: { title: '' } },
  { name: 'read/[id]', options: { title: 'Reading' } },
  { name: 'topic/[id]', options: { title: 'Topic' } },
  { name: 'classic/[id]', options: { title: '' } },
  { name: 'reader/[id]', options: { headerShown: false } },
  { name: 'pdfbook/[id]', options: { headerShown: false } },
  { name: 'favorites', options: { title: 'Favorites' } },
  { name: 'highlights', options: { title: 'Highlights' } },
  { name: 'review', options: { title: 'Review' } },
  { name: 'brain/[game]', options: { title: 'Brain' } },
  { name: 'brain/quiz', options: { title: 'Quiz' } },
  { name: 'brain/test', options: { title: 'Test' } },
  { name: 'voices', options: { title: 'Voices' } },
  { name: 'find', options: { title: 'Find a free book' } },
];

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
      <ThemedStack />
      <CelebrationHost />
    </StoreProvider>
    </WebSafeArea>
    </GestureHandlerRootView>
  );
}

/**
 * The app's stack, coloured for the current light/dark scheme. On the web (the iPhone home-screen app) it is the
 * JavaScript stack, so screens slide in from the right, slide back out, and can be swiped away from the left edge
 * like a native iOS app. Cards open as a sheet from the bottom.
 */
function ThemedStack() {
  const palette = usePalette();
  if (Platform.OS === 'web') {
    return (
      <JSStack
        screenOptions={({ route, navigation }) => ({
          // Opened straight from a link or after the app reloaded: nothing to go back to, so ← goes home.
          ...(!navigation.canGoBack() && route.name !== '(tabs)'
            ? { headerLeft: () => <HomeButton color={palette.text} /> }
            : {}),
          ...(route.name === 'idea/[id]' ? TransitionPresets.ModalSlideFromBottomIOS : TransitionPresets.SlideFromRightIOS),
          gestureEnabled: true,
          // Its keyboard handling calls an API react-native-web doesn't have.
          keyboardHandlingEnabled: false,
          // Readers turn pages by swiping, so only a swipe that starts right at the edge goes back there.
          gestureResponseDistance: route.name === 'reader/[id]' || route.name === 'pdfbook/[id]' ? 16 : 40,
          headerStyle: { backgroundColor: palette.background, borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 },
          headerTintColor: palette.text,
          headerTitleStyle: { fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
          cardStyle: { backgroundColor: palette.background },
          cardOverlayEnabled: true,
          // The screen underneath stays drawn, so it shows while you swipe back and keeps its scroll position.
          detachPreviousScreen: false,
        })}>
        {SCREENS.map((s) => (
          <JSStack.Screen key={s.name} name={s.name} options={s.options} />
        ))}
      </JSStack>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.text,
        contentStyle: { backgroundColor: palette.background },
      }}>
      {SCREENS.map((s) => (
        <Stack.Screen key={s.name} name={s.name} options={s.options} />
      ))}
    </Stack>
  );
}

/** The header's ← on a screen with nothing behind it: goes to the home screen. */
function HomeButton({ color }: { color: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Home" onPress={() => router.replace('/')} hitSlop={10} style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
      <Text style={{ color, fontSize: 24, lineHeight: 28 }}>←</Text>
    </Pressable>
  );
}
