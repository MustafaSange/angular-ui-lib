# Feature 015: Cascade Layers and Base Element Styles

## Goal

Organize the global style entrypoint into explicit CSS cascade layers and separate browser-reset
rules from design-system element defaults.

This gives the library a predictable precedence order while keeping token-backed `body` and link
styling distinct from the minimal reset foundation.

## Structure

The implementation lives in:

- `src/styles/_index.scss`
- `src/styles/base/_index.scss`
- `src/styles/base/_reset.scss`
- `src/styles/base/_elements.scss`

## Layer Order

The global style entrypoint declares these layers from lowest to highest precedence:

```scss
@layer reset, tokens, base, layout, components, utilities;
```

The entrypoint loads styles into their matching layer:

- `reset` loads `./base/reset`
- `tokens` loads `./colors` and `./tokens`
- `base` loads `./base/elements`
- `layout` loads `./layout`
- `components` loads `./components`
- `utilities` loads `./utilities`

Use `sass:meta` with `meta.load-css()` so generated CSS is emitted inside the declared layers.

## Reset Layer

`src/styles/base/_reset.scss` contains only low-level normalization:

- remove default margin and padding and apply `border-box` sizing universally
- preserve browser text scaling behavior through `-webkit-text-size-adjust: 100%` on `html`
- keep common media elements block-level and constrained to their container inline size
- make native form controls inherit surrounding typography

The reset layer does not own design token-backed document colors, typography, or interactive link
appearance.

## Base Layer

`src/styles/base/_elements.scss` contains styled native element defaults that depend on design
tokens:

- `body` uses background, text, font-family, and line-height tokens
- native `a` elements use semantic link and hover colors
- focused native links use the shared control focus-ring token
- links with the `.btn` class retain button hover behavior instead of link hover color behavior

`src/styles/base/_index.scss` forwards both the reset and element partials for base-style
discoverability, while the global entrypoint loads each partial into its intended layer.

## Behavior

- Token definitions are emitted before token-backed base element declarations.
- Component styling overrides base element defaults without increasing selector specificity solely
  for cascade precedence.
- Utility styles are emitted at the highest declared application layer and can intentionally
  override layout or component presentation.
- Existing logical media sizing remains direction-safe through `max-inline-size`.

## Out Of Scope

- New design tokens
- New component styles or public Angular APIs
- New utility classes
- Additional browser reset opinions beyond the existing reset rules

## Acceptance Criteria

- The global Sass entrypoint compiles using the explicit layer order.
- Reset, token, base, layout, component, and utility output is emitted into its declared layer.
- The reset partial contains normalization rules only.
- Token-backed `body` and native link defaults are emitted from the base element partial.
- Native link focus and hover behavior remains consistent with the existing design tokens.
- No Angular behavior or component API is changed by this styling organization.
