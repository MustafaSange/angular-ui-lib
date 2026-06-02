# Feature 024: Side Navigation Menu

## Goal

Create a reusable side navigation menu for application layouts with icon-first navigation,
expandable menu groups, collapsed rail behavior, route-aware active states, and RTL-safe flyouts.

The component supports native anchors and buttons, subtle open/close motion, clear section arrows,
deep nested navigation, and a collapsed mode that shows icons with a small nested-menu indicator for
expandable top-level sections.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  SideNavComponent,
  SideNavItem,
  SideNavSectionComponent,
  SideNavTrigger,
} from '../../shared/components/side-nav';
```

Public pieces:

- `SideNavComponent` with selector `ms-side-nav`
- `SideNavSectionComponent` with selector `ms-side-nav-section`
- `SideNavItem` directive with selector `a[msSideNavItem], button[msSideNavItem]`
- `SideNavTrigger` directive with selector `button[msSideNavTrigger]`

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks remain concise and unprefixed: `.side-nav`, `.side-nav-list`,
`.side-nav-item`, `.side-nav-section`, `.side-nav-section-trigger`, `.side-nav-panel`,
`.side-nav-flyout`, `.side-nav-arrow`, and `.side-nav-label`. Established public utility classes
such as `.ms-icon` and `.ms-icon-filled` remain namespaced.

Required component APIs:

```ts
class SideNavComponent {
  readonly collapsed = model(false);
  readonly hoverExpand = input(true);
  readonly closeOnNavigate = input(false);
}
```

```ts
class SideNavSectionComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly expanded = model(false);
  readonly active = input(false);
}
```

```ts
class SideNavItem {
  readonly active = input(false);
}
```

Defaults:

- `collapsed` is `false`
- `hoverExpand` is `true`
- `closeOnNavigate` is `false`
- section `expanded` is `false`
- manual item or section `active` is `false`
- router-aware active state is supported when an anchor also uses Angular `RouterLinkActive`
- manual active state and router active state both mark an item active

## Desired Usage

Expanded navigation with anchors, buttons, and nested sections:

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  SideNavComponent,
  SideNavItem,
  SideNavSectionComponent,
  SideNavTrigger,
} from './shared/components/side-nav';

@Component({
  selector: 'app-side-nav-example',
  imports: [
    RouterLink,
    RouterLinkActive,
    SideNavComponent,
    SideNavItem,
    SideNavSectionComponent,
    SideNavTrigger,
  ],
  template: `
    <ms-side-nav [(collapsed)]="collapsed" aria-label="Primary navigation">
      <button type="button" msSideNavTrigger aria-label="Toggle navigation">
        <span class="ms-icon" aria-hidden="true">menu</span>
      </button>

      <a msSideNavItem routerLink="/dashboard" routerLinkActive="is-active">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        <span class="side-nav-label">Dashboard</span>
      </a>

      <ms-side-nav-section label="Projects" icon="folder" [(expanded)]="projectsOpen">
        <a msSideNavItem routerLink="/projects/active" routerLinkActive="is-active">
          Active projects
        </a>

        <ms-side-nav-section label="Reports" icon="bar_chart">
          <a msSideNavItem routerLink="/projects/reports/weekly" routerLinkActive="is-active">
            Weekly
          </a>
          <a msSideNavItem routerLink="/projects/reports/monthly" routerLinkActive="is-active">
            Monthly
          </a>
        </ms-side-nav-section>
      </ms-side-nav-section>

      <button type="button" msSideNavItem [active]="true">
        <span class="ms-icon" aria-hidden="true">settings</span>
        <span class="side-nav-label">Settings</span>
      </button>
    </ms-side-nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavExample {
  protected readonly collapsed = signal(false);
  protected readonly projectsOpen = signal(true);
}
```

Manual active button:

```html
<button type="button" msSideNavItem [active]="true">
  <span class="ms-icon" aria-hidden="true">settings</span>
  <span class="side-nav-label">Settings</span>
</button>
```

## Component Structure

The implementation lives in:

`src/app/shared/components/side-nav`

The feature includes:

- `SideNavComponent` coordinating collapsed state, root navigation semantics, Escape close requests,
  and projected content
- `SideNavSectionComponent` coordinating expandable groups, generated panel IDs, transient flyout
  state, delayed pointer close, nested depth, arrows, and keyboard Escape behavior
- `SideNavItem` applying item classes, manual active state, router active state, `aria-current`, and
  optional close-on-navigation behavior
- `SideNavTrigger` toggling the nearest containing side nav collapsed state
- `index.ts`

The showcase lives in:

`src/app/features/side-nav`

Styles live in:

`src/styles/components/_side-nav.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

## Behavior

- Expanded root nav shows icons, labels, and section arrows.
- Collapsed root nav shows top-level icons only for leaf items.
- Collapsed top-level sections show their icon plus a small chevron indicator so users can see the
  item has nested content.
