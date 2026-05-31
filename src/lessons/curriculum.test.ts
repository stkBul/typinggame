import { describe, it, expect } from 'vitest';
import { LESSONS, getLesson, getNextLesson } from './curriculum';
import { findKey } from '../keyboard/charMap';

describe('curriculum', () => {
  it('has unique lesson ids and drill ids', () => {
    const lessonIds = LESSONS.map((l) => l.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);

    const drillIds = LESSONS.flatMap((l) => l.drills.map((d) => d.id));
    expect(new Set(drillIds).size).toBe(drillIds.length);
  });

  it('every drill character is typeable on the Danish layout', () => {
    for (const lesson of LESSONS) {
      for (const drill of lesson.drills) {
        for (const char of drill.text) {
          expect(findKey(char), `"${char}" in drill ${drill.id}`).not.toBeNull();
        }
      }
    }
  });

  it('only uses characters introduced in this or an earlier lesson', () => {
    const allowed = new Set<string>([' ']);
    for (const lesson of LESSONS) {
      for (const c of lesson.newChars) allowed.add(c);
      for (const drill of lesson.drills) {
        for (const char of drill.text) {
          expect(allowed.has(char), `"${char}" in ${drill.id}`).toBe(true);
        }
      }
    }
  });

  it('has sensible pass thresholds', () => {
    for (const lesson of LESSONS) {
      expect(lesson.targetWpm).toBeGreaterThan(0);
      expect(lesson.minAccuracy).toBeGreaterThan(0);
      expect(lesson.minAccuracy).toBeLessThanOrEqual(1);
      expect(lesson.drills.length).toBeGreaterThan(0);
    }
  });

  it('looks up lessons and finds the next one', () => {
    expect(getLesson('1')?.title).toBe('f og j');
    expect(getLesson('nope')).toBeUndefined();
    expect(getNextLesson('1')?.id).toBe('2');
    expect(getNextLesson(LESSONS[LESSONS.length - 1].id)).toBeUndefined();
  });
});
