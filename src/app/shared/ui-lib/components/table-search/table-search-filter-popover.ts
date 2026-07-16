import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormField, form, required, schema, submit, validate } from '@angular/forms/signals';

import { PopoverComponent, PopoverPanelComponent, PopoverTrigger } from '../menu-popover';
import { ChipComponent, ChipRemoveDirective } from '../chip';
import { SelectComponent, SelectOptionComponent } from '../select';
import { SignalFormField, SignalReadonlyValue } from '../signal-form-field';
import {
  SEARCH_OPERATOR_LABELS,
  createSearchValueStatus,
  createSearchFilter,
  getAllowedSearchOperators,
  getSearchInputMode,
  getSearchInputStep,
  getSearchInputType,
  getSearchMaxInValues,
  getSearchPropertyOptions,
  getSearchScalarError,
  isBetweenValue,
  isSearchOptionInputValue,
  isSearchRangeReversed,
  isValuelessSearchOperator,
  parseCustomSearchValue,
  parseSearchScalar,
  stringifySearchScalar,
  tokenizeSearchValues,
  type SearchOperator,
  type SearchPropertyConfig,
  type SearchQueryFormFilter,
  type SearchRequestValue,
  type SearchScalarValue,
} from '../../search-query';
import { TableSearchDirective } from './table-search.directive';

interface FilterDraft {
  readonly operator: SearchOperator;
  readonly value: string;
  readonly from: string;
  readonly to: string;
  readonly values: string[];
  readonly customValues: string[];
  readonly customValueInput: string;
  readonly customValueStatus: string;
}

interface InValuePreviewItem {
  readonly value: string;
  readonly label: string;
  readonly custom: boolean;
}

let nextFilterPopoverId = 0;

@Component({
  selector: 'ms-table-filter-popover',
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
  templateUrl: './table-search-filter-popover.html',
})
export class TableFilterPopoverComponent {
  readonly property = input.required<SearchPropertyConfig>();

  protected readonly table = inject(TableSearchDirective);
  protected readonly descriptionId = `table-filter-description-${nextFilterPopoverId++}`;
  protected readonly customValuesAnchor = `--${this.descriptionId}-custom-values`;
  protected readonly open = signal(false);
  protected readonly draft = signal<FilterDraft>(this.emptyDraft());
  protected readonly operatorLabels = SEARCH_OPERATOR_LABELS;
  protected readonly allowedOperators = computed(() => getAllowedSearchOperators(this.property()));
  protected readonly propertyOptions = computed(() => getSearchPropertyOptions(this.property()));
  protected readonly appliedFilter = computed(() =>
    this.table.getFilter(this.property().propertyName),
  );
  protected readonly active = computed(() => this.appliedFilter() !== undefined);
  protected readonly error = computed(
    () => this.property().required === true && !this.table.isPropertyFilterValid(this.property()),
  );
  protected readonly canClear = computed(() => {
    const filter = this.appliedFilter();
    return Boolean(
      filter && !filter.locked && !this.property().required && this.table.requiredFiltersValid(),
    );
  });
  protected readonly otherRequiredFiltersValid = computed(() =>
    this.table
      .properties()
      .filter(
        (property) => property.required && property.propertyName !== this.property().propertyName,
      )
      .every((property) => this.table.isPropertyFilterValid(property)),
  );
  protected readonly isBetween = computed(() => this.draft().operator === 'between');
  protected readonly isIn = computed(() => this.draft().operator === 'in');
  protected readonly isValueless = computed(() => isValuelessSearchOperator(this.draft().operator));
  protected readonly panelLabel = computed(() => `Filter ${this.label()}`);
  protected readonly triggerDescription = computed(() => {
    if (this.error()) {
      return `${this.label()} filter is required and invalid.`;
    }
    return this.active() ? `${this.label()} filter is active.` : `${this.label()} has no filter.`;
  });

  private readonly firstControl = viewChild<ElementRef<HTMLElement>>('firstControl');
  private readonly formElement = viewChild<ElementRef<HTMLFormElement>>('filterEditorForm');
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly openedFilterSignature = signal('');

