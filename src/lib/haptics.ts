import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptics are phone-only; on the web these do nothing. Failures (no vibration motor) are ignored.
const native = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptic = {
  /** A page turn or a small toggle. */
  tick: () => native && Haptics.selectionAsync().catch(() => {}),
  /** A like, a stash, a grade. */
  tap: () => native && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** A goal reached or a book finished. */
  success: () => native && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
};
