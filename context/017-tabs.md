# Feature 017: Tabs

## Goal

Create a reusable tabs component for switching between related content panels. Tabs support simple
string labels through an input, richer projected labels through a named title template, and
overflowing tab lists with horizontal scroll controls while keeping panel content fully
consumer-owned through projection.

## Public API

Import tabs primitives from the folder barrel:

```ts
import { TabComponent, TabTitleDirective, TabsComponent } from '../../shared/ui-lib';
```

Public pieces:

- `TabsComponent` with selector `ms-tabs`
- `TabComponent` with selector `ms-tab`
- `TabTitleDirective` with selector `ng-template[msTabTitle]`

Required tab API:

```ts
class TabComponent {
  readonly title = input<string>();
}
```

Defaults:

- the first tab is selected by default
- projected `msTabTitle` content takes precedence over the `title` input
- tabs without a projected title or `title` input render an empty tab label

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.tabs`, `.tab-header`, `.tab-list`, `.tab`, `.tab-scroll-button`, and `.tab-panel`.

## Desired Usage

```ts
import { Component } from '@angular/core';

import { BadgeComponent, TabComponent, TabTitleDirective, TabsComponent } from './shared/ui-lib';

@Component({
  selector: 'app-tabs-example',
  imports: [TabsComponent, TabComponent, TabTitleDirective, BadgeComponent],
  template: `
    <ms-tabs>
      <ms-tab title="Overview">
        <p>Overview content.</p>
      </ms-tab>

      <ms-tab>
        <ng-template msTabTitle>
          Billing <ms-badge kind="info" appearance="solid" aria-label="3 billing items">3</ms-badge>
        </ng-template>

        <p>Billing content.</p>
      </ms-tab>
    </ms-tabs>
  `,
})
export class TabsExample {}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/tabs`:

- `TabsComponent` coordinates projected tabs, selected state, generated IDs, and keyboard behavior
- `TabComponent` stores a simple title input, optional projected title template, and projected panel
  content template
- `TabTitleDirective` marks a projected `ng-template` as the tab label template
- `index.ts` exposes the public API

`ms-tabs` renders a button-based tab list followed by the active tab panel. When the tab list
overflows its available inline space, previous/next scroll buttons render beside the tab list.
Projected `ms-tab` instances are queried as children and do not render their own wrapper markup.

## Behavior

- Select the first projected tab by default.
- Clicking a tab button selects that tab and renders its projected content.
- If the projected tab list changes and the selected index no longer exists, reset selection to the
  first tab.
- Render projected `msTabTitle` label content when present; otherwise render the `title` input.
- Keep tab labels in a single horizontal row.
- If the tab list overflows, allow native horizontal scrolling and render logical backward/forward
  scroll buttons.
- Hide the backward scroll button at the start of the scroll range and hide the forward scroll
  button at the end of the scroll range.
- Clicking a scroll button scrolls the tab list by a partial viewport width.
- Selecting a tab by click or keyboard interaction scrolls the selected tab into view.
- `ArrowRight` and `ArrowLeft` move selection and focus between tabs.
- In right-to-left layout, left and right arrow behavior mirrors logical inline direction.
- In right-to-left layout, scroll button icons mirror visually while scroll behavior follows logical
  inline direction.
- `Home` selects and focuses the first tab.
- `End` selects and focuses the last tab.

## Projection and Composition Rules

- Consumers project one or more `ms-tab` children inside `ms-tabs`.
- Consumers provide tab panel content as default content inside each `ms-tab`.
- Consumers may provide a rich label with one `<ng-template msTabTitle>`.
- Rich tab labels should remain concise and non-interactive because the title is rendered inside a
  native tab button.

## Styling

Feature styles live in `src/styles/components/_tabs.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing surface, text, border, spacing, typography, radius, motion, and focus-ring tokens.
- Use logical block/inline properties so the tab layout mirrors correctly in both `dir="ltr"` and
  `dir="rtl"`.
- Keep the active indicator on the logical block end edge of the tab list.
- Use `min-inline-size: 0` and constrained inline sizing so overflowing tab lists scroll within
  their parent container rather than forcing the parent wider.
- Hide native scrollbars for the tab list while preserving native horizontal scroll behavior.
- Keep styles reusable across future projects.

## Accessibility

- Render tab controls as native buttons.
- Use `role="tablist"` on the tab list, `role="tab"` on each tab button, and `role="tabpanel"` on
  the active panel.
- Generate IDs and wire `aria-controls` from each tab to its panel and `aria-labelledby` from the
  panel to the selected tab.
- Set `aria-selected` on each tab button.
- Use roving `tabindex` so the selected tab is in the tab order and inactive tabs are reachable with
  arrow keys.
- Move focus when selection changes through keyboard interaction.
- Scroll buttons are native buttons with accessible labels and only render when that direction can
  scroll.

## Showcase

Add a dedicated `/tabs` page and home card demonstrating:

- simple title-input tabs
- projected rich tab titles with `msTabTitle`
- overflowing tabs with scroll controls and a constrained demo width
- keyboard navigation, including a scoped RTL example

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Acceptance Criteria

- Public tabs primitives are exported from the tabs barrel.
- The primary usage example works as documented.
- Simple `title` labels and projected `msTabTitle` labels both render.
- Clicking and keyboard navigation update the selected panel.
- Overflowing tab lists remain single-row, scroll horizontally, and expose scroll controls only for
  directions that can move.
- Generated ARIA relationships connect tabs and panels.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- The `/tabs` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
