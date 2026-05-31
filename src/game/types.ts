/** A single balloon drifting down the play area. */
export interface Balloon {
  id: number;
  /** The letter or word you must type to pop it. */
  word: string;
  /** How many leading characters have been typed correctly so far. */
  typed: number;
  /** Horizontal centre, 0 (left) .. 1 (right). */
  x: number;
  /** Vertical position, 0 (top) .. 1 (ground). */
  y: number;
  /** Fall speed in fractions of the height per second. */
  speed: number;
  /** Colour hue (0..360) for a bit of variety. */
  hue: number;
}

export type GameStatus = 'idle' | 'playing' | 'over';

/** The full, serialisable state of a game in progress. */
export interface GameState {
  status: GameStatus;
  balloons: Balloon[];
  score: number;
  lives: number;
  /** Milliseconds since the game started — drives the difficulty ramp. */
  elapsedMs: number;
  /** Accumulator: time since the last balloon was spawned. */
  sinceSpawnMs: number;
  /** Monotonic id generator for balloons. */
  nextId: number;
  /** The multi-letter balloon currently being typed, or null. */
  lockedId: number | null;
  /** How many balloons have been popped this game. */
  popped: number;
}

/** Outcome of feeding a single typed character to the engine. */
export type TypeResult = 'pop' | 'progress' | 'miss';

/** A source of randomness in 0..1 (e.g. `Math.random`), injectable for tests. */
export type Rng = () => number;
