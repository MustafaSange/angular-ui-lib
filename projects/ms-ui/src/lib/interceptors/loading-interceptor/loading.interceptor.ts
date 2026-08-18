import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { defer, finalize } from 'rxjs';

import { LoadingService } from '../../services/loading.service';
import { SKIP_LOADING_INDICATOR } from './loading-context';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.context.get(SKIP_LOADING_INDICATOR)) {
    return next(request);
  }

  const loading = inject(LoadingService);

  return defer(() => {
    loading.begin();
    return next(request);
  }).pipe(finalize(() => loading.end()));
};
