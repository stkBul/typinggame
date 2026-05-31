import { describe, it, expect } from 'vitest';
import { advanceStreak, dayKey, emptyStreak } from './streak';

const DAY = 86_400_000;
// A fixed midday timestamp avoids timezone edge cases around midnight.
const day1 = new Date('2026-05-10T12:00:00').getTime();

describe('advanceStreak', () => {
  it('starts a streak at 1 from empty', () => {
    const s = advanceStreak(emptyStreak(), day1);
    expect(s.current).toBe(1);
    expect(s.longest).toBe(1);
    expect(s.lastActiveDay).toBe(dayKey(day1));
  });

  it('is a no-op for same-day activity', () => {
    const s1 = advanceStreak(emptyStreak(), day1);
    const s2 = advanceStreak(s1, day1 + 3 * 3_600_000);
    expect(s2).toBe(s1);
  });

  it('extends the streak on consecutive days', () => {
    let s = advanceStreak(emptyStreak(), day1);
    s = advanceStreak(s, day1 + DAY);
    s = advanceStreak(s, day1 + 2 * DAY);
    expect(s.current).toBe(3);
    expect(s.longest).toBe(3);
  });

  it('resets to 1 after a gap but keeps the longest', () => {
    let s = advanceStreak(emptyStreak(), day1);
    s = advanceStreak(s, day1 + DAY);
    s = advanceStreak(s, day1 + 5 * DAY);
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
  });
});
