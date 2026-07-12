# Feature 025: Clipboard Copy Button

## Goal

Create reusable clipboard copy primitives for copying text with immediate visual feedback. The
feature includes a stable icon-only button, a hover/focus reveal wrapper, and a small helper for
imperative copy flows.

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under
`src/app/shared`.

## Public API

Import the public component from the folder barrel:

```ts
import { CopyButtonComponent, CopyRevealComponent, copyTextToClipboard } from '../../shared/ui-lib';
```

Public pieces:

- `CopyButtonComponent` with selector `ms-copy-button`
- `CopyRevealComponent` with selector `ms-copy-reveal`
- `copyTextToClipboard` helper for imperative copy flows
- `CopyClipboardResult = 'copied' | 'failed'`
- `CopyButtonKind = 'ghost' | 'outline' | 'primary' | 'secondary'`
- `CopyButtonSize = 'xs' | 'sm' | 'md' | 'lg'`

Internal styling hooks remain concise and unprefixed: `.copy-button`, `.copy-icon`, `.copy-content`, `.copy-status`, `.copy-reveal-content`, and
`.copy-reveal-action`. Established public utility classes such as `.btn`, `.btn-icon`, `.ms-icon`, and `.ms-icon-filled` remain unchanged.

Required component API:

```ts
class CopyButtonComponent {
  readonly text = input<string | undefined>(undefined);
  readonly ariaLabel = input('Copy to clipboard');
  readonly copiedLabel = input('Copied');
  readonly failedLabel = input('Copy failed');
  readonly resetDelay = input(2000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly kind = input<CopyButtonKind>('ghost');
  readonly size = input<CopyButtonSize>('md');
}

class CopyRevealComponent {
  readonly text = input<string | undefined>(undefined);
  readonly ariaLabel = input('Copy to clipboard');
  readonly copiedLabel = input('Copied');
  readonly failedLabel = input('Copy failed');
  readonly resetDelay = input(2000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly kind = input<CopyButtonKind>('ghost');
  readonly size = input<CopyButtonSize>('sm');
}

function copyTextToClipboard(text: string): Promise<CopyClipboardResult>;
```

Defaults:

- `text` is `undefined`, which enables projected text fallback
- `ariaLabel` is `Copy to clipboard`
- `copiedLabel` is `Copied`
- `failedLabel` is `Copy failed`
- `resetDelay` is `2000`
- `disabled` is `false`
- `kind` is `ghost`
- `CopyButtonComponent` `size` is `md`
- `CopyRevealComponent` `size` is `sm`

## Desired Usage

Copy from an explicit input:

```ts
import { Component } from '@angular/core';

import { CopyButtonComponent } from './shared/ui-lib';

@Component({
  selector: 'app-copy-input-example',
  imports: [CopyButtonComponent],
  template: `
    <code>INV-2026-0042</code>
    <ms-copy-button text="INV-2026-0042" ariaLabel="Copy invoice number" />
  `,
})
export class CopyInputExample {}
```

Copy from projected fallback text:

```ts
import { Component } from '@angular/core';

import { CopyButtonComponent } from './shared/ui-lib';

@Component({
  selector: 'app-copy-projected-example',
  imports: [CopyButtonComponent],
  template: `
    <ms-copy-button ariaLabel="Copy support email"> support@example.com </ms-copy-button>
  `,
})
export class CopyProjectedExample {}
```

Disabled copy button:

```html
<ms-copy-button text="Unavailable" ariaLabel="Copy unavailable value" disabled />
```

Reveal copy button on hover or focus:

```ts
import { Component } from '@angular/core';

import { CopyRevealComponent } from './shared/ui-lib';

@Component({
  selector: 'app-copy-reveal-example',
  imports: [CopyRevealComponent],
  template: `
    <ms-copy-reveal text="support@example.com" ariaLabel="Copy support email">
      support@example.com
    </ms-copy-reveal>
  `,
})
export class CopyRevealExample {}
```

Imperative copy helper:

```ts
const result = await copyTextToClipboard('support@example.com');
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/copy-button`

The feature includes:

- `CopyButtonComponent`
- `CopyRevealComponent`
- `copyTextToClipboard`
- public reusable types
- `index.ts`

The component renders one native button. The button contains a decorative Material Symbols icon, an
optional projected content container used only for fallback text, and an internal live status node
for copied or failed announcements.

`CopyRevealComponent` uses the `ms-copy-reveal` host as its reveal container. It renders one
projected content span and one internal `ms-copy-button` with the `.copy-reveal-action` hook. The
copy action is visible when the host is hovered, when focus is inside the host, and when the internal
copy button is in copied or failed state.

The showcase lives in:

`src/app/features/clipboard`

Styles live in:

