# Feature 031: Slider

## Goal

Create a reusable slider component for selecting a numeric value from a bounded range.

The slider should use native range input behavior for pointer, touch, keyboard, focus, and assistive
technology support while the library provides consistent value binding, visual styling, disabled
state handling, RTL-safe layout, and showcase examples.

## Public API

Import slider primitives from the folder barrel:

```ts
import { SliderComponent } from '../../shared/components/slider';
```

Public pieces:

- `SliderComponent` with selector `ms-slider`

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks are `.slider`, `.slider-control`, `.slider-input`, `.slider-fill`, and
`.slider-value`; do not use new `.ms-*` hooks for component-private styling. Established public
utility classes such as `.ms-icon` and `.ms-icon-filled` remain namespaced.

Required API:

```ts
class SliderComponent {
  readonly value = model(0);
  readonly min = input<number | undefined, unknown>(undefined, {
    transform: numberAttributeOrUndefined,
  });
  readonly max = input<number | undefined, unknown>(undefined, {
    transform: numberAttributeOrUndefined,
  });
  readonly step = input(1, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();
  readonly showValue = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

  focus(options?: FocusOptions): void;
}
```

Defaults:

- `value` is `0`
- `min` is `undefined`, with an effective fallback of `0`
- `max` is `undefined`, with an effective fallback of `100`
- `step` is `1`
- `disabled` is `false`
- `showValue` is `false`
- ARIA label inputs are `null`

## Desired Usage

Basic slider:

```ts
import { Component, signal } from '@angular/core';

import { SliderComponent } from './shared/components/slider';

@Component({
  selector: 'app-basic-slider-example',
  imports: [SliderComponent],
  template: `
    <ms-slider [(value)]="volume" min="0" max="100" step="5" aria-label="Volume" showValue />
  `,
})
export class BasicSliderExample {
  protected readonly volume = signal(65);
}
```

Signal form-field model binding:

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, max, min, schema } from '@angular/forms/signals';

import { SignalFormField, SignalFormHint } from './shared/components/signal-form-field';
import { SliderComponent } from './shared/components/slider';

type BudgetForm = {
  budget: number;
};

@Component({
  selector: 'app-form-field-slider-example',
  imports: [FormField, SignalFormField, SignalFormHint, SliderComponent],
  template: `
    <ms-signal-form-field>
      <label id="budget-label">Monthly budget</label>

      <ms-slider [formField]="budgetField" step="250" aria-labelledby="budget-label" showValue />

      <ms-hint>Choose a budget range for the campaign.</ms-hint>
    </ms-signal-form-field>
  `,
})
export class FormFieldSliderExample {
  private readonly model = signal<BudgetForm>({
    budget: 2500,
  });

  protected readonly form = form(
    this.model,
    schema<BudgetForm>((path) => {
      min(path.budget, 500);
      max(path.budget, 5000);
    }),
  );

  protected readonly budgetField = this.form.budget;
}
```

Disabled slider:

```ts
import { Component } from '@angular/core';

import { SliderComponent } from './shared/components/slider';

@Component({
  selector: 'app-disabled-slider-example',
  imports: [SliderComponent],
  template: ` <ms-slider value="40" aria-label="Storage used" disabled showValue /> `,
})
export class DisabledSliderExample {}
```

## Component Structure

The implementation lives in:

`src/app/shared/components/slider`

The feature includes:

- `SliderComponent`
- `slider.html`
- `index.ts`

`SliderComponent` implements the Angular signal forms `FormValueControl<number>` contract. It
renders a native `<input type="range">` as the interactive control. The component host owns the
layout and projected context, while the native input owns range semantics, focus, pointer
interaction, touch interaction, and keyboard behavior.

The component may render a visual `.slider-fill` element for consistent track progress styling. The
fill is decorative and must not replace the native range input as the accessible control.

Styles live in:

`src/styles/components/_slider.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

The showcase lives in:

`src/app/features/slider`

## Behavior

- The slider represents a single numeric value.
- User input updates `value` through the component model.
- When `[formField]` is applied, user input updates the bound signal form field value.
- External `value` changes update the native range input.
- External signal form field value changes update the native range input.
- Values are clamped between `min` and `max`.
- If `min` is greater than `max`, the component treats the smaller number as the effective minimum
  and the larger number as the effective maximum.
