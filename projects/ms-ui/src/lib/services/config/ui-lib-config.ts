import type { UiDensity } from '../density';
import type { LanguageLocales } from '../language';

export interface UiLibConfig {
  readonly density?: UiDensity;
  readonly additionalMaterialIcons?: readonly string[];
  /** Validated locale patches created with `defineLocalePatch`, optionally loaded lazily. */
  readonly locales?: LanguageLocales;
}
