import { Link } from 'react-router-dom';
import { LESSONS } from '../lessons/curriculum';
import type { Lesson } from '../lessons/types';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Niveau 1 · Hjemmerækken',
  2: 'Niveau 2 · Øverste række',
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
  const levels = groupByLevel(LESSONS);

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Lektioner</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Følg rækkefølgen fra hjemmerækken og udad. Hver lektion bygger på den
          forrige.
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
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{lesson.title}</h3>
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
                    Mål: {lesson.targetWpm} WPM ·{' '}
                    {Math.round(lesson.minAccuracy * 100)}% præcision
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
