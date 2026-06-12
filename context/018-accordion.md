# Feature 018: Accordion

## Goal

Create a reusable accordion component for progressively disclosing related content sections.
Accordions support simple string titles, richer projected title templates, disabled items, and
single-open or multiple-open behavior.

## Public API

Import accordion primitives from the folder barrel:

```ts
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTitleDirective,
} from '../../shared/ui-lib';
```

Public pieces:

- `AccordionComponent` with selector `ms-accordion`
- `AccordionItemComponent` with selector `ms-accordion-item`
- `AccordionTitleDirective` with selector `ng-template[msAccordionTitle]`

Required API:

```ts
class AccordionComponent {
  readonly multiple = input(false);
}

class AccordionItemComponent {
  readonly title = input('');
  readonly disabled = input(false);
  readonly expanded = model(false);
}
```

Defaults:

- accordions allow one expanded item at a time
- accordion items start collapsed unless `expanded` is set
- projected `msAccordionTitle` content takes precedence over the `title` input
- disabled items cannot be toggled or focused through accordion keyboard navigation

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.accordion`, `.accordion-item`, `.accordion-heading`, `.accordion-trigger`, `.accordion-title`, `.accordion-icon`, and `.accordion-panel`.

Public styling modifiers:

- `.accordion-compact` reduces trigger height, spacing, icon size, and panel padding for denser
  disclosure groups.

## Desired Usage

```ts
import { Component } from '@angular/core';

import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTitleDirective,
  BadgeComponent,
} from './shared/ui-lib';

@Component({
  selector: 'app-accordion-example',
  imports: [AccordionComponent, AccordionItemComponent, AccordionTitleDirective, BadgeComponent],
  template: `
    <ms-accordion>
      <ms-accordion-item title="Account settings" [expanded]="true">
        <p>Manage profile details, sign-in methods, and preferences.</p>
      </ms-accordion-item>

      <ms-accordion-item>
        <ng-template msAccordionTitle> Billing <ms-badge kind="success">Updated</ms-badge> </ng-template>

        <p>Review invoices, payment methods, and renewal settings.</p>
      </ms-accordion-item>
    </ms-accordion>

    <ms-accordion class="accordion-compact">
      <ms-accordion-item title="Compact item">
        <p>Use compact accordions for tighter disclosure groups.</p>
      </ms-accordion-item>
    </ms-accordion>
  `,
})
export class AccordionExample {}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/accordion`:

- `AccordionComponent` coordinates projected items, generated IDs, toggle behavior, and keyboard
  focus movement
- `AccordionItemComponent` stores title, disabled, expanded state, optional projected title
  template, and projected panel content template
- `AccordionTitleDirective` marks a projected `ng-template` as the item title template
- `index.ts` exposes the public API

`ms-accordion` renders native button triggers and panels for projected `ms-accordion-item`
instances. Projected item instances do not render wrapper markup on their own.

## Behavior

- Items are collapsed by default.
- Clicking an enabled item trigger toggles that item.
- In default single-open mode, opening one item closes every other item.
- When `[multiple]="true"`, items toggle independently.
- Disabled items cannot be toggled.
- Render projected `msAccordionTitle` content when present; otherwise render the `title` input.
- `ArrowDown` and `ArrowUp` move focus between enabled triggers.
- `ArrowRight` and `ArrowLeft` move focus in logical inline direction and mirror in right-to-left
  layout.
- `Home` focuses the first enabled trigger.
- `End` focuses the last enabled trigger.

## Projection and Composition Rules

- Consumers project one or more `ms-accordion-item` children inside `ms-accordion`.
- Consumers provide panel content as default content inside each item.
- Consumers may provide a rich title with one `<ng-template msAccordionTitle>`.
- Rich titles should remain concise and non-interactive because the title is rendered inside a
  native button.

## Styling

Feature styles live in `src/styles/components/_accordion.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing surface, text, border, spacing, typography, radius, motion, and focus-ring tokens.
- Use logical block/inline properties so the accordion mirrors correctly in both `dir="ltr"` and
  `dir="rtl"`.
- Visually distinguish expanded items with a token-based primary accent rail on the logical inline
  start edge, a subtle primary-tinted trigger surface, and primary-colored trigger text/icon.
- Support `.accordion-compact` on `ms-accordion` as a CSS-only density modifier.
- Render the disclosure icon with `.ms-icon`.
- Keep styles reusable across future projects.

## Accessibility

- Render each trigger as a native button.
- Wire `aria-expanded` on each trigger.
- Generate IDs and wire `aria-controls` from each trigger to its panel and `aria-labelledby` from
  each panel to its trigger.
- Render expanded content in a `role="region"` panel.
- Keep disabled state on the native button.
- Hide decorative disclosure icons from assistive technology.
- Preserve visible focus indication on triggers.

## Showcase

Add a dedicated `/accordion` page and home card demonstrating:

- single-open accordion behavior
- compact accordion density
- multiple-open behavior with projected rich titles
- disabled item state
- keyboard navigation, including a scoped RTL example

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Acceptance Criteria

- Public accordion primitives are exported from the accordion barrel.
- The primary usage example works as documented.
- Simple `title` labels and projected `msAccordionTitle` labels both render.
- Clicking and keyboard navigation update or move through enabled items as documented.
- Generated ARIA relationships connect triggers and panels.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- `.accordion-compact` provides a denser visual treatment without changing accordion behavior.
- Expanded items have a visible active treatment that mirrors correctly in RTL layouts.
- The `/accordion` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
