import { describe, it, expect } from 'vitest';
import {
  CURRENT_VERSION,
  applyResult,
  createEmptyProgress,
  parseProgress,
} from './store';

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
    };
    expect(parseProgress(JSON.stringify(stored))).toEqual(stored);
  });
});
