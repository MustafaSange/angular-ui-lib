import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MaterialIconsService } from './shared/ui-lib/services/material-icons/material-icons.service';
import { provideUiLib } from './shared/ui-lib/services/provide-ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideUiLib(),
    provideRouter(routes),
    provideEnvironmentInitializer(() => inject(MaterialIconsService).loadIcons()),
  ],
};
