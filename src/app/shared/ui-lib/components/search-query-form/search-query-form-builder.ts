import type {
  PaginatedSearchRequest,
  SearchBetweenValue,
  SearchQueryFormState,
  SearchRequestValue,
  SearchScalarValue,
} from './search-query-form-types';
import { isValuelessSearchOperator } from './search-query-form-operators';

export function buildSearchRequest(state: SearchQueryFormState): PaginatedSearchRequest {
  const filters = state.filters
    .map((filter) => {
      if (isValuelessSearchOperator(filter.operator)) {
        return {
          property: filter.property,
          operator: filter.operator,
          value: null,
        };
      }

      const value = normalizeRequestValue(filter.value);

      return value === null
        ? null
        : {
            property: filter.property,
            operator: filter.operator,
            value,
          };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return {
    ...(state.page === undefined ? {} : { page: state.page }),
    ...(state.limit === undefined ? {} : { limit: state.limit }),
    ...(filters.length === 0 ? {} : { filters }),
    ...(state.sort === undefined || state.sort.length === 0 ? {} : { sort: state.sort }),
  };
}

export function normalizeRequestValue(value: SearchRequestValue | null): SearchRequestValue | null {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    const values = value.filter(isPresentScalar);
    return values.length === 0 ? null : values;
  }

  if (isBetweenValue(value)) {
    return isPresentScalar(value.from) && isPresentScalar(value.to)
      ? { from: value.from, to: value.to }
      : null;
  }

  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? isPresentScalar(value)
      ? value
      : null
    : null;
}

export function isBetweenValue(value: SearchRequestValue): value is SearchBetweenValue {
  return typeof value === 'object' && value !== null && 'from' in value && 'to' in value;
}

function isPresentScalar(value: SearchScalarValue | null): value is SearchScalarValue {
  return value !== null && !(typeof value === 'string' && value.trim() === '');
}
