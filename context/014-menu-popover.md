# Feature 014: Native Menu and Popover

## Goal

Create reusable anchored floating surfaces for action menus and arbitrary popover content.

Both patterns use the native HTML Popover API for visibility, top-layer rendering, and light
dismissal, together with native CSS Anchor Positioning for trigger-relative placement and
viewport-aware fallback positions. Menus provide command-list keyboard semantics; popovers keep
normal interaction behavior for projected content such as filters or quick settings.

## Public API

Import menu and popover primitives from the folder barrel:

```ts
import {
  AnchoredPlacement,
  MenuComponent,
  MenuDividerComponent,
  MenuItem,
  MenuPanelComponent,
  MenuTrigger,
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from '../../shared/ui-lib';
```

Public pieces:

- `MenuComponent` with selector `ms-menu`
- `MenuPanelComponent` with selector `ms-menu-panel`
- `MenuTrigger` directive with selector `button[msMenuTrigger]`
- `MenuItem` directive with selector `button[msMenuItem], a[msMenuItem]`
- `MenuDividerComponent` with selector `ms-menu-divider`
- `PopoverComponent` with selector `ms-popover`
- `PopoverPanelComponent` with selector `ms-popover-panel`
- `PopoverTrigger` directive with selector `button[msPopoverTrigger]`
- `PopoverClose` directive with selector `button[msPopoverClose]`
- `AnchoredPlacement` for supported panel positions

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks remain unprefixed: use `.menu-panel`, `.popover-panel`, and `.menu-item`
rather than mirroring public component selectors as `.ms-*`. Existing public icon utilities such
as `.ms-icon` and `.ms-icon-filled` stay namespaced.

Required type:

```ts
type AnchoredPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'start-top'
  | 'start-bottom'
  | 'end-top'
  | 'end-bottom';
```

Required container APIs:

```ts
class MenuComponent {
  readonly open = model(false);
  readonly placement = input<AnchoredPlacement>('bottom-start');
}

class PopoverComponent {
  readonly open = model(false);
  readonly placement = input<AnchoredPlacement>('bottom-start');
}
```

Defaults:

- menu and popover `open` state is `false`
- menu and popover `placement` is `bottom-start`
- `bottom-start` places a panel below its trigger and aligns logical start edges
- side placements are logical: `start-top` and `start-bottom` render at inline-start, while
  `end-top` and `end-bottom` render at inline-end and therefore mirror in `dir="rtl"`

Horizontal layout side placement mapping:

| Placement      | LTR                   | RTL                   |
| -------------- | --------------------- | --------------------- |
| `start-top`    | left, top-aligned     | right, top-aligned    |
| `start-bottom` | left, bottom-aligned  | right, bottom-aligned |
| `end-top`      | right, top-aligned    | left, top-aligned     |
| `end-bottom`   | right, bottom-aligned | left, bottom-aligned  |

## Desired Usage

Overflow action menu:

```ts
import { Component } from '@angular/core';
import {
  MenuComponent,
  MenuDividerComponent,
  MenuItem,
  MenuPanelComponent,
  MenuTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-project-actions-example',
  imports: [MenuComponent, MenuDividerComponent, MenuItem, MenuPanelComponent, MenuTrigger],
  template: `
    <ms-menu placement="bottom-end">
      <button
        class="btn btn-ghost btn-icon"
        type="button"
        msMenuTrigger
        aria-label="Project actions"
      >
        <span class="ms-icon" aria-hidden="true">more_vert</span>
      </button>

      <ms-menu-panel aria-label="Project actions">
        <button type="button" msMenuItem>
          <span class="ms-icon" aria-hidden="true">edit</span>
          Rename
        </button>
        <a href="/projects/archive" msMenuItem>Archive project</a>
        <button type="button" msMenuItem disabled>Transfer ownership</button>
        <ms-menu-divider />
        <button type="button" msMenuItem>Delete project</button>
      </ms-menu-panel>
    </ms-menu>
  `,
})
export class ProjectActionsExample {}
```

Filter/settings popover:

```ts
import { Component, signal } from '@angular/core';
import {
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-filter-popover-example',
  imports: [PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger],
  template: `
    <ms-popover [(open)]="filtersOpen">
      <button class="btn btn-outline" type="button" msPopoverTrigger>
        Filters
        <span class="ms-icon" aria-hidden="true">expand_more</span>
      </button>

      <ms-popover-panel aria-label="Project filters">
        <h2>Filters</h2>

        <label>
          Status
          <select>
            <option>All projects</option>
            <option>Active</option>
            <option>Archived</option>
          </select>
        </label>

        <div class="filter-actions">
          <button class="btn btn-ghost" type="button" msPopoverClose>Cancel</button>
          <button class="btn btn-primary" type="button" msPopoverClose>Apply</button>
        </div>
      </ms-popover-panel>
    </ms-popover>
  `,
})
export class FilterPopoverExample {
  protected readonly filtersOpen = signal(false);
}
```

Side-positioned popover:

