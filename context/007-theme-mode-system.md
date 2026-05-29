# Feature 007: Theme Mode System

## Goal

Create a reusable theme mode system that supports light mode, dark mode, and system preference mode while maintaining compatibility with the existing style guide.

## Context

The project already contains:

- `src/styles/tokens/`
- `src/styles/utilities/`
- `src/styles/components/`

The existing style guide already uses design tokens, CSS variables, spacing, typography, colors, and reusable component patterns.

The theme system must integrate with the current architecture and should become the foundation for future styling across all projects.

## Task

Create a reusable theme mode system inside the styles architecture.

Create or update the appropriate files inside:

`src/styles/tokens/`

If the structure does not already exist, create:

- `_theme.scss`
- update token exports as needed

If a theme-related structure already exists, extend it instead of replacing it.

## Theme modes

Support 3 theme modes:

- light
- dark
- system

Definitions:

- **light** → always uses light theme
- **dark** → always uses dark theme
- **system** → follows the user's operating system preference using `prefers-color-scheme`

## Theme architecture

Use CSS custom properties as the source of truth.

Create theme tokens for reusable semantic values such as:

- background
- surface
- surface-alt
- text
- text-muted
- border
- border-muted
- primary
- primary-hover
- secondary
- success
- warning
- danger
- info
- focus-ring

Do not hardcode theme colors directly inside components.

Components should consume semantic theme variables only.

Theme semantics should be built from the shared color palette wherever a reusable palette value exists. Use the neutral scale for light-theme structural layers such as backgrounds, surfaces, borders, inverse text, and contrast colors.

Dark mode may use explicit VS Code-inspired values for structural surfaces, text, borders, links, focus rings, and primary interaction tokens when the shared palette does not provide the desired editor-like contrast.

## Theme selectors

Support theme switching using a root-level attribute or class.

Preferred approach:

```scss
:root
[data-theme='light']
[data-theme='dark']
[data-theme='system']
```

## Runtime theme switching

Expose the theme modes through a small reusable Angular UI control.

Create:

- `src/app/shared/services/theme.service.ts`
- `src/app/shared/components/theme-switcher/theme-switcher.ts`
- `src/app/shared/components/theme-switcher/theme-switcher.html`
- `src/app/shared/components/theme-switcher/theme-switcher.scss`
- `src/app/shared/components/theme-switcher/index.ts`

The theme switcher should:

- allow selecting `light`, `dark`, or `system`
- be available globally from the app shell
- use the shared reusable component selector prefix `ms-`
- update `data-theme` on the root document element
- persist the selected mode between sessions
- use existing design tokens for its styling
- remain usable if browser storage is unavailable

The theme service should:

- expose the current mode as Angular state
- default to `system` when no stored preference exists
- write the selected mode to the document root
- persist the selected mode in browser storage

## System preference behavior

When `system` mode is active, use `prefers-color-scheme` to follow the operating system preference:

```scss
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]),
  [data-theme='system'] {
    // dark theme tokens
  }
}
```

Light tokens remain the default fallback, and dark tokens should apply automatically when the browser reports a dark system preference.

## Compatibility

- Preserve the existing semantic `--color-*` API for current components and utilities.
- If a new `--theme-*` layer is introduced, bridge it back to the existing semantic color names.
- Interactive and feedback tokens should remain theme-aware in both light and dark modes.
- Keep the dark structural ladder visually coherent across backgrounds, surfaces, borders, and raised layers. The current dark theme is tuned to a VS Code-style palette rather than relying only on the neutral scale.

## Acceptance Criteria

- `_theme.scss` exists under `src/styles/tokens/` and is exported from the token entrypoint.
- Light, dark, and system modes are supported.
- `system` mode follows `prefers-color-scheme`.
- Components consume semantic theme variables rather than raw palette values.
- Light structural theme colors are sourced from the shared palette.
- Dark structural and primary interaction colors may use explicit VS Code-inspired literals to preserve the intended dark editor feel.
- Existing semantic color names continue to work for current styles.
- A global theme switcher can select all three modes.
- The selected mode updates the root `data-theme` attribute.
- The selected mode persists across reloads when browser storage is available.
- The switcher uses existing design tokens and visible focus styling.
