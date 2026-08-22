import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  apiErrorInterceptor,
  cookieInterceptor,
  loadingInterceptor,
  provideUiLib,
} from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([cookieInterceptor, loadingInterceptor, apiErrorInterceptor]),
    ),
    provideUiLib({
      locales: {
        en: async () => (await import('./core/locales/en')).en,
        ar: async () => (await import('./core/locales/ar')).ar,
      },
    }),
    provideRouter(routes),
  ],
};
