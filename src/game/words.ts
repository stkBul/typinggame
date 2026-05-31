import type { Rng } from './types';
import { levelIndex } from './difficulty';

// Single letters reachable on the Danish keyboard — the easy targets that
// dominate the early game.
const LETTERS = [
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ', 'ø', 'å',
  'e', 'r', 't', 'u', 'i', 'o', 'p', 'n', 'm', 'v', 'b', 'y',
];

// Short, kid-friendly Danish words, all lower-case and typeable on the
// Danish layout. Mixed in as the game speeds up.
const WORDS = [
  'sol', 'is', 'ko', 'hus', 'bil', 'kat', 'tog', 'ged', 'mus', 'leg',
  'dag', 'sø', 'træ', 'bær', 'far', 'mor', 'ven', 'bog', 'fisk', 'bold',
  'måne', 'stol', 'glad', 'ost', 'hat', 'æg', 'øl', 'ben', 'arm', 'rød',
  'blå', 'gul', 'grøn', 'top', 'hop', 'løb', 'rat', 'sav', 'nøgle', 'fugl',
];

function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Choose the next balloon target. Early on it's all single letters; as the
 * level climbs, whole words appear more and more often.
 */
export function pickTarget(elapsedMs: number, rng: Rng): string {
  const level = levelIndex(elapsedMs); // 0-based
  // 0% words at level 0, then +12% per level up to a 60% ceiling.
  const wordChance = Math.min(0.6, level * 0.12);
  return rng() < wordChance ? pick(WORDS, rng) : pick(LETTERS, rng);
}
