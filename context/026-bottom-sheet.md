# Feature 026: Bottom Sheet

## Goal

Create a reusable bottom sheet overlay for focused, mobile-friendly workflows.

The bottom sheet should provide a polished surface that opens from the logical block end of the
viewport, supports projected content and service-opened content, handles focus and close behavior
consistently with the modal system, and remains responsive across narrow and wide layouts.

## Non-Goals

- Do not implement drag gestures or snap-point physics in v1.
- Do not create a persistent inline bottom panel in v1.
- Do not expose physical `top`, `bottom`, `left`, or `right` placement options.
- Do not duplicate the navigation drawer API; bottom sheets are for contextual actions, forms, and
  short workflows rather than primary navigation.
- Do not allow business/content data in shell config; service-opened content receives data through
  a dedicated injection token.

## Public API

Import bottom sheet primitives from the folder barrel:

```ts
import {
  BOTTOM_SHEET_CONFIG,
  BOTTOM_SHEET_DATA,
  BOTTOM_SHEET_REF,
  BottomSheetClose,
  BottomSheetComponent,
  BottomSheetConfig,
  BottomSheetOpenOptions,
  BottomSheetRef,
  BottomSheetService,
  BottomSheetSize,
  BottomSheetTrigger,
} from '../../shared/ui-lib';
```

Public pieces:

- `BottomSheetComponent` with selector `ms-bottom-sheet`
- `BottomSheetTrigger` directive with selector `button[msBottomSheetTrigger]`
- `BottomSheetClose` directive with selector `button[msBottomSheetClose], a[msBottomSheetClose]`
- `BottomSheetService.open()` for opening full bottom sheet components through the global outlet
- `BottomSheetRef<TResult = unknown>` for closing and observing close results
- `BottomSheetConfig` for shell behavior/config only
- `BottomSheetOpenOptions<TData = unknown>` for service open options, including optional `data`
- `BottomSheetSize` for supported sheet heights
- `BOTTOM_SHEET_CONFIG` for shell config injection
- `BOTTOM_SHEET_DATA` for business/content data injection
- `BOTTOM_SHEET_REF` for closing from opened bottom sheet content

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

Internal styling hooks remain concise and unprefixed. Use `.bottom-sheet`, `.bottom-sheet-panel`, `.bottom-sheet-backdrop`, `.bottom-sheet-header`, `.bottom-sheet-handle`, `.bottom-sheet-content`, and `.bottom-sheet-footer`; do not mirror the public component selector
as `.ms-bottom-sheet`. Established public utility classes such as `.ms-icon` and
`.ms-icon-filled` remain namespaced.

Required types:

```ts
type BottomSheetSize = 'compact' | 'medium' | 'full';

type BottomSheetConfig = {
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  showHandle?: boolean;
  size?: BottomSheetSize;
  maxWidth?: string;
};

type BottomSheetOpenOptions<TData = unknown> = BottomSheetConfig & {
  data?: TData;
};
```

Required component API:

```ts
class BottomSheetComponent {
  readonly open = model(false);
  readonly close = output<void>();
  readonly title = input('');
  readonly closeOnBackdrop = input(true);
  readonly closeOnEscape = input(true);
  readonly showCloseButton = input(true);
  readonly showHandle = input(true);
  readonly size = input<BottomSheetSize>('medium');

  dismiss(): void;
  focusPanel(): void;
}
```

Required reference API:

```ts
class BottomSheetRef<TResult = unknown> {
  close(result?: TResult): void;
  afterClosed(): Observable<TResult | undefined>;
}
```

Defaults:

- `open` is `false`
- `title` is an empty string
- `closeOnBackdrop` is `true`
- `closeOnEscape` is `true`
- `showCloseButton` is `true`
- `showHandle` is `true`
- `size` is `medium`
- `maxWidth` is `40rem`

## Desired Usage

Declarative bottom sheet:

```ts
import { Component, signal } from '@angular/core';
import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-bottom-sheet-example',
  imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger],
  template: `
    <button class="btn btn-primary" type="button" [msBottomSheetTrigger]="sheet">
      Open actions
    </button>

    <ms-bottom-sheet
      #sheet="msBottomSheet"
      [(open)]="isOpen"
      title="Project actions"
      aria-label="Project actions"
    >
      <div class="bottom-sheet-content">
        <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
          Rename project
        </button>
        <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
          Duplicate project
        </button>
      </div>

      <div class="bottom-sheet-footer" slot="footer">
        <button class="btn btn-secondary btn-full" type="button" msBottomSheetClose>Cancel</button>
      </div>
    </ms-bottom-sheet>
  `,
})
export class BottomSheetExample {
  protected readonly isOpen = signal(false);
}
```