  protected readonly filterForm = form(
    this.draft,
    schema<FilterDraft>((path) => {
      required(path.operator, { message: 'Choose an operator.' });
      required(path.value, {
        message: 'Enter a value.',
        when: ({ valueOf }) =>
          valueOf(path.operator) !== 'between' &&
          valueOf(path.operator) !== 'in' &&
          !isValuelessSearchOperator(valueOf(path.operator)),
      });
      validate(path.value, ({ value, valueOf }) => {
        const operator = valueOf(path.operator);
        if (operator === 'between' || operator === 'in' || isValuelessSearchOperator(operator)) {
          return undefined;
        }
        const message = getSearchScalarError(this.property(), value());
        if (message) {
          return { kind: 'searchValue', message };
        }
        return isSearchOptionInputValue(this.propertyOptions(), value())
          ? undefined
          : { kind: 'searchOption', message: 'Choose a configured value.' };
      });
      required(path.from, {
        message: 'Enter a from value.',
        when: ({ valueOf }) => valueOf(path.operator) === 'between',
      });
      required(path.to, {
        message: 'Enter a to value.',
        when: ({ valueOf }) => valueOf(path.operator) === 'between',
      });
      validate(path.to, ({ value, valueOf }) => {
        if (valueOf(path.operator) !== 'between' || !value()) {
          return undefined;
        }
        const property = this.property();
        const message = getSearchScalarError(property, value());
        if (message) {
          return { kind: 'searchValue', message };
        }
        if (!isSearchOptionInputValue(this.propertyOptions(), value())) {
          return { kind: 'searchOption', message: 'Choose a configured value.' };
        }
        return valueOf(path.from) && isSearchRangeReversed(property, valueOf(path.from), value())
          ? { kind: 'searchRange', message: 'To must be greater than or equal to From.' }
          : undefined;
      });
      validate(path.from, ({ value, valueOf }) => {
        if (valueOf(path.operator) !== 'between' || !value()) {
          return undefined;
        }
        const message = getSearchScalarError(this.property(), value());
        if (message) {
          return { kind: 'searchValue', message };
        }
        return isSearchOptionInputValue(this.propertyOptions(), value())
          ? undefined
          : { kind: 'searchOption', message: 'Choose a configured value.' };
      });
      validate(path.values, ({ value, valueOf }) => {
        if (valueOf(path.operator) !== 'in') {
          return undefined;
        }
        const total = new Set([...value(), ...valueOf(path.customValues)]).size;
        if (total === 0) {
          return { kind: 'required', message: 'Choose or enter at least one value.' };
        }
        return total > getSearchMaxInValues(this.property())
          ? { kind: 'maxValues', message: 'Too many values selected.' }
          : undefined;
      });
      validate(path.customValues, ({ value, valueOf }) => {
        if (valueOf(path.operator) !== 'in') {
          return undefined;
        }
        const invalid = value().some(
          (token) => parseCustomSearchValue(this.property(), token) === null,
        );
        return invalid
          ? { kind: 'searchValue', message: 'One or more custom values are invalid.' }
          : undefined;
      });
      validate(path.customValueInput, ({ value, valueOf }) => {
        if (valueOf(path.operator) !== 'in' || !value().trim()) {
          return undefined;
        }
        const message = getSearchScalarError(this.property(), value().trim());
        if (message) {
          return { kind: 'searchValue', message };
        }
        return new Set([...valueOf(path.values), ...valueOf(path.customValues)]).size >=
          getSearchMaxInValues(this.property())
          ? { kind: 'maxValues', message: 'Value limit reached.' }
          : undefined;
      });
    }),
  );

  constructor() {
    effect(() => {
      if (this.table.disabled() && this.open()) {
        this.open.set(false);
      }
    });
    effect(() => {
      const signature = JSON.stringify(this.appliedFilter() ?? null);
      if (
        this.open() &&
        this.openedFilterSignature() &&
        signature !== this.openedFilterSignature()
      ) {
        this.open.set(false);
      }
    });
  }

  protected handleOpenChange(open: boolean): void {
    this.open.set(open);
    if (open) {
      this.draft.set(this.toDraft(this.appliedFilter()));
      this.openedFilterSignature.set(JSON.stringify(this.appliedFilter() ?? null));
      queueMicrotask(() => this.focusInitialControl());
    } else {
      this.openedFilterSignature.set('');
    }
  }

  protected handleOperatorChange(event: Event): void {
    const operator = (event.target as HTMLSelectElement).value as SearchOperator;
    if (!this.allowedOperators().includes(operator)) {
      return;
    }
    this.draft.update((draft) => ({
      ...draft,
      operator,
      value:
        this.isScalarOperator(draft.operator) && this.isScalarOperator(operator) ? draft.value : '',
      from: '',
      to: '',
      values: [],
      customValues: [],
      customValueInput: '',
      customValueStatus: '',
    }));
  }

  protected allowCustomInValues(): boolean {
    return this.property().allowCustomInValues === true;
  }

  protected totalInValues(): number {
    const draft = this.draft();
    return new Set([...draft.values, ...draft.customValues]).size;
  }