`src/styles/components/_copy-button.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

## Behavior

- `copyTextToClipboard(text)` writes non-empty text to `navigator.clipboard.writeText`.
- `copyTextToClipboard(text)` returns `copied` after a successful write and `failed` for empty text
  or clipboard write failure.
- Clicking the enabled button copies the explicit `text` input when it is provided.
- When `text` is `undefined`, clicking copies the trimmed text content projected into the component.
- Empty or whitespace-only resolved text is treated as a failed copy attempt.
- Clipboard writes use `navigator.clipboard.writeText`.
- Clipboard failures set the failed state and are not thrown to consumers.
- The visual icon is `content_copy` while idle, `check` after a successful copy, and `error` after a
  failed copy attempt.
- Copied and failed states reset to idle after `resetDelay` milliseconds.
- A new copy attempt clears any pending reset timer before starting another one.
- The reset timer is cleared when the component is destroyed.
- The disabled button does not attempt to resolve text, copy, change state, or announce status.
- Keyboard activation uses native button behavior for Enter and Space.
- Hover never triggers a copy attempt.
- `CopyRevealComponent` reveals its copy action on pointer hover and keyboard focus-within.
- `CopyRevealComponent` hides its copy action when the wrapper is idle, unless the nested button is
  in copied or failed state.

## Projection and Composition Rules

Consumers may provide projected text when they do not pass the `text` input.

- Prefer `[text]` for dynamic values, generated strings, or values that should not be visually
  rendered inside the button.
- Use projected fallback text only for simple static values where the projected text is safe to show
  or hide through component styling.
- `CopyButtonComponent` owns the button, icon, status node, disabled state, and clipboard
  interaction.
- `CopyRevealComponent` owns the reveal layout and composes `CopyButtonComponent` internally.
- Consumers do not provide custom icon markup or generated status elements.

## Styling

Feature styles live in:

`src/styles/components/_copy-button.scss`

Styling rules:

- use existing `.btn`, `.btn-icon`, `.btn-*` variant, and `.btn-*` size utilities for button
  geometry and interaction states
- use `.ms-icon` for the Material Symbols icon
- keep `.ms-icon { direction: ltr; }` unchanged for Material Symbols ligature rendering
- add `content_copy` and `error` to `MATERIAL_ICONS`; `check` is already registered
- use concise unprefixed internal CSS class hooks
- use logical CSS properties for hidden projected content and status text
- use existing tokens for spacing, color, focus rings, motion, and disabled opacity
- keep icon changes from resizing the button
- `ms-copy-reveal` is the positioning context for reveal layout
- `.copy-reveal-action` is absolutely positioned at the host's block-start and inline-end edge with
  `inset-inline-start: 100%` and a logical `margin-inline-start` gap
- reveal action visibility changes must not reserve space or shift projected content
- keep styles reusable across LTR and RTL without physical left/right placement

## Accessibility

- Render a native `button` with `type="button"`.
- The icon is decorative and hidden with `aria-hidden="true"`.
- The icon-only button has an accessible name independent of the icon ligature.
- The accessible name is `ariaLabel` while idle, `copiedLabel` while copied, and `failedLabel` while
  failed.
- Copied and failed status text is announced through a polite live region.
- Disabled state uses the native `disabled` attribute.
- Focus behavior uses the existing `.btn:focus-visible` focus ring.
- Status is communicated by the accessible name and live text, not by icon shape or color alone.
- `CopyRevealComponent` uses `:focus-within` so keyboard users can discover and operate the action
  without hover.

## Showcase

The clipboard showcase lives under `/clipboard` and demonstrates:

- copying from `[text]`
- copying from projected fallback text
- reveal-on-hover and reveal-on-focus copy behavior
- imperative helper usage
- disabled state
- size and variant examples

Showcase snippets must use `ShowcaseCode`, be hand-authored in the feature component `.ts` file,
and be full standalone Angular component examples that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

Add a home showcase card that links to `/clipboard`.

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

- The public API is exported from `src/app/shared/ui-lib/components/copy-button/index.ts`.
- The component selector is `ms-copy-button`.
- The primary usage examples work as documented.
- The button copies explicit `text` input and falls back to projected text when `text` is absent.
- Success, failure, disabled, and reset states are implemented.
- Clipboard failures are handled without throwing to consumers.
- Styling uses existing button and icon utilities and is forwarded from the components style index.
- Reusable component layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Accessibility requirements are implemented.
- `CopyRevealComponent` reveals on hover and focus without copying until the button is activated.
- `copyTextToClipboard` is exported and returns a typed copy result.
- `content_copy` and `error` are registered in `MATERIAL_ICONS`.
- The `/clipboard` showcase demonstrates core states and renders matching copyable snippets.
