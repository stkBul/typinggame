export interface Keystroke {
  /** Character the learner was meant to type at this position. */
  expected: string;
  /** Character actually typed. */
  actual: string;
  correct: boolean;
  /** Timestamp (ms) the keystroke was registered. */
  time: number;
}

export interface TypingStats {
  /** Net words per minute, using the 5-characters-per-word convention. */
  wpm: number;
  /** Fraction of keystrokes that were correct, 0..1. */
  accuracy: number;
  errors: number;
  correct: number;
  total: number;
  elapsedMs: number;
}

const MS_PER_MINUTE = 60_000;
const CHARS_PER_WORD = 5;

/**
 * Derive typing stats from the keystroke log. `endpoint` is "now" while running
 * or the finish time once done, so WPM keeps ticking live and then freezes.
 */
export function computeStats(
  keystrokes: Keystroke[],
  startedAt: number | null,
  endpoint: number,
): TypingStats {
  const total = keystrokes.length;
  const correct = keystrokes.reduce((n, k) => (k.correct ? n + 1 : n), 0);
  const errors = total - correct;
  const elapsedMs = startedAt === null ? 0 : Math.max(0, endpoint - startedAt);
  const minutes = elapsedMs / MS_PER_MINUTE;
  const wpm = minutes > 0 ? correct / CHARS_PER_WORD / minutes : 0;
  const accuracy = total > 0 ? correct / total : 1;
  return { wpm, accuracy, errors, correct, total, elapsedMs };
}

/** Combine several drill results into one overall result for a lesson. */
export function aggregateStats(parts: TypingStats[]): TypingStats {
  const correct = parts.reduce((n, p) => n + p.correct, 0);
  const total = parts.reduce((n, p) => n + p.total, 0);
  const elapsedMs = parts.reduce((n, p) => n + p.elapsedMs, 0);
  const minutes = elapsedMs / MS_PER_MINUTE;
  return {
    correct,
    total,
    errors: total - correct,
    elapsedMs,
    wpm: minutes > 0 ? correct / CHARS_PER_WORD / minutes : 0,
    accuracy: total > 0 ? correct / total : 1,
  };
}
