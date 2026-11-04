import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// iOS and Android apps use the phone's haptics. On the web: Android browsers have navigator.vibrate; iPhone Safari
// (iOS 18+) gives a tap when a switch-style checkbox is toggled, so a hidden one is toggled. Failures are ignored.
const native = Platform.OS === 'ios' || Platform.OS === 'android';

let label: HTMLLabelElement | null = null;
function webTap(ms: number) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  try {
    const nav = navigator as Navigator & { vibrate?: (p: number) => boolean };
    if (typeof nav.vibrate === 'function' && nav.vibrate(ms)) return;
    if (!label) {
      label = document.createElement('label');
      label.setAttribute('aria-hidden', 'true');
      label.style.cssText = 'position:fixed;left:-100px;top:-100px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      input.tabIndex = -1;
      label.appendChild(input);
      document.body.appendChild(label);
    }
    label.click();
  } catch {}
}

export const haptic = {
  /** A page turn or a small toggle. */
  tick: () => native && Haptics.selectionAsync().catch(() => {}),
  /** A like, a stash, a grade, a long press. */
  tap: () => (native ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}) : webTap(15)),
  /** A long press that opens a menu. */
  press: () => (native ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}) : webTap(25)),
  /** A goal reached or a book finished. */
  success: () => (native ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}) : webTap(30)),
};
