# Feature 040: Search Query Form

## Goal

Create a reusable search-query form that renders filter controls from a search property
configuration and emits a backend-compatible `PaginatedSearchRequest`.

The form maps to the backend `.NET` search library at:

`/Users/msange/Documents/Sandbox/DotNet/DotNetSolutionApp/Shared/Search`

The component should let consumers describe searchable properties once, then allow users to add,
remove, clear, and edit filters without exposing SQL details. The generated request must match the
backend request shape used by `PaginatedSearchRequest`, `SearchFilterRequest`, and
`SearchSortRequest`.

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
  type SearchSortDirection,
} from '../../shared/ui-lib';
```

Public pieces:

- `SearchQueryFormComponent` with selector `ms-search-query-form`.
- `SearchPropertyConfig` defines each filterable field.
- `SearchQueryFormState` is the parent-owned editable form state.
- `PaginatedSearchRequest`, `SearchFilterRequest`, and `SearchSortRequest` match the backend API
  payload.
- `SearchDataType`, `SearchOperator`, and `SearchSortDirection` mirror backend enum concepts in a
  frontend-safe shape.
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
  | 'in';

type SearchSortDirection = 0 | 1;

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

interface SearchPropertyConfig {
  propertyName: string;
  label?: string;
  dataType: SearchDataType;
  required?: boolean;
  defaultOperator?: SearchOperator;
  defaultValue?: SearchRequestValue;
  allowedOperators?: readonly SearchOperator[];
  options?: readonly SearchPropertyOption[];
  placeholder?: string;
  maxStringLength?: number;
}

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
  value: SearchRequestValue;
}

interface SearchSortRequest {
  property: string;
  direction: SearchSortDirection;
}

class SearchQueryFormComponent {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();
}

function getDefaultSearchOperator(dataType: SearchDataType): SearchOperator;

function buildSearchRequest(state: SearchQueryFormState): PaginatedSearchRequest;
```

Defaults:

- omitted `state.filters` defaults to an empty list
- omitted `state.page` is not emitted unless supplied by the parent
- omitted `state.limit` is not emitted unless supplied by the parent
- omitted `state.sort` is not emitted unless supplied by the parent
- omitted `SearchPropertyConfig.label` displays `propertyName`
- omitted `SearchPropertyConfig.required` defaults to `false`
- omitted `SearchPropertyConfig.maxStringLength` defaults to `50` for `string` values
- supplied `SearchPropertyConfig.maxStringLength` is capped at `50` for `string` values
- omitted `SearchPropertyConfig.defaultOperator` falls back to the data-type default operator
- omitted `SearchPropertyConfig.defaultValue` uses an empty value for the selected data type and
  operator

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

| Frontend value | Backend equivalent          |
| -------------- | --------------------------- |
| `'string'`     | `SearchDataType.String`     |
| `'int'`        | `SearchDataType.Int`        |
| `'long'`       | `SearchDataType.Long`       |
| `'decimal'`    | `SearchDataType.Decimal`    |
| `'date'`       | `SearchDataType.Date`       |
| `'time'`       | `SearchDataType.Time`       |
| `'dateTime'`   | `SearchDataType.DateTime`   |
| `'boolean'`    | `SearchDataType.Boolean`    |
| `'enum'`       | `SearchDataType.Enum`       |
| `'guid'`       | `SearchDataType.Guid`       |
| `'eq'`         | `SearchOperator.Eq`         |
| `'neq'`        | `SearchOperator.Neq`        |
| `'contains'`   | `SearchOperator.Contains`   |
| `'startsWith'` | `SearchOperator.StartsWith` |
| `'endsWith'`   | `SearchOperator.EndsWith`   |
| `'gt'`         | `SearchOperator.Gt`         |
| `'gte'`        | `SearchOperator.Gte`        |
| `'lt'`         | `SearchOperator.Lt`         |
| `'lte'`        | `SearchOperator.Lte`        |
| `'between'`    | `SearchOperator.Between`    |
| `'in'`         | `SearchOperator.In`         |
| `0`            | `SearchSortDirection.Asc`   |
| `1`            | `SearchSortDirection.Desc`  |

## Desired Usage

```ts
import { Component, computed, signal } from '@angular/core';

import {
  SearchQueryFormComponent,
  buildSearchRequest,
  createTodayDateTimeRange,
  type SearchPropertyConfig,
  type SearchQueryFormState,
} from './shared/ui-lib';

const todayCreatedAtRange = createTodayDateTimeRange();

@Component({
  selector: 'app-user-search-example',
  imports: [SearchQueryFormComponent],
  template: `
    <ms-search-query-form
      [properties]="properties"
      [(state)]="searchState"
      (requestChange)="request.set($event)"
    />

    <pre>{{ requestJson() }}</pre>
  `,
})
export class UserSearchExample {
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
      maxStringLength: 50,
    },
    {
      propertyName: 'status',
      label: 'Status',
      dataType: 'enum',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Blocked', value: 'Blocked' },
      ],
    },
    {
      propertyName: 'createdAt',
      label: 'Created at',
      dataType: 'dateTime',
      defaultOperator: 'between',
      defaultValue: todayCreatedAtRange,
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
  ];

  readonly searchState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
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
  ]
}
```

Example request emitted when the `status` enum uses the `in` operator and the user selects
`Active` and `Pending`:

```json
{
  "filters": [
    {
      "property": "status",
      "operator": "in",
      "value": ["Active", "Pending"]
    }
  ]
}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/search-query-form`:

- `SearchQueryFormComponent` renders the signal-form-backed filter list, add, search, delete, and
  clear actions.
