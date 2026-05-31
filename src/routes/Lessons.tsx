import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../lessons/curriculum';
import type { Lesson } from '../lessons/types';
import { useProgress } from '../progress/context';
import { isUnlocked } from '../progress/unlock';
import { REVIEW_AFTER_MS } from '../progress/store';
import type { LessonRecord } from '../progress/types';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Niveau 1 · Hjemmerækken',
  2: 'Niveau 2 · Øverste række',
  3: 'Niveau 3 · Nederste række',
  4: 'Niveau 4 · Store bogstaver',
  5: 'Niveau 5 · Talrækken',
  6: 'Niveau 6 · Tegn og symboler',
};

function groupByLevel(lessons: Lesson[]): [number, Lesson[]][] {
  const groups = new Map<number, Lesson[]>();
  for (const lesson of lessons) {
    const list = groups.get(lesson.level) ?? [];
    list.push(lesson);
    groups.set(lesson.level, list);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]);
}

export default function Lessons() {
  const { progress } = useProgress();
  const levels = groupByLevel(LESSONS);
  // Read the clock once per mount so review badges stay stable across re-renders.
  const [now] = useState(() => Date.now());

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Lektioner</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Følg rækkefølgen fra hjemmerækken og udad. Bestå en lektion for at
          låse den næste op.
        </p>
      </header>

      {levels.map(([level, lessons]) => (
        <div key={level} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {LEVEL_TITLES[level] ?? `Niveau ${level}`}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonCard
                  lesson={lesson}
                  record={progress.records[lesson.id]}
                  unlocked={isUnlocked(lesson.id, progress)}
                  now={now}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function LessonCard({
  lesson,
  record,
  unlocked,
  now,
}: {
  lesson: Lesson;
  record: LessonRecord | undefined;
  unlocked: boolean;
  now: number;
}) {
  const passed = record?.passed ?? false;
  const needsReview =
    passed &&
    record !== undefined &&
    now - record.lastPlayedAt > REVIEW_AFTER_MS;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold">
          {!unlocked && <span aria-label="låst">🔒</span>}
          {passed && <span aria-label="bestået">✅</span>}
          {needsReview && <span aria-label="klar til genopfriskning">🔄</span>}
          {lesson.title}
        </h3>
        <div className="flex gap-1">
          {lesson.newChars.map((c) => (
            <kbd
              key={c}
              className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
            >
              {c}
            </kbd>
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {lesson.description}
      </p>
      <p className="mt-auto text-xs text-slate-400 dark:text-slate-500">
        {record
          ? `Bedste: ${Math.round(record.bestWpm)} WPM · ${Math.round(
              record.bestAccuracy * 100,
            )}%`
          : `Mål: ${lesson.targetWpm} WPM · ${Math.round(
              lesson.minAccuracy * 100,
            )}%`}
      </p>
    </>
  );

  const base =
    'flex h-full flex-col gap-2 rounded-xl border p-4 transition-colors';

  if (!unlocked) {
    return (
      <div
        className={`${base} cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/40`}
        aria-disabled
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className={`${base} border-slate-200 bg-white hover:border-indigo-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500`}
    >
      {inner}
    </Link>
  );
}
