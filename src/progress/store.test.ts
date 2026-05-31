import { describe, it, expect } from 'vitest';
import {
  CURRENT_VERSION,
  REVIEW_AFTER_MS,
  applyGameScore,
  applyResult,
  createEmptyProgress,
  lessonsNeedingReview,
  parseProgress,
} from './store';
import type { LessonRecord, ProgressData } from './types';
import { emptyStreak } from './streak';

describe('applyResult', () => {
  it('creates a record for a new lesson', () => {
    const data = applyResult(
      createEmptyProgress(),
      { lessonId: '1', wpm: 12, accuracy: 0.95, passed: true },
      1000,
    );
    expect(data.records['1']).toEqual({
      lessonId: '1',
      bestWpm: 12,
      bestAccuracy: 0.95,
      passed: true,
      attempts: 1,
      lastPlayedAt: 1000,
    });
  });

  it('keeps the best scores and counts attempts', () => {
    let data = applyResult(createEmptyProgress(), {
      lessonId: '1',
      wpm: 20,
      accuracy: 0.98,
      passed: true,
    });
    data = applyResult(data, {
      lessonId: '1',
      wpm: 10,
      accuracy: 0.8,
      passed: false,
    });
    const r = data.records['1'];
    expect(r.bestWpm).toBe(20);
    expect(r.bestAccuracy).toBe(0.98);
    expect(r.attempts).toBe(2);
  });

  it('makes passed sticky once achieved', () => {
    let data = applyResult(createEmptyProgress(), {
      lessonId: '1',
      wpm: 20,
      accuracy: 0.98,
      passed: true,
    });
    data = applyResult(data, {
      lessonId: '1',
      wpm: 5,
      accuracy: 0.5,
      passed: false,
    });
    expect(data.records['1'].passed).toBe(true);
  });
});

describe('lessonsNeedingReview', () => {
  const NOW = 1_000_000_000_000;

  function record(over: Partial<LessonRecord> & { lessonId: string }): LessonRecord {
    return {
      bestWpm: 30,
      bestAccuracy: 0.95,
      passed: true,
      attempts: 1,
      lastPlayedAt: NOW,
      ...over,
    };
  }

  function progressWith(records: LessonRecord[]): ProgressData {
    return {
      version: CURRENT_VERSION,
      records: Object.fromEntries(records.map((r) => [r.lessonId, r])),
      streak: emptyStreak(),
      gameBest: 0,
    };
  }

  it('excludes lessons practised recently', () => {
    const data = progressWith([
      record({ lessonId: '1', lastPlayedAt: NOW - 1000 }),
    ]);
    expect(lessonsNeedingReview(data, NOW)).toEqual([]);
  });

  it('includes passed lessons gone stale', () => {
    const data = progressWith([
      record({ lessonId: '1', lastPlayedAt: NOW - REVIEW_AFTER_MS - 1 }),
    ]);
    expect(lessonsNeedingReview(data, NOW)).toEqual(['1']);
  });

  it('excludes unpassed lessons even when stale', () => {
    const data = progressWith([
      record({ lessonId: '1', passed: false, lastPlayedAt: NOW - REVIEW_AFTER_MS - 1 }),
    ]);
    expect(lessonsNeedingReview(data, NOW)).toEqual([]);
  });

  it('orders the shakiest pass (smallest WPM margin) first', () => {
    // Lesson 1 target 8 WPM, lesson 2 target 8 WPM. Lesson 2 barely passed.
    const stale = NOW - REVIEW_AFTER_MS - 1;
    const data = progressWith([
      record({ lessonId: '1', bestWpm: 40, lastPlayedAt: stale }),
      record({ lessonId: '2', bestWpm: 9, lastPlayedAt: stale }),
    ]);
    expect(lessonsNeedingReview(data, NOW)).toEqual(['2', '1']);
  });
});

describe('parseProgress', () => {
  it('returns empty progress for null', () => {
    expect(parseProgress(null)).toEqual(createEmptyProgress());
  });

  it('returns empty progress for invalid JSON', () => {
    expect(parseProgress('{not json')).toEqual(createEmptyProgress());
  });

  it('returns empty progress for an unknown version', () => {
    const raw = JSON.stringify({ version: 999, records: {} });
    expect(parseProgress(raw)).toEqual(createEmptyProgress());
  });

  it('parses valid stored progress', () => {
    const stored = {
      version: CURRENT_VERSION,
      records: {
        '1': {
          lessonId: '1',
          bestWpm: 15,
          bestAccuracy: 0.9,
          passed: true,
          attempts: 1,
          lastPlayedAt: 1,
        },
      },
      streak: { current: 2, longest: 4, lastActiveDay: '2026-05-30' },
      gameBest: 420,
    };
    expect(parseProgress(JSON.stringify(stored))).toEqual(stored);
  });

  it('migrates v2 progress by backfilling a zero game best', () => {
    const v2 = {
      version: 2,
      records: {},
      streak: { current: 1, longest: 1, lastActiveDay: '2026-05-30' },
    };
    const migrated = parseProgress(JSON.stringify(v2));
    expect(migrated.version).toBe(CURRENT_VERSION);
    expect(migrated.gameBest).toBe(0);
    expect(migrated.streak.current).toBe(1);
  });

  it('migrates v1 progress by backfilling an empty streak', () => {
    const v1 = {
      version: 1,
      records: {
        '1': {
          lessonId: '1',
          bestWpm: 10,
          bestAccuracy: 0.95,
          passed: true,
          attempts: 1,
          lastPlayedAt: 1,
        },
      },
    };
    const migrated = parseProgress(JSON.stringify(v1));
    expect(migrated.version).toBe(CURRENT_VERSION);
    expect(migrated.records['1'].passed).toBe(true);
    expect(migrated.streak).toEqual({
      current: 0,
      longest: 0,
      lastActiveDay: null,
    });
    expect(migrated.gameBest).toBe(0);
  });
});

describe('applyGameScore', () => {
  it('records a first score', () => {
    expect(applyGameScore(createEmptyProgress(), 150).gameBest).toBe(150);
  });

  it('keeps the higher of the two scores', () => {
    const data = applyGameScore(createEmptyProgress(), 200);
    expect(applyGameScore(data, 120).gameBest).toBe(200);
    expect(applyGameScore(data, 300).gameBest).toBe(300);
  });

  it('floors and clamps stray values', () => {
    expect(applyGameScore(createEmptyProgress(), 99.9).gameBest).toBe(99);
    expect(applyGameScore(createEmptyProgress(), -5).gameBest).toBe(0);
  });
});