  protected maxInValues(): number {
    return getSearchMaxInValues(this.property());
  }

  protected isAtInValueLimit(): boolean {
    return this.totalInValues() >= this.maxInValues();
  }

  protected inValuePreview(): readonly InValuePreviewItem[] {
    const draft = this.draft();
    const optionLabels = new Map(
      this.propertyOptions().map((option) => [String(option.value), option.label]),
    );

    return [
      ...draft.values.map((value) => ({
        value,
        label: optionLabels.get(value) ?? value,
        custom: false,
      })),
      ...draft.customValues.map((value) => ({ value, label: value, custom: true })),
    ].slice(0, 3);
  }

  protected handleInOptionValuesChange(value: string | readonly string[] | null): void {
    const values = Array.isArray(value) ? [...value] : [];
    const availableSlots = Math.max(0, this.maxInValues() - this.draft().customValues.length);
    const capped = values.length > availableSlots;

    this.draft.update((draft) => ({
      ...draft,
      values: values.slice(0, availableSlots),
      customValueStatus: capped ? 'Value limit reached.' : '',
    }));
  }

  protected customValueInputError(): string {
    const value = this.draft().customValueInput.trim();
    if (!value) {
      return '';
    }
    return (
      getSearchScalarError(this.property(), value) ||
      (this.isAtInValueLimit() ? 'Value limit reached.' : '')
    );
  }

