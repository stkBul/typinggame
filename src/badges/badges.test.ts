import { describe, it, expect } from 'vitest';
import { earnedBadgeIds } from './badges';
import { applyResult, createEmptyProgress } from '../progress/store';
import { LESSONS } from '../lessons/curriculum';
import type { ProgressData } from '../progress/types';

function pass(
  data: ProgressData,
  lessonId: string,
  wpm = 12,
  accuracy = 0.95,
): ProgressData {
  return applyResult(data, { lessonId, wpm, accuracy, passed: true });
}

describe('earnedBadgeIds', () => {
  it('earns nothing on empty progress', () => {
    expect(earnedBadgeIds(createEmptyProgress()).size).toBe(0);
  });

  it('earns first-pass on the first passed lesson', () => {
    const ids = earnedBadgeIds(pass(createEmptyProgress(), '1'));
    expect(ids.has('first-pass')).toBe(true);
    expect(ids.has('home-row')).toBe(false);
  });

  it('earns speedy at 30+ WPM and accurate at 100%', () => {
    const ids = earnedBadgeIds(pass(createEmptyProgress(), '1', 35, 1));
    expect(ids.has('speedy')).toBe(true);
    expect(ids.has('accurate')).toBe(true);
  });

  it('earns home-row when all level-1 lessons pass', () => {
    let data = createEmptyProgress();
    for (const l of LESSONS.filter((l) => l.level === 1)) {
      data = pass(data, l.id);
    }
    const ids = earnedBadgeIds(data);
    expect(ids.has('home-row')).toBe(true);
    expect(ids.has('all-lessons')).toBe(false);
  });

  it('earns all-lessons and a streak badge', () => {
    let data = createEmptyProgress();
    for (const l of LESSONS) data = pass(data, l.id);
    data = { ...data, streak: { current: 3, longest: 3, lastActiveDay: null } };
    const ids = earnedBadgeIds(data);
    expect(ids.has('all-lessons')).toBe(true);
    expect(ids.has('streak-3')).toBe(true);
  });
});
