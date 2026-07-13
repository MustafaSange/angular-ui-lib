# Feature 040: Search Query Form

## Goal

Create a reusable search-query form that renders filter controls and optional ordered sorting from
configuration and emits a backend-compatible `PaginatedSearchRequest`.

The form maps to the backend `.NET` search library at:

`/Users/msange/Documents/Sandbox/DotNet/DotNetSolutionApp/Shared/Search`

The component should let consumers describe searchable and sortable properties once, then allow
users to add, remove, clear, reset, and edit filters and sorts without exposing SQL details. The generated
request must match the backend request shape used by `PaginatedSearchRequest`,
`SearchFilterRequest`, and `SearchSortRequest`.

## Non-Goals

- Do not generate SQL, SQL column names, `WHERE` clauses, `ORDER BY` clauses, stored procedure
  parameters, or `FilterValuesJson` in the frontend.
- Do not expose backend `SqlColumnName` or any trusted database metadata to frontend consumers.
- Do not replace backend validation; frontend validation is for user experience only.
- Do not fetch data, manage routes, or couple the component to a specific API endpoint.
- Do not implement result-table rendering in this feature.
- Do not implement server-side saved searches or advanced query groups.

## Public API

Import search-query form APIs from the folder barrel:

```ts
import {
  SEARCH_SORT_DIRECTION,
  SearchQueryFormComponent,
  buildSearchRequest,
  createDateOnly,
  createTimeOnly,
  createTodayDateTimeRange,
  getDefaultSearchOperator,
  type PaginatedSearchRequest,
  type SearchDataType,
  type SearchDateTimeRange,
  type SearchFilterRequest,
  type SearchOperator,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchSortConfig,
  type SearchSortDirection,
  type SearchSortOption,
  type SearchSortRequest,
} from '../../shared/ui-lib';
```

Public pieces:

- `SearchQueryFormComponent` with selector `ms-search-query-form`.
- `SearchPropertyConfig` defines each filterable field.
- `SearchQueryFormState` is the parent-owned editable form state.
- `SearchSortConfig` configures the available sort properties, ordered defaults, and active-sort
  limit.
- `SearchSortOption` describes one property shown in the multiple sort selector.
- `PaginatedSearchRequest`, `SearchFilterRequest`, and `SearchSortRequest` match the backend API
  payload.
- `SearchDataType`, `SearchOperator`, `SEARCH_SORT_DIRECTION`, and `SearchSortDirection` mirror
  backend enum concepts in a frontend-safe shape without unexplained numeric literals.
- `getDefaultSearchOperator` returns the data-type default operator when a property does not define
  one.
- `buildSearchRequest` converts form state into the backend-compatible request payload.
- `createDateOnly` returns a local-date string formatted as `YYYY-MM-DD`.
- `createTimeOnly` returns a time string formatted as `HH:mm:ss`.
- `createTodayDateTimeRange` returns today's local full-day datetime-local range.
- `SearchDateTimeRange` describes `{ from, to }` datetime-local range helper output.

Required API:

