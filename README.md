# UI Lib

Angular 22 showcase application and locally packaged reusable UI component library. The project
uses standalone component APIs, signals, Vitest, and SCSS design tokens.

## What is included

- Design tokens, reset styles, utilities, and component styles under `src/styles`.
- Reusable shared components under `src/app/shared/ui-lib/components`.
- Reusable directives, pipes, HTTP interceptors, services, public types, and search-query helpers
  under `src/app/shared/ui-lib`.
- Theme, direction, density, loading, Material Symbols, table clipboard, and value-viewer services.
- Feature showcase pages under `src/app/features`.
- A public in-app UI library API barrel at `src/app/shared/ui-lib`.
- A locally installable Angular library package under `projects/ms-ui`.

## Component API

Import shared components and services from the top-level shared barrel when working inside the
application:

```ts
import { BadgeComponent, ThemeService } from './shared/ui-lib';
```

Feature folders also keep focused barrels for narrower implementation imports, but showcase
copy/paste snippets should use the top-level barrel:

```ts
import { ButtonToggleGroup, ButtonToggleDirective } from './shared/ui-lib';
```

The top-level UI library barrel exports the public shared component, directive, service, pipe, and
type folders. The app-only `ShowcaseCode` helper remains under `src/app/shared/showcase-code` and is
not part of the reusable library API.

## Available shared components

- Accordion
- Alerts and toasts
- Autocomplete
- Badge
- Bottom sheet
- Breadcrumb
- Button toggle
- Card
- Chip
- Choice controls
- Clipboard copy
- Confirm dialog
- Date picker
- Date-time picker
- Direction switcher
- Drawer
- File upload
- Loading indicator
- Media slider
- Menu and popover
- Modal
- OTP input
- Pagination
- Progress indicator and spinner
- Search query form
- Select
- Side navigation
- Signal form field
- Slider
- Stepper
- Table search
- Tabs
- Theme customizer
- Theme switcher
- Time picker
- Timeline
- Tooltip
- Tree
- Value viewer

The public barrel also exports the density and overflow-navigation directives; the format JSON,
highlight, and time-ago pipes; search-query helpers; and the cookie, loading, and API-error HTTP
interceptors.

## Styles and theme

Global styles are loaded from `src/styles.scss`:

```scss
@use './styles/index';
```

Theme mode is controlled by `ThemeService`, which writes `data-theme` to the document element.
Direction is controlled by `DirectionService`, which writes `dir` to the document element. Component
styles use logical CSS properties so layouts can mirror in both left-to-right and right-to-left
contexts.

Material Symbols support is handled by `MaterialIconsService`, which injects the configured Google
Fonts stylesheet for the icons listed in
`src/app/shared/ui-lib/services/material-icons/icon-registry.ts`. Applications can extend that
default subset when configuring the library:

```ts
import { ApplicationConfig } from '@angular/core';

import { provideUiLib } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideUiLib({
      additionalMaterialIcons: ['home', 'notifications'],
    }),
  ],
};
```

The configured names are merged with the defaults, deduplicated, and loaded automatically during
application startup.

## Interface density

The library supports `default` and `compact` density modes. Default density preserves the existing
control sizes. Compact density reduces common 28px controls to 24px while keeping control text at
14px and interactive targets at or above the WCAG 2.2 minimum target size.

Configure density once when the application starts:

```ts
import { ApplicationConfig } from '@angular/core';

import { provideUiLib } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [provideUiLib({ density: 'compact' })],
};
```

Applications can also change density at runtime. The service intentionally does not persist the
selection; applications can connect it to their own user or tenant preference storage.

```ts
import { Component, inject } from '@angular/core';

import { DensityService } from './shared/ui-lib';

@Component({
  selector: 'app-density-control',
  template: `
    <button class="btn btn-outline" type="button" (click)="useCompactDensity()">
      Use compact density
    </button>
  `,
})
export class DensityControl {
  private readonly densityService = inject(DensityService);

  useCompactDensity(): void {
    this.densityService.setDensity('compact');
  }
}
```

Use `msDensity` to override one control or a complete subtree. The nearest override wins.

```ts
import { Component } from '@angular/core';

import { DensityDirective } from './shared/ui-lib';

@Component({
  selector: 'app-density-override',
  imports: [DensityDirective],
  template: `
    <section msDensity="compact">
      <button class="btn btn-primary" type="button">Compact action</button>

      <div msDensity="default">
        <button class="btn btn-outline" type="button">Default-size exception</button>
      </div>
    </section>
  `,
})
export class DensityOverride {}
```

Density applies to form controls, buttons, pickers, option lists, navigation controls, and tables.
Existing `size` inputs and classes continue to select a relative size tier within the active
density. General page, card, drawer, and dialog spacing is not reduced automatically. Keep default
density for touch-heavy interfaces; compact density is intended for data-dense enterprise
workflows.

## HTTP Interceptors and Global Loading

The library provides three functional HTTP interceptors:

- `cookieInterceptor` enables `withCredentials` for browser-managed cookies. Cross-origin APIs
  must allow credentialed CORS requests and should retain an appropriate CSRF defense.