  protected handleCustomValueInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.draft.update((draft) => ({
      ...draft,
      customValueInput: value,
      customValueStatus: '',
    }));
  }

  protected handleCustomValueKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.addCustomValue();
  }

  protected handleCustomValuePaste(event: ClipboardEvent): void {
    const clipboardText = event.clipboardData?.getData('text');
    if (!clipboardText) {
      return;
    }

    event.preventDefault();
    this.addCustomValues(tokenizeSearchValues(clipboardText));
  }

  protected addCustomValue(): void {
    const draft = this.draft();
    if (!draft.customValueInput.trim() || this.customValueInputError() || this.isAtInValueLimit()) {
      return;
    }

    this.addCustomValues([draft.customValueInput]);
  }

  protected clipboardPasteAvailable(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.clipboard?.readText === 'function';
  }

  protected async pasteCustomValues(input: HTMLInputElement): Promise<void> {
    try {
      this.addCustomValues(tokenizeSearchValues(await navigator.clipboard.readText()));
    } catch {
      input.focus();
      this.draft.update((draft) => ({
        ...draft,
        customValueStatus: 'Clipboard access blocked. Paste into the field.',
      }));
    }
  }

  protected handleCustomValuesPopover(
    open: boolean,
    input: HTMLInputElement,
    trigger: HTMLButtonElement,
  ): void {
    queueMicrotask(() => (open ? input.focus() : trigger.focus()));
  }

  protected removeInValue(value: string, custom: boolean): void {
    this.draft.update((draft) => ({
      ...draft,
      values: custom ? draft.values : draft.values.filter((item) => item !== value),
      customValues: custom
        ? draft.customValues.filter((item) => item !== value)
        : draft.customValues,
      customValueStatus: '',
    }));
  }

  protected clearCustomValues(): void {
    this.draft.update((draft) => ({
      ...draft,
      customValues: [],
      customValueInput: '',
      customValueStatus: 'Custom values cleared.',
    }));
  }

  protected async apply(event: Event): Promise<void> {
    event.preventDefault();
    if (this.isIn() && this.draft().customValueInput.trim() && !this.customValueInputError()) {
      this.addCustomValue();
    }
    await submit(this.filterForm, async () => {
      const filter = this.toFilter(this.draft());
      if (this.table.commitFilter(this.property(), filter)) {
        this.closeAndFocus();
      }
      return undefined;
    });
  }

  protected clear(): void {
    if (this.table.clearFilter(this.property())) {
      this.closeAndFocus();
    }
  }

  protected cancel(): void {
    this.closeAndFocus();
  }

  protected label(): string {
    return this.property().label ?? this.property().propertyName;
  }

  protected readonly inputType = getSearchInputType;
  protected readonly inputMode = getSearchInputMode;
  protected readonly step = getSearchInputStep;

  private closeAndFocus(): void {
    this.open.set(false);
    queueMicrotask(() => this.trigger()?.nativeElement.focus());
  }

  private focusInitialControl(): void {
    const form = this.formElement()?.nativeElement;
    const controlName = this.firstInvalidControlName();
    const control = form?.querySelector<HTMLElement>(`[data-filter-control="${controlName}"]`);
    const focusable = control?.matches('button, input, select, textarea, [tabindex]')
      ? control
      : control?.querySelector<HTMLElement>('button, input, select, textarea, [tabindex]');
    (focusable ?? this.firstControl()?.nativeElement)?.focus();
  }

  private firstInvalidControlName(): 'operator' | 'value' | 'from' | 'to' | 'values' {
    const draft = this.draft();
    if (!this.allowedOperators().includes(draft.operator)) {
      return 'operator';
    }
    if (draft.operator === 'between') {
      if (
        !draft.from ||
        getSearchScalarError(this.property(), draft.from) ||
        !isSearchOptionInputValue(this.propertyOptions(), draft.from)
      ) {
        return 'from';
      }
      return !draft.to ||
        getSearchScalarError(this.property(), draft.to) ||
        !isSearchOptionInputValue(this.propertyOptions(), draft.to) ||
        isSearchRangeReversed(this.property(), draft.from, draft.to)
        ? 'to'
        : 'operator';
    }
    if (draft.operator === 'in') {
      return this.totalInValues() === 0 ? 'values' : 'operator';
    }
    if (isValuelessSearchOperator(draft.operator)) {
      return 'operator';
    }
    return !draft.value ||
      getSearchScalarError(this.property(), draft.value) ||
      !isSearchOptionInputValue(this.propertyOptions(), draft.value)
      ? 'value'
      : 'operator';
  }

  private isScalarOperator(operator: SearchOperator): boolean {
    return operator !== 'between' && operator !== 'in' && !isValuelessSearchOperator(operator);
  }

  private toDraft(filter: SearchQueryFormFilter | undefined): FilterDraft {
    const source = filter ?? createSearchFilter(this.property());
    const value = source.value;
    const between = value && !Array.isArray(value) && isBetweenValue(value) ? value : null;
    const options = new Set(this.propertyOptions().map((option) => String(option.value)));
    const values = Array.isArray(value) ? value.map(String) : [];

    return {
      operator: source.operator,
      value:
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
          ? stringifySearchScalar(value)
          : '',
      from: stringifySearchScalar(between?.from ?? null),
      to: stringifySearchScalar(between?.to ?? null),
      values: values.filter((item) => options.has(item)),
      customValues: values.filter((item) => !options.has(item)),
      customValueInput: '',
      customValueStatus: '',
    };
  }

  private toFilter(draft: FilterDraft): SearchQueryFormFilter {
    const current = untracked(() => this.appliedFilter());
    const base = current ?? createSearchFilter(this.property());
    return {
      ...base,
      property: this.property().propertyName,
      operator: draft.operator,
      value: this.toValue(draft),
      locked: current?.locked ?? this.property().required === true,
    };
  }

  private toValue(draft: FilterDraft): SearchRequestValue | null {
    if (isValuelessSearchOperator(draft.operator)) {
      return null;
    }
    if (draft.operator === 'between') {
      return {
        from: parseSearchScalar(this.property(), draft.from, this.propertyOptions()),
        to: parseSearchScalar(this.property(), draft.to, this.propertyOptions()),
      };
    }
    if (draft.operator === 'in') {
      const values: SearchScalarValue[] = draft.values.map((value) =>
        parseSearchScalar(this.property(), value, this.propertyOptions()),
      );
      for (const token of draft.customValues) {
        const value = parseCustomSearchValue(this.property(), token);
        if (value !== null) {
          values.push(value);
        }
      }
      return values.filter(
        (value, index, items) => items.findIndex((item) => Object.is(item, value)) === index,
      );
    }
    return parseSearchScalar(this.property(), draft.value, this.propertyOptions());
  }

  private addCustomValues(rawValues: readonly string[]): void {
    const draft = this.draft();
    const selectedValues = new Set(draft.values);
    const customValues = [...draft.customValues];
    const customValueSet = new Set(customValues);
    let addedCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;
    let cappedCount = 0;

    for (const rawValue of rawValues) {
      const parsedValue = parseCustomSearchValue(this.property(), rawValue);
      if (parsedValue === null) {
        invalidCount++;
        continue;
      }

      const value = stringifySearchScalar(parsedValue);
      if (selectedValues.has(value) || customValueSet.has(value)) {
        duplicateCount++;
        continue;
      }

      if (selectedValues.size + customValues.length >= this.maxInValues()) {
        cappedCount++;
        continue;
      }

      customValues.push(value);
      customValueSet.add(value);
      addedCount++;
    }

    this.draft.set({
      ...draft,
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

  private emptyDraft(): FilterDraft {
    return {
      operator: 'eq',
      value: '',
      from: '',
      to: '',
      values: [],
      customValues: [],
      customValueInput: '',
      customValueStatus: '',
    };
  }
}
