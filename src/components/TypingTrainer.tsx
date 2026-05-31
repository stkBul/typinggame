import { useEffect, useRef, useState } from 'react';
import { useTypingEngine } from '../engine/useTypingEngine';
import { findKey } from '../keyboard/charMap';
import { FINGER_INFO } from '../keyboard/fingers';
import { KEY_BY_CODE } from '../keyboard/layout';
import { Keyboard, FingerLegend } from '../keyboard/Keyboard';

interface TypingTrainerProps {
  /** The text to practise. Single line; spaces are part of the drill. */
  text: string;
}

/** Render the drill text as a space so it stays visible and selectable. */
function displayChar(char: string): string {
  return char === ' ' ? '␣' : char;
}

export default function TypingTrainer({ text }: TypingTrainerProps) {
  const { state, stats, nextChar, type, backspace, reset } =
    useTypingEngine(text);
  const [focused, setFocused] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  // Focus the typing area whenever a new drill loads.
  useEffect(() => {
    areaRef.current?.focus();
  }, [text]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Leave browser/OS shortcuts alone.
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }
    // Single-line drills: ignore Enter; let Tab move focus normally.
    if (e.key === 'Enter' || e.key === 'Tab') return;

    if (e.key.length === 1) {
      e.preventDefault();
      type(e.key);
    }
  }

  const nextTarget = nextChar ? findKey(nextChar) : null;
  const nextFinger = nextTarget
    ? KEY_BY_CODE.get(nextTarget.code)?.finger
    : undefined;
  const isFinished = state.status === 'finished';

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <dl className="grid grid-cols-3 gap-3 text-center sm:grid-cols-4">
        <Stat label="WPM" value={Math.round(stats.wpm).toString()} />
        <Stat
          label="Præcision"
          value={`${Math.round(stats.accuracy * 100)}%`}
        />
        <Stat label="Fejl" value={stats.errors.toString()} />
        <Stat
          label="Tid"
          value={`${(stats.elapsedMs / 1000).toFixed(1)}s`}
          className="hidden sm:block"
        />
      </dl>

      {/* Typing area */}
      <div
        ref={areaRef}
        role="textbox"
        aria-label="Skriveøvelse"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          'cursor-text rounded-xl border-2 bg-white p-6 font-mono text-2xl leading-relaxed tracking-wide outline-none dark:bg-slate-900',
          focused
            ? 'border-indigo-500'
            : 'border-slate-200 dark:border-slate-700',
        ].join(' ')}
      >
        {Array.from(text).map((char, i) => {
          const isCurrent = i === state.cursor;
          const isTyped = i < state.cursor;
          const correct = isTyped && state.typed[i] === char;
          return (
            <span
              key={i}
              className={[
                'rounded px-px',
                isCurrent && focused
                  ? 'bg-indigo-200 underline decoration-2 underline-offset-4 dark:bg-indigo-500/40'
                  : '',
                isTyped && correct
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : '',
                isTyped && !correct
                  ? 'bg-red-200 text-red-700 dark:bg-red-500/30 dark:text-red-300'
                  : '',
                !isTyped && !isCurrent
                  ? 'text-slate-400 dark:text-slate-500'
                  : '',
              ].join(' ')}
            >
              {displayChar(char)}
            </span>
          );
        })}
      </div>

      {/* Prompt / completion */}
      {isFinished ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-emerald-50 p-5 text-center dark:bg-emerald-500/10">
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
            🎉 Flot! Du skrev {Math.round(stats.wpm)} ord/min med{' '}
            {Math.round(stats.accuracy * 100)}% præcision.
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              areaRef.current?.focus();
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Prøv igen
          </button>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {focused ? (
            nextFinger ? (
              <>
                Næste: <strong>{FINGER_INFO[nextFinger].label}</strong>
                {nextTarget?.shift && ' (+ Shift)'}
              </>
            ) : (
              'Begynd at skrive…'
            )
          ) : (
            'Klik på feltet ovenfor for at begynde.'
          )}
        </p>
      )}

      {/* On-screen keyboard */}
      <div className="rounded-xl border border-slate-200 bg-slate-100/60 p-3 dark:border-slate-700 dark:bg-slate-800/40">
        <Keyboard
          nextCode={focused ? nextTarget?.code : null}
          nextShift={nextTarget?.shift ?? false}
        />
      </div>
      <FingerLegend />
    </div>
  );
}

function Stat({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800 ${className}`}
    >
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}
