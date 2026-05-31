import { useEffect, useRef, useState } from 'react';
import { useTypingEngine } from '../engine/useTypingEngine';
import type { TypingStats } from '../engine/stats';
import { findKey } from '../keyboard/charMap';
import { FINGER_INFO } from '../keyboard/fingers';
import { KEY_BY_CODE } from '../keyboard/layout';
import { Keyboard, FingerLegend } from '../keyboard/Keyboard';
import { useSound } from '../sound/useSound';
import DrillText from './DrillText';

const LAYOUT_WARN_KEY = 'tastetrup.layoutWarnDismissed';

interface TypingTrainerProps {
  /** The text to practise. Single line; spaces are part of the drill. */
  text: string;
  /** Called once when the drill is finished, with its final stats. */
  onComplete?: (stats: TypingStats) => void;
  /**
   * Show spaces as ␣ (good for short key/word drills) vs. real spaces, which
   * let long prose wrap at word boundaries instead of overflowing.
   */
  spaceGlyph?: boolean;
}

export default function TypingTrainer({
  text,
  onComplete,
  spaceGlyph = true,
}: TypingTrainerProps) {
  const { state, stats, nextChar, type, backspace } = useTypingEngine(text);
  const sound = useSound();
  const [focused, setFocused] = useState(false);
  const [layoutWarn, setLayoutWarn] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const reportedRef = useRef(false);

  const nextTarget = nextChar ? findKey(nextChar) : null;

  // Focus the typing area whenever a new drill loads.
  useEffect(() => {
    reportedRef.current = false;
    areaRef.current?.focus();
  }, [text]);

  // Keep the character being typed in view inside the scrollable box.
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [state.cursor]);

  // Report completion exactly once, with the frozen final stats, and celebrate.
  useEffect(() => {
    if (state.status === 'finished' && !reportedRef.current) {
      reportedRef.current = true;
      sound.success();
      onComplete?.(stats);
    }
  }, [state.status, stats, onComplete, sound]);

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
      if (nextChar !== null) {
        if (e.key === nextChar) {
          sound.correct();
        } else {
          sound.error();
          // Right physical key but wrong character => OS layout isn't Danish.
          if (
            nextTarget &&
            e.code === nextTarget.code &&
            sessionStorage.getItem(LAYOUT_WARN_KEY) !== '1'
          ) {
            setLayoutWarn(true);
          }
        }
      }
      type(e.key);
    }
  }

  function dismissLayoutWarn() {
    setLayoutWarn(false);
    try {
      sessionStorage.setItem(LAYOUT_WARN_KEY, '1');
    } catch {
      // ignore
    }
  }

  const nextFinger = nextTarget
    ? KEY_BY_CODE.get(nextTarget.code)?.finger
    : undefined;
  const isFinished = state.status === 'finished';

  return (
    <div className="space-y-4">
      {layoutWarn && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="text-lg">⚠️</span>
          <p className="flex-1">
            Det ser ud til, at dit tastatur ikke er sat til <strong>dansk</strong>
            . Skift til dansk tastaturlayout i din computers indstillinger for at
            kunne skrive æ, ø og å.
          </p>
          <button
            type="button"
            onClick={dismissLayoutWarn}
            className="font-medium underline hover:no-underline"
          >
            OK
          </button>
        </div>
      )}

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
          'max-h-[40vh] cursor-text overflow-y-auto rounded-xl border-2 bg-white p-4 font-mono text-2xl leading-relaxed tracking-wide outline-none [overflow-wrap:anywhere] dark:bg-slate-900',
          focused
            ? 'border-indigo-500'
            : 'border-slate-200 dark:border-slate-700',
        ].join(' ')}
      >
        <DrillText
          text={text}
          typed={state.typed}
          cursor={state.cursor}
          focused={focused}
          spaceGlyph={spaceGlyph}
          currentRef={cursorRef}
        />
      </div>

      {/* Prompt */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {isFinished ? (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            ✓ Øvelse fuldført
          </span>
        ) : !focused ? (
          'Klik på feltet ovenfor for at begynde.'
        ) : nextFinger ? (
          <>
            Næste: <strong>{FINGER_INFO[nextFinger].label}</strong>
            {nextTarget?.shift && ' (+ Shift)'}
          </>
        ) : (
          'Begynd at skrive…'
        )}
      </p>

      {/* On-screen keyboard */}
      <div className="rounded-xl border border-slate-200 bg-slate-100/60 p-2 dark:border-slate-700 dark:bg-slate-800/40">
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
