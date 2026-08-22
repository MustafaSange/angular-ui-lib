import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import {
  AutocompleteComponent,
  DatePickerComponent,
  DirectionService,
  LanguageService,
  PaginationComponent,
  type PaginationState,
  ThemeSwitcher,
  TranslatePipe,
  type LanguageCode,
  type TranslationKey,
} from '../../shared/ui-lib';

interface LanguageOption {
  readonly code: LanguageCode;
  readonly labelKey: TranslationKey;
}

@Component({
  selector: 'app-language',
  imports: [
    AutocompleteComponent,
    DatePickerComponent,
    PaginationComponent,
    RouterLink,
    ShowcaseCode,
    ThemeSwitcher,
    TranslatePipe,
  ],
  templateUrl: './language.html',
  styleUrl: './language.scss',
})
export class Language {
  private readonly languageService = inject(LanguageService);
  private readonly directionService = inject(DirectionService);

  protected readonly language = this.languageService.language;
  protected readonly loading = this.languageService.loading;
  protected readonly direction = this.directionService.direction;
  protected readonly name = signal('Maya');
  protected readonly greeting = computed(() =>
    this.languageService.translate('greeting.welcome', {
      name: this.name().trim() || 'name',
    }),
  );
  protected readonly languageOptions: readonly LanguageOption[] = [
    { code: 'en', labelKey: 'language.english' },
    { code: 'ar', labelKey: 'language.arabic' },
  ];
  protected readonly emptyPagination: PaginationState = {
    totalItems: 0,
    showSummary: true,
    showPageSizeSelector: true,
  };

  protected readonly componentsSnippet = `import { Component } from '@angular/core';

import {
  AutocompleteComponent,
  DatePickerComponent,
  PaginationComponent,
  type PaginationState,
  ThemeSwitcher,
} from './shared/ui-lib';

@Component({
  selector: 'app-localized-components-example',
  imports: [
    AutocompleteComponent,
    DatePickerComponent,
    PaginationComponent,
    ThemeSwitcher,
  ],
  template: \`
    <ms-theme-switcher />
    <ms-autocomplete aria-label="Account" [options]="[]" />
    <ms-date-picker />
    <ms-pagination [state]="emptyPagination" />
  \`,
})
export class LocalizedComponentsExample {
  protected readonly emptyPagination: PaginationState = {
    totalItems: 0,
    showSummary: true,
    showPageSizeSelector: true,
  };
}`;

  protected readonly switcherSnippet = `import { Component, inject } from '@angular/core';

import {
  DirectionService,
  LanguageService,
  TranslatePipe,
  type LanguageCode,
  type TranslationKey,
} from './shared/ui-lib';

interface LanguageOption {
  readonly code: LanguageCode;
  readonly labelKey: TranslationKey;
}

@Component({
  selector: 'app-language-switcher-example',
  imports: [TranslatePipe],
  template: \`
    <section [attr.aria-busy]="loading()">
      <div role="group" aria-label="Language">
        @for (option of languageOptions; track option.code) {
          <button
            type="button"
            [disabled]="loading()"
            [attr.aria-pressed]="language() === option.code"
            (click)="setLanguage(option.code)"
          >
            {{ option.labelKey | translate }}
          </button>
        }
      </div>

      <p>{{ 'greeting.welcome' | translate: { name: 'Maya' } }}</p>
      <dl>
        <div><dt>Language</dt><dd>{{ language() }}</dd></div>
        <div><dt>Direction</dt><dd>{{ direction() }}</dd></div>
      </dl>
    </section>
  \`,
})
export class LanguageSwitcherExample {
  private readonly languageService = inject(LanguageService);

  protected readonly language = this.languageService.language;
  protected readonly loading = this.languageService.loading;
  protected readonly direction = inject(DirectionService).direction;
  protected readonly languageOptions: readonly LanguageOption[] = [
    { code: 'en', labelKey: 'language.english' },
    { code: 'ar', labelKey: 'language.arabic' },
  ];

  protected async setLanguage(language: LanguageCode): Promise<void> {
    await this.languageService.setLanguage(language);
  }
}`;

  protected readonly serviceSnippet = `import { Component, computed, inject, signal } from '@angular/core';

import { LanguageService } from './shared/ui-lib';

@Component({
  selector: 'app-translated-greeting-example',
  template: \`
    <label for="translated-name">Name</label>
    <input
      id="translated-name"
      type="text"
      [value]="name()"
      (input)="updateName($event)"
    />
    <p>{{ greeting() }}</p>
  \`,
})
export class TranslatedGreetingExample {
  private readonly languageService = inject(LanguageService);

  protected readonly name = signal('Maya');
  protected readonly greeting = computed(() =>
    this.languageService.translate('greeting.welcome', {
      name: this.name().trim() || 'name',
    }),
  );

  protected updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}`;

  protected async setLanguage(language: LanguageCode): Promise<void> {
    await this.languageService.setLanguage(language);
  }

  protected updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}
