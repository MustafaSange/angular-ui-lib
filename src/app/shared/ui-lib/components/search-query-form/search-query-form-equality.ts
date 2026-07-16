import type {
  SearchQueryFormFilterModel,
  SearchQueryFormModel,
  SearchQueryFormSortModel,
} from './search-query-form-model';

export function areSearchQueryFormModelsEqual(
  current: SearchQueryFormModel,
  expected: SearchQueryFormModel,
): boolean {
  return (
    arraysEqual(current.filters, expected.filters, areFilterModelsEqual) &&
    areSearchSortModelsEqual(current.sorts, expected.sorts)
  );
}

export function areSearchSortModelsEqual(
  current: readonly SearchQueryFormSortModel[],
  expected: readonly SearchQueryFormSortModel[],
): boolean {
  return arraysEqual(
    current,
    expected,
    (currentSort, expectedSort) =>
      currentSort.property === expectedSort.property &&
      currentSort.direction === expectedSort.direction,
  );
}

function areFilterModelsEqual(
  current: SearchQueryFormFilterModel,
  expected: SearchQueryFormFilterModel,
): boolean {
  return (
    current.id === expected.id &&
    current.property === expected.property &&
    current.operator === expected.operator &&
    current.value === expected.value &&
    current.from === expected.from &&
    current.to === expected.to &&
    arraysEqual(current.values, expected.values, Object.is) &&
    arraysEqual(current.customValues, expected.customValues, Object.is) &&
    current.customValueInput === expected.customValueInput &&
    current.customValueStatus === expected.customValueStatus &&
    current.locked === expected.locked
  );
}

function arraysEqual<T>(
  current: readonly T[],
  expected: readonly T[],
  equals: (currentItem: T, expectedItem: T) => boolean,
): boolean {
  return (
    current.length === expected.length &&
    current.every((currentItem, index) => equals(currentItem, expected[index]))
  );
}
