import { describe, it, expect } from 'vitest';
import { aggregateStats, computeStats, type Keystroke } from './stats';

function ks(expected: string, actual: string, time: number): Keystroke {
  return { expected, actual, correct: expected === actual, time };
}

describe('computeStats', () => {
  it('returns neutral stats for no keystrokes', () => {
    const s = computeStats([], null, 1000);
    expect(s).toEqual({
      wpm: 0,
      accuracy: 1,
      errors: 0,
      correct: 0,
      total: 0,
      elapsedMs: 0,
    });
  });

  it('counts correct, errors, and accuracy', () => {
    const strokes = [ks('a', 'a', 0), ks('b', 'x', 0), ks('c', 'c', 0)];
    const s = computeStats(strokes, 0, 0);
    expect(s.total).toBe(3);
    expect(s.correct).toBe(2);
    expect(s.errors).toBe(1);
    expect(s.accuracy).toBeCloseTo(2 / 3);
  });

  it('computes net WPM from correct chars over elapsed time', () => {
    // 25 correct chars in 60s = 25/5 = 5 words/min.
    const strokes = Array.from({ length: 25 }, (_, i) => ks('a', 'a', i));
    const s = computeStats(strokes, 0, 60_000);
    expect(s.wpm).toBeCloseTo(5);
    expect(s.elapsedMs).toBe(60_000);
  });

  it('never reports negative elapsed time', () => {
    const s = computeStats([ks('a', 'a', 0)], 1000, 500);
    expect(s.elapsedMs).toBe(0);
  });
});

describe('aggregateStats', () => {
  it('sums counts and recomputes WPM/accuracy across drills', () => {
    const a = computeStats([ks('a', 'a', 0), ks('b', 'x', 0)], 0, 30_000);
    const b = computeStats([ks('c', 'c', 0)], 0, 30_000);
    const agg = aggregateStats([a, b]);
    expect(agg.total).toBe(3);
    expect(agg.correct).toBe(2);
    expect(agg.errors).toBe(1);
    expect(agg.elapsedMs).toBe(60_000);
    expect(agg.accuracy).toBeCloseTo(2 / 3);
    // 2 correct chars / 5 over 1 minute.
    expect(agg.wpm).toBeCloseTo(2 / 5);
  });

  it('returns neutral stats for no parts', () => {
    expect(aggregateStats([])).toMatchObject({
      total: 0,
      correct: 0,
      accuracy: 1,
      wpm: 0,
    });
  });
});
