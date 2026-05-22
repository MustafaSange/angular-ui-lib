# Feature 005: Home Showcase

## Goal
Maintain a small home page that acts as the entry point for the UI library demos and makes the current theme system visible at a glance.

## Context
The showcase currently includes feature pages for:

- Buttons
- Grid system
- Form fields

Each feature page is discoverable from one central place, and users can return there without relying on browser navigation.

## Task
Create a Home feature under:

`src/app/features/home/`

Create:

- `home.ts`
- `home.html`
- `home.scss`

## Routing

- Render the Home feature at `/`.
- Keep the Buttons feature at `/buttons`.
- Keep the Grid feature at `/grid`.
- Keep the Form Fields feature at `/form-fields`.

## Home page

The showcase landing page includes:

- a page heading
- a short description
- a card or link for the Buttons showcase
- a card or link for the Grid showcase
- a card or link for the Form Fields showcase
- a compact theme preview that demonstrates palette-backed background, surface, muted-surface, border, and text relationships across light and dark modes

Selecting a showcase item should navigate to its page.

## Feature page navigation

Add a visible back control to:

- Buttons page
- Grid page
- Form Fields page

Each control should navigate back to `/`.

## Feature page snippets

New feature showcase pages should include copyable full-component examples using the shared
`ShowcaseCode` component. Follow:

`context/009-showcase-code-snippets.md`

## Rules

- Use standalone Angular APIs.
- Use `RouterLink` for navigation.
- Reuse existing tokens and button styles.
- Keep layout and styling consistent with the existing feature pages.
- Do not add or update tests for this behavior change.

## Acceptance Criteria

- Visiting `/` shows the Home page.
- The Home page links to Buttons, Grid, and Form Fields.
- The Home page includes a theme preview for the current structural color system.
- Buttons, Grid, and Form Fields pages all provide a visible path back to Home.
- Navigation works without a full page reload.
