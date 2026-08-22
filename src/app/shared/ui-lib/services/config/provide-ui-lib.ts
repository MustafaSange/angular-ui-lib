import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  provideEnvironmentInitializer,
} from '@angular/core';

import { DensityService } from '../density';
import { LanguageService } from '../language';
import { MaterialIconsService } from '../material-icons';
import type { UiLibConfig } from './ui-lib-config';
import { UI_LIB_CONFIG } from './ui-lib-config-token';

export function provideUiLib(config: UiLibConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UI_LIB_CONFIG, useValue: config },
    provideAppInitializer(() => inject(LanguageService).initialize()),
    provideEnvironmentInitializer(() => inject(DensityService)),
    provideEnvironmentInitializer(() => inject(MaterialIconsService).loadIcons()),
  ]);
}