```ts
type SearchDataType =
  | 'string'
  | 'int'
  | 'long'
  | 'decimal'
  | 'date'
  | 'time'
  | 'dateTime'
  | 'boolean'
  | 'enum'
  | 'guid';

type SearchOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'isNull'
  | 'isEmpty'
  | 'isNullOrEmpty'
  | 'isNotNull'
  | 'isNotEmpty'
  | 'isNotNullOrEmpty';

const SEARCH_SORT_DIRECTION = {
  ASCENDING: 0,
  DESCENDING: 1,
} as const;

type SearchSortDirection = (typeof SEARCH_SORT_DIRECTION)[keyof typeof SEARCH_SORT_DIRECTION];

interface SearchSortOption {
  label: string;
  value: string;
}

type SearchScalarValue = string | number | boolean;

interface SearchBetweenValue {
  from: SearchScalarValue | null;
  to: SearchScalarValue | null;
}

type SearchRequestValue = SearchScalarValue | readonly SearchScalarValue[] | SearchBetweenValue;

interface SearchPropertyOption {
  label: string;
  value: SearchScalarValue;
}

interface SearchPropertyConfigBase {
  propertyName: string;
  label?: string;
  required?: boolean;
  visibleByDefault?: boolean;
  placeholder?: string;
  allowCustomInValues?: boolean;
  maxInValues?: number;
}

type SearchPropertyConfig =
  | SearchStringPropertyConfig
  | SearchNumericPropertyConfig
  | SearchDatePropertyConfig
  | SearchBooleanPropertyConfig
  | SearchEnumPropertyConfig
  | SearchGuidPropertyConfig;

interface SearchQueryFormFilter {
  id: string;
  property: string;
  operator: SearchOperator;
  value: SearchRequestValue | null;
  locked?: boolean;
}

interface SearchQueryFormState {
  page?: number;
  limit?: number;
  filters: readonly SearchQueryFormFilter[];
  sort?: readonly SearchSortRequest[];
}

interface PaginatedSearchRequest {
  page?: number;
  limit?: number;
  filters?: readonly SearchFilterRequest[];
  sort?: readonly SearchSortRequest[];
}

interface SearchFilterRequest {
  property: string;
  operator: SearchOperator;
  value: SearchRequestValue | null;
}

interface SearchSortRequest {
  property: string;
  direction: SearchSortDirection;
}

interface SearchSortConfig {
  sortOptions: readonly SearchSortOption[];
  defaultSorts?: readonly SearchSortRequest[];
  maxSorts?: number;
}

class SearchQueryFormComponent {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly maxFilters = input(10);
  readonly sortConfig = input<SearchSortConfig | null>(null);
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();
}

function getDefaultSearchOperator(dataType: SearchDataType): SearchOperator;

function buildSearchRequest(state: SearchQueryFormState): PaginatedSearchRequest;
```

`SearchPropertyConfig` is a strict discriminated union. Each variant narrows `dataType`,
`defaultOperator`, `defaultValue`, `allowedOperators`, and `options` to compatible values.
`maxStringLength` exists only on the string variant, while `booleanLabels` exists only on the
boolean variant.

Defaults:

- omitted `state.filters` defaults to an empty list
- omitted `state.page` is not emitted unless supplied by the parent
- omitted `state.limit` is not emitted unless supplied by the parent
- omitted `state.sort` is initialized from configured defaults when sorting is enabled; an explicit
  empty array represents no active sorts and is omitted by `buildSearchRequest`
- omitted `SearchPropertyConfig.label` displays `propertyName`
- omitted `SearchPropertyConfig.required` defaults to `false`
- omitted `SearchPropertyConfig.visibleByDefault` defaults to `false`; optional properties marked
  `true` are restored with their configured operator/value by Reset defaults
- omitted `SearchPropertyConfig.maxStringLength` defaults to `50` for `string` values
- supplied `SearchPropertyConfig.maxStringLength` is capped at `50` for `string` values
- omitted `SearchPropertyConfig.allowCustomInValues` defaults to `false`
- omitted `SearchPropertyConfig.maxInValues` defaults to `50`; the limit counts selected options
  and custom values together
- omitted `SearchPropertyConfig.defaultOperator` falls back to the data-type default operator
- omitted `SearchPropertyConfig.defaultValue` uses an empty value for the selected data type and
  operator
- omitted `SearchQueryFormComponent.maxFilters` defaults to `10`
- invalid `maxFilters` values fall back to `10`; finite values are truncated and clamped to at
  least `1`
- required properties count toward the limit and raise the effective minimum when their count is
  greater than the configured limit
- omitted `SearchQueryFormComponent.sortConfig` hides all sorting UI and emits no sort
- empty `SearchSortConfig.sortOptions` hides all sorting UI
- omitted `SearchSortConfig.defaultSorts` falls back to the first valid sort option ascending
- omitted or invalid `SearchSortConfig.maxSorts` defaults to `1`; finite values are truncated,
  clamped to at least `1`, and capped by the number of unique valid sort options
- invalid and duplicate sort options/defaults are removed during reconciliation while preserving
  the configured order

Data-type default operators:

| Data type                  | Default operator |
| -------------------------- | ---------------- |
| `string`                   | `contains`       |
| `int`, `long`, `decimal`   | `between`        |
| `date`, `time`, `dateTime` | `between`        |
| `boolean`                  | `eq`             |
| `enum`                     | `eq`             |
| `guid`                     | `eq`             |

Backend enum mapping:

