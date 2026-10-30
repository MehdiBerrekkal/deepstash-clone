import { Platform } from 'react-native';

/**
 * Small sound effects made on the fly with Web Audio (no files): clicks, chimes and a level-up arpeggio.
 * Web only; on phones the haptics do this job. Quiet by design, and off when muted.
 */
let ctx: AudioContext | null = null;
let muted = false;
let volume = 0.7;

export const setMuted = (m: boolean) => {
  muted = m;
};
/** Master volume, 0 to 1. */
export const setVolume = (v: number) => {
  volume = Math.max(0, Math.min(1, v));
};

function audio() {
  if (Platform.OS !== 'web' || muted) return null;
  const AC = (globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ??
    (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.08) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain * volume * 1.4, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// A pentatonic ladder: each streak step plays a little higher, so a run audibly builds.
const LADDER = [660, 742, 880, 990, 1110, 1320, 1485, 1760];

export const sfx = {
  /** Call from a tap so iOS lets later sounds play. */
  unlock: () => audio(),
  click: () => tone(1500, 0, 0.03, 'sine', 0.03),
  /** A soft two-note chime; with a streak, the second note climbs. */
  right: (streak = 0) => {
    const top = LADDER[Math.min(streak, LADDER.length - 1)];
    tone(top * 0.75, 0, 0.12, 'sine', 0.07);
    tone(top, 0.06, 0.2, 'sine', 0.07);
  },
  wrong: () => {
    tone(220, 0, 0.16, 'triangle', 0.08);
    tone(185, 0.08, 0.2, 'triangle', 0.07);
  },
  combo: (n: number) => [0, 1, 2].forEach((k) => tone(LADDER[Math.min(n, 5)] * [1, 1.25, 1.5][k], k * 0.05, 0.14, 'sine', 0.05)),
  levelStep: (up: boolean) => (up ? [784, 1046].forEach((f, i) => tone(f, i * 0.07, 0.16, 'sine', 0.05)) : tone(392, 0, 0.18, 'sine', 0.05)),
  tick: () => tone(520, 0, 0.06, 'sine', 0.05),
  go: () => tone(990, 0, 0.25, 'sine', 0.08),
  levelUp: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.07)),
};
