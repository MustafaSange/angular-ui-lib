# Feature 050: Table Header Search Controls

## Goal

Create reusable table-header controls that let users filter a column and edit an ordered,
multi-property sort without replacing the native table style system.

Each configured `<th>` contains a filter icon button and a sort icon button. The filter button
opens a data-type-aware filter popover for that column. The sort button opens a separate popover
that edits the table's complete ordered sort list. Applying either popover updates the shared
search state and emits the same backend-compatible `PaginatedSearchRequest` used by
`ms-search-query-form`.

The controls must use existing ui-lib form controls, buttons, icons, and native popover
primitives. They must remain enterprise-dense, keyboard accessible, RTL-safe, and visually
isolated from the `<th>` that contains them.

## Assumptions

- A table has at most one active filter condition for each property, matching the current
  `ms-search-query-form` property-selection behavior.
- The sort popover is a table-level ordered multi-sort editor. Opening it from any column header
  shows the same complete sort draft, not only the clicked column.
- Filter and sort changes are transactional. Draft edits do not update `state` or emit a request
  until Apply is activated.
- This feature adds behavior around native table markup; it does not create an Angular table or
  data-grid component.

## Non-Goals

- Do not fetch, filter, sort, paginate, or cache table data inside the ui-lib component.
- Do not render table rows, cells, loading states, or empty states.
- Do not add client-side comparison or filtering algorithms.
- Do not add SQL or backend column metadata to frontend configuration.
- Do not support multiple filter conditions for the same property in this version.
- Do not replace the existing `ms-search-query-form` or create a second request contract.

## Public API

Import public pieces from the ui-lib barrel:

```ts
import {
  SEARCH_SORT_DIRECTION,
  TableSearchColumnComponent,
  TableSearchDirective,
  type PaginatedSearchRequest,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchSortConfig,
} from '../../shared/ui-lib';
```

Public pieces:

- `TableSearchDirective` with selector `table[msTableSearch]`.
- `TableSearchColumnComponent` with selector `th[msTableSearchColumn]`.
- Existing search-query contracts and helpers remain the only public filter, operator, value,
  sort, state, and request APIs.

Required parent directive API:

```ts
class TableSearchDirective {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly sortConfig = input<SearchSortConfig | null>(null);
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();
  readonly disabled = input(false, { transform: booleanAttribute });
}
```

Required column component API:

```ts
class TableSearchColumnComponent {
  readonly propertyName = input.required<string>({ alias: 'msTableSearchColumn' });
}
```

API behavior:

- `properties` configures all searchable columns once on the parent table. A property name must be
  non-empty, must already equal its trimmed value, and must be unique. Reject invalid configuration;
  never trim or otherwise mutate backend wire names silently.
- `sortConfig` configures the complete table-level list of sortable properties, ordered defaults,
  and `maxSorts`, using the existing `SearchSortConfig` rules.
- `state` is parent-owned and managed once by the table directive.
- The directive reconciles required filters and default sorts into `state` using the same rules as
  `ms-search-query-form`. Reconciliation may emit the model's generated `stateChange`, but it never
  emits `requestChange`.
- `requestChange` emits only for committed Clear filter or Apply actions when every required filter
  is present and valid. Its payload is produced by the existing `buildSearchRequest` helper.
- `disabled` disables all column triggers and actions in the table. It defaults to `false`.
- If `disabled` becomes true while a filter or sort popover is open, close it, discard its draft,
  restore focus only when the trigger remains enabled, and emit neither state nor request changes.
- `msTableSearchColumn` identifies the current header by a `propertyName` from the parent
  directive's `properties` input. Consumers do not repeat the property configuration on each
  `<th>`.
- When `sortConfig` is `null` or has no valid options, the sort trigger is not rendered.
- The filter trigger is rendered when `msTableSearchColumn` resolves to a valid property.
- A column component must be a descendant of exactly one `table[msTableSearch]`. Missing parent
  configuration or an unknown/duplicate property name produces a clear development-time error
  instead of silently emitting an invalid request.

Do not introduce table-specific copies such as `TableFilterOperator`, `TableSearchDataType`, or
`TableSortDirection`.

## Shared Search Contracts

The search contracts are common library APIs, not implementation details owned by one visual
component. Extract the reusable search domain from `components/search-query-form` into:

`src/app/shared/ui-lib/search-query`

The shared folder contains focused files for:

