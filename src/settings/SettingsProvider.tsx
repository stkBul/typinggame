import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadSettings, saveSettings } from './store';
import { SettingsContext } from './context';
import type { Settings } from './types';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // Reflect the colour scheme on <html> (class-based dark mode), tracking the
  // system preference while in 'system'.
  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark =
        settings.colorScheme === 'dark' ||
        (settings.colorScheme === 'system' && mql.matches);
      root.classList.toggle('dark', dark);
    };
    apply();
    if (settings.colorScheme === 'system') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
  }, [settings.colorScheme]);

  // Expose the theme mode for global styling hooks.
  useEffect(() => {
    document.documentElement.dataset.mode = settings.mode;
  }, [settings.mode]);

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
