# Feature 039: Theme Customization

## Goal

Create full semantic theme color customization for the showcase.

Users can choose colors for all semantic groups, and the selected colors immediately update the
project through CSS custom properties while preserving the existing theme mode system.

Semantic groups:

- `primary`
- `secondary`
- `accent`
- `success`
- `warning`
- `danger`
- `info`

## Public API

Import theme customization APIs from the top-level UI library barrel:

```ts
import {
  ThemeColorCustomizations,
  ThemeCustomizer,
  ThemeSemanticColor,
  ThemeService,
} from './shared/ui-lib';
```

Public exports:

- `ThemeCustomizer` with selector `ms-theme-customizer`
- `ThemeService` for theme mode and customization state
- `ThemeSemanticColor` for supported semantic color keys
- `ThemeColorCustomizations` for saved semantic color overrides

`ThemeService` exposes:

```ts
class ThemeService {
  readonly mode: WritableSignal<ThemeMode>;
  readonly colorCustomizations: WritableSignal<ThemeColorCustomizations>;

  setMode(mode: ThemeMode): void;
  setColor(color: ThemeSemanticColor, value: string): void;
  resetColor(color: ThemeSemanticColor): void;
  resetColors(): void;
}
```

## Desired Usage

Global showcase shell:

```html
<div class="preview-controls">
  <ms-theme-customizer />
  <ms-theme-switcher />
  <ms-direction-switcher />
</div>
```

Programmatic customization:

```ts
import { Component, inject } from '@angular/core';

import { ThemeService } from './shared/ui-lib';

@Component({
  selector: 'app-theme-example',
  template: `
    <button type="button" class="btn btn-primary" (click)="useGreenBrand()">
      Use green brand
    </button>
  `,
})
export class ThemeExample {
  private readonly themeService = inject(ThemeService);

  useGreenBrand(): void {
    this.themeService.setColor('primary', '#16a34a');
  }
}
```

## Component Structure

The reusable control lives in:

`src/app/shared/ui-lib/components/theme-customizer/`

The feature includes:

- `ThemeCustomizer`
- `index.ts`

Theme customization types live beside the theme service in:

`src/app/shared/ui-lib/services/theme-types.ts`

## Behavior

- Color changes apply immediately to `document.documentElement`.
- Selected semantic colors are stored in `localStorage`.
- Stored custom colors are restored on app startup.
- Resetting one semantic color removes only that color override and falls back to the SCSS-defined
  default ramp.
- Reset all removes every semantic color override.
- Invalid stored values are ignored and removed on the next successful write.
- If browser storage is unavailable, customization still works for the current session.
- Theme mode and theme customization are independent; switching light, dark, or system mode does not
  discard selected custom colors.

Runtime customization updates these CSS custom properties for each selected semantic group:

- `--color-{name}-base` remains the SCSS-defined default base color for reset/default UI values
- `--color-{name}-50`
- `--color-{name}-100`
- `--color-{name}-200`
- `--color-{name}-300`
- `--color-{name}-400`
- `--color-{name}-500`
- `--color-{name}-600`
- `--color-{name}-700`
- `--color-{name}-800`
- `--color-{name}-900`

The selected hex color is used as the `600` stop. Lighter and darker stops are derived with
`color-mix()` so existing semantic aliases, buttons, utilities, focus rings, tabs, steppers,
feedback components, and form states continue to update through their current tokens. The customizer
reads reset/default color values from the emitted `--color-{name}-base` CSS variables rather than
duplicating default hex values in TypeScript.

## Styling

- Use existing tokens for spacing, radius, borders, surfaces, typography, shadows, and focus rings.
- Use concise unprefixed internal class hooks.
- Use logical CSS properties so the control works in both `dir="ltr"` and `dir="rtl"`.
- Keep the customizer compact in the fixed preview controls area so it does not cover routed
  showcase content.
- Do not customize neutral structural colors such as background, surface, text, or border.

## Accessibility

- Use native color inputs with visible labels.
- The customizer panel is reachable by keyboard.
- Reset actions use native buttons with clear accessible names.
- Decorative Material Symbols icons are hidden from assistive technology.
- Focus states use existing focus-ring tokens.

## Acceptance Criteria

- `context/039-theme-customization.md` documents the feature.
- `ms-theme-customizer` is exported from the shared UI library barrels.
- The showcase shell renders the theme customizer next to existing preview controls.
- Changing every semantic color updates the corresponding CSS ramp on the document root.
- Theme customization persists across reloads when storage is available.
- Reset single color and reset all restore SCSS defaults.
- Light, dark, and system modes continue to work independently from customization.
- `npm run build` passes, aside from any pre-existing bundle budget warning.