- search data types, operators, property configurations, values, filters, sorts, query state,
  requests, and paginated responses
- operator labels, compatibility, defaults, and value-less operator detection
- request building and request-value normalization
- scalar parsing, validation, input metadata, range validation, and value limits
- applied-state reconciliation and validation shared by both search presentations
- sort option/default/limit normalization
- date and time request helpers

`SearchQueryFormComponent`, `TableSearchDirective`, and `TableSearchColumnComponent` import these
shared contracts and helpers. Preserve all existing public symbol names and runtime values,
including backend wire names and numeric sort directions. Keep compatibility re-exports where
needed so existing imports from the ui-lib root continue to compile without ambiguity or duplicate
star exports.

Extract the existing required-filter and default-sort reconciliation from
`SearchQueryFormComponent` into the shared search domain instead of implementing a table-specific
variant. Both presentations must produce equivalent reconciled state for the same properties,
sort configuration, and incoming state.

Barrel wiring is explicit:

- `src/app/shared/ui-lib/search-query/index.ts` exports the common contracts and intentional public
  helpers.
- `components/search-query-form/index.ts` continues compatibility re-exports of those common APIs
  from `../../search-query` and exports `SearchQueryFormComponent` plus its intentional form APIs.
- `components/table-search/index.ts` exports only `TableSearchDirective` and
  `TableSearchColumnComponent`; it does not re-export common search APIs.
- `components/index.ts` exports both `search-query-form` and `table-search`.
- The root `ui-lib/index.ts` continues exporting `components`; do not add a second root star export
  that makes common search symbols ambiguous.
- Internal implementations in both feature folders import shared contracts and helpers directly
  from `../../search-query`.

Value-less operators remain:

```ts
'isNull';
'isEmpty';
'isNullOrEmpty';
'isNotNull';
'isNotEmpty';
'isNotNullOrEmpty';
```

They hide value controls, skip value validation, keep the filter value as `null`, and emit
`value: null`.

## Desired Usage

```ts
import { Component, signal } from '@angular/core';

import {
  SEARCH_SORT_DIRECTION,
  TableSearchColumnComponent,
  TableSearchDirective,
  type PaginatedSearchRequest,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchSortConfig,
} from './shared/ui-lib';

@Component({
  selector: 'app-invoice-table-example',
  imports: [TableSearchColumnComponent, TableSearchDirective],
  template: `
    <div class="table-wrapper">
      <table
        class="table"
        msTableSearch
        [properties]="properties"
        [sortConfig]="sortConfig"
        [(state)]="state"
        (requestChange)="handleRequest($event)"
      >
        <caption>
          Invoice results
        </caption>
        <thead>
          <tr>
            <th scope="col" class="text-start" msTableSearchColumn="invoice">Invoice reference</th>
            <th scope="col" class="text-start" msTableSearchColumn="customer">Customer</th>
            <th scope="col" class="text-start" msTableSearchColumn="status">Status</th>
            <th scope="col" class="text-start" msTableSearchColumn="due">Due date</th>
            <th scope="col" class="text-end" msTableSearchColumn="amount">
              <span align="end">Amount</span>
            </th>
            <th scope="col" class="text-start" msTableSearchColumn="paid">Paid?</th>
          </tr>
        </thead>
        <tbody>
          <!-- Consumer-owned rows. -->
        </tbody>
      </table>
    </div>
  `,
})
export class InvoiceTableExample {
  readonly properties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'invoice',
      label: 'Invoice',
      dataType: 'string',
      defaultOperator: 'contains',
      defaultValue: 'INV-',
      required: true,
    },
    {
      propertyName: 'customer',
      label: 'Customer',
      dataType: 'string',
      defaultOperator: 'contains',
      allowCustomInValues: true,
    },
    {
      propertyName: 'status',
      label: 'Status',
      dataType: 'enum',
      defaultOperator: 'in',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' },
      ],
    },
    {
      propertyName: 'due',
      label: 'Due date',
      dataType: 'dateTime',
      defaultOperator: 'between',
    },
    {
      propertyName: 'amount',
      label: 'Amount',
      dataType: 'decimal',
      defaultOperator: 'between',
    },
    {
      propertyName: 'paid',
      label: 'Paid',
      dataType: 'boolean',
      defaultOperator: 'eq',
      booleanLabels: 'yesNo',
    },
  ];

  readonly sortConfig: SearchSortConfig = {
    sortOptions: this.properties.map((property) => ({
      label: property.label ?? property.propertyName,
      value: property.propertyName,
    })),
    defaultSorts: [{ property: 'due', direction: SEARCH_SORT_DIRECTION.ASCENDING }],
    maxSorts: 4,
  };

  readonly state = signal<SearchQueryFormState>({ filters: [] });

  handleRequest(request: PaginatedSearchRequest): void {
    // Consumer calls its data source and resets pagination when appropriate.
  }
}
```

