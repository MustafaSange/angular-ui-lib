import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PaginationComponent,
  PaginationState,
  getPaginationMeta,
} from '../../shared/components/pagination';
import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink, PaginationComponent, ShowcaseCode],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    alignment: 'start',
  });
  protected readonly basicMeta = computed(() => getPaginationMeta(this.basicState()));
  protected readonly denseMeta = computed(() => getPaginationMeta(this.denseState()));

  protected readonly basicSnippet = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  PaginationComponent,
  PaginationState,
  getPaginationMeta,
} from './shared/components/pagination';

@Component({
  selector: 'app-pagination-basic-example',
  imports: [PaginationComponent],
  template: \`
    <ms-pagination [(state)]="pagination" />
    <p>
      Page {{ paginationMeta().page }} of {{ paginationMeta().totalPages }}
    </p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBasicExample {
  readonly pagination = signal<PaginationState>({
    page: 1,
    totalItems: 245,
    pageSize: 10,
  });
  readonly paginationMeta = computed(() => getPaginationMeta(this.pagination()));
}`;

  protected readonly ellipsisSnippet = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  PaginationComponent,
  PaginationState,
  getPaginationMeta,
} from './shared/components/pagination';

@Component({
  selector: 'app-pagination-ellipsis-example',
  imports: [PaginationComponent],
  template: \`
    <ms-pagination [(state)]="pagination" />
    <p>
      Showing {{ paginationMeta().itemStart }}-{{ paginationMeta().itemEnd }}
      of {{ paginationMeta().totalItems }}
    </p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationEllipsisExample {
  readonly pagination = signal<PaginationState>({
    page: 18,
    totalItems: 980,
    pageSize: 10,
    siblingCount: 1,
  });
  readonly paginationMeta = computed(() => getPaginationMeta(this.pagination()));
}`;

  protected readonly summaryOffSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/components/pagination';

@Component({
  selector: 'app-pagination-summary-off-example',
  imports: [PaginationComponent],
  template: \`
    <ms-pagination [(state)]="pagination" />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationSummaryOffExample {
  readonly pagination = signal<PaginationState>({
    page: 2,
    totalItems: 90,
    pageSize: 10,
    showSummary: false,
    alignment: 'center',
  });
}`;

  protected readonly alignmentSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/components/pagination';

@Component({
  selector: 'app-pagination-alignment-example',
  imports: [PaginationComponent],
  template: \`
    <ms-pagination [(state)]="startAligned" />
    <ms-pagination [(state)]="centerAligned" />
    <ms-pagination [(state)]="endAligned" />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationAlignmentExample {
  readonly startAligned = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'start',
  });
  readonly centerAligned = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'center',
  });
  readonly endAligned = signal<PaginationState>({
    page: 3,
    totalItems: 160,
    pageSize: 10,
    alignment: 'end',
  });
}`;

  protected readonly disabledSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/components/pagination';

@Component({
  selector: 'app-pagination-disabled-example',
  imports: [PaginationComponent],
  template: \`
    <ms-pagination [(state)]="pagination" />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationDisabledExample {
  readonly pagination = signal<PaginationState>({
    page: 4,
    totalItems: 120,
    pageSize: 10,
    disabled: true,
  });
}`;

  protected readonly rtlSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PaginationComponent, PaginationState } from './shared/components/pagination';

@Component({
  selector: 'app-pagination-rtl-example',
  imports: [PaginationComponent],
  template: \`
    <div dir="rtl">
      <ms-pagination [(state)]="pagination" />
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationRtlExample {
  readonly pagination = signal<PaginationState>({
    page: 3,
    totalItems: 84,
    pageSize: 12,
    ariaLabel: 'ترقيم الصفحات',
    alignment: 'start',
  });
}`;
}
