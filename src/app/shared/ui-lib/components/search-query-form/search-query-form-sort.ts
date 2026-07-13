import { SEARCH_SORT_DIRECTION } from './search-query-form-types';
import type {
  SearchSortConfig,
  SearchSortDirection,
  SearchSortOption,
  SearchSortRequest,
} from './search-query-form-types';
import type { SearchQueryFormSortModel } from './search-query-form-model';

export function normalizeSearchSortOptions(
  config: SearchSortConfig | null,
): readonly SearchSortOption[] {
  const seenValues = new Set<string>();
  const options: SearchSortOption[] = [];

  for (const option of config?.sortOptions ?? []) {
    const value = option.value.trim();

    if (!value || seenValues.has(value)) {
      continue;
    }

    options.push({ ...option, value });
    seenValues.add(value);
  }

  return options;
}

export function resolveSearchSortLimit(
  config: SearchSortConfig | null,
  optionCount: number,
): number {
  const configuredLimit = config?.maxSorts;
  const limit =
    configuredLimit !== undefined && Number.isFinite(configuredLimit)
      ? Math.max(1, Math.trunc(configuredLimit))
      : 1;

  return Math.min(optionCount, limit);
}

export function normalizeSearchSortDirection(direction: unknown): SearchSortDirection {
  return direction === SEARCH_SORT_DIRECTION.DESCENDING
    ? SEARCH_SORT_DIRECTION.DESCENDING
    : SEARCH_SORT_DIRECTION.ASCENDING;
}

export function normalizeSearchSorts(
  sorts: readonly SearchSortRequest[] | undefined,
  options: readonly SearchSortOption[],
  limit: number,
): readonly SearchSortRequest[] {
  const optionValues = new Set(options.map((option) => option.value));
  const usedProperties = new Set<string>();
  const normalized: SearchSortRequest[] = [];

  for (const sort of sorts ?? []) {
    if (
      normalized.length >= limit ||
      !optionValues.has(sort.property) ||
      usedProperties.has(sort.property)
    ) {
      continue;
    }

    normalized.push({
      property: sort.property,
      direction: normalizeSearchSortDirection(sort.direction),
    });
    usedProperties.add(sort.property);
  }

  return normalized;
}

export function resolveDefaultSearchSorts(
  config: SearchSortConfig | null,
  options: readonly SearchSortOption[],
  limit: number,
): readonly SearchSortRequest[] {
  if (options.length === 0) {
    return [];
  }

  const configuredDefaults = normalizeSearchSorts(config?.defaultSorts, options, limit);

  return configuredDefaults.length > 0
    ? configuredDefaults
    : [{ property: options[0].value, direction: SEARCH_SORT_DIRECTION.ASCENDING }];
}

export function toSearchSortModels(
  sorts: readonly SearchSortRequest[],
): readonly SearchQueryFormSortModel[] {
  return sorts.map((sort) => ({
    property: sort.property,
    direction: String(sort.direction),
  }));
}
