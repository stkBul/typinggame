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
  /** Count of mistakes per expected character, used for targeted review. */
  charErrors: Record<string, number>;
  /**
   * How even the typing rhythm was, 0..1 (1 = perfectly steady). Derived from
   * the spread of inter-keystroke intervals. Informational, not part of passing.
   */
  rhythmScore: number;
}

const MS_PER_MINUTE = 60_000;
const CHARS_PER_WORD = 5;
/** Gaps longer than this are treated as pauses (thinking, distraction). */
const PAUSE_MS = 2000;

/** Tally mistakes per expected character (skips correct keystrokes). */
function tallyCharErrors(keystrokes: Keystroke[]): Record<string, number> {
  const errors: Record<string, number> = {};
  for (const k of keystrokes) {
    if (!k.correct) errors[k.expected] = (errors[k.expected] ?? 0) + 1;
  }
  return errors;
}

/**
 * Rhythm consistency, 0..1. Looks at the spread of gaps between consecutive
 * keystrokes (ignoring long pauses) via the coefficient of variation. Steadier
 * typing -> lower spread -> higher score. Defaults to 1 when there isn't enough
 * data (fewer than two usable intervals) so sparse drills aren't penalised.
 */
function computeRhythmScore(keystrokes: Keystroke[]): number {
  const intervals: number[] = [];
  for (let i = 1; i < keystrokes.length; i++) {
    const gap = keystrokes[i].time - keystrokes[i - 1].time;
    if (gap > 0 && gap <= PAUSE_MS) intervals.push(gap);
  }
  if (intervals.length < 2) return 1;
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (mean <= 0) return 1;
  const variance =
    intervals.reduce((s, x) => s + (x - mean) ** 2, 0) / intervals.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(1, 1 - cv));
}

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
  return {
    wpm,
    accuracy,
    errors,
    correct,
    total,
    elapsedMs,
    charErrors: tallyCharErrors(keystrokes),
    rhythmScore: computeRhythmScore(keystrokes),
  };
}

/** Combine several drill results into one overall result for a lesson. */
export function aggregateStats(parts: TypingStats[]): TypingStats {
  const correct = parts.reduce((n, p) => n + p.correct, 0);
  const total = parts.reduce((n, p) => n + p.total, 0);
  const elapsedMs = parts.reduce((n, p) => n + p.elapsedMs, 0);
  const minutes = elapsedMs / MS_PER_MINUTE;

  const charErrors: Record<string, number> = {};
  for (const p of parts) {
    for (const [char, n] of Object.entries(p.charErrors)) {
      charErrors[char] = (charErrors[char] ?? 0) + n;
    }
  }

  // Weight each drill's rhythm by how much was typed, so a short drill can't
  // skew the overall feel. Falls back to 1 when nothing was typed.
  const rhythmScore =
    total > 0
      ? parts.reduce((s, p) => s + p.rhythmScore * p.total, 0) / total
      : 1;

  return {
    correct,
    total,
    errors: total - correct,
    elapsedMs,
    wpm: minutes > 0 ? correct / CHARS_PER_WORD / minutes : 0,
    accuracy: total > 0 ? correct / total : 1,
    charErrors,
    rhythmScore,
  };
}
