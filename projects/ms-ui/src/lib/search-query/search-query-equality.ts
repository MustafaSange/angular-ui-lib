import type {
  SearchBetweenValue,
  SearchQueryFormFilter,
  SearchQueryFormState,
  SearchRequestValue,
  SearchScalarValue,
  SearchSortRequest,
} from './search-query-types';

export function areSearchQueryStatesEqual(
  current: SearchQueryFormState,
  expected: SearchQueryFormState,
): boolean {
  return (
    current.page === expected.page &&
    current.limit === expected.limit &&
    areArraysEqual(current.filters, expected.filters, areSearchFiltersEqual) &&
    areOptionalArraysEqual(current.sort, expected.sort, areSearchSortRequestsEqual)
  );
}

function areSearchFiltersEqual(
  current: SearchQueryFormFilter,
  expected: SearchQueryFormFilter,
): boolean {
  return (
    current.id === expected.id &&
    current.property === expected.property &&
    current.operator === expected.operator &&
    current.locked === expected.locked &&
    areSearchRequestValuesEqual(current.value, expected.value)
  );
}

function areSearchSortRequestsEqual(
  current: SearchSortRequest,
  expected: SearchSortRequest,
): boolean {
  return current.property === expected.property && current.direction === expected.direction;
}

function areSearchRequestValuesEqual(
  current: SearchRequestValue | null,
  expected: SearchRequestValue | null,
): boolean {
  if (Object.is(current, expected)) {
    return true;
  }

  if (current === null || expected === null) {
    return false;
  }

  if (isSearchScalarArray(current) || isSearchScalarArray(expected)) {
    return (
      isSearchScalarArray(current) &&
      isSearchScalarArray(expected) &&
      areArraysEqual(current, expected, areScalarsEqual)
    );
  }

  if (typeof current === 'object' || typeof expected === 'object') {
    return (
      typeof current === 'object' &&
      typeof expected === 'object' &&
      areBetweenValuesEqual(current, expected)
    );
  }

  return false;
}

function isSearchScalarArray(value: SearchRequestValue): value is readonly SearchScalarValue[] {
  return Array.isArray(value);
}

function areBetweenValuesEqual(current: SearchBetweenValue, expected: SearchBetweenValue): boolean {
  return areScalarsEqual(current.from, expected.from) && areScalarsEqual(current.to, expected.to);
}

function areScalarsEqual(
  current: SearchScalarValue | null,
  expected: SearchScalarValue | null,
): boolean {
  return Object.is(current, expected);
}

function areOptionalArraysEqual<T>(
  current: readonly T[] | undefined,
  expected: readonly T[] | undefined,
  equals: (currentItem: T, expectedItem: T) => boolean,
): boolean {
  if (current === undefined || expected === undefined) {
    return current === expected;
  }

  return areArraysEqual(current, expected, equals);
}

function areArraysEqual<T>(
  current: readonly T[],
  expected: readonly T[],
  equals: (currentItem: T, expectedItem: T) => boolean,
): boolean {
  return (
    current.length === expected.length &&
    current.every((currentItem, index) => equals(currentItem, expected[index]))
  );
}
