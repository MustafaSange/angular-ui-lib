import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BadgeComponent,
  CheckboxControl,
  PaginationComponent,
  type PaginationState,
  SelectComponent,
  type SelectOption,
  SignalFormField,
  type BadgeKind,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/showcase-code';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';
type StatusFilter = 'all' | InvoiceStatus;
type InvoiceSortKey = 'invoice' | 'customer' | 'status' | 'due' | 'amount';
type SortDirection = 'asc' | 'desc';

interface InvoiceRow {
  readonly id: string;
  readonly invoice: string;
  readonly customer: string;
  readonly status: InvoiceStatus;
  readonly due: string;
  readonly amount: number;
}

interface InvoiceColumn {
  readonly key: InvoiceSortKey;
  readonly label: string;
}

const INVOICES: readonly InvoiceRow[] = [
  {
    id: '2048',
    invoice: 'INV-2048',
    customer: 'Northwind Studio',
    status: 'Paid',
    due: '2026-07-02',
    amount: 4200,
  },
  {
    id: '2049',
    invoice: 'INV-2049',
    customer: 'Acme Supply',
    status: 'Pending',
    due: '2026-07-16',
    amount: 1180,
  },
  {
    id: '2050',
    invoice: 'INV-2050',
    customer: 'Doha Digital',
    status: 'Overdue',
    due: '2026-07-08',
    amount: 2760,
  },
  {
    id: '2051',
    invoice: 'INV-2051',
    customer: 'Gulf Systems',
    status: 'Paid',
    due: '2026-07-10',
    amount: 3400,
  },
  {
    id: '2052',
    invoice: 'INV-2052',
    customer: 'Atlas Works',
    status: 'Pending',
    due: '2026-07-20',
    amount: 940,
  },
  {
    id: '2053',
    invoice: 'INV-2053',
    customer: 'Cedar Labs',
    status: 'Paid',
    due: '2026-07-11',
    amount: 6250,
  },
  {
    id: '2054',
    invoice: 'INV-2054',
    customer: 'Pearl Commerce',
    status: 'Overdue',
    due: '2026-07-05',
    amount: 1580,
  },
  {
    id: '2055',
    invoice: 'INV-2055',
    customer: 'Mesa Creative',
    status: 'Pending',
    due: '2026-07-24',
    amount: 3890,
  },
  {
    id: '2056',
    invoice: 'INV-2056',
    customer: 'Harbor Logistics',
    status: 'Paid',
    due: '2026-07-12',
    amount: 7240,
  },
  {
    id: '2057',
    invoice: 'INV-2057',
    customer: 'Saffron Market',
    status: 'Pending',
    due: '2026-07-28',
    amount: 2150,
  },
  {
    id: '2058',
    invoice: 'INV-2058',
    customer: 'Orbit Services',
    status: 'Overdue',
    due: '2026-07-09',
    amount: 4850,
  },
  {
    id: '2059',
    invoice: 'INV-2059',
    customer: 'Palm Partners',
    status: 'Paid',
    due: '2026-07-13',
    amount: 1320,
  },
];

@Component({
  selector: 'app-tables',
  imports: [
    RouterLink,
    BadgeComponent,
    CheckboxControl,
    PaginationComponent,
    SelectComponent,
    SignalFormField,
    ShowcaseCode,
  ],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
})
export class Tables {
  protected readonly query = signal('');
  protected readonly statusFilter = signal<StatusFilter | StatusFilter[] | null>('all');
  protected readonly statusOptions: readonly SelectOption<StatusFilter>[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Overdue', value: 'Overdue' },
  ];
  protected readonly columns: readonly InvoiceColumn[] = [
    { key: 'invoice', label: 'Invoice' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status' },
    { key: 'due', label: 'Due' },
    { key: 'amount', label: 'Amount' },
  ];
  protected readonly sortKey = signal<InvoiceSortKey>('due');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly pageState = signal<PaginationState>({
    page: 1,
    pageSize: 5,
    siblingCount: 1,
    ariaLabel: 'Invoice pages',
  });

  protected readonly filteredRows = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    const filterValue = this.statusFilter();
    const status = typeof filterValue === 'string' ? filterValue : 'all';
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    const sortKey = this.sortKey();

    return INVOICES.filter((row) => {
      const matchesQuery =
        !query ||
        row.invoice.toLocaleLowerCase().includes(query) ||
        row.customer.toLocaleLowerCase().includes(query);
      const matchesStatus = status === 'all' || row.status === status;

      return matchesQuery && matchesStatus;
    }).sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return (leftValue - rightValue) * direction;
      }

