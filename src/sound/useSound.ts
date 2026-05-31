import { useMemo } from 'react';
import { useSettings } from '../settings/context';

// Tiny Web Audio "blips" — no audio files to bundle. The context is created
// lazily on first use (a user gesture), satisfying autoplay policies.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  gain = 0.05,
  delayMs = 0,
): void {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delayMs / 1000;
  const end = start + durationMs / 1000;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(start);
  osc.stop(end);
}

export function playCorrect(): void {
  tone(620, 35, 'sine', 0.04);
}

export function playError(): void {
  tone(150, 90, 'square', 0.05);
}

export function playSuccess(): void {
  [523, 659, 784].forEach((f, i) => tone(f, 130, 'sine', 0.05, i * 90));
}

export interface SoundApi {
  correct: () => void;
  error: () => void;
  success: () => void;
}

/** Sound effects that respect the user's sound setting. */
export function useSound(): SoundApi {
  const { settings } = useSettings();
  const enabled = settings.sound;
  return useMemo(
    () => ({
      correct: () => enabled && playCorrect(),
      error: () => enabled && playError(),
      success: () => enabled && playSuccess(),
    }),
    [enabled],
  );
}
