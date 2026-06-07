# Feature 013: Google Material Symbols Icon Foundation

## Goal

Create a consistent icon foundation using Google Material Symbols for controls, feedback, and composed fields.

Icons use a subsetted web-font request, reusable CSS utility classes, and optional filled rendering without adding a public Angular icon component.

## Public API

There is no Angular component API for icons. Consumer markup uses the global utility classes:

- `.ms-icon` for outlined Material Symbols
- `.ms-icon-filled` for filled Material Symbols

The icon registry and loader are application infrastructure rather than exported shared-component APIs:

- `MATERIAL_ICONS` is the allowlist of icon ligature names included in the loaded subset
- `MaterialIconsService` adds the font stylesheet link once during app bootstrap

When a new ligature is rendered in application markup, add its Material Symbols name to `MATERIAL_ICONS`.

## Desired Usage

Render a decorative icon inside an already-labeled control:

```html
<button class="btn btn-ghost btn-icon" type="button" aria-label="Close">
  <span class="ms-icon" aria-hidden="true">close</span>
</button>
```

Use filled rendering for selected or emphasized icon states:

```html
<button class="btn btn-outline btn-icon" type="button" aria-label="Remove from favorites">
  <span class="ms-icon ms-icon-filled" aria-hidden="true">favorite</span>
</button>
```

## Component Structure

The loading infrastructure lives in:

`src/app/shared/services/material-icons`

It includes:

- `icon-registry.ts` containing the subsetted ligature allowlist
- `material-icons.service.ts` generating and loading the Google Fonts stylesheet URL

Application configuration starts `MaterialIconsService.loadIcons()` with
`provideEnvironmentInitializer`.

Icon font loading is non-critical presentation setup. The environment initializer invokes the
stylesheet insertion without awaiting network completion, so initial application startup is not
blocked by the Google Fonts request.

The initial loaded icon subset supports shared feedback, modal controls, button showcases, tabs
scroll controls, and the search field showcase.

## Behavior

- Load `Material Symbols Outlined` once through a non-blocking Google Fonts stylesheet request.
- Request fixed `opsz`, `wght`, and `GRAD` values while allowing `FILL` values `0..1`.
- Include sorted, deduplicated `icon_names` so only registered ligatures are downloaded.
- Include the Google Fonts `display=block` parameter so raw ligature names do not flash while the font loads.
- Keep icon layout separate from font loading: `.ms-icon` renders as `inline-flex`.
- Use `.ms-icon-filled` only to switch the `FILL` axis from outlined to filled.
- Do not replace textual adornments such as currency units or measurement suffixes with icons.

## Styling

Icon styles live in:

`src/styles/components/_icons.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- `.ms-icon` controls symbol alignment, ligatures, smoothing, and outlined axis settings
- `.ms-icon-filled` changes only the filled emphasis state
- use inherited font size so symbol size composes with button, feedback, and field contexts
- use component styles for context-specific icon sizing where required
- do not create consumer theme tokens for the icon font; icons inherit their surrounding text color
- keep `.ms-icon` text direction fixed to `ltr` so Material Symbols ligature names render
  consistently inside both left-to-right and right-to-left component layouts; this is an
  intentional exception to logical component layout direction

## Accessibility

- Decorative icons within labeled controls use `aria-hidden="true"`.
- Icon-only buttons must provide an accessible `aria-label`; icon ligatures do not provide the button name.
- Status icons in feedback supplement title, text, and live-region semantics; status must not rely on an icon alone.
- Passive search-field icons remain hidden from assistive technology because the associated label names the field.

## Showcase

Update existing component showcase pages rather than adding a standalone icon page:

- buttons demonstrate symbol-based icon controls and outlined versus filled `favorite` rendering
- feedback demonstrates Material Symbols inside alerts and toasts
- modal close controls render the `close` symbol
- tabs overflow scroll controls render the `chevron_left` and `chevron_right` symbols
- the search field demonstrates a passive `search` symbol prefix

Showcase snippets should use `ShowcaseCode` from `src/app/shared/ui-lib/components/showcase-code`.

Keep snippets hand-authored in the feature component `.ts` file and make each snippet a full standalone Angular component example that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Prefer `inject()` over constructor injection.
- Initialize the loader through standalone application providers.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The application starts one subsetted Material Symbols stylesheet request through a non-blocking
  environment initializer.
- Loading is idempotent and does not append duplicate font links.
- `.ms-icon` renders outlined symbols and `.ms-icon-filled` renders filled symbols.
- Existing feedback, modal, button icon, and search-field examples use Material Symbols rather than character glyphs.
- Any migrated symbol name exists in `MATERIAL_ICONS`.
- Close and icon-only buttons retain accessible labels.
- Component dimensions, feedback variants, theme behavior, and focus states remain unchanged.
- Material Symbols render correctly inside both `dir="ltr"` and `dir="rtl"` layouts while the
  surrounding component layout follows its document direction.
- Showcase examples and snippets reflect the icon utility convention.