| Frontend value       | Backend equivalent                |
| -------------------- | --------------------------------- |
| `'string'`           | `SearchDataType.String`           |
| `'int'`              | `SearchDataType.Int`              |
| `'long'`             | `SearchDataType.Long`             |
| `'decimal'`          | `SearchDataType.Decimal`          |
| `'date'`             | `SearchDataType.Date`             |
| `'time'`             | `SearchDataType.Time`             |
| `'dateTime'`         | `SearchDataType.DateTime`         |
| `'boolean'`          | `SearchDataType.Boolean`          |
| `'enum'`             | `SearchDataType.Enum`             |
| `'guid'`             | `SearchDataType.Guid`             |
| `'eq'`               | `SearchOperator.Eq`               |
| `'neq'`              | `SearchOperator.Neq`              |
| `'contains'`         | `SearchOperator.Contains`         |
| `'startsWith'`       | `SearchOperator.StartsWith`       |
| `'endsWith'`         | `SearchOperator.EndsWith`         |
| `'gt'`               | `SearchOperator.Gt`               |
| `'gte'`              | `SearchOperator.Gte`              |
| `'lt'`               | `SearchOperator.Lt`               |
| `'lte'`              | `SearchOperator.Lte`              |
| `'between'`          | `SearchOperator.Between`          |
| `'in'`               | `SearchOperator.In`               |
| `'isNull'`           | `SearchOperator.IsNull`           |
| `'isEmpty'`          | `SearchOperator.IsEmpty`          |
| `'isNullOrEmpty'`    | `SearchOperator.IsNullOrEmpty`    |
| `'isNotNull'`        | `SearchOperator.IsNotNull`        |
| `'isNotEmpty'`       | `SearchOperator.IsNotEmpty`       |
| `'isNotNullOrEmpty'` | `SearchOperator.IsNotNullOrEmpty` |
| `0`                  | `SearchSortDirection.Asc`         |
| `1`                  | `SearchSortDirection.Desc`        |

## Desired Usage

```ts
import { Component, computed, signal } from '@angular/core';

import {
  SEARCH_SORT_DIRECTION,
  SearchQueryFormComponent,
  buildSearchRequest,
  createTodayDateTimeRange,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchSortConfig,
} from './shared/ui-lib';

const todayCreatedAtRange = createTodayDateTimeRange();

@Component({
  selector: 'app-user-search-example',
  imports: [SearchQueryFormComponent],
  template: `
    <ms-search-query-form
      [properties]="properties"
      [maxFilters]="15"
      [sortConfig]="sortConfig"
      [(state)]="searchState"
      (requestChange)="request.set($event)"
    />

    <pre>{{ requestJson() }}</pre>
  `,
})
export class UserSearchExample {
  readonly sortConfig: SearchSortConfig = {
    sortOptions: [
      { label: 'Name', value: 'name' },
      { label: 'Created At', value: 'createdAt' },
      { label: 'Status', value: 'status' },
    ],
    defaultSorts: [
      { property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING },
      { property: 'createdAt', direction: SEARCH_SORT_DIRECTION.DESCENDING },
    ],
    maxSorts: 3,
  };

  readonly properties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'tenantId',
      label: 'Tenant',
      dataType: 'guid',
      required: true,
      defaultOperator: 'eq',
      defaultValue: 'f2c09089-f857-4c42-857d-1c48e89f1107',
      allowedOperators: ['eq'],
    },
    {
      propertyName: 'name',
      label: 'Name',
      dataType: 'string',
      defaultOperator: 'contains',
      allowCustomInValues: true,
      maxInValues: 50,
      maxStringLength: 50,
    },
    {
      propertyName: 'status',
      label: 'Status',
      dataType: 'enum',
      visibleByDefault: true,
      defaultOperator: 'in',
      defaultValue: ['Active'],
      allowCustomInValues: true,
      maxInValues: 50,
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Blocked', value: 'Blocked' },
      ],
    },
    {
      propertyName: 'department',
      label: 'Department',
      dataType: 'enum',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      options: [
        { label: 'Engineering', value: 'ENG' },
        { label: 'Finance', value: 'FIN' },
        { label: 'Operations', value: 'OPS' },
      ],
    },
    {
      propertyName: 'createdAt',
      label: 'Created at',
      dataType: 'dateTime',
      visibleByDefault: true,
      defaultOperator: 'between',
      defaultValue: todayCreatedAtRange,
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
  ];

  readonly searchState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'department-in',
        property: 'department',
        operator: 'in',
        value: ['ENG', 'OPS'],
      },
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
    ],
    sort: [
      { property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING },
      { property: 'createdAt', direction: SEARCH_SORT_DIRECTION.DESCENDING },
    ],
  });
  readonly request = signal(buildSearchRequest(this.searchState()));
  readonly requestJson = computed(() => JSON.stringify(this.request(), null, 2));
}
```

