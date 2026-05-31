import type { Finger } from './fingers';

export interface KeyDef {
  /** Physical key, matching KeyboardEvent.code. */
  code: string;
  /** Label shown on the key (unshifted). */
  label: string;
  /** Label shown in the upper-left corner (shifted), if any. */
  shiftLabel?: string;
  /** Character produced without Shift. Omitted for non-typing keys. */
  char?: string;
  /** Character produced with Shift. */
  shiftChar?: string;
  /** Finger that should press this key in the 10-finger system. */
  finger: Finger;
  /** Relative width (1 = a standard letter key). */
  width?: number;
  /** Dead keys (accents) produce no character on their own. */
  isDeadKey?: boolean;
  /** Home-row anchor keys (F and J) that carry the tactile bumps. */
  homeAnchor?: boolean;
}

export type KeyboardRow = KeyDef[];

// Danish ISO QWERTY. `code` values are physical keys, so detection works
// regardless of the OS layout label; `char`/`shiftChar` are what a Danish
// layout produces.
export const DANISH_QWERTY: KeyboardRow[] = [
  [
    { code: 'Backquote', label: '½', shiftLabel: '§', char: '½', shiftChar: '§', finger: 'LPinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', char: '1', shiftChar: '!', finger: 'LPinky' },
    { code: 'Digit2', label: '2', shiftLabel: '"', char: '2', shiftChar: '"', finger: 'LRing' },
    { code: 'Digit3', label: '3', shiftLabel: '#', char: '3', shiftChar: '#', finger: 'LMiddle' },
    { code: 'Digit4', label: '4', shiftLabel: '¤', char: '4', shiftChar: '¤', finger: 'LIndex' },
    { code: 'Digit5', label: '5', shiftLabel: '%', char: '5', shiftChar: '%', finger: 'LIndex' },
    { code: 'Digit6', label: '6', shiftLabel: '&', char: '6', shiftChar: '&', finger: 'RIndex' },
    { code: 'Digit7', label: '7', shiftLabel: '/', char: '7', shiftChar: '/', finger: 'RIndex' },
    { code: 'Digit8', label: '8', shiftLabel: '(', char: '8', shiftChar: '(', finger: 'RMiddle' },
    { code: 'Digit9', label: '9', shiftLabel: ')', char: '9', shiftChar: ')', finger: 'RRing' },
    { code: 'Digit0', label: '0', shiftLabel: '=', char: '0', shiftChar: '=', finger: 'RPinky' },
    { code: 'Minus', label: '+', shiftLabel: '?', char: '+', shiftChar: '?', finger: 'RPinky' },
    { code: 'Equal', label: '´', shiftLabel: '`', isDeadKey: true, finger: 'RPinky' },
    { code: 'Backspace', label: '⌫', finger: 'RPinky', width: 2 },
  ],
  [
    { code: 'Tab', label: 'Tab', finger: 'LPinky', width: 1.5 },
    { code: 'KeyQ', label: 'q', char: 'q', shiftChar: 'Q', finger: 'LPinky' },
    { code: 'KeyW', label: 'w', char: 'w', shiftChar: 'W', finger: 'LRing' },
    { code: 'KeyE', label: 'e', char: 'e', shiftChar: 'E', finger: 'LMiddle' },
    { code: 'KeyR', label: 'r', char: 'r', shiftChar: 'R', finger: 'LIndex' },
    { code: 'KeyT', label: 't', char: 't', shiftChar: 'T', finger: 'LIndex' },
    { code: 'KeyY', label: 'y', char: 'y', shiftChar: 'Y', finger: 'RIndex' },
    { code: 'KeyU', label: 'u', char: 'u', shiftChar: 'U', finger: 'RIndex' },
    { code: 'KeyI', label: 'i', char: 'i', shiftChar: 'I', finger: 'RMiddle' },
    { code: 'KeyO', label: 'o', char: 'o', shiftChar: 'O', finger: 'RRing' },
    { code: 'KeyP', label: 'p', char: 'p', shiftChar: 'P', finger: 'RPinky' },
    { code: 'BracketLeft', label: 'å', char: 'å', shiftChar: 'Å', finger: 'RPinky' },
    { code: 'BracketRight', label: '¨', shiftLabel: '^', isDeadKey: true, finger: 'RPinky' },
  ],
  [
    { code: 'CapsLock', label: 'Caps', finger: 'LPinky', width: 1.75 },
    { code: 'KeyA', label: 'a', char: 'a', shiftChar: 'A', finger: 'LPinky' },
    { code: 'KeyS', label: 's', char: 's', shiftChar: 'S', finger: 'LRing' },
    { code: 'KeyD', label: 'd', char: 'd', shiftChar: 'D', finger: 'LMiddle' },
    { code: 'KeyF', label: 'f', char: 'f', shiftChar: 'F', finger: 'LIndex', homeAnchor: true },
    { code: 'KeyG', label: 'g', char: 'g', shiftChar: 'G', finger: 'LIndex' },
    { code: 'KeyH', label: 'h', char: 'h', shiftChar: 'H', finger: 'RIndex' },
    { code: 'KeyJ', label: 'j', char: 'j', shiftChar: 'J', finger: 'RIndex', homeAnchor: true },
    { code: 'KeyK', label: 'k', char: 'k', shiftChar: 'K', finger: 'RMiddle' },
    { code: 'KeyL', label: 'l', char: 'l', shiftChar: 'L', finger: 'RRing' },
    { code: 'Semicolon', label: 'æ', char: 'æ', shiftChar: 'Æ', finger: 'RPinky' },
    { code: 'Quote', label: 'ø', char: 'ø', shiftChar: 'Ø', finger: 'RPinky' },
    { code: 'Backslash', label: "'", shiftLabel: '*', char: "'", shiftChar: '*', finger: 'RPinky' },
    { code: 'Enter', label: '⏎', finger: 'RPinky', width: 1.5 },
  ],
  [
    { code: 'ShiftLeft', label: '⇧', finger: 'LPinky', width: 1.25 },
    { code: 'IntlBackslash', label: '<', shiftLabel: '>', char: '<', shiftChar: '>', finger: 'LPinky' },
    { code: 'KeyZ', label: 'z', char: 'z', shiftChar: 'Z', finger: 'LPinky' },
    { code: 'KeyX', label: 'x', char: 'x', shiftChar: 'X', finger: 'LRing' },
    { code: 'KeyC', label: 'c', char: 'c', shiftChar: 'C', finger: 'LMiddle' },
    { code: 'KeyV', label: 'v', char: 'v', shiftChar: 'V', finger: 'LIndex' },
    { code: 'KeyB', label: 'b', char: 'b', shiftChar: 'B', finger: 'LIndex' },
    { code: 'KeyN', label: 'n', char: 'n', shiftChar: 'N', finger: 'RIndex' },
    { code: 'KeyM', label: 'm', char: 'm', shiftChar: 'M', finger: 'RIndex' },
    { code: 'Comma', label: ',', shiftLabel: ';', char: ',', shiftChar: ';', finger: 'RMiddle' },
    { code: 'Period', label: '.', shiftLabel: ':', char: '.', shiftChar: ':', finger: 'RRing' },
    { code: 'Slash', label: '-', shiftLabel: '_', char: '-', shiftChar: '_', finger: 'RPinky' },
    { code: 'ShiftRight', label: '⇧', finger: 'RPinky', width: 2.75 },
  ],
  [{ code: 'Space', label: 'mellemrum', char: ' ', finger: 'RThumb', width: 12 }],
];

/** Flat lookup of every key by its physical code. */
export const KEY_BY_CODE: Map<string, KeyDef> = new Map(
  DANISH_QWERTY.flatMap((row) => row).map((key) => [key.code, key]),
);
