# Feature 055: Global Loading Indicator

## Goal

Provide reusable application-wide loading feedback for concurrent HTTP requests and manual async
work. The feature combines a signal-based request counter, a functional HTTP interceptor, and one
root loading indicator that can render either a non-blocking top bar or a viewport spinner overlay.

The blocking overlay must prevent pointer and keyboard interaction, lock page scrolling, expose
busy state to assistive technology, preserve toast interaction, and restore all affected document
state when loading finishes.

## Public API

Import public pieces from the top-level UI library barrel:

```ts
import {
  LoadingIndicatorComponent,
  LoadingService,
  loadingInterceptor,
  SKIP_LOADING_INDICATOR,
  type LoadingIndicatorVariant,
} from './shared/ui-lib';
```

Public pieces:

- `LoadingIndicatorComponent` with selector `ms-loading-indicator`
- `LoadingIndicatorVariant`: `'top-bar' | 'overlay-spinner'`
- `LoadingService` for concurrent loading state
- `loadingInterceptor: HttpInterceptorFn` for automatic HTTP request tracking
- `SKIP_LOADING_INDICATOR: HttpContextToken<boolean>` for per-request opt-out

Component inputs and defaults:

```ts
class LoadingIndicatorComponent {
  readonly variant = input<LoadingIndicatorVariant>('overlay-spinner');
  readonly spinnerVariant = input<SpinnerVariant>('ring-dot');
  readonly blocking = input(true);
  readonly ariaLabel = input('Loading');
}
```

Service state and methods:

```ts
class LoadingService {
  readonly activeCount: Signal<number>;
  readonly isLoading: Signal<boolean>;

  begin(): void;
  end(): void;
}
```

`activeCount` starts at `0`. `isLoading` is computed as `activeCount() > 0`. Both signals are
read-only to consumers.

## Desired Usage

Register the loading interceptor with the standalone HTTP provider:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';

import { loadingInterceptor } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([loadingInterceptor]))],
};
```

Place one indicator directly in the application shell. The blocking overlay with a ring-and-dot
spinner is the default:

```html
<router-outlet />
<ms-loading-indicator />
<ms-toast-outlet />
```

Select the non-blocking top bar when loading should not interrupt application interaction:

```html
<router-outlet />
<ms-loading-indicator variant="top-bar" />
<ms-toast-outlet />
```

Override `spinnerVariant` with any public spinner variant when using the overlay:

```html
<ms-loading-indicator spinnerVariant="orbit" />
```

The component manages its sibling application content automatically. Consumers do not add an
effect, `inert`, `aria-busy`, or scroll-locking logic to the root component.

Exclude an additional shell sibling from automatic busy and blocking state when it must remain
available during loading:

```html
<app-support-panel data-loading-exempt />
```

Skip loading feedback for one HTTP request:

```ts
import { HttpContext } from '@angular/common/http';

import { SKIP_LOADING_INDICATOR } from './shared/ui-lib';

const context = new HttpContext().set(SKIP_LOADING_INDICATOR, true);
http.get('/api/background-refresh', { context });
```

Manual non-HTTP work may use the same counter:

```ts
loading.begin();

saveData()
  .pipe(finalize(() => loading.end()))
  .subscribe();
