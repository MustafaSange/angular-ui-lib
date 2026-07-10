# Feature 008: Signal Form Field

## Goal

Create a reusable Angular signal form field component that uses content projection for all visible field parts.

The component lives in:

`src/app/shared/ui-lib/components/signal-form-field`

## Public API

Import the public components from the folder barrel:

```ts
import { SignalFormError, SignalFormField, SignalFormHint } from '../../shared/ui-lib';
```

Components:

- `SignalFormField` with selector `ms-signal-form-field`
- `SignalFormHint` with selector `ms-hint`
- `SignalFormError` with selector `ms-error`

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

## Desired Usage

Use Angular 22 signal forms with `[formField]`.

```html
<ms-signal-form-field>
  <label for="email">Email</label>
  <span slot="label-extra">Optional</span>
  <button slot="label-action" type="button">Help</button>
  <input id="email" type="email" [formField]="emailField" />

  <ms-hint>
    Enter your email.
    <span slot="hint-extra">Required</span>
  </ms-hint>
  <ms-error>
    This field is required.
    <span slot="error-extra">Required</span>
  </ms-error>
</ms-signal-form-field>
```

Do not use `[field]`; this project uses the Angular signal forms `[formField]` directive.

For validation, define rules in the signal-form `schema(...)` instead of native validation attributes
on the bound control.

```ts
protected readonly form = form(
  this.model,
  schema<EmailForm>((path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
  }),
);
```

Do not combine `[formField]` with native validation attributes such as `required`, `minlength`, or
`pattern` on the same input, textarea, or select.

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

`ms-hint` and `ms-error` are separate projected support components.

## Projection Rules

- Do not use inputs for label, hint, error, or field/control.
- Label, control, hint, and error are all passed through content projection.
- The label area projects the native `label` at inline-start.
- Optional inline-end label content uses `slot="label-extra"` or `slot="label-action"`.
- Optional inline-end hint content uses `slot="hint-extra"` inside `ms-hint`.
- Optional inline-end error content uses `slot="error-extra"` inside `ms-error`.
- The projected control remains fully owned by the consumer.
- The wrapper detects projected `ms-hint`, `ms-error`, and Angular signal `FormField`.
- The wrapper shows `ms-error` only when an error component exists and the projected signal field is invalid and touched or dirty.
- The wrapper shows `ms-hint` before interaction and whenever no error is visible.
- Initial invalid fields should not display errors until the field becomes touched or dirty.
- The message row remains present so spacing does not jump.

## Styling

Reuse the existing form field styling in:

`src/styles/components/_form-fields.scss`

The styles support both:

- legacy `.form-field` markup
- `ms-signal-form-field`, `ms-hint`, and `ms-error` element selectors
- a 2-column `.form-field-label` area using `1fr auto`
- 2-column `ms-hint` and `ms-error` message layouts using `1fr auto`
- logical block/inline layout behavior so label extras, message extras, prefixes, and suffixes
  mirror correctly in both `dir="ltr"` and `dir="rtl"`

Dense form-field sizing is part of the component contract:

- native `input` and `select` controls, `ms-select`, and `ms-autocomplete` align to
  `--control-height-sm` with a 28px total control height including the outer form-field border
- control text uses `--font-size-sm` (14px)
- labels use `--color-text-muted`
- checkbox, radio, and switch labels should match that muted 14px label treatment when shown in
  the form-fields showcase
- projected controls must account for wrapper borders so they do not increase the composed field
  height

Do not add state inputs, state classes, or `data-*` state attributes to `ms-signal-form-field`.

## Showcase

The form-fields showcase should use `ms-signal-form-field` examples so the behavior is visible.

Visual field adornment icons, such as the passive search prefix, use the `.ms-icon` Material Symbols utility documented in `context/013-material-symbols.md`.

Each form-field variant should render as a small vertical showcase item:

1. The live `ms-signal-form-field` visual example
2. The matching `<app-showcase-code>` snippet directly below it

Keep snippets hand-authored in `form-fields.ts` and make each snippet a full standalone Angular component example. Include separate snippets for individual variants such as text input, signal form field, required email, select, hint, textarea, prefix, suffix, search, actions, segmented suffix action, disabled, and readonly fields.

The rendered showcase and its copyable snippet must stay behaviorally aligned:

- If the snippet uses `signal`, `computed`, `form(...)`, `schema(...)`, or `[formField]`, the live
  showcase component/template should use the same behavior rather than static markup.
- If the snippet demonstrates validation, the live example should project `ms-error` and derive the
  displayed message from signal form errors.
- If the snippet demonstrates live derived UI, such as a textarea character count, the live example
  should derive it from the signal form field/control state so it updates while typing.
- If the snippet demonstrates interaction state, such as a password visibility toggle, the live
  showcase should expose the same interaction.

Selection controls in the same showcase should use the projected choice-control components documented in:

`context/010-choice-controls.md`

Selection-control examples can stay grouped by control type, with each group followed by its matching snippet.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals and signal forms APIs.
- Keep strict TypeScript.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `ms-signal-form-field` renders label, control, and message rows.
- Label-side content can be projected with `slot="label-extra"` or `slot="label-action"`.
- Hint-side content can be projected with `slot="hint-extra"`.
- Error-side content can be projected with `slot="error-extra"`.
- `ms-hint` and `ms-error` are projected components in separate folders.
- Consumers import all signal form field pieces from the folder `index.ts`.
- `[formField]` works with projected controls.
- Hint and error are mutually exclusive.
- Errors are gated by invalid plus touched or dirty state.
- Existing `.form-field` examples and styling remain supported.
- Projected inline-start and inline-end content mirrors correctly in `dir="rtl"`.
- The showcase uses the signal form field component and renders each form-field variant with its snippet directly below the visual example.
- The showcase snippets and rendered examples match behavior, including validation, derived labels,
  and interactive actions.
