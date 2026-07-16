# Feature 049: Interface Density

## Goal

Provide one application-level density setting that makes control-heavy enterprise screens more
compact without requiring consumers to configure each control individually.

The feature supports `default` and `compact` modes. Existing sizing remains the default so adopting
the configuration is backward-compatible. Consumers can override the global mode for one element or
an entire subtree when a workflow needs a different density.

## Public API

Import density APIs from the top-level UI library barrel:

```ts
import {
  DensityDirective,
  DensityService,
  provideUiLib,
  type UiDensity,
  type UiLibConfig,
} from './shared/ui-lib';
```

Public pieces:

- `UiDensity = 'default' | 'compact'`
- `UiLibConfig` with optional `density`; omission resolves to `default`
- `provideUiLib(config?)` for application startup configuration
- `DensityService` with a readonly `density` signal and `setDensity(density)`
- `DensityDirective` with selector `[msDensity]` for element and subtree overrides

## Desired Usage

Configure compact density once for the application:

```ts
import { ApplicationConfig } from '@angular/core';

import { provideUiLib } from './shared/ui-lib';

export const appConfig: ApplicationConfig = {
  providers: [provideUiLib({ density: 'compact' })],
};
```

Change density at runtime:

```ts
import { Component, inject } from '@angular/core';

import { DensityService } from './shared/ui-lib';

@Component({
  selector: 'app-density-control',
  template: `<button type="button" class="btn" (click)="useCompact()">Compact</button>`,
})
export class DensityControl {
  private readonly densityService = inject(DensityService);

  useCompact(): void {
    this.densityService.setDensity('compact');
  }
}
```

Override a subtree and restore the default inside it:

```html
<section msDensity="compact">
  <button type="button" class="btn btn-primary">Compact action</button>

  <div msDensity="default">
    <button type="button" class="btn btn-outline">Default-size exception</button>
  </div>
</section>
```

## Behavior

- `provideUiLib()` defaults to `{ density: 'default' }` behavior.
- The density service applies the active value to `document.documentElement` as `data-density`.
- `setDensity()` updates both the public signal and the document attribute immediately.
- `msDensity` writes `data-density` to its host; inherited CSS custom properties make the nearest
  density scope win for descendants.
- The service does not persist density. Applications own user, tenant, or local-storage preference
  persistence and can pass the resolved preference to `provideUiLib` or call `setDensity`.
- Existing component size inputs and classes continue to select their relative size tier inside the
  active density.
- Density changes control dimensions and control-related spacing only. It does not automatically
  compress general page, card, drawer, modal, or dialog layout.

## Styling Contract

Density tokens live in `src/styles/tokens/_controls.scss`.

Default mode preserves the existing size tiers:

- `--control-height-xs`: 24px
- `--control-height-sm`: 28px
- `--control-height-md`: 32px
- `--control-height-lg`: 48px

Compact mode uses:

- `--control-height-xs`: 24px
- `--control-height-sm`: 24px
- `--control-height-md`: 28px
- `--control-height-lg`: 40px

Density also controls horizontal and vertical padding, grouped-control inset, item and section
spacing, choice-control gaps, calendar cell sizing, and table cell padding. Component styles must
consume these shared tokens instead of adding density-specific selectors or per-component flags.

The contract applies to native form controls, autocomplete, select, buttons, button toggles, choice
controls, date/time pickers, file upload, menus, pagination, navigation, sliders, steppers, tabs,
tables, trees, and similar token-based controls.

## Accessibility

- Keep control text readable at the existing 14px small-control size.
- Preserve visible focus treatment, native semantics, keyboard behavior, labels, disabled states,
  readonly states, and error communication in both modes.
- Compact mode uses a 24px outer small-control height. Controls smaller than a 24px standalone
  target must retain sufficient spacing or a larger associated clickable area; do not claim target
  size conformance from height tokens alone.
- Keep default density for touch-heavy workflows; compact density is intended for control-dense
  desktop enterprise screens.

## Showcase

The `/density` showcase and the `Interface density` home card demonstrate:

- side-by-side default and compact controls
- form inputs, native select, buttons, and table density
- logical start alignment for sample table headers
- a copyable local `msDensity` override example

The global showcase shell exposes a pill-shaped Default/Compact switcher using native buttons,
`aria-pressed`, a labelled group, and `DensityService`.

## Acceptance Criteria

- Default density preserves existing control sizing.
- One `provideUiLib` setting configures density across the application.
- `DensityService` supports runtime switching without per-control configuration.
- `msDensity` supports nested local overrides, with the nearest scope winning.
- Relevant controls consume shared density tokens consistently.
- Compact mode preserves readability, alignment, focus visibility, semantics, and keyboard use.
- Public APIs are exported from the directive, service, and root UI library barrels.
- `/density` is routed and discoverable from the home showcase.
- Documentation distinguishes control density from general layout spacing and persistence.
- The Angular build succeeds apart from any pre-existing bundle-budget warning.
