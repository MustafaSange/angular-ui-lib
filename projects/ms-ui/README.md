# MS UI

MS UI is the reusable Angular 22 component library built from this repository. It is distributed
from a local versioned folder and does not need to be published to the npm registry.

## Build the Library

From the UI library workspace, run:

```bash
npm run build-ui-lib
```

This command synchronizes the reusable source and styles into `projects/ms-ui`, builds the latest
package under `dist/ms-ui`, and creates a versioned snapshot such as `dist/ms-ui-0.5.1`.

The unversioned folder supports local workspace development. Install the versioned folder in other
applications so each dependency points to a specific build.

## Install in an Angular Application

From the consuming Angular application's directory, install the built folder. For example, if the
library workspace and application are sibling folders:

```text
workspace/
├── ui-lib/
└── customer-portal/
```

run this inside `customer-portal`:

```bash
npm install ../ui-lib/dist/ms-ui-0.5.1
```

npm records the local dependency in the application's `package.json`:

```json
{
  "dependencies": {
    "ms-ui": "file:../ui-lib/dist/ms-ui-0.5.1"
  }
}
```

Replace `0.5.1` with the version that should be installed, and adjust the relative path when the
projects are stored elsewhere. The consuming application must use a compatible Angular version;
this build currently requires Angular 22.

## Load the Library Styles

Add the library Sass entry point at the beginning of the consuming application's global
`src/styles.scss`:

```scss
@use 'ms-ui/styles';
```

Restart `ng serve` after adding or changing a global stylesheet. Components will render without
the design tokens and component styles if this step is omitted.

## Register the Library Providers

Add `provideUiLib()` to the consuming application's `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideUiLib } from 'ms-ui';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideUiLib(), provideRouter(routes)],
};
```

### Startup Configuration Options

`provideUiLib()` currently accepts these options:

| Option | Allowed Value | Default | Behavior |
| --- | --- | --- | --- |
| `density` | `'default'` or `'compact'` | `'default'` | Sets the initial control density on the document. |
| `additionalMaterialIcons` | `readonly string[]` | `[]` | Adds Material Symbol names to the library's built-in icon set. Duplicate names are removed. |

An example using every startup option:

```ts
provideUiLib({
  density: 'compact',
  additionalMaterialIcons: ['home', 'notifications'],
});
```

Material Symbols are loaded from Google Fonts at application startup, so icon loading requires
network access unless the consuming application provides its own font setup.

Theme mode and layout direction are controlled at runtime through services rather than
`provideUiLib()`. They restore their most recently selected values from browser local storage.

### Theme Settings

The theme setup has three required parts:

1. Load `@use 'ms-ui/styles';` in the application's global SCSS.
2. Register `provideUiLib()` in `app.config.ts`.
3. Render a library theme control or inject `ThemeService` somewhere in the application.

When `ThemeService` starts, it reads the saved preference and writes one of these attributes to the
root `<html>` element:

```html
<html data-theme="light">
<html data-theme="dark">
<html data-theme="system">
```

The global library stylesheet responds to that attribute and applies the appropriate CSS tokens.
`system` uses the browser's `prefers-color-scheme` setting. On the first visit, when there is no
stored preference, the service defaults to `system`.

#### Use the Ready-Made Theme Controls

`ThemeSwitcher` provides Light, Dark, and System buttons. `ThemeCustomizer` provides color inputs
for all customizable semantic colors. Import either or both into a standalone component:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeCustomizer, ThemeSwitcher } from 'ms-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitcher, ThemeCustomizer],
  template: `
    <header>
      <ms-theme-switcher />
      <ms-theme-customizer />
    </header>

    <router-outlet />
  `,
})
export class App {}
```

Rendering either component also creates `ThemeService`, so the stored theme is applied
automatically. No click-handler code is required in the application.

#### Create Custom Theme Controls

Inject `ThemeService` when the application needs its own settings interface:

```ts
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ms-ui';

@Component({
  selector: 'app-theme-settings',
  template: `
    <button type="button" (click)="theme.setMode('light')">Light</button>
    <button type="button" (click)="theme.setMode('dark')">Dark</button>
    <button type="button" (click)="theme.setMode('system')">System</button>
  `,
})
export class ThemeSettings {
  protected readonly theme = inject(ThemeService);
}
```

