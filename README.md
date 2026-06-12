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

The top-level UI library barrel exports the public shared component and service folders, including
copyable showcase helpers such as `ShowcaseCode`.

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
`src/app/shared/ui-lib/services/material-icons/icon-registry.ts`.

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
