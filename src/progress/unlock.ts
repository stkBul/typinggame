import { LESSONS } from '../lessons/curriculum';
import type { ProgressData } from './types';

// In the local dev server every lesson is open, so you can jump straight to
// any drill while building. `MODE` is 'test' under Vitest, so this never leaks
// into tests, and `DEV` is false in production builds.
const UNLOCK_ALL = import.meta.env.DEV && import.meta.env.MODE !== 'test';

/** A lesson is unlocked if it's the first one, or the previous one is passed. */
export function isUnlocked(lessonId: string, data: ProgressData): boolean {
  if (UNLOCK_ALL) return true;
  const index = LESSONS.findIndex((l) => l.id === lessonId);
  if (index <= 0) return true;
  const prev = LESSONS[index - 1];
  return data.records[prev.id]?.passed ?? false;
}

/** The first lesson that hasn't been passed yet (where the learner should go). */
export function nextLessonId(data: ProgressData): string {
  const next = LESSONS.find((l) => !(data.records[l.id]?.passed ?? false));
  return (next ?? LESSONS[0]).id;
}