Example request emitted after a required tenant filter and a user-added status filter:

```json
{
  "filters": [
    {
      "property": "tenantId",
      "operator": "eq",
      "value": "f2c09089-f857-4c42-857d-1c48e89f1107"
    },
    {
      "property": "status",
      "operator": "eq",
      "value": "Active"
    }
  ],
  "sort": [
    { "property": "name", "direction": 0 },
    { "property": "createdAt", "direction": 1 }
  ]
}
```

Example filter-only request when sorting is not configured and the `status` enum uses `in`, the
user selects the configured `Active` option, and adds the custom `Escalated` value:

```json
{
  "filters": [
    {
      "property": "status",
      "operator": "in",
      "value": ["Active", "Escalated"]
    }
  ]
}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/search-query-form`:

- `SearchQueryFormComponent` coordinates signal-form state, filter interactions, compact multi-sort
  selection, Clear filters, Reset defaults, and Search actions.
- `search-query-form-types.ts` defines form state, property config, request, response, value, and
  operator types.
- `search-query-form-model.ts` defines private editable filter/sort form models.
- `search-query-form-sort.ts` normalizes sort options, limits, defaults, directions, and ordered
  request values.
- `search-query-form-value.ts` owns typed input metadata, parsing, validation, and custom-value
  status formatting.
- `search-query-form-equality.ts` performs typed state, filter, nested-value, form-model, and ordered
  sort comparisons without JSON serialization.
- `search-query-form-operators.ts` defines data-type default operators and compatible operators.
- `search-query-form-builder.ts` converts valid form state to `PaginatedSearchRequest`.
- `search-query-form-date-time.ts` exposes reusable date-only, time-only, and today full-day
  datetime-local range helpers.
- `index.ts` exposes the public API.

The model, sort, value, and equality modules are component internals and are intentionally not
re-exported from `index.ts`.

The component renders a native `<form>` containing zero or more signal-form-backed grid rows and a
bottom toolbar for adding filters and sorts, clearing optional filters, restoring configured defaults,
and submitting search. Each row contains:

- a property selector bound with `[formField]`
- an operator selector bound with `[formField]`
- one value editor, or a `from` and `to` value editor for `between`, bound with `[formField]`
- a dedicated action column that renders a delete button for optional rows and reserved empty space
  for required rows

The add-filter picker is rendered inside `ms-signal-form-field.add-filter.no-message` so it keeps
the shared compact control treatment without reserving a message row in the toolbar.

Sorting is optional. When `sortConfig.sortOptions` contains valid options, the toolbar renders a
non-searchable multiple `ms-select`. Active sorts use the select's removable chips and a custom
selected-option template. Each chip shows the property, registered `arrow_upward` or
`arrow_downward` icon, and `ASC` or `DESC`; its direction button toggles the direction. Chip order is
request priority. The active/max sort count is rendered in the Sort by label-extra area.

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are
`.search-query-form`, `.filter-list`, `.filter-row`, `.filter-property`, `.filter-operator`,
`.filter-value`, `.in-values`, `.in-values-control`, `.in-values-preview`,
`.custom-values-editor`, `.custom-values-list`, `.filter-actions`, `.filter-toolbar`,
`.add-filter`, `.add-sort`, `.sort-direction-toggle`, `.toolbar-actions`, `.search-filters`,
`.clear-filters`, `.reset-filters`, and `.remove-filter`.

## Behavior

- By default, the form displays no filter rows.
- On initialization and whenever `properties` changes, every config with `required: true` must be
  displayed automatically.
- Required filters are locked and cannot be deleted by the row delete action.
- Required filters do not display a required chip, badge, or delete button.
- Required filters still reserve the action column so all rows align.
- Required filters use `defaultValue` when supplied.
- Required filters use `defaultOperator` when supplied; otherwise they use the data-type default
  operator.
- Optional filters are displayed only when the user selects them through the add action or when
  they already exist in parent-owned `state`.
- The component allows at most `maxFilters` total rows, counting required and optional filters.
- Required rows are reconciled first and never dropped. Oversized parent state retains optional
  filters in original order only while slots remain.
