export type PaginationAlignment = 'start' | 'center' | 'end';

export interface PaginationState {
  page?: number;
  totalItems?: number;
  pageSize?: number;
  siblingCount?: number;
  disabled?: boolean;
  ariaLabel?: string;
  showSummary?: boolean;
  alignment?: PaginationAlignment;
}
