import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { usePalette } from '@/lib/appearance';
import { displayFont } from '@/lib/bookType';
import { colors } from '@/lib/theme';

type Art = 'books' | 'heart' | 'pen' | 'brain' | 'search';

const INK = '#3A3F4B';
const PAPER = '#F4EBDD';

/** Small hand-drawn style scenes for empty screens. */
function Illustration({ art }: { art: Art }) {
  const ACCENT = usePalette().accent;
  return (
    <Svg width={180} height={140} viewBox="0 0 180 140">
      <Ellipse cx={90} cy={124} rx={70} ry={9} fill="rgba(255,255,255,0.05)" />
      {art === 'books' && (
        <G>
          <Rect x={34} y={70} width={112} height={18} rx={3} fill="#5E97D6" />
          <Rect x={42} y={52} width={98} height={18} rx={3} fill="#E8735A" />
          <Rect x={30} y={88} width={120} height={20} rx={3} fill={ACCENT} />
          <Line x1={44} y1={98} x2={136} y2={98} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
          <Path d="M108 52 L118 20 L128 52 Z" fill="#6FB062" />
          <Circle cx={118} cy={18} r={4} fill={PAPER} />
        </G>
      )}
      {art === 'heart' && (
        <G>
          <Rect x={40} y={34} width={64} height={84} rx={6} fill="#5E97D6" />
          <Rect x={46} y={34} width={4} height={84} fill="rgba(0,0,0,0.2)" />
          <Path d="M120 56 C120 44 136 40 140 52 C144 40 160 44 160 56 C160 70 140 82 140 82 C140 82 120 70 120 56 Z" fill="#DE6E98" />
          <Path d="M96 30 C96 24 104 22 106 28 C108 22 116 24 116 30 C116 37 106 43 106 43 C106 43 96 37 96 30 Z" fill="#DE6E98" opacity={0.5} />
        </G>
      )}
      {art === 'pen' && (
        <G>
          <Path d="M30 40 Q90 26 90 44 L90 116 Q90 100 30 112 Z" fill={PAPER} />
          <Path d="M150 40 Q90 26 90 44 L90 116 Q90 100 150 112 Z" fill="#EADFCB" />
          <Rect x={40} y={56} width={40} height={6} rx={2} fill="rgba(242,184,75,0.7)" />
          <Line x1={40} y1={72} x2={80} y2={70} stroke="#BDB2A0" strokeWidth={3} />
          <Line x1={100} y1={60} x2={140} y2={62} stroke="#BDB2A0" strokeWidth={3} />
          <Rect x={100} y={74} width={34} height={6} rx={2} fill="rgba(111,176,98,0.7)" />
          <G rotation={-35} origin="130, 40">
            <Rect x={124} y={4} width={10} height={60} rx={3} fill={INK} />
            <Path d="M124 64 L134 64 L129 76 Z" fill={ACCENT} />
          </G>
        </G>
      )}
      {art === 'brain' && (
        <G>
          <Circle cx={90} cy={66} r={42} fill="#2B303B" />
          <Path d="M64 66 Q64 40 90 40 Q116 40 116 66 Q116 92 90 92 Q64 92 64 66" fill="#DE6E98" opacity={0.85} />
          <Path d="M90 42 L90 90 M74 54 Q82 60 74 70 M106 54 Q98 60 106 70 M78 80 Q90 74 102 80" stroke="rgba(0,0,0,0.25)" strokeWidth={3} fill="none" />
          <Path d="M134 30 L138 22 L142 30 L150 34 L142 38 L138 46 L134 38 L126 34 Z" fill={ACCENT} />
          <Path d="M36 96 L39 90 L42 96 L48 99 L42 102 L39 108 L36 102 L30 99 Z" fill={ACCENT} opacity={0.6} />
        </G>
      )}
      {art === 'search' && (
        <G>
          <Rect x={30} y={60} width={64} height={52} rx={4} fill="#E8735A" />
          <Rect x={40} y={46} width={56} height={14} rx={3} fill="#5E97D6" />
          <Circle cx={118} cy={58} r={26} fill="none" stroke={ACCENT} strokeWidth={8} />
          <Circle cx={118} cy={58} r={20} fill="rgba(242,184,75,0.12)" />
          <Line x1={136} y1={78} x2={156} y2={102} stroke={ACCENT} strokeWidth={10} strokeLinecap="round" />
        </G>
      )}
    </Svg>
  );
}

/** An empty screen with an illustration, a title, some help and an optional action. */
export function EmptyState({ art, title, text, action, onAction, children }: {
  art: Art;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <Animated.View entering={FadeInUp.duration(380)} style={styles.box}>
      <Illustration art={art} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      {children}
      {action && onAction && (
        <Pressable onPress={onAction} style={styles.button}>
          <Text style={styles.buttonText}>{action}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: 10, paddingVertical: 40, paddingHorizontal: 28 },
  title: { color: colors.text, fontFamily: displayFont, fontSize: 28, textAlign: 'center' },
  text: { color: colors.muted, textAlign: 'center', lineHeight: 21, maxWidth: 360 },
  button: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 999, backgroundColor: colors.accent },
  buttonText: { color: colors.onAccent, fontWeight: '800' },
});
