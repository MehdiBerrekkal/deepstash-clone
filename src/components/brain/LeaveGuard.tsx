import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePalette } from '@/lib/appearance';

type Options = {
  title: string;
  message: string;
  /** The destructive choice, e.g. "Quit". */
  quitLabel: string;
  /** Optional middle choice, e.g. "Save & quit" for games that can be resumed. */
  saveLabel?: string;
  onSave?: () => void;
};

/** Whether the guard's extra history entry is on top (web). */
const trapped = () =>
  Platform.OS === 'web' && typeof globalThis.history !== 'undefined' && !!(globalThis.history.state as { leaveGuard?: boolean } | null)?.leaveGuard;

/**
 * Asks before leaving a screen while something is in progress: the back button, a swipe back, the browser's back
 * button, or closing/reloading the tab on the web. Returns the confirm sheet to render and `leave()` for an
 * in-screen Quit button (which asks first too).
 */
export function useLeaveGuard(active: boolean, { title, message, quitLabel, saveLabel, onSave }: Options) {
  // Only the two navigation calls this needs, typed here (expo-router bundles React Navigation).
  const navigation = useNavigation() as unknown as {
    addListener: (event: 'beforeRemove', cb: (e: { preventDefault: () => void; data: { action: object } }) => void) => () => void;
    dispatch: (action: object) => void;
  };
  const palette = usePalette();
  const [pending, setPending] = useState<null | (() => void)>(null);
  const leaving = useRef(false);

  // On the web, the browser's back button doesn't go through React Navigation's check. While a game runs, an extra
  // history entry (same address) sits on top: pressing back only removes it, and we ask before really leaving.
  const web = Platform.OS === 'web' && typeof globalThis.history !== 'undefined';
  const back = useCallback(() => {
    if (trapped()) globalThis.history.go(-2);
    else if (router.canGoBack()) router.back();
    else router.replace('/brain');
  }, []);

  useEffect(() => {
    if (!active) return;
    leaving.current = false;
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (leaving.current) return;
      e.preventDefault();
      setPending(() => (web ? back : () => navigation.dispatch(e.data.action)));
    });
    const onUnload = (ev: BeforeUnloadEvent) => {
      ev.preventDefault();
      ev.returnValue = '';
    };
    const trap = () => globalThis.history.pushState({ ...(globalThis.history.state ?? {}), leaveGuard: true }, '', globalThis.location.href);
    const onPop = () => {
      if (leaving.current) return;
      trap();
      setPending(() => back);
    };
    if (web) {
      globalThis.addEventListener('beforeunload', onUnload);
      trap();
      globalThis.addEventListener('popstate', onPop);
    }
    return () => {
      unsubscribe();
      if (web) {
        globalThis.removeEventListener('beforeunload', onUnload);
        globalThis.removeEventListener('popstate', onPop);
        // Finished normally: take the extra entry away again.
        if (!leaving.current && trapped()) globalThis.history.back();
      }
    };
  }, [active, navigation, web, back]);

  const go = (then: () => void) => {
    leaving.current = true;
    setPending(null);
    then();
  };
  const leave = useCallback(() => {
    if (!active) return back();
    setPending(() => back);
  }, [active, back]);

  const sheet = pending ? (
    <Modal transparent animationType="fade" onRequestClose={() => setPending(null)}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
          <Text style={[styles.message, { color: palette.muted }]}>{message}</Text>
          <Pressable accessibilityLabel="Keep going" onPress={() => setPending(null)} style={[styles.button, { backgroundColor: palette.accent }]}>
            <Text style={[styles.buttonText, { color: palette.onAccent }]}>Keep going</Text>
          </Pressable>
          {saveLabel && (
            <Pressable
              accessibilityLabel={saveLabel}
              onPress={() => {
                onSave?.();
                go(pending);
              }}
              style={[styles.button, { backgroundColor: palette.surfaceRaised }]}>
              <Text style={[styles.buttonText, { color: palette.text }]}>{saveLabel}</Text>
            </Pressable>
          )}
          <Pressable accessibilityLabel={quitLabel} onPress={() => go(pending)} style={styles.quit}>
            <Text style={styles.quitText}>{quitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  ) : null;

  /** Leave without asking (the choice was already confirmed elsewhere, e.g. in a pause menu). */
  const quit = () => go(back);

  return { sheet, leave, quit };
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,7,15,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderRadius: 24, padding: 22, gap: 12, borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '900', textAlign: 'center' },
  message: { fontSize: 15, lineHeight: 21, textAlign: 'center', marginBottom: 4 },
  button: { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontWeight: '900', fontSize: 16 },
  quit: { minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  quitText: { color: '#E5484D', fontWeight: '800', fontSize: 15 },
});
