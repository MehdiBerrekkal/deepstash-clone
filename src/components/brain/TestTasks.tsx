import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { sfx } from '@/lib/brain/sfx';
import { haptic } from '@/lib/haptics';
import { colors } from '@/lib/theme';

const randomDigits = (n: number) => {
  const out: number[] = [];
  while (out.length < n) {
    const d = 1 + Math.floor(Math.random() * 9);
    // No digit twice in a row, as in standard digit span lists.
    if (d !== out[out.length - 1]) out.push(d);
  }
  return out;
};

/**
 * Digit span as in standard batteries: forward then backward, two lists at each length, one digit per second. A length
 * passes if either list is right; the phase stops when both lists at a length are wrong. The score is the longest list
 * repeated correctly in each direction.
 */
export function SpanTask({ color, startForward = 3, onDone }: { color: string; startForward?: number; onDone: (r: { forward: number; backward: number }) => void }) {
  const [phase, setPhase] = useState<'forward' | 'backward'>('forward');
  const [len, setLen] = useState(startForward);
  const [trial, setTrial] = useState(0);
  const [fails, setFails] = useState(0);
  const [digits, setDigits] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [typed, setTyped] = useState<number[]>([]);
  const [result, setResult] = useState<'ok' | 'bad' | null>(null);
  const best = useRef({ forward: 0, backward: 0 });
  const [round, setRound] = useState(0);

  useEffect(() => {
    const ds = randomDigits(len);
    const t = setTimeout(() => {
      setDigits(ds);
      setTyped([]);
      setResult(null);
      setShowing(0);
    }, 900);
    return () => clearTimeout(t);
  }, [round, len]);
  useEffect(() => {
    if (showing < 0 || showing >= digits.length) return;
    sfx.tick();
    const t = setTimeout(() => setShowing(showing + 1), 1000);
    return () => clearTimeout(t);
  }, [showing, digits.length]);

  const done = showing >= digits.length && digits.length > 0;
  const target = phase === 'backward' ? [...digits].reverse() : digits;
  const next = (ok: boolean) => {
    const failsHere = ok ? fails : fails + 1;
    if (ok) best.current[phase] = Math.max(best.current[phase], len);
    const lengthOver = trial === 1 || ok;
    if (!lengthOver) {
      setFails(failsHere);
      setTrial(1);
      setDigits([]);
      setShowing(-1);
      setRound((r) => r + 1);
      return;
    }
    // Both lists at this length wrong (or the longest list reached): this direction is over.
    const stop = (trial === 1 && failsHere >= 2) || len >= 9;
    if (stop && phase === 'forward') {
      setPhase('backward');
      setLen(2);
    } else if (stop) return onDone(best.current);
    else setLen(len + 1);
    setTrial(0);
    setFails(0);
    setDigits([]);
    setShowing(-1);
    setRound((r) => r + 1);
  };
  const key = (k: number) => {
    if (!done || result) return;
    sfx.click();
    const t = [...typed, k];
    setTyped(t);
    if (t.length < digits.length) return;
    const ok = t.every((x, j) => x === target[j]);
    setResult(ok ? 'ok' : 'bad');
    if (ok) haptic.tap();
    else haptic.tick();
    setTimeout(() => next(ok), 800);
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.kicker, { color }]}>{phase === 'forward' ? 'SAME ORDER' : 'REVERSE ORDER'} · {len} DIGITS</Text>
      <Text style={styles.ask}>{done ? (phase === 'backward' ? 'Type them backwards, last digit first' : 'Type them in the same order') : 'Watch the digits…'}</Text>
      <View style={styles.spanBox}>
        {!done ? (
          <Animated.Text key={showing} entering={ZoomIn.duration(180)} style={[styles.digit, { color }]}>
            {showing >= 0 && showing < digits.length ? digits[showing] : ''}
          </Animated.Text>
        ) : (
          <View style={styles.slots}>
            {digits.map((_, j) => (
              <View key={j} style={[styles.slot, j === typed.length && !result && { borderColor: color }, result === 'ok' && { borderColor: '#3DDC97' }, result === 'bad' && { borderColor: '#FF5C70' }]}>
                <Text style={styles.slotText}>{typed[j] ?? ''}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <Pressable key={k} accessibilityLabel={`Digit ${k}`} disabled={!done} onPress={() => key(k)} style={({ pressed }) => [styles.key, pressed && styles.pressed, !done && styles.off]}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityLabel="Delete" disabled={!done || !!result} onPress={() => setTyped(typed.slice(0, -1))} style={[styles.key, styles.wide, !done && styles.off]}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** A random symbol index different from the current one. */
function otherThan(i: number) {
  const n = Math.floor(Math.random() * 8);
  return n >= i ? n + 1 : n;
}

const SYMBOLS = ['⊕', '△', '◇', '○', '□', '✕', '≡', '∞', '★'];

/**
 * Symbol coding: one fixed key for the whole task (symbol → digit), a few practice items, then as many as you can in
 * the time. Score: right minus wrong.
 */
export function CodingTask({ color, seconds, onDone }: { color: string; seconds: number; onDone: (r: { right: number; wrong: number; seconds: number }) => void }) {
  const [key] = useState(() => [...SYMBOLS].sort(() => Math.random() - 0.5).map((glyph, i) => ({ glyph, digit: i + 1 })));
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * 9));
  const [practice, setPractice] = useState(3);
  const [left, setLeft] = useState(seconds);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const tally = useRef({ right: 0, wrong: 0 });
  const [count, setCount] = useState(0);
  const running = practice === 0;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (running && left <= 0) onDone({ ...tally.current, seconds });
    // Only reacts to the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, running]);

  const tap = (digit: number) => {
    if (running && left <= 0) return;
    const ok = key[current].digit === digit;
    if (ok) haptic.tap();
    else haptic.tick();
    setFlash(ok ? 'ok' : 'bad');
    setTimeout(() => setFlash(null), 160);
    if (!running) {
      if (!ok) return;
      setPractice(practice - 1);
    } else {
      tally.current[ok ? 'right' : 'wrong']++;
      setCount(tally.current.right);
    }
    setCurrent(otherThan(current));
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.kicker, { color }]}>{running ? `${Math.max(0, left)} S LEFT · ${count} DONE` : `PRACTICE · ${practice} TO GO, THEN THE CLOCK STARTS`}</Text>
      <View style={styles.keyRow}>
        {key.map((k) => (
          <View key={k.glyph} style={styles.keyCell}>
            <Text style={styles.keyGlyph}>{k.glyph}</Text>
            <Text style={[styles.keyDigit, { color }]}>{k.digit}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.target, flash === 'ok' && { borderColor: '#3DDC97' }, flash === 'bad' && { borderColor: '#FF5C70' }]}>
        <Text style={styles.targetGlyph}>{key[current].glyph}</Text>
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <Pressable key={k} accessibilityLabel={`Number ${k}`} onPress={() => tap(k)} style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, alignItems: 'center' },
  kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.6, textAlign: 'center' },
  ask: { color: colors.text, fontWeight: '800', fontSize: 16, textAlign: 'center' },
  spanBox: { height: 120, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  digit: { fontSize: 84, fontWeight: '900', fontVariant: ['tabular-nums'] },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  slot: { width: 34, height: 46, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  slotText: { color: colors.text, fontSize: 22, fontWeight: '900' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: 264 },
  key: { width: 80, height: 58, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  wide: { width: 248 },
  pressed: { opacity: 0.6, transform: [{ scale: 0.96 }] },
  off: { opacity: 0.35 },
  keyText: { color: colors.text, fontSize: 24, fontWeight: '800' },
  keyRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  keyCell: { width: 34, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', paddingVertical: 4, backgroundColor: colors.surface },
  keyGlyph: { color: colors.text, fontSize: 18 },
  keyDigit: { fontSize: 14, fontWeight: '900' },
  target: { width: 120, height: 120, borderRadius: 24, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  targetGlyph: { color: colors.text, fontSize: 64 },
});
