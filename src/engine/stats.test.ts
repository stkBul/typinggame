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
      charErrors: {},
      rhythmScore: 1,
    });
  });

  it('tallies mistakes per expected character', () => {
    const strokes = [
      ks('a', 'a', 0),
      ks('b', 'x', 0),
      ks('b', 'b', 0),
      ks('c', 'v', 0),
      ks('c', 'n', 0),
    ];
    const s = computeStats(strokes, 0, 0);
    expect(s.charErrors).toEqual({ b: 1, c: 2 });
  });

  it('scores steady typing higher than jittery typing', () => {
    const steady = computeStats(
      [0, 100, 200, 300, 400].map((t) => ks('a', 'a', t)),
      0,
      400,
    );
    const jittery = computeStats(
      [0, 20, 400, 430, 900].map((t) => ks('a', 'a', t)),
      0,
      900,
    );
    expect(steady.rhythmScore).toBeCloseTo(1);
    expect(jittery.rhythmScore).toBeLessThan(steady.rhythmScore);
  });

  it('ignores long pauses when scoring rhythm', () => {
    // A big gap (a pause) shouldn't tank an otherwise steady rhythm.
    const s = computeStats(
      [0, 100, 200, 5000, 5100, 5200].map((t) => ks('a', 'a', t)),
      0,
      5200,
    );
    expect(s.rhythmScore).toBeCloseTo(1);
  });

  it('defaults rhythm to 1 with too few intervals', () => {
    expect(computeStats([ks('a', 'a', 0)], 0, 0).rhythmScore).toBe(1);
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

  it('merges per-character error maps across drills', () => {
    const a = computeStats([ks('a', 'x', 0), ks('b', 'y', 0)], 0, 30_000);
    const b = computeStats([ks('a', 'z', 0)], 0, 30_000);
    expect(aggregateStats([a, b]).charErrors).toEqual({ a: 2, b: 1 });
  });

  it('combines rhythm as a length-weighted average', () => {
    // 4 steady strokes (score ~1) vs. 1 stroke (score 1) -> still ~1.
    const long = computeStats(
      [0, 100, 200, 300].map((t) => ks('a', 'a', t)),
      0,
      300,
    );
    const short = computeStats([ks('a', 'a', 0)], 0, 0);
    const agg = aggregateStats([long, short]);
    expect(agg.rhythmScore).toBeGreaterThan(0);
    expect(agg.rhythmScore).toBeLessThanOrEqual(1);
  });

  it('returns neutral stats for no parts', () => {
    expect(aggregateStats([])).toMatchObject({
      total: 0,
      correct: 0,
      accuracy: 1,
      wpm: 0,
      charErrors: {},
      rhythmScore: 1,
    });
  });
});
