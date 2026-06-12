# Feature 036: Confirmation Dialog

## Goal

Create a service-first confirmation dialog feature for yes-or-no decisions. It reuses the existing
modal system for overlay rendering, stacking, focus trapping, Escape/backdrop handling, scroll
locking, and focus restoration.

Shared reusable components use the `ms-` selector prefix. The confirmation dialog does not add a
separate outlet; applications must mount the existing `<ms-modal-outlet />`.

## Public API

Import confirmation primitives from the folder barrel:

```ts
import {
  ConfirmDialogConfig,
  ConfirmDialogKind,
  ConfirmDialogService,
  ModalOutletComponent,
} from '../../shared/ui-lib';
```

Public pieces:

- `ConfirmDialogService` for opening service-driven confirmation dialogs
- `ConfirmDialogKind = 'info' | 'success' | 'warning' | 'danger'`
- `ConfirmDialogConfig` for title, message, kind, action labels, and modal shell overrides

Required config:

```ts
type ConfirmDialogConfig = {
  title: string;
  message: string;
  kind?: ConfirmDialogKind;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  maxWidth?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
};
```

Required service API:

```ts
class ConfirmDialogService {
  confirm(config: ConfirmDialogConfig): Observable<boolean>;
  info(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean>;
  success(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean>;
  warning(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean>;
  danger(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean>;
}
```

Defaults:

- `kind` is `info`
- `confirmText` is `Confirm`
- `cancelText` is `Cancel`
- modal `width` is `28rem`
- modal `maxWidth` is `calc(100vw - (var(--spacing-16) * 2))`
- `showCloseButton` is `false`
- modal close behavior follows the modal defaults unless overridden

## Usage

Mount the modal outlet once near the application root:

```html
<router-outlet />
<ms-modal-outlet />
```

Open a destructive confirmation:

```ts
this.confirmDialog
  .danger({
    title: 'Delete project?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Keep project',
  })
  .subscribe((confirmed) => {
    if (confirmed) {
      this.deleteProject();
    }
  });
```

Locked confirmation:

```ts
this.confirmDialog.warning({
  title: 'Submit final report?',
  message: 'Use one of the actions to continue.',
  confirmText: 'Submit report',
  cancelText: 'Keep editing',
  closeOnBackdrop: false,
  closeOnEscape: false,
  showCloseButton: false,
});
```

## Component Behavior

`ConfirmDialogService.confirm(config)` opens an internal modal content component through
`ModalService.open(...)`. The internal component is not exported as public API.

Result behavior:

- confirm button closes with `true`
- cancel button closes with `false`
- modal close output closes with `false`
- Escape, backdrop click, and other undefined modal close results are mapped to `false`
- returned observables complete after the modal closes through the underlying `ModalRef`

Kind behavior:

- `info` uses the `info_i` icon and primary confirm button
- `success` uses the `check` icon and success confirm button
- `warning` uses the `priority_high` icon and primary confirm button
- `danger` uses the `delete` icon and danger confirm button
- cancel action uses the secondary button style

## Styling

Confirmation dialog styles live in:

`src/styles/components/_confirm-dialog.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use `.confirm-dialog-*` internal class hooks
- use existing semantic feedback tokens for kind tone, icon surface, border, and text
- use logical grid/flex layout so icon, message, and actions mirror correctly in RTL
- reuse the existing modal shell for width, max width, header, body, footer, and overlay styling
- keep dark theme tones blended with surface tokens to avoid overly bright kind surfaces

## Accessibility

- accessibility for dialog role, title association, focus trap, Escape behavior, scroll lock, and
  focus restoration comes from the modal system
- kind icon is decorative and hidden from assistive technology
- confirmation meaning must be communicated by title, message, and button labels, not color alone
- locked confirmations must still provide cancel and confirm buttons

## Showcase

The confirmation dialog showcase lives at `/confirm-dialog` and demonstrates:

- basic confirmation
- destructive confirmation
- semantic kind examples
- locked confirmation with backdrop, Escape, and close button disabled
- live boolean result display

Showcase snippets use `ShowcaseCode`, are hand-authored in the feature component `.ts` file, import
public APIs through `./shared/ui-lib`, and include `ModalOutletComponent` so the examples compile as
standalone pasted examples.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Prefer signals and `inject()`.
- Prefer `@Service()` for root-provided services.
- Rely on Angular 22 default OnPush change detection.
- Use native Angular template control flow.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the confirmation folder barrel and top-level UI library barrel.
- No separate confirmation outlet is added.
- Confirm action emits `true`; cancel, close, Escape, backdrop, and undefined close results emit
  `false`.
- Required behavior and semantic kinds are implemented.
- Styling uses existing tokens and is forwarded from the component style index.
- Layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- Accessibility requirements are implemented through the modal system and confirmation content.
- The showcase demonstrates core use cases and renders matching copyable snippets.
