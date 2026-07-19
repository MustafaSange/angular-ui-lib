import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PaginationComponent,
  PaginationState,
  getPaginationMeta,
} from '../../shared/ui-lib/components/pagination';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink, PaginationComponent, ShowcaseCode],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  protected readonly basicState = signal<PaginationState>({
    page: 1,
    totalItems: 245,
    pageSize: 10,
  });
  protected readonly denseState = signal<PaginationState>({
    page: 18,
    totalItems: 980,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    siblingCount: 1,
  });
  protected readonly disabledState = signal<PaginationState>({
    page: 4,
    totalItems: 120,
    pageSize: 10,
    disabled: true,
  });
  protected readonly summaryOffState = signal<PaginationState>({
    page: 2,
    totalItems: 90,
    pageSize: 10,
    showSummary: false,
    alignment: 'center',
  });
  protected readonly pageSizeOffState = signal<PaginationState>({
    page: 2,
    totalItems: 90,
    pageSize: 10,
    showPageSizeSelector: false,
    alignment: 'center',
  });
  protected readonly startAlignedState = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'start',
  });
  protected readonly centerAlignedState = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'center',
  });
  protected readonly endAlignedState = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'end',
  });
  protected readonly rtlState = signal<PaginationState>({
    page: 3,
    totalItems: 84,
    pageSize: 12,
    ariaLabel: 'ترقيم الصفحات',
  });
  protected readonly basicMeta = computed(() => getPaginationMeta(this.basicState()));
  protected readonly basicRequest = signal({ page: 1, pageSize: 10 });
  protected readonly denseMeta = computed(() => getPaginationMeta(this.denseState()));

  protected handleBasicPaginationChange(state: PaginationState): void {
    this.basicState.set(state);

    const { page, pageSize } = getPaginationMeta(state);

    this.loadBasicRecords(page, pageSize);
  }

  private loadBasicRecords(page: number, pageSize: number): void {
    this.basicRequest.set({ page, pageSize });
  }

  protected readonly basicSnippet = `import { Component, computed, signal } from '@angular/core';

import { PaginationComponent, PaginationState, getPaginationMeta, } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-basic-example', imports: [PaginationComponent], template: \`
    <ms-pagination
      [state]="pagination()"
      (stateChange)="onPaginationChange($event)"
    />
    <p>
      Page {{ paginationMeta().page }} of {{ paginationMeta().totalPages }}
    </p>
    <p>
      Last request: page {{ lastRequest().page }},
      page size {{ lastRequest().pageSize }}
    </p>
  \`, })
export class PaginationBasicExample {
  readonly pagination = signal<PaginationState>({
    page: 1, totalItems: 245, pageSize: 10, });
  readonly paginationMeta = computed(() => getPaginationMeta(this.pagination()));
  readonly lastRequest = signal({ page: 1, pageSize: 10 });

  onPaginationChange(state: PaginationState): void {
    this.pagination.set(state);

    const { page, pageSize } = getPaginationMeta(state);

    this.loadRecords(page, pageSize);
  }

  private loadRecords(page: number, pageSize: number): void {
    // Replace this with your API or data-service call.
    this.lastRequest.set({ page, pageSize });
  }
}`;

  protected readonly ellipsisSnippet = `import { Component, computed, signal } from '@angular/core';

import { PaginationComponent, PaginationState, getPaginationMeta, } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-ellipsis-example', imports: [PaginationComponent], template: \`
    <ms-pagination [(state)]="pagination" />
    <p>
      Showing {{ paginationMeta().itemStart }}-{{ paginationMeta().itemEnd }}
      of {{ paginationMeta().totalItems }}
    </p>
  \`, })
export class PaginationEllipsisExample {
  readonly pagination = signal<PaginationState>({
    page: 18, totalItems: 980, pageSize: 10,
    pageSizeOptions: [10, 20, 50], siblingCount: 1, });
  readonly paginationMeta = computed(() => getPaginationMeta(this.pagination()));
}`;

  protected readonly summaryOffSnippet = `import { Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-optional-details-example', imports: [PaginationComponent], template: \`
    <ms-pagination [(state)]="summaryHidden" />
    <ms-pagination [(state)]="pageSizeHidden" />
  \`, })
export class PaginationOptionalDetailsExample {
  readonly summaryHidden = signal<PaginationState>({
    page: 2, totalItems: 90, pageSize: 10, showSummary: false, alignment: 'center', });
  readonly pageSizeHidden = signal<PaginationState>({
    page: 2, totalItems: 90, pageSize: 10,
    showPageSizeSelector: false, alignment: 'center', });
}`;

  protected readonly alignmentSnippet = `import { Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-alignment-example', imports: [PaginationComponent], template: \`
    <ms-pagination [(state)]="startAligned" />
    <ms-pagination [(state)]="centerAligned" />
    <ms-pagination [(state)]="endAligned" />
  \`, })
export class PaginationAlignmentExample {
  readonly startAligned = signal<PaginationState>({
    page: 3, totalItems: 160, pageSize: 10, alignment: 'start', });
  readonly centerAligned = signal<PaginationState>({
    page: 3, totalItems: 160, pageSize: 10, alignment: 'center', });
  readonly endAligned = signal<PaginationState>({
    page: 3, totalItems: 160, pageSize: 10, alignment: 'end', });
}`;

  protected readonly disabledSnippet = `import { Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-disabled-example', imports: [PaginationComponent], template: \`
    <ms-pagination [(state)]="pagination" />
  \`, })
export class PaginationDisabledExample {
  readonly pagination = signal<PaginationState>({
    page: 4, totalItems: 120, pageSize: 10, disabled: true, });
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/ui-lib';

@Component({
  selector: 'app-pagination-rtl-example',
  imports: [PaginationComponent],
  template: \`
    <div dir="rtl">
      <ms-pagination [(state)]="pagination" />
    </div>
  \`,
})
export class PaginationRtlExample {
  readonly pagination = signal<PaginationState>({
    page: 3,
    totalItems: 84,
    pageSize: 12,
    ariaLabel: 'ترقيم الصفحات',
  });
}`;
}
