# Feature 016: Native Anchored Tooltip

## Goal

Create a reusable tooltip for brief, non-interactive descriptions. Tooltips use the native HTML
Popover API hint state and CSS Anchor Positioning so they render in the top layer, remain anchored
to their trigger, and mirror logical side placement in right-to-left layouts.

## Public API

Import tooltip primitives from the folder barrel:

```ts
import {
  TooltipComponent,
  TooltipPanelComponent,
  TooltipPlacement,
  TooltipTrigger,
} from '../../shared/components/tooltip';
```

Public pieces:

- `TooltipComponent` with selector `ms-tooltip`
- `TooltipPanelComponent` with selector `ms-tooltip-panel`
- `TooltipTrigger` directive with selector `[msTooltipTrigger]`
- `TooltipPlacement = 'top' | 'bottom' | 'start' | 'end'`

Required container API:

```ts
class TooltipComponent {
  readonly placement = input<TooltipPlacement>('top');
}
```

Defaults:

- tooltip `placement` is `top`
- keyboard focus opens the tooltip immediately
- pointer hover opens the tooltip after `500ms`
- the tooltip closes `100ms` after both trigger and panel pointer presence end and trigger focus is
  absent

Shared reusable components use the `ms-` selector prefix. The internal styling hook is
`.tooltip-panel`.

## Desired Usage

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  TooltipComponent,
  TooltipPanelComponent,
  TooltipTrigger,
} from './shared/components/tooltip';

@Component({
  selector: 'app-icon-tooltip-example',
  imports: [TooltipComponent, TooltipPanelComponent, TooltipTrigger],
  template: `
    <ms-tooltip placement="top">
      <button class="btn btn-ghost btn-icon" type="button" msTooltipTrigger aria-label="Details">
        <span class="ms-icon" aria-hidden="true">info_i</span>
      </button>

      <ms-tooltip-panel>Invitees receive an email notification.</ms-tooltip-panel>
    </ms-tooltip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTooltipExample {}
```

## Component Structure

The implementation lives in `src/app/shared/components/tooltip`:

- `TooltipComponent` coordinates its projected trigger, panel, placement, delays, dismissal, and
  active-tooltip ownership
- `TooltipTrigger` attaches interaction events and exposes the panel ID through
  `aria-describedby`
- `TooltipPanelComponent` renders the native hint popover surface and projected text
- `TooltipPlacement` defines logical centered placement
- `index.ts` exposes the public API

Consumers project exactly one trigger marked with `msTooltipTrigger` and one
`ms-tooltip-panel`. The panel receives an internally generated ID; trigger wiring appends this ID
to an existing `aria-describedby` value rather than replacing existing support text.

## Behavior

- Render the panel with `popover="hint"` and `role="tooltip"`.
- Open with `showPopover({ source: trigger })` so the source is the implicit CSS anchor.
- Do not add `popovertarget`, `aria-expanded`, or `aria-haspopup`; the tooltip is not a toggled
  popup control.
- Keep only one tooltip open through internal coordination, including where a browser treats
  unsupported `popover="hint"` as manual behavior.
- Keep an open tooltip visible while either its trigger or non-interactive panel is hovered.
- Close on pointer departure after the close delay, on blur when pointer is absent, and on
  `Escape`.
- When `Escape` dismisses a tooltip, do not reopen it from the same ongoing hover or focus state;
  a subsequent trigger entry or focus may open it normally.
- On destruction, clear timers, detach the active Escape listener, release active ownership, and
  hide the panel.

## Composition Rules

- `msTooltipTrigger` may be attached to any HTML element, but consumers must provide a naturally
  focusable trigger or explicitly make the host keyboard accessible.
- Tooltip panels contain supplementary descriptive text or non-interactive inline content only.
- Actions, links, fields, and other interactive panel content belong in `ms-popover`.
- Native disabled form controls cannot be direct accessible triggers because they cannot receive
  keyboard focus. Place a disabled control inside a focusable wrapper trigger that communicates
  its disabled state when a tooltip explanation is required.

## Styling

Feature styles live in `src/styles/components/_tooltip.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing surface, text, border, shadow, spacing, typography, motion, and dropdown z-index
  tokens.
- Place `top` and `bottom` tooltips centered on the block axis; place `start` and `end`
  tooltips on logical inline sides so they mirror in RTL.
- Use native named `@position-try` fallbacks in this order: `top` tries bottom, end, start;
  `bottom` tries top, end, start; `start` tries end, bottom, top; `end` tries start, bottom, top.
- Render a compact bubble surface without a directional arrow so native fallback positions remain
  visually correct without arrow-orientation styling.
- Do not add JavaScript measurement, collision logic, Angular CDK overlay dependencies, or a
  positioning polyfill.

## Accessibility

- Each tooltip panel has `role="tooltip"` and is connected to its trigger with
  `aria-describedby`.
- Trigger content has an accessible name independent of decorative icon ligatures.
- Tooltip content is descriptive rather than interactive and never receives focus automatically.
- Focus opens immediately for keyboard discovery, and `Escape` dismisses without moving focus.
- Existing described-by relationships remain intact when a tooltip is added to a form control or
  other described element.

## Showcase

The dedicated `/tooltip` page and home card demonstrate:

- an icon-only action tooltip with hover, focus, and Escape behavior
- centered top/bottom and logical start/end placement, including an RTL example
- link and form-control triggers, plus a focusable wrapper for a disabled button

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Acceptance Criteria

- Public tooltip primitives and `TooltipPlacement` are exported from the tooltip barrel.
- The tooltip uses native `popover="hint"` and native source-based implicit anchoring.
- Focus, delayed hover, delayed dismissal, pointer travel to the panel, Escape dismissal, and
  single-open coordination behave as documented.
- `aria-describedby` wiring preserves existing description IDs.
- Styles are token-based, use logical placement and native fallback behavior, and are forwarded
  through the component styles index.
- The `/tooltip` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
