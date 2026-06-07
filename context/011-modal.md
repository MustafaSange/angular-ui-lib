# Feature 011: Modal System

## Context

The modal system is a reusable Angular dialog system for the UI library. It supports declarative modals, service-opened modals, typed close results, shell configuration, injected content data, focus trapping, backdrop/Escape close behavior, scrollable content, and stacked modals.

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

## Public API

Import modal primitives from the folder barrel:

```ts
import {
  MODAL_CONFIG,
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalConfig,
  ModalOpenOptions,
  ModalRef,
  ModalService,
} from '../../shared/ui-lib';
```

Public pieces:

- `ModalComponent` with selector `ms-modal`
- `ModalOutletComponent` with selector `ms-modal-outlet`
- `ModalService.open()` for opening full modal components through the global outlet
- `ModalRef<TResult = unknown>` for closing and observing close results
- `ModalConfig` for shell behavior/config only
- `ModalOpenOptions<TData = unknown>` for service open options, including optional `data`
- `MODAL_CONFIG` for shell config injection
- `MODAL_DATA` for business/content data injection
- `MODAL_REF` for closing from opened modal content

Implementation files:

- `modal-config.ts` contains only the public config and open option types.
- `modal-tokens.ts` owns `MODAL_CONFIG`, `MODAL_DATA`, and `MODAL_REF`.

`ModalComponent` accepts only `title` as a public input. Shell options such as width, max height, close button visibility, backdrop close, and Escape close are configured through `MODAL_CONFIG` or `ModalService.open(..., options)`.

Required reference API:

```ts
class ModalRef<TResult = unknown> {
  close(result?: TResult): void;
  afterClosed(): Observable<TResult | undefined>;
}
```

Required config types:

```ts
type ModalConfig = {
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};

type ModalOpenOptions<TData = unknown> = ModalConfig & {
  data?: TData;
};
```

Defaults:

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

modalRef.afterClosed().subscribe((result) => {
  if (result?.action === 'save') {
    // continue workflow
  }
});
```

Opened modal component:

```ts
@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Edit user" (close)="modalRef.close({ action: 'cancel' })">
      <p>Editing user {{ data.userId }}</p>

      <div slot="footer">
        <button
          class="btn btn-secondary"
          type="button"
          (click)="modalRef.close({ action: 'cancel' })"
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
    this.modalRef.close({
      action: 'save',
      payload: {
        name: 'Ada Lovelace',
      },
    });
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

Projection slots:

- default content renders in the modal body
- `[slot='headerActions']` renders next to the title
- `[slot='footer']` renders in the footer

Close behavior:

- backdrop click emits `close` only when `closeOnBackdrop` is enabled
- Escape closes only the top modal when `closeOnEscape` is enabled
- close button renders only when `showCloseButton` is enabled
- close buttons render the decorative Material Symbols `close` icon with `.ms-icon`
- service-opened content should call `modalRef.close(result?)`

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

## Showcase

The modal showcase should demonstrate:

- declarative modal usage
- basic modal content
- header actions and footer actions
- typed close result handling
- disabled backdrop close through `ModalService.open(..., { closeOnBackdrop: false })`
- disabled Escape close through `ModalService.open(..., { closeOnEscape: false })`
- stacked service modals
- `MODAL_DATA` consumption in an opened modal
- declarative shell configuration through `MODAL_CONFIG`
- scrollable content

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
- `ModalRef.close(result)` closes the modal and emits the typed result through `afterClosed()`.
- `MODAL_CONFIG` exposes only shell config.
- `MODAL_DATA` exposes only business/content data.
- `ModalOpenOptions<TData>` supports typed data and shell config options.
- Backdrop, Escape, close button, width, max width, and max height behavior respect config.
- Multiple modals can be open with correct backdrop/dialog stacking.
- Closing the top modal preserves underlying modal state.
- Focus is trapped while service modals are open and restored after close.
- Dialog accessibility attributes are present and correctly associated.
- Modal styles are reusable, responsive, token-based, and forwarded from the components style index.
- Header and footer actions, including the close button, mirror correctly in `dir="rtl"`.
- Showcase examples and snippets reflect the current API.
