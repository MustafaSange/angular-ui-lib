# Feature 030: Breadcrumb

## Goal

Create a reusable breadcrumb navigation component for showing a user's location within an
application hierarchy and providing quick navigation to ancestor pages.

Breadcrumbs should use native links for navigable ancestors, clearly identify the current page, and
remain compact, RTL-safe, and accessible across responsive layouts.

## Public API

Import breadcrumb primitives from the folder barrel:

```ts
import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from '../../shared/components/breadcrumb';
```

Public pieces:

- `BreadcrumbComponent` with selector `ms-breadcrumb`
- `BreadcrumbItemDirective` with selector `a[msBreadcrumbItem], span[msBreadcrumbItem]`
- `BreadcrumbSeparatorDirective` with selector `[msBreadcrumbSeparator]`

Required API:

```ts
type BreadcrumbSize = 'sm' | 'md';

class BreadcrumbComponent {
  readonly label = input('Breadcrumb');
  readonly size = input<BreadcrumbSize>('md');
}

class BreadcrumbItemDirective {
  readonly current = input(false, { transform: booleanAttribute });
}
```

Defaults:

- breadcrumbs use the accessible label `Breadcrumb`
- breadcrumbs use medium sizing
- breadcrumb items are not current unless `[current]="true"` is set
- boolean `current` supports attribute usage such as `current`
- default decorative chevron separators render between adjacent breadcrumb items when no custom
  separator is projected anywhere in the breadcrumb
- custom projected separators opt the breadcrumb out of automatic separators

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.breadcrumb`, `.breadcrumb-list`, `.breadcrumb-item`, `.breadcrumb-link`, `.breadcrumb-current`, and
`.breadcrumb-separator`. Established public utility classes such as `.ms-icon` and
`.ms-icon-filled` remain namespaced.

## Desired Usage

Basic breadcrumb with router links:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbComponent, BreadcrumbItemDirective } from './shared/components/breadcrumb';

@Component({
  selector: 'app-breadcrumb-example',
  imports: [RouterLink, BreadcrumbComponent, BreadcrumbItemDirective],
  template: `
    <ms-breadcrumb>
      <a msBreadcrumbItem routerLink="/">Home</a>
      <a msBreadcrumbItem routerLink="/components">Components</a>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  `,
})
export class BreadcrumbExample {}
```

Custom label and separator:

```ts
import { Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from './shared/components/breadcrumb';

@Component({
  selector: 'app-custom-breadcrumb-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective],
  template: `
    <ms-breadcrumb label="Documentation path" size="sm">
      <a msBreadcrumbItem href="/docs">Docs</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <a msBreadcrumbItem href="/docs/components">Components</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  `,
})
export class CustomBreadcrumbExample {}
```

Collapsed middle path:

```html
<ms-breadcrumb label="Project location">
  <a msBreadcrumbItem href="/">Home</a>
  <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
  <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Show parent pages">
    <span class="ms-icon" aria-hidden="true">more_horiz</span>
  </button>
  <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
  <a msBreadcrumbItem href="/projects/design-system">Design system</a>
  <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
  <span msBreadcrumbItem current>Components</span>
</ms-breadcrumb>
```

## Component Structure

The implementation lives in:

`src/app/shared/components/breadcrumb`

The feature includes:

- `BreadcrumbComponent` rendering a semantic navigation landmark and projected breadcrumb content
- `BreadcrumbItemDirective` applying item styling, current-page state, and current-page ARIA
- `BreadcrumbSeparatorDirective` applying separator styling for consumer-provided separators
- `breadcrumb-types.ts` defining `BreadcrumbSize`
- `index.ts`

The showcase lives in:

`src/app/features/breadcrumb`

Showcase example components live in:

`src/app/features/breadcrumb/showcases`

Styles live in:

