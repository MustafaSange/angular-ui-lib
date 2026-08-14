export type PaginationAlignment = 'start' | 'center' | 'end';

export const DEFAULT_PAGINATION_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100] as const;

export interface PaginationState {
  page?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  siblingCount?: number;
  disabled?: boolean;
  ariaLabel?: string;
  showSummary?: boolean;
  showPageSizeSelector?: boolean;
  alignment?: PaginationAlignment;
}
