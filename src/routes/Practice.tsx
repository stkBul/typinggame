import { useEffect, useRef, useState } from 'react';
import { computeStats } from '../engine/stats';
import { useTypingEngine } from '../engine/useTypingEngine';
import { findKey } from '../keyboard/charMap';
import { FINGER_INFO } from '../keyboard/fingers';
import { KEY_BY_CODE } from '../keyboard/layout';
import { Keyboard, FingerLegend } from '../keyboard/Keyboard';
import DrillText from '../components/DrillText';
import { randomPassage } from '../practice/passages';
import { useSound } from '../sound/useSound';

const DURATION_MS = 60_000;

export default function Practice() {
  const [passage, setPassage] = useState(() => randomPassage());
  const { state, nextChar, type, backspace, reset } = useTypingEngine(
    passage.text,
  );
  const sound = useSound();
  const [now, setNow] = useState(() => Date.now());
  const [focused, setFocused] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const celebratedRef = useRef(false);

  const startedAt = state.startedAt;
  const finishedEarly = state.status === 'finished';
  const elapsed = startedAt === null ? 0 : now - startedAt;
  const timeUp = startedAt !== null && elapsed >= DURATION_MS;
  const done = timeUp || finishedEarly;

  // Tick the clock while the test is running.
  useEffect(() => {
    if (startedAt === null || done) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [startedAt, done]);

  // Celebrate once when the minute is up (or the text is finished).
  useEffect(() => {
    if (done && !celebratedRef.current) {
      celebratedRef.current = true;
      sound.success();
    }
  }, [done, sound]);

  // Focus the typing area on load and whenever a new passage is drawn.
  useEffect(() => {
    areaRef.current?.focus();
  }, [passage]);

  // Keep the character you're typing visible inside the scrollable text box.
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [state.cursor]);

  // Freeze stats at the finish point; otherwise tick live, capped at 1 min.
  const endpoint = finishedEarly
    ? (state.finishedAt ?? now)
    : startedAt !== null
      ? Math.min(now, startedAt + DURATION_MS)
      : now;
  const stats = computeStats(state.keystrokes, startedAt, endpoint);
  const remaining =
    startedAt === null
      ? DURATION_MS / 1000
      : Math.max(0, Math.ceil((startedAt + DURATION_MS - now) / 1000));

  const nextTarget = !done && nextChar ? findKey(nextChar) : null;
  const nextFinger = nextTarget
    ? KEY_BY_CODE.get(nextTarget.code)?.finger
    : undefined;

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (done) {
      if (e.key.length === 1 || e.key === 'Backspace') e.preventDefault();
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab') return;
    if (e.key.length === 1) {
      e.preventDefault();
      if (nextChar !== null) {
        if (e.key === nextChar) sound.correct();
        else sound.error();
      }
      type(e.key);
    }
  }

  function restart() {
    const next = randomPassage(passage.title);
    celebratedRef.current = false;
    setNow(Date.now());
    setPassage(next);
    reset(next.text);
    requestAnimationFrame(() => areaRef.current?.focus());
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Fri skrivning</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Skriv så meget du kan på ét minut. Vi måler din hastighed på et
          tilfældigt uddrag fra H.C. Andersen.
        </p>
      </header>

      {/* Stats / timer */}
      <dl className="grid grid-cols-3 gap-3 text-center">
        <Stat
          label="Tid tilbage"
          value={`${remaining}s`}
          highlight={!done && remaining <= 10}
        />
        <Stat label="WPM" value={Math.round(stats.wpm).toString()} />
        <Stat label="Præcision" value={`${Math.round(stats.accuracy * 100)}%`} />
      </dl>

      {/* Typing area */}
      <div
        ref={areaRef}
        role="textbox"
        aria-label="Hastighedstest"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          'max-h-[30vh] cursor-text overflow-y-auto rounded-xl border-2 bg-white p-4 font-mono text-lg leading-relaxed tracking-wide outline-none dark:bg-slate-900',
          done ? 'opacity-70' : '',
          focused
            ? 'border-indigo-500'
            : 'border-slate-200 dark:border-slate-700',
        ].join(' ')}
      >
        <DrillText
          text={passage.text}
          typed={state.typed}
          cursor={state.cursor}
          focused={focused && !done}
          spaceGlyph={false}
          currentRef={cursorRef}
        />
      </div>

      <p className="text-right text-xs text-slate-400 dark:text-slate-500">
        Uddrag fra «{passage.title}» af H.C. Andersen
      </p>

      {done ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-500/10">
          <p className="text-5xl">⏱️</p>
          <h2 className="text-2xl font-bold">Tiden er gået!</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Du skrev <strong>{Math.round(stats.wpm)} ord i minuttet</strong> med{' '}
            {Math.round(stats.accuracy * 100)}% præcision ({stats.correct} rigtige
            tegn).
          </p>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Prøv igen med ny tekst
          </button>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {!focused ? (
            'Klik på feltet ovenfor og begynd at skrive — uret starter ved første tast.'
          ) : nextFinger ? (
            <>
              Næste: <strong>{FINGER_INFO[nextFinger].label}</strong>
              {nextTarget?.shift && ' (+ Shift)'}
            </>
          ) : (
            'Begynd at skrive…'
          )}
        </p>
      )}

      {!done && (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-100/60 p-2 dark:border-slate-700 dark:bg-slate-800/40">
            <Keyboard
              nextCode={focused ? nextTarget?.code : null}
              nextShift={nextTarget?.shift ?? false}
            />
          </div>
          <FingerLegend />
        </>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-lg px-3 py-2',
        highlight
          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
          : 'bg-slate-100 dark:bg-slate-800',
      ].join(' ')}
    >
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}
