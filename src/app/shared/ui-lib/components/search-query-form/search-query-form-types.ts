export type SearchDataType =
  | 'string'
  | 'int'
  | 'long'
  | 'decimal'
  | 'date'
  | 'time'
  | 'dateTime'
  | 'boolean'
  | 'enum'
  | 'guid';

export type SearchOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'isNull'
  | 'isEmpty'
  | 'isNullOrEmpty'
  | 'isNotNull'
  | 'isNotEmpty'
  | 'isNotNullOrEmpty';

export type SearchSortDirection = 0 | 1;

export type SearchScalarValue = string | number | boolean;

export interface SearchBetweenValue {
  readonly from: SearchScalarValue | null;
  readonly to: SearchScalarValue | null;
}

export type SearchRequestValue =
  | SearchScalarValue
  | readonly SearchScalarValue[]
  | SearchBetweenValue;

export interface SearchPropertyOption {
  readonly label: string;
  readonly value: SearchScalarValue;
}

export interface SearchPropertyConfig {
  readonly propertyName: string;
  readonly label?: string;
  readonly dataType: SearchDataType;
  readonly required?: boolean;
  readonly defaultOperator?: SearchOperator;
  readonly defaultValue?: SearchRequestValue;
  readonly allowedOperators?: readonly SearchOperator[];
  readonly options?: readonly SearchPropertyOption[];
  readonly placeholder?: string;
  readonly maxStringLength?: number;
}

export interface SearchQueryFormFilter {
  readonly id: string;
  readonly property: string;
  readonly operator: SearchOperator;
  readonly value: SearchRequestValue | null;
  readonly locked?: boolean;
}

export interface SearchSortRequest {
  readonly property: string;
  readonly direction: SearchSortDirection;
}

export interface SearchQueryFormState {
  readonly page?: number;
  readonly limit?: number;
  readonly filters: readonly SearchQueryFormFilter[];
  readonly sort?: readonly SearchSortRequest[];
}

export interface PaginatedSearchRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly filters?: readonly SearchFilterRequest[];
  readonly sort?: readonly SearchSortRequest[];
}

export interface SearchFilterRequest {
  readonly property: string;
  readonly operator: SearchOperator;
  readonly value: SearchRequestValue | null;
}

export interface PaginatedResponse<T> {
  readonly page: number;
  readonly limit: number;
  readonly counts: number;
  readonly pages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly data: readonly T[];
}