The parent table directive owns `state`, configuration lookup, and request emission. Each
header component injects that directive and resolves its property by name. Applying a column filter
replaces only the filter whose `property` matches that column and preserves filters for every other
column. Applying sort replaces only `state.sort` and preserves filters, `page`, and `limit`.

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/table-search`

The feature includes:

- `TableSearchDirective`
- `TableSearchColumnComponent`
- internal `TableFilterPopoverComponent`
- internal `TableSortPopoverComponent`
- internal draft models and equality/reconciliation helpers in focused sibling files
- `index.ts`

The parent directive renders nothing. It owns normalized configuration, shared applied state, and
the methods that atomically commit a filter or sort and emit the resulting request. Child column
components obtain the nearest parent with Angular dependency injection; do not use a global service
or query the DOM for the table.

`TableSearchColumnComponent` uses the existing native `<th>` as its host. Its template projects the
consumer-owned header label and renders a compact inline actions group containing:

- an icon-only filter trigger using the `filter_list` Material Symbol
- an independent icon-only sort trigger using the `unfold_more` Material Symbol
- one `ms-popover` and `ms-popover-panel` for the filter editor
- one `ms-popover` and `ms-popover-panel` for the ordered sort editor

The attribute-selector component must preserve the native `<th>` host, `scope`, projected label,
table semantics, and consumer alignment classes. It must not render a nested `<th>` or replace the
header with a custom element.

The column template uses this layout model:

```html
<div class="table-search-header">
  <span class="table-search-label"><ng-content /></span>
  <span class="table-search-actions">
    <!-- Filter trigger and popover. -->
    <!-- Sort trigger and popover when sorting is configured. -->
  </span>
  <ng-content select="[align='end']" />