`src/styles/components/_breadcrumb.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

## Behavior

- `ms-breadcrumb` renders a navigation landmark with an ordered list.
- Projected breadcrumb items render in the order provided by the consumer.
- Navigable ancestors use native anchors.
- The current page uses a non-link element, usually `span`, with `[current]="true"`.
- Applying `[current]="true"` or the `current` attribute sets `aria-current="page"` on the item
  host.
- Default decorative chevron separators render after each `.breadcrumb-item` except the last one
  when no `[msBreadcrumbSeparator]` content is projected.
- Automatic separators do not render after arbitrary projected buttons or overflow controls.
- Projecting any `[msBreadcrumbSeparator]` disables automatic separators for that breadcrumb, so
  consumers must provide every visual separator explicitly.
- `size="sm"` uses compact typography and spacing.
- `size="md"` uses the default typography and spacing.
- Long breadcrumb labels truncate with ellipsis rather than wrapping each item onto multiple lines.
- Breadcrumbs may wrap as a whole on narrow containers only when wrapping avoids horizontal
  overflow.
- Disabled states are not provided by the breadcrumb component; consumers should omit links that are
  not navigable.
- The component does not read router state, generate routes, or infer labels.

## Projection and Composition Rules

- Consumers provide breadcrumb items through content projection.
- Use `a[msBreadcrumbItem]` for ancestors that navigate.
- Use `span[msBreadcrumbItem]` for the current page.
- Use `[current]="true"` on exactly one item when the current page is represented in the breadcrumb.
- Use `[msBreadcrumbSeparator]` only for custom visual separators or for separators around projected
  overflow controls.
- Do not put interactive controls inside breadcrumb items except for an explicit overflow control.
- Overflow controls should be native buttons with an accessible name and should open a menu or
  popover owned by the consumer.
- When an overflow button is projected between breadcrumb items, use explicit
  `[msBreadcrumbSeparator]` elements before and after the button because automatic separators are
  intentionally disabled by custom separators and do not attach to buttons.
- Breadcrumb items should contain concise page labels, not descriptions or secondary metadata.

## Styling

Feature styles live in:

`src/styles/components/_breadcrumb.scss`

Styling rules:

- use existing tokens for colors, spacing, radius, typography, motion, and focus rings
- use concise unprefixed internal CSS class hooks
- reserve `.ms-icon` and `.ms-icon-filled` for established Material Symbols utility styling
- keep `.ms-icon { direction: ltr; }` unchanged for Material Symbols ligature rendering
- use `Material Symbols Outlined` for default chevron separator ligatures so they match `.ms-icon`
- keep `chevron_right` and projected overflow icon `more_horiz` in `MATERIAL_ICONS`
- use logical block/inline properties so spacing and item order mirror correctly in both
  `dir="ltr"` and `dir="rtl"`
- mirror the default separator icon in RTL with transform rules
- give default separator chevrons symmetric `margin-inline` spacing and remove parent flex `gap`
  while automatic separators are active so LTR and RTL spacing remains even
- name component-private CSS custom properties with a `--_breadcrumb-*` prefix
- truncate long labels with `text-overflow: ellipsis` and stable inline-size constraints
- keep breadcrumb rows visually quiet and avoid card-like framing

## Accessibility

- `ms-breadcrumb` renders or hosts a native `nav` landmark.
- The landmark receives an accessible name from `label`.
- Breadcrumb content is exposed as an ordered list.
- Decorative default separators are hidden from assistive technology.
- Custom visual separators should be hidden from assistive technology with `aria-hidden="true"`.
- The current item receives `aria-current="page"`.
- There should be only one current page item per breadcrumb.
- Links keep native keyboard behavior.
- Any overflow control must be a native button with an accessible name.
- Focus rings remain visible on links and overflow controls through `:focus-visible`.

## Showcase

Add a dedicated `/breadcrumb` page and home card demonstrating:

- basic breadcrumb with router links
- compact breadcrumb sizing
- custom separators
- collapsed middle path with an overflow button
- long-label truncation
- scoped RTL preview showing mirrored separator direction and logical spacing

Showcase snippets use `ShowcaseCode` from `src/app/shared/components/showcase-code`, are
hand-authored in dedicated showcase components under `src/app/features/breadcrumb/showcases`, and
render near the matching visual examples with `<app-showcase-code>`.

The `/breadcrumb` page imports and renders dedicated showcase components:

- `BreadcrumbBasicShowcase`
- `BreadcrumbCompactShowcase`
- `BreadcrumbSeparatorsShowcase`
- `BreadcrumbOverflowShowcase`
- `BreadcrumbLongLabelShowcase`
- `BreadcrumbRtlShowcase`

Shared showcase section styles live in
`src/app/features/breadcrumb/showcases/breadcrumb-showcase.scss`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the breadcrumb barrel.
- Shared reusable selectors use the `ms-` prefix.
- The primary usage examples compile unchanged.
- Breadcrumbs render a named navigation landmark with ordered-list semantics.
- Ancestor links and current-page items behave as documented.
- Current-page state sets `aria-current="page"`.
- Default and custom separators render correctly and are decorative for assistive technology.
- Default separator ligatures render as icons, not visible text.
- Overflow buttons do not receive accidental automatic separators.
- Explicit overflow separators render evenly around the overflow button.
- Compact and default sizing variants render correctly.
- Long labels truncate without breaking layout.
- RTL default separator spacing is visually even and the default chevron direction mirrors.
- Styling is token-based and forwarded through the component styles index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- The `/breadcrumb` route and home card expose copyable demonstrations of core behavior through
  dedicated showcase components.
- No tests are added or updated for this feature.