- The Add picker is disabled and exposes no remaining properties after the effective limit is
  reached. Its label displays the current and maximum filter count.
- The editable filter row model is managed with Angular signal forms.
- All rendered filter controls are bound with `[formField]`.
- Required, disabled, and max-length rules are defined through the signal-form schema.
- The `in` operator requires at least one configured option or custom value.
- Native validation attributes such as `required` and `maxlength` are not placed on controls that
  use `[formField]`.
- The add action opens or displays a property picker containing filterable properties not already
  present in the current state.
- Adding a property creates a filter row using that property config.
- Added filters use `defaultValue` when supplied.
- Added filters use `defaultOperator` when supplied; otherwise they use the data-type default
  operator.
- If a property config defines `allowedOperators`, the operator selector shows only those
  operators.
- If a property config does not define `allowedOperators`, the operator selector shows operators
  compatible with the property data type.
- Hide `in` when a property has neither configured options nor `allowCustomInValues: true`.
- If the current operator becomes invalid after a property change, reset it to the property default
  operator.
- If the current value shape does not match the new operator, reset it to the property default
  value or the empty value for the new data type and operator.
- The delete action removes optional filter rows.
- The delete action is hidden or disabled for required filter rows.
- Clear filters removes every optional filter row.
- Clear filters keeps every required filter row.
- Clear filters resets required filters to their configured `defaultOperator` and
  `defaultValue`.
- Clear filters must never delete a filter whose property config has `required: true`.
- If all current filters are optional, Clear filters returns the form to the default empty state.
- Reset defaults is rendered only when at least one optional property has
  `visibleByDefault: true`.
- Reset defaults rebuilds required properties first, followed by optional `visibleByDefault`
  properties while slots remain under `maxFilters`.
- Reset defaults restores every rebuilt property's configured `defaultOperator` and `defaultValue`
  and restores configured default sorts.
- Clear filters, Reset defaults, and Search update only the editable form model until explicit
  Search submission commits parent-owned state and emits `requestChange`.
- Changing any property, operator, or value updates the internal signal-form model.
- Parent-owned `state` is reconciled from parent input and committed from the current form model on
  explicit search submission.
- Changing filter state does not emit `requestChange`.
- The search action submits the form and emits `requestChange` with `buildSearchRequest`.
- The search action is disabled while the signal form is invalid or pending.
- Every rendered filter property, operator, and value control is required.
- Invalid or incomplete filters remain visible in `state` and prevent search submission until they
  contain a value compatible with their data type and operator.

Sort behavior:

- Sort controls are hidden when `sortConfig` is absent or has no valid `sortOptions`.
- The multiple sort selector lists all valid configured sort properties.
- At `maxSorts`, unselected sort options are disabled while selected options remain removable.
- Selecting a property adds it ascending and creates one compact `ms-select` chip.
- Selection changes retain the current direction of existing properties and preserve selected chip
  order as backend sort priority.
- Clicking the chip direction control toggles `ASC` and `DESC`; the accessible name and tooltip use
  the full direction names.
- Removing a chip removes that active sort, including the final sort. Explicitly empty sort state is
  preserved and omitted from `PaginatedSearchRequest`.
- Sort properties are unique. Active sort array/chip order determines backend priority.
- Invalid, duplicate, and over-limit parent sorts are removed while valid sort order is retained.
- Clear filters and Reset defaults restore `defaultSorts`; when none are configured, they restore
  the first valid option ascending.
- Sort changes update the internal form model but emit only on explicit Search, like filter changes.

Operator behavior:

- `between` renders two controls labeled `From` and `To`.
- `between` emits a value object shaped as `{ "from": value, "to": value }`.
- `between` validates each endpoint with the property datatype rules and requires `To` to be
  greater than or equal to `From` for numeric, date, time, and datetime values.
- Option-only `in` renders the compact multiple `ms-select` directly in the Values field.
- Custom-enabled `in` renders a readonly combined preview with up to three option and custom chips,
  followed by plain `+N more` text.
- Every visible combined-preview chip is removable. Option removal updates `ms-select`; custom
  removal updates only the custom-value list.
- The custom-values trigger opens a popover directly below the Values form control at its logical
  inline start, with the same width. When options exist, their `ms-select` is rendered inside the
  popover.
