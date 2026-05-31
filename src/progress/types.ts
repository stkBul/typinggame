/** Best-effort summary of how a learner has done on a single lesson. */
export interface LessonRecord {
  lessonId: string;
  bestWpm: number;
  bestAccuracy: number;
  /** Sticky: once a lesson is passed it stays passed. */
  passed: boolean;
  attempts: number;
  lastPlayedAt: number;
}

import type { Streak } from './streak';

/** The full persisted progress blob. `version` enables future migrations. */
export interface ProgressData {
  version: number;
  records: Record<string, LessonRecord>;
  streak: Streak;
  /** Best score in the balloon-popping game. */
  gameBest: number;
}

/** A single finished-lesson outcome handed to the store. */
export interface LessonResult {
  lessonId: string;
  wpm: number;
  accuracy: number;
  passed: boolean;
}
