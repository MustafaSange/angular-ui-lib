# Feature 057: Language Localization

## Goal

Provide a small, reusable localization layer for English and Arabic that offers type-safe nested
translation keys, interpolation parameters, lazily loaded locale files, application-level locale
patches, and automatic LTR/RTL synchronization.

English is the canonical locale and defines the public translation-key and interpolation-parameter
types. Arabic and application patches must keep the same structure and placeholder names.

## Non-Goals

- Do not provide runtime translation editing or remote translation management.
- Do not allow application patches to add keys outside the built-in UI-library locale.
- Do not format dates, times, currencies, plurals, or grammatical variants.
- Do not infer a language from the browser locale.
- Do not render a language switcher component as part of this feature.

## Public API

Import localization APIs from the public UI-library barrel:

```ts
import {
  LanguageService,
  TranslatePipe,
  defineLocale,
  defineLocalePatch,
  provideUiLib,
  type DefinedLocalePatch,
  type LanguageCode,
  type LanguageLocales,
  type Locale,
  type LocalePatch,
  type LocalePatchLoader,
  type LocalePatchSource,
  type LocaleShape,
  type LocaleValue,
  type TranslationKey,
  type TranslationParamName,
  type TranslationParams,
  type UiLibConfig,
} from './shared/ui-lib';
```

Public pieces:

- `LanguageCode = 'en' | 'ar'`
- `LocaleValue = string | number | boolean`
- `LanguageService` with readonly `language` and `loading` signals
- `LanguageService.initialize()` for application initialization
- `LanguageService.setLanguage(language)` for asynchronous language switching
- `LanguageService.translate(key, params?)` for typed lookup and interpolation
- `TranslatePipe` with pipe name `translate`
- `defineLocale()` for validating a complete locale against canonical English
- `defineLocalePatch()` for validating a partial application locale
- `UiLibConfig.locales` for eager or lazy application patches

`TranslationKey` is a union of leaf paths from the canonical English locale, using `.` between
nested properties. `TranslationParams<Key>` is derived from the `{{parameter}}` placeholders in
the English value for that key.

## Desired Usage

Inject the service and switch languages asynchronously:

```ts
import { Component, inject } from '@angular/core';

import { LanguageService } from './shared/ui-lib';

@Component({
  selector: 'app-language-controls',
  template: `
    <button type="button" [disabled]="language.loading()" (click)="useEnglish()">English</button>
    <button type="button" [disabled]="language.loading()" (click)="useArabic()">Arabic</button>
  `,
})
export class LanguageControls {
  protected readonly language = inject(LanguageService);

  protected async useEnglish(): Promise<void> {
    await this.language.setLanguage('en');
  }

  protected async useArabic(): Promise<void> {
    await this.language.setLanguage('ar');
  }
}
```

Use the pipe in a standalone component:

```ts
import { Component } from '@angular/core';

import { TranslatePipe } from './shared/ui-lib';

@Component({
  selector: 'app-welcome-message',
  imports: [TranslatePipe],
  template: `<p>{{ 'greeting.welcome' | translate: { name: 'Maya' } }}</p>`,
})
export class WelcomeMessage {}
```

Call the same translation API directly:

```ts
const message = languageService.translate('validation.max', { max: 100 });
```

For `validation.max`, TypeScript accepts `max` and rejects a mismatched parameter such as `max1`.

## Application Locale Patches

Keep application-owned locale patches outside the reusable UI library. Define each patch with
`defineLocalePatch()` so its keys, leaf values, and interpolation placeholders are checked against
the built-in English locale.

```ts
// src/app/core/locales/en.ts
import { defineLocalePatch } from '../../shared/ui-lib';

export const en = defineLocalePatch({
  greeting: {
    welcome: 'Welcome to the UI library, {{name}}!',
  },
});
```

