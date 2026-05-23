# Feature 011: Modal System

## Goal

Create a production-quality reusable modal/dialog system for the UI library.

The modal system must be reusable, extensible, strongly typed, accessible, dynamically created through a service, and support stacked modals.

## Public API

Import modal primitives from the folder barrel:

```ts
import {
  ModalComponent,
  ModalConfig,
  ModalRef,
  ModalService,
} from '../../shared/components/modal';
```

Public pieces:

- `ModalComponent` with selector `ms-modal`
- `ModalService` with `open()` for dynamic modal creation
- `ModalRef<TResult = unknown>` for closing and observing close results
- `ModalConfig<TData = unknown>` for modal options and typed data

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

Required service API:

```ts
const modalRef = modalService.open(SomeComponent, config);
```

Required reference API:

```ts
class ModalRef<TResult = unknown> {
  close(result?: TResult): void;
  afterClosed(): Observable<TResult | undefined>;
}
```

Required config API:

```ts
interface ModalConfig<TData = unknown> {
  title: string;
  data?: TData;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
}
```

Defaults:

- `closeOnBackdrop` is `true`
- `closeOnEscape` is `true`
- `showCloseButton` is `true`
- `maxWidth` is `90%`
- `maxHeight` is `90svh`

Use strong typing throughout for config data, close results, and modal references. Avoid `any`.

## Desired Usage

Open a modal with typed data and typed result:

```ts
type UserModalData = {
  userId: string;
};

type UserModalResult = {
  action: 'save';
  payload: {
    name: string;
  };
} | {
  action: 'cancel';
};

const modalRef = modalService.open<UserModalComponent, UserModalData, UserModalResult>(
  UserModalComponent,
  {
    title: 'Edit user',
    data: {
      userId: 'user-1',
    },
  },
);

modalRef.afterClosed().subscribe(result => {
  if (result?.action === 'save') {
    // continue workflow
  }
});
```

Close from modal content with a typed result:

```ts
modalRef.close({
  action: 'save',
  payload: {
    name: formData.name,
  },
});
```

Render a modal shell with projected header actions, dynamic body content, and projected footer actions:

```html
<ms-modal [title]="title">
  <button slot="headerActions" type="button" class="btn btn-ghost">
    Help
  </button>

  <ng-container modalContent></ng-container>

  <div slot="footer">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="button" class="btn btn-primary">Save</button>
  </div>
</ms-modal>
```

Do not use `titleExtra`; use `headerActions` for optional content next to the title.

## Component Structure

The implementation lives in:

`src/app/shared/components/modal`

The modal system includes:

- `ModalComponent`
- `ModalService`
- `ModalRef`
- `ModalConfig`
- overlay host handling
- stack management, if needed
- injection helpers, if needed
- `index.ts`

`ModalComponent` renders:

- a fixed header with a required title, optional `headerActions`, and optional close button
- a scrollable content area that consumes remaining vertical space
- a fixed projected footer intended for action buttons

Header layout:

```html
<header>
  <div class="title-section">
    <div class="title"></div>
    <div class="header-actions"></div>
  </div>

  <button class="close-button"></button>
</header>
```

Expected modal layout:

```css
modal
 ├── header (fixed)
 ├── content (scrollable / flex-grow)
 └── footer (fixed)
```

The implementation must be complete, not scaffolding only. Include component code, service code, interfaces/types, lifecycle handling, styles, accessibility logic, dynamic component creation logic, and cleanup logic.

## Dynamic Creation

The modal must not require manual placement in consumer templates.

`ModalService` is responsible for:

- dynamically creating modal instances
- attaching modals to the application root or overlay host
- injecting target component content
- passing typed configuration data
- returning a strongly typed `ModalRef<TResult>`
- managing lifecycle and cleanup after close
- supporting multiple open modals

Opening a modal with typed data and result should support this shape:

```ts
modalService.open<UserModalComponent, UserData, SaveResult>(UserModalComponent, config);
```

## Projection and Injection Rules

- The modal title is provided through config/input.
- Body content is dynamically injected into the modal shell.
- Footer content is projected and intended for action buttons.
- Optional header content is projected next to the title with `headerActions`.
- Programmatic close uses `ModalRef.close(result)`.
- Close results are emitted through `ModalRef.afterClosed()`.
- Close subscriptions are cleaned up properly.
- The API should remain library-friendly and extensible.

## Stacking and Overlay Behavior

The system must support opening modals on top of other modals.

Requirements:

- multiple simultaneous modals
- correct z-index stacking
- backdrop stacking
- modal stacking order management
- closing the top modal preserves underlying modal state
- background interaction is prevented while a modal is open

Use existing design/style token z-index values. Do not hardcode arbitrary z-index values if tokens already exist.

Expected z-index logic:

```ts
zIndex = modalBaseToken + stackIndex
```

The backdrop should stack correctly beneath each modal.

## Styling

Modal styles live in:

`src/styles/components/_modal.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, shadow, border width, motion, and focus rings
- modal container uses `max-height: 90svh` and `max-width: 90%` by default
- modal container is centered in the viewport
- modal container uses flex column layout
- header and footer remain fixed within the modal
- content area scrolls when overflowing and consumes remaining vertical space
- responsive behavior avoids layout overflow bugs
- open and close lifecycle should feel smooth

## Accessibility

Implement proper dialog accessibility.

Required behavior:

- `role="dialog"`
- `aria-modal="true"`
- title association through `aria-labelledby`
- keyboard Escape support when `closeOnEscape` is enabled
- focus trapping
- restore focus after close
- close button is keyboard accessible
- tab navigation stays inside the modal
- backdrop close only runs when `closeOnBackdrop` is enabled
- close button only renders when `showCloseButton` is enabled

## Showcase

Add a modal showcase page or section that demonstrates:

- opening a basic modal
- footer action buttons
- `headerActions`
- typed close result handling
- disabled backdrop close
- disabled Escape close
- stacked modals
- scrollable content

Showcase snippets should use `ShowcaseCode` from `src/app/shared/components/showcase-code`.

Keep snippets hand-authored in the feature component `.ts` file and make each snippet a full standalone Angular component example that users can copy/paste.

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

- Consumers can open modals through `ModalService.open(SomeComponent, config)` without placing modal markup manually.
- Opening a modal returns a strongly typed `ModalRef<TResult>`.
- `ModalRef.close(result)` closes the modal and emits the typed result through `afterClosed()`.
- `ModalConfig<TData>` supports typed data and configurable backdrop, Escape, close button, width, max width, and max height options.
- The modal renders a fixed header, scrollable body, and fixed projected footer.
- The header renders the required title, optional `headerActions`, and optional close button.
- Dynamic modal content receives configuration data.
- Multiple modals can be open at the same time with correct modal and backdrop stacking.
- Closing the top modal preserves underlying modal state.
- Existing z-index tokens are used for stacking when available.
- Backdrop, Escape, and close button behaviors respect their config options.
- Focus is trapped while the modal is open and restored after close.
- Dialog accessibility attributes are present and correctly associated.
- Lifecycle listeners, subscriptions, and dynamic components are cleaned up after close.
- Modal styles are reusable, responsive, token-based, and forwarded from the components style index.
- The showcase demonstrates core modal variants and renders matching copyable snippets.