```

Every successful `begin()` call must be paired with `end()`.

## Feature Structure

The implementation is split across:

- `src/app/shared/ui-lib/components/loading-indicator/` for the global visual component and variant
  type
- `src/app/shared/ui-lib/services/loading.service.ts` for the signal counter
- `src/app/shared/ui-lib/interceptors/loading-interceptor/` for request tracking and the HTTP
  context opt-out
- `src/styles/components/_loading-indicator.scss` for fixed positioning, overlay interaction, busy
  status text, and scroll locking
- `src/styles/tokens/_layout.scss` for `--z-index-loading`

The component composes `ms-progress-indicator` for the top bar and `ms-spinner` for the overlay. It
does not project consumer content.

## Counter and Interceptor Behavior

- `begin()` increments the active counter.
- `end()` decrements the counter and clamps it at `0`, so extra calls cannot produce a negative
  count.
- Concurrent work keeps `isLoading()` true until every tracked operation has ended.
- `SKIP_LOADING_INDICATOR` defaults to `false`.
- A skipped request passes directly to the next interceptor without changing the counter.
- A tracked request uses `defer()` so `begin()` runs when the request observable is subscribed.
- `finalize()` is attached outside `defer()` and always calls `end()` for completion, observable
  errors, cancellation, and synchronous errors thrown by a downstream interceptor.
- The interceptor does not alter request bodies, responses, or errors.

When registered with the API error interceptor, loading should appear first in the interceptor
array:

```ts
provideHttpClient(withInterceptors([loadingInterceptor, apiErrorInterceptor]));
```

## Indicator and Blocking Behavior

- The indicator renders only while `LoadingService.isLoading()` is true.
- `top-bar` renders a fixed indeterminate medium progress bar and never blocks interaction.
- `overlay-spinner` renders a fixed viewport backdrop and large spinner.
- `blocking` defaults to `true` but applies complete blocking only to the overlay variant.
- A non-blocking overlay has `pointer-events: none`; its visual backdrop and status remain visible
  while application interaction continues.
- During any visible loading variant, sibling application elements receive `aria-busy="true"`.
- During a blocking overlay, sibling application elements also receive `inert`, preventing pointer
  and keyboard interaction, and `body.ms-loading-blocked` prevents page scrolling.
- The indicator host, other `ms-loading-indicator` elements, `ms-toast-outlet`, and elements marked
  with `data-loading-exempt` do not receive busy or inert state.
- A child-list observer applies the same state to routed or other content added beside the
  indicator while loading is active.
- Cleanup disconnects the observer, restores each element's previous `aria-busy` and `inert`
  values, and releases the body scroll lock.
- Scroll locking is reference-counted per document so overlapping blocking indicator instances do
  not unlock the page early.

For full application blocking, place the indicator as a direct child of the application shell so
the content to block is its sibling. A nested indicator only manages siblings in its own parent.

## Styling and Layering

Feature styles are defined in `src/styles/components/_loading-indicator.scss` and forwarded from
`src/styles/components/_index.scss`.

- The top bar and overlay use `position: fixed` and `z-index: var(--z-index-loading)`.
- Layering follows `modal < loading < toast`, so loading feedback covers modal content while toast
  notifications remain visible and interactive.
- The overlay uses `--color-backdrop`.
- Only a blocking overlay enables pointer events on the overlay itself.
- The status label is visually hidden while remaining available to assistive technology.
- `body.ms-loading-blocked` uses `overflow: hidden` for scroll locking.

## Accessibility

- The overlay uses `role="status"` and `aria-live="polite"` with the configured `ariaLabel`.
- Its nested spinner is decorative because the outer status owns the announcement.
- The top bar delegates progress semantics and its accessible name to `ms-progress-indicator`.
- Busy sibling content receives `aria-busy="true"` for both visual variants.
- A blocking overlay applies native `inert` to remove underlying content from focus navigation and
  interaction.
- Toasts remain outside the inert region so error and status notifications stay perceivable and
  dismissible.
- All ARIA, inert, and scroll-lock changes are restored when loading ends or the component is
  destroyed.

## Showcase

The `/progress` showcase demonstrates:

- switching between top-bar and overlay-spinner variants
- manual overlapping work through repeated `begin()` and `end()` calls
- active-count and computed-loading state
- a non-blocking overlay so the manual completion control remains operable
- an ignored HTTP request using `SKIP_LOADING_INDICATOR`
- copyable standalone examples matching the live behavior

## Angular Rules

- Use standalone Angular APIs without `standalone: true`.
- Use signals for the counter, computed loading state, and component inputs.
- Use a functional `HttpInterceptorFn` and `inject()`.
- Keep browser DOM lifecycle behavior in `LoadingIndicatorComponent`; keep `LoadingService`
  platform-neutral and focused on state.
- Export all intentional APIs through feature, category, and root ui-lib barrels.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- All component, service, interceptor, context-token, and variant APIs are available from the root
  ui-lib barrel.
- The counter begins at zero, tracks concurrent work, and never becomes negative.
- The interceptor balances the counter on completion, error, cancellation, and synchronous
  downstream failure.
- Requests with `SKIP_LOADING_INDICATOR` do not affect loading state.
- One root `<ms-loading-indicator />` is sufficient; the application root requires no loading
  effect or signal wiring.
- Top-bar loading is non-blocking, and overlay loading blocks by default.
- Complete blocking covers pointer interaction, keyboard focus, and page scrolling.
- Toasts, other indicators, and explicitly exempt siblings remain outside inert state.
- Pre-existing `aria-busy`, `inert`, and body-lock state is restored during cleanup.
- The loading layer appears above modals and below toasts.
- The showcase includes matching live and copyable examples.
- The Angular build succeeds apart from any pre-existing bundle-budget warning.
