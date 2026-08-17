# Feature 011: Modal System

## Context

The modal system is a reusable Angular dialog system for the UI library. It supports declarative modals, service-opened modals, typed close results, close-reason metadata, synchronous or asynchronous close guards, signal-based stack state, shell configuration, injected content data, focus trapping, automatic close-button/backdrop/Escape dismissal, scrollable content, stacked modals, and scoped CSS customization.

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

## Public API

Import modal primitives from the folder barrel:

```ts
import {
  MODAL_CONFIG,
  MODAL_DATA,
  MODAL_REF,
  ModalCanClose,
  ModalComponent,
  ModalCloseEvent,
  ModalCloseOptions,
  ModalCloseReason,
  ModalConfig,
  ModalOpenOptions,
  ModalRef,
  ModalService,
  ModalSize,
} from '../../shared/ui-lib';
```

Public pieces:

- `ModalComponent` with selector `ms-modal`
- `ModalOutletComponent` with selector `ms-modal-outlet`
- `ModalService.open()` for opening full modal components through the global outlet
- `ModalRef<TResult = unknown>` for closing and observing close results
- `ModalCloseReason` and `ModalCloseEvent<TResult>` for observing how a modal closed
- `ModalCanClose<TResult>` for synchronous or asynchronous close guards
- `ModalCloseOptions` for explicit guarded or forced close operations
- `ModalConfig` for shell behavior/config only
- `ModalOpenOptions<TData = unknown, TResult = unknown>` for service open options, including
  optional `data` and a typed close guard
- `ModalSize` for `sm`, `md`, `lg`, `xl`, and `fullscreen` dimension presets
- `MODAL_CONFIG` for shell config injection
- `MODAL_DATA` for business/content data injection
- `MODAL_REF` for closing from opened modal content

Implementation files:

- `modal-close-types.ts` contains the public close reason and close event types.
- `modal-config.ts` contains only the public config and open option types.
- `modal-tokens.ts` owns `MODAL_CONFIG`, `MODAL_DATA`, and `MODAL_REF`.

`ModalComponent` accepts only `title` as a public input. Shell options such as width, max height, close button visibility, backdrop close, and Escape close are configured through `MODAL_CONFIG` or `ModalService.open(..., options)`.

Required reference API:

```ts
class ModalRef<TResult = unknown> {
  close(result?: TResult, reason?: ModalCloseReason, options?: ModalCloseOptions): Promise<boolean>;
  afterClosed(): Observable<TResult | undefined>;
  afterClosedWithReason(): Observable<ModalCloseEvent<TResult>>;
  setCanClose(canClose: ModalCanClose<TResult> | undefined): void;
}
```

`close()` defaults to the `programmatic` reason. Pass `action` when a user-facing action button
closes the modal. `afterClosed()` remains the result-only compatibility API, while
`afterClosedWithReason()` emits both the typed result and close reason. The returned promise is
`true` only when the modal closes and `false` when a guard, pending close attempt, or missing close
handler prevents closure.

Required close metadata types:

```ts
type ModalCloseReason = 'action' | 'close-button' | 'backdrop' | 'escape' | 'programmatic';

type ModalCloseEvent<TResult = unknown> = Readonly<{
  result: TResult | undefined;
  reason: ModalCloseReason;
}>;

type ModalCanClose<TResult = unknown> = (
  event: ModalCloseEvent<TResult>,
) => boolean | Promise<boolean>;

type ModalCloseOptions = Readonly<{
  force?: boolean;
}>;
```

Required config types:

```ts
type ModalConfig = {
  size?: ModalSize;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};

type ModalOpenOptions<TData = unknown, TResult = unknown> = ModalConfig & {
  data?: TData;
  canClose?: ModalCanClose<TResult>;
};
```

Defaults:

- `size` is `md`
- `closeOnBackdrop` is `true`
- `closeOnEscape` is `true`
- `showCloseButton` is `true`
- `maxWidth` is `90%`
- `maxHeight` is `90svh`

## Architecture

Mount the global outlet once in the root app template:

```html
<router-outlet /> <ms-modal-outlet />
```

`ModalService.open(Component, options?)` adds an entry to a signal-backed stack. `ModalOutletComponent` renders each entry with `NgComponentOutlet`. The opened component is the full modal component and is responsible for rendering `<ms-modal>`.

Service-opened modal components receive:

- `MODAL_REF` for closing and returning typed results
- `MODAL_DATA` for business payloads from `options.data`
- `MODAL_CONFIG` for shell options from `options`, with `data` stripped out

`MODAL_CONFIG` must remain shell-only. Do not read business data from it; use `MODAL_DATA`.
`canClose` belongs to `ModalOpenOptions`, not `ModalConfig`, because it controls the lifecycle of a
service-opened modal rather than shell rendering.

