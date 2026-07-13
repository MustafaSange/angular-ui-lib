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

export type SearchStringOperator = Extract<
  SearchOperator,
  | 'eq'
  | 'neq'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'isNull'
  | 'isEmpty'
  | 'isNullOrEmpty'
  | 'isNotNull'
  | 'isNotEmpty'
  | 'isNotNullOrEmpty'
>;

export type SearchNumericOperator = Extract<
  SearchOperator,
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'isNull' | 'isNotNull'
>;

export type SearchDateOperator = Extract<
  SearchOperator,
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'isNull' | 'isNotNull'
>;

export type SearchBooleanOperator = Extract<SearchOperator, 'eq' | 'neq' | 'isNull' | 'isNotNull'>;

export type SearchEnumOperator = Extract<
  SearchOperator,
  'eq' | 'neq' | 'in' | 'isNull' | 'isNotNull'
>;

export const SEARCH_SORT_DIRECTION = {
  ASCENDING: 0,
  DESCENDING: 1,
} as const;

export type SearchSortDirection =
  (typeof SEARCH_SORT_DIRECTION)[keyof typeof SEARCH_SORT_DIRECTION];

export interface SearchSortOption {
  readonly label: string;
  readonly value: string;
}

export type SearchScalarValue = string | number | boolean;

export interface SearchBetweenValue<T extends SearchScalarValue = SearchScalarValue> {
  readonly from: T | null;
  readonly to: T | null;
}

export type SearchRequestValue =
  | SearchScalarValue
  | readonly SearchScalarValue[]
  | SearchBetweenValue;

export interface SearchPropertyOption<T extends SearchScalarValue = SearchScalarValue> {
  readonly label: string;
  readonly value: T;
}

export interface SearchPropertyConfigBase {
  readonly propertyName: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly allowCustomInValues?: boolean;
  readonly maxInValues?: number;
}

export interface SearchStringPropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'string';
  readonly defaultOperator?: SearchStringOperator;
  readonly defaultValue?: string | readonly string[];
  readonly allowedOperators?: readonly SearchStringOperator[];
  readonly options?: readonly SearchPropertyOption<string>[];
  readonly maxStringLength?: number;
}

export interface SearchNumericPropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'int' | 'long' | 'decimal';
  readonly defaultOperator?: SearchNumericOperator;
  readonly defaultValue?: number | readonly number[] | SearchBetweenValue<number>;
  readonly allowedOperators?: readonly SearchNumericOperator[];
  readonly options?: readonly SearchPropertyOption<number>[];
}

export interface SearchDatePropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'date' | 'time' | 'dateTime';
  readonly defaultOperator?: SearchDateOperator;
  readonly defaultValue?: string | readonly string[] | SearchBetweenValue<string>;
  readonly allowedOperators?: readonly SearchDateOperator[];
  readonly options?: readonly SearchPropertyOption<string>[];
}

export interface SearchBooleanPropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'boolean';
  readonly defaultOperator?: SearchBooleanOperator;
  readonly defaultValue?: boolean;
  readonly allowedOperators?: readonly SearchBooleanOperator[];
  readonly booleanLabels?: 'trueFalse' | 'yesNo';
}

export interface SearchEnumPropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'enum';
  readonly defaultOperator?: SearchEnumOperator;
  readonly defaultValue?: string | number | readonly (string | number)[];
  readonly allowedOperators?: readonly SearchEnumOperator[];
  readonly options?: readonly SearchPropertyOption<string | number>[];
}

export interface SearchGuidPropertyConfig extends SearchPropertyConfigBase {
  readonly dataType: 'guid';
  readonly defaultOperator?: SearchEnumOperator;
  readonly defaultValue?: string | readonly string[];
  readonly allowedOperators?: readonly SearchEnumOperator[];
  readonly options?: readonly SearchPropertyOption<string>[];
}

export type SearchPropertyConfig =
  | SearchStringPropertyConfig
  | SearchNumericPropertyConfig
  | SearchDatePropertyConfig
  | SearchBooleanPropertyConfig
  | SearchEnumPropertyConfig
  | SearchGuidPropertyConfig;

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

export interface SearchSortConfig {
  readonly sortOptions: readonly SearchSortOption[];
  /** Ordered sorts restored on initialization and Clear. Defaults to the first option ascending. */
  readonly defaultSorts?: readonly SearchSortRequest[];
  /** Maximum number of active sorts. Defaults to 1 and cannot exceed the option count. */
  readonly maxSorts?: number;
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
