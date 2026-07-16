import { isBetweenValue } from './search-query-builder';
import {
  getCompatibleSearchOperators,
  getDefaultSearchOperator,
  isValuelessSearchOperator,
} from './search-query-operators';
import {
  normalizeSearchSortOptions,
  normalizeSearchSorts,
  resolveDefaultSearchSorts,
  resolveSearchSortLimit,
} from './search-query-sort';
import type {
  SearchOperator,
  SearchPropertyConfig,
  SearchPropertyOption,
  SearchQueryFormFilter,
  SearchQueryFormState,
  SearchRequestValue,
  SearchScalarValue,
  SearchSortConfig,
} from './search-query-types';
import {
  DEFAULT_SEARCH_MAX_IN_VALUES,
  getSearchScalarError,
  isSearchRangeReversed,
  parseCustomSearchValue,
  stringifySearchScalar,
} from './search-query-value';

let nextSharedFilterId = 0;

export interface ReconcileSearchStateOptions {
  readonly maxFilters?: number;
  readonly idPrefix?: string;
}

export function assertSearchProperties(properties: readonly SearchPropertyConfig[]): void {
  const names = new Set<string>();

  for (const property of properties) {
    if (!property.propertyName || property.propertyName.trim() !== property.propertyName) {
      throw new Error('Search property names must be non-empty and already trimmed.');
    }

    if (names.has(property.propertyName)) {
      throw new Error(`Duplicate search property name: ${property.propertyName}`);
    }

    names.add(property.propertyName);
  }
}

export function getSearchPropertyOptions(
  property: SearchPropertyConfig,
): readonly SearchPropertyOption[] {
  if (property.dataType === 'boolean') {
    const yesNo = property.booleanLabels === 'yesNo';
    return [
      { label: yesNo ? 'Yes' : 'True', value: true },
      { label: yesNo ? 'No' : 'False', value: false },
    ];
  }

  return property.options ?? [];
}

export function getAllowedSearchOperators(
  property: SearchPropertyConfig,
): readonly SearchOperator[] {
  const compatible = getCompatibleSearchOperators(property.dataType);
  const configured = property.allowedOperators ?? compatible;
  const canUseIn =
    getSearchPropertyOptions(property).length > 0 || property.allowCustomInValues === true;

  return configured.filter(
    (operator) => compatible.includes(operator) && (operator !== 'in' || canUseIn),
  );
}

export function getConfiguredSearchOperator(property: SearchPropertyConfig): SearchOperator {
  const allowed = getAllowedSearchOperators(property);
  const configured = property.defaultOperator ?? getDefaultSearchOperator(property.dataType);
  return allowed.includes(configured)
    ? configured
    : (allowed[0] ?? getDefaultSearchOperator(property.dataType));
}

export function getSearchMaxInValues(property: SearchPropertyConfig): number {
  return property.maxInValues !== undefined && Number.isFinite(property.maxInValues)
    ? Math.max(1, Math.trunc(property.maxInValues))
    : DEFAULT_SEARCH_MAX_IN_VALUES;
}