The current value is an Angular signal and can be displayed reactively:

```html
<p>Current preference: {{ theme.mode() }}</p>
```

To force a particular mode during application startup, call `setMode()` from the root component:

```ts
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ms-ui';

@Component({
  selector: 'app-root',
  template: `<main>Application content</main>`,
})
export class App {
  private readonly theme = inject(ThemeService);

  constructor() {
    this.theme.setMode('dark');
  }
}
```

This deliberately replaces the user's saved selection on every startup. Omit the call when the
application should restore the user's preference, which is the recommended behavior.

#### Configure the Theme in `app.config.ts`

Use `provideEnvironmentInitializer()` when the application should configure its theme centrally
instead of doing so from a component:

```ts
import {
  ApplicationConfig,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideUiLib, ThemeService } from 'ms-ui';

import { routes } from './app.routes';

function initializeTheme(): void {
  // Resolve ThemeService inside Angular's environment-initializer injection context.
  const theme = inject(ThemeService);

  // Apply dark mode to the root <html> element.
  theme.setMode('dark');

  // Generate and apply custom primary and success color ramps.
  theme.setColor('primary', '#2563eb');
  theme.setColor('success', '#16a34a');
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Register the library before running its theme initializer.
    provideUiLib(),
    provideEnvironmentInitializer(initializeTheme),
    provideRouter(routes),
  ],
};
```

The initializer runs during application startup, before the root component is created. It creates
`ThemeService`, writes `data-theme="dark"` to `<html>`, applies the requested colors, and persists
those values to browser local storage.

Because the initializer calls the setters on every startup, it intentionally overrides any theme
mode or semantic colors previously selected by the user. Use this approach for a fixed application
or tenant theme. To preserve user choices, register `provideUiLib()` normally and let
`ThemeService`, `ThemeSwitcher`, or `ThemeCustomizer` restore the stored settings instead.

To configure only one aspect, omit the other setter calls. For example, this keeps the restored
theme mode but always applies the application's primary brand color:

```ts
function initializeBrandColor(): void {
  inject(ThemeService).setColor('primary', '#2563eb');
}
```

Available theme settings:

| API | Allowed Value | Behavior |
| --- | --- | --- |
| `mode()` | `'light'`, `'dark'`, or `'system'` | Read the active theme-mode signal. |
| `setMode(mode)` | `'light'`, `'dark'`, or `'system'` | Set and persist the theme mode. |
| `colorCustomizations()` | A partial semantic-color record | Read the customized-color signal. |
| `setColor(name, value)` | Semantic color and six-digit hex color | Set and persist a semantic color ramp. Invalid colors are ignored. |
| `resetColor(name)` | Semantic color | Restore one semantic color to its stylesheet value. |
| `resetColors()` | No arguments | Restore every semantic color to its stylesheet value. |

The customizable semantic colors are:

```text
primary, secondary, accent, success, warning, danger, info
```

Color values must use six-digit hexadecimal notation, for example:

```ts
// Create and apply a primary color ramp based on this blue base color.
theme.setColor('primary', '#2563eb');

// Create and apply a success color ramp based on this green base color.
theme.setColor('success', '#16a34a');

// Remove only the primary customization and restore the default primary color ramp.
theme.resetColor('primary');

// Remove every semantic color customization and restore all default color ramps.
theme.resetColors();
```

`setColor()` generates a complete `50` through `900` color ramp from the supplied base color and
sets those CSS custom properties on `<html>`. All MS UI components using that semantic color update
immediately in both light and dark modes.

Applications can also use the library's active theme tokens in their own SCSS:

```scss
.application-page {
  min-block-size: 100dvh;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.application-panel {
  border: var(--border-width-sm) solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.application-link {
  color: var(--color-link);
}
```

Common theme-aware tokens include:

