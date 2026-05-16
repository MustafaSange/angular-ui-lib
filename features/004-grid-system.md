# Feature 004: Grid System

## Goal
Create a reusable layout layer with a 12-column CSS Grid system and named container-width classes.

## Context
The project already contains:

- `src/styles/tokens/`
- `src/styles/utilities/`
- `src/styles/components/`

The layout system must integrate with the existing design token and breakpoint alias system.

## Task
Create a new layout styles folder:

`src/styles/layout/`

Create these files:

- `_index.scss`
- `_grid.scss`
- `_containers.scss`

## Grid container

Create a base `.row` class:

- use CSS Grid only
- `display: grid`
- `grid-template-columns: repeat(12, minmax(0, 1fr))`
- `inline-size: 100%`
- no default gap
- direct children default to full-width spans

## Column classes

Generate base column spans:

- `.col-1` through `.col-12`

Each class uses `grid-column: span X`.

## Responsive column classes

Generate prefix-first responsive column spans using the shared breakpoint aliases:

- exact ranges: `xs`, `sm`, `md`, `lg`, `xl`
- less-than aliases: `lt-sm`, `lt-md`, `lt-lg`, `lt-xl`
- greater-than aliases: `gt-xs`, `gt-sm`, `gt-md`, `gt-lg`

Examples:

- `.md-col-6`
- `.gt-sm-col-4`
- `.lt-lg-col-12`

## Container classes

Create named width-only container classes using existing container tokens:

- `.container-narrow`
- `.container-content`
- `.container-page`
- `.container-wide`
- `.container-full`

Container classes should not auto-center; compose centering with existing utilities such as `.mx-auto`.

## Rules

- Use SCSS loops where helpful.
- Use CSS Grid only; do not use Flexbox.
- Use existing gap utilities plus container and breakpoint definitions.
- Responsive classes must come from the shared breakpoint alias map.
- Keep the layout system reusable across future projects.

## `_index.scss`

Forward layout styles:

```scss
@forward './grid';
@forward './containers';
```
