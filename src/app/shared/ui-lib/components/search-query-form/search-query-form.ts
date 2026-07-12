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
  validate,
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
import { SignalFormField, SignalReadonlyValue } from '../signal-form-field';
import { SelectComponent, SelectOptionComponent } from '../select';
import { ChipComponent, ChipRemoveDirective } from '../chip';
import {
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from '../menu-popover';

let nextFilterId = 0;
const DEFAULT_STRING_MAX_LENGTH = 50;
const DEFAULT_MAX_IN_VALUES = 50;
const GUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

interface SearchQueryFormFilterModel {
  readonly id: string;
  readonly property: string;
  readonly operator: SearchOperator;
  readonly value: string;
  readonly from: string;
  readonly to: string;
  readonly values: string[];
  readonly customValues: string[];
  readonly customValueInput: string;
  readonly customValueStatus: string;
  readonly locked: boolean;
}

interface SearchQueryFormModel {
  readonly filters: readonly SearchQueryFormFilterModel[];
}

type SearchQueryFormValueFields = Pick<
  SearchQueryFormFilterModel,
  | 'value'
  | 'from'
  | 'to'
  | 'values'
  | 'customValues'
  | 'customValueInput'
  | 'customValueStatus'
>;

interface InValuePreviewItem {
  readonly value: string;
  readonly label: string;
  readonly custom: boolean;
}

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
              property.dataType === 'string' ? '' : this.typedScalarError(property, value());
            return message ? { kind: 'searchValue', message } : undefined;
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
          validate(filter.from, ({ value, valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));

            if (!property || valueOf(filter.operator) !== 'between' || !value()) {
              return undefined;
            }

            const message = this.typedScalarError(property, value());
            return message ? { kind: 'searchValue', message } : undefined;
          });
          validate(filter.to, ({ value, valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));
            const from = valueOf(filter.from);
            const to = value();

            if (!property || valueOf(filter.operator) !== 'between' || !to) {
              return undefined;
            }

            const message = this.typedScalarError(property, to);
            if (message) {
              return { kind: 'searchValue', message };
            }

            if (
              from &&
              !this.typedScalarError(property, from) &&
              this.isRangeReversed(property, from, to)
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
          maxLength(filter.values, ({ valueOf }) => {
            const property = this.getProperty(valueOf(filter.property));
            return valueOf(filter.operator) === 'in'
              ? Math.max(0, this.maxInValues(property) - valueOf(filter.customValues).length)
              : undefined;
          }, { message: 'Too many values selected.' });
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
  protected readonly filterLimit = computed(() => this.resolveFilterLimit(this.properties()));
  protected readonly availableProperties = computed(() => {
    if (this.filters().length >= this.filterLimit()) {
      return [];
    }

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
      return DEFAULT_MAX_IN_VALUES;
    }

    return Math.max(1, Math.trunc(property.maxInValues));
  }

  protected totalInValues(filter: SearchQueryFormFilterModel): number {
    return filter.values.length + filter.customValues.length;
  }

  protected inValuePreview(
    filter: SearchQueryFormFilterModel,
    property: SearchPropertyConfig | null,
  ): readonly InValuePreviewItem[] {
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

  protected customValueInputError(
    property: SearchPropertyConfig | null,
    rawValue: string,
  ): string {
    const value = rawValue.trim();

    if (!property || !value) {
      return '';
    }

    return this.typedScalarError(property, value);
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
      this.addCustomValues(filter, this.tokenizeCustomValues(clipboardText), property);
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
    this.addCustomValues(filter, this.tokenizeCustomValues(clipboardText), property);
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
    const filterLimit = this.resolveFilterLimit(properties);

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
    };
  }

  private resolveFilterLimit(properties: readonly SearchPropertyConfig[]): number {
    const configuredLimit = Number.isFinite(this.maxFilters())
      ? Math.max(1, Math.trunc(this.maxFilters()))
      : 10;
    const requiredCount = properties.filter((property) => property.required).length;

    return Math.max(configuredLimit, requiredCount);
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
      return this.createInValueFields(property, nextValue);
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
      customValues: [],
      customValueInput: '',
      customValueStatus: '',
    };
  }

  private createInValueFields(
    property: SearchPropertyConfig,
    value: SearchRequestValue | null,
  ): SearchQueryFormValueFields {
    const values = Array.isArray(value) ? value.map((item) => this.stringifyScalar(item)) : [];
    const optionValues = new Set(
      this.propertyOptions(property).map((option) => String(option.value)),
    );
    const maxValues = this.maxInValues(property);
    const selectedValues =
      property.allowCustomInValues === true
        ? values.filter((item) => optionValues.has(item)).slice(0, maxValues)
        : values.slice(0, maxValues);
    const customValues =
      property.allowCustomInValues === true
        ? values
            .filter((item) => !optionValues.has(item))
            .slice(0, Math.max(0, maxValues - selectedValues.length))
        : [];

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

  private createScalarValueFields(value: SearchRequestValue | null): SearchQueryFormValueFields {
    return {
      value: this.stringifyScalar(this.asScalarValue(value)),
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
      return [...filter.values, ...filter.customValues]
        .filter((value, index, values) => values.indexOf(value) === index)
        .map((value) => this.parseScalarValue(property, value));
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
      const parsedValue = this.parseCustomInValue(property, rawValue);

      if (parsedValue === null) {
        invalidCount++;
        continue;
      }

      const value = this.stringifyScalar(parsedValue);

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
      customValueStatus: this.customValueStatus(
        addedCount,
        duplicateCount,
        invalidCount,
        cappedCount,
      ),
    });
  }

  private tokenizeCustomValues(value: string): readonly string[] {
    return value
      .split(/[\n,;\t]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private parseCustomInValue(
    property: SearchPropertyConfig,
    rawValue: string,
  ): SearchScalarValue | null {
    const value = rawValue.trim();

    if (!value) {
      return null;
    }

    if (this.typedScalarError(property, value)) {
      return null;
    }

    switch (property.dataType) {
      case 'int':
      case 'long':
        return Number.parseInt(value, 10);
      case 'decimal':
        return Number(value);
      case 'guid':
        return value;
      case 'string':
        return value;
      case 'enum':
        return value;
      default:
        return null;
    }
  }

  private typedScalarError(property: SearchPropertyConfig, value: string): string {
    switch (property.dataType) {
      case 'guid':
        return GUID_PATTERN.test(value) ? '' : 'Enter a valid GUID.';
      case 'int':
      case 'long':
        if (!/^-?\d+$/.test(value)) {
          return 'Enter a whole number.';
        }

        return Number.isSafeInteger(Number(value)) ? '' : 'Enter a safe whole number.';
      case 'decimal':
        return Number.isFinite(Number(value)) ? '' : 'Enter a valid number.';
      case 'string': {
        const maxLength = Math.min(
          property.maxStringLength ?? DEFAULT_STRING_MAX_LENGTH,
          DEFAULT_STRING_MAX_LENGTH,
        );
        return value.length <= maxLength ? '' : `Enter no more than ${maxLength} characters.`;
      }
      default:
        return '';
    }
  }

  private isRangeReversed(
    property: SearchPropertyConfig,
    from: string,
    to: string,
  ): boolean {
    switch (property.dataType) {
      case 'int':
      case 'long':
      case 'decimal':
        return Number(from) > Number(to);
      case 'date':
      case 'time':
      case 'dateTime':
        return from > to;
      default:
        return false;
    }
  }

  private customValueStatus(
    addedCount: number,
    duplicateCount: number,
    invalidCount: number,
    cappedCount: number,
  ): string {
    const messages: string[] = [];

    if (addedCount > 0) {
      messages.push(`${addedCount} ${addedCount === 1 ? 'value' : 'values'} added`);
    }

    if (duplicateCount > 0) {
      messages.push(`${duplicateCount} duplicate${duplicateCount === 1 ? '' : 's'} skipped`);
    }

    if (invalidCount > 0) {
      messages.push(`${invalidCount} invalid ${invalidCount === 1 ? 'value' : 'values'} skipped`);
    }

    if (cappedCount > 0) {
      messages.push(`${cappedCount} over the limit skipped`);
    }

    return messages.join('. ');
  }
}
