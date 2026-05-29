# Feature 021: Pagination

## Goal

Create a reusable pagination primitive for navigating paged result sets. The component should keep
page-range calculation inside the library while letting consumers own data fetching, filtering, and
route synchronization.

## Non-Goals

- Do not fetch data or couple pagination to a backend.
- Do not manage route query parameters.
- Do not implement page-size selection in the primitive.

## Public API

Import pagination primitives from the folder barrel:

```ts
import {
  getPaginationMeta,
  PaginationComponent,
  PaginationMeta,
  PaginationState,
} from '../../shared/components/pagination';
```

Public pieces:

- `PaginationComponent` with selector `ms-pagination`
- `PaginationState` for parent-owned pagination state
- `PaginationMeta` for normalized pagination metadata
- `getPaginationMeta` for deriving metadata from `PaginationState`

Required API:

```ts
type PaginationAlignment = 'start' | 'center' | 'end';

interface PaginationState {
  page?: number;
  totalItems?: number;
  pageSize?: number;
  siblingCount?: number;
  disabled?: boolean;
  ariaLabel?: string;
  showSummary?: boolean;
  alignment?: PaginationAlignment;
}

interface PaginationMeta {
  page: number;
  totalItems: number;
  pageSize: number;
  siblingCount: number;
  disabled: boolean;
  ariaLabel: string;
  totalPages: number;
  itemStart: number;
  itemEnd: number;
  hasPrevious: boolean;
  hasNext: boolean;
  showSummary: boolean;
  alignment: PaginationAlignment;
}

class PaginationComponent {
  readonly state = model<PaginationState>({});
}

function getPaginationMeta(state: PaginationState): PaginationMeta;
```

Defaults:

- omitted `state.page` defaults to `1`
- omitted `state.totalItems` defaults to `0`
- omitted `state.pageSize` defaults to `10`
- omitted `state.siblingCount` defaults to `1`
- omitted `state.disabled` defaults to `false`
- omitted `state.ariaLabel` defaults to `Pagination`
- omitted `state.showSummary` defaults to `true`
- omitted `state.alignment` defaults to `end`

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are
`.pagination`, `.pagination-list`, `.pagination-item`, `.pagination-button`,
`.pagination-page`, `.pagination-ellipsis`, `.pagination-icon`, and `.pagination-summary`.

## Desired Usage

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  PaginationComponent,
  PaginationState,
  getPaginationMeta,
} from './shared/components/pagination';

@Component({
  selector: 'app-pagination-example',
  imports: [PaginationComponent],
  template: `
    <ms-pagination [(state)]="pagination" />
    <p>Page {{ paginationMeta().page }} of {{ paginationMeta().totalPages }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationExample {
  readonly pagination = signal<PaginationState>({
    page: 1,
    totalItems: 245,
    pageSize: 10,
    alignment: 'end',
  });
  readonly paginationMeta = computed(() => getPaginationMeta(this.pagination()));
}
```

## Component Structure

The implementation lives in `src/app/shared/components/pagination`:

- `PaginationComponent` calculates visible pages, ellipses, previous/next state, and summary text
- `pagination-state.ts` defines `PaginationAlignment` and `PaginationState`
- `pagination-meta.ts` defines `PaginationMeta` and `getPaginationMeta`
- `getPaginationMeta` normalizes pagination state and derives parent-readable metadata
- `index.ts` exposes the public API

The component renders a semantic `nav` landmark containing native buttons. Consumers own the
pagination state object, receive updates through Angular two-way `model()` binding, and may derive
the same metadata used by the component through `getPaginationMeta`.

## Behavior

- Total pages are calculated from `totalItems / pageSize` and never drop below `1`.
- Invalid page, page-size, and sibling-count state values are clamped to safe positive values.
- Parent-readable metadata is derived through `getPaginationMeta`; derived values are not written
  into `PaginationState`.
- Built-in summary renders by default and can be hidden with `showSummary: false`.
- `alignment` controls page-control placement with logical `start`, `center`, and `end` values.
- When summary is enabled, it renders opposite the page controls; when summary is hidden, controls
  align to the requested logical placement.
- Previous and next buttons update `state.page` to the adjacent page when available.
- Page buttons update `state.page` to their page number.
- Activating the current page does not update state.
- Disabled pagination suppresses state updates and disables every button.
- Ellipses render when hidden pages exist between the first or last page and the active window.

## Styling

Feature styles live in `src/styles/components/_pagination.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing color, surface, border, spacing, radius, typography, motion, and focus-ring tokens.
- Use logical block/inline properties so controls mirror correctly in both `dir="ltr"` and
  `dir="rtl"`.
- Keep page controls stable in size so the layout does not shift between page ranges.
- Use `.ms-icon` for previous and next symbols.
- Keep styles reusable across future projects.

## Accessibility

- Render a `nav` landmark with a configurable accessible label.
- Use native buttons for all interactive controls.
- Mark the active page button with `aria-current="page"`.
- Give page buttons accessible labels such as `Go to page 4`.
- Give previous and next controls accessible labels.
- Disable unavailable or globally disabled controls with the native `disabled` attribute.
- Hide ellipses from assistive technology.
- Preserve visible focus indication on all enabled controls.

## Showcase

Add a dedicated `/pagination` page and home card demonstrating:

- basic controlled pagination
- compact page windows with ellipses
- disabled pagination
- summary off
- start, center, and end alignment
- a scoped RTL example showing control mirroring
- parent-derived metadata from `getPaginationMeta`

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

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

- Public pagination primitives are exported from the pagination barrel.
- The primary pagination usage example works as documented.
- Pagination renders previous, next, page, current-page, ellipsis, disabled, and RTL examples.
- Pagination renders summary on/off and start, center, and end alignment examples.
- Page changes update only `state.page` while preserving the rest of the parent-owned state object.
- Parent components can derive `totalPages`, range values, and previous/next flags through
  `getPaginationMeta`.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- Previous and next controls mirror correctly in RTL layouts.
- The `/pagination` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
