import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Lær at skrive med <span className="text-indigo-600">10 fingre</span>
      </h1>
      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        En let og sjov måde at lære touch-typing på dansk tastatur — for både
        børn og voksne. Din fremgang gemmes automatisk i browseren.
      </p>
      <Link
        to="/lesson/1"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Start første lektion
      </Link>
    </section>
  );
}
