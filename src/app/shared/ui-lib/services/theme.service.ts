import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'ui-lib-theme';
const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storedTheme = this.readStoredTheme();

  readonly mode = signal<ThemeMode>(this.storedTheme ?? 'system');

  constructor() {
    effect(() => {
      const mode = this.mode();

      this.document.documentElement.dataset['theme'] = mode;
      this.storeTheme(mode);
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private readStoredTheme(): ThemeMode | null {
    try {
      const storedTheme = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);

      return THEME_MODES.includes(storedTheme as ThemeMode) ? (storedTheme as ThemeMode) : null;
    } catch {
      return null;
    }
  }

  private storeTheme(mode: ThemeMode): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  }
}
