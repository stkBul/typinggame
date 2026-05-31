import { describe, it, expect } from 'vitest';
import { createInitialState, engineReducer } from './reducer';

describe('engineReducer', () => {
  it('starts idle', () => {
    const s = createInitialState('ab');
    expect(s.status).toBe('idle');
    expect(s.cursor).toBe(0);
    expect(s.startedAt).toBeNull();
  });

  it('advances on a correct keystroke and starts the clock', () => {
    let s = createInitialState('ab');
    s = engineReducer(s, { type: 'type', char: 'a', time: 100 });
    expect(s.status).toBe('running');
    expect(s.cursor).toBe(1);
    expect(s.typed).toBe('a');
    expect(s.startedAt).toBe(100);
    expect(s.keystrokes[0]).toMatchObject({ actual: 'a', correct: true });
  });

  it('records incorrect keystrokes', () => {
    let s = createInitialState('ab');
    s = engineReducer(s, { type: 'type', char: 'x', time: 1 });
    expect(s.keystrokes[0]).toMatchObject({ expected: 'a', correct: false });
    expect(s.cursor).toBe(1);
  });

  it('finishes when the last character is typed', () => {
    let s = createInitialState('ab');
    s = engineReducer(s, { type: 'type', char: 'a', time: 1 });
    s = engineReducer(s, { type: 'type', char: 'b', time: 5 });
    expect(s.status).toBe('finished');
    expect(s.finishedAt).toBe(5);
  });

  it('ignores typing after finishing', () => {
    let s = createInitialState('a');
    s = engineReducer(s, { type: 'type', char: 'a', time: 1 });
    const after = engineReducer(s, { type: 'type', char: 'b', time: 2 });
    expect(after).toBe(s);
  });

  it('backspace moves the cursor back but keeps keystroke history', () => {
    let s = createInitialState('ab');
    s = engineReducer(s, { type: 'type', char: 'a', time: 1 });
    s = engineReducer(s, { type: 'backspace' });
    expect(s.cursor).toBe(0);
    expect(s.typed).toBe('');
    expect(s.keystrokes).toHaveLength(1);
  });

  it('backspace at the start is a no-op', () => {
    const s = createInitialState('ab');
    expect(engineReducer(s, { type: 'backspace' })).toBe(s);
  });

  it('reset clears state and can swap the target', () => {
    let s = createInitialState('ab');
    s = engineReducer(s, { type: 'type', char: 'a', time: 1 });
    s = engineReducer(s, { type: 'reset', target: 'xyz' });
    expect(s.target).toBe('xyz');
    expect(s.cursor).toBe(0);
    expect(s.keystrokes).toHaveLength(0);
    expect(s.status).toBe('idle');
  });
});