| Purpose | Token |
| --- | --- |
| Page background | `--color-background` |
| Standard and raised surfaces | `--color-surface`, `--color-surface-raised` |
| Primary, secondary, and muted text | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` |
| Standard and strong borders | `--color-border`, `--color-border-strong` |
| Brand and feedback colors | `--color-primary`, `--color-secondary`, `--color-success`, `--color-warning`, `--color-danger`, `--color-info` |
| Links | `--color-link`, `--color-link-hover` |
| Focus | `--color-focus-ring` |

Theme mode and color customizations are persisted under `ui-lib-theme` and
`ui-lib-theme-colors` in browser local storage. `resetColor()` and `resetColors()` also update that
stored customization state.

### Direction Settings

Inject `DirectionService` to switch between left-to-right and right-to-left layouts:

```ts
import { Component, inject } from '@angular/core';
import { DirectionService } from 'ms-ui';

@Component({
  selector: 'app-direction-settings',
  template: `
    <button type="button" (click)="direction.setDirection('ltr')">Left to Right</button>
    <button type="button" (click)="direction.setDirection('rtl')">Right to Left</button>
  `,
})
export class DirectionSettings {
  protected readonly direction = inject(DirectionService);
}
```

Available direction settings:

| API | Allowed Value | Behavior |
| --- | --- | --- |
| `direction()` | `'ltr'` or `'rtl'` | Read the active direction signal. |
| `setDirection(direction)` | `'ltr'` or `'rtl'` | Set the document direction and persist it. |

Direction is persisted under `ms-direction` in browser local storage and defaults to `'ltr'` when
no valid stored value exists.

### Density Settings

The startup density can be changed later through `DensityService`:

```ts
import { Component, inject } from '@angular/core';
import { DensityService } from 'ms-ui';

@Component({
  selector: 'app-density-settings',
  template: `
    <button type="button" (click)="density.setDensity('default')">Default Density</button>
    <button type="button" (click)="density.setDensity('compact')">Compact Density</button>
  `,
})
export class DensitySettings {
  protected readonly density = inject(DensityService);
}
```

Available density settings:

| API | Allowed Value | Behavior |
| --- | --- | --- |
| `density()` | `'default'` or `'compact'` | Read the active density signal. |
| `setDensity(density)` | `'default'` or `'compact'` | Set the document density for the current application session. |

Unlike theme and direction, `DensityService` does not persist runtime changes. The consuming
application can store its preferred density and pass it to `provideUiLib()` on the next startup.

## Available Public APIs

The package currently includes these reusable component families:

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

The public `ms-ui` entry point also exports:

- Density and overflow-navigation directives
- Format JSON, highlight, and time-ago pipes
- Search-query builders, reconciliation helpers, and public query types
- Cookie, loading, and API-error HTTP interceptors
- Theme, direction, density, loading, Material Symbols, and table clipboard services

## HTTP Interceptors and Global Loading

MS UI provides three functional interceptors that can be registered together:

- `cookieInterceptor` enables `withCredentials` for browser-managed cookies.
- `loadingInterceptor` tracks concurrent requests through `LoadingService`.
- `apiErrorInterceptor` shows localized danger toasts for API and network errors without consuming
  the original error.

Register them in this order in `app.config.ts`:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  apiErrorInterceptor,
  cookieInterceptor,
  loadingInterceptor,
  provideUiLib,
} from 'ms-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([cookieInterceptor, loadingInterceptor, apiErrorInterceptor]),
    ),
    provideUiLib(),
  ],
};
```

For cross-origin cookie authentication, the API must allow credentialed CORS requests and use
cookie attributes appropriate for the deployment. Enabling credentials does not replace the
server's CSRF protection.

Import and render one loading indicator and toast outlet in the application shell. The loading
indicator defaults to a blocking viewport overlay with a `ring-dot` spinner. Use
`variant="top-bar"` for non-blocking progress feedback.

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingIndicatorComponent, ToastOutletComponent } from 'ms-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingIndicatorComponent, ToastOutletComponent],
  template: `
    <router-outlet />
    <ms-loading-indicator />
    <ms-toast-outlet />
  `,
})
export class App {}
```

The loading counter remains active until all overlapping requests finish. Manual asynchronous work
can call `LoadingService.begin()` and `LoadingService.end()`; pair every `begin()` with `end()`.

Skip loading feedback for one request with `SKIP_LOADING_INDICATOR`:

```ts
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADING_INDICATOR } from 'ms-ui';