```ts
import { Component } from '@angular/core';
import {
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-side-popover-example',
  imports: [PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger],
  template: `
    <ms-popover placement="end-top">
      <button class="btn btn-outline" type="button" msPopoverTrigger>View details</button>

      <ms-popover-panel aria-label="Release details">
        <h2>Release ready</h2>
        <p>Checks passed and the package is ready to publish.</p>
        <button class="btn btn-primary btn-sm" type="button" msPopoverClose>Done</button>
      </ms-popover-panel>
    </ms-popover>
  `,
})
export class SidePopoverExample {}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/menu-popover`

The feature includes:

- `MenuComponent` coordinating its trigger, panel, visibility model, and menu interactions
- `MenuPanelComponent` rendering the native menu popover surface
- `MenuTrigger`, `MenuItem`, and `MenuDividerComponent` defining menu composition
- `PopoverComponent` coordinating its trigger, panel, and visibility model
- `PopoverPanelComponent` rendering a native popover surface for arbitrary content
- `PopoverTrigger` and `PopoverClose` defining popover controls
- shared placement type and private anchor-positioning behavior
- `index.ts`

Each container owns exactly one trigger and one panel. The panel receives an internally generated
ID, and the trigger directive connects its native button to that panel with `popovertarget`.
Trigger directives expose the generated relationship through `aria-controls` and synchronize
`aria-expanded` with the native panel state; menu triggers additionally expose
`aria-haspopup="menu"`.
Consumers configure placement and projected content; they do not create IDs, anchors, overlay
outlets, or positioning logic.

## Behavior

Shared native popover behavior:

- render each menu or popover panel with `popover="auto"`
- associate the native trigger button with its panel through `popovertarget`
- rely on the browser for top-layer rendering, outside-interaction light dismissal, Escape close
  requests, and closing an unrelated open auto popover when another opens
- synchronize `open` with native `toggle` events, including dismissal initiated by the browser
- when an external `open` model change opens the panel, call `showPopover({ source: trigger })` so
  the trigger remains the native implicit anchor; close external model changes with `hidePopover()`
- do not add an application-level overlay service, outlet, or document-level outside-click
  listener for these panels

Native anchor positioning behavior:

- the associated trigger button is the panel's native implicit anchor
- consumers do not set `anchor-name`, `position-anchor`, panel IDs, or geometry values
- translate `placement` into panel `position-area` styles using logical block and inline edges
- use `bottom-start` as the base position for both menus and popovers
- express fallbacks with logical `start` and `end` edges through `position-try-fallbacks` or
  `position-try` so placement behavior works in both left-to-right and right-to-left layouts
- constrain large panels to viewport-safe inline and block sizes and allow internal scrolling
- do not implement JavaScript measurement, JavaScript collision detection, Angular CDK overlay, or
  a legacy positioning fallback

Native position-area and fallback mapping:

| Placement      | `position-area`                 | Ordered fallbacks                         |
| -------------- | ------------------------------- | ----------------------------------------- |
| `bottom-start` | `block-end span-inline-end`     | `bottom-end`, `top-start`, `top-end`      |
| `bottom-end`   | `block-end span-inline-start`   | `bottom-start`, `top-end`, `top-start`    |
| `top-start`    | `block-start span-inline-end`   | `top-end`, `bottom-start`, `bottom-end`   |
| `top-end`      | `block-start span-inline-start` | `top-start`, `bottom-end`, `bottom-start` |
| `start-top`    | `inline-start span-block-end`   | `start-bottom`, `end-top`, `end-bottom`   |
| `start-bottom` | `inline-start span-block-start` | `start-top`, `end-bottom`, `end-top`      |
| `end-top`      | `inline-end span-block-end`     | `end-bottom`, `start-top`, `start-bottom` |
| `end-bottom`   | `inline-end span-block-start`   | `end-top`, `start-bottom`, `start-top`    |

Top/bottom placements preserve the requested block direction first. Side placements preserve the
requested logical inline side first.

Menu behavior:

- opening a menu moves focus to its first enabled menu item
- `ArrowDown` and `ArrowUp` move focus through enabled items, wrapping at either end
- `Home` and `End` move focus to the first or last enabled item
- disabled items are not activated and are skipped during keyboard navigation
- activating an enabled button or link menu item closes the menu
- `Escape` closes the menu and restores focus to its trigger
- `Tab` closes the menu and allows focus to move normally rather than trapping it

Popover behavior:

- opening a popover does not automatically move focus into projected content
- controls inside the panel participate in normal document tab order
- activating an element with `msPopoverClose` closes the panel and restores focus to its trigger
- other interaction inside the panel does not close it unless it causes native light dismissal
- no focus trap or menu keyboard navigation is added to arbitrary popover content

## Projection and Composition Rules

- consumers project a native `<button type="button">` marked with `msMenuTrigger` or
  `msPopoverTrigger`; do not support non-button trigger elements
- consumers project one `ms-menu-panel` into `ms-menu` and one `ms-popover-panel` into
  `ms-popover`
- menu panels accept native `<button type="button" msMenuItem>` actions and `<a msMenuItem>`
  navigation targets, together with optional `ms-menu-divider` separators
