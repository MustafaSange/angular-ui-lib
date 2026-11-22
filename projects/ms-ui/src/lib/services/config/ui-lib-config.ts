import type { UiDensity } from '../density';
import type { LanguageLocales } from '../language';
import type { SwitchConfig } from '../../components/choice-controls/switch-control/switch-config';

export interface UiLibConfig {
  readonly switch?: SwitchConfig;
  readonly density?: UiDensity;
  readonly additionalMaterialIcons?: readonly string[];
  /** Validated locale patches created with `defineLocalePatch`, optionally loaded lazily. */
  readonly locales?: LanguageLocales;
}
