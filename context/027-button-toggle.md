# Feature 027: Button Toggle

## Goal

Create a reusable single-select projected button toggle group for segmented choices where only one
native button can be selected at a time.

The selected button is highlighted, the group owns a selected value, and consumers keep ownership of
the projected button labels, icons, and accessible group name.

## Public API

Import button toggle primitives from the folder barrel:

```ts
import { ButtonToggleDirective, ButtonToggleGroup, ButtonToggleValue } from '../../shared/ui-lib';
```

Public pieces:

- `ButtonToggleGroup` with selector `ms-button-toggle-group`
- `ButtonToggleDirective` with selector `button[msButtonToggleValue]`
- `ButtonToggleValue = string | number`

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks are `.button-toggle-group`, `.button-toggle`, and `.is-selected`; do not use
new `.ms-*` hooks for component-private styling. Established public utility classes such as
`.ms-icon` and `.ms-icon-filled` remain namespaced.

Required group API:

```ts
class ButtonToggleGroup {
  readonly value = model<ButtonToggleValue | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
}
```

Required directive API:

```ts
class ButtonToggleDirective {
  readonly value = input.required<ButtonToggleValue>({ alias: 'msButtonToggleValue' });
}
```

Defaults:

- `value` is `null`, then resolves to the first enabled toggle when available
- `disabled` is `false`

## Desired Usage

Basic button toggle:

```ts
import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue } from './shared/ui-lib';

@Component({
  selector: 'app-basic-button-toggle-example',
  imports: [ButtonToggleGroup, ButtonToggleDirective],
  template: `
    <ms-button-toggle-group [(value)]="view" aria-label="View mode">
      <button type="button" msButtonToggleValue="list">List</button>
      <button type="button" msButtonToggleValue="grid">Grid</button>
      <button type="button" msButtonToggleValue="table">Table</button>
    </ms-button-toggle-group>
  `,
})
export class BasicButtonToggleExample {
  protected readonly view = signal<ButtonToggleValue>('list');
}
```

Signal form-field visual layout:

```ts
import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue } from './shared/ui-lib';
import { SignalFormField, SignalFormHint } from './shared/ui-lib';

@Component({
  selector: 'app-form-field-button-toggle-example',
  imports: [ButtonToggleGroup, ButtonToggleDirective, SignalFormField, SignalFormHint],
  template: `
    <ms-signal-form-field>
      <label id="view-mode-label">View mode</label>

      <ms-button-toggle-group [(value)]="view" aria-labelledby="view-mode-label">
        <button type="button" msButtonToggleValue="list">List</button>
        <button type="button" msButtonToggleValue="grid">Grid</button>
      </ms-button-toggle-group>

      <ms-hint>Choose how results are displayed.</ms-hint>
    </ms-signal-form-field>
  `,
})
export class FormFieldButtonToggleExample {
  protected readonly view = signal<ButtonToggleValue>('grid');
}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/button-toggle`

The feature includes:

- `ButtonToggleGroup`
- `ButtonToggleDirective`
- `ButtonToggleValue`
- internal group coordination types and token
- `index.ts`

`ButtonToggleGroup` renders projected content only. It queries projected `ButtonToggleDirective`
instances, stores the selected value, and coordinates selection and keyboard movement.

`ButtonToggleDirective` attaches to native buttons, sets selected and disabled host state, and
delegates click and keyboard behavior to the parent group.

Styles live in:

`src/styles/components/_button-toggle.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

The showcase lives in:

`src/app/features/button-toggle`

## Behavior

- The group is single-select.
- If `value` is `null`, missing, or points to a disabled/nonexistent toggle, the group selects the
  first enabled toggle.
- Clicking an enabled toggle updates the group value to that toggle value.
- Disabled toggles do not update selection.
- A disabled group prevents selection changes and disables projected toggle buttons.
- Selected buttons receive `.is-selected` and `aria-pressed="true"`.
- Unselected buttons receive `aria-pressed="false"`.
- Button activation for Enter and Space uses native button behavior.
- `ArrowRight` and `ArrowLeft` move focus and selection between enabled toggles.
- In RTL layout, left and right arrow behavior mirrors logical inline direction.
- `Home` selects and focuses the first enabled toggle.
- `End` selects and focuses the last enabled toggle.

## Projection and Composition Rules

- Consumers project native `<button type="button" msButtonToggleValue="...">` elements inside
  `ms-button-toggle-group`.
- Consumers own button labels, icons, and any compact projected markup.
- Consumers provide the accessible group name with `aria-label` or `aria-labelledby`.
- The directive supports static and bound values through `msButtonToggleValue`:

```html
<button type="button" msButtonToggleValue="grid">Grid</button>
<button type="button" [msButtonToggleValue]="view.id">Custom</button>
```

- This feature does not implement `ControlValueAccessor` and is not a full Angular forms control in
  v1.
- `ms-signal-form-field` can project `ms-button-toggle-group` for label, control, and hint layout
  only.

## Styling

- Use existing surface, text, border, spacing, control, radius, shadow, motion, and focus-ring
  tokens.
- Use logical sizing and overflow behavior so segmented groups fit constrained containers.
- Keep focus visible through `:focus-visible`.
- Use `.button-toggle-group` for the segmented container and `.button-toggle` for projected native
  buttons.
- The base group renders as an `inline-flex` content-width control with `max-inline-size: 100%`.
- Parent layout can still stretch the group, such as CSS grid containers with default
  `justify-items: stretch`.
- Signal form-field layout intentionally makes `ms-button-toggle-group` fill the control row with
  `inline-size: 100%`.
- Selected state uses `.is-selected` with primary color tokens: `--color-primary`,
  `--color-primary-hover`, `--color-primary-active`, and `--color-primary-contrast`.
- Selected disabled state uses primary subtle/border/text tokens and does not dim the whole button
  with opacity, so the selected label stays readable.
- Disabled state uses native disabled button behavior and `.is-disabled` on the group.
- Keep styles reusable across future projects.

## Accessibility

- The group host uses `role="group"`.
- Consumers must provide an accessible group name with `aria-label` or `aria-labelledby`.
- Toggle buttons are native buttons.
- Each toggle exposes selection through `aria-pressed`.
- Disabled groups expose `aria-disabled="true"` and disable projected toggle buttons.
- Decorative icons inside buttons must use `aria-hidden="true"`.
- Icon-only toggle buttons must include an accessible name independent of the icon text.

## Showcase

Add a dedicated `/button-toggle` page and home card demonstrating:

- basic text toggles
- icon and text toggles
- disabled item and disabled group states
- signal form-field visual integration
- keyboard behavior in an RTL example

Showcase snippets use `ShowcaseCode` from `src/app/shared/ui-lib/components/showcase-code`.

Keep snippets hand-authored in `src/app/features/button-toggle/button-toggle.ts` and make each
snippet a full standalone Angular component example that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata over `@HostBinding` and `@HostListener`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public button toggle primitives are exported from the feature folder barrel.
- The primary usage example works as documented.
- The group selects exactly one enabled toggle when toggles are available.
- Click and keyboard navigation update selected value and focus.
- Disabled toggles and disabled groups cannot change selection.
- Selected state is visually highlighted with primary colors and exposed with `aria-pressed`.
- Selected disabled state remains visibly selected and readable.
- RTL arrow behavior mirrors correctly.
- `ms-button-toggle-group` renders inside `ms-signal-form-field` as a visual form-field control.
- Styles are token-based and forwarded through the component styles index.
- The `/button-toggle` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