      return String(leftValue).localeCompare(String(rightValue)) * direction;
    });
  });

  protected readonly pagination = computed<PaginationState>(() => ({
    ...this.pageState(),
    totalItems: this.filteredRows().length,
  }));

  protected readonly pagedRows = computed(() => {
    const page = this.pageState().page ?? 1;
    const pageSize = this.pageState().pageSize ?? 5;
    const start = (page - 1) * pageSize;

    return this.filteredRows().slice(start, start + pageSize);
  });

  protected readonly allVisibleSelected = computed(
    () =>
      this.pagedRows().length > 0 &&
      this.pagedRows().every((row) => this.selectedIds().has(row.id)),
  );
  protected readonly someVisibleSelected = computed(
    () =>
      !this.allVisibleSelected() && this.pagedRows().some((row) => this.selectedIds().has(row.id)),
  );

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.goToFirstPage();
  }

  protected updateStatus(value: StatusFilter | StatusFilter[] | null): void {
    this.statusFilter.set(value);
    this.goToFirstPage();
  }

  protected updatePagination(state: PaginationState): void {
    this.pageState.set(state);
  }

  protected sortBy(key: InvoiceSortKey): void {
    if (this.sortKey() === key) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }

    this.goToFirstPage();
  }

  protected sortIcon(key: InvoiceSortKey): 'arrow_upward' | 'arrow_downward' | 'unfold_more' {
    if (this.sortKey() !== key) {
      return 'unfold_more';
    }

    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  protected sortAriaLabel(column: InvoiceColumn): string {
    const label = column.label.toLocaleLowerCase();

    if (this.sortKey() !== column.key) {
      return `Sort by ${label}`;
    }

    const nextDirection = this.sortDirection() === 'asc' ? 'descending' : 'ascending';
    return `Sort by ${label} ${nextDirection}`;
  }

  protected ariaSort(key: InvoiceSortKey): 'ascending' | 'descending' | null {
    if (this.sortKey() !== key) {
      return null;
    }

    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleRow(rowId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update((current) => {
      const next = new Set(current);
      checked ? next.add(rowId) : next.delete(rowId);
      return next;
    });
  }

  protected toggleVisibleRows(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update((current) => {
      const next = new Set(current);
      this.pagedRows().forEach((row) => (checked ? next.add(row.id) : next.delete(row.id)));
      return next;
    });
  }

  protected clearGrid(): void {
    this.query.set('');
    this.statusFilter.set('all');
    this.selectedIds.set(new Set());
    this.sortKey.set('due');
    this.sortDirection.set('asc');
    this.goToFirstPage();
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

  private goToFirstPage(): void {
    this.pageState.update((state) => ({ ...state, page: 1 }));
  }

  protected readonly snippets = {
    dataGrid: `import { Component, computed, signal } from '@angular/core';

import {
  BadgeComponent,
  CheckboxControl,
  PaginationComponent,
  SelectComponent,
  SignalFormField,
  type BadgeKind,
  type PaginationState,
  type SelectOption,
} from './shared/ui-lib';

type Status = 'Paid' | 'Pending' | 'Overdue';
type StatusFilter = 'all' | Status;
type SortKey = 'invoice' | 'customer' | 'status' | 'due' | 'amount';

interface Invoice {
  readonly id: string;
  readonly invoice: string;
  readonly customer: string;
  readonly status: Status;
  readonly due: string;
  readonly amount: number;
}

interface Column {
  readonly key: SortKey;
  readonly label: string;
}

@Component({
  selector: 'app-invoice-grid-example',
  imports: [
    BadgeComponent,
    CheckboxControl,
    PaginationComponent,
    SelectComponent,
    SignalFormField,
  ],
  template: \`
    <div class="example-heading">
      <p>Search, filter, sort, select, and paginate invoices.</p>
      <button class="btn btn-outline btn-sm" type="button" (click)="clearGrid()">
        <span class="ms-icon" aria-hidden="true">restart_alt</span>
        Reset
      </button>
    </div>

    <div class="data-grid" role="region" aria-label="Invoice data grid">
      <div class="data-grid-toolbar">
        <ms-signal-form-field class="no-message search-control">
          <label for="invoice-search">Search Invoices</label>
          <span class="form-field-prefix" aria-hidden="true">
            <span class="ms-icon">search</span>
          </span>
          <input id="invoice-search" type="search" [value]="query()"
            placeholder="Invoice or customer" (input)="updateQuery($event)" />
        </ms-signal-form-field>
        <ms-signal-form-field class="no-message status-control">
          <label for="invoice-status">Status</label>
          <ms-select id="invoice-status" aria-label="Filter invoices by status"
            [options]="statusOptions" [value]="statusFilter()"
            [searchable]="false" [clearable]="false"
            (valueChange)="updateStatus($event)" />
        </ms-signal-form-field>
        <p class="result-count" aria-live="polite">
          {{ filteredRows().length }} {{ filteredRows().length === 1 ? 'result' : 'results' }}
        </p>
      </div>

      <div class="table-wrapper data-grid-table-wrapper">
        <table class="table table-hover data-grid-table">
        <caption>Invoice Results</caption>
        <thead>
          <tr>
            <th class="selection-column" scope="col">
              <ms-checkbox-control class="grid-checkbox">
                <input type="checkbox" aria-label="Select all invoices on this page"
                  [checked]="allVisibleSelected()" [indeterminate]="someVisibleSelected()"
                  [disabled]="pagedRows().length === 0" (change)="toggleVisible($event)" />
                <label>Select All Invoices on This Page</label>
              </ms-checkbox-control>
            </th>
            @for (column of columns; track column.key) {
              <th scope="col" [class.text-start]="column.key !== 'amount'"
                [class.text-end]="column.key === 'amount'"
                [attr.aria-sort]="ariaSort(column.key)">
                <button class="sort-button" [class.sort-button-end]="column.key === 'amount'"
                  type="button" [attr.aria-label]="sortAriaLabel(column)"
                  (click)="sortBy(column.key)">
                  {{ column.label }}
                  <span class="ms-icon" aria-hidden="true">{{ sortIcon(column.key) }}</span>
                </button>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of pagedRows(); track row.id) {
            <tr [class.is-selected]="selectedIds().has(row.id)">
              <td class="selection-column">
                <ms-checkbox-control class="grid-checkbox">
                  <input type="checkbox" [attr.aria-label]="'Select ' + row.invoice"
                    [checked]="selectedIds().has(row.id)"
                    (change)="toggleRow(row.id, $event)" />
                  <label>Select {{ row.invoice }}</label>
                </ms-checkbox-control>
              </td>
              <th class="text-start invoice-cell" scope="row">{{ row.invoice }}</th>
              <td class="text-start">{{ row.customer }}</td>
              <td class="text-start">
                <ms-badge [kind]="statusKind(row.status)" dot>{{ row.status }}</ms-badge>
              </td>
              <td class="text-start">{{ row.due }}</td>
              <td class="text-end amount-cell">{{ formatAmount(row.amount) }}</td>
            </tr>
          } @empty {
            <tr>
              <td class="table-empty" colspan="6">
                No invoices match the current search and status filter.
              </td>
            </tr>
          }
        </tbody>
        </table>
      </div>

      <div class="data-grid-footer">
        <p class="selection-summary" aria-live="polite">
          @if (selectedIds().size > 0) {
            <strong>{{ selectedIds().size }}</strong> selected
          } @else {
            Select rows for bulk actions
          }
        </p>
        <ms-pagination [state]="pagination()" (stateChange)="updatePagination($event)" />
      </div>
    </div>
  \`,
  styles: [\`
    :host { display: block; }
    .example-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-16);
      margin-block-end: var(--spacing-16);
    }
    .example-heading p,
    .result-count,
    .selection-summary {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
    .data-grid {
      border: var(--border-width-sm) solid var(--color-border);
      border-radius: var(--radius-md);
      background-color: var(--color-surface);
      overflow: hidden;
    }
    .data-grid-toolbar {
      display: grid;
      grid-template-columns: minmax(14rem, 1fr) minmax(10rem, 12rem) auto;
      align-items: end;
      gap: var(--spacing-12);
      padding: var(--spacing-12);
      border-block-end: var(--border-width-sm) solid var(--color-border);
      background-color: var(--color-surface-muted);
    }
    .search-control { max-inline-size: 28rem; }
    .result-count {
      justify-self: end;
      padding-block: var(--spacing-4);
      white-space: nowrap;
    }
    .data-grid-table-wrapper { border: 0; border-radius: 0; }
    .data-grid-table { min-inline-size: 48rem; }
    .data-grid-table caption,
    .grid-checkbox label {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      margin: -1px;
      padding: 0;
      border: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .data-grid-table tbody tr.is-selected > * {
      background-color: var(--color-primary-subtle);
    }
    .selection-column { inline-size: 3rem; padding-inline: var(--spacing-12); }
    .grid-checkbox { display: block; inline-size: 1.5rem; }
    .sort-button {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: 0;
      border: 0;
      background-color: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .sort-button .ms-icon {
      color: var(--color-text-muted);
      font-size: var(--font-size-md);
    }
    .sort-button:focus-visible {
      border-radius: var(--radius-xs);
      outline: 0;
      box-shadow: var(--control-focus-ring);
    }
    .sort-button-end { margin-inline-start: auto; }
    .invoice-cell,
    .amount-cell { font-variant-numeric: tabular-nums; white-space: nowrap; }
    .data-grid-footer {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: var(--spacing-16);
      padding: var(--spacing-12);
      border-block-start: var(--border-width-sm) solid var(--color-border);
    }
    .selection-summary { white-space: nowrap; }
    @media screen and (max-width: 48rem) {
      .example-heading { align-items: start; flex-direction: column; }
      .data-grid-toolbar,
      .data-grid-footer { grid-template-columns: minmax(0, 1fr); }
      .search-control { max-inline-size: none; }
      .status-control { max-inline-size: 16rem; }
      .result-count { justify-self: start; }
    }
  \`],
})
export class InvoiceGridExample {
  readonly rows: readonly Invoice[] = [
    { id: '2048', invoice: 'INV-2048', customer: 'Northwind Studio', status: 'Paid', due: '2026-07-02', amount: 4200 },
    { id: '2049', invoice: 'INV-2049', customer: 'Acme Supply', status: 'Pending', due: '2026-07-16', amount: 1180 },
    { id: '2050', invoice: 'INV-2050', customer: 'Doha Digital', status: 'Overdue', due: '2026-07-08', amount: 2760 },
    { id: '2051', invoice: 'INV-2051', customer: 'Gulf Systems', status: 'Paid', due: '2026-07-10', amount: 3400 },
    { id: '2052', invoice: 'INV-2052', customer: 'Atlas Works', status: 'Pending', due: '2026-07-20', amount: 940 },
    { id: '2053', invoice: 'INV-2053', customer: 'Cedar Labs', status: 'Paid', due: '2026-07-11', amount: 6250 },
    { id: '2054', invoice: 'INV-2054', customer: 'Pearl Commerce', status: 'Overdue', due: '2026-07-05', amount: 1580 },
    { id: '2055', invoice: 'INV-2055', customer: 'Mesa Creative', status: 'Pending', due: '2026-07-24', amount: 3890 },
    { id: '2056', invoice: 'INV-2056', customer: 'Harbor Logistics', status: 'Paid', due: '2026-07-12', amount: 7240 },
    { id: '2057', invoice: 'INV-2057', customer: 'Saffron Market', status: 'Pending', due: '2026-07-28', amount: 2150 },
    { id: '2058', invoice: 'INV-2058', customer: 'Orbit Services', status: 'Overdue', due: '2026-07-09', amount: 4850 },
    { id: '2059', invoice: 'INV-2059', customer: 'Palm Partners', status: 'Paid', due: '2026-07-13', amount: 1320 },
  ];
  readonly columns: readonly Column[] = [
    { key: 'invoice', label: 'Invoice' }, { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status' }, { key: 'due', label: 'Due' },
    { key: 'amount', label: 'Amount' },
  ];
  readonly statusOptions: readonly SelectOption<StatusFilter>[] = [
    { label: 'All Statuses', value: 'all' }, { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' }, { label: 'Overdue', value: 'Overdue' },
  ];
  readonly query = signal('');
  readonly statusFilter = signal<StatusFilter | StatusFilter[] | null>('all');
  readonly sortKey = signal<SortKey>('due');
  readonly ascending = signal(true);
  readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  readonly pageState = signal<PaginationState>({
    page: 1, pageSize: 5, siblingCount: 1, ariaLabel: 'Invoice pages',
  });
  readonly filteredRows = computed(() => {
    const query = this.query().trim().toLowerCase();
    const filter = this.statusFilter();
    const status = typeof filter === 'string' ? filter : 'all';
    const direction = this.ascending() ? 1 : -1;
    const key = this.sortKey();
    return this.rows
      .filter((row) => (!query || (row.invoice + ' ' + row.customer).toLowerCase().includes(query))
        && (status === 'all' || row.status === status))
      .sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * direction);
  });
  readonly pagination = computed<PaginationState>(() => ({
    ...this.pageState(), totalItems: this.filteredRows().length,
  }));
  readonly pagedRows = computed(() => {
    const page = this.pageState().page ?? 1;
    return this.filteredRows().slice((page - 1) * 5, page * 5);
  });
  readonly allVisibleSelected = computed(() => this.pagedRows().length > 0
    && this.pagedRows().every((row) => this.selectedIds().has(row.id)));
  readonly someVisibleSelected = computed(() => !this.allVisibleSelected()
    && this.pagedRows().some((row) => this.selectedIds().has(row.id)));

  updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.goToFirstPage();
  }
  updateStatus(status: StatusFilter | StatusFilter[] | null): void {
    this.statusFilter.set(status);
    this.goToFirstPage();
  }
  updatePagination(state: PaginationState): void {
    this.pageState.set(state);
  }
  sortBy(key: SortKey): void {
    if (this.sortKey() === key) {
      this.ascending.update((value) => !value);
    } else {
      this.sortKey.set(key);
      this.ascending.set(true);
    }
    this.goToFirstPage();
  }
  sortIcon(key: SortKey): 'arrow_upward' | 'arrow_downward' | 'unfold_more' {
    return this.sortKey() === key
      ? this.ascending() ? 'arrow_upward' : 'arrow_downward'
      : 'unfold_more';
  }
  sortAriaLabel(column: Column): string {
    if (this.sortKey() !== column.key) {
      return 'Sort by ' + column.label.toLowerCase();
    }
    return 'Sort by ' + column.label.toLowerCase() + ' '
      + (this.ascending() ? 'descending' : 'ascending');
  }
  ariaSort(key: SortKey): 'ascending' | 'descending' | null {
    return this.sortKey() === key ? (this.ascending() ? 'ascending' : 'descending') : null;
  }
  toggleRow(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update((ids) => {
      const next = new Set(ids); checked ? next.add(id) : next.delete(id); return next;
    });
  }
  toggleVisible(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      this.pagedRows().forEach((row) => checked ? next.add(row.id) : next.delete(row.id));
      return next;
    });
  }
  clearGrid(): void {
    this.query.set('');
    this.statusFilter.set('all');
    this.selectedIds.set(new Set());
    this.sortKey.set('due');
    this.ascending.set(true);
    this.goToFirstPage();
  }
  statusKind(status: Status): BadgeKind {
    return status === 'Paid' ? 'success' : status === 'Pending' ? 'warning' : 'danger';
  }
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
    }).format(amount);
  }
  private goToFirstPage(): void {
    this.pageState.update((state) => ({ ...state, page: 1 }));
  }
}`,
    basic: `import { Component } from '@angular/core';

@Component({
  selector: 'app-basic-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Recent Invoices</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Invoice</th>
            <th scope="col" class="text-start">Customer</th>
            <th scope="col" class="text-start">Status</th>
            <th scope="col" class="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">INV-2048</td>
            <td class="text-start">Northwind Studio</td>
            <td class="text-start">Paid</td>
            <td class="text-end">$4,200.00</td>
          </tr>
          <tr>
            <td class="text-start">INV-2049</td>
            <td class="text-start">Acme Supply</td>
            <td class="text-start">Pending</td>
            <td class="text-end">$1,180.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class BasicTableExample {}`,
    compact: `import { Component } from '@angular/core';

@Component({
  selector: 'app-compact-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table table-compact">
        <caption>Compact Queue</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Task</th>
            <th scope="col" class="text-start">Owner</th>
            <th scope="col" class="text-start">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Review copy</td>
            <td class="text-start">Mina</td>
            <td class="text-start">Today</td>
          </tr>
          <tr>
            <td class="text-start">Publish notes</td>
            <td class="text-start">Omar</td>
            <td class="text-start">Tomorrow</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class CompactTableExample {}`,
    stripedHover: `import { Component } from '@angular/core';

@Component({
  selector: 'app-striped-hover-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table table-striped table-hover">
        <caption>Team Availability</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Name</th>
            <th scope="col" class="text-start">Role</th>
            <th scope="col" class="text-start">Availability</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Layla</td>
            <td class="text-start">Design</td>
            <td class="text-start">Available</td>
          </tr>
          <tr>
            <td class="text-start">Samir</td>
            <td class="text-start">Engineering</td>
            <td class="text-start">In review</td>
          </tr>
          <tr>
            <td class="text-start">Nadia</td>
            <td class="text-start">Research</td>
            <td class="text-start">Focused</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class StripedHoverTableExample {}`,
    numeric: `import { Component } from '@angular/core';

@Component({
  selector: 'app-numeric-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Plan Usage</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Plan</th>
            <th scope="col" class="text-end">Seats</th>
            <th scope="col" class="text-end">Usage</th>
            <th scope="col" class="text-end">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Starter</td>
            <td class="text-end">12</td>
            <td class="text-end">68%</td>
            <td class="text-end">$240</td>
          </tr>
          <tr>
            <td class="text-start">Business</td>
            <td class="text-end">48</td>
            <td class="text-end">81%</td>
            <td class="text-end">$1,920</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class NumericTableExample {}`,
    empty: `import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Invitations</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Email</th>
            <th scope="col" class="text-start">Role</th>
            <th scope="col" class="text-start">Sent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-empty" colspan="3">No invitations have been sent.</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class EmptyTableExample {}`,
    loading: `import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Sync History</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Source</th>
            <th scope="col" class="text-start">Status</th>
            <th scope="col" class="text-start">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-loading" colspan="3">Loading sync history...</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class LoadingTableExample {}`,
    rtl: `import { Component } from '@angular/core';

@Component({
  selector: 'app-rtl-table-example',
  template: \`
    <div class="table-wrapper" dir="rtl">
      <table class="table">
        <caption>الفواتير الأخيرة</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">الفاتورة</th>
            <th scope="col" class="text-start">العميل</th>
            <th scope="col" class="text-end">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">INV-2050</td>
            <td class="text-start">استوديو الدوحة</td>
            <td class="text-end">ر.ق ٣٬٤٠٠</td>
          </tr>
          <tr>
            <td class="text-start">INV-2051</td>
            <td class="text-start">شركة الخليج</td>
            <td class="text-end">ر.ق ١٬٢٥٠</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class RtlTableExample {}`,
  };
}
