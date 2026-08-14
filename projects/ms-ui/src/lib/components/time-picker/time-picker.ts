import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  transformedValue,
  type FormValueControl,
  type ValidationError,
} from '@angular/forms/signals';

import {
  formatDisplayTime,
  formatTimeValue,
  parseDisplayTime,
  parseTimeValue,
} from './time-picker-utils';
import type {
  TimePickerDisplayFormat,
  TimePickerPrecision,
  TimePickerValue,
} from './time-picker-types';

type PopoverElement = HTMLElement & {
  showPopover(options?: { source?: HTMLElement }): void;
  hidePopover(): void;
};

type TimePeriod = 'AM' | 'PM';

let nextTimePickerId = 0;

@Component({
  selector: 'ms-time-picker',
  templateUrl: './time-picker.html',
  host: {
    class: 'time-picker',
    '[class.is-open]': 'open()',
    '[class.is-disabled]': 'disabled()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-invalid-input]': 'invalidInput()',
    '[attr.formField]': 'true',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.aria-readonly]': "readonly() ? 'true' : null",
  },
})
export class TimePickerComponent implements FormValueControl<TimePickerValue> {
  readonly value = model<TimePickerValue>(null);
  readonly open = model(false);
  readonly displayFormat = input<TimePickerDisplayFormat>('24-hour');
  readonly precision = input<TimePickerPrecision>('minute');
  readonly minuteStep = input(1, { transform: numberAttribute });
  readonly secondStep = input(1, { transform: numberAttribute });
  readonly placeholder = input<string | null>(null);
  readonly minTime = input<string | undefined>(undefined);
  readonly maxTime = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly name = input('');
  readonly id = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly touch = output<void>();
  readonly parseErrorChange = output<ValidationError | null>();

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('timeInput');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('timePanel');
  private readonly hourSelectRef = viewChild<ElementRef<HTMLSelectElement>>('hourSelect');
  private readonly generatedInputId = `ms-time-picker-${nextTimePickerId++}`;

  protected readonly inputText = transformedValue(this.value, {
    parse: (text: string) => this.parseInputValue(text),
    format: (value) => formatDisplayTime(value, this.displayFormat(), this.normalizedPrecision()),
  });
  protected readonly invalidInput = computed(() => this.inputText.parseErrors().length > 0);
  protected readonly panelId = `${this.generatedInputId}-panel`;
  protected readonly draftHour = signal(0);
  protected readonly draftMinute = signal(0);
  protected readonly draftSecond = signal(0);
  protected readonly draftPeriod = signal<TimePeriod>('AM');
  protected readonly showSeconds = computed(() => this.normalizedPrecision() === 'second');
  protected readonly showPeriod = computed(() => this.displayFormat() === '12-hour');
  protected readonly effectiveInputMode = computed(() => (this.showPeriod() ? 'text' : 'numeric'));
  protected readonly effectivePlaceholder = computed(() => {
    if (this.placeholder()) {
      return this.placeholder()!;
    }

    const seconds = this.showSeconds() ? ':SS' : '';
    const period = this.showPeriod() ? ' AM' : '';
    return `HH:MM${seconds}${period}`;
  });
  protected readonly hourOptions = computed(() =>
    Array.from({ length: this.showPeriod() ? 12 : 24 }, (_, index) =>
      this.showPeriod() ? index + 1 : index,
    ),
  );
  protected readonly minuteOptions = computed(() => this.createPartOptions(this.minuteStep()));
  protected readonly secondOptions = computed(() => this.createPartOptions(this.secondStep()));
  protected readonly periodOptions: readonly TimePeriod[] = ['AM', 'PM'];

  constructor() {
    effect(() => {
      this.parseErrorChange.emit(this.inputText.parseErrors()[0] ?? null);
    });

    effect(() => {
      const value = this.value();
      const precision = this.normalizedPrecision();
      const totalSeconds = parseTimeValue(value);

      if (value && totalSeconds !== null) {
        const normalizedValue = formatTimeValue(totalSeconds, precision);

        if (value !== normalizedValue) {
          this.value.set(normalizedValue);
        }
      }
    });

    effect(() => {
      const panel = this.panelRef()?.nativeElement as PopoverElement | undefined;
      const inputElement = this.inputRef()?.nativeElement;
      const shouldOpen = this.open() && !this.disabled() && !this.readonly();

      if (!panel || !inputElement) {
        return;
      }

      if (shouldOpen && !panel.matches(':popover-open')) {
        this.prepareSelectors();
        panel.showPopover({ source: inputElement });
        window.setTimeout(() => this.hourSelectRef()?.nativeElement.focus(), 0);
      } else if (!shouldOpen && panel.matches(':popover-open')) {
        panel.hidePopover();
      }
    });

    effect(() => {
      if ((this.disabled() || this.readonly()) && this.open()) {
        this.open.set(false);
      }
    });
  }

  focus(options?: FocusOptions): void {
    this.inputRef()?.nativeElement.focus(options);
  }

  reset(): void {
    this.inputText.set('');
    this.open.set(false);
  }

  protected inputId(): string {
    return this.id() ?? this.generatedInputId;
  }

