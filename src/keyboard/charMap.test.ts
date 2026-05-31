import { describe, it, expect } from 'vitest';
import { findKey } from './charMap';

describe('findKey', () => {
  it('maps lowercase letters to their physical key without Shift', () => {
    expect(findKey('a')).toEqual({ code: 'KeyA', shift: false });
    expect(findKey('j')).toEqual({ code: 'KeyJ', shift: false });
  });

  it('maps uppercase letters to the same key with Shift', () => {
    expect(findKey('A')).toEqual({ code: 'KeyA', shift: true });
  });

  it('maps Danish letters æ ø å', () => {
    expect(findKey('æ')).toEqual({ code: 'Semicolon', shift: false });
    expect(findKey('ø')).toEqual({ code: 'Quote', shift: false });
    expect(findKey('å')).toEqual({ code: 'BracketLeft', shift: false });
    expect(findKey('Å')).toEqual({ code: 'BracketLeft', shift: true });
  });

  it('maps space to the spacebar', () => {
    expect(findKey(' ')).toEqual({ code: 'Space', shift: false });
  });

  it('maps shifted symbols on the Danish layout', () => {
    expect(findKey('!')).toEqual({ code: 'Digit1', shift: true });
    expect(findKey('/')).toEqual({ code: 'Digit7', shift: true });
  });

  it('returns null for unknown characters', () => {
    expect(findKey('€')).toBeNull();
  });
});
