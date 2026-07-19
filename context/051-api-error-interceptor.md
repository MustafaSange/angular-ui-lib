# Feature 051: API Error Interceptor

## Goal

Provide one reusable HTTP interceptor that turns API and transport failures into localized danger
toasts without consuming or replacing the original observable error.

The interceptor handles status `0` and HTTP `400–599`, supports the .NET `ApiError` response
contract, supplies localized fallbacks for malformed or missing bodies, displays correlation IDs,
and lets individual requests suppress toasts for selected statuses.

## Public API

Import interceptor APIs from the top-level UI library barrel:

```ts
import {
  apiErrorInterceptor,
  NETWORK_ERROR_STATUS,
  SKIP_API_ERROR_TOAST,
  type ApiError,
} from './shared/ui-lib';
```

Public pieces:

- `apiErrorInterceptor: HttpInterceptorFn` for global API error toast handling
- `ApiError` for the camel-case ASP.NET response body
- `SKIP_API_ERROR_TOAST` for per-request, status-specific toast suppression
- `NETWORK_ERROR_STATUS` for Angular transport errors with status `0`

Required response contract:

```ts
interface ApiError {
  readonly en: string;
  readonly ar: string;
  readonly code: string;
}
```

`code` remains part of the wire contract but is not displayed by the interceptor.

Required context contract:

```ts
const NETWORK_ERROR_STATUS = 0;

const SKIP_API_ERROR_TOAST: HttpContextToken<readonly number[]>;
```

The token defaults to an empty array, so all supported statuses use global toast handling unless a
request opts out for specific statuses.

## Desired Usage

Register the interceptor with the standalone HTTP provider:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';

import { apiErrorInterceptor } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([apiErrorInterceptor]))],
};
```

Render one toast outlet in the application shell:

```html
<router-outlet /> <ms-toast-outlet />
```

Skip selected status toasts for one request while preserving normal handling for every other
status:

```ts
import { HttpContext, HttpStatusCode } from '@angular/common/http';

import { NETWORK_ERROR_STATUS, SKIP_API_ERROR_TOAST } from './shared/ui-lib';

const context = new HttpContext().set(SKIP_API_ERROR_TOAST, [
  HttpStatusCode.NotFound,
  HttpStatusCode.Conflict,
  NETWORK_ERROR_STATUS,
]);

