import { Link, useParams } from 'react-router-dom';
import LessonRunner from '../components/LessonRunner';
import { getLesson } from '../lessons/curriculum';

export default function Lesson() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);

  if (!lesson) {
    return (
      <section className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Lektionen findes ikke</h1>
        <Link to="/lessons" className="font-medium text-indigo-600 hover:underline">
          Se alle lektioner
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/lessons"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Lektioner
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <div className="flex gap-1">
            {lesson.newChars.map((c) => (
              <kbd
                key={c}
                className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
              >
                {c}
              </kbd>
            ))}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          {lesson.description}
        </p>
      </header>

      <LessonRunner lesson={lesson} />
    </section>
  );
}
