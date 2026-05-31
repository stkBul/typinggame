import { describe, it, expect } from 'vitest';
import { PASSAGES, randomPassage } from './passages';
import { findKey } from '../keyboard/charMap';

describe('passages', () => {
  it('has several non-trivial passages', () => {
    expect(PASSAGES.length).toBeGreaterThanOrEqual(3);
    for (const p of PASSAGES) {
      expect(p.title.length).toBeGreaterThan(0);
      // Long enough that a minute of typing won't usually finish it.
      expect(p.text.length).toBeGreaterThan(300);
    }
  });

  it('only uses characters typeable on the Danish layout', () => {
    for (const p of PASSAGES) {
      for (const char of p.text) {
        expect(findKey(char), `"${char}" in «${p.title}»`).not.toBeNull();
      }
    }
  });

  it('randomPassage avoids repeating the excluded title', () => {
    const title = PASSAGES[0].title;
    for (let i = 0; i < 20; i++) {
      expect(randomPassage(title).title).not.toBe(title);
    }
  });
});