- The popover supports manual entry, programmatic clipboard paste, native Ctrl/Cmd+V paste,
  individual custom removal, custom-only clear, and a current/maximum value count.
- Programmatic paste is disabled when clipboard reading is unavailable. Native paste remains
  available and uses the same parsing pipeline.
- Add and programmatic Paste are disabled when the combined option/custom limit is reached.
- Configured-option changes are capped against the same combined limit; request emission never
  silently drops visible selections.
- Opening the popover focuses the custom input; closing restores focus to the trigger.
- The custom-values trigger uses the primary button treatment whenever any option or custom value
  is selected.
- Pasted custom values split on newline, comma, semicolon, and tab. Values are trimmed, deduplicated
  against both sources, and capped by `maxInValues`.
- Custom `string` and `enum` values remain strings; `guid` requires a canonical GUID; `int` and
  `long` require safe integers; `decimal` requires a finite number.
- Invalid manual GUID, integer, decimal, and over-length string values show an inline accessible
  validation message and disable Add. Invalid or over-length pasted values are skipped and
  summarized.
- The emitted `in` value is one deduplicated scalar array combining selected options and custom
  values.
- Incoming `in` arrays use the same typing, validation, deduplication, configured-option, and
  `maxInValues` normalization rules before they reach editable form state.
- Valueless operators hide value controls, skip value validation, retain `null` state, and emit
  `value: null`.
- Non-`between` operators render a single value control.
- Operator compatibility must match the backend:

| Data type                  | Compatible operators                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `string`                   | `eq`, `neq`, `contains`, `startsWith`, `endsWith`, `in`, `isNull`, `isEmpty`, `isNullOrEmpty`, `isNotNull`, `isNotEmpty`, `isNotNullOrEmpty` |
| `int`, `long`, `decimal`   | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `in`, `isNull`, `isNotNull`                                                                |
| `date`, `time`, `dateTime` | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `in`, `isNull`, `isNotNull`                                                                |
| `boolean`                  | `eq`, `neq`, `isNull`, `isNotNull`                                                                                                           |
| `enum`, `guid`             | `eq`, `neq`, `in`, `isNull`, `isNotNull`                                                                                                     |

Value editor behavior:

- `string` renders a text input validated by the signal-form schema with the smaller value of
  `maxStringLength` and `50`.
- String values must not exceed `50` characters.
- `int` and `long` render numeric integer inputs.
- `decimal` renders a numeric decimal input.
- `date` renders a date input.
- `time` renders a time input.
- `dateTime` renders a datetime-local input.
- `time` and `dateTime` inputs use a `step` of `1` so seconds-level values are valid.
- `boolean` renders a dropdown with `true` and `false` choices.
- `enum` renders a dropdown when `options` exist.
- `guid` renders a text input.
- Scalar and custom `guid`, `int`, `long`, `decimal`, `date`, `time`, and `dateTime` values use the
  same datatype rules. Invalid scalar text is retained, displays a specific error, and prevents
  search submission until corrected.
- Custom `in` entry uses native `number`, `date`, `time`, or `datetime-local` controls when those
  data types are selected. Integer values still reject decimal input such as `1.2`.
- Any property with `options` renders a dropdown for single-value operators.
- Any property with `options` renders a multi-select dropdown for the `in` operator.
- `SearchPropertyOption.label` is rendered in dropdown options and selected chips, while
  `SearchPropertyOption.value` is retained in form state and emitted requests. For example,
  Engineering/Operations labels can emit `ENG`/`OPS` values.
- Multiple-select chips remain on one compact line inside the 28px form-field control.
- Input values must be converted to the backend JSON-compatible shape before emission.

## Backend Mapping

| Backend file                               | Frontend equivalent                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `Models/PaginatedSearchRequest.cs`         | emitted `PaginatedSearchRequest`, `SearchFilterRequest`, `SearchSortRequest`                           |
| `Models/ValidatedSearchRequest.cs`         | no direct UI model; backend remains authoritative                                                      |
| `Models/PaginatedResponse.cs`              | `PaginatedResponse<T>` response type if exported with this feature                                     |
| `Configuration/SearchPropertyConfig.cs`    | frontend-safe `SearchPropertyConfig` without `SqlColumnName`, `CanFilter`, or custom backend functions |
| `Configuration/SearchValidationOptions.cs` | optional future validator options; not required for v1 form rendering                                  |
| `Enums/SearchDataType.cs`                  | `SearchDataType`                                                                                       |
| `Enums/SearchOperator.cs`                  | `SearchOperator`                                                                                       |
| `Enums/SearchSortDirection.cs`             | `SearchSortDirection`                                                                                  |
| `Validation/SearchRequestValidator.cs`     | frontend compatibility and value-shape checks only                                                     |
| `Validation/SearchValueConverter.cs`       | frontend input conversion only                                                                         |
| `Sql/SearchSqlBuilder.cs`                  | no frontend equivalent                                                                                 |
| `Models/StoredProcedureSearchCommand.cs`   | no frontend equivalent                                                                                 |

