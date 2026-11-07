import { useEffect } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type TabIconName = 'home' | 'library' | 'explore' | 'learn' | 'brain' | 'stashes' | 'you';

/**
 * The tab bar's icons: one hand-drawn set in the same line weight, outlined when the tab is idle and filled in
 * the accent colour when it's open, with a soft pill behind it and a little spring as it lights up.
 */
export function TabIcon({ name, color, focused, accent }: { name: TabIconName; color: ColorValue; focused: boolean; accent: string }) {
  const on = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    on.value = focused ? withSpring(1, { damping: 12, stiffness: 220 }) : withTiming(0, { duration: 160 });
  }, [focused, on]);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + on.value * 0.08 }, { translateY: -on.value * 1 }] }));
  const pillStyle = useAnimatedStyle(() => ({ opacity: on.value, transform: [{ scaleX: 0.6 + on.value * 0.4 }] }));
  const stroke = String(color);
  const fill = focused ? accent : 'none';
  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.pill, { backgroundColor: `${accent}26` }, pillStyle]} />
      <Animated.View style={iconStyle}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
          {draw(name, fill, focused)}
        </Svg>
      </Animated.View>
    </View>
  );
}

function draw(name: TabIconName, fill: string, focused: boolean) {
  // Lines drawn over a filled shape use the bar's dark colour so they still read.
  const inner = focused ? '#14161C' : undefined;
  switch (name) {
    case 'home': // A card with a spark: today's ideas.
      return (
        <>
          <Rect x={4} y={3.5} width={16} height={17} rx={4} fill={fill} />
          <Path d="M12 8.2l1.1 2.6 2.7.3-2 1.8.6 2.7-2.4-1.4-2.4 1.4.6-2.7-2-1.8 2.7-.3z" stroke={inner} fill={focused ? '#14161C' : 'none'} strokeWidth={1.4} />
        </>
      );
    case 'library': // Three books on a shelf, one leaning.
      return (
        <>
          <Rect x={3.5} y={5} width={4.2} height={15} rx={1.2} fill={fill} />
          <Rect x={9.3} y={3.5} width={4.2} height={16.5} rx={1.2} fill={fill} />
          <Path d="M15.6 6.3l3.6-1 3 14.2-3.7.9z" fill={fill} />
          <Path d="M3.5 9h4.2M9.3 8h4.2" stroke={inner} strokeWidth={1.4} />
        </>
      );
    case 'explore': // A compass.
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} fill={fill} />
          <Path d="M15.3 8.7l-1.9 4.7-4.7 1.9 1.9-4.7z" stroke={inner} fill={focused ? '#14161C' : 'none'} strokeWidth={1.4} />
        </>
      );
    case 'learn': // A globe: languages.
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} fill={fill} />
          <Path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5M12 3.5C9.6 5.8 8.4 8.6 8.4 12s1.2 6.2 3.6 8.5" stroke={inner} fill="none" strokeWidth={1.4} />
        </>
      );
    case 'brain': // Two lobes with a fold.
      return (
        <>
          <Path
            d="M12 5.2c-.8-1.3-2.2-1.9-3.6-1.6-1.6.3-2.7 1.7-2.7 3.3-1.4.4-2.3 1.7-2.2 3.1 0 .8.3 1.5.8 2-.6.6-.9 1.4-.8 2.3.1 1.5 1.3 2.7 2.8 2.9.4 1.5 1.8 2.6 3.4 2.5.9 0 1.7-.5 2.3-1.1.6.6 1.4 1.1 2.3 1.1 1.6.1 3-1 3.4-2.5 1.5-.2 2.7-1.4 2.8-2.9.1-.9-.2-1.7-.8-2.3.5-.5.8-1.2.8-2 .1-1.4-.8-2.7-2.2-3.1 0-1.6-1.1-3-2.7-3.3-1.4-.3-2.8.3-3.6 1.6z"
            fill={fill}
          />
          <Path d="M12 5.2v14.1M8.6 9.4c1 .2 1.8.9 2 1.9M15.4 9.4c-1 .2-1.8.9-2 1.9M8.4 14.6c.9-.6 2-.6 2.9 0M15.6 14.6c-.9-.6-2-.6-2.9 0" stroke={inner} strokeWidth={1.4} />
        </>
      );
    case 'stashes': // A bookmark.
      return <Path d="M6.5 4.8A1.8 1.8 0 018.3 3h7.4a1.8 1.8 0 011.8 1.8V21l-5.5-3.6L6.5 21z" fill={fill} />;
    case 'you': // A person.
      return (
        <>
          <Circle cx={12} cy={8} r={4} fill={fill} />
          <Path d="M4.5 20.2c.8-3.6 3.8-5.7 7.5-5.7s6.7 2.1 7.5 5.7" fill={fill} />
        </>
      );
  }
}

const styles = StyleSheet.create({
  wrap: { width: 56, height: 30, alignItems: 'center', justifyContent: 'center' },
  pill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, borderRadius: 15 },
});