export function searchValueMatchesOperator(
  value: SearchRequestValue | null | undefined,
  operator: SearchOperator,
): boolean {
  if (value === undefined) {
    return false;
  }

  if (operator === 'between') {
    return value !== null && !Array.isArray(value) && isBetweenValue(value);
  }

  if (operator === 'in') {
    return Array.isArray(value);
  }

  if (isValuelessSearchOperator(operator)) {
    return value === null;
  }

  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

export function createSearchFilter(
  property: SearchPropertyConfig,
  id = `search-filter-${nextSharedFilterId++}`,
): SearchQueryFormFilter {
  const operator = getConfiguredSearchOperator(property);
  return {
    id,
    property: property.propertyName,
    operator,
    value: createSearchFilterValue(property, operator),
    locked: property.required === true,
  };
}

export function normalizeSearchFilter(
  filter: SearchQueryFormFilter,
  property: SearchPropertyConfig,
  locked = property.required === true,
): SearchQueryFormFilter {
  const allowed = getAllowedSearchOperators(property);
  const operator = allowed.includes(filter.operator)
    ? filter.operator
    : getConfiguredSearchOperator(property);
  const candidate = searchValueMatchesOperator(filter.value, operator)
    ? filter.value
    : createSearchFilterValue(property, operator);

  return {
    ...filter,
    property: property.propertyName,
    operator,
    value: operator === 'in' ? normalizeSearchInValues(property, candidate) : candidate,
    locked,
  };
}

export function isSearchFilterValid(
  filter: SearchQueryFormFilter | undefined,
  property: SearchPropertyConfig,
): boolean {
  if (!filter || filter.property !== property.propertyName) {
    return false;
  }

  if (!getAllowedSearchOperators(property).includes(filter.operator)) {
    return false;
  }

  if (isValuelessSearchOperator(filter.operator)) {
    return filter.value === null;
  }

  if (filter.operator === 'in') {
    return (
      Array.isArray(filter.value) &&
      filter.value.length > 0 &&
      filter.value.length <= getSearchMaxInValues(property) &&
      normalizeSearchInValues(property, filter.value).length === filter.value.length
    );
  }

  if (filter.operator === 'between') {
    if (!filter.value || Array.isArray(filter.value) || !isBetweenValue(filter.value)) {
      return false;
    }

    const range = filter.value;
    const from = stringifySearchScalar(range.from);
    const to = stringifySearchScalar(range.to);
    const options = getSearchPropertyOptions(property);
    return (
      from.length > 0 &&
      to.length > 0 &&
      !getSearchScalarError(property, from) &&
      !getSearchScalarError(property, to) &&
      (options.length === 0 ||
        (options.some((option) => Object.is(option.value, range.from)) &&
          options.some((option) => Object.is(option.value, range.to)))) &&
      !isSearchRangeReversed(property, from, to)
    );
  }

  if (!isScalar(filter.value)) {
    return false;
  }

  const options = getSearchPropertyOptions(property);
  if (options.length > 0 && !options.some((option) => Object.is(option.value, filter.value))) {
    return false;
  }

  const value = stringifySearchScalar(filter.value);
  return value.trim().length > 0 && !getSearchScalarError(property, value);
}

export function areRequiredSearchFiltersValid(
  state: SearchQueryFormState,
  properties: readonly SearchPropertyConfig[],
): boolean {
  return properties
    .filter((property) => property.required)
    .every((property) =>
      isSearchFilterValid(
        state.filters.find((filter) => filter.property === property.propertyName),
        property,
      ),
    );
}

export function reconcileSearchState(
  state: SearchQueryFormState,
  properties: readonly SearchPropertyConfig[],
  sortConfig: SearchSortConfig | null,
  options: ReconcileSearchStateOptions = {},
): SearchQueryFormState {
  assertSearchProperties(properties);
  const propertyMap = new Map(properties.map((property) => [property.propertyName, property]));
  const knownFilters = state.filters.filter((filter) => propertyMap.has(filter.property));
  const used = new Set<string>();
  const filters: SearchQueryFormFilter[] = [];
  const requiredCount = properties.filter((property) => property.required).length;
  const maxFilters = Number.isFinite(options.maxFilters)
    ? Math.max(requiredCount, Math.max(1, Math.trunc(options.maxFilters!)))
    : Math.max(requiredCount, properties.length);

  for (const property of properties.filter((item) => item.required)) {
    const current = knownFilters.find((filter) => filter.property === property.propertyName);
    const fallback = createSearchFilter(
      property,
      `${options.idPrefix ?? 'search-filter'}-${nextSharedFilterId++}`,
    );
    filters.push(normalizeSearchFilter(current ?? fallback, property, true));
    used.add(property.propertyName);
  }

  for (const filter of knownFilters) {
    if (used.has(filter.property) || filters.length >= maxFilters) {
      continue;
    }

    const property = propertyMap.get(filter.property);
    if (property) {
      filters.push(normalizeSearchFilter(filter, property, false));
      used.add(filter.property);
    }
  }

  const sortOptions = normalizeSearchSortOptions(sortConfig);
  const sortLimit = resolveSearchSortLimit(sortConfig, sortOptions.length);
  const normalizedSort = normalizeSearchSorts(state.sort, sortOptions, sortLimit);
  const sort =
    state.sort === undefined
      ? resolveDefaultSearchSorts(sortConfig, sortOptions, sortLimit)
      : normalizedSort;

  return {
    ...state,
    filters,
    sort: state.sort === undefined && sort.length === 0 ? undefined : sort,
  };
}

function createSearchFilterValue(
  property: SearchPropertyConfig,
  operator: SearchOperator,
): SearchRequestValue | null {
  if (
    property.defaultValue !== undefined &&
    searchValueMatchesOperator(property.defaultValue, operator)
  ) {
    return operator === 'in'
      ? normalizeSearchInValues(property, property.defaultValue)
      : property.defaultValue;
  }

  if (operator === 'between') {
    return { from: null, to: null };
  }

  if (operator === 'in') {
    return [];
  }

  return null;
}

function normalizeSearchInValues(
  property: SearchPropertyConfig,
  value: SearchRequestValue | null,
): readonly SearchScalarValue[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const configured = new Map(
    getSearchPropertyOptions(property).map((option) => [String(option.value), option.value]),
  );
  const values: SearchScalarValue[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    const raw = stringifySearchScalar(item);
    const normalized = configured.has(raw)
      ? configured.get(raw)!
      : property.allowCustomInValues
        ? parseCustomSearchValue(property, raw)
        : null;
    const key = normalized === null ? '' : `${typeof normalized}:${String(normalized)}`;

    if (normalized === null || seen.has(key)) {
      continue;
    }

    values.push(normalized);
    seen.add(key);

    if (values.length >= getSearchMaxInValues(property)) {
      break;
    }
  }

  return values;
}

function isScalar(value: SearchRequestValue | null): value is SearchScalarValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}
