# Feature 023: Navigation Drawer

## Goal

Create a reusable navigation drawer for button-controlled slide navigation.

The drawer should give applications a polished overlay nav surface that opens and closes from a
trigger button, supports projected navigation content and actions, and mirrors correctly in both
left-to-right and right-to-left layouts through logical `start` and `end` placement.

## Non-Goals

- Do not create a generic side panel for arbitrary workflows in v1.
- Do not create a persistent inline layout drawer in v1.
- Do not expose physical `left` or `right` placement options.
- Do not add service-opened drawer APIs, an outlet, typed data injection, or typed close results.
- Do not duplicate modal behavior beyond the accessibility and overlay behavior required for a
  navigation drawer.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  DrawerClose,
  DrawerComponent,
  DrawerPlacement,
  DrawerTrigger,
} from '../../shared/components/drawer';
```

Public pieces:

- `DrawerComponent` with selector `ms-drawer`
- `DrawerTrigger` directive with selector `button[msDrawerTrigger]`
- `DrawerClose` directive with selector `button[msDrawerClose], a[msDrawerClose]`
- `DrawerPlacement` for supported logical drawer edges

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks remain concise and unprefixed. Use `.drawer`, `.drawer-panel`,
`.drawer-backdrop`, `.drawer-header`, `.drawer-content`, and `.drawer-footer`; do not mirror the
public component selector as `.ms-drawer`. Established public utility classes such as `.ms-icon`
and `.ms-icon-filled` remain namespaced.

Required type:

```ts
type DrawerPlacement = 'start' | 'end';
```

Required component API:

```ts
class DrawerComponent {
  readonly open = model(false);
  readonly placement = input<DrawerPlacement>('start');
  readonly closeOnBackdrop = input(true);
  readonly closeOnEscape = input(true);

  toggle(): void;
  close(): void;
  focusPanel(): void;
}
```

Defaults:

- `open` is `false`
- `placement` is `start`
- `closeOnBackdrop` is `true`
- `closeOnEscape` is `true`
- `start` maps to inline-start: left in `dir="ltr"` and right in `dir="rtl"`
- `end` maps to inline-end: right in `dir="ltr"` and left in `dir="rtl"`

Logical placement mapping:

| Placement | LTR   | RTL   |
| --------- | ----- | ----- |
| `start`   | left  | right |
| `end`     | right | left  |

## Desired Usage

Basic navigation drawer:

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DrawerClose, DrawerComponent, DrawerTrigger } from './shared/components/drawer';

@Component({
  selector: 'app-navigation-drawer-example',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger],
  template: `
    <button
      class="btn btn-ghost btn-icon"
      type="button"
      [msDrawerTrigger]="drawer"
      aria-label="Open navigation"
    >
      <span class="ms-icon" aria-hidden="true">menu</span>
    </button>

    <ms-drawer #drawer="msDrawer" [(open)]="drawerOpen" aria-label="Main navigation">
      <div class="drawer-header">
        <strong>Navigation</strong>
        <button class="btn btn-ghost btn-icon" type="button" msDrawerClose aria-label="Close navigation">
          <span class="ms-icon" aria-hidden="true">close</span>
        </button>
      </div>

      <nav class="drawer-content" aria-label="Primary">
        <a href="/dashboard" msDrawerClose>Dashboard</a>
        <a href="/projects" msDrawerClose>Projects</a>
        <a href="/settings" msDrawerClose>Settings</a>
      </nav>
    </ms-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerExample {
  protected readonly drawerOpen = signal(false);
}
```

End placement drawer:

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DrawerClose, DrawerComponent, DrawerTrigger } from './shared/components/drawer';

@Component({
  selector: 'app-end-drawer-example',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger],
  template: `
    <button class="btn btn-outline" type="button" [msDrawerTrigger]="drawer">
      Account menu
      <span class="ms-icon" aria-hidden="true">menu_open</span>
    </button>

    <ms-drawer #drawer="msDrawer" [(open)]="open" placement="end" aria-label="Account navigation">
      <div class="drawer-header">
        <strong>Account</strong>
        <button class="btn btn-ghost btn-icon" type="button" msDrawerClose aria-label="Close account menu">
          <span class="ms-icon" aria-hidden="true">close</span>
        </button>
      </div>

      <nav class="drawer-content" aria-label="Account">
        <a href="/profile" msDrawerClose>Profile</a>
        <a href="/billing" msDrawerClose>Billing</a>
        <a href="/security" msDrawerClose>Security</a>
      </nav>
    </ms-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndDrawerExample {
  protected readonly open = signal(false);
}
```

## Component Structure

The implementation lives in:

`src/app/shared/components/drawer`

The feature includes:

- `DrawerComponent` coordinating open state, overlay rendering, focus behavior, Escape close, and
  backdrop close
- `DrawerTrigger` connecting a native trigger button to one drawer instance
- `DrawerClose` closing the nearest containing drawer from projected buttons or links
- `DrawerPlacement` in a dedicated sibling type file only if the type is reusable from the public
  barrel
- `index.ts`

`DrawerComponent` renders a fixed overlay with a backdrop and one slide-in panel. Consumers project
all drawer content into the panel and own the header, navigation, footer, labels, links, and
actions. The drawer generates an internal panel ID and exposes it to the trigger through
`aria-controls`.

## Behavior

- `DrawerTrigger` toggles its associated drawer when the host button is clicked.
- `DrawerTrigger` sets `aria-controls` to the drawer panel ID and synchronizes `aria-expanded`
  with the drawer `open` state.
- Opening the drawer renders an overlay backdrop and panel above page content.
- Closing the drawer removes the overlay from keyboard and pointer interaction.
- The drawer slides in from the logical edge defined by `placement`.
- Backdrop click closes the drawer only when `closeOnBackdrop` is `true`.
- Escape closes the drawer only when `closeOnEscape` is `true`.
- Escape handling applies only while the drawer is open.
- `DrawerClose` closes the nearest containing drawer when the host button or link is activated.
- When a drawer opens, focus moves to the drawer panel unless focus has already moved to a
  focusable descendant.
- When a drawer closes through the trigger, backdrop, Escape key, or `DrawerClose`, focus returns
  to the trigger button when that trigger still exists.
- Tab navigation stays inside the open drawer panel.
- Body/page scrolling is locked while the overlay drawer is open and restored when it closes.
- Cleanup removes global key, focus, and scroll-lock side effects when the drawer is destroyed.

## Projection and Composition Rules

Consumers provide all visible drawer content through projection.

- Default projected content renders inside the drawer panel.
- Header, navigation, and footer regions are consumer-authored markup using internal style hooks
  such as `.drawer-header`, `.drawer-content`, and `.drawer-footer`.
- Use native links and buttons for navigation and actions.
- Use `msDrawerClose` on navigation links or action buttons that should close the drawer after
  activation.
- Consumers do not provide drawer IDs, panel IDs, overlay containers, or placement geometry.
- The drawer must have an accessible name from `aria-label` or `aria-labelledby`.

## Styling

Feature styles live in:

`src/styles/components/_drawer.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, shadow, border width, motion, z-index, and focus
  rings
