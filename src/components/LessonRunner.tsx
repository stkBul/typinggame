import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { aggregateStats, type TypingStats } from '../engine/stats';
import { getNextLesson } from '../lessons/curriculum';
import { useProgress } from '../progress/context';
import type { Drill, Lesson } from '../lessons/types';
import TypingTrainer from './TypingTrainer';

interface LessonRunnerProps {
  lesson: Lesson;
}

const DRILL_KIND_LABEL: Record<Drill['kind'], string> = {
  keys: 'Taster',
  words: 'Ord',
  sentence: 'Sætning',
};

export default function LessonRunner({ lesson }: LessonRunnerProps) {
  const { recordResult } = useProgress();
  const [drillIndex, setDrillIndex] = useState(0);
  const [results, setResults] = useState<TypingStats[]>([]);
  const recordedRef = useRef(false);

  const drill = lesson.drills[drillIndex];
  const isLastDrill = drillIndex === lesson.drills.length - 1;
  const lessonDone = results.length === lesson.drills.length;

  function handleDrillComplete(stats: TypingStats) {
    setResults((prev) => [...prev, stats]);
  }

  function restart() {
    setResults([]);
    setDrillIndex(0);
  }

  // Persist the lesson outcome once, when all drills are done.
  useEffect(() => {
    if (!lessonDone) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    const total = aggregateStats(results);
    recordResult({
      lessonId: lesson.id,
      wpm: total.wpm,
      accuracy: total.accuracy,
      passed:
        total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy,
    });
  }, [lessonDone, results, lesson, recordResult]);

  if (lessonDone) {
    return (
      <LessonSummary lesson={lesson} results={results} onRetry={restart} />
    );
  }

  // The just-finished drill awaits the "next" action before advancing.
  const justFinished = results.length === drillIndex + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Øvelse {drillIndex + 1} af {lesson.drills.length} ·{' '}
          {DRILL_KIND_LABEL[drill.kind]}
        </p>
        <div className="flex gap-1">
          {lesson.drills.map((d, i) => (
            <span
              key={d.id}
              className={[
                'h-1.5 w-8 rounded-full',
                i < results.length
                  ? 'bg-emerald-500'
                  : i === drillIndex
                    ? 'bg-indigo-500'
                    : 'bg-slate-200 dark:bg-slate-700',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* key forces a fresh engine per drill */}
      <TypingTrainer
        key={drill.id}
        text={drill.text}
        onComplete={handleDrillComplete}
      />

      {justFinished && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDrillIndex((i) => i + 1)}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            {isLastDrill ? 'Se resultat' : 'Næste øvelse →'}
          </button>
        </div>
      )}
    </div>
  );
}

function LessonSummary({
  lesson,
  results,
  onRetry,
}: {
  lesson: Lesson;
  results: TypingStats[];
  onRetry: () => void;
}) {
  const total = aggregateStats(results);
  const wpm = Math.round(total.wpm);
  const accuracy = Math.round(total.accuracy * 100);
  const passed =
    total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy;
  const nextLesson = getNextLesson(lesson.id);

  return (
    <div className="space-y-6">
      <div
        className={[
          'rounded-2xl p-6 text-center',
          passed
            ? 'bg-emerald-50 dark:bg-emerald-500/10'
            : 'bg-amber-50 dark:bg-amber-500/10',
        ].join(' ')}
      >
        <p className="text-5xl">{passed ? '🎉' : '💪'}</p>
        <h2 className="mt-2 text-2xl font-bold">
          {passed ? 'Lektion bestået!' : 'Næsten der!'}
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          {passed
            ? 'Flot arbejde — du nåede målet.'
            : 'Prøv igen og ram målet for at gå videre.'}
        </p>

        <dl className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 text-center">
          <SummaryStat
            label="WPM"
            value={wpm}
            target={lesson.targetWpm}
            met={total.wpm >= lesson.targetWpm}
          />
          <SummaryStat
            label="Præcision"
            value={`${accuracy}%`}
            target={`${Math.round(lesson.minAccuracy * 100)}%`}
            met={total.accuracy >= lesson.minAccuracy}
          />
        </dl>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Prøv igen
        </button>
        {passed && nextLesson && (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Næste lektion: {nextLesson.title} →
          </Link>
        )}
        {passed && !nextLesson && (
          <Link
            to="/lessons"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Alle lektioner
          </Link>
        )}
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  target,
  met,
}: {
  label: string;
  value: string | number;
  target: string | number;
  met: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/40">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-3xl font-bold tabular-nums">{value}</dd>
      <p
        className={[
          'mt-1 text-xs font-medium',
          met
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-amber-600 dark:text-amber-400',
        ].join(' ')}
      >
        {met ? '✓' : '✕'} mål: {target}
      </p>
    </div>
  );
}
