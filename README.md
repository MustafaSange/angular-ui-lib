# UI Lib

Angular showcase application for a reusable UI component library. The project uses Angular,
standalone component APIs, signals, Vitest, and SCSS design tokens.

## What is included

- Design tokens, reset styles, utilities, and component styles under `src/styles`.
- Reusable shared components under `src/app/shared/components`.
- Theme, direction, and Material Symbols services under `src/app/shared/services`.
- Feature showcase pages under `src/app/features`.
- A public in-app shared API barrel at `src/app/shared`.

## Component API

Import shared components and services from the top-level shared barrel when working inside the
application:

```ts
import { BadgeComponent, ThemeService } from './shared';
```

Feature folders also keep focused barrels for narrower imports:

```ts
import { ButtonToggleGroup, ButtonToggleDirective } from './shared/components/button-toggle';
```

The top-level barrel exports the public shared component and service folders. Showcase-only helpers
such as `ShowcaseCode` remain available from their own folder and are intentionally omitted from the
main component barrel.

## Available shared components

- Accordion
- Alerts and toasts
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
- Menu and popover
- Modal
- Pagination
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
Fonts stylesheet for the icons listed in `src/app/shared/services/material-icons/icon-registry.ts`.

## Example

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BadgeComponent } from './shared';

@Component({
  selector: 'app-status-example',
  imports: [BadgeComponent],
  template: `
    <ms-badge variant="success">Active</ms-badge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
- Use `ChangeDetectionStrategy.OnPush`.
- Use native Angular template control flow.
- Keep shared component selectors on the `ms-` prefix.
- Keep shared component styles RTL-safe with logical CSS properties.
- Put reusable public types in sibling files and re-export them from each feature folder barrel.

## Notes

This repository is currently structured as an Angular application with shared component barrels, not
as a packaged npm Angular library.
