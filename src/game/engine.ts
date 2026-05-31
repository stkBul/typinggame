import type { Balloon, GameState, Rng, TypeResult } from './types';
import {
  MAX_BALLOONS,
  MAX_LIVES,
  fallSpeed,
  pointsFor,
  spawnIntervalMs,
} from './difficulty';
import { pickTarget } from './words';

/** An idle game, before the first round starts. */
export function createGame(): GameState {
  return {
    status: 'idle',
    balloons: [],
    score: 0,
    lives: MAX_LIVES,
    elapsedMs: 0,
    sinceSpawnMs: 0,
    nextId: 1,
    lockedId: null,
    popped: 0,
  };
}

/**
 * A fresh round, ready to play. `sinceSpawnMs` is primed so the first balloon
 * appears on the very first tick instead of after a full interval.
 */
export function startGame(): GameState {
  return {
    ...createGame(),
    status: 'playing',
    sinceSpawnMs: spawnIntervalMs(0),
  };
}

function spawnBalloon(state: GameState, rng: Rng): GameState {
  const balloon: Balloon = {
    id: state.nextId,
    word: pickTarget(state.elapsedMs, rng),
    typed: 0,
    x: 0.08 + rng() * 0.84,
    y: 0,
    // ±15% speed variance so balloons don't fall in lockstep.
    speed: fallSpeed(state.elapsedMs) * (0.85 + rng() * 0.3),
    hue: Math.floor(rng() * 360),
  };
  return {
    ...state,
    balloons: [...state.balloons, balloon],
    nextId: state.nextId + 1,
  };
}

/**
 * Advance the simulation by `dtMs` milliseconds (pure): move balloons down,
 * spawn new ones on the difficulty schedule, drop lives for any that reach the
 * ground, and end the game when lives run out.
 */
export function tick(state: GameState, dtMs: number, rng: Rng): GameState {
  if (state.status !== 'playing') return state;

  const elapsedMs = state.elapsedMs + dtMs;

  // Move everything down, then split into survivors and those that landed.
  const survivors: Balloon[] = [];
  let missed = 0;
  for (const b of state.balloons) {
    const y = b.y + b.speed * (dtMs / 1000);
    if (y >= 1) missed += 1;
    else survivors.push({ ...b, y });
  }

  let next: GameState = {
    ...state,
    elapsedMs,
    balloons: survivors,
    sinceSpawnMs: state.sinceSpawnMs + dtMs,
    lives: state.lives - missed,
    // A locked balloon may have just hit the ground — drop the lock if so.
    lockedId: survivors.some((b) => b.id === state.lockedId)
      ? state.lockedId
      : null,
  };

  // Spawn as many balloons as the elapsed interval(s) allow, up to the cap.
  let interval = spawnIntervalMs(elapsedMs);
  while (next.sinceSpawnMs >= interval) {
    if (next.balloons.length >= MAX_BALLOONS) {
      // At capacity: hold the timer at the threshold and retry next tick.
      next = { ...next, sinceSpawnMs: interval };
      break;
    }
    next = spawnBalloon(next, rng);
    next = { ...next, sinceSpawnMs: next.sinceSpawnMs - interval };
    interval = spawnIntervalMs(elapsedMs);
  }

  if (next.lives <= 0) {
    return { ...next, status: 'over', lives: 0, lockedId: null };
  }
  return next;
}

/** Pop a balloon: remove it, award points, clear any lock, count it. */
function pop(state: GameState, balloon: Balloon): GameState {
  return {
    ...state,
    balloons: state.balloons.filter((b) => b.id !== balloon.id),
    score: state.score + pointsFor(balloon.word, state.elapsedMs),
    popped: state.popped + 1,
    lockedId: null,
  };
}

/**
 * Feed one typed character to the game (pure). Returns the next state and
 * whether it popped a balloon, advanced a word, or missed entirely.
 *
 * Once you start a multi-letter word you're "locked" onto that balloon until
 * you finish it or mistype; a wrong key resets that word so you can restart it.
 */
export function typeChar(
  state: GameState,
  rawChar: string,
): { state: GameState; result: TypeResult } {
  if (state.status !== 'playing' || rawChar.length !== 1) {
    return { state, result: 'miss' };
  }
  const char = rawChar.toLowerCase();

  // Locked onto a word: the next key must continue (or restart) it.
  if (state.lockedId !== null) {
    const balloon = state.balloons.find((b) => b.id === state.lockedId);
    if (balloon) {
      if (char === balloon.word[balloon.typed]) {
        const typed = balloon.typed + 1;
        if (typed >= balloon.word.length) {
          return { state: pop(state, balloon), result: 'pop' };
        }
        return {
          state: {
            ...state,
            balloons: state.balloons.map((b) =>
              b.id === balloon.id ? { ...b, typed } : b,
            ),
          },
          result: 'progress',
        };
      }
      // Wrong key: drop the word back to the start and release the lock.
      return {
        state: {
          ...state,
          lockedId: null,
          balloons: state.balloons.map((b) =>
            b.id === balloon.id ? { ...b, typed: 0 } : b,
          ),
        },
        result: 'miss',
      };
    }
  }

  // Not locked: find balloons whose first letter matches, target the lowest
  // one (closest to the ground — the most urgent).
  const target = state.balloons
    .filter((b) => b.word[0] === char)
    .reduce<Balloon | null>(
      (lowest, b) => (lowest === null || b.y > lowest.y ? b : lowest),
      null,
    );
  if (!target) return { state, result: 'miss' };

  if (target.word.length === 1) {
    return { state: pop(state, target), result: 'pop' };
  }
  return {
    state: {
      ...state,
      lockedId: target.id,
      balloons: state.balloons.map((b) =>
        b.id === target.id ? { ...b, typed: 1 } : b,
      ),
    },
    result: 'progress',
  };
}
