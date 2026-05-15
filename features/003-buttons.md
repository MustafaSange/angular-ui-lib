# Feature 003: Buttons

## Goal
Create reusable button styles using the existing design tokens and utility system.

## Context
The project already has:

- `src/styles/colors/`
- `src/styles/tokens/`
- `src/styles/utilities/`

Buttons must use existing CSS variables.

Control sizing uses the shared control tokens:
- heights: `xs`, `sm`, `md`, `lg`
- horizontal padding: `xs`, `sm`, `md`, `lg`
- base buttons use the medium control size

## Task
Create a button styles folder:

src/styles/components/

Create these files:

- _index.scss
- _buttons.scss

## Button classes

Create a base button class:

- .btn

Create button variants:

- .btn-primary
- .btn-secondary
- .btn-outline
- .btn-ghost
- .btn-danger
- .btn-success

Create button sizes:

- .btn-xs
- .btn-sm
- .btn-md
- .btn-lg

Create button states:

- hover
- focus-visible
- active
- disabled

Create full-width button:

- .btn-full

Create icon button:

- .btn-icon — square icon-only button using the matching control height for both inline and block size

## Rules

- Use CSS variables only.
- Do not hardcode colors or spacing if tokens exist.
- Keep buttons accessible.
- Use `cursor: pointer`.
- Disabled buttons should use `cursor: not-allowed`.
- Focus state must be visible.
- Button sizes must use matching control height and horizontal padding tokens.
- Icon buttons should stay square and remove inline padding.
- Keep styles reusable across future projects.
- Do not create Angular components yet.
- Only create SCSS button styles.

## _index.scss

Forward button styles:

```scss
@forward './buttons';
```