- use logical CSS properties including `inset-inline-start`, `inset-inline-end`,
  `border-inline-start`, `border-inline-end`, `inline-size`, and `block-size`
- use logical transform direction so `placement="start"` and `placement="end"` mirror correctly
  in both `dir="ltr"` and `dir="rtl"`
- do not use physical `left` or `right` placement APIs
- set the drawer panel width with responsive constraints, for example
  `inline-size: min(20rem, 85vw)`
- backdrop covers the viewport with `inset: 0`
- the panel occupies full viewport block size by default
- use unprefixed internal CSS class hooks such as `.drawer`, `.drawer-panel`, `.drawer-backdrop`,
  `.drawer-header`, `.drawer-content`, and `.drawer-footer`
- name component-private CSS custom properties with a `--_drawer-*` prefix
- render visual icons with `.ms-icon` or `.ms-icon-filled` as documented in
  `context/013-material-symbols.md`
- add every new Material Symbols ligature name used by drawer examples to `MATERIAL_ICONS`
- keep `.ms-icon { direction: ltr; }` as the intentional Material Symbols ligature exception

## Accessibility

- The trigger is a native `button`.
- The drawer panel exposes `role="dialog"` and `aria-modal="true"`.
- The drawer panel must have an accessible name through `aria-label` or `aria-labelledby`.
- `DrawerTrigger` maintains `aria-controls` and `aria-expanded`.
- Decorative icons use `aria-hidden="true"`.
- Icon-only trigger and close buttons require an accessible name independent of the icon ligature.
- Escape close is keyboard-accessible when `closeOnEscape` is enabled.
- Focus moves into the drawer on open and returns to the trigger on close.
- Tab and Shift+Tab stay within the open drawer.
- Disabled trigger buttons keep native disabled behavior and do not toggle the drawer.
- Links with `msDrawerClose` keep native navigation behavior and close the drawer on activation.

## Showcase

Add a new drawer showcase page under `src/app/features/drawer`.

The drawer showcase should demonstrate:

- start navigation drawer in LTR
- mirrored start navigation drawer in RTL
- end placement drawer
- close actions inside the drawer

Showcase snippets must use `ShowcaseCode` from
`src/app/shared/components/showcase-code`. Keep snippets hand-authored in the feature component
`.ts` file, make each snippet a full standalone Angular component example that users can
copy/paste, and render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Prefer reactive forms for non-trivial forms.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The spec follows `context/feature-spec-template.md`.
- The public API is minimal and navigation-focused.
- The public API is exported from the feature folder barrel.
- Shared reusable components use the `ms-` selector prefix.
- The primary usage examples work as documented.
- The implementation supports button-controlled toggling through `DrawerTrigger`.
- Required open, close, Escape, backdrop, focus, and scroll-lock behavior is implemented.
- Styling uses existing tokens and is forwarded from the components style index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Logical `start` and `end` placement behavior is explicit and physical `left` and `right`
  placement is not exposed in v1.
- Accessibility requirements are implemented.
- The showcase demonstrates core variants and renders matching copyable snippets.
- No tests are added or updated for this behavior.
