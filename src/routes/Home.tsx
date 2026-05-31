import { Link } from 'react-router-dom';
import { useProgress } from '../progress/context';
import { useSettings } from '../settings/context';
import { nextLessonId } from '../progress/unlock';

export default function Home() {
  const { settings } = useSettings();
  const { progress } = useProgress();
  const isKid = settings.mode === 'kid';
  const resumeId = nextLessonId(progress);
  const hasStarted = Object.keys(progress.records).length > 0;

  return (
    <section className="flex flex-col items-center gap-6 text-center">
      {isKid && (
        <div className="text-6xl" aria-hidden>
          🐙
        </div>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Lær at skrive med <span className="text-indigo-600">10 fingre</span>
      </h1>
      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        {isKid
          ? 'Bliv en superhurtig skrivehelt! Følg farverne, saml badges og lær at skrive uden at kigge på tasterne.'
          : 'En let og effektiv måde at lære touch-typing på dansk tastatur. Din fremgang gemmes automatisk i browseren.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={`/lesson/${hasStarted ? resumeId : '1'}`}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          {hasStarted ? 'Fortsæt træning' : 'Start første lektion'}
        </Link>
        <Link
          to="/lessons"
          className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Alle lektioner
        </Link>
      </div>
    </section>
  );
}
