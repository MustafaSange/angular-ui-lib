# Feature 005: Home Showcase

## Goal
Create a small home page that acts as the entry point for the UI library demos.

## Context
The project already contains feature pages for:

- Buttons
- Grid system
- Form fields

Each feature page should be discoverable from one central place, and users should be able to return there without using browser navigation.

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

Create a simple showcase landing page with:

- a page heading
- a short description
- a card or link for the Buttons showcase
- a card or link for the Grid showcase
- a card or link for the Form Fields showcase

Selecting a showcase item should navigate to its page.

## Feature page navigation

Add a visible back control to:

- Buttons page
- Grid page
- Form Fields page

Each control should navigate back to `/`.

## Rules

- Use standalone Angular APIs.
- Use `RouterLink` for navigation.
- Reuse existing tokens and button styles.
- Keep layout and styling consistent with the existing feature pages.
- Do not add or update tests for this behavior change.

## Acceptance Criteria

- Visiting `/` shows the Home page.
- The Home page links to Buttons and Grid.
- The Home page links to Buttons, Grid, and Form Fields.
- Buttons, Grid, and Form Fields pages all provide a visible path back to Home.
- Navigation works without a full page reload.