```ts
// src/app/core/locales/ar.ts
import { defineLocalePatch } from '../../shared/ui-lib';

export const ar = defineLocalePatch({
  greeting: {
    welcome: 'مرحباً بك في مكتبة واجهة المستخدم، {{name}}!',
  },
});
```

Load application patches lazily through `provideUiLib()`:

```ts
import { ApplicationConfig } from '@angular/core';

import { provideUiLib } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideUiLib({
      locales: {
        en: async () => (await import('./core/locales/en')).en,
        ar: async () => (await import('./core/locales/ar')).ar,
      },
    }),
  ],
};
```

The configured value may be a validated patch directly or a loader returning a validated patch.
A plain unvalidated object is rejected by `UiLibConfig`.

## Structure

The reusable implementation lives in:

- `src/app/shared/ui-lib/services/language/language.service.ts`
- `src/app/shared/ui-lib/services/language/language-types.ts`
- `src/app/shared/ui-lib/services/language/define-locale.ts`
- `src/app/shared/ui-lib/services/language/locales/en.ts`
- `src/app/shared/ui-lib/services/language/locales/ar.ts`
- `src/app/shared/ui-lib/services/language/index.ts`
- `src/app/shared/ui-lib/pipes/translate/translate.pipe.ts`
- `src/app/shared/ui-lib/pipes/translate/index.ts`
- `src/app/shared/ui-lib/services/config/ui-lib-config.ts`
- `src/app/shared/ui-lib/services/config/provide-ui-lib.ts`

Application patches live in:

- `src/app/core/locales/en.ts`
- `src/app/core/locales/ar.ts`

Public exports flow through the language, services, pipes, and root UI-library barrels.

## Locale Contract and Type Safety

- The built-in `en` object is the canonical locale.
- `LocaleShape<typeof en>` preserves the nested shape while widening leaf values to
  `string | number | boolean`.
- A complete locale must contain every canonical key and no unknown keys.
- A patch may omit canonical keys but cannot add unknown keys.
- `defineLocale()` validates complete locale placeholder names against English.
- `defineLocalePatch()` performs the same validation for partial locales and returns the branded
  `DefinedLocalePatch` required by application configuration.
- Translated strings must contain exactly the same interpolation parameter names as their English
  source. Surrounding translated text and placeholder order may differ.
- A canonical string containing interpolation parameters cannot be replaced with a number or
  boolean because doing so would remove the required placeholders.
- Translation keys point only to locale leaves; object paths are not valid keys.

For example, if English contains:

```ts
max: 'Max {{max}}';
```

then `{{max}}` is valid in Arabic or a custom patch, while `{{max1}}`, a missing placeholder, or an
additional placeholder fails type checking.

## Translation Behavior

- Split a translation key on `.` and traverse only own properties of record values.
- Return string, number, and boolean locale leaves as strings from the public translation API.
- Replace `{{parameter}}` placeholders with the matching own property from `params`.
- Allow whitespace inside placeholder braces and trim it when determining the parameter name.
- Preserve valid falsy parameter values such as `0`, `false`, and `''`.
- When a translation key cannot be resolved to a locale leaf, return the requested key.
- When an interpolation parameter is missing, replace its placeholder with the parameter name.
- Parameters default to an empty object.
- An explicitly supplied custom signal-form error message takes precedence over localized defaults.

Examples:

```ts
languageService.translate('greeting.welcome', { name: 'Maya' }); // "Welcome, Maya!"
languageService.translate('greeting.welcome'); // "Welcome, name!"
```

At runtime, an unresolved key returns the key itself so the missing translation remains visible on
screen. Compile-time consumers normally cannot pass an unresolved key without deliberately
widening or bypassing `TranslationKey`.

## Loading and Concurrency

- Built-in English is available synchronously as the initial fallback locale.
- Built-in Arabic is loaded with a dynamic import when Arabic is first requested.
- The configured patch for the initial language is loaded by the `provideUiLib()` application
  initializer before bootstrap completes.
