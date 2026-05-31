/** Playful kid theme vs. focused adult theme. */
export type ThemeMode = 'kid' | 'adult';

/** Colour scheme; 'system' follows the OS preference. */
export type ColorScheme = 'light' | 'dark' | 'system';

export interface Settings {
  version: number;
  mode: ThemeMode;
  colorScheme: ColorScheme;
  sound: boolean;
}