- With `[formField]`, `min` and `max` should come from signal form schema metadata, such as
  `min(path.budget, 500)` and `max(path.budget, 5000)`, rather than literal `min` and `max`
  attributes on the same element.
- `step` controls the native range input step.
- `step` values less than or equal to `0` resolve to `1`.
- The visual fill represents the current value as a percentage between the effective minimum and
  effective maximum.
- When the effective minimum and maximum are equal, the fill renders as `0%` and the value resolves
  to that shared bound.
- `showValue` renders the current numeric value next to the slider.
- Disabled sliders disable the native input, prevent user changes, and apply disabled visual state.
- Blur emits `touch` so signal forms can mark the field touched.
- `focus()` forwards focus to the native range input.
- The component does not implement `ControlValueAccessor` in v1 because it uses the signal forms
  custom control contract.

## Projection and Composition Rules

- Consumers do not project the native range input.
- Consumers provide the accessible name with `aria-label` or `aria-labelledby` on `ms-slider`.
- Consumers may place `ms-slider` inside `ms-signal-form-field` and bind it directly with
  `[formField]`.
- `ms-slider` should not create its own visible label; labels belong to the consuming context.
- `showValue` is only a numeric display of the current value and is not a substitute for an
  accessible name.

## Styling

Feature styles live in:

`src/styles/components/_slider.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

- Use existing color, surface, border, spacing, control, radius, typography, motion, and focus-ring
  tokens.
- Use logical block and inline properties so layout mirrors correctly in both `dir="ltr"` and
  `dir="rtl"`.
- Use `.slider` for the host layout, `.slider-control` for the range track area, `.slider-input`
  for the native input, `.slider-fill` for the decorative progress fill, and `.slider-value` for the
  optional visible value.
- Name component-private CSS custom properties with a `--_slider-*` prefix.
- Use a component-private percentage variable, such as `--_slider-percent`, to style the progress
  fill.
- In RTL layout, the visual fill should grow from logical inline-end while native input interaction
  remains usable.
- Keep focus visible through `:focus-visible` on the native input.
- Disabled state should use disabled surface, border, text, and cursor tokens where available.
- Avoid hardcoded color, spacing, radius, and motion values when tokens exist.
- Keep styles reusable across future projects.

## Accessibility

- The interactive element is a native `<input type="range">`.
- The native input receives `min`, `max`, `step`, `value`, and `disabled`.
- The native input receives `aria-label`, `aria-labelledby`, and `aria-describedby` from the
  matching component inputs when provided.
- When `[formField]` is applied, signal forms can bind `value`, `disabled`, `min`, and `max` into the
  component through the signal forms custom control contract.
- Consumers must provide an accessible name with `aria-label` or `aria-labelledby`.
- Keyboard behavior comes from the native range input, including arrow keys, Page Up, Page Down,
  Home, and End where supported by the browser.
- The visible focus state must be clear and token-based.
- Decorative fill elements must use `aria-hidden="true"`.
- Disabled sliders must expose disabled state through the native `disabled` attribute.
- `showValue` must not be the only way a screen reader can understand the slider purpose.

## Showcase

Add a dedicated `/slider` page and home card demonstrating:

- basic slider with visible value
- min, max, and step configuration
- disabled state
- signal form-field model integration with `[formField]`
- an RTL example showing logical fill placement

Showcase snippets use `ShowcaseCode` from `src/app/shared/components/showcase-code`.

Keep snippets hand-authored in `src/app/features/slider/slider.ts` and make each snippet a full
standalone Angular component example that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public slider primitives are exported from the feature folder barrel.
- The primary usage example works as documented.
- The component renders a native range input.
- `[(value)]`, `min`, `max`, `step`, `disabled`, and `showValue` work as documented.
- `[formField]` binds a number field directly to `ms-slider`.
- User interaction updates the slider model value.
- User interaction updates the bound signal form field value when `[formField]` is applied.
- External model updates update the native input and visual fill.
- External signal form field updates update the native input and visual fill.
- Values are clamped to the effective range.
- Disabled sliders cannot be changed by the user.
- The native range input receives a valid accessible name from `aria-label` or
  `aria-labelledby`.
- Styling uses existing tokens and is forwarded through the component styles index.
- Slider layout and visual fill behave correctly in RTL layouts.
- The `/slider` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
