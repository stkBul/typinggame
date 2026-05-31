import { DANISH_QWERTY } from './layout';

export interface KeyTarget {
  /** Physical key (KeyboardEvent.code) to press. */
  code: string;
  /** Whether Shift must be held to produce the character. */
  shift: boolean;
}

// Reverse lookup: produced character -> physical key + Shift state.
// First definition wins, so primary (unshifted) keys take precedence.
const charToKey = new Map<string, KeyTarget>();
for (const row of DANISH_QWERTY) {
  for (const key of row) {
    if (key.isDeadKey) continue;
    if (key.char !== undefined && !charToKey.has(key.char)) {
      charToKey.set(key.char, { code: key.code, shift: false });
    }
    if (key.shiftChar !== undefined && !charToKey.has(key.shiftChar)) {
      charToKey.set(key.shiftChar, { code: key.code, shift: true });
    }
  }
}

/** Find which key (and Shift state) produces a character, or null if unknown. */
export function findKey(char: string): KeyTarget | null {
  return charToKey.get(char) ?? null;
}
