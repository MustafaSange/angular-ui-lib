# Feature 056: Cookie Interceptor

## Goal

Provide one reusable HTTP interceptor that includes browser-managed credentials with every request
sent through Angular `HttpClient`.

The primary use case is cookie-based authentication when the API is hosted on another origin. The
interceptor removes the need for consumers to repeat `{ withCredentials: true }` on individual
requests while leaving request bodies, headers, responses, and errors unchanged.

## Public API

Import the interceptor from the top-level UI library barrel:

```ts
import { cookieInterceptor } from './shared/ui-lib';
```

Public pieces:

- `cookieInterceptor: HttpInterceptorFn` for including credentials with Angular HTTP requests

The feature does not expose configuration, context tokens, services, or additional public types.

## Desired Usage

Register the interceptor with the standalone HTTP provider:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';

import {
  apiErrorInterceptor,
  cookieInterceptor,
  loadingInterceptor,
} from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([cookieInterceptor, loadingInterceptor, apiErrorInterceptor]),
    ),
  ],
};
```

After registration, consumers use `HttpClient` normally:

```ts
http.get<Order[]>('/api/orders');
```

Consumers do not need to set `withCredentials` on each request.

## Feature Structure

The implementation lives in:

`src/app/shared/ui-lib/interceptors/cookie-interceptor`

The feature includes:

- `cookie.interceptor.ts` for cloning requests with credentials enabled
- `index.ts` for the feature export

`src/app/shared/ui-lib/interceptors/index.ts` forwards the feature, and the root ui-lib barrel
exports the interceptors barrel.

## Behavior

- Implement the feature as a functional `HttpInterceptorFn`.
- If `request.withCredentials` is already `true`, pass the original request to `next()` without
  cloning it.
- Otherwise, clone the immutable request with `{ withCredentials: true }` and pass the clone to
  `next()`.
- Apply the behavior to every request sent through the `HttpClient` instance that registers the
  interceptor, regardless of URL, origin, method, response type, or body type.
- Do not add, remove, or rewrite headers manually. In particular, do not construct a `Cookie`
  header; browsers manage cookie attachment and prohibit application code from setting that
  header directly.
- Do not subscribe to, transform, retry, catch, or replace the downstream observable.
- Preserve request bodies, parameters, context, report-progress settings, response types,
  responses, progress events, and errors.
- Keep the interceptor stateless and free of injected dependencies.

Register `cookieInterceptor` first when it is combined with the loading and API error interceptors:

```ts
provideHttpClient(
  withInterceptors([cookieInterceptor, loadingInterceptor, apiErrorInterceptor]),
);
```

The cookie interceptor does not otherwise depend on interceptor ordering.

## Browser and Server Requirements

- Same-origin cookies continue to follow normal browser cookie rules.
- For a cross-origin API, the server must return
  `Access-Control-Allow-Credentials: true` and an explicit allowed origin matching the frontend.
  A wildcard `Access-Control-Allow-Origin: *` is not valid for a credentialed CORS request.
- Authentication cookies intended for cross-site use must be issued with attributes compatible
  with the deployment, commonly `SameSite=None; Secure` over HTTPS.
- Cookie domain, path, expiry, secure-context, same-site, third-party-cookie, and browser privacy
  policies still determine whether a cookie is actually stored or sent.
- Enabling credentials does not provide CSRF protection. The server must retain an appropriate
  CSRF defense for state-changing requests.

## Angular Rules

- Use a functional `HttpInterceptorFn` and standalone
  `provideHttpClient(withInterceptors(...))` registration.
- Keep strict TypeScript and avoid `any`.
- Do not introduce a service or dependency injection for this stateless behavior.
- Export the interceptor through the feature, interceptors, and root ui-lib barrels.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `cookieInterceptor` is publicly available through the root ui-lib barrel.
- The application registers it through `provideHttpClient(withInterceptors(...))`.
- Every intercepted request reaches the next handler with `withCredentials === true`.
- A request that already has `withCredentials === true` is forwarded without cloning.
- The interceptor does not manually set a `Cookie` header or alter other request properties.
- Responses, progress events, and errors pass through unchanged.
- Existing loading and API error interceptor behavior remains unchanged when all three are
  registered together.
- The Angular build succeeds apart from any pre-existing bundle-budget warning.
