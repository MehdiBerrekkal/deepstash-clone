import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/lib/store';
import { usePalette } from '@/lib/appearance';

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    // A fixed line height: emoji are taller than their font size and would squeeze the label.
    return <Text style={{ color, fontSize: 18, lineHeight: 22, height: 22 }}>{glyph}</Text>;
  };

export default function TabsLayout() {
  const { ready, followedTopicIds } = useStore();
  const insets = useSafeAreaInsets();
  // Real colours (not CSS variables): navigation tints icons with them.
  const colors = usePalette();

  if (!ready) return null;
  if (followedTopicIds.length === 0) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        // A little taller than the default so the labels aren't clipped, plus the home-indicator area.
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 58 + insets.bottom, paddingTop: 4 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'For you', tabBarIcon: icon('◉') }} />
      <Tabs.Screen name="library" options={{ title: 'Library', tabBarIcon: icon('📚') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('⌕') }} />
      <Tabs.Screen name="brain" options={{ title: 'Brain', tabBarIcon: icon('🧠') }} />
      <Tabs.Screen name="stashes" options={{ title: 'Stashes', tabBarIcon: icon('★') }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: icon('◐') }} />
    </Tabs>
  );
}
