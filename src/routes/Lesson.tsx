import { useParams } from 'react-router-dom';

export default function Lesson() {
  const { lessonId } = useParams();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Lektion {lessonId}</h1>
      <p className="text-slate-600 dark:text-slate-300">
        Tastatur og skrive-motor kommer i næste milepæl (Milepæl 2).
      </p>
    </section>
  );
}