- Resolved merged locales are cached by language for the lifetime of `LanguageService`.
- Concurrent requests for the same language share one pending promise.
- A failed request is removed from the pending cache so a later call can retry.
- When language requests overlap, only the most recent request may update the active locale,
  language, and loading state.
- A locale-loading rejection propagates to the initializer or `setLanguage()` caller. The previous
  active language remains unchanged when a runtime switch fails.

## Language Persistence and Direction

- Persist the active language to local storage with the key `ms-language` when storage is available.
- Restore only supported stored values: `en` and `ar`.
- When no valid stored language exists, use the existing `DirectionService` state as a migration
  fallback: RTL selects Arabic and LTR selects English.
- English always selects `ltr`; Arabic always selects `rtl`.
- Apply direction through `DirectionService`, which updates `document.documentElement.dir`.
- Continue switching in memory when local storage is unavailable or throws.
- Initialization and successful language changes synchronize direction from the active language.
- Consumers can still call `DirectionService` directly for a temporary layout override; the next
  language change restores the direction associated with that language.

## Signal Form Validation Integration

`ms-signal-form-field` uses `LanguageService` for its built-in fallback messages:

- `required`
- `min`
- `max`
- `minLength`
- `maxLength`
- `email`
- `pattern`
- `parse`

Minimum, maximum, and length errors interpolate their numeric limits. When a recognized limit error
does not contain the expected numeric property, display its error kind instead of generating a
misleading message such as `Min min`. Unknown errors also display their error kind.

Because the form field computes its fallback error message and `translate()` reads the active locale
signal, visible fallback validation messages update after a successful language switch.

## Accessibility

- Update the root document direction when the language changes so logical layouts and reading order
  follow the active language.
- Language-switch controls remain consumer-owned and should use native buttons or selects with
  clear accessible names and selected-state communication.
- Disable or expose a loading state on switch controls while a locale is loading when repeated user
  activation would be confusing.
- Missing translations remain visible as their keys instead of becoming empty, undiscoverable text.

## Showcase

The `/language` showcase is linked from the home showcase catalog and demonstrates:

- live English and Arabic switching
- the active language, loading state, and document direction
- translated pipe output with a named interpolation parameter
- direct `LanguageService.translate()` output driven by an editable name
- localized required and maximum validation messages
- the visible fallback when an interpolation parameter is omitted

The live language-switch and service-translation examples each render a matching copyable
standalone Angular component with `ShowcaseCode` from `src/app/shared/showcase-code`. Snippets import
public localization APIs through `./shared/ui-lib`.

## Angular Rules

- Use `@Service()` for the root-provided language service.
- Use signals for public language and loading state.
- Use `inject()` for dependencies.
- Register initialization with `provideAppInitializer()` through `provideUiLib()`.
- Keep `TranslatePipe` impure so locale signal changes are reflected when its key and params inputs
  remain unchanged.
- Use standalone Angular APIs and do not add `standalone: true`.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- English and Arabic built-in locales share the canonical English structure.
- Arabic and configured patches are loaded lazily and cached after successful resolution.
- Application locale patches merge over built-in locales without replacing unrelated keys.
- Direct unvalidated patches are rejected by `UiLibConfig`; `defineLocalePatch()` validates keys and
  interpolation placeholders.
- `translate()` and the `translate` pipe accept typed nested keys and key-specific typed parameters.
- String, number, and boolean locale leaves produce string output.
- Missing keys return their key, and missing parameters return their parameter name.
- Overlapping language requests cannot allow an older request to replace the latest selection.
- The active language persists and restores across reloads when local storage is available.
- English applies LTR direction and Arabic applies RTL direction through `DirectionService`.
- Signal-form fallback validation messages use the active locale and preserve explicit custom error
  messages.
- Public APIs are exported through the language, services, pipes, and root UI-library barrels.
- The `/language` showcase is routed, discoverable from the home catalog, and includes matching
  copyable standalone examples.
- The Angular typecheck and production build succeed apart from the existing bundle-budget warning.
