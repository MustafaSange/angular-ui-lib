import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

import { UI_LIB_CONFIG } from '../config/ui-lib-config-token';
import { DirectionService, type LayoutDirection } from '../direction';
import { en } from './locales/en';
import type {
  LanguageCode,
  Locale,
  LocalePatch,
  LocalePatchSource,
  LocaleValue,
  TranslationKey,
  TranslationParams,
} from './language-types';

type LocaleLoader = () => Promise<Locale>;

const LOCALE_LOADERS = {
  en: async () => en,
  ar: async () => (await import('./locales/ar')).ar,
} satisfies Readonly<Record<LanguageCode, LocaleLoader>>;

const LANGUAGE_DIRECTIONS = {
  en: 'ltr',
  ar: 'rtl',
} satisfies Readonly<Record<LanguageCode, LayoutDirection>>;

const LANGUAGE_CODES: readonly LanguageCode[] = ['en', 'ar'];
const LANGUAGE_STORAGE_KEY = 'ms-language';
const INTERPOLATION_PATTERN = /{{\s*([^{}]+?)\s*}}/g;

@Service()
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(UI_LIB_CONFIG);
  private readonly directionService = inject(DirectionService);
  private readonly languageState = signal<LanguageCode>(this.getInitialLanguage());
  private readonly localeState = signal<Locale>(en);
  private readonly loadingState = signal(false);
  private readonly loadedLocales = new Map<LanguageCode, Locale>();
  private readonly pendingLocales = new Map<LanguageCode, Promise<Locale>>();
  private latestLanguageRequest = 0;

  readonly language = this.languageState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    effect(() => {
      const language = this.languageState();

      this.directionService.setDirection(LANGUAGE_DIRECTIONS[language]);
      this.storeLanguage(language);
    });
  }

  async initialize(): Promise<void> {
    this.localeState.set(await this.loadLocale(this.languageState()));
  }

  async setLanguage(language: LanguageCode): Promise<void> {
    const requestId = ++this.latestLanguageRequest;

    if (language === this.languageState()) {
      this.loadingState.set(false);
      return;
    }

    this.loadingState.set(true);

    try {
      const locale = await this.loadLocale(language);

      if (requestId !== this.latestLanguageRequest) {
        return;
      }

      this.localeState.set(locale);
      this.languageState.set(language);
    } finally {
      if (requestId === this.latestLanguageRequest) {
        this.loadingState.set(false);
      }
    }
  }

  translate<Key extends TranslationKey>(key: Key, params?: TranslationParams<Key>): string {
    const translation = this.resolveTranslation(this.localeState(), key);

    return this.interpolate(String(translation), params ?? {});
  }

  private resolveTranslation(locale: Locale, key: string): LocaleValue {
    let value: unknown = locale;

    for (const segment of key.split('.')) {
      if (!this.isRecord(value) || !Object.hasOwn(value, segment)) {
        return key;
      }

      value = value[segment];
    }

    if (this.isLocaleValue(value)) {
      return value;
    }

    return key;
  }

  private interpolate(
    translation: string,
    params: Readonly<Partial<Record<string, LocaleValue>>>,
  ): string {
    return translation.replace(INTERPOLATION_PATTERN, (_placeholder, paramName: string) => {
      return Object.hasOwn(params, paramName) ? String(params[paramName]) : paramName;
    });
  }

  private isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isLocaleValue(value: unknown): value is LocaleValue {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  private async loadLocale(language: LanguageCode): Promise<Locale> {
    const loadedLocale = this.loadedLocales.get(language);

    if (loadedLocale) {
      return loadedLocale;
    }

    const pendingLocale = this.pendingLocales.get(language);

    if (pendingLocale) {
      return pendingLocale;
    }

    const localeRequest = this.createLocale(language);
    this.pendingLocales.set(language, localeRequest);

    try {
      const locale = await localeRequest;
      this.loadedLocales.set(language, locale);
      return locale;
    } finally {
      this.pendingLocales.delete(language);
    }
  }

  private async createLocale(language: LanguageCode): Promise<Locale> {
    const builtInLocale = await LOCALE_LOADERS[language]();
    const patchSource = this.config.locales?.[language];

    if (!patchSource) {
      return builtInLocale;
    }

    const patch = await this.loadPatch(patchSource);
    return this.mergeLocale(builtInLocale, patch);
  }

  private getInitialLanguage(): LanguageCode {
    const storedLanguage = this.readStoredLanguage();

    if (storedLanguage) {
      return storedLanguage;
    }

    return this.directionService.direction() === 'rtl' ? 'ar' : 'en';
  }

  private readStoredLanguage(): LanguageCode | null {
    try {
      const storedLanguage =
        this.document.defaultView?.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? null;

      return LANGUAGE_CODES.includes(storedLanguage as LanguageCode)
        ? (storedLanguage as LanguageCode)
        : null;
    } catch {
      return null;
    }
  }

  private storeLanguage(language: LanguageCode): void {
    try {
      this.document.defaultView?.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language switching still works when storage is unavailable.
    }
  }

  private loadPatch(source: LocalePatchSource): LocalePatch<Locale> | Promise<LocalePatch<Locale>> {
    return typeof source === 'function' ? source() : source;
  }

  private mergeLocale(locale: Locale, patch: LocalePatch<Locale> | undefined): Locale {
    if (!patch) {
      return locale;
    }

    return this.mergeRecords(locale, patch) as Locale;
  }

  private mergeRecords(base: object, patch: object): Readonly<Record<string, unknown>> {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, patchValue] of Object.entries(patch) as [string, unknown][]) {
      const baseValue = merged[key];

      merged[key] =
        this.isRecord(baseValue) && this.isRecord(patchValue)
          ? this.mergeRecords(baseValue, patchValue)
          : patchValue;
    }

    return merged;
  }
}
