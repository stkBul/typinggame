// The 10-finger touch-typing model. Left/right finger pairs share a colour so
// learners associate one colour with one finger across both hands.

export type Finger =
  | 'LPinky'
  | 'LRing'
  | 'LMiddle'
  | 'LIndex'
  | 'LThumb'
  | 'RThumb'
  | 'RIndex'
  | 'RMiddle'
  | 'RRing'
  | 'RPinky';

export type FingerGroup = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';

export interface FingerColor {
  /** Subtle key tint shown at rest. */
  tint: string;
  /** Strong fill used when a key is the next target. */
  active: string;
  /** Ring colour paired with the active fill. */
  ring: string;
  /** Solid swatch colour for the legend. */
  dot: string;
}

export const FINGER_COLORS: Record<FingerGroup, FingerColor> = {
  pinky: {
    tint: 'bg-pink-100 dark:bg-pink-500/15',
    active: 'bg-pink-500 text-white',
    ring: 'ring-pink-300 dark:ring-pink-400',
    dot: 'bg-pink-500',
  },
  ring: {
    tint: 'bg-amber-100 dark:bg-amber-500/15',
    active: 'bg-amber-500 text-white',
    ring: 'ring-amber-300 dark:ring-amber-400',
    dot: 'bg-amber-500',
  },
  middle: {
    tint: 'bg-emerald-100 dark:bg-emerald-500/15',
    active: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-300 dark:ring-emerald-400',
    dot: 'bg-emerald-500',
  },
  index: {
    tint: 'bg-sky-100 dark:bg-sky-500/15',
    active: 'bg-sky-500 text-white',
    ring: 'ring-sky-300 dark:ring-sky-400',
    dot: 'bg-sky-500',
  },
  thumb: {
    tint: 'bg-slate-200 dark:bg-slate-600/30',
    active: 'bg-slate-500 text-white',
    ring: 'ring-slate-300 dark:ring-slate-400',
    dot: 'bg-slate-500',
  },
};

export interface FingerInfo {
  label: string;
  hand: 'left' | 'right';
  group: FingerGroup;
}

export const FINGER_INFO: Record<Finger, FingerInfo> = {
  LPinky: { label: 'Venstre lillefinger', hand: 'left', group: 'pinky' },
  LRing: { label: 'Venstre ringfinger', hand: 'left', group: 'ring' },
  LMiddle: { label: 'Venstre langfinger', hand: 'left', group: 'middle' },
  LIndex: { label: 'Venstre pegefinger', hand: 'left', group: 'index' },
  LThumb: { label: 'Tommelfinger', hand: 'left', group: 'thumb' },
  RThumb: { label: 'Tommelfinger', hand: 'right', group: 'thumb' },
  RIndex: { label: 'Højre pegefinger', hand: 'right', group: 'index' },
  RMiddle: { label: 'Højre langfinger', hand: 'right', group: 'middle' },
  RRing: { label: 'Højre ringfinger', hand: 'right', group: 'ring' },
  RPinky: { label: 'Højre lillefinger', hand: 'right', group: 'pinky' },
};

export function colorForFinger(finger: Finger): FingerColor {
  return FINGER_COLORS[FINGER_INFO[finger].group];
}

/** Legend entries, ordered left-to-right as the hands sit on the keyboard. */
export const LEGEND: { group: FingerGroup; label: string }[] = [
  { group: 'pinky', label: 'Lillefinger' },
  { group: 'ring', label: 'Ringfinger' },
  { group: 'middle', label: 'Langfinger' },
  { group: 'index', label: 'Pegefinger' },
  { group: 'thumb', label: 'Tommelfinger' },
];
