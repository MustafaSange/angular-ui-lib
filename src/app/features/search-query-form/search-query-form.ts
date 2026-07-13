import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SEARCH_SORT_DIRECTION,
  SearchPropertyConfig,
  SearchQueryFormComponent,
  SearchQueryFormState,
  buildSearchRequest,
  createTodayDateTimeRange,
  type PaginatedSearchRequest,
  type SearchSortConfig,
  type SearchSortOption,
  type SearchSortRequest,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

const todayCreatedAtRange = createTodayDateTimeRange();
const commonSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Created At', value: 'createdAt' },
] as const satisfies readonly SearchSortOption[];
const userSortOptions = [
  ...commonSortOptions,
  { label: 'Status', value: 'status' },
] as const satisfies readonly SearchSortOption[];
const defaultSorts = [
  { property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING },
] as const satisfies readonly SearchSortRequest[];
const userDefaultSorts = [
  ...defaultSorts,
  { property: 'createdAt', direction: SEARCH_SORT_DIRECTION.DESCENDING },
] as const satisfies readonly SearchSortRequest[];

@Component({
  selector: 'app-search-query-form',
  imports: [RouterLink, SearchQueryFormComponent, ShowcaseCode],
  templateUrl: './search-query-form.html',
  styleUrl: './search-query-form.scss',
})
export class SearchQueryForm {
  protected readonly emptySortConfig: SearchSortConfig = {
    sortOptions: commonSortOptions,
    defaultSorts,
    maxSorts: 2,
  };
  protected readonly userSortConfig: SearchSortConfig = {
    sortOptions: userSortOptions,
    defaultSorts: userDefaultSorts,
    maxSorts: 3,
  };
  protected readonly emptyProperties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'name',
      label: 'Name',
      dataType: 'string',
      allowCustomInValues: true,
    },
    {
      propertyName: 'createdAt',
      label: 'Created At',
      dataType: 'dateTime',
      allowCustomInValues: true,
    },
  ];

  protected readonly userProperties: readonly SearchPropertyConfig[] = [
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
      placeholder: 'Search name',
    },
    {
      propertyName: 'status',
      label: 'Status',
      dataType: 'enum',
      defaultOperator: 'in',
      allowCustomInValues: true,
      maxInValues: 50,
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Blocked', value: 'Blocked' },
      ],
    },
    {
      propertyName: 'tags',
      label: 'Tags',
      dataType: 'string',
      defaultOperator: 'in',
      allowCustomInValues: true,
      maxInValues: 50,
    },
    {
      propertyName: 'department',
      label: 'Department',
      dataType: 'enum',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Operations', value: 'Operations' },
      ],
    },
    {
      propertyName: 'referenceIds',
      label: 'Reference IDs',
      dataType: 'guid',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'quantities',
      label: 'Quantities',
      dataType: 'int',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'amounts',
      label: 'Amounts',
      dataType: 'decimal',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'reviewDates',
      label: 'Review Dates',
      dataType: 'date',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
      placeholder: 'YYYY-MM-DD',
    },
    {
      propertyName: 'createdAt',
      label: 'Created At',
      dataType: 'dateTime',
      defaultOperator: 'between',
      defaultValue: todayCreatedAtRange,
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
    {
      propertyName: 'isActive',
      label: 'Active',
      dataType: 'boolean',
      defaultOperator: 'eq',
      booleanLabels: 'yesNo',
    },
    {
      propertyName: 'isVerified',
      label: 'Verified',
      dataType: 'boolean',
      defaultOperator: 'eq',
    },
    {
      propertyName: 'age',
      label: 'Age',
      dataType: 'int',
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
  ];

  protected readonly emptyState = signal<SearchQueryFormState>({
    filters: [],
    sort: defaultSorts,
  });
  protected readonly userState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'tenant-required',
        property: 'tenantId',
        operator: 'eq',
        value: 'f2c09089-f857-4c42-857d-1c48e89f1107',
        locked: true,
      },
      {
        id: 'name-in',
        property: 'name',
        operator: 'in',
        value: ['Aisha', 'Omar'],
      },
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
      {
        id: 'status-in',
        property: 'status',
        operator: 'in',
        value: ['Active', 'Escalated'],
      },
      {
        id: 'tags-in',
        property: 'tags',
        operator: 'in',
        value: ['Priority', 'External', 'Reviewed', 'Follow-up', 'Q3'],
      },
      {
        id: 'department-in',
        property: 'department',
        operator: 'in',
        value: ['Engineering', 'Operations'],
      },
      {
        id: 'reference-ids-in',
        property: 'referenceIds',
        operator: 'in',
        value: ['550e8400-e29b-41d4-a716-446655440000'],
      },
      {
        id: 'quantities-in',
        property: 'quantities',
        operator: 'in',
        value: [10, 25],
      },
      {
        id: 'amounts-in',
        property: 'amounts',
        operator: 'in',
        value: [12.5, 99.95],
      },
      {
        id: 'review-dates-in',
        property: 'reviewDates',
        operator: 'in',
        value: ['2026-07-13', '2026-07-20'],
      },
    ],
    sort: userDefaultSorts,
  });
  protected readonly emptyRequest = signal<PaginatedSearchRequest>(
    buildSearchRequest(this.emptyState()),
  );
  protected readonly userRequest = signal<PaginatedSearchRequest>(
    buildSearchRequest(this.userState()),
  );
  protected readonly emptyRequestJson = computed(() =>
    JSON.stringify(this.emptyRequest(), null, 2),
  );
  protected readonly userRequestJson = computed(() => JSON.stringify(this.userRequest(), null, 2));

  protected readonly emptySnippet = `import { Component, signal } from '@angular/core';

import {
  SEARCH_SORT_DIRECTION,
  SearchQueryFormComponent,
  SearchPropertyConfig,
  SearchQueryFormState,
  SearchSortConfig,
} from './shared/ui-lib';

@Component({
  selector: 'app-empty-search-query-example',
  imports: [SearchQueryFormComponent],
  template: \`
    <ms-search-query-form
      [properties]="properties"
      [sortConfig]="sortConfig"
      [(state)]="searchState"
    />
  \`,
})
export class EmptySearchQueryExample {
  readonly sortConfig: SearchSortConfig = {
    sortOptions: [
      { label: 'Name', value: 'name' },
      { label: 'Created At', value: 'createdAt' },
    ],
    defaultSorts: [
      { property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING },
    ],
    maxSorts: 2,
  };

  readonly properties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'name',
      label: 'Name',
      dataType: 'string',
      allowCustomInValues: true,
    },
    {
      propertyName: 'createdAt',
      label: 'Created at',
      dataType: 'dateTime',
      allowCustomInValues: true,
    },
  ];

  readonly searchState = signal<SearchQueryFormState>({
    filters: [],
    sort: [{ property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING }],
  });
}`;

  protected readonly fullSnippet = `import { Component, computed, signal } from '@angular/core';

import {
  SEARCH_SORT_DIRECTION,
  SearchQueryFormComponent,
  SearchPropertyConfig,
  SearchQueryFormState,
  SearchSortConfig,
  buildSearchRequest,
  createTodayDateTimeRange,
  type PaginatedSearchRequest,
} from './shared/ui-lib';

const todayCreatedAtRange = createTodayDateTimeRange();

@Component({
  selector: 'app-user-search-query-example',
  imports: [SearchQueryFormComponent],
  template: \`
    <ms-search-query-form
      [properties]="properties"
      [maxFilters]="15"
      [sortConfig]="sortConfig"
      [(state)]="searchState"
      (requestChange)="request.set($event)"
    />

    <pre>{{ requestJson() }}</pre>
  \`,
})
export class UserSearchQueryExample {
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
      placeholder: 'Search name',
    },
    {
      propertyName: 'status',
      label: 'Status',
      dataType: 'enum',
      defaultOperator: 'in',
      allowCustomInValues: true,
      maxInValues: 50,
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Blocked', value: 'Blocked' },
      ],
    },
    {
      propertyName: 'tags',
      label: 'Tags',
      dataType: 'string',
      defaultOperator: 'in',
      allowCustomInValues: true,
      maxInValues: 50,
    },
    {
      propertyName: 'department',
      label: 'Department',
      dataType: 'enum',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Operations', value: 'Operations' },
      ],
    },
    {
      propertyName: 'referenceIds',
      label: 'Reference IDs',
      dataType: 'guid',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'quantities',
      label: 'Quantities',
      dataType: 'int',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'amounts',
      label: 'Amounts',
      dataType: 'decimal',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
    },
    {
      propertyName: 'reviewDates',
      label: 'Review Dates',
      dataType: 'date',
      defaultOperator: 'in',
      allowedOperators: ['in'],
      allowCustomInValues: true,
      placeholder: 'YYYY-MM-DD',
    },
    {
      propertyName: 'createdAt',
      label: 'Created at',
      dataType: 'dateTime',
      defaultOperator: 'between',
      defaultValue: todayCreatedAtRange,
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
    {
      propertyName: 'isActive',
      label: 'Active',
      dataType: 'boolean',
      defaultOperator: 'eq',
      booleanLabels: 'yesNo',
    },
    {
      propertyName: 'isVerified',
      label: 'Verified',
      dataType: 'boolean',
      defaultOperator: 'eq',
    },
    {
      propertyName: 'age',
      label: 'Age',
      dataType: 'int',
      allowedOperators: ['between', 'eq', 'gte', 'lte'],
    },
  ];

  readonly searchState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'tenant-required',
        property: 'tenantId',
        operator: 'eq',
        value: 'f2c09089-f857-4c42-857d-1c48e89f1107',
        locked: true,
      },
      {
        id: 'name-in',
        property: 'name',
        operator: 'in',
        value: ['Aisha', 'Omar'],
      },
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
      {
        id: 'status-in',
        property: 'status',
        operator: 'in',
        value: ['Active', 'Escalated'],
      },
      {
        id: 'tags-in',
        property: 'tags',
        operator: 'in',
        value: ['Priority', 'External', 'Reviewed', 'Follow-up', 'Q3'],
      },
      {
        id: 'department-in',
        property: 'department',
        operator: 'in',
        value: ['Engineering', 'Operations'],
      },
      {
        id: 'reference-ids-in',
        property: 'referenceIds',
        operator: 'in',
        value: ['550e8400-e29b-41d4-a716-446655440000'],
      },
      {
        id: 'quantities-in',
        property: 'quantities',
        operator: 'in',
        value: [10, 25],
      },
      {
        id: 'amounts-in',
        property: 'amounts',
        operator: 'in',
        value: [12.5, 99.95],
      },
      {
        id: 'review-dates-in',
        property: 'reviewDates',
        operator: 'in',
        value: ['2026-07-13', '2026-07-20'],
      },
    ],
    sort: [
      { property: 'name', direction: SEARCH_SORT_DIRECTION.ASCENDING },
      { property: 'createdAt', direction: SEARCH_SORT_DIRECTION.DESCENDING },
    ],
  });
  readonly request = signal<PaginatedSearchRequest>(buildSearchRequest(this.searchState()));
  readonly requestJson = computed(() => JSON.stringify(this.request(), null, 2));
}`;
}