Stacking is coordinated by the outlet with `--ms-modal-stack-offset`. `ModalComponent` derives backdrop and dialog z-index from that CSS variable and `--z-index-modal`.

## Usage

Open a modal with typed data and typed result:

```ts
type UserModalData = {
  userId: string;
};

type UserModalResult =
  | {
      action: 'save';
      payload: {
        name: string;
      };
    }
  | {
      action: 'cancel';
    };

const modalRef = modalService.open<UserModalComponent, UserModalData, UserModalResult>(
  UserModalComponent,
  {
    width: '42rem',
    data: {
      userId: 'user-1',
    },
  },
);

modalRef.afterClosedWithReason().subscribe(({ result, reason }) => {
  if (result?.action === 'save') {
    // continue workflow
  }

  console.log('Modal closed because of:', reason);
});
```

Use a consistent size preset:

```ts
modalService.open(UserModalComponent, {
  size: 'lg',
});
```

Explicit dimensions override the selected preset for custom cases:

```ts
modalService.open(UserModalComponent, {
  size: 'lg',
  width: '42rem',
  maxWidth: 'calc(100vi - 2rem)',
});
```

Prevent dismissal while a form has unsaved changes:

```ts
const modalRef = modalService.open<EditUserModal, EditUserData, EditUserResult>(EditUserModal, {
  data,
  canClose: async ({ reason }) => {
    if (reason === 'action' || !formDirty()) {
      return true;
    }

    return confirmDiscardChanges();
  },
});
```

Opened content can replace or clear the guard when it owns the relevant state:

```ts
modalRef.setCanClose(({ reason }) => reason === 'action' || !formDirty());
modalRef.setCanClose(undefined);
```

Opened modal component:

```ts
@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Edit User">
      <p>Editing user {{ data.userId }}</p>

      <div slot="footer">
        <button
          class="btn btn-secondary"
          type="button"
          (click)="modalRef.close({ action: 'cancel' }, 'action')"
        >
          Cancel
        </button>
        <button class="btn btn-primary" type="button" (click)="save()">Save</button>
      </div>
    </ms-modal>
  `,
})
export class UserModalComponent {
  protected readonly data = inject(MODAL_DATA) as UserModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<UserModalResult>;

