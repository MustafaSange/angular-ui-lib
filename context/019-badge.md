# Feature 019: Badge

## Goal

Create a reusable badge primitive for compact status, category, and count metadata. Badges are
non-interactive by default and communicate brief state in a small inline visual treatment.

## Public API

Import badge primitives from the folder barrel:

```ts
import { BadgeComponent } from '../../shared/components/badge';
```

Public pieces:

- `BadgeComponent` with selector `ms-badge`

Required API:

```ts
type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type BadgeAppearance = 'soft' | 'solid' | 'outline';

class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly appearance = input<BadgeAppearance>('soft');
  readonly dot = input(false);
}
```

Defaults:

- badges use the neutral soft treatment
- badges are not dot-only unless configured
- dot badges render a visual status dot and may still include projected text

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.badge` and
`.badge-dot`.

## Desired Usage

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BadgeComponent } from './shared/components/badge';

@Component({
  selector: 'app-badge-example',
  imports: [BadgeComponent],
  template: `
    <ms-badge>Draft</ms-badge>
    <ms-badge variant="success">Active</ms-badge>
    <ms-badge variant="warning" appearance="solid">Pending</ms-badge>
    <ms-badge variant="danger" appearance="outline" [dot]="true">Incident</ms-badge>
    <ms-badge aria-label="12 unread notifications">12</ms-badge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeExample {}
```

## Component Structure

The implementation lives in `src/app/shared/components/badge`:

- `BadgeComponent` renders projected compact text and an optional status dot
- `index.ts` exposes the public API

`ms-badge` renders host-level inline markup. Consumers own the projected label text.

## Behavior

- Badges are non-interactive by default.
- Projected content is rendered as the badge label.
- Dot badges render a decorative dot before projected content in logical inline order.
- Empty badges are allowed only for dot-only status usage; consumers must provide an accessible
  name with `aria-label` when no readable text is projected.

## Projection and Composition Rules

- Consumers provide badge labels through default content projection.
- Do not use inputs for label text.
- Do not project interactive controls inside badges.
- Projected Material Symbols icons must use `.ms-icon` or `.ms-icon-filled`.

## Styling

Feature styles live in `src/styles/components/_badge.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing color, surface, border, spacing, radius, typography, motion, and focus-ring tokens.
- Use logical block/inline properties so badge dots and content mirror correctly in both
  `dir="ltr"` and `dir="rtl"`.
- Keep badges compact with a pill-shaped radius and stable line-height.
- `soft` uses a subtle variant-tinted surface and readable variant text.
- `solid` uses a filled variant surface and contrasting text.
- `outline` uses a transparent surface with variant border and text.
- In dark mode, badge text should match the alert/toast tone model: mix
  `var(--color-text-primary)` at 78% with the badge variant color for readable, restrained
  variant-tinted text. Solid badges keep high-contrast inverse text.
- Name component-private CSS custom properties with a `--_badge-*` prefix.
- Keep styles reusable across future projects.

## Accessibility

- Render badges without extra ARIA roles unless a specific consumer context requires one.
- Consumers must provide visible text or an `aria-label` for icon-only, count-only, or dot-only
  badges when the badge meaning is not clear from surrounding text.
- Hide decorative badge dots and decorative icons from assistive technology.

## Showcase

Add a dedicated `/badge` page and home card demonstrating:

- badge variants: neutral, info, success, warning, and danger
- badge appearances: soft, solid, and outline
- dot badges
- count badges
- badges with projected icons
- a scoped RTL example showing dot and icon mirroring

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public badge primitives are exported from the badge barrel.
- The primary badge usage example works as documented.
- Badges render variant, appearance, dot, count, and icon examples.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- Badge dots and projected icons mirror correctly in RTL layouts.
- The `/badge` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
