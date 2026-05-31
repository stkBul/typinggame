import type { Ref } from 'react';

interface DrillTextProps {
  text: string;
  /** Characters typed so far (used to colour correct/incorrect). */
  typed: string;
  /** Index of the next character to type. */
  cursor: number;
  focused: boolean;
  /** Show spaces as ␣ (good for key drills) vs. real spaces (good for prose). */
  spaceGlyph?: boolean;
  /** Attached to the current character, so callers can scroll it into view. */
  currentRef?: Ref<HTMLSpanElement>;
}

/** Renders target text with per-character correct/incorrect/cursor styling. */
export default function DrillText({
  text,
  typed,
  cursor,
  focused,
  spaceGlyph = true,
  currentRef,
}: DrillTextProps) {
  return (
    <>
      {Array.from(text).map((char, i) => {
        const isCurrent = i === cursor;
        const isTyped = i < cursor;
        const correct = isTyped && typed[i] === char;
        const display = char === ' ' ? (spaceGlyph ? '␣' : ' ') : char;
        return (
          <span
            key={i}
            ref={isCurrent ? currentRef : undefined}
            className={[
              'rounded px-px',
              isCurrent && focused
                ? 'bg-indigo-200 underline decoration-2 underline-offset-4 dark:bg-indigo-500/40'
                : '',
              isTyped && correct ? 'text-emerald-600 dark:text-emerald-400' : '',
              isTyped && !correct
                ? 'bg-red-200 text-red-700 dark:bg-red-500/30 dark:text-red-300'
                : '',
              !isTyped && !isCurrent
                ? 'text-slate-400 dark:text-slate-500'
                : '',
            ].join(' ')}
          >
            {display}
          </span>
        );
      })}
    </>
  );
}
