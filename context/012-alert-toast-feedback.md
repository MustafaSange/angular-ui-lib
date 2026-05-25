# Feature 012: Alert and Toast Feedback

## Goal

Create a combined feedback feature for inline alerts and transient global toast notifications. Both use the same feedback variants, token-based styling, accessibility semantics, and showcase page.

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

## Public API

Import feedback primitives from the folder barrel:

```ts
import {
  AlertComponent,
  FeedbackVariant,
  ToastConfig,
  ToastOutletComponent,
  ToastRef,
  ToastService,
} from '../../shared/components/feedback';
```

Public pieces:

- `AlertComponent` with selector `ms-alert`
- `ToastOutletComponent` with selector `ms-toast-outlet`
- `ToastService` for message-based global toasts
- `ToastRef` for imperative close and close observation
- `FeedbackVariant = 'info' | 'success' | 'warning' | 'danger'`
- `ToastConfig` for toast message, title, variant, action, duration, dismissibility, and icon visibility

Required types:

```ts
type ToastAction = {
  label: string;
  run: () => void;
};

type ToastConfig = {
  message: string;
  variant?: FeedbackVariant;
  title?: string;
  action?: ToastAction;
  duration?: number | false;
  dismissible?: boolean;
  showIcon?: boolean;
};
```

Required service API:

```ts
class ToastService {
  show(config: ToastConfig): ToastRef;
  info(message: string, options?: Omit<ToastConfig, 'message' | 'variant'>): ToastRef;
  success(message: string, options?: Omit<ToastConfig, 'message' | 'variant'>): ToastRef;
  warning(message: string, options?: Omit<ToastConfig, 'message' | 'variant'>): ToastRef;
  danger(message: string, options?: Omit<ToastConfig, 'message' | 'variant'>): ToastRef;
  clear(): void;
}

class ToastRef {
  readonly id: string;
  close(): void;
  afterClosed(): Observable<void>;
}
```

Defaults:

- alert `variant` is `info`
- alert `dismissible` is `false`
- alert `showIcon` is `true`
- toast `variant` is `info`
- toast `dismissible` is `true`
- toast `showIcon` is `true`
- info and success toasts auto-dismiss after `5000ms`
- warning and danger toasts persist by default

## Usage

Inline alert:

```html
<ms-alert variant="success" title="Saved">
  Your changes were saved.
</ms-alert>
```

Dismissible alert:

```html
@if (isVisible()) {
  <ms-alert variant="danger" title="Payment failed" dismissible (dismissed)="isVisible.set(false)">
    Verify your payment method before retrying the renewal.
  </ms-alert>
}
```

Alert with actions:

```html
<ms-alert variant="warning" title="Subscription needs attention">
  Update the payment method before the next renewal.

  <div slot="actions">
    <button class="btn btn-primary btn-sm" type="button">Update payment</button>
    <a href="/billing">View billing</a>
  </div>
</ms-alert>
```

Toast outlet:

```html
<router-outlet />
<ms-modal-outlet />
<ms-toast-outlet />
```

Toast service:

```ts
const toastRef = toast.success('Changes saved', {
  title: 'Saved',
  action: {
    label: 'Undo',
    run: undoSave,
  },
});

toastRef.afterClosed().subscribe(() => {
  // continue workflow
});
```

Persistent danger toast:

```ts
toast.danger('Reconnect the account before running another sync.', {
  title: 'Sync failed',
  duration: false,
});
```

## Component Behavior

`AlertComponent` renders:

- projected message content
- optional title
- optional status icon
- optional close button when `dismissible` is true
- optional `[slot='actions']` content below the message

Alert behavior:

- dismissible alerts hide themselves and emit `dismissed`
- non-dismissible alerts do not render a close button
- actions are consumer-projected content
- success icons render a check mark
- danger icons render `x`, warning icons render `!`, and info icons render `i`

`ToastService` behavior:

- `show(config)` creates a message toast and returns its `ToastRef`
- convenience methods set the variant and delegate to `show`
- `clear()` closes all open toasts
- newest toasts render first
- the stack keeps at most five visible toasts and closes the oldest overflow toast
- manual close works when `dismissible !== false`
- toast actions run `action.run()` and then close the toast
- auto-dismiss timers pause while the toast is hovered or focused and resume afterward

`ToastOutletComponent` renders:

- a fixed top-end toast stack on desktop
- a full-width top stack on small screens
- one article per toast with variant classes, optional title, message, optional action, and optional close button

## Styling

Feedback styles live in:

`src/styles/components/_feedback.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing semantic feedback tokens for color, surface, border, and text
- use component-private `--_feedback-*` custom properties for variant and theme-specific internal aliases; these are not consumer customization tokens
- alert and toast surfaces use subtle variant backgrounds
- light theme keeps the palette-backed subtle surfaces
- dark theme blends variant colors with dark surface tokens to avoid fluorescent backgrounds
- toast stack uses `--z-index-toast`
- alerts use a medium-width status accent; toasts keep the stronger large-width accent
- close buttons stay inline with the title, use their compact icon-button geometry, and darken their own variant surface on hover/active
- feedback surfaces clip close-button hover fills within the rounded border
- do not override solid button contrast inside projected alert actions

## Accessibility

- info and success alerts/toasts use `role="status"` and `aria-live="polite"`
- warning and danger alerts/toasts use `role="alert"` and `aria-live="assertive"`
- toast region has `aria-label="Notifications"`
- close buttons have accessible labels
- status is communicated with text, icon, border, and title color, not color alone
- focusable toast content pauses auto-dismiss while focused

## Showcase

The feedback showcase lives under `/feedback` and demonstrates:

- alert variants
- alert with projected actions
- dismissible danger alert demonstrating the variant close-button state
- toast variants
- persistent danger toast
- toast action
- stacked toasts

Showcase snippets must use `ShowcaseCode`, be hand-authored in the feature component `.ts` file, and be full standalone Angular component examples that users can copy/paste. Toast snippets include `ToastOutletComponent` so copied examples can render notifications.

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

- Feedback public API is exported from `src/app/shared/components/feedback/index.ts`.
- Root app includes one `ms-toast-outlet`.
- Alerts render variants, optional title, projected body, projected actions, optional icon, and optional dismiss button.
- Dismissible alerts hide and emit `dismissed`.
- Toast service creates info, success, warning, and danger toasts with documented defaults.
- Toasts auto-dismiss, persist, close, clear, pause/resume, and run actions as documented.
- Toast stack renders newest first and keeps at most five visible toasts.
- Feedback accessibility roles, live regions, and close labels are present.
- Alert and toast styles are token-based, theme-aware, and forwarded from the components style index.
- The `/feedback` showcase demonstrates core variants and renders matching copyable snippets.