- `search-query-form-types.ts` defines form state, property config, request, response, value, and
  operator types.
- `search-query-form-operators.ts` defines data-type default operators and compatible operators.
- `search-query-form-builder.ts` converts valid form state to `PaginatedSearchRequest`.
- `search-query-form-date-time.ts` exposes reusable date-only, time-only, and today full-day
  datetime-local range helpers.
- `index.ts` exposes the public API.

The component renders a native `<form>` containing zero or more signal-form-backed grid rows and a
bottom toolbar for adding filters, clearing optional filters, and submitting search. Each row
contains:

- a property selector bound with `[formField]`
- an operator selector bound with `[formField]`
- one value editor, or a `from` and `to` value editor for `between`, bound with `[formField]`
- a dedicated action column that renders a delete button for optional rows and reserved empty space
  for required rows

The add-filter picker is rendered inside `ms-signal-form-field.add-filter.no-message` so it keeps
the shared compact control treatment without reserving a message row in the toolbar.

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are
`.search-query-form`, `.filter-list`, `.filter-row`, `.filter-property`, `.filter-operator`,
`.filter-value`, `.filter-actions`, `.filter-toolbar`, `.add-filter`, `.toolbar-actions`,
`.search-filters`, `.clear-filters`, and `.remove-filter`.

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
- The editable filter row model is managed with Angular signal forms.
- All rendered filter controls are bound with `[formField]`.
- Required, disabled, and max-length rules are defined through the signal-form schema.
- The `in` operator validates its selected values with a signal-form `minLength(1)` rule because an
  empty array is not considered empty by signal-form `required()`.
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
- If the current operator becomes invalid after a property change, reset it to the property default
  operator.
- If the current value shape does not match the new operator, reset it to the property default
  value or the empty value for the new data type and operator.
- The delete action removes optional filter rows.
- The delete action is hidden or disabled for required filter rows.
- The clear action removes every optional filter row.
- The clear action keeps every required filter row.
- The clear action resets required filters to their configured `defaultOperator` and
  `defaultValue`.
- The clear action must never delete a filter whose property config has `required: true`.
- If all current filters are optional, clear returns the form to the default empty state.
- Changing any property, operator, or value updates the internal signal-form model.
- Parent-owned `state` is reconciled from parent input and committed from the current form model on
  explicit search submission.
- Changing filter state does not emit `requestChange`.
- The search action submits the form and emits `requestChange` with `buildSearchRequest`.
- The search action is disabled while the signal form is invalid or pending.
- Every rendered filter property, operator, and value control is required.
- Invalid or incomplete filters remain visible in `state` and prevent search submission until they
  contain a value compatible with their data type and operator.

Operator behavior:

- `between` renders two controls labeled `From` and `To`.
- `between` emits a value object shaped as `{ "from": value, "to": value }`.
- `in` renders a multi-value control when options exist.
- `in` is intended for configured option sets in the current UI implementation.
- Non-`between` operators render a single value control.
- Operator compatibility must match the backend:

| Data type                  | Compatible operators                                    |
| -------------------------- | ------------------------------------------------------- |
| `string`                   | `eq`, `neq`, `contains`, `startsWith`, `endsWith`, `in` |
| `int`, `long`, `decimal`   | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `in`  |
| `date`, `time`, `dateTime` | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`        |
| `boolean`                  | `eq`, `neq`                                             |
| `enum`, `guid`             | `eq`, `neq`, `in`                                       |

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
- Any property with `options` renders a dropdown for single-value operators.
- Any property with `options` renders a multi-select dropdown for the `in` operator.
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
- Consumers may provide initial `state` with existing filters; the component must reconcile it with
  required filters from `properties`.
- Consumers should configure only API property names, never SQL column names.
- Consumers should keep backend property config authoritative; frontend config is a mirrored UX aid.

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
- keep required rows compact by hiding the delete action instead of rendering disabled controls
- render action icons with `.ms-icon` or `.ms-icon-filled`
- add every new Material Symbols ligature name to `MATERIAL_ICONS`
- avoid hardcoded values when tokens exist

## Accessibility

- Render a semantic `<form>`.
- Every property selector, operator selector, and value input must have an accessible label.
- For `between`, label the two value controls as `From` and `To` with the property label included
  in the accessible name.
- Use native buttons for add, delete, and clear actions.
- Icon-only buttons must have accessible names independent of the symbol.
- Required locked filters must communicate that they cannot be removed.
- Required locked filters must not render a misleading delete button.
- Validation or incomplete-value messages must be associated with their controls.
- Preserve visible focus indication on all interactive controls.
- Keyboard users must be able to add filters, change operators, enter values, delete optional
  filters, clear optional filters, and submit search.

## Showcase

Add a dedicated `/search-query-form` page and home card demonstrating:

- empty default state with no filters displayed
- required filter displayed by default and protected from delete
- add optional string filter
- dropdown enum filter
- `between` date or datetime filter with `from` and `to`
- `in` filter with multiple dropdown selections
- clear action that removes optional filters but keeps required filters
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
- Clear removes optional filters and preserves required filters.
- Clear resets required filters to configured defaults.
- Add creates optional filters from the property config.
- Delete removes optional filters.
- Operator dropdowns use configured `allowedOperators` or backend-compatible data-type operators.
- Missing `defaultOperator` falls back to the documented data-type default operator.
- `between` renders `from` and `to` controls and emits `{ from, to }`.
- Inputs match the selected property `dataType`.
- Properties with `options` render dropdown controls.
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
