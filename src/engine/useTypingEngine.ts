import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  createInitialState,
  engineReducer,
  type EngineState,
} from './reducer';
import { computeStats, type TypingStats } from './stats';

export interface TypingEngine {
  state: EngineState;
  stats: TypingStats;
  /** Next character to type, or null when finished. */
  nextChar: string | null;
  type: (char: string) => void;
  backspace: () => void;
  reset: (target?: string) => void;
}

/** Drives a single typing drill: keystroke handling, progress, and live stats. */
export function useTypingEngine(target: string): TypingEngine {
  const [state, dispatch] = useReducer(
    engineReducer,
    target,
    createInitialState,
  );
  const [now, setNow] = useState(() => Date.now());

  // Restart the drill whenever the target text changes.
  useEffect(() => {
    dispatch({ type: 'reset', target });
  }, [target]);

  // Tick the clock while running so WPM/elapsed update live.
  useEffect(() => {
    if (state.status !== 'running') return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [state.status]);

  const endpoint = state.finishedAt ?? now;
  const stats = computeStats(state.keystrokes, state.startedAt, endpoint);

  const type = useCallback((char: string) => {
    const time = Date.now();
    setNow(time);
    dispatch({ type: 'type', char, time });
  }, []);

  const backspace = useCallback(() => dispatch({ type: 'backspace' }), []);

  const reset = useCallback(
    (t?: string) => dispatch({ type: 'reset', target: t }),
    [],
  );

  const nextChar =
    state.cursor < state.target.length ? state.target[state.cursor] : null;

  return { state, stats, nextChar, type, backspace, reset };
}
