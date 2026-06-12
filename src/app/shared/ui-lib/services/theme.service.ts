import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

import {
  THEME_SEMANTIC_COLORS,
  ThemeColorCustomizations,
  ThemeMode,
  ThemeSemanticColor,
} from './theme-types';

const THEME_STORAGE_KEY = 'ui-lib-theme';
const THEME_COLORS_STORAGE_KEY = 'ui-lib-theme-colors';
const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i;
const THEME_COLOR_VALUES = THEME_SEMANTIC_COLORS.map((color) => color.value);
const THEME_COLOR_STOPS: readonly { stop: number; value: (color: string) => string }[] = [
  { stop: 50, value: (color) => `color-mix(in srgb, ${color} 8%, white)` },
  { stop: 100, value: (color) => `color-mix(in srgb, ${color} 16%, white)` },
  { stop: 200, value: (color) => `color-mix(in srgb, ${color} 28%, white)` },
  { stop: 300, value: (color) => `color-mix(in srgb, ${color} 44%, white)` },
  { stop: 400, value: (color) => `color-mix(in srgb, ${color} 68%, white)` },
  { stop: 500, value: (color) => `color-mix(in srgb, ${color} 86%, white)` },
  { stop: 600, value: (color) => color },
  { stop: 700, value: (color) => `color-mix(in srgb, ${color} 86%, black)` },
  { stop: 800, value: (color) => `color-mix(in srgb, ${color} 72%, black)` },
  { stop: 900, value: (color) => `color-mix(in srgb, ${color} 56%, black)` },
];

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storedTheme = this.readStoredTheme();
  private readonly storedColors = this.readStoredColors();

  readonly mode = signal<ThemeMode>(this.storedTheme ?? 'system');
  readonly colorCustomizations = signal<ThemeColorCustomizations>(this.storedColors);

  constructor() {
    effect(() => {
      const mode = this.mode();

      this.document.documentElement.dataset['theme'] = mode;
      this.storeTheme(mode);
    });

    effect(() => {
      const colors = this.colorCustomizations();

      this.applyColors(colors);
      this.storeColors(colors);
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  setColor(color: ThemeSemanticColor, value: string): void {
    const normalizedValue = this.normalizeColor(value);

    if (!normalizedValue) {
      return;
    }

    this.colorCustomizations.update((colors) => ({
      ...colors,
      [color]: normalizedValue,
    }));
  }

  resetColor(color: ThemeSemanticColor): void {
    this.colorCustomizations.update((colors) => {
      const nextColors = { ...colors };
      delete nextColors[color];

      return nextColors;
    });
  }

  resetColors(): void {
    this.colorCustomizations.set({});
  }

  private readStoredTheme(): ThemeMode | null {
    try {
      const storedTheme = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);

      return THEME_MODES.includes(storedTheme as ThemeMode) ? (storedTheme as ThemeMode) : null;
    } catch {
      return null;
    }
  }

  private readStoredColors(): ThemeColorCustomizations {
    try {
      const storedColors = this.document.defaultView?.localStorage.getItem(THEME_COLORS_STORAGE_KEY);

      if (!storedColors) {
        return {};
      }

      const parsedColors: unknown = JSON.parse(storedColors);

      if (!this.isColorRecord(parsedColors)) {
        return {};
      }

      return THEME_COLOR_VALUES.reduce<ThemeColorCustomizations>((colors, color) => {
        const normalizedValue = this.normalizeColor(parsedColors[color]);

        return normalizedValue ? { ...colors, [color]: normalizedValue } : colors;
      }, {});
    } catch {
      return {};
    }
  }

  private storeTheme(mode: ThemeMode): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  }

  private storeColors(colors: ThemeColorCustomizations): void {
    try {
      const storage = this.document.defaultView?.localStorage;

      if (!storage) {
        return;
      }

      if (Object.keys(colors).length === 0) {
        storage.removeItem(THEME_COLORS_STORAGE_KEY);
        return;
      }

      storage.setItem(THEME_COLORS_STORAGE_KEY, JSON.stringify(colors));
    } catch {
      // Theme customization still works for the current session when storage is unavailable.
    }
  }

  private applyColors(colors: ThemeColorCustomizations): void {
    for (const color of THEME_COLOR_VALUES) {
      const value = colors[color];

      if (value) {
        this.applyColorRamp(color, value);
      } else {
        this.resetColorRamp(color);
      }
    }
  }

  private applyColorRamp(color: ThemeSemanticColor, value: string): void {
    for (const stop of THEME_COLOR_STOPS) {
      this.document.documentElement.style.setProperty(
        `--color-${color}-${stop.stop}`,
        stop.value(value),
      );
    }
  }

  private resetColorRamp(color: ThemeSemanticColor): void {
    for (const stop of THEME_COLOR_STOPS) {
      this.document.documentElement.style.removeProperty(`--color-${color}-${stop.stop}`);
    }
  }

  private normalizeColor(value: unknown): string | null {
    return typeof value === 'string' && HEX_COLOR_PATTERN.test(value) ? value.toLowerCase() : null;
  }

  private isColorRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
