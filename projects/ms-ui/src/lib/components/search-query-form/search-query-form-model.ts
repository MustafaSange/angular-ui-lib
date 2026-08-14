import type { SearchOperator } from '../../search-query/search-query-types';

export interface SearchQueryFormFilterModel {
  readonly id: string;
  readonly property: string;
  readonly operator: SearchOperator;
  readonly value: string;
  readonly from: string;
  readonly to: string;
  readonly values: string[];
  readonly customValues: string[];
  readonly customValueInput: string;
  readonly customValueStatus: string;
  readonly locked: boolean;
}

export interface SearchQueryFormSortModel {
  readonly property: string;
  readonly direction: string;
}

export interface SearchQueryFormModel {
  readonly filters: readonly SearchQueryFormFilterModel[];
  readonly sorts: readonly SearchQueryFormSortModel[];
}

export type SearchQueryFormValueFields = Pick<
  SearchQueryFormFilterModel,
  'value' | 'from' | 'to' | 'values' | 'customValues' | 'customValueInput' | 'customValueStatus'
>;

export interface SearchInValuePreviewItem {
  readonly value: string;
  readonly label: string;
  readonly custom: boolean;
}
