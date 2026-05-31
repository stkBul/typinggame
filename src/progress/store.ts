import { LESSONS } from '../lessons/curriculum';
import { advanceStreak, emptyStreak, normalizeStreak } from './streak';
import type { LessonRecord, LessonResult, ProgressData } from './types';

export const STORAGE_KEY = 'tastetrup.progress';
export const CURRENT_VERSION = 3;
/** A passed lesson is due for a refresher once it's gone unpractised this long. */
export const REVIEW_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createEmptyProgress(): ProgressData {
  return { version: CURRENT_VERSION, records: {}, streak: emptyStreak(), gameBest: 0 };
}

function isRecordMap(value: unknown): value is Record<string, LessonRecord> {
  return typeof value === 'object' && value !== null;
}

/** Coerce a stored game-best into a safe, non-negative integer. */
function readGameBest(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

/** Merge a finished game's score, keeping the personal best (pure). */
export function applyGameScore(data: ProgressData, score: number): ProgressData {
  return { ...data, gameBest: Math.max(data.gameBest, Math.max(0, Math.floor(score))) };
}

/**
 * Merge a finished-lesson result into the progress data (pure). Keeps the best
 * WPM/accuracy, increments attempts, and makes `passed` sticky.
 */
export function applyResult(
  data: ProgressData,
  result: LessonResult,
  now: number = Date.now(),
): ProgressData {
  const prev = data.records[result.lessonId];
  const record: LessonRecord = {
    lessonId: result.lessonId,
    bestWpm: Math.max(prev?.bestWpm ?? 0, result.wpm),
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
    passed: (prev?.passed ?? false) || result.passed,
    attempts: (prev?.attempts ?? 0) + 1,
    lastPlayedAt: now,
  };
  return {
    ...data,
    records: { ...data.records, [result.lessonId]: record },
    streak: advanceStreak(data.streak, now),
  };
}

/**
 * Passed lessons that haven't been practised within {@link REVIEW_AFTER_MS},
 * ordered so the shakiest passes (smallest WPM margin over target) come first —
 * spaced repetition focused where it helps most.
 */
export function lessonsNeedingReview(
  data: ProgressData,
  now: number = Date.now(),
): string[] {
  return LESSONS.filter((lesson) => {
    const record = data.records[lesson.id];
    if (!record?.passed) return false;
    return now - record.lastPlayedAt > REVIEW_AFTER_MS;
  })
    .sort((a, b) => {
      const margin = (lesson: (typeof LESSONS)[number]) =>
        (data.records[lesson.id]?.bestWpm ?? 0) - lesson.targetWpm;
      return margin(a) - margin(b);
    })
    .map((lesson) => lesson.id);
}

/** Parse stored progress, migrating older versions and falling back to empty. */
export function parseProgress(raw: string | null): ProgressData {
  if (!raw) return createEmptyProgress();
  try {
    const parsed = JSON.parse(raw) as { version?: unknown; records?: unknown };
    if (typeof parsed !== 'object' || parsed === null) {
      return createEmptyProgress();
    }
    // v1 had no streak — migrate by backfilling an empty one (and no game score).
    if (parsed.version === 1 && isRecordMap(parsed.records)) {
      return {
        version: CURRENT_VERSION,
        records: parsed.records,
        streak: emptyStreak(),
        gameBest: 0,
      };
    }
    // v2 had a streak but no game score — backfill a zero best.
    if (parsed.version === 2 && isRecordMap(parsed.records)) {
      return {
        version: CURRENT_VERSION,
        records: parsed.records,
        streak: normalizeStreak((parsed as { streak?: unknown }).streak),
        gameBest: 0,
      };
    }
    if (parsed.version === CURRENT_VERSION && isRecordMap(parsed.records)) {
      return {
        version: CURRENT_VERSION,
        records: parsed.records,
        streak: normalizeStreak((parsed as { streak?: unknown }).streak),
        gameBest: readGameBest((parsed as { gameBest?: unknown }).gameBest),
      };
    }
    return createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function loadProgress(): ProgressData {
  try {
    return parseProgress(localStorage.getItem(STORAGE_KEY));
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage may be unavailable (private mode, quota); progress is best-effort.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
