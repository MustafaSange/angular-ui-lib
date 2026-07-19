import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';

import { UI_LIB_CONFIG } from './density-config';
import { DensityService } from './density.service';
import { MaterialIconsService } from './material-icons/material-icons.service';
import type { UiLibConfig } from './ui-lib-config';

export function provideUiLib(config: UiLibConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UI_LIB_CONFIG, useValue: config },
    provideEnvironmentInitializer(() => inject(DensityService)),
    provideEnvironmentInitializer(() => inject(MaterialIconsService).loadIcons()),
  ]);
}
