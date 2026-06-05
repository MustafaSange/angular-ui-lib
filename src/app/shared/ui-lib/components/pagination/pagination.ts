import { Component, computed, model } from '@angular/core';

import { getPaginationMeta } from './pagination-meta';
import type { PaginationState } from './pagination-state';

type PaginationItem =
  | {
      kind: 'page';
      page: number;
    }
  | {
      kind: 'ellipsis';
      key: 'start' | 'end';
    };

@Component({
  selector: 'ms-pagination',
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  readonly state = model<PaginationState>({});

  protected readonly meta = computed(() => getPaginationMeta(this.state()));
  protected readonly totalItems = computed(() => this.meta().totalItems);
  protected readonly safeSiblingCount = computed(() => this.meta().siblingCount);
  protected readonly disabled = computed(() => this.meta().disabled);
  protected readonly ariaLabel = computed(() => this.meta().ariaLabel);
  protected readonly showSummary = computed(() => this.meta().showSummary);
  protected readonly alignment = computed(() => this.meta().alignment);
  protected readonly totalPages = computed(() => this.meta().totalPages);
  protected readonly currentPage = computed(() => this.meta().page);
  protected readonly previousPage = computed(() => Math.max(1, this.meta().page - 1));
  protected readonly nextPage = computed(() =>
    Math.min(this.meta().totalPages, this.meta().page + 1),
  );
  protected readonly hasPrevious = computed(() => this.meta().hasPrevious);
  protected readonly hasNext = computed(() => this.meta().hasNext);
  protected readonly itemStart = computed(() => this.meta().itemStart);
  protected readonly itemEnd = computed(() => this.meta().itemEnd);
  protected readonly items = computed<PaginationItem[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    const siblingCount = this.safeSiblingCount();
    const visibleSlots = siblingCount * 2 + 5;

    if (totalPages <= visibleSlots) {
      return this.range(1, totalPages).map((page) => ({ kind: 'page', page }));
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showStartEllipsis = leftSibling > 2;
    const showEndEllipsis = rightSibling < totalPages - 1;
    const items: PaginationItem[] = [{ kind: 'page', page: 1 }];

    if (showStartEllipsis) {
      items.push({ kind: 'ellipsis', key: 'start' });
    } else {
      this.range(2, leftSibling - 1).forEach((page) => items.push({ kind: 'page', page }));
    }

    this.range(leftSibling === 1 ? 2 : leftSibling, rightSibling).forEach((page) => {
      if (page !== 1 && page !== totalPages) {
        items.push({ kind: 'page', page });
      }
    });

    if (showEndEllipsis) {
      items.push({ kind: 'ellipsis', key: 'end' });
    } else {
      this.range(rightSibling + 1, totalPages - 1).forEach((page) =>
        items.push({ kind: 'page', page }),
      );
    }

    items.push({ kind: 'page', page: totalPages });

    return items;
  });

  protected goToPage(page: number): void {
    const targetPage = clampPage(page, this.totalPages());

    if (this.disabled() || targetPage === this.currentPage()) {
      return;
    }

    this.state.update((state) => ({ ...state, page: targetPage }));
  }

  protected trackItem(_index: number, item: PaginationItem): string {
    return item.kind === 'page' ? `page-${item.page}` : `ellipsis-${item.key}`;
  }

  private range(start: number, end: number): number[] {
    if (end < start) {
      return [];
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}

function clampPage(page: number, totalPages: number): number {
  const normalizedPage = Math.trunc(page) || 1;

  return Math.min(Math.max(normalizedPage, 1), totalPages);
}
