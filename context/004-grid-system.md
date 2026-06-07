# Feature 006: Form Field Style Guide

## Goal

Create a reusable form field SCSS style guide that supports labels, controls, hints, errors, required, readonly, and disabled states.

## Context

The project already contains:

- `src/styles/tokens/`
- `src/styles/utilities/`
- `src/styles/components/`

The form field style guide must integrate with the existing design tokens, typography, spacing, color, radius, and component patterns.

## Task

Create or update the form field styles inside the appropriate styles folder.

Prefer:

`src/styles/components/`

Create a form field SCSS file if one does not already exist.

## Form field structure

Create a base `.form-field` class with 3 rows:

- label row
- control row
- message row

Suggested classes:

- `.form-field`
- `.form-field-label`
- `.form-field-control`
- `.form-field-message`
- `.form-field-hint`
- `.form-field-error`

## Naming rules

- Do not use BEM naming.
- Do not use `__`.
- Do not use `--`.
- Use simple hyphen-separated class names only.
- Use simple state classes:
  - `.is-required`
  - `.is-error`
  - `.is-disabled`
  - `.is-readonly`

## Control styling

Support native form controls:

- `input`
- `textarea`
- `select`

Do not create separate control classes such as:

- `.form-field-input`
- `.form-field-textarea`
- `.form-field-select`

Instead, style native elements directly inside the scoped `.form-field` component.

Shared control styles should be grouped together.

Element-specific styles should only be added where behavior differs.

## Required state

When `.is-required` is applied:

- display a red `*` after the label text
- implement the marker using SCSS
- do not use inline styles

## Hint and error state

The message row supports mutually exclusive messages:

- hint text
- error text

Rules:

- show hint text by default when available
- when `.is-error` is active, hide the hint text
- when `.is-error` is active, show the error text
- hint and error must never be visible at the same time
- error state should visually affect:
  - control border
  - focus state
  - message color

## Disabled and readonly states

When `.is-disabled`, `.is-readonly`, `[disabled]`, or `[readonly]` is active:

- dim both the label and the control
- visually communicate the field is not editable
- keep styling consistent with the existing design system

## Interaction states

Include styling for:

- default
- hover
- focus
- active
- error
- disabled
- readonly

## Rules

- Review existing files before implementation.
- Reuse existing tokens, variables, mixins, utilities, and component patterns.
- Do not duplicate hardcoded values already available as tokens.
- Keep selectors scoped to `.form-field`.
- Avoid global styling leakage.
- Keep the implementation reusable across future projects.
- Do not use BEM.
- Do not add or update tests unless required by the existing project setup.

## Examples

Provide example markup for:

- standard input
- required input
- textarea
- select
- input with hint
- input with error
- disabled input
- readonly input

## Accessibility

- Preserve proper label and control association.
- Keep visible focus styling.
- Do not rely only on color for error indication.
- Make readonly and disabled states visually clear.
- Preserve screen reader accessibility.

## Acceptance Criteria

- `.form-field` provides a reusable 3-row layout.
- `input`, `textarea`, and `select` are styled using scoped native selectors.
- No `.form-field-input`, `.form-field-textarea`, or `.form-field-select` classes are created.
- Required fields show a red `*`.
- Hint text is visible by default.
- Error text replaces hint text when `.is-error` is active.
- Hint and error are never visible at the same time.
- Disabled and readonly states dim both label and control.
- Styling uses existing project tokens, utilities, and conventions.