- `SideNavTrigger` toggles `collapsed` and synchronizes `aria-expanded`.
- In expanded mode, first-level sections expand downward inside the nav column.
- In collapsed mode, top-level sections open as horizontal flyouts.
- Nested sections after the first child level open as horizontal flyouts.
- Unlimited nesting is supported by recursively rendering nested section panels as flyouts.
- Hover and focus open transient flyouts when `hoverExpand` is `true`.
- Pointer leave schedules flyout close with a short delay, and entering/focusing the nested panel
  cancels that close so users can move through nested menus without losing the parent flyout.
- Clicking a flyout section toggles its transient open state.
- Escape closes the currently open section/flyout and returns focus to the section trigger.
- Escape on the root side nav broadcasts close requests to open transient flyouts.
- `closeOnNavigate` requests flyout close after an enabled nav item is clicked.
- Disabled buttons and items with `aria-disabled="true"` do not request navigation close.
- Section arrows rotate only from actual open state, not from hover alone.
- Active/current item and ancestor section highlighting applies to icons and text.
- Router-current anchors are active when `RouterLinkActive` reports active.
- Manual `[active]="true"` marks anchors or buttons active.

## Projection and Composition Rules

Consumers provide navigation content through projection.

- Use native `a` elements for navigation and native `button` elements for actions.
- Apply `msSideNavItem` to clickable nav items.
- Use `ms-side-nav-section` for expandable groups.
- Top-level items should include an icon using `.ms-icon` or `.ms-icon-filled`.
- `SideNavSectionComponent` owns its section trigger button, generated IDs, arrow indicator, and
  child panel.
- Consumers may nest `ms-side-nav-section` inside another section for deeper navigation.
- Consumers do not provide generated IDs, `aria-controls`, `aria-expanded`, or flyout placement
  attributes.

## Styling

Feature styles live in:

`src/styles/components/_side-nav.scss`

Styling rules:

- use existing tokens for colors, spacing, radius, border width, shadow, motion, focus rings,
  opacity, control height, and typography
- use concise unprefixed internal CSS class hooks
- reserve `.ms-icon` and `.ms-icon-filled` for established Material Symbols utility styling
- keep `.ms-icon { direction: ltr; }` unchanged for Material Symbols ligature rendering
- add required Material Symbols ligature names to `MATERIAL_ICONS`
- use private CSS custom properties with the `--_side-nav-*` prefix
- use grid row layout for nav items and section triggers so icon, label, and arrow alignment is
  stable
- collapsed top-level rows use a single centered grid column so icons remain centered
- collapsed top-level section arrows use physical `right` in LTR and physical `left` in RTL because
  the arrow element also has `.ms-icon`, which intentionally forces `direction: ltr`
- flyouts use logical inline placement; in RTL, keeping `inset-inline-start` opens the panel toward
  the visual left
- flyout rows occupy the full available inline size so hover/active highlights start and end
  consistently across level 1, level 2, and deeper menus
- nested non-flyout child panels remove extra start padding, but nested flyout panels keep their own
  padding so their hover highlights remain visually balanced
- RTL flyout enter animation mirrors the LTR direction

## Accessibility

- `ms-side-nav` hosts a semantic navigation region with `role="navigation"`.
- The side nav should have an accessible name from `aria-label` or `aria-labelledby`.
- Section triggers are native buttons with `aria-expanded` and `aria-controls`.
- Each section generates a stable panel ID for its trigger relationship.
- Decorative icons and arrows are hidden with `aria-hidden="true"` in the template.
- Collapsed icon-only controls rely on the consumer-provided `aria-label` or the generated section
  trigger `aria-label`.
- Active anchors receive `aria-current="page"`.
- Keyboard users can Tab through visible triggers and items.
- Enter and Space use native button/link behavior.
- Escape closes the current open flyout and restores focus to the section trigger.
- Focus rings remain visible through `:focus-visible`.

## Showcase

The side-nav showcase page demonstrates:

- expanded side navigation with router links, buttons, icons, active state, and first-level downward
  expansion
- collapsed icon rail with hover, focus, and click flyouts
- deep nested sections
- manual active item state
- router-aware active anchor state
- RTL preview for logical flyout placement and collapsed section indicator placement

Showcase snippets use `ShowcaseCode` from `src/app/shared/components/showcase-code`, are
hand-authored in `src/app/features/side-nav/side-nav.ts`, and render near the matching visual
examples with `<app-showcase-code>`.

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

- The public API is exported from the feature folder barrel.
- Shared reusable selectors use the `ms-` prefix.
- The primary usage examples compile unchanged.
- Expanded and collapsed modes behave as documented.
- Collapsed top-level icons are centered.
- Collapsed top-level sections show a small nested-menu chevron with spacing from the icon.
- Collapsed section chevrons appear on the opposite physical side in RTL.
- First-level expanded sections open downward.
- Collapsed and deeper nested sections open as horizontal flyouts.
- Moving from a parent flyout to a nested flyout does not close the parent immediately.
- Level 2 and deeper hover/active highlights align with the same visual pattern as level 1 rows.
- Router-aware and manual active states work for anchors and buttons.
- Styling is forwarded from the component style index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Accessibility requirements are implemented.
- The showcase demonstrates core variants and renders matching copyable snippets.
