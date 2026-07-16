import { InjectionToken } from '@angular/core';

import type { UiLibConfig } from './ui-lib-config';

export const UI_LIB_CONFIG = new InjectionToken<UiLibConfig>('UI_LIB_CONFIG', {
  factory: () => ({}),
});
