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
  // Smooth 0..1 fraction of the minute still left, for the clock sweep.
  const remainingFrac =
    startedAt === null ? 1 : Math.max(0, 1 - elapsed / DURATION_MS);

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
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Fri skrivning</h1>

        {/* Live gauges: countdown clock, speedometer, accuracy bar */}
        <dl className="flex items-center gap-5">
          <ClockGauge
            seconds={remaining}
            fraction={remainingFrac}
            warn={!done && remaining <= 10}
          />
          <SpeedGauge wpm={stats.wpm} />
          <AccuracyGauge accuracy={stats.accuracy} />
        </dl>
      </header>

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
            {Math.round(stats.accuracy * 100)}% præcision ({stats.correct}{' '}
            rigtige tegn).
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

/** Countdown ring that empties over the minute, with the seconds in the centre. */
function ClockGauge({
  seconds,
  fraction,
  warn,
}: {
  seconds: number;
  fraction: number;
  warn: boolean;
}) {
  const size = 58;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - fraction)}
            className={[
              'transition-[stroke-dashoffset] duration-200 ease-linear',
              warn ? 'stroke-red-500' : 'stroke-indigo-500',
            ].join(' ')}
          />
        </svg>
        <div
          className={[
            'absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums',
            warn ? 'text-red-600 dark:text-red-400' : '',
          ].join(' ')}
        >
          {seconds}s
        </div>
      </div>
    </div>
  );
}

/** Half-circle speedometer with a needle pointing at the current WPM. */
function SpeedGauge({ wpm }: { wpm: number }) {
  const max = 100;
  const frac = Math.min(1, wpm / max);
  const w = 86;
  const h = 48;
  const stroke = 6;
  const cx = w / 2;
  const cy = h - 3;
  const r = cx - stroke / 2 - 1;
  const arcLen = Math.PI * r;
  const track = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: w, height: h }}>
        <svg width={w} height={h}>
          <path
            d={track}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <path
            d={track}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={arcLen}
            strokeDashoffset={arcLen * (1 - frac)}
            className="stroke-indigo-500 transition-[stroke-dashoffset] duration-200 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center leading-none">
          <span className="text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {Math.round(wpm)}
          </span>
          <span className="text-[0.6rem] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            WPM
          </span>
        </div>
      </div>
    </div>
  );
}

/** Horizontal bar that fills with the accuracy percentage. */
function AccuracyGauge({ accuracy }: { accuracy: number }) {
  const pct = Math.round(accuracy * 100);
  const color =
    pct >= 95 ? 'bg-emerald-500' : pct >= 85 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="relative h-5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className={`h-full rounded-full transition-all duration-200 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
        {pct}%
      </span>
    </div>
  );
}
