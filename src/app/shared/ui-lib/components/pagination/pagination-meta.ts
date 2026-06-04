import type { PaginationAlignment, PaginationState } from './pagination-state';

export interface PaginationMeta {
  page: number;
  totalItems: number;
  pageSize: number;
  siblingCount: number;
  disabled: boolean;
  ariaLabel: string;
  totalPages: number;
  itemStart: number;
  itemEnd: number;
  hasPrevious: boolean;
  hasNext: boolean;
  showSummary: boolean;
  alignment: PaginationAlignment;
}

export function getPaginationMeta(state: PaginationState): PaginationMeta {
  const totalItems = Math.max(0, integerOrDefault(state.totalItems, 0));
  const pageSize = Math.max(1, integerOrDefault(state.pageSize, 10));
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = clampPage(integerOrDefault(state.page, 1), totalPages);
  const itemStart = totalItems <= 0 ? 0 : (page - 1) * pageSize + 1;
  const itemEnd = Math.min(page * pageSize, totalItems);

  return {
    page,
    totalItems,
    pageSize,
    siblingCount: Math.max(0, integerOrDefault(state.siblingCount, 1)),
    disabled: state.disabled ?? false,
    ariaLabel: state.ariaLabel?.trim() || 'Pagination',
    totalPages,
    itemStart,
    itemEnd,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    showSummary: state.showSummary ?? true,
    alignment: normalizeAlignment(state.alignment),
  };
}

function clampPage(page: number, totalPages: number): number {
  const normalizedPage = Math.trunc(page) || 1;

  return Math.min(Math.max(normalizedPage, 1), totalPages);
}

function integerOrDefault(value: number | null | undefined, fallback: number): number {
  const normalizedValue = Math.trunc(value ?? fallback);

  return Number.isFinite(normalizedValue) ? normalizedValue : fallback;
}

function normalizeAlignment(alignment: PaginationState['alignment']): PaginationAlignment {
  switch (alignment) {
    case 'start':
    case 'center':
    case 'end':
      return alignment;
    default:
      return 'end';
  }
}
