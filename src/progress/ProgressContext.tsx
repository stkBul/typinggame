import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  applyGameScore,
  applyResult,
  clearProgress,
  loadProgress,
  saveProgress,
} from './store';
import { ProgressContext } from './context';
import type { LessonResult, ProgressData } from './types';

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Load once, lazily, from localStorage.
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  const recordResult = useCallback((result: LessonResult) => {
    setProgress((prev) => {
      const next = applyResult(prev, result);
      saveProgress(next);
      return next;
    });
  }, []);

  const recordGameScore = useCallback((score: number) => {
    setProgress((prev) => {
      const next = applyGameScore(prev, score);
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    clearProgress();
    setProgress(loadProgress());
  }, []);

  const value = useMemo(
    () => ({ progress, recordResult, recordGameScore, reset }),
    [progress, recordResult, recordGameScore, reset],
  );

  return <ProgressContext value={value}>{children}</ProgressContext>;
}