- `loadingInterceptor` tracks concurrent requests through `LoadingService`.
- `apiErrorInterceptor` displays localized API and network failures through danger toasts while
  preserving the original error for subscribers.

Register them in this order with Angular's standalone HTTP provider:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

import {
  apiErrorInterceptor,
  cookieInterceptor,
  loadingInterceptor,
  provideUiLib,
} from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([cookieInterceptor, loadingInterceptor, apiErrorInterceptor]),
    ),
    provideUiLib(),
  ],
};
```

Place the corresponding outlets and one loading indicator in the application shell. The loading
indicator defaults to a blocking viewport overlay using the `ring-dot` spinner. Set
`variant="top-bar"` for non-blocking progress feedback.

```html
<router-outlet />
<ms-modal-outlet />
<ms-loading-indicator />
<ms-toast-outlet />
```

The loading counter remains active until all overlapping requests complete. Manual work can use
`LoadingService.begin()` and `LoadingService.end()`; every `begin()` must be paired with `end()`.
Skip automatic loading feedback for one background request with an HTTP context:

```ts
import { HttpContext } from '@angular/common/http';

import { SKIP_LOADING_INDICATOR } from './shared/ui-lib';

const context = new HttpContext().set(SKIP_LOADING_INDICATOR, true);
http.get('/api/background-refresh', { context });
```

Use `SKIP_API_ERROR_TOAST` similarly with an array of HTTP status codes when a request handles
specific failures locally.

## Modal Updates

`ModalService` supports `sm`, `md`, `lg`, `xl`, and `fullscreen` size presets plus explicit
`width`, `maxWidth`, and `maxHeight` overrides. Service-opened modals can disable Escape, backdrop,
or close-button dismissal and can protect unsaved work with a synchronous or asynchronous
`canClose` guard.

`ModalRef.close()` returns a `Promise<boolean>` indicating whether the close was accepted.
`afterClosedWithReason()` reports both the typed result and one of `action`, `close-button`,
`backdrop`, `escape`, or `programmatic`.

```ts
const modalRef = modalService.open(EditUserModal, {
  size: 'lg',
  data: { userId: 'user-1' },
  canClose: async ({ reason }) => reason === 'action' || confirmDiscardChanges(),
});

modalRef.afterClosedWithReason().subscribe(({ result, reason }) => {
  console.log({ result, reason });
});
```

## Value Inspection and Clipboard Utilities

`ValueViewerService` opens text or structured data in the modal system with safe, case-insensitive
search navigation and compact clipboard output. Mount `ms-modal-outlet` once in the application
shell before using the service.

```ts
import { Component, inject } from '@angular/core';

import { ValueViewerService } from './shared/ui-lib';

@Component({
  selector: 'app-api-response',
  template: `<button type="button" (click)="viewResponse()">View Response</button>`,
})
export class ApiResponse {
  private readonly valueViewer = inject(ValueViewerService);

  protected viewResponse(): void {
    this.valueViewer.open(
      { project: 'UI library', version: 22 },
      { title: 'API Response', width: '56rem' },
    );
  }
}
```

`HighlightPipe` returns matching and non-matching text parts rather than HTML, allowing consumers
to render matches safely with Angular interpolation and `<mark>`. Matching is literal,
case-insensitive, and preserves the original text.

`TableClipboardService.copyTable()` and `copyRow()` write both sanitized HTML and tab-separated
plain text when supported, with a plain-text fallback. Rows, cells, or descendants marked with
`data-no-copy` are excluded by default; pass a custom `excludeSelector` or `null` to change that
behavior.

```ts
const result = await tableClipboard.copyTable(tableElement);

const rowResult = await tableClipboard.copyRow(rowElement, {
  excludeSelector: '[data-no-copy], [data-private]',
});
```

## Showcase examples

Feature showcase pages keep hand-authored copy/paste snippets in their `.ts` files and render them
with `<app-showcase-code>` near the matching visual example. Form-field variants, including the
autocomplete variants, keep their snippet directly below the rendered control.

## Example

```ts
import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-status-example',
  imports: [BadgeComponent],
  template: ` <ms-badge kind="success">Active</ms-badge> `,
})
export class StatusExample {}
```

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
npm run build
```

This compiles the application and stores build artifacts in `dist/`.

## Building and Using the Local Library

Build the reusable package separately from the showcase application:

```bash
npm run build-ui-lib
```

The latest package is written to `dist/ms-ui`, with a versioned snapshot such as
`dist/ms-ui-0.5.1`. See the
[`MS UI` consumer guide](projects/ms-ui/README.md) for local installation, styles, provider setup,
component imports, and version updates in another Angular application.

## Running unit tests

To execute unit tests with Vitest, run:

```bash
npm test
```

## Project conventions

- Use standalone Angular APIs.
- Prefer signals and `inject()`.
- Prefer `@Service()` for root-provided services instead of `@Injectable({ providedIn: 'root' })`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Use native Angular template control flow.
- Keep shared component selectors on the `ms-` prefix.
- Keep shared component styles RTL-safe with logical CSS properties.
- Put reusable public types in sibling files and re-export them from each feature folder barrel.

## Notes

This repository contains both the Angular showcase application and the `ms-ui` Angular library.
The library is currently distributed from local versioned build folders rather than through the
npm registry.
