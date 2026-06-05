# Feature XXX: Feature Name

## Goal

Create a concise goal statement for the feature.

Describe the expected quality bar and the main capability this feature adds. Keep this focused on user-facing or library-facing outcomes, not implementation steps.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  FeatureComponent,
  FeatureConfig,
  FeatureService,
} from '../../shared/components/feature-name';
```

Public pieces:

- `FeatureComponent` with selector `ms-feature-name`
- `FeatureService` for feature behavior, if needed
- `FeatureConfig` for feature options, if needed

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

Use concise unprefixed internal CSS class hooks for new shared components, such as
`.feature-name-panel` or `.feature-name-item`; do not mirror the component prefix as `.ms-*`.
Established public utility classes such as `.ms-icon` and `.ms-icon-filled` remain namespaced.

Document required inputs, outputs, services, config objects, helper classes, exported types, and default values here.

## Desired Usage

Show the primary consumer usage as copyable code.

```html
<ms-feature-name> Feature content </ms-feature-name>
```

For TypeScript APIs, include typed examples.

```ts
const result = featureService.run<FeatureData, FeatureResult>({
  value: 'example',
});
```

Examples should reflect the final public API, not internal implementation details.

## Component Structure

The implementation lives in:

`src/app/shared/components/feature-name`

The feature includes:

- `FeatureComponent`
- supporting components, directives, services, types, or helpers
- `index.ts`

Describe the rendered structure, projected areas, internal responsibilities, and any important layout model.

## Behavior

Document required behavior in implementation-ready terms.

- primary behavior
- state changes
- lifecycle behavior
- keyboard or pointer behavior
- cleanup behavior
- disabled, readonly, loading, or empty states when relevant

Keep behavior specific enough that the implementer does not need to invent product rules.

## Projection and Composition Rules

Document how consumers provide content.

- prefer content projection when consumers should own markup
- use inputs only for configuration or primitive values
- identify named slots, projected child components, or directives
- describe generated IDs, label wiring, or ARIA relationships when relevant

Remove this section if the feature does not use projection or composition.

## Styling

Feature styles live in:

`src/styles/components/_feature-name.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, shadow, border width, motion, and focus rings
- use concise unprefixed internal CSS class hooks for new shared components; reserve `.ms-*` for
  established public utilities such as `.ms-icon` and `.ms-icon-filled`
- use logical block/inline CSS properties and logical placement terms so reusable component
  layouts mirror correctly in both `dir="ltr"` and `dir="rtl"`
- document any deliberate direction exception, such as Material Symbols ligature rendering or an
  explicitly physical consumer utility
- name component-private CSS custom properties with a `--_feature-name-*` prefix, and reserve public `--color-*`, `--theme-*`, or feature-prefixed properties for intentional consumer APIs
- render visual icons with `.ms-icon` or `.ms-icon-filled` as documented in `context/013-material-symbols.md`, and add every new Material Symbols ligature name to `MATERIAL_ICONS`
- keep styles reusable across future projects
- include responsive behavior when relevant
- avoid hardcoded values when tokens exist

## Accessibility

Document required accessibility behavior.

- semantic roles and elements
- ARIA attributes and relationships
- keyboard support
- focus behavior
- screen reader behavior
- disabled or readonly behavior
- ensure decorative icons are hidden from assistive technology and icon-only controls have an accessible name independent of the symbol

Remove this section only when there are no meaningful accessibility requirements beyond native HTML semantics.

## Showcase

Add or update the relevant showcase page with live examples for the main variants and states.

Showcase snippets should use `ShowcaseCode` from `src/app/shared/components/showcase-code`.

Keep snippets hand-authored in the feature component `.ts` file and make each snippet a full standalone Angular component example that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Prefer reactive forms for non-trivial forms.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the feature folder barrel.
- Shared reusable components use the `ms-` selector prefix.
- The primary usage example works as documented.
- Required behavior and states are implemented.
- Styling uses existing tokens and is forwarded from the components style index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Accessibility requirements are implemented.
- The showcase demonstrates core variants and renders matching copyable snippets.
