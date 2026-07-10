# Feature 006: Form Field Styles

## Goal

Maintain the reusable SCSS contract for form fields so native controls, projected Angular
components, and display-only values align with the existing design system.

## Context

The project already contains a `styles` folder with shared tokens, variables, mixins, typography, spacing, colors, radius values, and existing component styles.

This file owns the visual styling contract. The Angular projection component contract lives in
`context/008-signal-form-field.md`.

## Task

Maintain the reusable form field styles in:

`src/styles/components/_form-fields.scss`

The form field should support:

- label
- input
- textarea
- select
- display-only value
- prefix
- suffix
- passive adornments
- interactive adornment actions
- hint message
- error message
- required state
- disabled state
- readonly state

Selection controls are handled separately by projected choice components. Follow:

`context/010-choice-controls.md`

## Component Structure

Create a form field layout with 3 rows:

1. Label row
2. Control row
3. Message row

## Naming Rules

- Do not use BEM naming.
- Do not use `__`.
- Do not use `--`.
- Use simple hyphen-separated class names only.
- Use simple state classes.

Suggested classes:

- `.form-field`
- `.form-field-label`
- `.form-field-control`
- `.form-field-prefix`
- `.form-field-suffix`
- `.form-field-action`
- `.form-field-message`
- `.form-field-hint`
- `.form-field-error`

Suggested state classes:

- `.is-required`
- `.is-error`
- `.is-disabled`
- `.is-readonly`
- `.is-segmented`

## Control Styling

Do not create separate classes for each native control.

Avoid:

- `.form-field-input`
- `.form-field-textarea`
- `.form-field-select`

Instead, style native elements directly inside the scoped `.form-field` component:

- `input`
- `textarea`
- `select`

Shared styles should be grouped where possible.

Element-specific styles should only be added where behavior differs.

The same style contract also applies to the `ms-signal-form-field` element selector and projected
custom controls such as:

- `ms-select`
- `ms-autocomplete`
- `ms-button-toggle-group`
- `ms-slider`
- `ms-otp-input`
- `ms-readonly-value`

Keep text, select, and autocomplete fields enterprise-dense:

- The composed control row uses the small control height token, `--control-height-sm`, with a
  28px total block size including the form-field border.
- Native `input` and `select` controls should fill the projected control row without increasing
  the total field height.
- Projected custom controls such as `ms-select`, `ms-autocomplete`, and `ms-readonly-value` must
  align to the same 28px total control height when used inside `ms-signal-form-field`.
- Form-control text uses `--font-size-sm` (14px).
- Field labels use `--color-text-muted` and the same compact label treatment as checkbox, radio,
  and switch labels.
- Account for wrapper borders and internal padding when sizing projected controls so nested
  controls do not make the field taller than the shared compact height.

## Prefix and Suffix Behavior

The control row should support optional prefix and suffix content inside `.form-field-control`.

Adornment examples:

- passive text such as `$`, `%`, `kg`, or `.com`
- passive icons
- interactive actions such as clear, reveal password, or search buttons

Rules:

- Use `.form-field-prefix` and `.form-field-suffix` for side content.
- Prefix is the logical inline-start adornment and suffix is the logical inline-end adornment;
  their visual placement and separators must mirror in `dir="rtl"`.
- Use `.form-field-action` for clickable prefix or suffix elements.
- Use `.is-segmented` when an action should appear as a more visually distinct segment.
- `.form-field-control` owns the shared outer border and radius.
- Prefix, center control, and suffix should read as one field with subtle internal separators rather than separate attached boxes.
- Focus, error, disabled, and readonly styling should apply coherently to the full composed field.
- Render passive visual icons such as search with `.ms-icon` as documented in `context/013-material-symbols.md`.

## Label Behavior

- Support labels for all field types.
- Style both native `label` elements and `.form-field-label` within `.form-field`.
- If the field is required, display a red `*` after the label text.
- The required marker should be implemented using SCSS.
- Do not use inline styles.
- Follow the existing typography, spacing, and label styling conventions.

## Hint and Error Behavior

The message row should support mutually exclusive states:

- hint state shows helper text
- error state shows validation error text

