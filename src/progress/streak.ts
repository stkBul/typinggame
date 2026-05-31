export interface Streak {
  current: number;
  longest: number;
  /** Local day key (YYYY-MM-DD) of the last active day, or null. */
  lastActiveDay: string | null;
}

const MS_PER_DAY = 86_400_000;

export function emptyStreak(): Streak {
  return { current: 0, longest: 0, lastActiveDay: null };
}

/** Local calendar day key, e.g. "2026-05-31". */
export function dayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Advance the streak for activity at `now`. Same-day activity is a no-op;
 * consecutive days extend the streak; a gap resets it to 1.
 */
export function advanceStreak(streak: Streak, now: number): Streak {
  const today = dayKey(now);
  if (streak.lastActiveDay === today) return streak;
  const yesterday = dayKey(now - MS_PER_DAY);
  const current = streak.lastActiveDay === yesterday ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDay: today,
  };
}

/** Coerce unknown stored data into a valid Streak. */
export function normalizeStreak(value: unknown): Streak {
  if (typeof value !== 'object' || value === null) return emptyStreak();
  const v = value as Partial<Streak>;
  return {
    current: typeof v.current === 'number' ? v.current : 0,
    longest: typeof v.longest === 'number' ? v.longest : 0,
    lastActiveDay: typeof v.lastActiveDay === 'string' ? v.lastActiveDay : null,
  };
}
