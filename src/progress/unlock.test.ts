import { describe, it, expect } from 'vitest';
import { isUnlocked, nextLessonId } from './unlock';
import { applyResult, createEmptyProgress } from './store';
import type { ProgressData } from './types';

function pass(data: ProgressData, lessonId: string): ProgressData {
  return applyResult(data, { lessonId, wpm: 99, accuracy: 1, passed: true });
}

describe('isUnlocked', () => {
  it('always unlocks the first lesson', () => {
    expect(isUnlocked('1', createEmptyProgress())).toBe(true);
  });

  it('locks later lessons until the previous one is passed', () => {
    const empty = createEmptyProgress();
    expect(isUnlocked('2', empty)).toBe(false);
    expect(isUnlocked('2', pass(empty, '1'))).toBe(true);
  });

  it('does not unlock from a non-passing attempt', () => {
    const attempted = applyResult(createEmptyProgress(), {
      lessonId: '1',
      wpm: 1,
      accuracy: 0.1,
      passed: false,
    });
    expect(isUnlocked('2', attempted)).toBe(false);
  });
});

describe('nextLessonId', () => {
  it('starts at the first lesson', () => {
    expect(nextLessonId(createEmptyProgress())).toBe('1');
  });

  it('advances to the first unpassed lesson', () => {
    let data = pass(createEmptyProgress(), '1');
    data = pass(data, '2');
    expect(nextLessonId(data)).toBe('3');
  });
});
