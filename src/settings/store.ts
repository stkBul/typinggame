import type { ColorScheme, Settings, ThemeMode } from './types';

export const SETTINGS_KEY = 'tastetrup.settings';
export const SETTINGS_VERSION = 1;

const MODES: ThemeMode[] = ['kid', 'adult'];
const SCHEMES: ColorScheme[] = ['light', 'dark', 'system'];

export function defaultSettings(): Settings {
  return {
    version: SETTINGS_VERSION,
    mode: 'kid',
    colorScheme: 'system',
    sound: true,
  };
}

/** Parse stored settings leniently, filling any missing/invalid field. */
export function parseSettings(raw: string | null): Settings {
  const d = defaultSettings();
  if (!raw) return d;
  try {
    const p = JSON.parse(raw) as Partial<Settings>;
    if (typeof p !== 'object' || p === null) return d;
    return {
      version: SETTINGS_VERSION,
      mode: MODES.includes(p.mode as ThemeMode) ? (p.mode as ThemeMode) : d.mode,
      colorScheme: SCHEMES.includes(p.colorScheme as ColorScheme)
        ? (p.colorScheme as ColorScheme)
        : d.colorScheme,
      sound: typeof p.sound === 'boolean' ? p.sound : d.sound,
    };
  } catch {
    return d;
  }
}

export function loadSettings(): Settings {
  try {
    return parseSettings(localStorage.getItem(SETTINGS_KEY));
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // best-effort
  }
}
