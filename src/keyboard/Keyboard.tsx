import {
  colorForFinger,
  FINGER_COLORS,
  FINGER_INFO,
  LEGEND,
} from './fingers';
import { DANISH_QWERTY, KEY_BY_CODE } from './layout';

interface KeyboardProps {
  /** Physical key to highlight as the next target. */
  nextCode?: string | null;
  /** Whether the next key requires Shift (highlights the opposite Shift). */
  nextShift?: boolean;
}

/** Which Shift key to highlight: the hand opposite the target key. */
function shiftCodeFor(nextCode: string | null | undefined, nextShift: boolean) {
  if (!nextShift || !nextCode) return null;
  const key = KEY_BY_CODE.get(nextCode);
  if (!key) return null;
  return FINGER_INFO[key.finger].hand === 'left' ? 'ShiftRight' : 'ShiftLeft';
}

export function Keyboard({ nextCode, nextShift = false }: KeyboardProps) {
  const shiftCode = shiftCodeFor(nextCode, nextShift);

  return (
    <div className="w-full select-none space-y-1.5">
      {DANISH_QWERTY.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const highlighted = key.code === nextCode || key.code === shiftCode;
            const colors = colorForFinger(key.finger);
            return (
              <div
                key={key.code}
                style={{ flexGrow: key.width ?? 1, flexBasis: 0 }}
                className={[
                  'relative flex h-11 items-end justify-center rounded-md border text-sm font-medium transition-transform sm:h-12',
                  'border-slate-300 dark:border-slate-700',
                  highlighted
                    ? `${colors.active} z-10 scale-105 shadow-md ring-2 ring-offset-1 ${colors.ring} dark:ring-offset-slate-900`
                    : colors.tint,
                ].join(' ')}
              >
                {key.shiftLabel && (
                  <span className="absolute left-1 top-0.5 text-[0.6rem] opacity-70">
                    {key.shiftLabel}
                  </span>
                )}
                <span className="pb-1">{key.label}</span>
                {key.homeAnchor && (
                  <span className="absolute bottom-1.5 h-0.5 w-3 rounded-full bg-current opacity-60" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Colour key explaining which finger each colour represents. */
export function FingerLegend() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
      {LEGEND.map(({ group, label }) => (
        <li key={group} className="flex items-center gap-1.5">
          <span
            className={`inline-block h-3 w-3 rounded-full ${FINGER_COLORS[group].dot}`}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
