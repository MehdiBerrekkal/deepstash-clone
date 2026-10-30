import { Platform } from 'react-native';

/**
 * Small sound effects made on the fly with Web Audio (no files): clicks, chimes and a level-up arpeggio.
 * Web only; on phones the haptics do this job. Quiet by design, and off when muted.
 */
let ctx: AudioContext | null = null;
let muted = false;

export const setMuted = (m: boolean) => {
  muted = m;
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
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  /** Call from a tap so iOS lets later sounds play. */
  unlock: () => audio(),
  click: () => tone(1200, 0, 0.04, 'square', 0.025),
  right: () => {
    tone(880, 0, 0.12);
    tone(1320, 0.07, 0.18);
  },
  wrong: () => tone(160, 0, 0.22, 'triangle', 0.1),
  combo: (n: number) => tone(660 + Math.min(n, 10) * 60, 0, 0.1, 'sine', 0.06),
  tick: () => tone(520, 0, 0.06, 'sine', 0.05),
  go: () => tone(990, 0, 0.25, 'sine', 0.08),
  levelUp: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.07)),
};
