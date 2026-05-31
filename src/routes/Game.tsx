import { useEffect, useRef, useState } from 'react';
import { createGame, startGame, tick, typeChar } from '../game/engine';
import { MAX_LIVES, levelNumber } from '../game/difficulty';
import type { Balloon, GameState } from '../game/types';
import { useProgress } from '../progress/context';
import { useSettings } from '../settings/context';
import { useSound } from '../sound/useSound';

// Cap the per-frame delta so a backgrounded tab doesn't teleport balloons
// to the ground when it wakes up.
const MAX_DT_MS = 100;

export default function Game() {
  const { settings } = useSettings();
  const { progress, recordGameScore } = useProgress();
  const sound = useSound();
  const isKid = settings.mode === 'kid';

  // `state` drives rendering; the loop and handler update it with functional
  // updaters, so they always see the latest state without stale closures.
  const [state, setState] = useState<GameState>(createGame);
  // A mirror of the latest state, read only inside the keydown handler (never
  // during render) so we can decide which sound to play.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });
  const lastFrameRef = useRef(0);
  const recordedRef = useRef(false);
  const areaRef = useRef<HTMLDivElement>(null);

  // One rAF loop for the lifetime of the component; it only advances the
  // simulation while a round is in progress (otherwise the updater bails out).
  useEffect(() => {
    let raf = 0;
    function frame(t: number) {
      const last = lastFrameRef.current || t;
      const dt = Math.min(MAX_DT_MS, t - last);
      lastFrameRef.current = t;
      if (dt > 0) {
        setState((prev) =>
          prev.status === 'playing' ? tick(prev, dt, Math.random) : prev,
        );
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Save the score and celebrate exactly once when a round ends.
  useEffect(() => {
    if (state.status === 'over' && !recordedRef.current) {
      recordedRef.current = true;
      recordGameScore(state.score);
      sound.success();
    }
  }, [state.status, state.score, recordGameScore, sound]);

  function start() {
    recordedRef.current = false;
    lastFrameRef.current = 0;
    setState(startGame());
    areaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === ' ') e.preventDefault(); // don't scroll the page
    if (stateRef.current.status !== 'playing' || e.key.length !== 1) return;
    e.preventDefault();
    const { state: next, result } = typeChar(stateRef.current, e.key);
    stateRef.current = next;
    setState(next);
    if (result === 'miss') sound.error();
    else sound.correct();
  }

  const beatBest = state.status === 'over' && state.score >= progress.gameBest;

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🎈 Ballonspil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Skyd ballonerne ned ved at skrive bogstaverne og ordene, før de
            lander!
          </p>
        </div>
        <dl className="flex items-center gap-5 text-center">
          <Stat label="Point" value={state.score.toString()} />
          <Stat label="Rekord" value={progress.gameBest.toString()} />
          <Stat label="Niveau" value={levelNumber(state.elapsedMs).toString()} />
          <Lives lives={state.lives} />
        </dl>
      </header>

      <div
        ref={areaRef}
        role="application"
        aria-label="Ballonspil"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative h-[60vh] w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-sky-100 to-indigo-100 outline-none focus:border-indigo-500 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
      >
        {state.balloons.map((b) => (
          <BalloonView key={b.id} balloon={b} locked={b.id === state.lockedId} />
        ))}

        {/* Ground line the balloons must not reach. */}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-500/70" />

        {state.status !== 'playing' && (
          <Overlay
            status={state.status}
            score={state.score}
            best={progress.gameBest}
            beatBest={beatBest}
            isKid={isKid}
            onStart={start}
          />
        )}
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Tip: Når du begynder på et ord, skal du skrive det færdigt — den nederste
        ballon rammes først.
      </p>
    </section>
  );
}

/** A single balloon, positioned by its (x, y) fraction within the play area. */
function BalloonView({ balloon, locked }: { balloon: Balloon; locked: boolean }) {
  const done = balloon.word.slice(0, balloon.typed);
  const rest = balloon.word.slice(balloon.typed);
  return (
    <div
      className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${balloon.x * 100}%`, top: `${balloon.y * 100}%` }}
    >
      <div
        className={[
          'flex min-w-9 items-center justify-center rounded-[50%] px-3 py-3 font-mono text-lg font-bold shadow-md transition-shadow',
          locked ? 'ring-4 ring-white/80' : '',
        ].join(' ')}
        style={{
          background: `radial-gradient(circle at 35% 30%, hsl(${balloon.hue} 90% 75%), hsl(${balloon.hue} 75% 50%))`,
        }}
      >
        <span className="text-emerald-900">{done}</span>
        <span className="text-slate-900">{rest}</span>
      </div>
      {/* The little string under the balloon. */}
      <div className="h-3 w-px bg-slate-500/60" />
    </div>
  );
}

function Overlay({
  status,
  score,
  best,
  beatBest,
  isKid,
  onStart,
}: {
  status: 'idle' | 'over';
  score: number;
  best: number;
  beatBest: boolean;
  isKid: boolean;
  onStart: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/70 text-center backdrop-blur-sm dark:bg-slate-950/70">
      {status === 'idle' ? (
        <>
          <p className="text-6xl">🎈</p>
          <h2 className="text-2xl font-bold">
            {isKid ? 'Klar til at skyde balloner?' : 'Ballonspil'}
          </h2>
          <p className="max-w-md text-slate-600 dark:text-slate-300">
            Balloner falder ned med et bogstav eller et ord. Skriv det for at
            skyde dem — det går hurtigere og hurtigere. Du har {MAX_LIVES} liv!
          </p>
        </>
      ) : (
        <>
          <p className="text-6xl">{beatBest ? '🏆' : '💥'}</p>
          <h2 className="text-2xl font-bold">
            {beatBest ? 'Ny rekord!' : 'Spillet er slut'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Du fik <strong>{score} point</strong>.
            {!beatBest && best > 0 && ` Din rekord er ${best}.`}
          </p>
        </>
      )}
      <button
        type="button"
        onClick={onStart}
        className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        {status === 'idle' ? 'Start spillet' : 'Spil igen'}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}

function Lives({ lives }: { lives: number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Liv
      </dt>
      <dd className="text-xl leading-8" aria-label={`${lives} liv tilbage`}>
        {Array.from({ length: MAX_LIVES }, (_, i) => (
          <span key={i} className={i < lives ? '' : 'opacity-25 grayscale'}>
            ❤️
          </span>
        ))}
      </dd>
    </div>
  );
}