## Projection and Composition Rules

- Consumers provide property configuration through the required `properties` input.
- Consumers own state through `[(state)]`.
- Consumers may listen to `requestChange` to trigger API calls or synchronize query state.
- Consumers enable sorting with one `sortConfig` object containing `sortOptions`, optional
  `defaultSorts`, and optional `maxSorts`.
- Consumers may provide initial `state` with existing filters; the component must reconcile it with
  required filters from `properties` and valid configured sorts.
- Consumers should configure only API property names, never SQL column names.
- Consumers should keep backend property config authoritative; frontend config is a mirrored UX aid.
- Consumers must enforce an independent backend filter-count limit; the frontend input is a UX
  constraint and is not database protection.

## Styling

Feature styles live in:

`src/styles/components/_search-query-form.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, border, typography, motion, and focus rings
- use concise unprefixed internal CSS class hooks
- use logical block/inline CSS properties and logical placement terms
- keep rows as a single grid container so property, operator, value, and actions fit on desktop and stack cleanly
  on mobile
- render the filter toolbar below the filter rows
- keep the search-query surface padded with `--spacing-12`
- keep action buttons aligned to the block-end of the add-property control in the bottom toolbar
- let the toolbar action group fill the toolbar height so buttons align with compact form fields
- apply the shared one-border-width optical block-end nudge to the toolbar action group
- use the shared multiple `ms-select` for active sort chips instead of custom chip-list alignment
- keep sort chip internals compact through the select's selected-option template: property label,
  registered direction icon, `ASC`/`DESC`, and built-in remove action
- order actions logically as Clear filters, conditional Reset defaults, then primary Search so the
  primary action remains at the logical inline end in LTR and RTL layouts
- render Clear filters as ghost, Reset defaults as outline, and Search as primary
- keep required rows compact by hiding the delete action instead of rendering disabled controls
- use one Values grid column for option-only `in` and add the fixed trigger column only when custom
  values are enabled
- keep option, combined-preview, and custom chips compact and visually consistent through the
  primary-subtle selected treatment and primary border
- render action icons with `.ms-icon` or `.ms-icon-filled`
- add every new Material Symbols ligature name to `MATERIAL_ICONS`
- avoid hardcoded values when tokens exist

## Accessibility

- Render a semantic `<form>`.
- Every property selector, operator selector, and value input must have an accessible label.
- For `between`, label the two value controls as `From` and `To` with the property label included
  in the accessible name.
- Use native buttons for add, delete, clear, reset, and search actions.
- Icon-only buttons must have accessible names independent of the symbol.
- Required locked filters must communicate that they cannot be removed.
- Required locked filters must not render a misleading delete button.
- Validation or incomplete-value messages must be associated with their controls.
- Connect custom-value validation messages with `aria-describedby` and expose invalid input state
  with `aria-invalid`.
- Preserve visible focus indication on all interactive controls.
- Keyboard users must be able to add filters, change operators, enter values, delete optional
  filters, add/remove sorts, toggle sort direction, clear filters, reset defaults, and submit search.
- Sort direction controls use full accessible names and tooltips even though visible labels are
  abbreviated to `ASC` and `DESC`.
- Sort chips expose their current array order through the `ms-select` selection DOM order.

## Showcase

Add a dedicated `/search-query-form` page and home card demonstrating:

- empty default state with no filters displayed
- required filter displayed by default and protected from delete
- add optional string filter
- dropdown enum filter
- `between` date or datetime filter with `from` and `to`
- `in` filter with multiple dropdown selections
- option-only `in` with removable `ms-select` chips and distinct display labels/backend values
- mixed configured-option and custom `in` values with a combined preview
- custom-only string `in` values with first-three chips and `+N more`
- valid custom GUID, integer, and decimal `in` rows that remain available for inline validation
  demonstrations
- custom-value popover count, maximum-state disabling, native/programmatic paste, and clear-custom
- configurable `maxFilters` count and disabled Add state at the total filter limit
- optional `sortConfig` with unique sort options, ordered defaults, and configurable `maxSorts`
- compact active sort `ms-select` chips with direction toggle, built-in removal, active/max count,
  and request priority matching chip order
- Clear filters action that removes optional filters but keeps required filters
- Reset defaults action that restores required and `visibleByDefault` properties plus default sorts
- Reset defaults hidden when no optional property has `visibleByDefault: true`
- search action that emits `PaginatedSearchRequest`
- emitted `PaginatedSearchRequest` preview
- full showcase Created At defaults seeded through `createTodayDateTimeRange()` from local
  `00:00:00` to `23:59:59`

Showcase snippets should use `ShowcaseCode` from
`src/app/shared/ui-lib/components/showcase-code`.

Keep snippets hand-authored in the feature component `.ts` file and make each snippet a full
standalone Angular component example that users can copy/paste.

Render snippets near the matching visual example with `<app-showcase-code>`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection`
  metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Use signal forms for the generated filter controls.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public search-query form APIs are exported from the feature folder barrel.
