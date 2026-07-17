import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BadgeComponent,
  SEARCH_SORT_DIRECTION,
  isBetweenValue,
  TableSearchColumnComponent,
  TableSearchDirective,
  type BadgeKind,
  type PaginatedSearchRequest,
  type SearchFilterRequest,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchScalarValue,
  type SearchSortConfig,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/showcase-code';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface InvoiceRow {
  readonly id: string;
  readonly invoice: string;
  readonly customer: string;
  readonly status: InvoiceStatus;
  readonly due: string;
  readonly amount: number;
  readonly itemCount: number;
  readonly sequence: number;
  readonly issuedOn: string;
  readonly dueTime: string;
  readonly accountId: string;
  readonly paid: boolean;
}

const INVOICES: readonly InvoiceRow[] = [
  {
    id: '2048',
    invoice: 'INV-2048',
    customer: 'Northwind Studio',
    status: 'Paid',
    due: '2026-07-02T10:30',
    amount: 4200,
    itemCount: 4,
    sequence: 10000000001,
    issuedOn: '2026-06-02',
    dueTime: '10:30',
    accountId: '10f47a16-6af7-4c6c-a68d-d80777101a10',
    paid: true,
  },
  {
    id: '2049',
    invoice: 'INV-2049',
    customer: 'Acme Supply',
    status: 'Pending',
    due: '2026-07-16T14:15',
    amount: 1180,
    itemCount: 1,
    sequence: 10000000002,
    issuedOn: '2026-06-16',
    dueTime: '14:15',
    accountId: '20f47a16-6af7-4c6c-a68d-d80777101a20',
    paid: false,
  },
  {
    id: '2050',
    invoice: 'INV-2050',
    customer: 'Doha Digital',
    status: 'Overdue',
    due: '2026-07-08T09:45',
    amount: 2760,
    itemCount: 3,
    sequence: 10000000003,
    issuedOn: '2026-06-08',
    dueTime: '09:45',
    accountId: '30f47a16-6af7-4c6c-a68d-d80777101a30',
    paid: false,
  },
  {
    id: '2051',
    invoice: 'INV-2051',
    customer: 'Gulf Systems',
    status: 'Paid',
    due: '2026-07-10T16:00',
    amount: 3400,
    itemCount: 2,
    sequence: 10000000004,
    issuedOn: '2026-06-10',
    dueTime: '16:00',
    accountId: '40f47a16-6af7-4c6c-a68d-d80777101a40',
    paid: true,
  },
];

function invoiceValue(row: InvoiceRow, property: string): SearchScalarValue | null {
  switch (property) {
    case 'invoice':
    case 'customer':
    case 'status':
    case 'due':
    case 'issuedOn':
    case 'dueTime':
    case 'accountId':
      return row[property];
    case 'amount':
    case 'itemCount':
    case 'sequence':
    case 'paid':
      return row[property];
    default:
      return null;
  }
}

function compareValues(left: SearchScalarValue, right: SearchScalarValue): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right));
}

function isScalarValue(value: unknown): value is SearchScalarValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function matchesFilter(row: InvoiceRow, filter: SearchFilterRequest): boolean {
  const actual = invoiceValue(row, filter.property);
  const expected = filter.value;
  const actualText = actual === null ? '' : String(actual);

  switch (filter.operator) {
    case 'isNull':
      return actual === null;
    case 'isNotNull':
      return actual !== null;
    case 'isEmpty':
      return actualText.length === 0;
    case 'isNotEmpty':
      return actualText.length > 0;
    case 'isNullOrEmpty':
      return actual === null || actualText.length === 0;
    case 'isNotNullOrEmpty':
      return actual !== null && actualText.length > 0;
    case 'in':
      return Array.isArray(expected) && expected.some((value) => Object.is(value, actual));
    case 'between':
      return Boolean(
        actual !== null &&
        expected &&
        isBetweenValue(expected) &&
        expected.from !== null &&
        expected.to !== null &&
        compareValues(actual, expected.from) >= 0 &&
        compareValues(actual, expected.to) <= 0,
      );
    case 'contains':
      return typeof expected === 'string' && actualText.includes(expected);
    case 'startsWith':
      return typeof expected === 'string' && actualText.startsWith(expected);
    case 'endsWith':
      return typeof expected === 'string' && actualText.endsWith(expected);
    case 'eq':
      return Object.is(actual, expected);
    case 'neq':
      return !Object.is(actual, expected);
    case 'gt':
      return actual !== null && isScalarValue(expected)
        ? compareValues(actual, expected) > 0
        : false;
    case 'gte':
      return actual !== null && isScalarValue(expected)
        ? compareValues(actual, expected) >= 0
        : false;
    case 'lt':
      return actual !== null && isScalarValue(expected)
        ? compareValues(actual, expected) < 0
        : false;
    case 'lte':
      return actual !== null && isScalarValue(expected)
        ? compareValues(actual, expected) <= 0
        : false;
  }
}

