import { Component, booleanAttribute, input, model, output, signal } from '@angular/core';
import {
  transformedValue,
  type FormValueControl,
  type ValidationError,
} from '@angular/forms/signals';

import { DatePickerComponent } from '../date-picker';
import type {
  DatePickerDisabledDate,
  DatePickerDisplayFormat,
  DatePickerValue,
} from '../date-picker';
import { TimePickerComponent } from '../time-picker';
import type { TimePickerDisplayFormat, TimePickerPrecision, TimePickerValue } from '../time-picker';
import type { DateTimePickerValue } from './date-time-picker-types';

let nextDateTimePickerId = 0;

interface DateTimePickerParts {
  readonly date: DatePickerValue;
  readonly time: TimePickerValue;
}

const LOCAL_DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)$/;

@Component({
  selector: 'ms-date-time-picker',
  imports: [DatePickerComponent, TimePickerComponent],
  templateUrl: './date-time-picker.html',
  host: {
    class: 'date-time-picker',
    role: 'group',
    '[class.is-disabled]': 'disabled()',
    '[class.is-readonly]': 'readonly()',
    '[attr.formField]': 'true',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.aria-readonly]': "readonly() ? 'true' : null",
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-describedby]': 'ariaDescribedby()',
  },
})
export class DateTimePickerComponent implements FormValueControl<DateTimePickerValue> {
  readonly value = model<DateTimePickerValue>(null);
  readonly dateDisplayFormat = input<DatePickerDisplayFormat>('dd-MM-yyyy');
  readonly timeDisplayFormat = input<TimePickerDisplayFormat>('24-hour');
  readonly timePrecision = input<TimePickerPrecision>('minute');
  readonly datePlaceholder = input<string | null>(null);
  readonly timePlaceholder = input<string | null>(null);
  readonly minDate = input<string | undefined>(undefined);
  readonly maxDate = input<string | undefined>(undefined);
  readonly minTime = input<string | undefined>(undefined);
  readonly maxTime = input<string | undefined>(undefined);
  readonly disabledDate = input<DatePickerDisabledDate | null>(null);
  readonly minuteStep = input(1);
  readonly secondStep = input(1);
  readonly firstDayOfWeek = input(0);
  readonly locale = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly name = input('');
  readonly id = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly dateAriaLabel = input('Date');
  readonly timeAriaLabel = input('Time');
  readonly touch = output<void>();

  private readonly generatedId = `ms-date-time-picker-${nextDateTimePickerId++}`;
  private readonly dateParseError = signal<ValidationError | null>(null);
  private readonly timeParseError = signal<ValidationError | null>(null);
  protected readonly inputValue = transformedValue(this.value, {
    parse: (parts: DateTimePickerParts) => {
      const error = this.dateParseError() ?? this.timeParseError();

      if (error) {
        return { error };
      }

      if (!parts.date && !parts.time) {
        return { value: null };
      }

      if (!parts.date) {
        return { error: { kind: 'required', message: 'Choose a date.' } };
      }

      if (!parts.time) {
        return { error: { kind: 'required', message: 'Choose a time.' } };
      }

      return { value: `${parts.date}T${parts.time}` };
    },
    format: (value) => this.splitValue(value),
  });

  focus(options?: FocusOptions): void {
    const element = document.getElementById(this.dateInputId());
    element?.focus(options);
  }

  reset(): void {
    this.inputValue.set({ date: null, time: null });
  }

  protected dateInputId(): string {
    return `${this.id() ?? this.generatedId}-date`;
  }

  protected timeInputId(): string {
    return `${this.id() ?? this.generatedId}-time`;
  }

  protected updateDate(date: DatePickerValue): void {
    this.inputValue.update((current) => ({ ...current, date }));
  }

  protected updateTime(time: TimePickerValue): void {
    this.inputValue.update((current) => ({ ...current, time }));
  }

  protected updateDateParseError(error: ValidationError | null): void {
    this.dateParseError.set(error);
    this.refreshParseErrors();
  }

  protected updateTimeParseError(error: ValidationError | null): void {
    this.timeParseError.set(error);
    this.refreshParseErrors();
  }

  private refreshParseErrors(): void {
    this.inputValue.set(this.inputValue());
  }

  private splitValue(value: DateTimePickerValue): DateTimePickerParts {
    const match = LOCAL_DATE_TIME_PATTERN.exec(value ?? '');

    return {
      date: match?.[1] ?? null,
      time: match?.[2] ?? null,
    };
  }
}
