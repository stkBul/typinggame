import { useProgress } from '../progress/context';

export default function Settings() {
  const { progress, reset } = useProgress();
  const hasProgress = Object.keys(progress.records).length > 0;

  function handleReset() {
    if (
      window.confirm(
        'Nulstil al fremgang? Dine resultater og oplåste lektioner slettes.',
      )
    ) {
      reset();
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Indstillinger</h1>

      <p className="text-slate-600 dark:text-slate-300">
        Tema (børn/voksen), lyd og tastaturlayout kommer i Milepæl 5.
      </p>

      <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="font-semibold">Fremgang</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Din fremgang gemmes i denne browser. Nulstilling kan ikke fortrydes.
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasProgress}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Nulstil fremgang
        </button>
      </div>
    </section>
  );
}
