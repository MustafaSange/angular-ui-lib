import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SearchPropertyConfig,
  SearchQueryFormComponent,
  SearchQueryFormState,
  buildSearchRequest,
  createTodayDateTimeRange,
  type PaginatedSearchRequest,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

const todayCreatedAtRange = createTodayDateTimeRange();

@Component({
  selector: 'app-search-query-form',
  imports: [RouterLink, SearchQueryFormComponent, ShowcaseCode],
  templateUrl: './search-query-form.html',
  styleUrl: './search-query-form.scss',
})
export class SearchQueryForm {
  protected readonly emptyProperties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'name',
      label: 'Name',
      dataType: 'string',
    },
    {
      propertyName: 'createdAt',
      label: 'Created At',
      dataType: 'dateTime',
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
      maxStringLength: 50,
      placeholder: 'Search name',
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

  protected readonly emptyState = signal<SearchQueryFormState>({ filters: [] });
  protected readonly userState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'name-null-or-empty',
        property: 'name',
        operator: 'isNullOrEmpty',
        value: null,
      },
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
    ],
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
  SearchQueryFormComponent,
  SearchPropertyConfig,
  SearchQueryFormState,
} from './shared/ui-lib';

@Component({
  selector: 'app-empty-search-query-example',
  imports: [SearchQueryFormComponent],
  template: \`
    <ms-search-query-form [properties]="properties" [(state)]="searchState" />
  \`,
})
export class EmptySearchQueryExample {
  readonly properties: readonly SearchPropertyConfig[] = [
    { propertyName: 'name', label: 'Name', dataType: 'string' },
    { propertyName: 'createdAt', label: 'Created at', dataType: 'dateTime' },
  ];

  readonly searchState = signal<SearchQueryFormState>({ filters: [] });
}`;

  protected readonly fullSnippet = `import { Component, computed, signal } from '@angular/core';

import {
  SearchQueryFormComponent,
  SearchPropertyConfig,
  SearchQueryFormState,
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
      [(state)]="searchState"
      (requestChange)="request.set($event)"
    />

    <pre>{{ requestJson() }}</pre>
  \`,
})
export class UserSearchQueryExample {
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
  ];

  readonly searchState = signal<SearchQueryFormState>({
    filters: [
      {
        id: 'name-null-or-empty',
        property: 'name',
        operator: 'isNullOrEmpty',
        value: null,
      },
      {
        id: 'created-at-today',
        property: 'createdAt',
        operator: 'between',
        value: todayCreatedAtRange,
      },
    ],
  });
  readonly request = signal<PaginatedSearchRequest>(buildSearchRequest(this.searchState()));
  readonly requestJson = computed(() => JSON.stringify(this.request(), null, 2));
}`;
}
