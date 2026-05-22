# Feature 008: Signal Form Field

## Goal

Create a reusable Angular signal form field component that uses content projection for all visible field parts.

The component lives in:

`src/app/shared/components/signal-form-field`

## Public API

Import the public components from the folder barrel:

```ts
import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from '../../shared/components/signal-form-field';
```

Components:

- `SignalFormField` with selector `app-signal-form-field`
- `SignalFormHint` with selector `app-hint`
- `SignalFormError` with selector `app-error`

## Desired Usage

Use Angular 21 signal forms with `[formField]`.

```html
<app-signal-form-field>
  <label for="email">Email</label>
  <input id="email" type="email" [formField]="emailField" />

  <app-hint>Enter your email.</app-hint>
  <app-error>This field is required.</app-error>
</app-signal-form-field>
```

Do not use `[field]`; this project uses the Angular signal forms `[formField]` directive.

## Component Structure

The implementation is split into separate files:

- `signal-form-field.ts`
- `signal-form-field.html`
- `signal-form-hint/signal-form-hint.ts`
- `signal-form-error/signal-form-error.ts`
- `index.ts`

`signal-form-field.ts` owns the wrapper component behavior.

`signal-form-field.html` renders the 3-row layout:

1. Label row
2. Projected input/control row
3. Message row

`app-hint` and `app-error` are separate projected support components.

## Projection Rules

- Do not use inputs for label, hint, error, or field/control.
- Label, control, hint, and error are all passed through content projection.
- The projected control remains fully owned by the consumer.
- The wrapper detects projected `app-hint`, `app-error`, and Angular signal `FormField`.
- The wrapper shows `app-error` only when an error component exists and the projected signal field is invalid.
- The wrapper shows `app-hint` when no error is visible.
- The message row remains present so spacing does not jump.

## Styling

Reuse the existing form field styling in:

`src/styles/components/_form-fields.scss`

The styles support both:

- legacy `.form-field` markup
- `app-signal-form-field`, `app-hint`, and `app-error` element selectors

Do not add state inputs, state classes, or `data-*` state attributes to `app-signal-form-field`.

## Showcase

The form-fields showcase should use `app-signal-form-field` examples so the new behavior is visible.

For the showcase grid, use the built-in grid utilities:

```html
<div class="row gap-20 row-align-start">
  <app-signal-form-field class="col-4">...</app-signal-form-field>
</div>
```

`row-align-start` is defined in:

`src/styles/layout/_grid.scss`

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Prefer signals and signal forms APIs.
- Keep strict TypeScript.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `app-signal-form-field` renders label, control, and message rows.
- `app-hint` and `app-error` are projected components in separate folders.
- Consumers import all signal form field pieces from the folder `index.ts`.
- `[formField]` works with projected controls.
- Hint and error are mutually exclusive.
- Existing `.form-field` examples and styling remain supported.
- The showcase uses the signal form field component and built-in grid utilities.
