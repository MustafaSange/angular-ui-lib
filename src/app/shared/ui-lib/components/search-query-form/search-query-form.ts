import { Component, computed, effect, input, model, output, signal, untracked } from '@angular/core';
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
} from '@angular/forms/signals';

import { buildSearchRequest, isBetweenValue } from './search-query-form-builder';
import {
  SEARCH_OPERATOR_LABELS,
  getCompatibleSearchOperators,
  getDefaultSearchOperator,
  isValuelessSearchOperator,
} from './search-query-form-operators';
import type {
  PaginatedSearchRequest,
  SearchOperator,
  SearchPropertyConfig,
  SearchPropertyOption,
  SearchQueryFormFilter,
  SearchQueryFormState,
  SearchRequestValue,
  SearchScalarValue,
} from './search-query-form-types';
import { SignalFormField } from '../signal-form-field';
import { SelectComponent, SelectOptionComponent } from '../select';

let nextFilterId = 0;
const DEFAULT_STRING_MAX_LENGTH = 50;

interface SearchQueryFormFilterModel {
  readonly id: string;
  readonly property: string;
  readonly operator: SearchOperator;
  readonly value: string;
  readonly from: string;
  readonly to: string;
  readonly values: string[];
  readonly locked: boolean;
}

interface SearchQueryFormModel {
  readonly filters: readonly SearchQueryFormFilterModel[];
}

type SearchQueryFormValueFields = Pick<
  SearchQueryFormFilterModel,
  'value' | 'from' | 'to' | 'values'
>;

@Component({
  selector: 'ms-search-query-form',
  imports: [FormField, SelectComponent, SelectOptionComponent, SignalFormField],
  templateUrl: './search-query-form.html',
  host: {
    class: 'search-query-form-host',
  },
})
export class SearchQueryFormComponent {
  readonly properties = input.required<readonly SearchPropertyConfig[]>();
  readonly state = model<SearchQueryFormState>({ filters: [] });
  readonly requestChange = output<PaginatedSearchRequest>();

  private readonly formModel = signal<SearchQueryFormModel>({ filters: [] });

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
                  property.maxStringLength ?? DEFAULT_STRING_MAX_LENGTH,
                  DEFAULT_STRING_MAX_LENGTH,
                )
              : undefined;
          });
          required(filter.value, {
            message: 'Enter a value.',
            when: ({ valueOf }) => {
              const operator = valueOf(filter.operator);
              return (
                operator !== 'between' &&
                operator !== 'in' &&
                !isValuelessSearchOperator(operator)
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
          required(filter.values, {
            message: 'Choose at least one value.',
            when: ({ valueOf }) => valueOf(filter.operator) === 'in',
          });
          minLength(filter.values, 1, {
            message: 'Choose at least one value.',
            when: ({ valueOf }) => valueOf(filter.operator) === 'in',
          });
        }),
      );
    }),
  );

  protected readonly operatorLabels = SEARCH_OPERATOR_LABELS;
  protected readonly filters = computed(() => this.formModel().filters);
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
  protected readonly availableProperties = computed(() => {
    const selected = this.selectedPropertyNames();
    return this.properties().filter((property) => !selected.has(property.propertyName));
  });
  protected readonly canClear = computed(() =>
    this.filters().some((filter) => !this.isFilterLocked(filter)),
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

    if (!property || this.filters().some((filter) => filter.property === property.propertyName)) {
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
    });
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
    return allowedOperators.filter((operator) => compatibleOperators.includes(operator));
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

  protected inputType(property: SearchPropertyConfig | null): string {
    switch (property?.dataType) {
      case 'int':
      case 'long':
      case 'decimal':
        return 'number';
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      case 'dateTime':
        return 'datetime-local';
      default:
        return 'text';
    }
  }

  protected inputMode(property: SearchPropertyConfig | null): string | null {
    switch (property?.dataType) {
      case 'int':
      case 'long':
        return 'numeric';
      case 'decimal':
        return 'decimal';
      default:
        return null;
    }
  }

  protected step(property: SearchPropertyConfig | null): string | null {
    switch (property?.dataType) {
      case 'decimal':
        return 'any';
      case 'time':
      case 'dateTime':
        return '1';
      default:
        return null;
    }
  }

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

    if (!this.areStatesEqual(reconciled, this.state())) {
      queueMicrotask(() => this.state.set(reconciled));
    }

    if (!this.areFormModelsEqual(nextFormModel, untracked(() => this.formModel()))) {
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
      if (usedProperties.has(filter.property)) {
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
    };
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
    const value = this.valueMatchesOperator(filter.value, operator)
      ? filter.value
      : this.createValue(property, operator);

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
      return this.createInValueFields(nextValue);
    }

    if (isValuelessSearchOperator(operator)) {
      return this.createScalarValueFields(null);
    }

    return this.createScalarValueFields(nextValue);
  }

  private createBetweenValueFields(
    value: SearchRequestValue | null,
  ): SearchQueryFormValueFields {
    const between =
      value && !Array.isArray(value) && isBetweenValue(value)
        ? value
        : { from: null, to: null };

    return {
      value: '',
      from: this.stringifyScalar(between.from),
      to: this.stringifyScalar(between.to),
      values: [],
    };
  }

  private createInValueFields(value: SearchRequestValue | null): SearchQueryFormValueFields {
    return {
      value: '',
      from: '',
      to: '',
      values: Array.isArray(value) ? value.map((item) => this.stringifyScalar(item)) : [],
    };
  }

  private createScalarValueFields(value: SearchRequestValue | null): SearchQueryFormValueFields {
    return {
      value: this.stringifyScalar(this.asScalarValue(value)),
      from: '',
      to: '',
      values: [],
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

  private areStatesEqual(a: SearchQueryFormState, b: SearchQueryFormState): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private areFormModelsEqual(a: SearchQueryFormModel, b: SearchQueryFormModel): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private toFormModel(state: SearchQueryFormState): SearchQueryFormModel {
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
            : { value: '', from: '', to: '', values: [] }),
          locked: filter.locked === true,
        };
      }),
    };
  }

  private toState(
    formModel: SearchQueryFormModel,
    previousState: SearchQueryFormState,
  ): SearchQueryFormState {
    return {
      ...previousState,
      filters: formModel.filters.map((filter) => ({
        id: filter.id,
        property: filter.property,
        operator: filter.operator,
        value: this.toRequestValue(filter),
        locked: filter.locked,
      })),
    };
  }

  private toRequestValue(filter: SearchQueryFormFilterModel): SearchRequestValue | null {
    const property = this.getProperty(filter.property);

    if (!property) {
      return null;
    }

    if (filter.operator === 'between') {
      return {
        from: this.parseScalarValue(property, filter.from),
        to: this.parseScalarValue(property, filter.to),
      };
    }

    if (filter.operator === 'in') {
      return filter.values.map((value) => this.parseScalarValue(property, value));
    }

    if (isValuelessSearchOperator(filter.operator)) {
      return null;
    }

    return this.parseScalarValue(property, filter.value);
  }

  private stringifyScalar(value: SearchScalarValue | null): string {
    return value === null ? '' : String(value);
  }

  private parseScalarValue(property: SearchPropertyConfig, value: string): SearchScalarValue {
    const option = this.propertyOptions(property).find((item) => String(item.value) === value);

    if (option) {
      return option.value;
    }

    switch (property.dataType) {
      case 'boolean':
        return value === 'true';
      case 'int':
      case 'long':
        return Number.parseInt(value, 10);
      case 'decimal':
        return Number.parseFloat(value);
      default:
        return value;
    }
  }
}
