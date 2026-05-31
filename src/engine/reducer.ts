import type { Keystroke } from './stats';

export type EngineStatus = 'idle' | 'running' | 'finished';

export interface EngineState {
  /** Text the learner is typing. */
  target: string;
  /** Index of the next character to type. */
  cursor: number;
  /** Characters typed so far (mirrors the visible progress). */
  typed: string;
  /** Full keystroke log, used for stats. Preserved across backspaces. */
  keystrokes: Keystroke[];
  startedAt: number | null;
  finishedAt: number | null;
  status: EngineStatus;
}

export type EngineAction =
  | { type: 'type'; char: string; time: number }
  | { type: 'backspace' }
  | { type: 'reset'; target?: string };

export function createInitialState(target: string): EngineState {
  return {
    target,
    cursor: 0,
    typed: '',
    keystrokes: [],
    startedAt: null,
    finishedAt: null,
    status: 'idle',
  };
}

export function engineReducer(
  state: EngineState,
  action: EngineAction,
): EngineState {
  switch (action.type) {
    case 'type': {
      if (state.status === 'finished') return state;
      const expected = state.target[state.cursor] ?? '';
      const keystroke: Keystroke = {
        expected,
        actual: action.char,
        correct: action.char === expected,
        time: action.time,
      };
      const cursor = state.cursor + 1;
      const finished = cursor >= state.target.length;
      return {
        ...state,
        cursor,
        typed: state.typed + action.char,
        keystrokes: [...state.keystrokes, keystroke],
        startedAt: state.startedAt ?? action.time,
        finishedAt: finished ? action.time : null,
        status: finished ? 'finished' : 'running',
      };
    }
    case 'backspace': {
      if (state.status === 'finished' || state.cursor === 0) return state;
      // Keystroke history is intentionally kept so accuracy reflects mistakes.
      return {
        ...state,
        cursor: state.cursor - 1,
        typed: state.typed.slice(0, -1),
      };
    }
    case 'reset':
      return createInitialState(action.target ?? state.target);
    default:
      return state;
  }
}