- Public search-query form APIs are re-exported from the shared UI library barrel.
- Generated property, operator, and value controls are bound with `[formField]`.
- Required, disabled, and max-length validation are implemented through the signal-form schema.
- `ms-search-query-form` renders no filters by default when no property config is required.
- Properties with `required: true` render automatically.
- Required filters cannot be deleted.
- Required filters do not display a required chip or delete button.
- Clear filters removes optional filters and preserves required filters.
- Clear filters resets required filters to configured defaults.
- Reset defaults is hidden with zero optional `visibleByDefault` properties.
- Reset defaults restores required and `visibleByDefault` filters with configured defaults and
  restores default sorts.
- Add creates optional filters from the property config.
- `maxFilters` defaults to `10`, counts required and optional filters, and prevents optional filters
  from being added or reconciled beyond the effective limit.
- Sorting is hidden without valid `sortOptions`; `maxSorts` defaults to `1`, prevents duplicates,
  and caps active sorts by the unique option count.
- Default sorts initialize and reset the form in configured order; Clear filters and Reset defaults
  restore them.
- The multiple sort selector creates ascending chips, direction controls toggle `ASC`/`DESC`, and
  built-in chip removal supports an explicit empty sort list.
- Emitted `sort` remains an ordered `SearchSortRequest[]`; empty sort arrays are omitted from the
  paginated request.
- Delete removes optional filters.
- Operator dropdowns use configured `allowedOperators` or backend-compatible data-type operators.
- Missing `defaultOperator` falls back to the documented data-type default operator.
- `between` renders `from` and `to` controls and emits `{ from, to }`.
- `between` rejects malformed endpoints and reversed numeric or temporal ranges.
- Inputs match the selected property `dataType`.
- Properties with `options` render dropdown controls.
- Option labels are displayed while their distinct scalar values are preserved in state and emitted
  requests.
- Option-only `in` renders a compact direct multi-select without reserving a custom-trigger column.
- Custom-enabled `in` combines option and custom values in its readonly preview and emitted array.
- The combined preview shows at most three removable chips and a plain remaining-value count.
- Option values remain controlled by `ms-select`; custom deletion never removes configured options.
- Custom values are typed, trimmed, deduplicated, and capped by `maxInValues`, defaulting to `50`.
- Manual GUID, integer, decimal, and string-length validation is displayed accessibly before Add.
- Scalar GUID and numeric fields use the same canonical GUID, safe-integer, and finite-number rules.
- Clipboard and manual entry use the same custom-value parsing rules.
- String input length is capped at `50` characters.
- Filter edits do not auto-trigger `requestChange`.
- Search is disabled while any rendered filter control is invalid or pending.
- The explicit search action emits a request matching the backend `PaginatedSearchRequest` JSON
  contract.
- No frontend public API exposes SQL column names, SQL fragments, stored procedure command models,
  or `FilterValuesJson`.
- Styles use existing tokens, logical properties, and are forwarded from the components style
  index.
- Accessibility requirements are implemented.
- The `/search-query-form` showcase demonstrates core variants and renders matching copyable
  snippets.
- No tests are added or updated for this feature.
