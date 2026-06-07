# Feature 005: Home Showcase

## Goal

Maintain a small home page that acts as the entry point for the UI library demos and makes the current theme system visible at a glance.

## Context

The showcase currently includes feature pages for:

- Buttons
- Grid system
- Form fields
- Modal system
- Alerts and toasts
- Menu and popover
- Tooltip
- Tabs

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
- Keep the Modal feature at `/modal`.
- Keep the Feedback feature at `/feedback`.
- Keep the Menu and Popover feature at `/menu-popover`.
- Keep the Tooltip feature at `/tooltip`.
- Keep the Tabs feature at `/tabs`.

## Home page

The showcase landing page includes:

- a page heading
- a short description
- a card or link for the Buttons showcase
- a card or link for the Grid showcase
- a card or link for the Form Fields showcase
- a card or link for the Modal showcase
- a card or link for the Feedback showcase
- a card or link for the Menu and Popover showcase
- a card or link for the Tooltip showcase
- a card or link for the Tabs showcase
- a compact theme preview that demonstrates palette-backed background, surface, muted-surface, border, and text relationships across light and dark modes

Selecting a showcase item should navigate to its page.

## Feature page navigation

Add a visible back control to:

- Buttons page
- Grid page
- Form Fields page
- Modal page
- Feedback page
- Menu and Popover page
- Tooltip page
- Tabs page

Each control should navigate back to `/`.

## Feature page snippets

New feature showcase pages should include copyable full-component examples using the shared
`ShowcaseCode` component. Follow:

`context/009-showcase-code-snippets.md`

## Rules

- Use standalone Angular APIs.
- Use `RouterLink` for navigation.
- Keep showcase links on the Home page ordered alphabetically by their displayed component name.
- Keep showcase routes after `/` in `src/app/app.routes.ts` in the same order as the Home page links.
- Reuse existing tokens and button styles.
- Keep layout and styling consistent with the existing feature pages.
- Do not add or update tests for this behavior change.

## Acceptance Criteria

- Visiting `/` shows the Home page.
- The Home page links to Buttons, Grid, Form Fields, Modal, Feedback, Menu and Popover, Tooltip, and Tabs.
- Home page showcase links are ordered alphabetically by displayed component name.
- The Home page includes a theme preview for the current structural color system.
- Feature showcase pages provide a visible path back to Home.
- Navigation works without a full page reload.
