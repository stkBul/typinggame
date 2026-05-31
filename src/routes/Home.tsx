import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../progress/context';
import { useSettings } from '../settings/context';
import { nextLessonId } from '../progress/unlock';
import { lessonsNeedingReview } from '../progress/store';
import { getLesson } from '../lessons/curriculum';
import { PASSAGES } from '../practice/passages';
import DrillText from '../components/DrillText';

// A fixed excerpt + how far it's "typed", so the backdrop looks like a real
// test in progress without any of the engine wiring.
const PREVIEW = PASSAGES[0];
const PREVIEW_TYPED = 58;

export default function Home() {
  const { settings } = useSettings();
  const { progress } = useProgress();
  const isKid = settings.mode === 'kid';
  const resumeId = nextLessonId(progress);
  const hasStarted = Object.keys(progress.records).length > 0;
  const learnTo = `/lesson/${hasStarted ? resumeId : '1'}`;
  // Top-priority lesson due for a spaced-repetition refresher, if any. Read the
  // clock once per mount so the prompt stays stable across re-renders.
  const [now] = useState(() => Date.now());
  const reviewLesson = getLesson(lessonsNeedingReview(progress, now)[0]);

  return (
    <section className="relative">
      {/* Dimmed typing-test backdrop — purely decorative. */}
      <TestPreview />

      {/* Foreground call-to-action, centred over the backdrop. */}
      <div className="relative z-10 flex flex-col items-center gap-6 py-8 text-center">
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
            to="/practice"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            ⏱️ Test din skrivehastighed
          </Link>
          <Link
            to={learnTo}
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-lg font-semibold shadow-sm backdrop-blur transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/80 dark:hover:bg-slate-800"
          >
            ⌨️ Lær at skrive
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <Link to="/lessons" className="text-indigo-600 hover:underline">
            Se alle lektioner
          </Link>
          <Link to="/game" className="text-indigo-600 hover:underline">
            🎈 Spil ballonspillet
          </Link>
        </div>

        {reviewLesson && (
          <Link
            to={`/lesson/${reviewLesson.id}`}
            className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-800 shadow-sm backdrop-blur transition-colors hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
          >
            <span aria-hidden>🔄</span>
            Klar til genopfriskning: {reviewLesson.title} →
          </Link>
        )}
      </div>
    </section>
  );
}

/** Static, non-interactive mock of the speed test, faded into the background. */
function TestPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex select-none flex-col gap-4 opacity-25 blur-[2px] dark:opacity-20"
    >
      <div className="grid grid-cols-3 gap-3 text-center">
        <PreviewStat label="Tid tilbage" value="42s" />
        <PreviewStat label="WPM" value="48" />
        <PreviewStat label="Præcision" value="97%" />
      </div>
      <div className="rounded-xl border-2 border-indigo-500 bg-white p-4 font-mono text-lg leading-relaxed tracking-wide dark:bg-slate-900">
        <DrillText
          text={PREVIEW.text}
          typed={PREVIEW.text.slice(0, PREVIEW_TYPED)}
          cursor={PREVIEW_TYPED}
          focused
          spaceGlyph={false}
        />
      </div>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
