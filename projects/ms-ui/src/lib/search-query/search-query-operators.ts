import type { SearchDataType, SearchOperator } from './search-query-types';

const STRING_OPERATORS: readonly SearchOperator[] = [
  'eq',
  'neq',
  'contains',
  'startsWith',
  'endsWith',
  'in',
  'isNull',
  'isEmpty',
  'isNullOrEmpty',
  'isNotNull',
  'isNotEmpty',
  'isNotNullOrEmpty',
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
  'isNull',
  'isNotNull',
];

const DATE_OPERATORS: readonly SearchOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'in',
  'isNull',
  'isNotNull',
];

const BOOLEAN_OPERATORS: readonly SearchOperator[] = ['eq', 'neq', 'isNull', 'isNotNull'];
const ENUM_OPERATORS: readonly SearchOperator[] = ['eq', 'neq', 'in', 'isNull', 'isNotNull'];
const VALUELESS_OPERATORS: readonly SearchOperator[] = [
  'isNull',
  'isEmpty',
  'isNullOrEmpty',
  'isNotNull',
  'isNotEmpty',
  'isNotNullOrEmpty',
];

export const SEARCH_OPERATOR_LABELS: Record<SearchOperator, string> = {
  eq: 'Equals',
  neq: 'Does Not Equal',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  gt: 'Greater Than',
  gte: 'Greater Than Or Equal',
  lt: 'Less Than',
  lte: 'Less Than Or Equal',
  between: 'Between',
  in: 'In',
  isNull: 'Is Null',
  isEmpty: 'Is Empty',
  isNullOrEmpty: 'Is Null Or Empty',
  isNotNull: 'Is Not Null',
  isNotEmpty: 'Is Not Empty',
  isNotNullOrEmpty: 'Is Not Null Or Empty',
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

export function isValuelessSearchOperator(operator: SearchOperator): boolean {
  return VALUELESS_OPERATORS.includes(operator);
}
