# UI Lib

Angular showcase application for a reusable UI component library. The project uses Angular,
standalone component APIs, signals, Vitest, and SCSS design tokens.

## What is included

- Design tokens, reset styles, utilities, and component styles under `src/styles`.
- Reusable shared components under `src/app/shared/ui-lib/components`.
- Theme, direction, and Material Symbols services under `src/app/shared/ui-lib/services`.
- Feature showcase pages under `src/app/features`.
- A public in-app UI library API barrel at `src/app/shared/ui-lib`.

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
- Direction switcher
- Drawer
- Media slider
- Menu and popover
- Modal
- Pagination
- Select
- Side navigation
- Signal form field
- Slider
- Stepper
- Tabs
- Theme switcher
- Tooltip

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

This repository is currently structured as an Angular application with shared component barrels, not
as a packaged npm Angular library.