Open a bottom sheet with typed data and typed result:

```ts
type ShareSheetData = {
  projectId: string;
};

type ShareSheetResult =
  | {
      action: 'copy-link';
    }
  | {
      action: 'cancel';
    };

const sheetRef = bottomSheetService.open<ShareSheetComponent, ShareSheetData, ShareSheetResult>(
  ShareSheetComponent,
  {
    size: 'compact',
    data: {
      projectId: 'project-1',
    },
  },
);

sheetRef.afterClosed().subscribe((result) => {
  if (result?.action === 'copy-link') {
    // continue workflow
  }
});
```

Opened bottom sheet component:

```ts
@Component({
  selector: 'app-share-sheet',
  imports: [BottomSheetComponent],
  template: `
    <ms-bottom-sheet title="Share project" (close)="sheetRef.close({ action: 'cancel' })">
      <p>Share {{ data.projectId }} with your team.</p>

      <div slot="footer">
        <button class="btn btn-primary btn-full" type="button" (click)="copyLink()">
          Copy link
        </button>
      </div>
    </ms-bottom-sheet>
  `,
})
export class ShareSheetComponent {
  protected readonly data = inject(BOTTOM_SHEET_DATA) as ShareSheetData;
  protected readonly sheetRef = inject(BOTTOM_SHEET_REF) as BottomSheetRef<ShareSheetResult>;

  protected copyLink(): void {
    this.sheetRef.close({ action: 'copy-link' });
  }
}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/bottom-sheet`

The feature includes:

- `BottomSheetComponent` coordinating open state, overlay rendering, focus behavior, Escape close,
  backdrop close, `close` output, and projected shell areas
- `BottomSheetOutletComponent` rendering service-opened sheets from a signal-backed stack
- `BottomSheetService` opening full bottom sheet components through the global outlet
- `BottomSheetRef<TResult = unknown>` closing a service-opened sheet and emitting typed results
- `BottomSheetTrigger` connecting a native trigger button to one declarative sheet instance
- `BottomSheetClose` dismissing the nearest containing sheet from projected buttons or links
- `BottomSheetConfig`, `BottomSheetOpenOptions`, and `BottomSheetSize` in dedicated sibling files
  only when they are reusable public exports
- `BOTTOM_SHEET_CONFIG`, `BOTTOM_SHEET_DATA`, and `BOTTOM_SHEET_REF` in a dedicated token file
- `index.ts`

Mount the global outlet once in the root app template:

```html
<router-outlet /> <ms-bottom-sheet-outlet />
```

`BottomSheetComponent` renders a fixed overlay with a viewport-covering backdrop and one panel
anchored to the logical block end. Consumers project content into the panel and own workflow body
markup, action buttons, form fields, and footer content. The component generates internal IDs for
title and panel wiring.

## Behavior

- Opening renders the backdrop and sheet panel above page content.
- Closing removes the overlay from keyboard and pointer interaction.
- The sheet enters and exits from logical `block-end`.
- `BottomSheetTrigger` toggles its associated sheet when the host button is clicked.
- `BottomSheetTrigger` sets `aria-controls` to the sheet panel ID and synchronizes
  `aria-expanded` with the sheet `open` state.
- Backdrop click dismisses the sheet only when `closeOnBackdrop` is `true`.
- Escape closes only the top sheet when `closeOnEscape` is `true`.
- Escape handling applies only while the sheet is open.
- The close button renders only when `showCloseButton` is `true`.
- The visual handle renders only when `showHandle` is `true`.
- `BottomSheetComponent.dismiss()` sets `open` to `false` and emits `close`.
- `BottomSheetClose` dismisses the nearest containing sheet when the host button or link is activated.
- Service-opened content closes by calling `bottomSheetRef.close(result?)`.
- When a sheet opens, focus moves to the sheet panel unless focus has already moved to a focusable
  descendant.
- When a declarative sheet closes through the trigger, backdrop, Escape key, or
  `BottomSheetClose`, focus returns to the trigger button when that trigger still exists.
- When a service-opened sheet closes, focus returns to the previously focused element when that
  element still exists.
- Tab navigation stays inside the top open sheet panel.
- Body/page scrolling is locked while at least one sheet is open and restored after the last sheet
  closes.
