import type { LessonRecord, LessonResult, ProgressData } from './types';

export const STORAGE_KEY = 'tastetrup.progress';
export const CURRENT_VERSION = 1;

export function createEmptyProgress(): ProgressData {
  return { version: CURRENT_VERSION, records: {} };
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
  };
}

/** Parse stored progress, falling back to empty on any problem. */
export function parseProgress(raw: string | null): ProgressData {
  if (!raw) return createEmptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    if (
      parsed?.version !== CURRENT_VERSION ||
      typeof parsed.records !== 'object' ||
      parsed.records === null
    ) {
      // Unknown/older shape: start fresh. (Add migrations here later.)
      return createEmptyProgress();
    }
    return { version: CURRENT_VERSION, records: parsed.records };
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
