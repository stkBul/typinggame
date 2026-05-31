import { LESSONS } from '../lessons/curriculum';
import type { ProgressData } from './types';

/** A lesson is unlocked if it's the first one, or the previous one is passed. */
export function isUnlocked(lessonId: string, data: ProgressData): boolean {
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