</div>
```

The component template adds the buttons; the parent directive does not create elements with
`Renderer2`, `ElementRef`, or manual DOM APIs.

`TableFilterPopoverComponent` and `TableSortPopoverComponent` are implementation-only components
and are not exported from the feature barrel. Each owns exactly one trigger/panel pair, controlled
open state, local signal-form draft, and focus lifecycle. Keeping the two editors separate avoids
ambiguous trigger queries and prevents filter and sort drafts from affecting each other.

Render expensive editor form content only while its popover is open. A closed sort popover in every
header must not retain a duplicate active form or drag listener; it rebuilds its draft from the
parent directive when opened.

Use existing reusable ui-lib pieces wherever applicable:

- `PopoverComponent`, `PopoverPanelComponent`, and `PopoverTrigger`
- `SignalFormField` and Angular signal forms with `[formField]`
- `SelectComponent` and `SelectOptionComponent`
- `ChipComponent` for selected `in` values when applicable
- existing button classes and `.btn-icon`
- `.ms-icon` and `.ms-icon-filled`

Use `drag_indicator` for the sort-row drag handle and add that ligature to `MATERIAL_ICONS`. Existing
`filter_list`, `unfold_more`, `add`, `delete`, `close`, and direction icons remain registered or must
be verified before use.

Shared parsing, validation, operator, and request logic must not be copied into the new component.

## Filter Popover Behavior

- Opening the filter popover creates a local draft from the applied filter for `property`.
- If the property has no applied filter, initialize the draft from its configured default operator
  and default value. Do not update shared state merely by opening the popover.
- Render only operators compatible with the configured data type and `allowedOperators`.
- Use the same default operators, limits, parsing, validation, date/time formats, enum values,
  boolean labels, GUID validation, range validation, and `in` behavior as
  `ms-search-query-form`.
- Render the operator selector first, followed by the matching value editor.
- Preserve the current draft when switching between compatible scalar operators. Reset the draft
  only when the new operator requires a different value shape.
- Use a compact modal-style header containing only the property label and a full-height close
  action. Do not repeat “Column Filter” in the visible title.
- Render one value control for scalar operators, From and To controls for `between`, and the
  existing multi-value selection/custom-entry behavior for `in`.
- Stack the From and To controls for date-time `between` filters so native `datetime-local`
  controls retain enough inline space inside the compact filter panel.
- Hide all value UI for value-less operators and keep the draft value `null`.
- Validate option-backed scalar and range values against the configured option values, including
  externally supplied state; do not accept a merely type-compatible value that is not configured.
- When Apply is activated with a valid pending custom `in` value, add that value before committing
  so typed input is never silently discarded. Invalid or over-limit pending input blocks Apply.
- Apply is disabled while the signal form is invalid or pending. It is also disabled when applying
  the draft would leave another required filter missing or invalid.
- Activating Apply replaces the current property's filter in `state.filters`, preserves the order
  of unrelated filters, updates `state`, emits `requestChange`, closes the popover, and returns
  focus to the filter trigger.
- A newly applied filter receives a stable generated `id`; editing it preserves its existing `id`
  and `locked` value. A newly reconciled or applied required filter is always locked.
- Render Clear filter only when the current property has an applied, unlocked, optional filter and
  all required filters are valid. Otherwise omit the action instead of rendering it disabled.
- Do not render a “Required filters cannot be cleared” warning when Clear is omitted for a required
  property.
- Do not render an informational message explaining when Clear filter will become available. The
  omitted action is sufficient when the current property has no applied filter.
- Activating Clear filter removes only the current property's filter, immediately updates `state`,
  emits `requestChange`, closes the popover, and returns focus to the filter trigger.
- Clear filter is also unavailable when the resulting applied state would contain another missing
  or invalid required filter.
- Escape or light dismiss discards the draft and leaves `state` unchanged.
- Reopening after dismiss reconstructs the draft from the latest applied state.
- The filter icon uses the filled visual treatment while the current property has an applied
  filter. It also exposes an accessible active-state description; color or fill is not the only
  indication.
- When a required property's applied filter is missing, incomplete, or invalid, render its filter
  trigger in an error state using the existing danger tokens. Set `aria-invalid="true"`, connect a
  visually hidden error description, and include the error in its accessible name.
- The error trigger state reflects applied/reconciled state only. An invalid optional draft that has
  not been applied shows errors inside the open popover but does not mark the trigger after the
  draft is dismissed.
- Opening an error-state filter popover focuses its first invalid control.

## Sort Popover Behavior

- Opening the sort popover creates a local ordered draft from the reconciled `state.sort`, normalized
  against the current `sortConfig`. When incoming `state.sort` is omitted, parent reconciliation
  writes the configured default sorts to `state` before user interaction. An explicit empty array
  remains empty and does not restore defaults.
- The editor shows every active sort as a row containing a drag handle, property selector,
  direction control, and remove button.
- Use the same compact modal-style header as the filter editor, with only `Sort properties` as the
  visible title and a full-height close action. Do not render a “Table sorting” eyebrow.
- Keep the filter panel compact at `20rem` and the sort panel at `28rem`, both capped by the
  available viewport width. Retain the narrow-screen stacked sort-row layout.
- Property selects use visible numbered labels such as `Property 1` and `Property 2`. Keep a stable
  option list and disable properties already used by another row. Shared form-field styling must
  not treat a select as disabled merely because it contains a disabled option.
- Render each row's remove action with the danger button treatment.
- Property selectors use configured `SearchSortOption` labels and values. A property can appear at
  most once in the active list.
- Direction choices use `SEARCH_SORT_DIRECTION.ASCENDING` and
  `SEARCH_SORT_DIRECTION.DESCENDING`; do not introduce string directions or unexplained numeric
  literals in consumer-facing code.
- Each row clearly labels the direction as Ascending or Descending. Icons may supplement but not
  replace the text label.
- An Add sort action appends the first available property in ascending order.
- Add sort is disabled at the normalized `maxSorts` limit or when every property is already used.
- Removing the last row is allowed. Applying an empty list stores `sort: []`, which
  `buildSearchRequest` omits from the emitted request.
- The sort footer contains Cancel, Clear, and Apply actions.
- Cancel closes the popover, discards the complete sort draft, leaves `state` unchanged, emits no
  request, and restores focus to the sort trigger. Escape and light dismiss have the same draft
  semantics.
- Clear removes every row from the local sort draft, remains in the open popover, leaves `state`
  unchanged, and emits no request. Clear is disabled while the draft is already empty.
- Apply commits the current ordered draft and emits the updated request. If Clear was used and no
  sort was added afterward, Apply commits an explicit `sort: []`; reconciliation must preserve that
  empty array instead of restoring configured defaults.
- Reorder active sorts by dragging the handle. Reordering changes precedence: the first row is the
  primary sort, the second row is the next tie-breaker, and so on.
- Dragging must support pointer input. Provide an equivalent keyboard operation from the focused
  drag handle, using Alt+ArrowUp and Alt+ArrowDown to move a row one position, and announce the new
  position through a polite live region.
- Use native drag/pointer behavior and Angular event handling; do not add Angular CDK only for this
  feature.
- Applying sort replaces `state.sort`, preserves filters, `page`, and `limit`, emits
  `requestChange`, closes the popover, and restores focus to the sort trigger.
- Apply is disabled when a row is incomplete, duplicated, or otherwise invalid, or when any required
  applied filter is missing or invalid.
- An unsorted column uses `unfold_more`. Each actively sorted column uses `arrow_upward` or
  `arrow_downward` for its committed direction, the active trigger treatment, and a one-based
  priority badge. Position the badge at the trigger corner without covering the direction icon and
  use the primary contrast token so its number remains legible in every theme. The trigger
  description includes the complete active sort order.
- The sort popover opened from any header instance edits the same state. Components must reconcile
  from the latest input state each time they open so stale drafts cannot overwrite a newer applied
  sort.

## State Reconciliation

- The parent directive reconciles whenever `properties`, `sortConfig`, or external `state`
  changes. Each column component reconciles when its `msTableSearchColumn` name or resolved parent
  property changes.
- Never emit `requestChange` during initialization, input reconciliation, or popover opening.
- Insert every required property into `state.filters` in configured order. Reuse a compatible
  incoming filter when present; otherwise create a stable filter from the property's configured
  operator and default value. Required filters are locked.
- When incoming `state.sort` is `undefined`, insert normalized configured default sorts. Preserve
  an explicit `sort: []` as the consumer's intentional no-sort state.
- Update `state` only when reconciled state differs structurally, preventing model/effect loops.
- Remove incoming filters whose property does not exist in the parent directive's configured
  properties. When one column commits, preserve filters belonging to every other configured column.
- If duplicate filters for a property arrive externally, reconciliation retains the first
  compatible filter and removes later duplicates through `stateChange` without emitting a request.
- Normalize incompatible operators and operator/value shapes through the same fallback rules as
  `ms-search-query-form`. Preserve structurally compatible but semantically invalid scalar or range
  values so the trigger and editor can expose their validation errors; do not silently replace those
  values with valid defaults.
- Normalize sort options, duplicates, directions, and limits with the same helpers used by
  `ms-search-query-form`.
- If relevant applied filter or sort state changes externally while its popover is open, close that
  popover, discard its draft, and rebuild from reconciled state on the next opening. Do not allow a
  stale draft to overwrite newer parent state.
- Do not emit `requestChange` while any required filter is missing or invalid. The draft for that
  required property may still be edited and applied once the candidate state becomes valid; other
  request-emitting actions remain disabled and expose an accessible explanation.
- Preserve optional `page` and `limit` exactly. Pagination reset policy belongs to the consumer.

## Popover Lifecycle and Focus

- Bind each internal editor to controlled `open` state through the existing `PopoverComponent`.
- On native open, move focus to the first invalid control, otherwise the first meaningful editor
  control. The generic popover primitive does not currently provide initial-focus behavior, so the
  internal editor component owns this focus step.
- Do not place `msPopoverClose` on an asynchronous Apply submit and assume ordering. Await successful
  signal-form submission, commit state, emit `requestChange`, then close the controlled popover and
  restore focus to its trigger.
- Cancel and filter Clear may use explicit component handlers so state, output, close, and focus
  ordering remains deterministic.
- Escape and native light dismiss discard the draft. Rely on the native popover toggle event to
  synchronize controlled open state and rebuild a fresh draft on the next opening.
- `ms-select` and any custom-value selector opened inside a filter or sort panel create nested native
  popovers. Opening, selecting, or dismissing a nested control must not close the owning editor or
  lose its draft.
- Effects, native drag handlers, pointer handlers, live-region work, and subscriptions are scoped to
  the internal editor lifetime and cleaned up on close or destruction.

## Styling

Feature styles live in:

`src/styles/components/_table-search.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- Use existing tokens for colors, spacing, typography, control heights, borders, radius, shadow,
  motion, and focus rings.
