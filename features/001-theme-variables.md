# Feature 001: Theme Tokens

## Goal
Create the foundational design-token system for the Angular UI library.

## Structure
- `src/styles/colors/` — palette generation and semantic color tokens
- `src/styles/tokens/` — typography, spacing, borders, shape, motion, layout, containers, breakpoints, states, and controls
- `src/styles/_index.scss` — global token entrypoint

## Requirements
- Use SCSS and CSS custom properties.
- Generate reusable color ramps for brand and feedback colors.
- Provide a neutral color scale for structural UI colors such as text, surfaces, and borders.
- Expose semantic color tokens for solid, subtle, text, border, and contrast use cases.
- Provide dedicated semantic link colors that are independent from the primary brand palette.
- Provide reusable tokens for:
  - typography
  - value-based spacing
  - border widths
  - radius and shadows
  - motion
  - layout and z-index
  - containers and breakpoints, including scalar width tokens and Sass media aliases
  - UI states
  - form controls, including size-based height and padding tokens
- Keep tokens grouped by domain and document non-obvious usage with concise comments.
- Do not add component styles.

## Acceptance Criteria
- Global styles import the token entrypoint.
- Token files compile through Sass.
- Palette tokens are emitted before semantic aliases that reference them.
- Breakpoint CSS variables and responsive media aliases are generated from shared Sass definitions.
