import {
  Directive,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  output,
  untracked,
} from '@angular/core';

import {
  areRequiredSearchFiltersValid,
  areSearchQueryStatesEqual,
  assertSearchProperties,
  buildSearchRequest,
  isSearchFilterValid,
  normalizeSearchSortOptions,
  normalizeSearchSorts,
  reconcileSearchState,
  resolveSearchSortLimit,
  type PaginatedSearchRequest,
  type SearchPropertyConfig,
  type SearchQueryFormFilter,
  type SearchQueryFormState,
  type SearchSortConfig,
  type SearchSortRequest,
} from '../../search-query';

@Directive({
  selector: 'table[msTableSearch]',
  host: {
    class: 'table-search',
  },
})
export class TableSearchDirective {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly sortConfig = input<SearchSortConfig | null>(null);
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly propertyMap = computed(() => {
    const properties = this.properties();
    assertSearchProperties(properties);
    return new Map(properties.map((property) => [property.propertyName, property]));
  });
  readonly sortOptions = computed(() => normalizeSearchSortOptions(this.sortConfig()));
  readonly sortLimit = computed(() =>
    resolveSearchSortLimit(this.sortConfig(), this.sortOptions().length),
  );
  readonly hasSortOptions = computed(() => this.sortOptions().length > 0);
  readonly requiredFiltersValid = computed(() =>
    areRequiredSearchFiltersValid(this.state(), this.properties()),
  );
  private readonly registeredColumns = new Set<string>();

  constructor() {
    effect(() => {
      const properties = this.properties();
      const sortConfig = this.sortConfig();
      const current = this.state();
      const reconciled = reconcileSearchState(current, properties, sortConfig, {
        idPrefix: 'table-filter',
      });

      if (!areSearchQueryStatesEqual(current, reconciled)) {
        queueMicrotask(() => {
          if (
            !areSearchQueryStatesEqual(
              untracked(() => this.state()),
              reconciled,
            )
          ) {
            this.state.set(reconciled);
          }
        });
      }
    });
  }

  getProperty(propertyName: string): SearchPropertyConfig {
    const property = this.propertyMap().get(propertyName);
    if (!property) {
      throw new Error(`Unknown table search property: ${propertyName}`);
    }
    return property;
  }

  registerColumn(propertyName: string): () => void {
    this.getProperty(propertyName);
    if (this.registeredColumns.has(propertyName)) {
      throw new Error(`Duplicate table search column: ${propertyName}`);
    }
    this.registeredColumns.add(propertyName);
    return () => this.registeredColumns.delete(propertyName);
  }

  getFilter(propertyName: string): SearchQueryFormFilter | undefined {
    return this.state().filters.find((filter) => filter.property === propertyName);
  }

  isPropertyFilterValid(property: SearchPropertyConfig): boolean {
    return isSearchFilterValid(this.getFilter(property.propertyName), property);
  }

  commitFilter(property: SearchPropertyConfig, filter: SearchQueryFormFilter): boolean {
    if (this.disabled()) {
      return false;
    }

    const current = this.state();
    const existingIndex = current.filters.findIndex(
      (item) => item.property === property.propertyName,
    );
    const filters = [...current.filters];
    const committed: SearchQueryFormFilter = {
      ...filter,
      id: existingIndex >= 0 ? filters[existingIndex].id : filter.id,
      property: property.propertyName,
      locked: existingIndex >= 0 ? filters[existingIndex].locked : property.required === true,
    };

    if (existingIndex >= 0) {
      filters[existingIndex] = committed;
    } else {
      filters.push(committed);
    }

    return this.commit({ ...current, filters });
  }

  clearFilter(property: SearchPropertyConfig): boolean {
    if (this.disabled()) {
      return false;
    }

    const filter = this.getFilter(property.propertyName);
    if (!filter || property.required || filter.locked) {
      return false;
    }

    return this.commit({
      ...this.state(),
      filters: this.state().filters.filter((item) => item.property !== property.propertyName),
    });
  }

  commitSort(sorts: readonly SearchSortRequest[]): boolean {
    if (this.disabled()) {
      return false;
    }

    const sort = normalizeSearchSorts(sorts, this.sortOptions(), this.sortLimit());
    return this.commit({ ...this.state(), sort });
  }

  private commit(next: SearchQueryFormState): boolean {
    if (!areRequiredSearchFiltersValid(next, this.properties())) {
      return false;
    }

    this.state.set(next);
    this.requestChange.emit(buildSearchRequest(next));
    return true;
  }
}