- Keep the two triggers compact and aligned with the column label without changing the native
  table header's block size unnecessarily.
- Use concise unprefixed internal hooks such as `.table-search-header`, `.filter-panel`,
  `.sort-panel`, `.sort-row`, and `.drag-handle`; do not add `.ms-*` internal hooks.
- Use logical properties and logical placement. The control group and both popovers must mirror in
  `dir="rtl"`.
- Use component-private custom properties with the `--_table-search-*` prefix.
- Style an invalid required-filter trigger with existing danger color, border, surface, and focus
  tokens. Keep the icon legible in default, hover, active, and focus-visible states; do not hardcode
  red values.
- Popovers must fit within the viewport, scroll internally when necessary, and retain usable
  actions on narrow screens.
- Keep the footer actions visible when long `in` values or sort lists scroll.

### Header actions and narrow columns

- Treat `[align="end"]` on projected label content as a projection marker, not as a table-column
  input or text-alignment rule. Unmarked content uses the default slot before the actions;
  `[align="end"]` content uses the direct slot after the actions and receives the same truncation
  styling without an extra wrapper. Hide the default label wrapper when it is empty.
- Use a content-sized inline-flex container capped at the `<th>` inline size. Keep the label at its
  content-based flex size, keep the action group inflexible, and separate visible items with
  `var(--spacing-4)`. Consumers continue to control the `<th>` text alignment independently with
  existing logical utilities such as `.text-start` and `.text-end`.
