import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aggregateStats, type TypingStats } from '../engine/stats';
import { getNextLesson } from '../lessons/curriculum';
import { useProgress } from '../progress/context';
import { applyResult } from '../progress/store';
import { BADGES, earnedBadgeIds, type Badge } from '../badges/badges';
import type { Drill, Lesson } from '../lessons/types';
import TypingTrainer from './TypingTrainer';

interface LessonRunnerProps {
  lesson: Lesson;
}

const DRILL_KIND_LABEL: Record<Drill['kind'], string> = {
  keys: 'Taster',
  words: 'Ord',
  sentence: 'Sætning',
  passage: 'Tekst',
};

/** How many of the worst keys to drill in the warm-up after a failed attempt. */
const WEAKNESS_KEY_COUNT = 3;

/**
 * Build a short "keys" warm-up from the characters the learner missed most, so a
 * retry starts by re-training the weakest keys. Returns null when there's nothing
 * worth drilling (e.g. only spaces were missed).
 */
function buildWeaknessDrill(charErrors: Record<string, number>): Drill | null {
  const worst = Object.entries(charErrors)
    .filter(([char]) => char.trim() !== '') // a missed space isn't a key to drill
    .sort((a, b) => b[1] - a[1])
    .slice(0, WEAKNESS_KEY_COUNT)
    .map(([char]) => char);
  if (worst.length === 0) return null;
  // e.g. ['f','d'] -> "fff ddd fdf dfd fd df"
  const triples = worst.map((c) => c.repeat(3)).join(' ');
  const a = worst[0];
  const b = worst[1] ?? worst[0];
  const text = `${triples} ${a}${b}${a} ${b}${a}${b} ${a}${b} ${b}${a}`;
  return { id: 'weakness-warmup', kind: 'keys', text };
}

/** Seconds to show the result before auto-advancing to the next lesson. */
const AUTO_ADVANCE_SECONDS = 4;

export default function LessonRunner({ lesson }: LessonRunnerProps) {
  const { progress, recordResult } = useProgress();
  const [drillIndex, setDrillIndex] = useState(0);
  const [results, setResults] = useState<TypingStats[]>([]);
  // A generated warm-up prepended on a failed retry; never persisted.
  const [extraDrill, setExtraDrill] = useState<Drill | null>(null);
  const recordedRef = useRef(false);
  // Freeze the progress at mount so we can diff which badges this lesson earns.
  const [progressAtMount] = useState(progress);

  // The drills actually shown: the optional warm-up followed by the lesson's own.
  const drills = extraDrill ? [extraDrill, ...lesson.drills] : lesson.drills;
  const drill = drills[drillIndex];
  const isLastDrill = drillIndex === drills.length - 1;
  const lessonDone = results.length === drills.length;
  // The warm-up doesn't count toward the score, so drop it before aggregating.
  const lessonResults = extraDrill ? results.slice(1) : results;

  function handleDrillComplete(stats: TypingStats) {
    setResults((prev) => [...prev, stats]);
  }

  function restart() {
    // Build a targeted warm-up from the keys missed most this attempt, but only
    // when the learner didn't pass — a pass needs no remediation.
    const total = aggregateStats(lessonResults);
    const passed =
      total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy;
    setExtraDrill(passed ? null : buildWeaknessDrill(total.charErrors));
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
    const total = aggregateStats(lessonResults);
    recordResult({
      lessonId: lesson.id,
      wpm: total.wpm,
      accuracy: total.accuracy,
      passed:
        total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy,
    });
  }, [lessonDone, lessonResults, lesson, recordResult]);

  if (lessonDone) {
    const total = aggregateStats(lessonResults);
    const passed =
      total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy;
    const before = earnedBadgeIds(progressAtMount);
    const after = earnedBadgeIds(
      applyResult(progressAtMount, {
        lessonId: lesson.id,
        wpm: total.wpm,
        accuracy: total.accuracy,
        passed,
      }),
    );
    const newBadges = BADGES.filter((b) => after.has(b.id) && !before.has(b.id));
    return (
      <LessonSummary
        lesson={lesson}
        results={lessonResults}
        newBadges={newBadges}
        onRetry={restart}
      />
    );
  }

  // The just-finished drill awaits the "next" action before advancing.
  const justFinished = results.length === drillIndex + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Øvelse {drillIndex + 1} af {drills.length} ·{' '}
          {DRILL_KIND_LABEL[drill.kind]}
        </p>
        <div className="flex gap-1">
          {drills.map((d, i) => (
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
        // Prose wraps at real spaces; short key/word drills keep the ␣ glyph.
        spaceGlyph={drill.kind === 'keys' || drill.kind === 'words'}
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
  newBadges,
  onRetry,
}: {
  lesson: Lesson;
  results: TypingStats[];
  newBadges: Badge[];
  onRetry: () => void;
}) {
  const navigate = useNavigate();
  const total = aggregateStats(results);
  const wpm = Math.round(total.wpm);
  const accuracy = Math.round(total.accuracy * 100);
  const passed =
    total.wpm >= lesson.targetWpm && total.accuracy >= lesson.minAccuracy;
  const nextLesson = getNextLesson(lesson.id);

  // Rhythm is informational (not part of passing): 3 stars steady → 1 star jittery.
  const rhythmStars =
    total.rhythmScore >= 0.75 ? 3 : total.rhythmScore >= 0.5 ? 2 : 1;
  const rhythmDisplay = '★'.repeat(rhythmStars) + '☆'.repeat(3 - rhythmStars);

  const autoAdvancing = passed && nextLesson !== undefined;
  const [staying, setStaying] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SECONDS);

  // On a pass, count down and then move to the next lesson automatically —
  // unless the learner chooses to stay (to review or retry).
  useEffect(() => {
    if (!autoAdvancing || staying || nextLesson === undefined) return;
    if (countdown <= 0) {
      navigate(`/lesson/${nextLesson.id}`);
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [autoAdvancing, staying, countdown, nextLesson, navigate]);

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

        <dl className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 text-center sm:grid-cols-3">
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
          <RhythmStat stars={rhythmStars} display={rhythmDisplay} />
        </dl>
      </div>

      {newBadges.length > 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Ny badge optjent!
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-3">
            {newBadges.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-slate-900"
              >
                <span className="text-lg">{b.emoji}</span>
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {autoAdvancing && !staying && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Går videre til næste lektion om {countdown}…{' '}
          <button
            type="button"
            onClick={() => setStaying(true)}
            className="font-medium text-indigo-600 underline hover:no-underline"
          >
            Bliv på siden
          </button>
        </p>
      )}
    </div>
  );
}

/** Informational rhythm rating — steadiness of typing, not a pass/fail target. */
function RhythmStat({ stars, display }: { stars: number; display: string }) {
  return (
    <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/40">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Rytme
      </dt>
      <dd className="text-3xl font-bold tabular-nums text-amber-500">
        {display}
      </dd>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        {stars === 3 ? 'jævn takt' : stars === 2 ? 'god takt' : 'ujævn takt'}
      </p>
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
