import {
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  debounced,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { FormValueControl } from '@angular/forms/signals';
import { Observable, Subscription, isObservable } from 'rxjs';

import type {
  SelectCompareWith,
  SelectDisplayWith,
  SelectOption,
  SelectSearchSource,
  SelectSelectedOptionContext,
  SelectValueSerializer,
} from './select-types';
import { SelectOptionComponent } from './select-option';

type SelectValue<TValue> = TValue | TValue[] | null;
type SelectDebouncedQuery = {
  readonly query: string;
  readonly debounceMs: number;
};
type PopoverElement = HTMLElement & {
  showPopover(options?: { source?: HTMLElement }): void;
  hidePopover(): void;
};

let nextSelectId = 0;

@Component({
  selector: 'ms-select',
  imports: [NgTemplateOutlet],
  templateUrl: './select.html',
  host: {
    class: 'select',
    '[class.is-open]': 'open()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-multiple]': 'multiple()',
    '[class.is-searchable]': 'searchable()',
    '[class.has-selection]': 'hasSelection()',
    '[attr.formField]': 'true',
  },
})
export class SelectComponent<TValue>
  implements FormValueControl<SelectValue<TValue>>
{
  readonly options = input<readonly SelectOption<TValue>[]>([]);
  readonly source = input<SelectSearchSource<TValue> | null>(null);
  readonly value = model<SelectValue<TValue>>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly debounceMs = input(250);
  readonly minQueryLength = input(0);
  readonly name = input('');
  readonly compareWith = input<SelectCompareWith<TValue>>((a, b) => Object.is(a, b));
  readonly displayWith = input<SelectDisplayWith<TValue>>((value) => String(value ?? ''));
  readonly selectedOptionTemplate = input<TemplateRef<SelectSelectedOptionContext<TValue>> | null>(
    null,
  );
  readonly valueSerializer = input<SelectValueSerializer<TValue>>((value) =>
    String(value ?? ''),
  );
  readonly id = input<string | null>(null);
  readonly ariaLabel = input('', { alias: 'aria-label' });
  readonly touch = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly projectedOptionComponents =
    contentChildren<SelectOptionComponent<TValue>>(SelectOptionComponent);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('selectInput');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('selectPanel');

  protected readonly panelId = `ms-select-panel-${nextSelectId}`;
  private readonly generatedInputId = `ms-select-input-${nextSelectId++}`;

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly loadedOptions = signal<readonly SelectOption<TValue>[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly activeIndex = signal(-1);
  private readonly touchEmitted = signal(false);
  private readonly interacted = signal(false);
  private readonly debouncedQuery = debounced<SelectDebouncedQuery>(
    () => ({
      query: this.query(),
      debounceMs: this.debounceMs(),
    }),
    (value) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, Math.max(0, value.debounceMs));
      }),
    {
      equal: (a, b) => a.query === b.query && a.debounceMs === b.debounceMs,
    },
  );

  private activeOptionScrollHandle: ReturnType<typeof setTimeout> | null = null;
  private panelOpenHandle: ReturnType<typeof setTimeout> | null = null;
  private sourceSubscription: Subscription | null = null;
  private sourceRequestId = 0;

  protected readonly isDisabled = computed(() => this.disabled());
  protected readonly isInteractiveDisabled = computed(() => this.isDisabled() || this.readonly());

  protected readonly visibleOptions = computed(() => {
    if (this.source()) {
      return this.loadedOptions();
    }

    const query = this.searchable() ? this.query().trim().toLocaleLowerCase() : '';
    const options = this.readStaticOptions();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      [option.label, option.description, option.group]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(query)),
    );
  });

  protected readonly selectedOptions = computed(() => {
    const values = this.selectedValues();
    const allOptions = [...this.readStaticOptions(), ...this.loadedOptions()];

    return values.map((value) => {
      const matched = allOptions.find((option) => this.compareWith()(option.value, value));
      return matched ?? { label: this.displayWith()(value), value };
    });
  });

  protected readonly inputText = computed(() => {
    if (this.multiple() || this.interacted()) {
      return this.query();
    }

    const value = this.singleValue();
    return value === null ? this.query() : this.selectedOptions()[0]?.label ?? '';
  });

  protected readonly inputPlaceholder = computed(() => {
    if (this.multiple() && this.selectedOptions().length > 0) {
      return '';
    }

    return this.placeholder();
  });

  protected readonly activeOptionDomId = computed(() => {
    const index = this.activeIndex();
    return index >= 0 ? this.optionDomId(index) : null;
  });

  protected readonly submittedValues = computed(() =>
    this.selectedValues().map((value) => this.valueSerializer()(value)),
  );

  protected readonly hasSelection = computed(() => this.selectedValues().length > 0);

  constructor() {
    effect(() => {
      const source = this.source();
      const query = this.searchable() ? this.query() : '';
      const debouncedQuery = this.searchable() ? this.debouncedQuery.value().query : '';
      const isDebouncingQuery = this.debouncedQuery.isLoading();
      const minQueryLength = this.searchable() ? this.minQueryLength() : 0;

      this.scheduleSourceLoad(source, query, debouncedQuery, isDebouncingQuery, minQueryLength);
    });

    effect(() => {
      const panel = this.panelRef()?.nativeElement as PopoverElement | undefined;
      const inputElement = this.inputRef()?.nativeElement;
      const shouldOpen = this.open() && !this.isInteractiveDisabled();

      if (!panel || !inputElement) {
        return;
      }

      if (shouldOpen && !this.isPanelOpen(panel)) {
        panel.showPopover({ source: this.elementRef.nativeElement });
      } else if (!shouldOpen && this.isPanelOpen(panel)) {
        panel.hidePopover();
      }
    });

    effect(() => {
      if (this.isInteractiveDisabled() && this.open()) {
        this.closePanel();
      }
    });

    effect(() => {
      const isOpen = this.open();
      const activeIndex = this.activeIndex();

      if (isOpen && activeIndex >= 0) {
        this.scheduleActiveOptionScroll();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearScheduledPanelOpen();
      this.clearActiveOptionScroll();
      this.sourceSubscription?.unsubscribe();
    });
  }

  focus(options?: FocusOptions): void {
    this.focusInput(options);
  }

  reset(): void {
    this.interacted.set(false);
    this.query.set('');
    this.closePanel();
  }

  protected inputId(): string {
    return this.id() ?? this.generatedInputId;
  }

  protected optionId(option: SelectOption<TValue>): string {
    return `${option.group ?? ''}:${option.label}:${this.valueSerializer()(option.value)}`;
  }

  protected optionDomId(index: number): string {
    return `${this.panelId}-option-${index}`;
  }

  protected shouldRenderGroup(index: number): boolean {
    const options = this.visibleOptions();
    const group = options[index]?.group;
    return Boolean(group && group !== options[index - 1]?.group);
  }

  protected singleValue(): TValue | null {
    const value = this.value();
    return Array.isArray(value) ? (value[0] ?? null) : value;
  }

  protected selectedValues(): TValue[] {
    const value = this.value();

    if (Array.isArray(value)) {
      return value;
    }

    return value === null ? [] : [value];
  }

  protected isSelected(option: SelectOption<TValue>): boolean {
    return this.selectedValues().some((value) => this.compareWith()(value, option.value));
  }

  protected focusInput(options?: FocusOptions, shouldOpen = true): void {
    if (!this.isInteractiveDisabled()) {
      this.inputRef()?.nativeElement.focus(options);

      if (shouldOpen) {
        this.schedulePanelOpen();
      }
    }
  }

  protected handleInput(event: Event): void {
    if (!this.searchable()) {
      return;
    }

    const inputElement = event.target;

    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    this.interacted.set(true);
    this.query.set(inputElement.value);
    this.openPanel();
  }

  protected handleFocus(): void {
    if (!this.isInteractiveDisabled()) {
      this.schedulePanelOpen();
    }
  }

  protected handleBlur(): void {
    window.setTimeout(() => {
      if (!this.hostContainsFocus()) {
        this.markTouched();
        this.closePanel();
        this.interacted.set(false);
        this.query.set('');
      }
    });
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isInteractiveDisabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openPanel();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openPanel();
        this.moveActive(-1);
        break;
      case 'Home':
        if (this.open()) {
          event.preventDefault();
          this.setFirstActive();
        }
        break;
      case 'End':
        if (this.open()) {
          event.preventDefault();
          this.setLastActive();
        }
        break;
      case 'Enter':
        if (this.open() && this.activeIndex() >= 0) {
          event.preventDefault();
          this.selectOption(this.visibleOptions()[this.activeIndex()]);
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.closePanel();
          this.interacted.set(false);
          this.query.set('');
        }
        break;
      case 'Backspace':
        if (!this.searchable() && this.multiple() && this.selectedOptions().length > 0) {
          event.preventDefault();
          this.commitValue(this.selectedValues().slice(0, -1));
        }
        break;
      case 'Tab':
        this.closePanel();
        this.markTouched();
        break;
    }
  }

  protected handleOptionPointerDown(event: MouseEvent): void {
    event.preventDefault();
  }

  protected handlePanelToggle(event: ToggleEvent): void {
    if (event.newState === 'open' && this.isInteractiveDisabled()) {
      this.closePanel();
      return;
    }

    this.open.set(event.newState === 'open');
  }

  protected togglePanel(): void {
    const shouldOpen = !this.open();

    this.focusInput(undefined, false);

    if (shouldOpen) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  protected selectOption(option: SelectOption<TValue> | undefined): void {
    if (!option || option.disabled || this.isInteractiveDisabled()) {
      return;
    }

    if (this.multiple()) {
      const selected = this.selectedValues();
      const exists = selected.some((value) => this.compareWith()(value, option.value));
      const nextValue = exists
        ? selected.filter((value) => !this.compareWith()(value, option.value))
        : [...selected, option.value];

      this.commitValue(nextValue);
      this.query.set('');
      this.interacted.set(true);
      this.openPanel();
    } else {
      this.commitValue(option.value);
      this.query.set('');
      this.interacted.set(false);
      this.closePanel();
    }
  }

  protected removeOption(option: SelectOption<TValue>, event: MouseEvent): void {
    event.stopPropagation();
    const nextValue = this.selectedValues().filter(
      (value) => !this.compareWith()(value, option.value),
    );
    this.commitValue(nextValue);
    this.focusInput();
  }

  protected clearSelection(): void {
    this.commitValue(this.multiple() ? [] : null);
    this.query.set('');
    this.interacted.set(false);
    this.focusInput();
  }

  private normalizeIncomingValue(value: SelectValue<TValue>): SelectValue<TValue> {
    if (this.multiple()) {
      return Array.isArray(value) ? value : value === null ? [] : [value];
    }

    return Array.isArray(value) ? (value[0] ?? null) : value;
  }

  private commitValue(value: SelectValue<TValue>): void {
    const normalized = this.normalizeIncomingValue(value);
    this.value.set(normalized);
  }

  private openPanel(): void {
    if (!this.isInteractiveDisabled()) {
      this.clearScheduledPanelOpen();
      this.open.set(true);
      this.ensureActiveOption();
    }
  }

  private closePanel(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
    this.clearScheduledPanelOpen();
    this.clearActiveOptionScroll();
  }

  private markTouched(): void {
    if (!this.touchEmitted()) {
      this.touchEmitted.set(true);
      this.touch.emit();
    }
  }

  private moveActive(step: 1 | -1): void {
    const enabledIndexes = this.enabledOptionIndexes();

    if (enabledIndexes.length === 0) {
      this.activeIndex.set(-1);
      return;
    }

    const currentPosition = enabledIndexes.indexOf(this.activeIndex());
    const nextPosition =
      currentPosition === -1
        ? step === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPosition + step + enabledIndexes.length) % enabledIndexes.length;

    this.activeIndex.set(enabledIndexes[nextPosition]);
  }

  private setFirstActive(): void {
    this.activeIndex.set(this.enabledOptionIndexes()[0] ?? -1);
  }

  private setLastActive(): void {
    const indexes = this.enabledOptionIndexes();
    this.activeIndex.set(indexes[indexes.length - 1] ?? -1);
  }

  private ensureActiveOption(): void {
    const activeIndex = this.activeIndex();
    const optionCount = this.visibleOptions().length;

    if (activeIndex >= 0 && activeIndex < optionCount) {
      return;
    }

    const selectedIndex = this.firstSelectedOptionIndex();
    this.activeIndex.set(selectedIndex >= 0 ? selectedIndex : this.enabledOptionIndexes()[0] ?? -1);
  }

  private firstSelectedOptionIndex(): number {
    const selectedValues = this.selectedValues();

    if (selectedValues.length === 0) {
      return -1;
    }

    return this.visibleOptions().findIndex((option) =>
      selectedValues.some((value) => this.compareWith()(value, option.value)),
    );
  }

  private enabledOptionIndexes(): number[] {
    return this.visibleOptions()
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
  }

  private readStaticOptions(): readonly SelectOption<TValue>[] {
    return [
      ...this.options(),
      ...this.projectedOptionComponents().map((option) => option.toOption()),
    ];
  }

  private scheduleSourceLoad(
    source: SelectSearchSource<TValue> | null,
    query: string,
    debouncedQuery: string,
    isDebouncingQuery: boolean,
    minQueryLength: number,
  ): void {
    this.sourceSubscription?.unsubscribe();
    this.sourceSubscription = null;

    if (!source) {
      this.loadedOptions.set([]);
      this.loading.set(false);
      this.error.set('');
      return;
    }

    if (query.length < minQueryLength) {
      this.loadedOptions.set([]);
      this.loading.set(false);
      this.error.set('');
      return;
    }

    if (isDebouncingQuery) {
      this.loading.set(true);
      this.error.set('');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.loadSource(source, debouncedQuery);
  }

  private loadSource(source: SelectSearchSource<TValue>, query: string): void {
    const requestId = ++this.sourceRequestId;
    const result =
      typeof source === 'function' ? source(query) : this.filterOptions(source, query);

    if (isObservable(result)) {
      this.sourceSubscription = (
        result as Observable<readonly SelectOption<TValue>[]>
      ).subscribe({
        next: (options) => this.applySourceResult(requestId, options),
        error: () => this.applySourceError(requestId),
      });
      return;
    }

    if (this.isPromise(result)) {
      result
        .then((options) => this.applySourceResult(requestId, options))
        .catch(() => this.applySourceError(requestId));
      return;
    }

    this.applySourceResult(requestId, result);
  }

  private applySourceResult(
    requestId: number,
    options: readonly SelectOption<TValue>[],
  ): void {
    if (requestId !== this.sourceRequestId) {
      return;
    }

    this.loadedOptions.set(options);
    this.loading.set(false);
    this.error.set('');
    this.activeIndex.set(-1);

    if (this.open()) {
      this.ensureActiveOption();
    }
  }

  private applySourceError(requestId: number): void {
    if (requestId !== this.sourceRequestId) {
      return;
    }

    this.loading.set(false);
    this.error.set('Options could not be loaded');
    this.activeIndex.set(-1);
  }

  private filterOptions(
    options: readonly SelectOption<TValue>[],
    query: string,
  ): readonly SelectOption<TValue>[] {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      [option.label, option.description, option.group]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }

  private schedulePanelOpen(): void {
    this.clearScheduledPanelOpen();
    this.panelOpenHandle = window.setTimeout(() => {
      this.panelOpenHandle = null;

      if (this.hostContainsFocus()) {
        this.openPanel();
      }
    });
  }

  private clearScheduledPanelOpen(): void {
    if (this.panelOpenHandle !== null) {
      clearTimeout(this.panelOpenHandle);
      this.panelOpenHandle = null;
    }
  }

  private scheduleActiveOptionScroll(): void {
    this.clearActiveOptionScroll();
    this.activeOptionScrollHandle = window.setTimeout(() => {
      this.activeOptionScrollHandle = null;
      this.scrollActiveOptionIntoView();
    });
  }

  private clearActiveOptionScroll(): void {
    if (this.activeOptionScrollHandle !== null) {
      clearTimeout(this.activeOptionScrollHandle);
      this.activeOptionScrollHandle = null;
    }
  }

  private scrollActiveOptionIntoView(): void {
    const activeIndex = this.activeIndex();
    const activeOption = this.panelRef()?.nativeElement.querySelector<HTMLElement>(
      `#${CSS.escape(this.optionDomId(activeIndex))}`,
    );

    activeOption?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  private isPromise(
    result: readonly SelectOption<TValue>[] | Promise<readonly SelectOption<TValue>[]>,
  ): result is Promise<readonly SelectOption<TValue>[]> {
    return typeof (result as Promise<readonly SelectOption<TValue>[]>).then === 'function';
  }

  private isPanelOpen(panel: HTMLElement): boolean {
    return panel.matches(':popover-open');
  }

  private hostContainsFocus(): boolean {
    const inputElement = this.inputRef()?.nativeElement;
    const panelElement = this.panelRef()?.nativeElement;
    const activeElement = document.activeElement;

    return Boolean(
      activeElement &&
        ((inputElement && inputElement === activeElement) ||
          (panelElement && panelElement.contains(activeElement))),
    );
  }
}
