import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// iOS and Android apps use the phone's haptics. On the web: Android browsers have navigator.vibrate; iPhone Safari
// (iOS 18+) gives a tap when a switch-style checkbox is toggled, so a hidden one is toggled. Failures are ignored.
const native = Platform.OS === 'ios' || Platform.OS === 'android';

/** iPhone Safari's tap: toggling a switch-style checkbox through its label (iOS 18+), like the ios-haptics library. */
function switchTap() {
  const label = document.createElement('label');
  label.ariaHidden = 'true';
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.head.appendChild(label);
  label.click();
  label.remove();
}

let pending = false;
function webTap(ms: number) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  try {
    const nav = navigator as Navigator & { vibrate?: (p: number) => boolean; userActivation?: { isActive: boolean } };
    if (typeof nav.vibrate === 'function' && nav.vibrate(ms)) return;
    // iOS only gives the tap during a touch the person just made. A long press fires while the finger is still
    // down, before that counts, so the tap waits for the finger to lift.
    if (nav.userActivation && !nav.userActivation.isActive) {
      if (pending) return;
      pending = true;
      const fire = () => {
        pending = false;
        document.removeEventListener('touchend', fire, true);
        document.removeEventListener('pointerup', fire, true);
        try {
          switchTap();
        } catch {}
      };
      document.addEventListener('touchend', fire, true);
      document.addEventListener('pointerup', fire, true);
      setTimeout(() => {
        if (!pending) return;
        pending = false;
        document.removeEventListener('touchend', fire, true);
        document.removeEventListener('pointerup', fire, true);
      }, 4000);
      return;
    }
    switchTap();
  } catch {}
}

export const haptic = {
  /** A page turn or a small toggle. */
  tick: () => (native ? Haptics.selectionAsync().catch(() => {}) : webTap(8)),
  /** A like, a stash, a grade, a long press. */
  tap: () => (native ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}) : webTap(15)),
  /** A long press that opens a menu. */
  press: () => (native ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}) : webTap(25)),
  /** A goal reached or a book finished. */
  success: () => (native ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}) : webTap(30)),
};
