import type { SearchDataType, SearchOperator } from './search-query-form-types';

const STRING_OPERATORS: readonly SearchOperator[] = [
  'eq',
  'neq',
  'contains',
  'startsWith',
  'endsWith',
  'in',
];

const NUMERIC_OPERATORS: readonly SearchOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'in',
];

const DATE_OPERATORS: readonly SearchOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
];

const BOOLEAN_OPERATORS: readonly SearchOperator[] = ['eq', 'neq'];
const ENUM_OPERATORS: readonly SearchOperator[] = ['eq', 'neq', 'in'];

export const SEARCH_OPERATOR_LABELS: Record<SearchOperator, string> = {
  eq: 'Equals',
  neq: 'Does not equal',
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
  between: 'Between',
  in: 'In',
};

export function getDefaultSearchOperator(dataType: SearchDataType): SearchOperator {
  switch (dataType) {
    case 'string':
      return 'contains';
    case 'int':
    case 'long':
    case 'decimal':
    case 'date':
    case 'time':
    case 'dateTime':
      return 'between';
    case 'boolean':
    case 'enum':
    case 'guid':
      return 'eq';
  }
}

export function getCompatibleSearchOperators(dataType: SearchDataType): readonly SearchOperator[] {
  switch (dataType) {
    case 'string':
      return STRING_OPERATORS;
    case 'int':
    case 'long':
    case 'decimal':
      return NUMERIC_OPERATORS;
    case 'date':
    case 'time':
    case 'dateTime':
      return DATE_OPERATORS;
    case 'boolean':
      return BOOLEAN_OPERATORS;
    case 'enum':
    case 'guid':
      return ENUM_OPERATORS;
  }
}

export function isSearchOperatorCompatible(
  dataType: SearchDataType,
  operator: SearchOperator,
): boolean {
  return getCompatibleSearchOperators(dataType).includes(operator);
}
