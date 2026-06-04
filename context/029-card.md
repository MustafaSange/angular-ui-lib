# Feature 029: Card

## Goal

Creates a reusable card container for grouping related content, optional media, and actions. Cards
should remain composition-first so consumers keep ownership of semantic markup while the library
provides consistent spacing, surfaces, borders, radius, and elevation.

## Public API

Import card primitives from the folder barrel:

```ts
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardMediaDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from '../../shared/components/card';
```

Public pieces:

- `CardComponent` with selector `ms-card`
- `CardHeaderDirective` with selector `[msCardHeader]`
- `CardTitleDirective` with selector `[msCardTitle]`
- `CardSubtitleDirective` with selector `[msCardSubtitle]`
- `CardContentDirective` with selector `[msCardContent]`
- `CardFooterDirective` with selector `[msCardFooter]`
- `CardMediaDirective` with selector `[msCardMedia]`

Required API:

```ts
type CardAppearance = 'outlined' | 'elevated' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

class CardComponent {
  readonly appearance = input<CardAppearance>('outlined');
  readonly padding = input<CardPadding>('md');
}
```

Defaults:

- cards use the outlined appearance
- cards use medium padding
- section directives only add styling hooks and do not change native semantics

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.card`,
`.card-header`, `.card-title`, `.card-subtitle`, `.card-content`, `.card-footer`, and
`.card-media`.

## Desired Usage

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from './shared/components/card';

@Component({
  selector: 'app-card-example',
  imports: [
    CardComponent,
    CardHeaderDirective,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    CardFooterDirective,
  ],
  template: `
    <ms-card appearance="elevated">
      <header msCardHeader>
        <h2 msCardTitle>Project health</h2>
        <p msCardSubtitle>Updated today</p>
      </header>

      <section msCardContent>
        <p>Review status, risks, and upcoming decisions for the project.</p>
      </section>

      <footer msCardFooter>
        <button class="btn btn-primary btn-sm" type="button">Open</button>
      </footer>
    </ms-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardExample {}
```

## Component Structure

The implementation lives in `src/app/shared/components/card`:

- `CardComponent` renders projected content inside the `ms-card` host
- `card-types.ts` defines `CardAppearance` and `CardPadding`
- section directives apply reusable styling hooks to consumer-owned semantic elements
- `index.ts` exposes the public API

Consumers can compose a card from semantic elements such as `header`, headings, `section`,
`footer`, images, or plain content. The card does not generate headings, IDs, or ARIA
relationships.

## Behavior

- Cards are non-interactive by default.
- Projected content is rendered unchanged.
- `appearance` selects outlined, elevated, or filled surface treatment.
- `padding` selects spacing scale for card sections.
- `padding="none"` removes default section padding and is intended for edge-to-edge media or fully
  custom inner layouts.
- Section directives do not add keyboard behavior, focus behavior, disabled states, or ARIA roles.

## Projection and Composition Rules

- Use content projection for all card content.
- Use native semantic elements with card directives when semantics matter.
- Use `msCardHeader` for introductory content, `msCardTitle` for the visible heading,
  `msCardSubtitle` for supporting metadata, `msCardContent` for body content, `msCardFooter` for
  actions, and `msCardMedia` for edge-to-edge media.
- Do not use inputs for title, subtitle, body, or action labels.
- Avoid nesting cards inside cards.

## Styling

Feature styles live in `src/styles/components/_card.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing color, surface, border, spacing, radius, typography, shadow, and focus-ring tokens.
- Use logical block/inline properties so spacing and rounded media edges behave correctly in both
  `dir="ltr"` and `dir="rtl"`.
- Keep cards at `var(--radius-md)` to satisfy the library's compact card radius rule.
- `outlined` uses the standard surface and border.
- `elevated` uses the raised surface and medium shadow.
- `filled` uses the muted surface without a border.
- Name component-private CSS custom properties with a `--_card-*` prefix.
- Keep styles reusable across future projects.

## Accessibility

- Do not add roles to cards by default.
- Consumers choose semantic elements and accessible names appropriate to the content.
- Card title directives should usually be placed on a native heading element.
- Decorative media should be hidden from assistive technology with `aria-hidden="true"`.
- Interactive controls projected into a footer must keep their own accessible names and keyboard
  behavior.

## Showcase

Includes a dedicated `/card` page and home card demonstrating:

- a basic semantic card
- outlined, elevated, and filled appearances
- media with actions
- a scoped RTL example

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

- Public card primitives are exported from the card barrel.
- The primary card usage example works as documented.
- Cards render basic, appearance, media/action, and RTL examples.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- Card layout behaves correctly in RTL layouts.
- The `/card` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
