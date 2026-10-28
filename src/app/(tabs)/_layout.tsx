import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Text, type ColorValue } from 'react-native';

import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;
  };

export default function TabsLayout() {
  const { ready, followedTopicIds } = useStore();

  if (!ready) return null;
  if (followedTopicIds.length === 0) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}>
      <Tabs.Screen name="index" options={{ title: 'For you', tabBarIcon: icon('◉') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: icon('⌕') }} />
      <Tabs.Screen name="stashes" options={{ title: 'Stashes', tabBarIcon: icon('★') }} />
    </Tabs>
  );
}