- Explicitly inherit `text-align` from the host `<th>` through the header, label, and action wrappers.
  Keep both popover panels reset to logical start alignment so header alignment does not spill into
  editor content.
- The label may shrink and render a single-line ellipsis. Keep its complete accessible text in the
  DOM; truncation is visual only.
- The action group never shrinks, wraps, overlaps an adjacent header, or clips either button.
- Use compact icon-only buttons composed from existing `.btn`, `.btn-ghost`, `.btn-icon`, and size
  classes. Use the supported extra-small button size for the header triggers; do not create a
  smaller custom interactive target.
- Give searchable headers a token-derived minimum inline size that can contain the action group
  plus a minimal label area and gap. Keep the action buttons adjacent and account for the `<th>`
  inline padding when calculating the minimum.
- When all column minimums exceed the available viewport, allow the table to become wider than its
  wrapper. The existing `.table-wrapper` provides horizontal scrolling; do not progressively hide
  filter or sort actions.
- Keep searchable tables on intrinsic/automatic table layout. If a consumer deliberately uses
  `table-layout: fixed`, its searchable column widths must be at least the documented minimum;
  forced widths must not be allowed to clip or overlap the controls.
- Keep both buttons visible for mouse, touch, keyboard, and high-zoom users. Do not reveal them only
  on hover or focus because that makes capabilities undiscoverable and does not work consistently
  for touch input.
- The popover uses top-layer rendering and viewport-aware anchored placement. Its inline size is
  based on its content and viewport, not the width of the `<th>`, so a narrow column must not produce
  a narrow or clipped editor.

### Table-header style isolation

Native popovers remain descendants of their trigger's DOM location even while rendered in the top
layer. Therefore the popover cannot rely only on inherited values from `ms-popover-panel`.

- Establish the filter and sort panel's own `font-family`, `font-size`, `font-weight`,
  `line-height`, `color`, `text-align`, `white-space`, and direction-aware layout values from
  ui-lib tokens.
- Explicitly restore normal body/control typography so `.table thead th` font weight, muted color,
  alignment, text transforms, or whitespace rules do not spill into the popover.
- Ensure projected form controls, labels, buttons, options, chips, validation messages, and sort
  rows use their component styles rather than inherited `<th>` presentation.
- Do not use a broad reset such as `all: unset`; preserve native semantics, focus behavior, Popover
  API behavior, and design-token inheritance.
- Keep table selectors narrow. Do not add rules such as `.table th *` that style arbitrary
  descendants and would cross into a popover.
- Verify the same popover appearance from start-aligned, end-aligned, numeric, compact, default,
  LTR, and RTL headers.

## Accessibility

- Keep native `<table>`, `<thead>`, `<tr>`, and `<th scope="col">` semantics consumer-owned.
- Both icon-only triggers are native buttons with accessible names independent of their symbols:
  `Filter {column label}` and `Edit table sorting`.
