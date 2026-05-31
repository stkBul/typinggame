import { useProgress } from '../progress/context';
import { useSettings } from '../settings/context';
import type { ColorScheme, ThemeMode } from '../settings/types';

const MODE_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'kid', label: '🧒 Børn', hint: 'Farverigt og legende' },
  { value: 'adult', label: '🧑 Voksen', hint: 'Roligt og fokuseret' },
];

const SCHEME_OPTIONS: { value: ColorScheme; label: string }[] = [
  { value: 'light', label: '☀️ Lys' },
  { value: 'dark', label: '🌙 Mørk' },
  { value: 'system', label: '💻 System' },
];

export default function Settings() {
  const { settings, update } = useSettings();
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

      <Field label="Tema" hint="Vælg et udseende, der passer til dig.">
        <SegmentedControl
          value={settings.mode}
          options={MODE_OPTIONS}
          onChange={(mode) => update({ mode })}
        />
      </Field>

      <Field label="Farver">
        <SegmentedControl
          value={settings.colorScheme}
          options={SCHEME_OPTIONS}
          onChange={(colorScheme) => update({ colorScheme })}
        />
      </Field>

      <Field label="Lyd" hint="Små lyde, når du skriver rigtigt eller forkert.">
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => update({ sound: e.target.checked })}
            className="h-5 w-5 accent-indigo-600"
          />
          <span className="text-sm">{settings.sound ? 'Til' : 'Fra'}</span>
        </label>
      </Field>

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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="font-semibold">{label}</h2>
        {hint && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'rounded-lg border px-4 py-2 text-left text-sm font-medium transition-colors',
              selected
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            <span className="block">{opt.label}</span>
            {opt.hint && (
              <span
                className={[
                  'block text-xs',
                  selected ? 'text-indigo-100' : 'text-slate-400',
                ].join(' ')}
              >
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
