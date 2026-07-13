import {
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  FormField,
  applyEach,
  disabled,
  form,
  maxLength,
  minLength,
  required,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';

import { buildSearchRequest, isBetweenValue } from './search-query-form-builder';
import {
  areSearchQueryFormModelsEqual,
  areSearchQueryStatesEqual,
  areSearchSortModelsEqual,
} from './search-query-form-equality';
import {
  SEARCH_OPERATOR_LABELS,
  getCompatibleSearchOperators,
  getDefaultSearchOperator,
  isValuelessSearchOperator,
} from './search-query-form-operators';
import type {
  SearchInValuePreviewItem,
  SearchQueryFormFilterModel,
  SearchQueryFormModel,
  SearchQueryFormSortModel,
  SearchQueryFormValueFields,
} from './search-query-form-model';
import {
  normalizeSearchSortDirection,
  normalizeSearchSortOptions,
  normalizeSearchSorts,
  resolveDefaultSearchSorts,
  resolveSearchSortLimit,
  toSearchSortModels,
} from './search-query-form-sort';
import { SEARCH_SORT_DIRECTION } from './search-query-form-types';
import type {
  PaginatedSearchRequest,
  SearchOperator,
  SearchPropertyConfig,
  SearchPropertyOption,
  SearchQueryFormFilter,
  SearchQueryFormState,
  SearchRequestValue,
  SearchScalarValue,
  SearchSortConfig,
  SearchSortRequest,
} from './search-query-form-types';
import {
  DEFAULT_SEARCH_MAX_IN_VALUES,
  DEFAULT_SEARCH_STRING_MAX_LENGTH,
  createSearchValueStatus,
  getSearchInputMode,
  getSearchInputStep,
  getSearchInputType,
  getSearchScalarError,
  isSearchRangeReversed,
  parseCustomSearchValue,
  parseSearchScalar,
  stringifySearchScalar,
  tokenizeSearchValues,
} from './search-query-form-value';
import { SignalFormField, SignalReadonlyValue } from '../signal-form-field';
import { SelectComponent, SelectOptionComponent } from '../select';
import { ChipComponent, ChipRemoveDirective } from '../chip';
import { PopoverComponent, PopoverPanelComponent, PopoverTrigger } from '../menu-popover';

let nextFilterId = 0;

@Component({
  selector: 'ms-search-query-form',
  imports: [
    ChipComponent,
    ChipRemoveDirective,
    FormField,
    PopoverComponent,
    PopoverPanelComponent,
    PopoverTrigger,
    SelectComponent,
    SelectOptionComponent,
    SignalFormField,
    SignalReadonlyValue,
  ],
  templateUrl: './search-query-form.html',
  host: {
    class: 'search-query-form-host',
  },
})
export class SearchQueryFormComponent {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly maxFilters = input(10);
  readonly sortConfig = input<SearchSortConfig | null>(null);
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();

  private readonly formModel = signal<SearchQueryFormModel>({
    filters: [],
    sorts: [],
  });

  protected readonly searchForm = form(
    this.formModel,
    schema<SearchQueryFormModel>((path) => {
      applyEach(
        path.filters,
        schema<SearchQueryFormFilterModel>((filter) => {
          required(filter.property, { message: 'Choose a property.' });
          disabled(filter.property, { when: ({ valueOf }) => valueOf(filter.locked) });
          required(filter.operator, { message: 'Choose an operator.' });
          maxLength(filter.value, ({ valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));
            return property?.dataType === 'string'
              ? Math.min(
                  property.maxStringLength ?? DEFAULT_SEARCH_STRING_MAX_LENGTH,
                  DEFAULT_SEARCH_STRING_MAX_LENGTH,
                )
              : undefined;
          });
          validate(filter.value, ({ value, valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));
            const operator = valueOf(filter.operator);

            if (
              !property ||
              !value() ||
              operator === 'between' ||
              operator === 'in' ||
              isValuelessSearchOperator(operator)
            ) {
              return undefined;
            }

            const message =
              property.dataType === 'string' ? '' : getSearchScalarError(property, value());
            return message ? { kind: 'searchValue', message } : undefined;
          });
          required(filter.value, {
            message: 'Enter a value.',
            when: ({ valueOf }) => {
              const operator = valueOf(filter.operator);
              return (
                operator !== 'between' && operator !== 'in' && !isValuelessSearchOperator(operator)
              );
            },
          });
          required(filter.from, {
            message: 'Enter a from value.',
            when: ({ valueOf }) => valueOf(filter.operator) === 'between',
          });
          required(filter.to, {
            message: 'Enter a to value.',
            when: ({ valueOf }) => valueOf(filter.operator) === 'between',
          });
          validate(filter.from, ({ value, valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));

            if (!property || valueOf(filter.operator) !== 'between' || !value()) {
              return undefined;
            }

            const message = getSearchScalarError(property, value());
            return message ? { kind: 'searchValue', message } : undefined;
          });
          validate(filter.to, ({ value, valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));
            const from = valueOf(filter.from);
            const to = value();

            if (!property || valueOf(filter.operator) !== 'between' || !to) {
              return undefined;
            }

            const message = getSearchScalarError(property, to);
            if (message) {
              return { kind: 'searchValue', message };
            }

            if (
              from &&
              !getSearchScalarError(property, from) &&
              isSearchRangeReversed(property, from, to)
            ) {
              return {
                kind: 'searchRange',
                message: 'To must be greater than or equal to From.',
              };
            }

            return undefined;
          });
          required(filter.values, {
            message: 'Choose at least one value.',
            when: ({ valueOf }) =>
              valueOf(filter.operator) === 'in' && valueOf(filter.customValues).length === 0,
          });
          minLength(filter.values, 1, {
            message: 'Choose at least one value.',
            when: ({ valueOf }) =>
              valueOf(filter.operator) === 'in' && valueOf(filter.customValues).length === 0,
          });
          maxLength(
            filter.values,
            ({ valueOf }) => {
              const property = this.getProperty(valueOf(filter.property));
              return valueOf(filter.operator) === 'in'
                ? Math.max(0, this.maxInValues(property) - valueOf(filter.customValues).length)
                : undefined;
            },
            { message: 'Too many values selected.' },
          );
        }),
      );
      applyEach(
        path.sorts,
        schema<SearchQueryFormSortModel>((sort) => {
          required(sort.property, { message: 'Choose a sort property.' });
          required(sort.direction, { message: 'Choose a sort direction.' });
        }),
      );
    }),
  );

  protected readonly operatorLabels = SEARCH_OPERATOR_LABELS;
  protected readonly filters = computed(() => this.formModel().filters);
  protected readonly sorts = computed(() => this.formModel().sorts);
  protected readonly configuredSortOptions = computed(() =>
    normalizeSearchSortOptions(this.sortConfig()),
  );
  protected readonly hasSortOptions = computed(() => this.configuredSortOptions().length > 0);
  protected readonly sortLimit = computed(() => this.resolveSortLimit());
  protected readonly selectedSortProperties = computed(() =>
    this.sorts().map((sort) => sort.property),
  );
  private readonly propertyMap = computed(
    () => new Map(this.properties().map((property) => [property.propertyName, property])),
  );
  private readonly selectedPropertyNames = computed(
    () => new Set(this.filters().map((filter) => filter.property)),
  );
  private readonly requiredPropertyNames = computed(
    () =>
      new Set(
        this.properties()
          .filter((property) => property.required)
          .map((property) => property.propertyName),
      ),
  );
  protected readonly hasVisibleDefaultProperties = computed(() =>
    this.properties().some(
      (property) => property.visibleByDefault === true && property.required !== true,
    ),
  );
  protected readonly filterLimit = computed(() => this.resolveFilterLimit(this.properties()));
  protected readonly availableProperties = computed(() => {
    if (this.filters().length >= this.filterLimit()) {
      return [];
    }

    const selected = this.selectedPropertyNames();
    return this.properties().filter((property) => !selected.has(property.propertyName));
  });
  protected readonly canClear = computed(
    () =>
      this.filters().some((filter) => !this.isFilterLocked(filter)) ||
      !this.isDefaultSortSelection(this.sorts()),
  );
  protected readonly isSearchDisabled = computed(
    () => this.searchForm().invalid() || this.searchForm().pending(),
  );

  constructor() {
    effect(() => this.syncFormFromInputs());
  }

  protected async submitSearch(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.searchForm, async () => {
      const submittedState = this.toState(this.formModel(), this.state());
      this.state.set(submittedState);
      this.requestChange.emit(buildSearchRequest(submittedState));
      return undefined;
    });
  }

  protected addProperty(propertyName: string): void {
    const property = this.getProperty(propertyName);

    if (
      !property ||
      this.filters().length >= this.filterLimit() ||
      this.filters().some((filter) => filter.property === property.propertyName)
    ) {
      return;
    }

    this.updateFormModel({
      filters: [...this.filters(), this.createFilter(property)],
    });
  }

  protected clearOptionalFilters(): void {
    const requiredProperties = this.requiredPropertyNames();

    this.updateFormModel({
      filters: this.filters()
        .filter((filter) => requiredProperties.has(filter.property))
        .map((filter) => this.resetFilter(filter)),
      sorts: this.defaultSortModels(),
    });
  }

  protected resetForm(): void {
    this.updateFormModel({
      filters: this.defaultFilterProperties().map((property) => this.createFilter(property)),
      sorts: this.defaultSortModels(),
    });
  }

  protected toggleSortDirection(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.updateFormModel({
      sorts: this.sorts().map((sort, sortIndex) =>
        sortIndex === index
          ? {
              ...sort,
              direction: String(
                Number(sort.direction) === SEARCH_SORT_DIRECTION.ASCENDING
                  ? SEARCH_SORT_DIRECTION.DESCENDING
                  : SEARCH_SORT_DIRECTION.ASCENDING,
              ),
            }
          : sort,
      ),
    });
  }

  protected handleSortSelectionChange(value: string | readonly string[] | null): void {
    const selectedProperties = Array.isArray(value) ? value.slice(0, this.sortLimit()) : [];
    const configuredProperties = new Set(
      this.configuredSortOptions().map((option) => option.value),
    );
    const currentSorts = new Map(this.sorts().map((sort) => [sort.property, sort]));

    this.updateFormModel({
      sorts: selectedProperties
        .filter((property) => configuredProperties.has(property))
        .map(
          (property): SearchQueryFormSortModel =>
            currentSorts.get(property) ?? {
              property,
              direction: String(SEARCH_SORT_DIRECTION.ASCENDING),
            },
        ),
    });
  }

  protected isSortOptionDisabled(propertyName: string): boolean {
    return (
      this.sorts().length >= this.sortLimit() &&
      !this.sorts().some((sort) => sort.property === propertyName)
    );
  }

  protected sortLabel(propertyName: string): string {
    return (
      this.configuredSortOptions().find((option) => option.value === propertyName)?.label ??
      propertyName
    );
  }

  protected isDescendingSort(sort: SearchQueryFormSortModel): boolean {
    return Number(sort.direction) === SEARCH_SORT_DIRECTION.DESCENDING;
  }

  protected removeFilter(filter: SearchQueryFormFilterModel): void {
    if (this.isFilterLocked(filter)) {
      return;
    }

    this.updateFormModel({
      filters: this.filters().filter((item) => item.id !== filter.id),
    });
  }

  protected changeProperty(filter: SearchQueryFormFilterModel, propertyName: string): void {
    if (this.isFilterLocked(filter)) {
      return;
    }

    const property = this.getProperty(propertyName);

    if (!property) {
      return;
    }

    this.replaceFilter(filter.id, this.createFilter(property, filter.id));
  }

  protected changeOperator(filter: SearchQueryFormFilterModel, operator: SearchOperator): void {
    const property = this.getProperty(filter.property);

    if (!property || !this.allowedOperators(property).includes(operator)) {
      return;
    }

    this.replaceFilter(filter.id, {
      ...filter,
      operator,
      ...this.createValueFields(property, operator, this.toRequestValue(filter)),
    });
  }

  protected handleAddChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.addProperty(select.value);
    select.value = '';
  }

  protected handlePropertyChange(filter: SearchQueryFormFilterModel, event: Event): void {
    this.changeProperty(filter, (event.target as HTMLSelectElement).value);
  }

  protected handleOperatorChange(filter: SearchQueryFormFilterModel, event: Event): void {
    this.changeOperator(filter, (event.target as HTMLSelectElement).value as SearchOperator);
  }

  protected getProperty(propertyName: string): SearchPropertyConfig | null {
    return this.propertyMap().get(propertyName) ?? null;
  }

  protected propertyLabel(property: SearchPropertyConfig | null): string {
    return property?.label ?? property?.propertyName ?? 'Unknown property';
  }

  protected allowedOperators(property: SearchPropertyConfig): readonly SearchOperator[] {
    const compatibleOperators = getCompatibleSearchOperators(property.dataType);
    const allowedOperators = property.allowedOperators ?? compatibleOperators;
    const canUseIn = this.hasOptions(property) || this.allowCustomInValues(property);

    return allowedOperators.filter(
      (operator) => compatibleOperators.includes(operator) && (operator !== 'in' || canUseIn),
    );
  }

  protected propertyOptions(
    property: SearchPropertyConfig | null,
  ): readonly SearchPropertyOption[] {
    if (!property) {
      return [];
    }

    if (property.dataType === 'boolean') {
      const useYesNoLabels = property.booleanLabels === 'yesNo';

      return [
        { label: useYesNoLabels ? 'Yes' : 'True', value: true },
        { label: useYesNoLabels ? 'No' : 'False', value: false },
      ];
    }

    return property.options ?? [];
  }

  protected hasOptions(property: SearchPropertyConfig | null): boolean {
    return this.propertyOptions(property).length > 0;
  }

  protected allowCustomInValues(property: SearchPropertyConfig | null): boolean {
    return property?.allowCustomInValues === true;
  }

  protected maxInValues(property: SearchPropertyConfig | null): number {
    if (!property || property.maxInValues === undefined || !Number.isFinite(property.maxInValues)) {
      return DEFAULT_SEARCH_MAX_IN_VALUES;
    }

    return Math.max(1, Math.trunc(property.maxInValues));
  }

  protected totalInValues(filter: SearchQueryFormFilterModel): number {
    return filter.values.length + filter.customValues.length;
  }

  protected inValuePreview(
    filter: SearchQueryFormFilterModel,
    property: SearchPropertyConfig | null,
  ): readonly SearchInValuePreviewItem[] {
    const optionLabels = new Map(
      this.propertyOptions(property).map((option) => [String(option.value), option.label]),
    );

    return [
      ...filter.values.map((value) => ({
        value,
        label: optionLabels.get(value) ?? value,
        custom: false,
      })),
      ...filter.customValues.map((value) => ({ value, label: value, custom: true })),
    ].slice(0, 3);
  }

  protected isAtInValueLimit(
    filter: SearchQueryFormFilterModel,
    property: SearchPropertyConfig | null,
  ): boolean {
    return this.totalInValues(filter) >= this.maxInValues(property);
  }

  protected clipboardPasteAvailable(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.clipboard?.readText === 'function';
  }

  protected customValueInputError(property: SearchPropertyConfig | null, rawValue: string): string {
    const value = rawValue.trim();

    if (!property || !value) {
      return '';
    }

    return getSearchScalarError(property, value);
  }

  protected handleInOptionValuesChange(
    filter: SearchQueryFormFilterModel,
    property: SearchPropertyConfig,
    value: string | readonly string[] | null,
  ): void {
    const values = Array.isArray(value) ? [...value] : [];
    const availableSlots = Math.max(0, this.maxInValues(property) - filter.customValues.length);
    const capped = values.length > availableSlots;

    this.replaceFilter(filter.id, {
      ...filter,
      values: values.slice(0, availableSlots),
      customValueStatus: capped ? 'Value limit reached.' : '',
    });
  }

  protected isBetweenOperator(filter: SearchQueryFormFilterModel): boolean {
    return filter.operator === 'between';
  }

  protected isInOperator(filter: SearchQueryFormFilterModel): boolean {
    return filter.operator === 'in';
  }

  protected isValuelessOperator(filter: SearchQueryFormFilterModel): boolean {
    return isValuelessSearchOperator(filter.operator);
  }

  protected isFilterLocked(filter: SearchQueryFormFilterModel): boolean {
    return filter.locked === true || this.getProperty(filter.property)?.required === true;
  }

  protected addCustomValue(filter: SearchQueryFormFilterModel): void {
    const property = this.getProperty(filter.property);

    if (
      !property ||
      filter.customValueInput.trim().length === 0 ||
      this.customValueInputError(property, filter.customValueInput).length > 0 ||
      this.isAtInValueLimit(filter, property)
    ) {
      return;
    }

    this.addCustomValues(filter, [filter.customValueInput], property);
  }

  protected async pasteCustomValues(
    filter: SearchQueryFormFilterModel,
    input: HTMLInputElement,
  ): Promise<void> {
    const property = this.getProperty(filter.property);

    if (!property) {
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      this.addCustomValues(filter, tokenizeSearchValues(clipboardText), property);
    } catch {
      input.focus();
      this.replaceFilter(filter.id, {
        ...filter,
        customValueStatus: 'Clipboard access blocked. Paste into the field.',
      });
    }
  }

  protected handleCustomValuePaste(
    filter: SearchQueryFormFilterModel,
    event: ClipboardEvent,
  ): void {
    const property = this.getProperty(filter.property);
    const clipboardText = event.clipboardData?.getData('text');

    if (!property || !clipboardText) {
      return;
    }

    event.preventDefault();
    this.addCustomValues(filter, tokenizeSearchValues(clipboardText), property);
  }

  protected handleCustomValuesPopover(
    open: boolean,
    input: HTMLInputElement,
    trigger: HTMLButtonElement,
  ): void {
    queueMicrotask(() => (open ? input.focus() : trigger.focus()));
  }

  protected handleCustomValueInput(filter: SearchQueryFormFilterModel, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.replaceFilter(filter.id, {
      ...filter,
      customValueInput: input.value,
      customValueStatus: '',
    });
  }

  protected handleCustomValueKeydown(
    filter: SearchQueryFormFilterModel,
    event: KeyboardEvent,
  ): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.addCustomValue(filter);
  }

  protected removeCustomValue(filter: SearchQueryFormFilterModel, value: string): void {
    this.replaceFilter(filter.id, {
      ...filter,
      customValues: filter.customValues.filter((item) => item !== value),
      customValueStatus: '',
    });
  }

  protected removeInValue(
    filter: SearchQueryFormFilterModel,
    value: string,
    custom: boolean,
  ): void {
    if (custom) {
      this.removeCustomValue(filter, value);
      return;
    }

    this.replaceFilter(filter.id, {
      ...filter,
      values: filter.values.filter((item) => item !== value),
      customValueStatus: '',
    });
  }

  protected clearCustomValues(filter: SearchQueryFormFilterModel): void {
    this.replaceFilter(filter.id, {
      ...filter,
      customValues: [],
      customValueInput: '',
      customValueStatus: 'Custom values cleared.',
    });
  }

  protected readonly inputType = getSearchInputType;
  protected readonly inputMode = getSearchInputMode;
  protected readonly step = getSearchInputStep;

  protected filterField(index: number) {
    return this.searchForm.filters[index];
  }

  protected rowPropertyOptions(
    filter: SearchQueryFormFilterModel,
  ): readonly SearchPropertyConfig[] {
    const selected = new Set(
      this.filters()
        .filter((item) => item.id !== filter.id)
        .map((item) => item.property),
    );

    return this.properties().filter(
      (property) =>
        property.propertyName === filter.property || !selected.has(property.propertyName),
    );
  }

  private syncFormFromInputs(): void {
    const reconciled = this.reconcileState(this.state(), this.properties());
    const nextFormModel = this.toFormModel(reconciled);

    if (!areSearchQueryStatesEqual(reconciled, this.state())) {
      queueMicrotask(() => this.state.set(reconciled));
    }

    if (
      !areSearchQueryFormModelsEqual(
        nextFormModel,
        untracked(() => this.formModel()),
      )
    ) {
      queueMicrotask(() => this.formModel.set(nextFormModel));
    }
  }

  private reconcileState(
    state: SearchQueryFormState,
    properties: readonly SearchPropertyConfig[],
  ): SearchQueryFormState {
    const propertyMap = new Map(properties.map((property) => [property.propertyName, property]));
    const currentFilters = state.filters.filter((filter) => propertyMap.has(filter.property));
    const usedProperties = new Set<string>();
    const filters: SearchQueryFormFilter[] = [];
    const filterLimit = this.resolveFilterLimit(properties);
    const sort = this.resolveSorts(state.sort);

    for (const property of properties.filter((item) => item.required)) {
      const currentFilter = currentFilters.find(
        (filter) => filter.property === property.propertyName,
      );
      filters.push(
        this.normalizeFilter(currentFilter ?? this.createFilter(property), property, true),
      );
      usedProperties.add(property.propertyName);
    }

    for (const filter of currentFilters) {
      if (usedProperties.has(filter.property) || filters.length >= filterLimit) {
        continue;
      }

      const property = propertyMap.get(filter.property);

      if (property) {
        filters.push(this.normalizeFilter(filter, property, false));
      }
    }

    return {
      ...state,
      filters,
      sort: state.sort === undefined && sort.length === 0 ? undefined : sort,
    };
  }

  private resolveSorts(
    sort: readonly SearchSortRequest[] | undefined,
  ): readonly SearchSortRequest[] {
    const normalizedSorts = normalizeSearchSorts(
      sort,
      this.configuredSortOptions(),
      this.sortLimit(),
    );
    return sort === undefined ? this.configuredDefaultSorts() : normalizedSorts;
  }

  private configuredDefaultSorts(): readonly SearchSortRequest[] {
    return resolveDefaultSearchSorts(
      this.sortConfig(),
      this.configuredSortOptions(),
      this.sortLimit(),
    );
  }

  private resolveSortLimit(): number {
    return resolveSearchSortLimit(this.sortConfig(), this.configuredSortOptions().length);
  }

  private defaultSortModels(): readonly SearchQueryFormSortModel[] {
    return toSearchSortModels(this.configuredDefaultSorts());
  }

  private isDefaultSortSelection(sorts: readonly SearchQueryFormSortModel[]): boolean {
    return areSearchSortModelsEqual(sorts, this.defaultSortModels());
  }

  private resolveFilterLimit(properties: readonly SearchPropertyConfig[]): number {
    const configuredLimit = Number.isFinite(this.maxFilters())
      ? Math.max(1, Math.trunc(this.maxFilters()))
      : 10;
    const requiredCount = properties.filter((property) => property.required).length;

    return Math.max(configuredLimit, requiredCount);
  }

  private defaultFilterProperties(): readonly SearchPropertyConfig[] {
    const requiredProperties = this.properties().filter(
      (property) => property.required === true,
    );
    const visibleDefaultProperties = this.properties().filter(
      (property) => property.required !== true && property.visibleByDefault === true,
    );

    return [...requiredProperties, ...visibleDefaultProperties].slice(0, this.filterLimit());
  }

  private createFilter(
    property: SearchPropertyConfig,
    id = `search-filter-${nextFilterId++}`,
  ): SearchQueryFormFilterModel {
    const operator = this.defaultOperator(property);

    return {
      id,
      property: property.propertyName,
      operator,
      ...this.createValueFields(property, operator, property.defaultValue),
      locked: property.required === true,
    };
  }

  private resetFilter(filter: SearchQueryFormFilterModel): SearchQueryFormFilterModel {
    const property = this.getProperty(filter.property);

    if (!property) {
      return filter;
    }

    const operator = this.defaultOperator(property);

    return {
      ...filter,
      operator,
      ...this.createValueFields(property, operator, property.defaultValue),
      locked: property.required === true,
    };
  }

  private normalizeFilter(
    filter: SearchQueryFormFilter,
    property: SearchPropertyConfig,
    locked: boolean,
  ): SearchQueryFormFilter {
    const allowedOperators = this.allowedOperators(property);
    const operator = allowedOperators.includes(filter.operator)
      ? filter.operator
      : this.defaultOperator(property);
    const candidateValue = this.valueMatchesOperator(filter.value, operator)
      ? filter.value
      : this.createValue(property, operator);
    const value =
      operator === 'in' ? this.normalizeInValues(property, candidateValue) : candidateValue;

    return {
      ...filter,
      property: property.propertyName,
      operator,
      value,
      locked,
    };
  }

  private defaultOperator(property: SearchPropertyConfig): SearchOperator {
    const allowedOperators = this.allowedOperators(property);
    const operator = property.defaultOperator ?? getDefaultSearchOperator(property.dataType);
    return allowedOperators.includes(operator)
      ? operator
      : (allowedOperators[0] ?? getDefaultSearchOperator(property.dataType));
  }

  private createValue(
    property: SearchPropertyConfig,
    operator: SearchOperator,
  ): SearchRequestValue | null {
    if (
      property.defaultValue !== undefined &&
      this.valueMatchesOperator(property.defaultValue, operator)
    ) {
      return property.defaultValue;
    }

    if (operator === 'between') {
      return { from: null, to: null };
    }

    if (operator === 'in') {
      return [];
    }

    return null;
  }

  private createValueFields(
    property: SearchPropertyConfig,
    operator: SearchOperator,
    value: SearchRequestValue | null | undefined,
  ): SearchQueryFormValueFields {
    const fallback = this.createValue(property, operator);
    const nextValue =
      value === undefined || !this.valueMatchesOperator(value, operator) ? fallback : value;

    if (operator === 'between') {
      return this.createBetweenValueFields(nextValue);
    }

    if (operator === 'in') {
      return this.createInValueFields(property, nextValue);
    }

    if (isValuelessSearchOperator(operator)) {
      return this.createScalarValueFields(null);
    }

    return this.createScalarValueFields(nextValue);
  }

  private createBetweenValueFields(value: SearchRequestValue | null): SearchQueryFormValueFields {
    const between =
      value && !Array.isArray(value) && isBetweenValue(value) ? value : { from: null, to: null };

    return {
      value: '',
      from: stringifySearchScalar(between.from),
      to: stringifySearchScalar(between.to),
      values: [],
      customValues: [],
      customValueInput: '',
      customValueStatus: '',
    };
  }

  private createInValueFields(
    property: SearchPropertyConfig,
    value: SearchRequestValue | null,
  ): SearchQueryFormValueFields {
    const values = this.normalizeInValues(property, value).map((item) =>
      stringifySearchScalar(item),
    );
    const optionValues = new Set(
      this.propertyOptions(property).map((option) => String(option.value)),
    );
    const selectedValues = values.filter((item) => optionValues.has(item));
    const customValues =
      property.allowCustomInValues === true ? values.filter((item) => !optionValues.has(item)) : [];

    return {
      value: '',
      from: '',
      to: '',
      values: selectedValues,
      customValues,
      customValueInput: '',
      customValueStatus: '',
    };
  }

  private normalizeInValues(
    property: SearchPropertyConfig,
    value: SearchRequestValue | null,
  ): readonly SearchScalarValue[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const optionValues = new Map(
      this.propertyOptions(property).map((option) => [String(option.value), option.value]),
    );
    const normalizedValues: SearchScalarValue[] = [];
    const seenValues = new Set<string>();

    for (const item of value) {
      const rawValue = stringifySearchScalar(item);
      const normalizedValue = optionValues.has(rawValue)
        ? optionValues.get(rawValue)!
        : property.allowCustomInValues === true
          ? parseCustomSearchValue(property, rawValue)
          : null;

      if (normalizedValue === null) {
        continue;
      }

      const valueKey = `${typeof normalizedValue}:${String(normalizedValue)}`;

      if (seenValues.has(valueKey)) {
        continue;
      }

      normalizedValues.push(normalizedValue);
      seenValues.add(valueKey);

      if (normalizedValues.length >= this.maxInValues(property)) {
        break;
      }
    }

    return normalizedValues;
  }

  private createScalarValueFields(value: SearchRequestValue | null): SearchQueryFormValueFields {
    return {
      value: stringifySearchScalar(this.asScalarValue(value)),
      from: '',
      to: '',
      values: [],
      customValues: [],
      customValueInput: '',
      customValueStatus: '',
    };
  }

  private asScalarValue(value: SearchRequestValue | null): SearchScalarValue | null {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      ? value
      : null;
  }

  private valueMatchesOperator(
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

  private replaceFilter(id: string, nextFilter: SearchQueryFormFilterModel): void {
    this.updateFormModel({
      filters: this.filters().map((filter) => (filter.id === id ? nextFilter : filter)),
    });
  }

  private updateFormModel(patch: Partial<SearchQueryFormModel>): void {
    this.formModel.update((state) => ({
      ...state,
      ...patch,
    }));
  }

  private toFormModel(state: SearchQueryFormState): SearchQueryFormModel {
    const sorts = this.resolveSorts(state.sort);

    return {
      filters: state.filters.map((filter) => {
        const property = this.getProperty(filter.property);
        const operator = property
          ? this.allowedOperators(property).includes(filter.operator)
            ? filter.operator
            : this.defaultOperator(property)
          : filter.operator;

        return {
          id: filter.id,
          property: filter.property,
          operator,
          ...(property
            ? this.createValueFields(property, operator, filter.value)
            : {
                value: '',
                from: '',
                to: '',
                values: [],
                customValues: [],
                customValueInput: '',
                customValueStatus: '',
              }),
          locked: filter.locked === true,
        };
      }),
      sorts: toSearchSortModels(sorts),
    };
  }

  private toState(
    formModel: SearchQueryFormModel,
    previousState: SearchQueryFormState,
  ): SearchQueryFormState {
    const sort = this.toSortRequest(formModel.sorts);

    return {
      ...previousState,
      filters: formModel.filters.map((filter) => ({
        id: filter.id,
        property: filter.property,
        operator: filter.operator,
        value: this.toRequestValue(filter),
        locked: filter.locked,
      })),
      sort,
    };
  }

  private toSortRequest(sorts: readonly SearchQueryFormSortModel[]): readonly SearchSortRequest[] {
    return normalizeSearchSorts(
      sorts.map((sort) => ({
        property: sort.property,
        direction: normalizeSearchSortDirection(Number(sort.direction)),
      })),
      this.configuredSortOptions(),
      this.sortLimit(),
    );
  }

  private toRequestValue(filter: SearchQueryFormFilterModel): SearchRequestValue | null {
    const property = this.getProperty(filter.property);

    if (!property) {
      return null;
    }

    if (filter.operator === 'between') {
      return {
        from: parseSearchScalar(property, filter.from, this.propertyOptions(property)),
        to: parseSearchScalar(property, filter.to, this.propertyOptions(property)),
      };
    }

    if (filter.operator === 'in') {
      return [...filter.values, ...filter.customValues]
        .filter((value, index, values) => values.indexOf(value) === index)
        .map((value) => parseSearchScalar(property, value, this.propertyOptions(property)));
    }

    if (isValuelessSearchOperator(filter.operator)) {
      return null;
    }

    return parseSearchScalar(property, filter.value, this.propertyOptions(property));
  }

  private addCustomValues(
    filter: SearchQueryFormFilterModel,
    rawValues: readonly string[],
    property: SearchPropertyConfig,
  ): void {
    const maxValues = this.maxInValues(property);
    const selectedValues = new Set(filter.values);
    const customValues = [...filter.customValues];
    const customValueSet = new Set(customValues);
    let addedCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;
    let cappedCount = 0;

    for (const rawValue of rawValues) {
      const parsedValue = parseCustomSearchValue(property, rawValue);

      if (parsedValue === null) {
        invalidCount++;
        continue;
      }

      const value = stringifySearchScalar(parsedValue);

      if (selectedValues.has(value) || customValueSet.has(value)) {
        duplicateCount++;
        continue;
      }

      if (selectedValues.size + customValues.length >= maxValues) {
        cappedCount++;
        continue;
      }

      customValues.push(value);
      customValueSet.add(value);
      addedCount++;
    }

    this.replaceFilter(filter.id, {
      ...filter,
      customValues,
      customValueInput: '',
      customValueStatus: createSearchValueStatus(
        addedCount,
        duplicateCount,
        invalidCount,
        cappedCount,
      ),
    });
  }
}