const context = new HttpContext().set(SKIP_LOADING_INDICATOR, true);
http.get('/api/background-refresh', { context });
```

Use `SKIP_API_ERROR_TOAST` with an array of HTTP status codes when a request handles selected
failures locally. Both context tokens preserve the normal request, response, and error flow.

## Modal Configuration and Close Handling

Mount `ModalOutletComponent` once in the application shell to use `ModalService` and other
service-opened features such as `ValueViewerService`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalOutletComponent } from 'ms-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalOutletComponent],
  template: `
    <router-outlet />
    <ms-modal-outlet />
  `,
})
export class App {}
```

`ModalService` supports `sm`, `md`, `lg`, `xl`, and `fullscreen` size presets; explicit `width`,
`maxWidth`, and `maxHeight` values; optional Escape, backdrop, and close-button dismissal; and
synchronous or asynchronous `canClose` guards.

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

`ModalRef.close()` returns a `Promise<boolean>` indicating whether the close was accepted.
`afterClosedWithReason()` reports both the typed result and an `action`, `close-button`, `backdrop`,
`escape`, or `programmatic` reason. Use `{ force: true }` with `close()` or `closeAll()` only when a
guard must intentionally be bypassed.

## Value Viewer, Highlighting, and Table Clipboard

`ValueViewerService` opens unknown text or structured values in the modal system. The viewer safely
formats values, supports literal case-insensitive search with wrapped match navigation, and copies
a compact representation.

```ts
import { Component, inject } from '@angular/core';
import { ValueViewerService } from 'ms-ui';

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

Consumers that own the visibility state can instead import `ValueViewerComponent` and render
`<ms-value-viewer [value]="value" (close)="..." />` declaratively.

`HighlightPipe` returns `HighlightPart[]` rather than HTML. Render matched parts with `<mark>` and
all text through Angular interpolation; matching is literal, case-insensitive, and preserves the
source content.

`TableClipboardService.copyTable()` and `copyRow()` write sanitized HTML plus tab-separated plain
text when rich clipboard access is available, then fall back to plain text. Elements marked with
`data-no-copy` are excluded by default.

```ts
const result = await tableClipboard.copyTable(tableElement);

const rowResult = await tableClipboard.copyRow(rowElement, {
  excludeSelector: '[data-no-copy], [data-private]',
});
```

Pass `excludeSelector: null` to disable exclusions. Clipboard and selector failures return
`'failed'` rather than throwing.

## Import and Use a Component

All public components, directives, services, pipes, helpers, and types are imported from `ms-ui`.
Do not import files from the package's internal `lib` folder.

```ts
import { Component } from '@angular/core';
import { BadgeComponent } from 'ms-ui';

@Component({
  selector: 'app-status',
  imports: [BadgeComponent],
  template: ` <ms-badge kind="success" dot>Active</ms-badge> `,
})
export class Status {}
```

The component can then be used wherever `Status` is rendered. Every standalone MS UI component or
directive used by another standalone component must appear in that component's `imports` array.

## Update the Local Library

Create and build a new semantic version from the UI library workspace:

```bash
npm run version-ui-lib:patch
npm run version-ui-lib:minor
npm run version-ui-lib:major
```

Only run the command matching the intended release. From the consuming application, refresh the
local dependency and restart its development server:

For example, after a patch release changes `0.5.1` to `0.5.2`, install its new versioned folder:

```bash
npm install ../ui-lib/dist/ms-ui-0.5.2
```

Verify the version visible to the consuming application:

```bash
node -p "require('./node_modules/ms-ui/package.json').version"
```

## Troubleshooting

- If Angular reports that `ms-badge` or another element is unknown, add its component class to the
  consuming standalone component's `imports` array.
- If components are unstyled, confirm `@use 'ms-ui/styles';` is present in the global SCSS file.
- If the `ms-ui` import cannot be resolved, build the library first and repeat the local install.
- If an older build remains visible, restart `ng serve` after rebuilding and reinstalling.
- If npm reports incompatible peer dependencies, align the consuming application's Angular major
  version with the library.
