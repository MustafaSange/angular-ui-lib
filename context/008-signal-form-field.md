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
  <span slot="label-extra">Optional</span>
  <button slot="label-action" type="button">Help</button>
  <input id="email" type="email" [formField]="emailField" />

  <app-hint>
    Enter your email.
    <span slot="hint-extra">Required</span>
  </app-hint>
  <app-error>
    This field is required.
    <span slot="error-extra">Required</span>
  </app-error>
</app-signal-form-field>
```

Do not use `[field]`; this project uses the Angular signal forms `[formField]` directive.

## Component Structure

The implementation is split into separate files:

- `signal-form-field.ts`
- `signal-form-field.html`
- `signal-form-hint/signal-form-hint.ts`
- `signal-form-hint/signal-form-hint.html`
- `signal-form-error/signal-form-error.ts`
- `signal-form-error/signal-form-error.html`
- `index.ts`

`signal-form-field.ts` owns the wrapper component behavior.

`signal-form-field.html` renders the 3-row layout:

1. Label row with a 2-column label area
2. Projected input/control row
3. Message row

`app-hint` and `app-error` are separate projected support components.

## Projection Rules

- Do not use inputs for label, hint, error, or field/control.
- Label, control, hint, and error are all passed through content projection.
- The label area projects the native `label` on the left.
- Optional right-side label content uses `slot="label-extra"` or `slot="label-action"`.
- Optional right-side hint content uses `slot="hint-extra"` inside `app-hint`.
- Optional right-side error content uses `slot="error-extra"` inside `app-error`.
- The projected control remains fully owned by the consumer.
- The wrapper detects projected `app-hint`, `app-error`, and Angular signal `FormField`.
- The wrapper shows `app-error` only when an error component exists and the projected signal field is invalid and touched or dirty.
- The wrapper shows `app-hint` before interaction and whenever no error is visible.
- Initial invalid fields should not display errors until the field becomes touched or dirty.
- The message row remains present so spacing does not jump.

## Styling

Reuse the existing form field styling in:

`src/styles/components/_form-fields.scss`

The styles support both:

- legacy `.form-field` markup
- `app-signal-form-field`, `app-hint`, and `app-error` element selectors
- a 2-column `.form-field-label` area using `1fr auto`
- 2-column `app-hint` and `app-error` message layouts using `1fr auto`

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
- Label-side content can be projected with `slot="label-extra"` or `slot="label-action"`.
- Hint-side content can be projected with `slot="hint-extra"`.
- Error-side content can be projected with `slot="error-extra"`.
- `app-hint` and `app-error` are projected components in separate folders.
- Consumers import all signal form field pieces from the folder `index.ts`.
- `[formField]` works with projected controls.
- Hint and error are mutually exclusive.
- Errors are gated by invalid plus touched or dirty state.
- Existing `.form-field` examples and styling remain supported.
- The showcase uses the signal form field component and built-in grid utilities.