http.get('/api/orders/42', { context });
```

Skipping a toast does not consume the error. The request subscriber continues receiving the
original `HttpErrorResponse`.

## Feature Structure

The implementation lives in:

`src/app/shared/ui-lib/interceptors/error-interceptor`

The feature includes:

- `api-error.interceptor.ts` for interception, message resolution, and toast behavior
- `api-error-context.ts` for the public context token and network status constant
- `api-error-types.ts` for the public `ApiError` contract
- `index.ts` for feature exports

`src/app/shared/ui-lib/interceptors/index.ts` forwards the feature, and the root ui-lib barrel
exports the interceptors barrel.

## Behavior

- Attach an RxJS `tap({ error })` observer to preserve the response stream and original error.
- Ignore non-`HttpErrorResponse` errors and HTTP statuses outside `0` and `400–599`.
- Before showing a toast, read `SKIP_API_ERROR_TOAST`; suppress the toast only when the emitted
  status is present in that request's array.
- Read the active direction when the error occurs. Prefer `ar` in `rtl` and `en` in `ltr`, then
  fall back to the other non-empty localized value.
- Treat a body as `ApiError` only when `en`, `ar`, and `code` are all strings.
- For 4xx responses without a usable localized `ApiError`, accept either a trimmed string body or
  a trimmed `{ message: string }` body before using the local fallback.
- Do not expose raw string or `message` bodies for status `0` or 5xx responses. Those statuses may
  use a valid localized `ApiError`; otherwise they use the local generic fallback.
- Show every handled notification through `ToastService.danger()` without adding a toast title.
- Set 4xx toast duration to `5000ms`.
- Set status `0` and 5xx toast duration to `false` so they remain until manually dismissed.

Message precedence:

1. localized message from a valid `ApiError`
2. trimmed string or `{ message: string }` body for 4xx only
3. localized status-specific fallback

Fallback errors use the same `ApiError` structure with `code: ''`:

| Status    | English                                    | Arabic                                          |
| --------- | ------------------------------------------ | ----------------------------------------------- |
| `0`       | Unable to connect to the server.           | تعذر الاتصال بالخادم.                           |
| `400`     | Bad request.                               | طلب غير صالح.                                   |
| `401`     | Authentication required.                   | المصادقة مطلوبة.                                |
| `403`     | Access denied.                             | تم رفض الوصول.                                  |
| `404`     | Resource not found.                        | لم يتم العثور على المورد.                       |
| `405`     | Method not allowed.                        | الطريقة غير مسموح بها.                          |
| `408`     | Request timed out.                         | انتهت مهلة الطلب.                               |
| `409`     | Request conflict.                          | تعارض في الطلب.                                 |
| `410`     | Resource no longer available.              | المورد لم يعد متاحًا.                           |
| `413`     | Request is too large.                      | حجم الطلب كبير جدًا.                            |
| `415`     | Unsupported media type.                    | نوع الوسائط غير مدعوم.                          |
| `422`     | Request could not be processed.            | تعذرت معالجة الطلب.                             |
| `429`     | Too many requests. Please try again later. | عدد كبير جدًا من الطلبات. يرجى المحاولة لاحقًا. |
| Other 4xx | The request could not be completed.        | تعذر إكمال الطلب.                               |
| 5xx       | An unexpected error occurred.              | حدث خطأ غير متوقع.                              |

## Correlation ID and Direction

- Read `X-Correlation-ID` from `HttpErrorResponse.headers` and trim its value.
- Omit the correlation line when the header is missing or blank.
- Append a present value on a new line as `Correlation ID: <value>`.
- Wrap the correlation line with Unicode left-to-right isolate (`U+2066`) and pop directional
  isolate (`U+2069`) controls so labels, punctuation, UUIDs, and other identifiers remain ordered
  inside RTL toast content.
- Preserve line breaks through `.ms-toast-message { white-space: pre-line; }` in
  `src/styles/components/_feedback.scss`.
- For a cross-origin API, the server must include `X-Correlation-ID` in
  `Access-Control-Expose-Headers`; otherwise browser code cannot read the response header.

## Accessibility

- Error notifications use the existing danger-toast semantics: `role="alert"` and
  `aria-live="assertive"`.
- Persistent status `0` and 5xx toasts remain manually dismissible through the existing toast close
  button.
- The localized message and correlation ID remain text content and are announced with the toast.
- Bidirectional isolation changes visual ordering only and does not add visible characters.

## Angular Rules

- Use a functional `HttpInterceptorFn` and standalone `provideHttpClient(withInterceptors(...))`
  registration.
- Use `inject()` for `ToastService` and `DirectionService`.
- Keep strict TypeScript and avoid `any`.
- Keep reusable response types and context APIs in focused sibling files.
- Export intentional APIs through the feature, interceptors, and root ui-lib barrels.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `apiErrorInterceptor`, `ApiError`, `SKIP_API_ERROR_TOAST`, and `NETWORK_ERROR_STATUS` are public
  through the root ui-lib barrel.
- The application registers the interceptor through `provideHttpClient(withInterceptors(...))` and
  renders one `ms-toast-outlet`.
- Status `0` and all `400–599` errors show localized danger toasts unless that status is skipped by
  request context.
- Valid `ApiError`, raw 4xx message, and fallback precedence matches this specification.
- Mapped 4xx statuses use their documented fallback; unmapped 4xx and 5xx statuses use their
  documented generic fallback.
- 4xx toasts dismiss after five seconds; status `0` and 5xx toasts remain until dismissed.
- A readable correlation header appears after the message and remains correctly ordered in both
  LTR and RTL layouts.
- The original `HttpErrorResponse` continues to the subscriber unchanged.
- The Angular build succeeds apart from any pre-existing bundle-budget warning.
