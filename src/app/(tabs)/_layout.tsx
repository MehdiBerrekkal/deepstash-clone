import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { accountsEnabled } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { usePalette } from '@/lib/appearance';
import { useT } from '@/lib/i18n';
import { useOwnIdeasBackfill } from '@/lib/useOwnIdeas';

const icon = (name: TabIconName, accent: string) =>
  function Icon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <TabIcon name={name} color={color} focused={focused} accent={accent} />;
  };

export default function TabsLayout() {
  const { ready, followedTopicIds, audience, account, guest, recovering } = useStore();
  const insets = useSafeAreaInsets();
  // Real colours (not CSS variables): navigation tints icons with them.
  const colors = usePalette();
  const t = useT();
  const bottomPad = insets.bottom ? Math.round(insets.bottom * 0.45) : 6;
  // Main-idea cards for your own books that don't have them yet.
  useOwnIdeasBackfill();

  if (!ready) return null;
  // Accounts first (log in, create one, or carry on as this device's guest), then kid or adult, then topics.
  if (recovering) return <Redirect href="/reset-password" />;
  if (accountsEnabled && !account && !guest) return <Redirect href="/auth" />;
  // Kid or adult comes first, before anything else; then the topics for that group.
  if (!audience) return <Redirect href="/welcome" />;
  if (followedTopicIds.length === 0) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        // Sits low like a native iPhone tab bar: the labels end just above the home indicator instead of leaving
        // its whole strip empty underneath.
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64 + bottomPad,
          paddingTop: 6,
          paddingBottom: bottomPad,
        },
        tabBarItemStyle: { gap: 2, paddingBottom: 2 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, lineHeight: 15, fontWeight: '600', letterSpacing: 0.2 },
      }}>
      <Tabs.Screen name="index" options={{ title: t('For you'), tabBarIcon: icon('home', colors.accent) }} />
      <Tabs.Screen name="library" options={{ title: t('Library'), tabBarIcon: icon('library', colors.accent) }} />
      <Tabs.Screen name="explore" options={{ title: t('Explore'), tabBarIcon: icon('explore', colors.accent) }} />
      <Tabs.Screen name="brain" options={{ title: t('Brain'), tabBarIcon: icon('brain', colors.accent) }} />
      <Tabs.Screen name="stashes" options={{ title: t('Stashes'), tabBarIcon: icon('stashes', colors.accent) }} />
      <Tabs.Screen name="profile" options={{ title: t('You'), tabBarIcon: icon('you', colors.accent) }} />
    </Tabs>
  );
}
