import { HttpErrorResponse, HttpStatusCode, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { ToastService } from '../../components/feedback';
import { DirectionService, type LayoutDirection } from '../../services/direction.service';
import { NETWORK_ERROR_STATUS, SKIP_API_ERROR_TOAST } from './api-error-context';
import type { ApiError } from './api-error-types';

const CORRELATION_HEADER = 'X-Correlation-ID';
const CLIENT_ERROR_DURATION = 5000;
const LEFT_TO_RIGHT_ISOLATE = '\u2066';
const POP_DIRECTIONAL_ISOLATE = '\u2069';

const NETWORK_ERROR: ApiError = {
  en: 'Unable to connect to the server.',
  ar: 'تعذر الاتصال بالخادم.',
  code: '',
};

const DEFAULT_CLIENT_ERROR: ApiError = {
  en: 'The request could not be completed.',
  ar: 'تعذر إكمال الطلب.',
  code: '',
};

const SERVER_ERROR: ApiError = {
  en: 'An unexpected error occurred.',
  ar: 'حدث خطأ غير متوقع.',
  code: '',
};

const CLIENT_ERRORS: ReadonlyMap<number, ApiError> = new Map([
  [HttpStatusCode.BadRequest, { en: 'Bad request.', ar: 'طلب غير صالح.', code: '' }],
  [
    HttpStatusCode.Unauthorized,
    { en: 'Authentication required.', ar: 'المصادقة مطلوبة.', code: '' },
  ],
  [HttpStatusCode.Forbidden, { en: 'Access denied.', ar: 'تم رفض الوصول.', code: '' }],
  [
    HttpStatusCode.NotFound,
    { en: 'Resource not found.', ar: 'لم يتم العثور على المورد.', code: '' },
  ],
  [
    HttpStatusCode.MethodNotAllowed,
    { en: 'Method not allowed.', ar: 'الطريقة غير مسموح بها.', code: '' },
  ],
  [HttpStatusCode.RequestTimeout, { en: 'Request timed out.', ar: 'انتهت مهلة الطلب.', code: '' }],
  [HttpStatusCode.Conflict, { en: 'Request conflict.', ar: 'تعارض في الطلب.', code: '' }],
  [
    HttpStatusCode.Gone,
    { en: 'Resource no longer available.', ar: 'المورد لم يعد متاحًا.', code: '' },
  ],
  [
    HttpStatusCode.PayloadTooLarge,
    { en: 'Request is too large.', ar: 'حجم الطلب كبير جدًا.', code: '' },
  ],
  [
    HttpStatusCode.UnsupportedMediaType,
    { en: 'Unsupported media type.', ar: 'نوع الوسائط غير مدعوم.', code: '' },
  ],
  [
    HttpStatusCode.UnprocessableEntity,
    { en: 'Request could not be processed.', ar: 'تعذرت معالجة الطلب.', code: '' },
  ],
  [
    HttpStatusCode.TooManyRequests,
    {
      en: 'Too many requests. Please try again later.',
      ar: 'عدد كبير جدًا من الطلبات. يرجى المحاولة لاحقًا.',
      code: '',
    },
  ],
]);

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const toast = inject(ToastService);
  const direction = inject(DirectionService);
  const skippedStatuses = request.context.get(SKIP_API_ERROR_TOAST);

  return next(request).pipe(
    tap({
      error: (error: unknown) =>
        showErrorToast(error, toast, direction.direction(), skippedStatuses),
    }),
  );
};

function showErrorToast(
  error: unknown,
  toast: ToastService,
  direction: LayoutDirection,
  skippedStatuses: readonly number[],
): void {
  if (
    !(error instanceof HttpErrorResponse) ||
    skippedStatuses.includes(error.status) ||
    !isHandledStatus(error.status)
  ) {
    return;
  }

  const fallback = getFallbackError(error.status);
  const apiError = isApiError(error.error) ? error.error : undefined;
  const message =
    getLocalizedMessage(apiError, direction) ||
    (isClientError(error.status) ? getErrorBodyMessage(error.error) : '') ||
    getLocalizedMessage(fallback, direction);
  const correlationId = error.headers.get(CORRELATION_HEADER)?.trim();
  const toastMessage = appendCorrelationId(message, correlationId);

  toast.danger(toastMessage, {
    duration: isClientError(error.status) ? CLIENT_ERROR_DURATION : false,
  });
}

function appendCorrelationId(message: string, correlationId: string | undefined): string {
  if (!correlationId) {
    return message;
  }

  const isolatedCorrelationId = `${LEFT_TO_RIGHT_ISOLATE}Correlation ID: ${correlationId}${POP_DIRECTIONAL_ISOLATE}`;

  return `${message}\n${isolatedCorrelationId}`;
}

function isHandledStatus(status: number): boolean {
  return status === NETWORK_ERROR_STATUS || (status >= 400 && status <= 599);
}

function isClientError(status: number): boolean {
  return status >= 400 && status <= 499;
}

function getFallbackError(status: number): ApiError {
  if (status === NETWORK_ERROR_STATUS) {
    return NETWORK_ERROR;
  }

  if (isClientError(status)) {
    return CLIENT_ERRORS.get(status) ?? DEFAULT_CLIENT_ERROR;
  }

  return SERVER_ERROR;
}

function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate['en'] === 'string' &&
    typeof candidate['ar'] === 'string' &&
    typeof candidate['code'] === 'string'
  );
}

function getErrorBodyMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value !== 'object' || value === null) {
    return '';
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate['message'] === 'string' ? candidate['message'].trim() : '';
}

function getLocalizedMessage(error: ApiError | undefined, direction: LayoutDirection): string {
  if (!error) {
    return '';
  }

  const preferred = direction === 'rtl' ? error.ar : error.en;
  const alternative = direction === 'rtl' ? error.en : error.ar;

  return preferred.trim() || alternative.trim();
}
