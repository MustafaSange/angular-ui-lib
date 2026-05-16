# Feature 000: CSS Reset

## Goal
Create a small foundational reset layer for the Angular UI library.

## Context
This project uses:

- Angular 21
- SCSS
- custom design tokens
- utility classes
- reusable component styling

The reset should provide a stable baseline for future styling without taking ownership of richer element styling yet.

## Task
Create a base styles folder:

`src/styles/base/`

Create these files:

- `_index.scss`
- `_reset.scss`

Import the base layer from the shared style entrypoint before tokens, utilities, components, and layout.

## Requirements

### Universal sizing
Apply `box-sizing: border-box` to:

```scss
*,
*::before,
*::after
```

### Document baseline
- Add `-webkit-text-size-adjust: 100%` to `html`.
- Reset the default `body` margin.
- Set `body` background color, text color, font family, and line height from existing design tokens.

### Responsive media defaults
For `img`, `picture`, `video`, `canvas`, and `svg`:

- use `display: block`
- use `max-inline-size: 100%`

### Form controls
Make `input`, `button`, `textarea`, and `select` inherit the surrounding font with:

```scss
font: inherit;
```

## Out of scope for this first version
Do not reset or restyle:

- links
- lists
- heading or paragraph margins
- button chrome
- focus styles

These can be expanded later when the design system has stronger opinions for them.

## `_index.scss`
Forward the reset partial:

```scss
@forward './reset';
```

## Rules
- Use existing design tokens where available.
- Keep the reset intentionally small and easy to extend.
- Do not modify unrelated styles.
- Do not add or update tests for this styling change.

## Acceptance Criteria
- The base layer is imported globally before the other style layers.
- Sass compiles with the new reset files in place.
- The page body has no default browser margin.
- Global body typography and colors come from existing tokens.
- Media elements do not overflow their container by default.
- Form controls inherit typography from their surrounding context.
