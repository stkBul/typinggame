import { useParams } from 'react-router-dom';
import TypingTrainer from '../components/TypingTrainer';

// Placeholder home-row drill. The real per-lesson curriculum arrives in
// Milestone 3; this exercises the keyboard + engine on Danish home-row keys.
const SAMPLE_DRILL = 'asdf jklæ asdf jklæ fad sal dal laks fald ask salt';

export default function Lesson() {
  const { lessonId } = useParams();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-indigo-600">
          Lektion {lessonId}
        </p>
        <h1 className="text-2xl font-bold">Hjemmerækken</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Hold fingrene på hjemmerækken og følg farverne. Den fremhævede tast
          viser, hvor din næste finger skal hen.
        </p>
      </header>

      <TypingTrainer text={SAMPLE_DRILL} />
    </section>
  );
}