- Multiple service-opened sheets stack above earlier sheets; only the top sheet handles Escape and
  focus trapping.
- Cleanup removes global key, focus, and scroll-lock side effects when a sheet is destroyed.

## Projection and Composition Rules

Consumers provide visible sheet content through projection.

- Default projected content renders in the sheet body.
- `[slot='headerActions']` renders next to the title in the header.
- `[slot='footer']` renders in the footer.
- Consumer-authored markup may use internal style hooks such as `.bottom-sheet-content` and
  `.bottom-sheet-footer`.
- Use native buttons for actions and native form controls for forms.
- Use `msBottomSheetClose` on actions that should close the sheet after activation.
- Consumers do not provide sheet IDs, panel IDs, overlay containers, or placement geometry.
- The sheet must have an accessible name from `title`, `aria-label`, or `aria-labelledby`.

## Styling

Feature styles live in:

`src/styles/components/_bottom-sheet.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, shadow, border width, motion, z-index, and focus
  rings
- use logical CSS properties including `inset-block-end`, `inset-inline`, `block-size`,
  `inline-size`, `max-block-size`, `padding-block`, and `padding-inline`
- do not use physical placement APIs
- backdrop covers the viewport with `inset: 0`
- panel sits at the logical block end and is centered on the inline axis with
  `inline-size: min(100%, var(--_bottom-sheet-max-width))`
- `compact`, `medium`, and `full` sizes control max block size with responsive constraints
- `full` uses nearly the full viewport block size while preserving safe-area spacing
- account for safe areas with `env(safe-area-inset-bottom)` where the panel meets the viewport edge
- use unprefixed internal CSS class hooks such as `.bottom-sheet`, `.bottom-sheet-panel`,
  `.bottom-sheet-backdrop`, `.bottom-sheet-header`, `.bottom-sheet-handle`,
  `.bottom-sheet-content`, and `.bottom-sheet-footer`
- name component-private CSS custom properties with a `--_bottom-sheet-*` prefix
- render visual icons with `.ms-icon` or `.ms-icon-filled` as documented in
  `context/013-material-symbols.md`
- add every new Material Symbols ligature name used by bottom sheet examples to `MATERIAL_ICONS`
- keep `.ms-icon { direction: ltr; }` as the intentional Material Symbols ligature exception

## Accessibility

- The trigger is a native `button`.
- The sheet panel exposes `role="dialog"` and `aria-modal="true"`.
- The sheet panel must have an accessible name through `title`, `aria-label`, or
  `aria-labelledby`.
- `BottomSheetTrigger` maintains `aria-controls` and `aria-expanded`.
- Decorative icons and the visual drag handle use `aria-hidden="true"`.
- Icon-only close buttons require an accessible name independent of the icon ligature.
- Escape close is keyboard-accessible when `closeOnEscape` is enabled.
- Focus moves into the sheet on open and returns to the trigger or previously focused element on
  close.
- Tab and Shift+Tab stay within the top open sheet.
- Scrollable sheet content remains keyboard reachable.

## Showcase

Add a new showcase page under:

`src/app/features/bottom-sheet`

Add a route for:

`/bottom-sheet`

Add a home showcase card linking to the new route.

The bottom sheet showcase should demonstrate:

- declarative action-list sheet
- compact sheet
- medium form sheet using reactive forms for non-trivial form behavior
- full-height mobile-style sheet
- disabled backdrop close
- service-opened sheet with typed data and typed close result
- RTL layout

Showcase snippets must use `ShowcaseCode` from `src/app/shared/ui-lib/components/showcase-code`.

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

- The public API is exported from the bottom sheet folder barrel.
- Shared reusable components use the `ms-` selector prefix.
- Root app includes one `ms-bottom-sheet-outlet`.
- Consumers can use declarative `ms-bottom-sheet` with `[(open)]`.
- Consumers can open full bottom sheet components through
  `BottomSheetService.open(Component, options?)`.
- Opened service components render their own `<ms-bottom-sheet>`.
- `BottomSheetRef.close(result)` closes the sheet and emits the typed result through
  `afterClosed()`.
- `BOTTOM_SHEET_CONFIG` exposes only shell config.
- `BOTTOM_SHEET_DATA` exposes only business/content data.
- `BottomSheetOpenOptions<TData>` supports typed data and shell config options.
- Required behavior and states are implemented.
- Styling uses existing tokens and is forwarded from the components style index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Accessibility requirements are implemented.
- The showcase demonstrates core variants and renders matching copyable snippets.
