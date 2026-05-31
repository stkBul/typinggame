import { Link } from 'react-router-dom';
import { LESSONS } from '../lessons/curriculum';
import { useProgress } from '../progress/context';
import { nextLessonId } from '../progress/unlock';
import { earnedBadges } from '../badges/badges';

export default function Progress() {
  const { progress } = useProgress();
  const records = Object.values(progress.records);

  const passedCount = records.filter((r) => r.passed).length;
  const bestWpm = records.reduce((max, r) => Math.max(max, r.bestWpm), 0);
  const avgAccuracy =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.bestAccuracy, 0) / records.length
      : 0;
  const resumeId = nextLessonId(progress);
  const badges = earnedBadges(progress);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Fremgang</h1>
        <Link
          to={`/lesson/${resumeId}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Fortsæt træning →
        </Link>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        <Stat label="Bestået" value={`${passedCount} / ${LESSONS.length}`} />
        <Stat label="Bedste WPM" value={Math.round(bestWpm).toString()} />
        <Stat
          label="Gns. præcision"
          value={records.length ? `${Math.round(avgAccuracy * 100)}%` : '–'}
        />
        <Stat
          label="Stime"
          value={
            progress.streak.current > 0
              ? `🔥 ${progress.streak.current} dag${progress.streak.current === 1 ? '' : 'e'}`
              : '–'
          }
        />
      </dl>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">Lektion</th>
              <th className="px-4 py-2 text-right">Bedste WPM</th>
              <th className="px-4 py-2 text-right">Præcision</th>
              <th className="px-4 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {LESSONS.map((lesson) => {
              const record = progress.records[lesson.id];
              return (
                <tr key={lesson.id}>
                  <td className="px-4 py-2 font-medium">{lesson.title}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {record ? Math.round(record.bestWpm) : '–'}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {record ? `${Math.round(record.bestAccuracy * 100)}%` : '–'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {record?.passed ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ✅ Bestået
                      </span>
                    ) : record ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        Forsøgt
                      </span>
                    ) : (
                      <span className="text-slate-400">Ikke startet</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Badges
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={[
                'flex items-center gap-3 rounded-xl border p-3',
                badge.earned
                  ? 'border-indigo-200 bg-white dark:border-indigo-500/30 dark:bg-slate-900'
                  : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/40',
              ].join(' ')}
            >
              <span className={badge.earned ? 'text-3xl' : 'text-3xl grayscale'}>
                {badge.earned ? badge.emoji : '🔒'}
              </span>
              <div>
                <p className="text-sm font-semibold">{badge.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {badge.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 px-3 py-3 dark:bg-slate-800">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}
