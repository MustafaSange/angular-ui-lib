# Feature 002: Utility Classes

## Goal
Create reusable utility classes based on the existing design tokens.

## Context
Theme tokens already exist under `src/styles/colors/` and `src/styles/tokens/`, and are exposed through `src/styles/_index.scss`.

All utilities must use existing CSS custom properties where a design token exists.

## Task
Create a utilities folder:

src/styles/utilities/

Create these files:

- _index.scss
- _display.scss
- _flex.scss
- _spacing.scss
- _typography.scss
- _colors.scss
- _borders.scss
- _shadows.scss
- _sizing.scss
- _position.scss
- _states.scss

## File responsibilities

### _display.scss
Create display utilities:
- .d-block
- .d-inline
- .d-inline-block
- .d-flex
- .d-inline-flex
- .d-grid
- .d-none

### _flex.scss
Create flex utilities:
- .flex-row
- .flex-column
- .flex-wrap
- .flex-nowrap
- .flex-1
- .flex-grow-0
- .flex-grow-1
- .flex-shrink-0
- .flex-shrink-1
- .justify-start
- .justify-center
- .justify-end
- .justify-between
- .justify-around
- .justify-evenly
- .align-start
- .align-center
- .align-end
- .align-stretch
- .gap-0, .gap-4, .gap-8, .gap-12, .gap-16, .gap-20, .gap-24, .gap-28, .gap-32, .gap-36, .gap-40, .gap-48

### _spacing.scss
Create margin and padding utilities:
- `.m-*`, `.mt-*`, `.mr-*`, `.mb-*`, `.ml-*`, `.ms-*`, `.me-*`, `.mx-*`, `.my-*`
- `.p-*`, `.pt-*`, `.pr-*`, `.pb-*`, `.pl-*`, `.ps-*`, `.pe-*`, `.px-*`, `.py-*`
- Use the spacing scale: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `28`, `32`, `36`, `40`, `48`

### _typography.scss
Create typography utilities:
- .text-xs
- .text-sm
- .text-md
- .text-lg
- .text-xl
- .text-2xl
- .fw-light
- .fw-regular
- .fw-medium
- .fw-semibold
- .fw-bold
- .text-left
- .text-center
- .text-right
- .text-start
- .text-end
- .text-uppercase
- .text-lowercase
- .text-capitalize

### _colors.scss
Create color utilities:
- text: `.text-primary`, `.text-secondary`, `.text-muted`, `.text-inverse`, `.text-accent`, `.text-success`, `.text-warning`, `.text-danger`, `.text-info`
- solid backgrounds: `.bg-primary`, `.bg-secondary`, `.bg-accent`, `.bg-success`, `.bg-warning`, `.bg-danger`, `.bg-info`; each applies its matching contrast text color
- subtle backgrounds: `.bg-*-subtle` for primary, secondary, accent, success, warning, danger, and info
- surfaces: `.bg-background`, `.bg-surface`, `.bg-surface-muted`, `.bg-surface-raised`, `.bg-surface-overlay`
- borders: `.border-default`, `.border-strong`, `.border-*` for primary, secondary, accent, success, warning, danger, and info

### _borders.scss
Create border utilities:
- .border
- .border-0
- .rounded-sm
- .rounded-md
- .rounded-lg
- .rounded-xl
- .rounded-full

### _shadows.scss
Create shadow utilities:
- .shadow-sm
- .shadow-md
- .shadow-lg

### _sizing.scss
Create sizing utilities:
- .w-full
- .h-full
- .min-h-vh
- .min-h-svh

### _position.scss
Create position utilities:
- .position-relative
- .position-absolute
- .position-fixed

### _states.scss
Create state utilities:
- .opacity-muted
- .opacity-disabled

## _index.scss
Import all utility partials using @forward.

Example:

@forward './display';
@forward './flex';
@forward './spacing';

## Global import
Import utilities from the shared style entrypoint:

@use './utilities';

Adjust the path if needed.

## Rules
- Use SCSS partial files.
- Use SCSS loops where helpful.
- Do not hardcode design values.
- Use existing CSS variables from the color and token layers.
- Keep helper SCSS variables private when multiple forwarded modules use the same internal name.
- Keep each file simple and easy to understand.
- Do not modify unrelated files.
