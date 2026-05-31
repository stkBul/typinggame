import { createContext, useContext } from 'react';
import type { LessonResult, ProgressData } from './types';

export interface ProgressContextValue {
  progress: ProgressData;
  recordResult: (result: LessonResult) => void;
  reset: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