- menu item text, decorative icons, and action meaning remain consumer-owned content
- popover panels accept arbitrary projected content such as text, form controls, and action rows
- `msPopoverClose` is applied to projected native buttons intended to close a popover explicitly
- container components generate panel IDs and manage native target relationships internally

## Styling

Feature styles live in:

`src/styles/components/_menu-popover.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, shadow, border width, motion, and focus rings
- style the shared surface and projected item hooks through `.menu-panel`, `.popover-panel`, and
  `.menu-item`; do not add `.ms-menu-*` or `.ms-popover-*` internal class names
- style the public `ms-menu-divider` separator element directly; it does not require an internal
  CSS class hook
- use `--z-index-dropdown` for the component layering convention while relying on native top-layer
  rendering for open panels
- name component-private CSS custom properties with `--_menu-*` and `--_popover-*` prefixes
- style open panel surfaces through `:popover-open` and native popover state rather than parallel
  visibility classes
- map `AnchoredPlacement` values to CSS Anchor Positioning `position-area` declarations
- apply trigger spacing on the block axis for top/bottom surfaces and on the inline axis for
  logical side surfaces
- use logical block/inline sizing, spacing, and placement throughout so trigger-relative surfaces
  mirror correctly in `dir="rtl"`
- provide viewport-safe panel maximum sizing and scroll overflow behavior
- render visual icons with `.ms-icon` or `.ms-icon-filled` as documented in
  `context/013-material-symbols.md`
- register the showcased `archive`, `delete`, `edit`, `expand_more`, `filter_list`, and
  `more_vert` Material Symbols names in `MATERIAL_ICONS`
- avoid hardcoded values when tokens exist

## Accessibility

- trigger controls are native buttons with accessible visible text or an `aria-label` for
  icon-only triggers
- the native `popovertarget` relationship owns the trigger-to-panel invocation association; expose
  accurate open state through the trigger relationship and synchronized component state
- menus expose menu semantics: `aria-haspopup="menu"` on the trigger, `role="menu"` on the panel,
  and appropriate menu-item roles on actionable items
- menu keyboard behavior supports arrow navigation, `Home`, `End`, `Escape`, and normal `Tab`
  departure
- disabled menu actions use native disabled buttons and cannot receive action focus or activate
- arbitrary popovers do not receive `role="menu"` or `role="dialog"` automatically; consumers add
  an appropriate accessible name or role when the content requires it
- arbitrary popovers do not trap focus
- explicit popover close actions and menu close behavior restore focus to the associated trigger
- decorative icons use `aria-hidden="true"` and never replace a control's accessible name

## Showcase

The Menu and Popover showcase lives under `/menu-popover`, with a matching card on the home page.

The showcase demonstrates:

- a basic action menu
- an icon-triggered menu with button actions, a navigation item, a disabled item, and a divider
- an end-aligned overflow menu that demonstrates placement and CSS position fallback behavior
- a controlled filters popover containing projected form fields, close actions, and a visible
  applied-filter result
- a logical inline-end popover using `placement="end-top"` that demonstrates RTL mirroring

Showcase snippets should use `ShowcaseCode` from `src/app/shared/ui-lib/components/showcase-code`.

Keep snippets hand-authored in the feature component `.ts` file and make each snippet a full
standalone Angular component example that users can copy/paste.

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

- The public API is exported from the `menu-popover` folder barrel.
- Shared reusable components use the `ms-` selector prefix.
- Internal CSS hooks use `.menu-panel`, `.popover-panel`, and `.menu-item` rather than namespaced
  `.ms-*` component-internal classes.
- `ms-menu` and `ms-popover` render native `popover="auto"` panels controlled by native button
  triggers.
- Native trigger relationships establish implicit CSS anchors without consumer-provided anchor
  identifiers.
- Trigger directives wire generated panel IDs through `popovertarget` and `aria-controls`, and
  expose synchronized `aria-expanded` state.
- Both panel types default to `bottom-start` placement and use CSS Anchor Positioning fallbacks
  that preserve the requested top/bottom direction before changing block direction for viewport
  overflow.
- Both panel types support `start-top`, `start-bottom`, `end-top`, and `end-bottom`, with CSS
  Anchor Positioning fallbacks that try alternate alignment on the same logical side before
  switching sides.
- Top/bottom surfaces apply trigger spacing on the logical block axis; side surfaces apply it on
  the logical inline axis.
- Logical start/end placement and fallback order mirror correctly in `dir="rtl"`.
- Opening, light dismissal, Escape closing, and external `open` model synchronization work through
  native popover behavior.
- Menus implement command-list roles, keyboard navigation, disabled item behavior, selection close,
  and trigger focus restoration.
- Popovers support arbitrary projected content, explicit close controls, normal tab order, and no
  automatic menu or dialog semantics.
- No JavaScript positioning engine, CDK overlay dependency, overlay outlet, or legacy positioning
  fallback is introduced.
- Styling uses existing tokens, component-private variables, and the components style index.
- The showcased `archive`, `delete`, `edit`, `expand_more`, `filter_list`, and `more_vert` icon
  names are registered in `MATERIAL_ICONS`.
- The `/menu-popover` showcase and home card demonstrate both patterns and render matching
  copyable snippets.