  protected optionLabel(value: number): string {
    return value.toString().padStart(2, '0');
  }

  protected handleInput(event: Event): void {
    this.inputText.set((event.target as HTMLInputElement).value);
  }

  protected handleInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.disabled() && !this.readonly()) {
      event.preventDefault();
      this.open.set(true);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.commitInput();
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  protected handleBlur(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && this.panelRef()?.nativeElement.contains(nextTarget)) {
      return;
    }

    this.commitInput();
    this.emitTouch();
  }

  protected togglePanel(): void {
    if (!this.disabled() && !this.readonly()) {
      this.open.update((value) => !value);
    }
  }

  protected clear(event: MouseEvent): void {
    event.stopPropagation();
    this.inputText.set('');
    this.emitTouch();
    this.focus();
  }

  protected updateHour(event: Event): void {
    this.draftHour.set(Number((event.target as HTMLSelectElement).value));
    this.commitSelectors();
  }

  protected updateMinute(event: Event): void {
    this.draftMinute.set(Number((event.target as HTMLSelectElement).value));
    this.commitSelectors();
  }

  protected updateSecond(event: Event): void {
    this.draftSecond.set(Number((event.target as HTMLSelectElement).value));
    this.commitSelectors();
  }

  protected updatePeriod(event: Event): void {
    this.draftPeriod.set((event.target as HTMLSelectElement).value === 'PM' ? 'PM' : 'AM');
    this.commitSelectors();
  }

  protected finishSelection(): void {
    this.commitSelectors();
    this.emitTouch();

    if (!this.invalidInput()) {
      this.open.set(false);
      this.focus();
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.open.set(false);
      this.focus();
    }
  }

  protected handlePanelToggle(event: ToggleEvent): void {
    if (event.newState === 'closed' && this.open()) {
      this.open.set(false);
    }
  }

  private commitInput(): void {
    if (this.inputText.parseErrors().length === 0) {
      this.inputText.set(
        formatDisplayTime(this.value(), this.displayFormat(), this.normalizedPrecision()),
      );
    }
  }

  private parseInputValue(text: string) {
    const normalizedText = text.trim();

    if (!normalizedText) {
      return { value: null };
    }

    const precision = this.normalizedPrecision();
    const parsed = parseDisplayTime(normalizedText, this.displayFormat(), precision);

    if (!parsed) {
      return {
        error: {
          kind: 'parse',
          message: `Enter a valid time in ${this.effectivePlaceholder()} format.`,
        },
      };
    }

    const totalSeconds = parseTimeValue(parsed);
    const min = parseTimeValue(this.minTime());
    const max = parseTimeValue(this.maxTime());

    if (totalSeconds !== null && min !== null && totalSeconds < min) {
      return {
        error: {
          kind: 'min',
          message: `Time must be at or after ${formatDisplayTime(
            this.minTime() ?? null,
            this.displayFormat(),
            precision,
          )}.`,
        },
      };
    }

    if (totalSeconds !== null && max !== null && totalSeconds > max) {
      return {
        error: {
          kind: 'max',
          message: `Time must be at or before ${formatDisplayTime(
            this.maxTime() ?? null,
            this.displayFormat(),
            precision,
          )}.`,
        },
      };
    }

    return { value: parsed };
  }

  private prepareSelectors(): void {
    const totalSeconds = parseTimeValue(this.value()) ?? 0;
    const hour24 = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const second = totalSeconds % 60;

    this.draftHour.set(this.showPeriod() ? hour24 % 12 || 12 : hour24);
    this.draftMinute.set(this.closestOption(minute, this.minuteOptions()));
    this.draftSecond.set(this.closestOption(second, this.secondOptions()));
    this.draftPeriod.set(hour24 >= 12 ? 'PM' : 'AM');
  }

  private commitSelectors(): void {
    const displayHour = this.draftHour();
    const hour = this.showPeriod()
      ? (displayHour % 12) + (this.draftPeriod() === 'PM' ? 12 : 0)
      : displayHour;
    const totalSeconds = hour * 3600 + this.draftMinute() * 60 + this.draftSecond();
    const canonicalValue = formatTimeValue(totalSeconds, this.normalizedPrecision());

    this.inputText.set(
      formatDisplayTime(canonicalValue, this.displayFormat(), this.normalizedPrecision()),
    );
  }

  private normalizedPrecision(): TimePickerPrecision {
    return this.precision() === 'second' ? 'second' : 'minute';
  }

  private createPartOptions(stepValue: number): number[] {
    const step = this.normalizedPartStep(stepValue);
    const values: number[] = [];

    for (let value = 0; value < 60; value += step) {
      values.push(value);
    }

    return values;
  }

  private normalizedPartStep(stepValue: number): number {
    const step = Math.trunc(stepValue);
    return Number.isFinite(step) && step >= 1 && step <= 59 ? step : 1;
  }

  private closestOption(value: number, options: readonly number[]): number {
    return options.reduce(
      (closest, option) =>
        Math.abs(option - value) < Math.abs(closest - value) ? option : closest,
      options[0] ?? 0,
    );
  }

  private emitTouch(): void {
    this.touch.emit();
  }
}
