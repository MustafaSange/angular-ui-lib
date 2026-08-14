import type { UiDensity } from './density-types';

export interface UiLibConfig {
  readonly density?: UiDensity;
  readonly additionalMaterialIcons?: readonly string[];
}
