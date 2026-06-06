import {
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { FormValueControl } from '@angular/forms/signals';
import { Observable, Subscription, isObservable } from 'rxjs';

import type {
  AutocompleteCompareWith,
  AutocompleteDisplayWith,
  AutocompleteOption,
  AutocompleteSearchSource,
  AutocompleteValueSerializer,
} from './autocomplete-types';
import { AutocompleteOptionComponent } from './autocomplete-option';

type AutocompleteValue<TValue> = TValue | TValue[] | null;
type PopoverElement = HTMLElement & {
  showPopover(options?: { source?: HTMLElement }): void;
  hidePopover(): void;
};

let nextAutocompleteId = 0;

@Component({
  selector: 'ms-autocomplete',
  imports: [NgTemplateOutlet],
  templateUrl: './autocomplete.html',
  host: {
    class: 'autocomplete',
    '[class.is-open]': 'open()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-multiple]': 'multiple()',
    '[attr.formField]': 'true',
  },
})
export class AutocompleteComponent<TValue>
  implements FormValueControl<AutocompleteValue<TValue>>
{
  readonly options = input<readonly AutocompleteOption<TValue>[]>([]);
  readonly source = input<AutocompleteSearchSource<TValue> | null>(null);
  readonly value = model<AutocompleteValue<TValue>>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly debounceMs = input(250);
  readonly minQueryLength = input(0);
  readonly name = input('');
  readonly compareWith = input<AutocompleteCompareWith<TValue>>((a, b) => Object.is(a, b));
  readonly displayWith = input<AutocompleteDisplayWith<TValue>>((value) => String(value ?? ''));
  readonly valueSerializer = input<AutocompleteValueSerializer<TValue>>((value) =>
    String(value ?? ''),
  );
  readonly id = input<string | null>(null);
  readonly touch = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly projectedOptionComponents =
    contentChildren<AutocompleteOptionComponent<TValue>>(AutocompleteOptionComponent);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('autocompleteInput');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('autocompletePanel');

  protected readonly panelId = `ms-autocomplete-panel-${nextAutocompleteId}`;
  private readonly generatedInputId = `ms-autocomplete-input-${nextAutocompleteId++}`;

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly loadedOptions = signal<readonly AutocompleteOption<TValue>[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly activeIndex = signal(-1);
  private readonly touchEmitted = signal(false);
  private readonly interacted = signal(false);

  private debounceHandle: ReturnType<typeof setTimeout> | null = null;
  private sourceSubscription: Subscription | null = null;
  private sourceRequestId = 0;

  protected readonly isDisabled = computed(() => this.disabled());
  protected readonly isInteractiveDisabled = computed(() => this.isDisabled() || this.readonly());

  protected readonly visibleOptions = computed(() => {
    if (this.source()) {
      return this.loadedOptions();
    }

    const query = this.query().trim().toLocaleLowerCase();
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
      const query = this.query();
      const debounceMs = this.debounceMs();
      const minQueryLength = this.minQueryLength();

      this.scheduleSourceLoad(source, query, debounceMs, minQueryLength);
    });

    effect(() => {
      const panel = this.panelRef()?.nativeElement as PopoverElement | undefined;
      const inputElement = this.inputRef()?.nativeElement;
      const shouldOpen = this.open();

      if (!panel || !inputElement) {
        return;
      }

      if (shouldOpen && !this.isPanelOpen(panel)) {
        panel.showPopover({ source: inputElement });
      } else if (!shouldOpen && this.isPanelOpen(panel)) {
        panel.hidePopover();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearDebounce();
      this.sourceSubscription?.unsubscribe();
    });
  }

  focus(options?: FocusOptions): void {
    this.inputRef()?.nativeElement.focus(options);
  }

  reset(): void {
    this.interacted.set(false);
    this.query.set('');
    this.closePanel();
  }

  protected inputId(): string {
    return this.id() ?? this.generatedInputId;
  }

  protected optionId(option: AutocompleteOption<TValue>): string {
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

  protected isSelected(option: AutocompleteOption<TValue>): boolean {
    return this.selectedValues().some((value) => this.compareWith()(value, option.value));
  }

  protected focusInput(): void {
    if (!this.isInteractiveDisabled()) {
      this.inputRef()?.nativeElement.focus();
    }
  }

  protected handleInput(event: Event): void {
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
      this.openPanel();
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
    this.open.set(event.newState === 'open');
  }

  protected togglePanel(): void {
    this.focusInput();

    if (this.open()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  protected selectOption(option: AutocompleteOption<TValue> | undefined): void {
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

  protected removeOption(option: AutocompleteOption<TValue>, event: MouseEvent): void {
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

  private normalizeIncomingValue(value: AutocompleteValue<TValue>): AutocompleteValue<TValue> {
    if (this.multiple()) {
      return Array.isArray(value) ? value : value === null ? [] : [value];
    }

    return Array.isArray(value) ? (value[0] ?? null) : value;
  }

  private commitValue(value: AutocompleteValue<TValue>): void {
    const normalized = this.normalizeIncomingValue(value);
    this.value.set(normalized);
  }

  private openPanel(): void {
    if (!this.isInteractiveDisabled()) {
      this.open.set(true);
      this.ensureActiveOption();
    }
  }

  private closePanel(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
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
    if (this.activeIndex() >= 0) {
      return;
    }

    this.setFirstActive();
  }

  private enabledOptionIndexes(): number[] {
    return this.visibleOptions()
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
  }

  private readStaticOptions(): readonly AutocompleteOption<TValue>[] {
    return [
      ...this.options(),
      ...this.projectedOptionComponents().map((option) => option.toOption()),
    ];
  }

  private scheduleSourceLoad(
    source: AutocompleteSearchSource<TValue> | null,
    query: string,
    debounceMs: number,
    minQueryLength: number,
  ): void {
    this.clearDebounce();
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

    this.loading.set(true);
    this.error.set('');
    this.debounceHandle = setTimeout(() => {
      this.loadSource(source, query);
    }, Math.max(0, debounceMs));
  }

  private loadSource(source: AutocompleteSearchSource<TValue>, query: string): void {
    const requestId = ++this.sourceRequestId;
    const result =
      typeof source === 'function' ? source(query) : this.filterOptions(source, query);

    if (isObservable(result)) {
      this.sourceSubscription = (
        result as Observable<readonly AutocompleteOption<TValue>[]>
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
    options: readonly AutocompleteOption<TValue>[],
  ): void {
    if (requestId !== this.sourceRequestId) {
      return;
    }

    this.loadedOptions.set(options);
    this.loading.set(false);
    this.error.set('');
    this.activeIndex.set(-1);
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
    options: readonly AutocompleteOption<TValue>[],
    query: string,
  ): readonly AutocompleteOption<TValue>[] {
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

  private clearDebounce(): void {
    if (this.debounceHandle !== null) {
      clearTimeout(this.debounceHandle);
      this.debounceHandle = null;
    }
  }

  private isPromise(
    result: readonly AutocompleteOption<TValue>[] | Promise<readonly AutocompleteOption<TValue>[]>,
  ): result is Promise<readonly AutocompleteOption<TValue>[]> {
    return typeof (result as Promise<readonly AutocompleteOption<TValue>[]>).then === 'function';
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