Rules:

- Show hint text by default if available.
- When error state is active, hide the hint text.
- Hint and error must never be visible at the same time.
- Error state should visually affect:
  - control border
  - focus styling
  - message color
- Use existing error color tokens and typography styles where available.

## Disabled and Readonly Behavior

If the field is disabled or readonly:

- dim both the label and the control
- visually communicate that the field is not editable
- keep styling consistent with the existing design system
- support native HTML attributes where applicable
- support state classes where useful

Display-only values use `ms-readonly-value` when projected inside `ms-signal-form-field`.

- The default display value state is neither readonly nor disabled.
- `readonly` applies the same readonly field treatment as native `[readonly]` controls.
- `disabled` applies the same disabled field treatment as native `[disabled]` controls.
- Empty display values use the projected `placeholder` text when present and receive muted
  placeholder styling.

## Interaction States

Include styles for:

- default
- hover
- focus
- active
- error
- disabled
- readonly

## SCSS Rules

- Review the existing `styles` folder before implementation.
- Reuse existing:
  - variables
  - design tokens
  - spacing scale
  - typography tokens
  - color tokens
  - border radius values
  - mixins
  - utility helpers
- Do not duplicate values already defined in the style guide.
- Keep selectors scoped to `.form-field`.
- Avoid global styling leakage.
- Keep the implementation modular, reusable, and production-ready.
- Keep text/select/textarea form-field styles in `_form-fields.scss`.
- Keep checkbox, radio, and switch choice styles in `_choice-controls.scss`.
- Use logical block/inline sizing, spacing, borders, and alignment so the composed field behaves
  correctly in both `dir="ltr"` and `dir="rtl"`.

## Examples

Provide example markup for:

- standard input
- required input
- textarea
- select
- prefix text
- suffix text
- prefix icon
- suffix action
- segmented suffix action
- field with hint
- field with error
- disabled field
- readonly field
- display value
- readonly display value
- disabled display value

When examples are rendered in the Angular showcase:

- The live visual example and the copyable snippet must demonstrate the same behavior.
- Do not leave the live example as static placeholder markup when the snippet uses a signal form model,
  `[formField]`, validators, computed display state, or interaction state.
- For signal form examples, bind controls with `[formField]` and define validation with `schema(...)`
  helpers such as `required`, `email`, `minLength`, `maxLength`, `min`, and `pattern`.
- Do not place native validation attributes such as `required`, `minlength`, or `pattern` on the same
  control as `[formField]`.
- Live UI derived from field state, such as character counts and validation messages, should read from
  the signal form field/control state so it updates while users interact.

## Accessibility

- Preserve proper label and control association.
- Maintain clear focus visibility.
- Make disabled and readonly states visually understandable.
- Do not rely only on color for error indication.
- Preserve accessibility for screen readers where relevant.

## Suggestions

After reviewing the existing style guide, suggest improvements if you find:

- inconsistent naming
- repeated hardcoded values
- duplicated styles
- inconsistent spacing
- weak state handling
- accessibility issues

## Rules

- Use existing style guide patterns wherever possible.
- Do not introduce a new naming methodology.
- Do not use BEM.
- Do not create unnecessary control-specific classes.
- Do not add or update tests unless required by the existing project setup.

## Acceptance Criteria

- A reusable form field SCSS style guide is created.
- The form field supports label, control, and message rows.
- Input, textarea, and select are styled through scoped native selectors.
- Prefix and suffix adornments are supported inside the shared control shell.
- Interactive adornment actions support both integrated and segmented treatments.
- The composed control uses one shared outer border with internal separators.
- Prefix and suffix adornments, including segmented actions, mirror correctly in `dir="rtl"`.
- Required fields show a red `*`.
- Hint text is shown by default.
- Error text replaces hint text when an error is active.
- Hint and error are never visible at the same time.
- Disabled and readonly states dim both label and control.
- Display-only values align with the same dense field sizing and state styling as editable controls.
- Angular showcase snippets match the behavior of their rendered visual examples.
- Styling uses existing tokens, variables, mixins, and conventions.
- The implementation is consistent with the existing style guide.