function applyInvoiceRequest(
  rows: readonly InvoiceRow[],
  request: PaginatedSearchRequest | null,
): readonly InvoiceRow[] {
  if (!request) {
    return rows;
  }

  const filtered = request.filters
    ? rows.filter((row) => request.filters!.every((filter) => matchesFilter(row, filter)))
    : [...rows];

  return request.sort?.length
    ? [...filtered].sort((left, right) => {
        for (const sort of request.sort!) {
          const leftValue = invoiceValue(left, sort.property);
          const rightValue = invoiceValue(right, sort.property);
          if (leftValue === null || rightValue === null) {
            continue;
          }
          const result = compareValues(leftValue, rightValue);
          if (result !== 0) {
            return sort.direction === SEARCH_SORT_DIRECTION.DESCENDING ? -result : result;
          }
        }
        return 0;
      })
    : filtered;
}

@Component({
  selector: 'app-table-search',
  imports: [
    BadgeComponent,
    RouterLink,
    ShowcaseCode,
    TableSearchColumnComponent,
    TableSearchDirective,
  ],
  templateUrl: './table-search.html',
  styleUrl: './table-search.scss',
})
export class TableSearch {
  protected readonly properties: readonly SearchPropertyConfig[] = [
    {
      propertyName: 'invoice',
      label: 'Invoice Reference',
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
      defaultValue: ['Pending'],
      visibleByDefault: true,
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' },
      ],
    },
    {
      propertyName: 'due',
      label: 'Due Date',
      dataType: 'dateTime',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'amount',
      label: 'Amount',
      dataType: 'decimal',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'itemCount',
      label: 'Items',
      dataType: 'int',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'sequence',
      label: 'Sequence',
      dataType: 'long',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'issuedOn',
      label: 'Issued',
      dataType: 'date',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'dueTime',
      label: 'Due Time',
      dataType: 'time',
      defaultOperator: 'between',
      allowCustomInValues: true,
    },
    {
      propertyName: 'accountId',
      label: 'Account ID',
      dataType: 'guid',
      defaultOperator: 'eq',
      allowCustomInValues: true,
    },
    {
      propertyName: 'paid',
      label: 'Paid',
      dataType: 'boolean',
      defaultOperator: 'eq',
      booleanLabels: 'yesNo',
    },
  ];
  protected readonly sortConfig: SearchSortConfig = {
    sortOptions: this.properties.map((property) => ({
      label: property.label ?? property.propertyName,
      value: property.propertyName,
    })),
    defaultSorts: [{ property: 'due', direction: SEARCH_SORT_DIRECTION.ASCENDING }],
    maxSorts: 4,
  };
  protected readonly state = signal<SearchQueryFormState>({ page: 3, limit: 25, filters: [] });
  protected readonly request = signal<PaginatedSearchRequest | null>(null);
  protected readonly requestJson = computed(() =>
    this.request()
      ? JSON.stringify(this.request(), null, 2)
      : 'Apply a valid filter or sort to emit a request.',
  );
  protected readonly rows = computed(() => applyInvoiceRequest(INVOICES, this.request()));

  protected handleRequest(request: PaginatedSearchRequest): void {
    this.request.set(request);
  }

  protected statusKind(status: InvoiceStatus): BadgeKind {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'danger';
    }
  }

  protected formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  protected readonly snippet = `import { Component, computed, signal } from '@angular/core';

import {
  BadgeComponent,
  SEARCH_SORT_DIRECTION,
  isBetweenValue,
  TableSearchColumnComponent,
  TableSearchDirective,
  type BadgeKind,
  type PaginatedSearchRequest,
  type SearchFilterRequest,
  type SearchPropertyConfig,
  type SearchQueryFormState,
  type SearchScalarValue,
  type SearchSortConfig,
} from './shared/ui-lib';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface InvoiceRow {
  readonly id: string;
  readonly invoice: string;
  readonly customer: string;
  readonly status: InvoiceStatus;
  readonly due: string;
  readonly amount: number;
  readonly itemCount: number;
  readonly sequence: number;
  readonly issuedOn: string;
  readonly dueTime: string;
  readonly accountId: string;
  readonly paid: boolean;
}

function invoiceValue(row: InvoiceRow, property: string): SearchScalarValue | null {
  switch (property) {
    case 'invoice': case 'customer': case 'status': case 'due': case 'issuedOn':
    case 'dueTime': case 'accountId': case 'amount': case 'itemCount': case 'sequence': case 'paid':
      return row[property];
    default:
      return null;
  }
}

function compareValues(left: SearchScalarValue, right: SearchScalarValue): number {
  return typeof left === 'number' && typeof right === 'number'
    ? left - right
    : String(left).localeCompare(String(right));
}

function isScalarValue(value: unknown): value is SearchScalarValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function matchesFilter(row: InvoiceRow, filter: SearchFilterRequest): boolean {
  const actual = invoiceValue(row, filter.property);
  const expected = filter.value;
  const text = actual === null ? '' : String(actual);
  switch (filter.operator) {
    case 'isNull': return actual === null;
    case 'isNotNull': return actual !== null;
    case 'isEmpty': return text.length === 0;
    case 'isNotEmpty': return text.length > 0;
    case 'isNullOrEmpty': return actual === null || text.length === 0;
    case 'isNotNullOrEmpty': return actual !== null && text.length > 0;
    case 'in': return Array.isArray(expected) && expected.some((value) => Object.is(value, actual));
    case 'between': return Boolean(actual !== null && expected && isBetweenValue(expected) &&
      expected.from !== null && expected.to !== null &&
      compareValues(actual, expected.from) >= 0 && compareValues(actual, expected.to) <= 0);
    case 'contains': return typeof expected === 'string' && text.includes(expected);
    case 'startsWith': return typeof expected === 'string' && text.startsWith(expected);
    case 'endsWith': return typeof expected === 'string' && text.endsWith(expected);
    case 'eq': return Object.is(actual, expected);
    case 'neq': return !Object.is(actual, expected);
    case 'gt': return actual !== null && isScalarValue(expected)
      ? compareValues(actual, expected) > 0 : false;
    case 'gte': return actual !== null && isScalarValue(expected)
      ? compareValues(actual, expected) >= 0 : false;
    case 'lt': return actual !== null && isScalarValue(expected)
      ? compareValues(actual, expected) < 0 : false;
    case 'lte': return actual !== null && isScalarValue(expected)
      ? compareValues(actual, expected) <= 0 : false;
  }
}

function applyInvoiceRequest(rows: readonly InvoiceRow[], request: PaginatedSearchRequest | null) {
  if (!request) return rows;
  const filtered = request.filters
    ? rows.filter((row) => request.filters!.every((filter) => matchesFilter(row, filter)))
    : [...rows];
  return request.sort?.length ? [...filtered].sort((left, right) => {
    for (const sort of request.sort!) {
      const leftValue = invoiceValue(left, sort.property);
      const rightValue = invoiceValue(right, sort.property);
      if (leftValue === null || rightValue === null) continue;
      const result = compareValues(leftValue, rightValue);
      if (result !== 0) {
        return sort.direction === SEARCH_SORT_DIRECTION.DESCENDING ? -result : result;
      }
    }
    return 0;
  }) : filtered;
}

@Component({
  selector: 'app-searchable-invoice-table',
  imports: [BadgeComponent, TableSearchColumnComponent, TableSearchDirective],
  template: \`
    <div class="table-wrapper">
      <table class="table table-hover table-search-demo" msTableSearch
        [properties]="properties" [sortConfig]="sortConfig"
        [(state)]="state" (requestChange)="handleRequest($event)">
        <caption>Searchable Invoice Results</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start" msTableSearchColumn="invoice">
              Invoice Reference
            </th>
            <th scope="col" class="text-start" msTableSearchColumn="customer">Customer</th>
            <th scope="col" class="text-start" msTableSearchColumn="status">Status</th>
            <th scope="col" class="text-start" msTableSearchColumn="due">Due Date</th>
            <th scope="col" class="text-end" msTableSearchColumn="amount">
              <span align="end">Amount</span>
            </th>
            <th scope="col" class="text-end" msTableSearchColumn="itemCount">
              <span align="end">Items</span>
            </th>
            <th scope="col" class="text-end" msTableSearchColumn="sequence">
              <span align="end">Sequence</span>
            </th>
            <th scope="col" class="text-start" msTableSearchColumn="issuedOn">Issued</th>
            <th scope="col" class="text-start" msTableSearchColumn="dueTime">Due Time</th>
            <th scope="col" class="text-start" msTableSearchColumn="accountId">Account ID</th>
            <th scope="col" class="text-start" msTableSearchColumn="paid">Paid?</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr>
              <th class="text-start invoice-cell" scope="row">{{ row.invoice }}</th>
              <td class="text-start">{{ row.customer }}</td>
              <td class="text-start">
                <ms-badge [kind]="statusKind(row.status)" dot>{{ row.status }}</ms-badge>
              </td>
              <td class="text-start">{{ row.due }}</td>
              <td class="text-end amount-cell">{{ formatAmount(row.amount) }}</td>
              <td class="text-end">{{ row.itemCount }}</td>
              <td class="text-end">{{ row.sequence }}</td>
              <td class="text-start">{{ row.issuedOn }}</td>
              <td class="text-start">{{ row.dueTime }}</td>
              <td class="text-start guid-cell">{{ row.accountId }}</td>
              <td class="text-start">{{ row.paid ? 'Yes' : 'No' }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="request-preview">
      <strong>Latest applied request</strong>
      <pre aria-live="polite">{{ requestJson() }}</pre>
    </div>
  \`,
  styles: [\`
    .table-search-demo { min-inline-size: 92rem; }
    .invoice-cell, .amount-cell, .guid-cell { font-variant-numeric: tabular-nums; white-space: nowrap; }
    .request-preview { display: grid; gap: var(--spacing-8); margin-block-start: var(--spacing-16); }
    .request-preview pre { max-block-size: none; margin: 0; padding: var(--spacing-12); overflow: auto;
      border: var(--border-width-sm) solid var(--color-border); border-radius: var(--radius-sm); }
  \`],
})
export class SearchableInvoiceTable {
  readonly properties: readonly SearchPropertyConfig[] = [
    { propertyName: 'invoice', label: 'Invoice Reference', dataType: 'string',
      defaultOperator: 'contains', defaultValue: 'INV-', required: true },
    { propertyName: 'customer', label: 'Customer', dataType: 'string',
      defaultOperator: 'contains', allowCustomInValues: true },
    { propertyName: 'status', label: 'Status', dataType: 'enum', defaultOperator: 'in',
      defaultValue: ['Pending'], visibleByDefault: true,
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' },
      ] },
    { propertyName: 'due', label: 'Due Date', dataType: 'dateTime', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'amount', label: 'Amount', dataType: 'decimal', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'itemCount', label: 'Items', dataType: 'int', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'sequence', label: 'Sequence', dataType: 'long', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'issuedOn', label: 'Issued', dataType: 'date', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'dueTime', label: 'Due Time', dataType: 'time', defaultOperator: 'between',
      allowCustomInValues: true },
    { propertyName: 'accountId', label: 'Account ID', dataType: 'guid', defaultOperator: 'eq',
      allowCustomInValues: true },
    { propertyName: 'paid', label: 'Paid', dataType: 'boolean', defaultOperator: 'eq',
      booleanLabels: 'yesNo' },
  ];
  readonly sortConfig: SearchSortConfig = {
    sortOptions: this.properties.map((property) => ({
      label: property.label ?? property.propertyName,
      value: property.propertyName,
    })),
    defaultSorts: [{ property: 'due', direction: SEARCH_SORT_DIRECTION.ASCENDING }],
    maxSorts: 4,
  };
  readonly state = signal<SearchQueryFormState>({ page: 3, limit: 25, filters: [] });
  readonly request = signal<PaginatedSearchRequest | null>(null);
  readonly requestJson = computed(() => this.request()
    ? JSON.stringify(this.request(), null, 2)
    : 'Apply a valid filter or sort to emit a request.');
  readonly invoices: readonly InvoiceRow[] = [
    { id: '2048', invoice: 'INV-2048', customer: 'Northwind Studio', status: 'Paid',
      due: '2026-07-02T10:30', amount: 4200, itemCount: 4, sequence: 10000000001,
      issuedOn: '2026-06-02', dueTime: '10:30',
      accountId: '10f47a16-6af7-4c6c-a68d-d80777101a10', paid: true },
    { id: '2049', invoice: 'INV-2049', customer: 'Acme Supply', status: 'Pending',
      due: '2026-07-16T14:15', amount: 1180, itemCount: 1, sequence: 10000000002,
      issuedOn: '2026-06-16', dueTime: '14:15',
      accountId: '20f47a16-6af7-4c6c-a68d-d80777101a20', paid: false },
    { id: '2050', invoice: 'INV-2050', customer: 'Doha Digital', status: 'Overdue',
      due: '2026-07-08T09:45', amount: 2760, itemCount: 3, sequence: 10000000003,
      issuedOn: '2026-06-08', dueTime: '09:45',
      accountId: '30f47a16-6af7-4c6c-a68d-d80777101a30', paid: false },
    { id: '2051', invoice: 'INV-2051', customer: 'Gulf Systems', status: 'Paid',
      due: '2026-07-10T16:00', amount: 3400, itemCount: 2, sequence: 10000000004,
      issuedOn: '2026-06-10', dueTime: '16:00',
      accountId: '40f47a16-6af7-4c6c-a68d-d80777101a40', paid: true },
  ];
  readonly rows = computed(() => applyInvoiceRequest(this.invoices, this.request()));

  handleRequest(request: PaginatedSearchRequest): void {
    this.request.set(request);
  }

  statusKind(status: InvoiceStatus): BadgeKind {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'danger';
    }
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}`;
}