  protected save(): void {
    void this.modalRef.close(
      {
        action: 'save',
        payload: {
          name: 'Ada Lovelace',
        },
      },
      'action',
    );
  }
}
```

Declarative modal shell config uses the raw token directly:

```ts
@Component({
  selector: 'app-scrollable-modal-example',
  imports: [ModalComponent],
  providers: [
    {
      provide: MODAL_CONFIG,
      useValue: {
        width: '42rem',
      },
    },
  ],
  template: `
    @if (isOpen()) {
      <ms-modal title="Scrollable content" (close)="isOpen.set(false)"> ... </ms-modal>
    }
  `,
})
export class ScrollableModalExample {
  protected readonly isOpen = signal(false);
}
```

## Component Behavior

`ModalComponent` renders:

- fixed backdrop and centered dialog
- fixed header with required title, optional `headerActions`, and optional close button
- scrollable content area that consumes remaining vertical space
- projected footer intended for action buttons

Size presets:

| Size         | Inline Size | Intended Use                    |
| ------------ | ----------- | ------------------------------- |
| `sm`         | `24rem`     | Confirmations and short content |
| `md`         | `36rem`     | Default forms and general use   |
| `lg`         | `48rem`     | Detailed forms                  |
| `xl`         | `64rem`     | Tables and complex content      |
| `fullscreen` | `100vi`     | Editors and large workflows     |

- preset sizes retain the default responsive `90%` maximum inline size
- explicit `width`, `maxWidth`, and `maxHeight` take precedence over preset dimensions
- `md` preserves the existing `36rem` default
- fullscreen removes viewport padding, maximum dimensions, border, and border radius
- fullscreen uses `100vi` by `100svh`, with only modal content scrolling between the fixed header
  and footer
- avoid combining `fullscreen` with custom width values because those intentions conflict

Projection slots:

- default content renders in the modal body
- `[slot='headerActions']` renders next to the title
- `[slot='footer']` renders in the footer

Close behavior:

- service-opened modals close automatically from the close button, backdrop, and Escape key
- backdrop click closes with reason `backdrop` only when `closeOnBackdrop` is enabled
- Escape closes only the top modal with reason `escape` when `closeOnEscape` is enabled
- close button renders only when `showCloseButton` is enabled
- close button closes with reason `close-button`
- close buttons render the decorative Material Symbols `close` icon with `.ms-icon`
- user-facing action buttons should call `modalRef.close(result, 'action')`
- other calls to `modalRef.close(result?)` use reason `programmatic`
- directly rendered modals without an injected `MODAL_REF` continue to emit `close`

Close guards:

- `canClose` receives the proposed typed result and `ModalCloseReason`
- guards may return a boolean or `Promise<boolean>`
- `false` and rejected promises keep the modal open
- duplicate guarded close attempts are ignored while an asynchronous guard is pending
- `afterClosed()` and `afterClosedWithReason()` emit only after a guard approves closure
- `{ force: true }` bypasses the guard for explicit teardown workflows

Service state utilities:

```ts
modalService.hasOpenModals(); // boolean signal value
modalService.top(); // ModalRef<unknown> | null signal value
await modalService.closeAll(); // true only when every modal closes
await modalService.closeAll({ force: true });
```

`closeAll()` closes from the top of the stack downward with reason `programmatic`. It stops and
returns `false` when a modal guard rejects closure. `top()` exposes only the top `ModalRef`; internal
entry injectors and focus state remain implementation details.

Accessibility:

- `role="dialog"`
- `aria-modal="true"`
- title association through `aria-labelledby`
- focus is trapped while a service modal is open
- focus is restored after close
- tab navigation stays inside the top modal

## Styling

Modal styles live in `src/styles/components/_modal.scss` and are forwarded from `src/styles/components/_index.scss`.

Use existing tokens for color, spacing, radius, shadow, border width, motion, and z-index. The default modal uses `max-height: 90svh`, `max-width: 90%`, centered viewport layout, fixed header/footer, and scrollable body content.

Modal header actions, close-button placement, content padding, and footer action alignment use
logical inline/block layout so they mirror correctly in both `dir="ltr"` and `dir="rtl"`.

Consumers can customize an individual modal by setting CSS custom properties on `ms-modal`:

```scss
.custom-modal {
  --ms-modal-header-padding: var(--spacing-12);
  --ms-modal-content-padding: 0;
  --ms-modal-footer-padding: var(--spacing-16);
  --ms-modal-border-radius: var(--radius-lg);
  --ms-modal-background: var(--color-surface-raised);
}
```

Defaults remain unchanged when these properties are omitted. Use one spacing value for
`--ms-modal-header-padding`; this keeps the custom header padding symmetrical in both LTR and RTL.

## Showcase

The modal showcase should demonstrate:

- declarative modal usage
- basic modal content
- `sm`, `md`, `lg`, `xl`, and `fullscreen` size presets
- explicit width and max-width overrides
- header actions and footer actions
- typed close result handling
- close-reason handling for action, close button, backdrop, Escape, and programmatic closure
- synchronous or asynchronous dirty-state close guards
- `hasOpenModals()`, `top()`, and guarded `closeAll()` service utilities
- disabled backdrop close through `ModalService.open(..., { closeOnBackdrop: false })`
- disabled Escape close through `ModalService.open(..., { closeOnEscape: false })`
- stacked service modals
- `MODAL_DATA` consumption in an opened modal
- declarative shell configuration through `MODAL_CONFIG`
- scrollable content
- scoped modal styling through the public modal CSS custom properties

Showcase snippets must use `ShowcaseCode`, be hand-authored in the feature component `.ts` file, and be full standalone Angular component examples that users can copy/paste.

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

- Root app includes one `ms-modal-outlet`.
- Consumers can open full modal components through `ModalService.open(Component, options?)`.
- Opened service components render their own `<ms-modal>`.
- `ModalRef.close(result, reason?, options?)` resolves with whether closure succeeded and emits the
  typed result through `afterClosed()` and `{ result, reason }` through
  `afterClosedWithReason()`.
- `MODAL_CONFIG` exposes only shell config.
- `MODAL_DATA` exposes only business/content data.
- `ModalOpenOptions<TData, TResult>` supports typed data, typed close guards, and shell config
  options.
- `ModalSize` exposes all documented presets and defaults to `md`.
- Presets remain responsive, explicit dimensions override presets, and fullscreen occupies the
  viewport without outer padding or rounded borders.
- Open-option and `ModalRef.setCanClose()` guards support boolean and promise results.
- Guard rejection, `false`, and duplicate pending attempts keep the modal open without close
  emissions.
- `hasOpenModals()` and `top()` expose signal-based public stack state without leaking entries.
- `closeAll()` closes top-down, respects guards by default, and supports explicit forced teardown.
- Backdrop, Escape, close button, width, max width, and max height behavior respect config.
- Service-opened modal close buttons and enabled backdrop clicks close without consumer event wiring.
- Every service-modal close path reports the correct `ModalCloseReason`.
- Multiple modals can be open with correct backdrop/dialog stacking.
- Closing the top modal preserves underlying modal state.
- Focus is trapped while service modals are open and restored after close.
- Dialog accessibility attributes are present and correctly associated.
- Modal styles are reusable, responsive, token-based, and forwarded from the components style index.
- Modal shell styling can be scoped with the documented `--ms-modal-*` CSS custom properties.
- Header and footer actions, including the close button, mirror correctly in `dir="rtl"`.
- Showcase examples and snippets reflect the current API.
