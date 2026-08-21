import type { HttpInterceptorFn } from '@angular/common/http';

export const cookieInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.withCredentials) {
    return next(request);
  }

  return next(request.clone({ withCredentials: true }));
};
