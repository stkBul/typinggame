// The difficulty ramp, all derived purely from elapsed time so the game gets
// faster the longer you survive.

/** A new level every 15 seconds. */
export const LEVEL_MS = 15_000;

/** Lives you start with — a balloon hitting the ground costs one. */
export const MAX_LIVES = 3;

/** Most balloons allowed on screen at once, to keep things readable. */
export const MAX_BALLOONS = 12;

const BASE_SPAWN_MS = 1900; // gap between balloons at the start
const MIN_SPAWN_MS = 600; // never spawn faster than this
const SPAWN_STEP_MS = 130; // gap shrinks this much per level

const BASE_SPEED = 0.05; // fall speed (height-fractions/sec) at the start
const SPEED_STEP = 0.011; // speed gained per level

/** 0-based difficulty level for a given elapsed time. */
export function levelIndex(elapsedMs: number): number {
  return Math.floor(elapsedMs / LEVEL_MS);
}

/** 1-based level shown to the player. */
export function levelNumber(elapsedMs: number): number {
  return levelIndex(elapsedMs) + 1;
}

/** Gap between balloon spawns, shrinking as the level climbs. */
export function spawnIntervalMs(elapsedMs: number): number {
  return Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS - levelIndex(elapsedMs) * SPAWN_STEP_MS);
}

/** Base fall speed for the current level (before per-balloon variance). */
export function fallSpeed(elapsedMs: number): number {
  return BASE_SPEED + levelIndex(elapsedMs) * SPEED_STEP;
}

/** Points awarded for popping a word, scaled by length and level. */
export function pointsFor(word: string, elapsedMs: number): number {
  const level = levelNumber(elapsedMs);
  return Math.round(word.length * 10 * (1 + 0.15 * (level - 1)));
}
