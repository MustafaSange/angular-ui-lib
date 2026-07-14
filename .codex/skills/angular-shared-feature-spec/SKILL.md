---
name: angular-shared-feature-spec
description: Create, change, review, or document reusable Angular 22 components, directives, services, pipes, types, and helpers under src/app/shared, including public ui-lib APIs and showcase integration. Use for work in src/app/shared/ui-lib or when adding/updating showcase examples for shared features.
---

# Angular Shared Feature Spec

## Inspect First

- Read `AGENTS.md`, the feature implementation, folder `index.ts`, templates, styles, consumers, and matching showcase files before changing anything.
- Preserve verified behavior and public APIs unless the request requires a breaking change. In documentation, describe only what the code proves.

## Architecture

- Keep library APIs under `src/app/shared/ui-lib`; keep app-only showcase infrastructure outside it.
- Keep `ShowcaseCode` at `src/app/shared/showcase-code`, import it directly from that folder, and never export it from a `ui-lib` barrel.
- Export intentional consumer APIs from the feature `index.ts` and root `src/app/shared/ui-lib/index.ts`.
- Put reusable public types/config/state/meta/helpers in focused sibling files and re-export them. Do not create type files for trivial class-only features.
- Avoid app-domain logic, routes, stores, and backend coupling.

## Angular 22

- Use standalone APIs without `standalone: true` or NgModules.
- Prefer signals (`signal`, `computed`, `input`, `output`, `model`), `inject()`, native control flow, strict types, and reactive forms for non-trivial forms.
- Use `@Service()` for root services and component `host` metadata instead of host decorators.
- Rely on default OnPush; add change-detection metadata only to opt into `ChangeDetectionStrategy.Eager`.

## UI Library Rules

- Use `ms-` public element selectors and concise unprefixed internal CSS classes. Preserve public utilities such as `.ms-icon` and `.ms-icon-filled`.
- Use design tokens, logical properties/placements, and RTL-safe layouts. Keep `.ms-icon { direction: ltr; }` for Material Symbols ligatures.
- Keep form controls enterprise-dense: 28px total small-control height, 14px control/choice-label text, muted field/choice labels, and border-aware projected-control sizing.
- Build semantic, keyboard-operable UI with visible focus and correct disabled, readonly, error, and screen-reader behavior.
- For `ms-search-query-form`, value-less operators must hide value controls, skip value validators, retain `null` state, and emit `value: null` using backend wire names.

## Showcase Rules

- Import live `ShowcaseCode` from `src/app/shared/showcase-code`; in copyable snippets import library APIs through `./shared/ui-lib`.
- Keep snippets hand-authored, complete standalone Angular examples beside the matching demo with `<app-showcase-code>`.
- Keep live demos and snippets behaviorally identical, including signals, validators, toggles, and derived state.
- With signal forms, bind `[formField]`, define validation through `schema(...)`, and derive live UI from field state. Do not duplicate validation with native attributes.

## Verify

- Confirm barrels expose only intended library APIs and never `ShowcaseCode`.
- Confirm examples compile, behavior and accessibility match the implementation, and styling remains token-based and RTL-safe.
- Run the relevant build/type checks. Do not add or update tests for behavior changes.
