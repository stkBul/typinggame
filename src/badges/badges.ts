import { LESSONS } from '../lessons/curriculum';
import type { ProgressData } from '../progress/types';

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface EarnedBadge extends Badge {
  earned: boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'first-pass',
    emoji: '🌟',
    title: 'Første skridt',
    description: 'Bestå din første lektion.',
  },
  {
    id: 'home-row',
    emoji: '🏠',
    title: 'Hjemmerække-mester',
    description: 'Bestå alle lektioner på niveau 1.',
  },
  {
    id: 'speedy',
    emoji: '⚡',
    title: 'Lynhurtig',
    description: 'Nå 30 WPM i en lektion.',
  },
  {
    id: 'accurate',
    emoji: '🎯',
    title: 'Skarpskytte',
    description: 'Få 100% præcision i en lektion.',
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: '3-dages stime',
    description: 'Træn 3 dage i træk.',
  },
  {
    id: 'all-lessons',
    emoji: '🏆',
    title: 'Fuldført',
    description: 'Bestå alle lektioner.',
  },
];

const SPEEDY_WPM = 30;

function isEarned(id: string, p: ProgressData): boolean {
  const records = Object.values(p.records);
  switch (id) {
    case 'first-pass':
      return records.some((r) => r.passed);
    case 'home-row':
      return LESSONS.filter((l) => l.level === 1).every(
        (l) => p.records[l.id]?.passed ?? false,
      );
    case 'speedy':
      return records.some((r) => r.bestWpm >= SPEEDY_WPM);
    case 'accurate':
      return records.some((r) => r.bestAccuracy >= 0.999);
    case 'streak-3':
      return p.streak.longest >= 3;
    case 'all-lessons':
      return LESSONS.every((l) => p.records[l.id]?.passed ?? false);
    default:
      return false;
  }
}

export function earnedBadges(p: ProgressData): EarnedBadge[] {
  return BADGES.map((b) => ({ ...b, earned: isEarned(b.id, p) }));
}

/** Ids of currently-earned badges (handy for diffing before/after a lesson). */
export function earnedBadgeIds(p: ProgressData): Set<string> {
  return new Set(BADGES.filter((b) => isEarned(b.id, p)).map((b) => b.id));
}
