import { describe, it, expect } from 'vitest';
import { createGame, startGame, tick, typeChar } from './engine';
import { MAX_LIVES } from './difficulty';
import type { Balloon, GameState } from './types';

/** Deterministic RNG that always returns the same value. */
const fixedRng = (value: number) => () => value;

function balloon(over: Partial<Balloon> & { id: number }): Balloon {
  return { word: 'a', typed: 0, x: 0.5, y: 0, speed: 0.1, hue: 0, ...over };
}

function playing(over: Partial<GameState> = {}): GameState {
  return { ...startGame(), balloons: [], sinceSpawnMs: 0, ...over };
}

describe('startGame', () => {
  it('starts playing with full lives and a primed spawn timer', () => {
    const s = startGame();
    expect(s.status).toBe('playing');
    expect(s.lives).toBe(MAX_LIVES);
    expect(s.score).toBe(0);
    // Primed so a balloon spawns on the first tick.
    expect(s.sinceSpawnMs).toBeGreaterThan(0);
  });
});

describe('tick', () => {
  it('does nothing once the game is idle or over', () => {
    expect(tick(createGame(), 100, fixedRng(0.5))).toEqual(createGame());
  });

  it('moves balloons down by speed × time', () => {
    const s = playing({ balloons: [balloon({ id: 1, y: 0, speed: 0.1 })] });
    const next = tick(s, 1000, fixedRng(0.5));
    expect(next.balloons[0].y).toBeCloseTo(0.1);
  });

  it('costs a life when a balloon reaches the ground', () => {
    const s = playing({ balloons: [balloon({ id: 1, y: 0.99, speed: 0.5 })] });
    const next = tick(s, 100, fixedRng(0.5));
    expect(next.balloons).toHaveLength(0);
    expect(next.lives).toBe(MAX_LIVES - 1);
  });

  it('ends the game when the last life is lost', () => {
    const s = playing({
      lives: 1,
      balloons: [balloon({ id: 1, y: 0.99, speed: 0.5 })],
    });
    const next = tick(s, 100, fixedRng(0.5));
    expect(next.status).toBe('over');
    expect(next.lives).toBe(0);
  });

  it('drops the lock when the locked balloon lands', () => {
    const s = playing({
      lockedId: 1,
      balloons: [balloon({ id: 1, word: 'sol', typed: 1, y: 0.99, speed: 0.5 })],
    });
    const next = tick(s, 100, fixedRng(0.5));
    expect(next.lockedId).toBeNull();
  });

  it('spawns a balloon once the interval elapses', () => {
    const s = playing({ sinceSpawnMs: 0 });
    const next = tick(s, 5000, fixedRng(0.3));
    expect(next.balloons.length).toBeGreaterThan(0);
  });
});

describe('typeChar', () => {
  it('pops a single-letter balloon and scores', () => {
    const s = playing({ balloons: [balloon({ id: 1, word: 'a' })] });
    const { state, result } = typeChar(s, 'a');
    expect(result).toBe('pop');
    expect(state.balloons).toHaveLength(0);
    expect(state.score).toBeGreaterThan(0);
    expect(state.popped).toBe(1);
  });

  it('is case-insensitive', () => {
    const s = playing({ balloons: [balloon({ id: 1, word: 'a' })] });
    expect(typeChar(s, 'A').result).toBe('pop');
  });

  it('reports a miss when nothing matches', () => {
    const s = playing({ balloons: [balloon({ id: 1, word: 'a' })] });
    const { state, result } = typeChar(s, 'z');
    expect(result).toBe('miss');
    expect(state.balloons).toHaveLength(1);
  });

  it('targets the lowest balloon when several share a first letter', () => {
    const s = playing({
      balloons: [
        balloon({ id: 1, word: 'a', y: 0.2 }),
        balloon({ id: 2, word: 'a', y: 0.8 }),
      ],
    });
    const { state } = typeChar(s, 'a');
    // The lower one (id 2) is popped; the higher one survives.
    expect(state.balloons.map((b) => b.id)).toEqual([1]);
  });

  it('locks onto a word and pops it letter by letter', () => {
    let s = playing({ balloons: [balloon({ id: 1, word: 'sol' })] });
    let r = typeChar(s, 's');
    expect(r.result).toBe('progress');
    expect(r.state.lockedId).toBe(1);
    expect(r.state.balloons[0].typed).toBe(1);
    s = r.state;

    r = typeChar(s, 'o');
    expect(r.result).toBe('progress');
    expect(r.state.balloons[0].typed).toBe(2);
    s = r.state;

    r = typeChar(s, 'l');
    expect(r.result).toBe('pop');
    expect(r.state.balloons).toHaveLength(0);
    expect(r.state.lockedId).toBeNull();
  });

  it('resets the word and releases the lock on a wrong key', () => {
    const locked = playing({
      lockedId: 1,
      balloons: [balloon({ id: 1, word: 'sol', typed: 1 })],
    });
    const { state, result } = typeChar(locked, 'x');
    expect(result).toBe('miss');
    expect(state.lockedId).toBeNull();
    expect(state.balloons[0].typed).toBe(0);
  });

  it('ignores input when not playing', () => {
    const s = createGame();
    expect(typeChar(s, 'a').result).toBe('miss');
  });
});