- Trigger buttons expose `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` through the
  existing popover primitives. Active filters and sorts have a textual state description.
- An invalid required-filter trigger exposes `aria-invalid="true"` and `aria-describedby` pointing
  to a stable visually hidden error message such as `{column label} filter is required`. Danger
  color and filled icon treatment supplement this text and never carry the error alone.
- Decorative Material Symbols use `aria-hidden="true"`.
- Give each panel `role="dialog"` and a stable accessible name through `aria-labelledby` or
  `aria-label`. These are non-modal popovers; do not expose them as menus or modal dialogs.
- Expose `aria-sort="ascending"` or `aria-sort="descending"` on only the header for the primary
  active sort. Omit `aria-sort` from unsorted and secondary-sort headers because the ARIA attribute
  cannot express multi-sort precedence.
- For every active sort, include its direction and one-based priority in the sort trigger's
  accessible description. The primary header's `aria-sort` supplements this complete multi-sort
  description rather than replacing it.
- Opening a popover moves focus to its first meaningful editor control. Clear filter and Apply
  return focus to the opening trigger. Light dismiss and Escape follow the existing popover focus
  contract.
- All labels are programmatically connected to controls. Validation messages are associated with
  invalid controls.
- Keyboard users can add, remove, edit, and reorder sorts without dragging.
- Drag state and reordered positions are announced without relying on movement or color alone.
- Disabled triggers use native disabled behavior and are removed from the tab order.
- Focus rings remain visible against both the table header and popover surface.
- At browser zoom and narrow viewport widths, the actions remain reachable through horizontal table
  scrolling and neither button is clipped.

## Showcase

Maintain the dedicated table-search showcase and its copyable standalone example.
Keep the latest-applied-request preview uncapped with `max-block-size: none` so the complete applied
payload remains visible.

Add live examples for:

- string filtering with scalar and value-less operators
- integer, long, and decimal comparison, `between`, and custom `in` filtering
- date, time, and date-time filtering, with vertically stacked native date-time range controls
- boolean filtering
- enum `in` filtering
- GUID validation and custom `in` filtering
- local consumer-side filtering and ordered sorting of the displayed showcase rows after Apply,
  proving the emitted request without moving data processing into the reusable directive
- applied-filter trigger state and Clear filter
- a required filter initialized without a usable value, its danger trigger and accessible error,
  blocked request actions, and the valid state after correction
- ordered multi-sort with add, remove, direction change, drag reorder, keyboard reorder, Cancel,
  Clear, and Apply
- primary `aria-sort` plus accessible priority and direction descriptions for secondary sorts
- Clear followed by Apply emitting a request without `sort`, while retaining `state.sort` as `[]`
- disabled controls
- compact table density
- a deliberately narrow table wrapper demonstrating label ellipsis, persistent actions, horizontal
  scrolling, and full-width top-layer popovers
- a logical-end numeric header proving `<th>` styles do not spill into either popover
- nested `ms-select` and custom-value interactions that remain inside the owning editor without
  dismissing it or losing its draft
- RTL header controls and popovers

Use `ShowcaseCode` from `src/app/shared/showcase-code`. Keep snippets hand-authored in the tables
feature `.ts` file, import reusable APIs through `./shared/ui-lib`, and keep the live behavior and
copyable standalone component example synchronized. Render the snippet immediately after the
matching table example.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit change-detection
  metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals, `input`, `output`, `model`, `computed`, and `effect`.
- Prefer `inject()` over constructor injection.
- Prefer component `host` metadata over host decorators.
- Use native template control flow.
- Use Angular signal forms with `[formField]` for filter and sort drafts.
- Define validation with `schema(...)` helpers; do not combine `[formField]` with native validation
  attributes such as `required`, `minlength`, or `pattern`.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Implementation Plan

1. Extract the shared search domain and required/default reconciliation from
   `SearchQueryFormComponent`, preserve all wire values, and wire compatibility barrels without
   duplicate root exports.
2. Implement `TableSearchDirective` as the single owner of normalized configuration, reconciled
   applied state, validation status, atomic commits, and request emission.
3. Implement `TableSearchColumnComponent` on the native `<th>` host, including projected label,
   persistent filter/sort triggers, active/error presentation, and parent configuration lookup.
4. Implement the internal filter editor with the shared data-type/operator/value controls,
   signal-form validation, transactional draft, deterministic Clear/Apply behavior, and required
   filter error handling.
