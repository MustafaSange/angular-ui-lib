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
  createSearchFilter,
  isSearchFilterValid,
  normalizeSearchSortOptions,
  normalizeSearchSorts,
  reconcileSearchState,
  resolveDefaultSearchSorts,
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
  /** Emits only when the committed state can produce a valid request. */
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
  readonly invalidActiveFilterProperties = computed(() => {
    const propertyMap = this.propertyMap();
    return this.state().filters.flatMap((filter) => {
      const property = propertyMap.get(filter.property);
      return property && !isSearchFilterValid(filter, property) ? [property] : [];
    });
  });
  /** Cleanup can still update state while this is false, without emitting requestChange. */
  readonly requestValid = computed(() => this.isRequestValid(this.state()));
  private readonly defaultFilters = computed(() => {
    const properties = this.properties();
    return [
      ...properties.filter((property) => property.required),
      ...properties.filter((property) => !property.required && property.visibleByDefault),
    ].map((property) => createSearchFilter(property));
  });
  private readonly defaultSorts = computed(() =>
    resolveDefaultSearchSorts(this.sortConfig(), this.sortOptions(), this.sortLimit()),
  );
  readonly canResetDefaults = computed(
    () =>
      !this.disabled() &&
      this.defaultFilters().every((filter) =>
        isSearchFilterValid(filter, this.getProperty(filter.property)),
      ),
  );
  readonly resetDefaultsUnavailableReason = computed(() =>
    this.canResetDefaults() || this.disabled()
      ? ''
      : 'Reset Defaults is unavailable because one or more configured defaults are invalid.',
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
          untracked(() => {
            const latest = this.state();
            const latestReconciled = reconcileSearchState(
              latest,
              this.properties(),
              this.sortConfig(),
              { idPrefix: 'table-filter' },
            );
            if (!areSearchQueryStatesEqual(latest, latestReconciled)) {
              this.state.set(latestReconciled);
            }
          });
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

  areOtherActiveFiltersValid(propertyName: string): boolean {
    const propertyMap = this.propertyMap();
    return this.state().filters.every((filter) => {
      if (filter.property === propertyName) {
        return true;
      }
      const property = propertyMap.get(filter.property);
      return property ? isSearchFilterValid(filter, property) : false;
    });
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

    return this.commit({ ...current, page: 1, filters });
  }

  clearFilter(property: SearchPropertyConfig): boolean {
    if (this.disabled()) {
      return false;
    }

    const filter = this.getFilter(property.propertyName);
    if (!filter || property.required || filter.locked) {
      return false;
    }

    const next = {
      ...this.state(),
      page: 1,
      filters: this.state().filters.filter((item) => item.property !== property.propertyName),
    };

    if (!this.isRequestValid(next)) {
      this.state.set(next);
      return true;
    }

    return this.commit(next);
  }

  commitSort(sorts: readonly SearchSortRequest[]): boolean {
    if (this.disabled()) {
      return false;
    }

    const sort = normalizeSearchSorts(sorts, this.sortOptions(), this.sortLimit());
    const next = { ...this.state(), page: 1, sort };

    if (sort.length === 0 && !this.isRequestValid(next)) {
      this.state.set(next);
      return true;
    }

    return this.commit(next);
  }

  resetDefaults(): boolean {
    if (!this.canResetDefaults()) {
      return false;
    }

    return this.commit({
      ...this.state(),
      page: 1,
      filters: this.defaultFilters(),
      sort: this.defaultSorts(),
    });
  }

  private commit(next: SearchQueryFormState): boolean {
    if (!this.isRequestValid(next)) {
      return false;
    }

    this.state.set(next);
    this.requestChange.emit(buildSearchRequest(next));
    return true;
  }

  private isRequestValid(state: SearchQueryFormState): boolean {
    const propertyMap = this.propertyMap();
    return (
      areRequiredSearchFiltersValid(state, this.properties()) &&
      state.filters.every((filter) => {
        const property = propertyMap.get(filter.property);
        return property ? isSearchFilterValid(filter, property) : false;
      })
    );
  }
}
