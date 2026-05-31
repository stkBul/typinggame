export type DrillKind = 'keys' | 'words' | 'sentence' | 'passage';

export interface Drill {
  id: string;
  kind: DrillKind;
  /** Text to type. Single line; spaces are part of the drill. */
  text: string;
}

export interface Lesson {
  /** Stable id used in the URL (/lesson/:id). */
  id: string;
  /** Grouping for the level map. */
  level: number;
  title: string;
  description: string;
  /** Characters introduced in this lesson, for the "new keys" badges. */
  newChars: string[];
  drills: Drill[];
  /** Net WPM required to pass. */
  targetWpm: number;
  /** Minimum accuracy to pass, 0..1. */
  minAccuracy: number;
}