5. Implement the internal ordered sort editor with unique properties, direction selection,
   limits, Cancel/Clear/Apply behavior, pointer drag, keyboard reorder, and live announcements.
6. Complete controlled popover lifecycle, nested-popover behavior, stale-draft protection, focus
   management, and multi-sort accessibility semantics.
7. Add token-based isolated styles, narrow-column minimum sizing and scrolling, RTL behavior,
   `drag_indicator` icon registration, public exports, and a synchronized table-search showcase.
8. Format and build the project, then manually verify keyboard, focus, nested popovers, required
   errors, narrow/high-zoom layouts, style isolation, compact density, and RTL behavior.

## Verification

- Run Prettier on every changed source and context file and confirm the formatting check passes.
- Run `npm run build` and resolve Angular template, strict TypeScript, style, and bundle errors.
- Manually verify filter and sort draft transactions, request payloads, required-filter blocking,
  explicit empty sorts, external-state reconciliation, and disabled-while-open behavior.
- Manually verify pointer and keyboard reorder, live announcements, primary `aria-sort`, secondary
  sort descriptions, trigger-to-panel focus flow, Escape/light dismiss, and focus restoration.
- Manually verify nested selectors, viewport-constrained panels, sticky actions, narrow columns,
  horizontal table scrolling, high zoom, compact density, LTR, RTL, and `<th>` style isolation.
- Do not add or update automated tests, following the repository instruction for this feature.

## Acceptance Criteria

- A single `table[msTableSearch]` directive owns table-level properties, sort configuration,
  applied state, and request emission.
- Each `th[msTableSearchColumn]` resolves its property from the nearest parent directive and
  preserves the native `<th>` host and projected header content.
- Every configured table header renders a filter icon button and, when valid sorting is configured,
  a separate sort icon button.
- The filter popover supports every existing `SearchDataType` with the same compatible operators,
  defaults, validation, request values, and value-less behavior as `ms-search-query-form`.
- Clear filter removes only a removable current-column filter and emits one updated request;
  required and locked filters cannot be cleared.
- Apply commits valid filter drafts and emits one updated request; dismissing discards drafts.
- Required filters and configured default sorts are reconciled into `state` exactly as they are for
  `ms-search-query-form`, without emitting `requestChange` during reconciliation.
- A missing, incomplete, or invalid required filter renders a danger-state filter trigger with
  accessible error semantics and prevents every request-emitting action until a valid candidate
  state is available.
- The sort popover edits a complete ordered multi-sort list and enforces unique properties and
  `maxSorts`.
- Sort Cancel discards the draft, Clear empties only the draft without emitting, and Apply commits
  and emits the draft, including explicit `sort: []` after Clear.
- Sort rows can be reordered with pointer drag and keyboard commands, and order determines sort
  precedence.
- The primary sorted header exposes `aria-sort`; all active sort priorities and directions remain
  available through accessible trigger descriptions.
- Applying sort emits the existing backend-compatible request shape without fetching data.
- Shared search types, operators, helpers, and wire values have one source of truth used by both
  search UIs.
- Existing root ui-lib imports remain compatible after the shared search-domain extraction.
- Public APIs are exported from the relevant folder and root barrels without duplicate ambiguous
  exports.
- The feature composes existing ui-lib popover, form-field, select, chip, button, and icon APIs.
- The sort drag handle uses the registered `drag_indicator` icon.
- Styles are token-based, enterprise-dense, responsive, and RTL-safe.
- Narrow searchable columns truncate only the visual label; filter and sort buttons remain visible,
  non-overlapping, and reachable through the table wrapper's horizontal scrolling.
- Popover size and placement remain independent of the triggering column width.
- `<th>` typography, color, alignment, text-transform, and whitespace styles do not spill into
  either popover or its nested controls.
- Both popovers are keyboard operable, correctly labelled, focus-managed, and screen-reader
  understandable.
- Opening and dismissing a nested select or custom-value popover does not dismiss the owning editor
  or discard its draft.
- The table-search showcase demonstrates every supported data type, every compatible operator
  family, applied local filtering and sorting, applied states, multi-sort reordering, compact
  density, RTL, and table-header style isolation with a matching copyable snippet.
- No wrapper table component, programmatic DOM-rendering directive, data fetching, Angular CDK
  dependency, or tests are added.
