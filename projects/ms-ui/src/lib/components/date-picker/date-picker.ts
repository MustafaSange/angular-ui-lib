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
  viewChildren,
} from '@angular/core';
import {
  transformedValue,
  type FormValueControl,
  type ValidationError,
} from '@angular/forms/signals';

import {
  addCalendarDays,
  addCalendarMonths,
  createMonthGrid,
  formatDisplayDate,
  formatIsoDate,
  parseDisplayDate,
  parseIsoDate,
  todayIsoDate,
} from './date-picker-date-utils';
import type {
  DatePickerDisabledDate,
  DatePickerDisplayFormat,
  DatePickerValue,
} from './date-picker-types';

type PopoverElement = HTMLElement & {
  showPopover(options?: { source?: HTMLElement }): void;
  hidePopover(): void;
};

type CalendarView = 'day' | 'month' | 'year';

interface CalendarMonthOption {
  readonly value: number;
  readonly label: string;
  readonly ariaLabel: string;
}

const CALENDAR_YEAR_PAGE_SIZE = 12;
const MIN_CALENDAR_YEAR = 1;
const MAX_CALENDAR_YEAR = 9999;

let nextDatePickerId = 0;

@Component({
  selector: 'ms-date-picker',
  templateUrl: './date-picker.html',
  host: {
    class: 'date-picker',
    '[class.is-open]': 'open()',
    '[class.is-disabled]': 'disabled()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-invalid-input]': 'invalidInput()',
    '[attr.formField]': 'true',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.aria-readonly]': "readonly() ? 'true' : null",
  },
})
export class DatePickerComponent implements FormValueControl<DatePickerValue> {
  readonly value = model<DatePickerValue>(null);
  readonly open = model(false);
  readonly displayFormat = input<DatePickerDisplayFormat>('dd-MM-yyyy');
  readonly placeholder = input<string | null>(null);
  readonly minDate = input<string | undefined>(undefined);
  readonly maxDate = input<string | undefined>(undefined);
  readonly disabledDate = input<DatePickerDisabledDate | null>(null);
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
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
  readonly touch = output<void>();
  readonly parseErrorChange = output<ValidationError | null>();

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('dateInput');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('datePanel');
  private readonly dayButtons = viewChildren<ElementRef<HTMLButtonElement>>('dayButton');
  private readonly monthButtons = viewChildren<ElementRef<HTMLButtonElement>>('monthButton');
  private readonly yearButtons = viewChildren<ElementRef<HTMLButtonElement>>('yearButton');
  private readonly generatedInputId = `ms-date-picker-${nextDatePickerId++}`;
  private readonly today = todayIsoDate();

  protected readonly inputText = transformedValue(this.value, {
    parse: (text: string) => this.parseInputValue(text),
    format: (value) => formatDisplayDate(value, this.displayFormat()),
  });
  protected readonly invalidInput = computed(() => this.inputText.parseErrors().length > 0);
  protected readonly activeDate = signal(this.today);
  protected readonly visibleYear = signal(parseIsoDate(this.today)?.year ?? 1970);
  protected readonly visibleMonth = signal(parseIsoDate(this.today)?.month ?? 1);
  protected readonly calendarView = signal<CalendarView>('day');
  protected readonly panelId = `${this.generatedInputId}-panel`;
  protected readonly effectivePlaceholder = computed(
    () => this.placeholder() ?? this.displayFormat().replace('dd', 'DD').replace('yyyy', 'YYYY'),
  );
  protected readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat(this.locale(), { month: 'long' }).format(
      new Date(this.visibleYear(), this.visibleMonth() - 1, 1, 12),
    ),
  );
  protected readonly yearLabel = computed(() => this.visibleYear().toString());
  protected readonly calendarLabel = computed(() => `${this.monthLabel()} ${this.yearLabel()}`);
  protected readonly monthOptions = computed<readonly CalendarMonthOption[]>(() => {
    const shortFormatter = new Intl.DateTimeFormat(this.locale(), { month: 'short' });
    const longFormatter = new Intl.DateTimeFormat(this.locale(), { month: 'long' });

    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(this.visibleYear(), index, 1, 12);
      return {
        value: index + 1,
        label: shortFormatter.format(date),
        ariaLabel: longFormatter.format(date),
      };
    });
  });
  protected readonly yearPageStart = computed(() => {
    const start =
      Math.floor((this.visibleYear() - MIN_CALENDAR_YEAR) / CALENDAR_YEAR_PAGE_SIZE) *
        CALENDAR_YEAR_PAGE_SIZE +
      MIN_CALENDAR_YEAR;
    return Math.min(Math.max(start, MIN_CALENDAR_YEAR), MAX_CALENDAR_YEAR - 11);
  });
  protected readonly yearOptions = computed(() =>
    Array.from({ length: CALENDAR_YEAR_PAGE_SIZE }, (_, index) => this.yearPageStart() + index),
  );
  protected readonly yearRangeLabel = computed(() => {
    const years = this.yearOptions();
    return `${years[0]}–${years[years.length - 1]}`;
  });
  protected readonly previousNavigationLabel = computed(() => {
    switch (this.calendarView()) {
      case 'month':
        return 'Previous year';
      case 'year':
        return `Previous ${CALENDAR_YEAR_PAGE_SIZE} years`;
      default:
        return 'Previous month';
    }
  });
  protected readonly nextNavigationLabel = computed(() => {
    switch (this.calendarView()) {
      case 'month':
        return 'Next year';
      case 'year':
        return `Next ${CALENDAR_YEAR_PAGE_SIZE} years`;
      default:
        return 'Next month';
    }
  });
  protected readonly weekdayLabels = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const firstDay = this.normalizedFirstDayOfWeek();
    const sunday = new Date(2024, 0, 7, 12);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + ((firstDay + index) % 7));
      return formatter.format(date);
    });
  });
  protected readonly calendarDays = computed(() =>
    createMonthGrid(this.visibleYear(), this.visibleMonth(), this.normalizedFirstDayOfWeek()),
  );

  constructor() {
    effect(() => {
      this.parseErrorChange.emit(this.inputText.parseErrors()[0] ?? null);
    });

    effect(() => {
      const panel = this.panelRef()?.nativeElement as PopoverElement | undefined;
      const input = this.inputRef()?.nativeElement;
      const shouldOpen = this.open() && !this.disabled() && !this.readonly();

      if (!panel || !input) {
        return;
      }

      if (shouldOpen && !panel.matches(':popover-open')) {
        this.prepareCalendar();
        panel.showPopover({ source: input });
        window.setTimeout(() => this.focusActiveDay(), 0);
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

  protected navigatePrevious(): void {
    this.navigateCalendar(-1);
  }

  protected navigateNext(): void {
    this.navigateCalendar(1);
  }

  protected showMonthView(): void {
    this.calendarView.set('month');
    window.setTimeout(() => this.focusActiveMonth(), 0);
  }

  protected showYearView(): void {
    this.calendarView.set('year');
    window.setTimeout(() => this.focusActiveYear(), 0);
  }

  protected selectMonth(month: number): void {
    if (this.isMonthDisabled(month)) {
      return;
    }

    this.setActivePeriod(this.visibleYear(), month);
    this.calendarView.set('day');
    window.setTimeout(() => this.focusActiveDay(), 0);
  }

  protected selectYear(year: number): void {
    if (this.isYearDisabled(year)) {
      return;
    }

    this.setActivePeriod(year, this.visibleMonth());
    this.calendarView.set('month');
    window.setTimeout(() => this.focusActiveMonth(), 0);
  }

  protected handleMonthKeydown(event: KeyboardEvent): void {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -3,
      ArrowDown: 3,
    };

    if (event.key in moves) {
      event.preventDefault();
      this.moveMonthFocus(moves[event.key] ?? 0);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.moveMonthFocus((event.key === 'Home' ? 1 : 12) - this.visibleMonth());
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.setActivePeriod(
        this.clampYear(this.visibleYear() + (event.key === 'PageUp' ? -1 : 1)),
        this.visibleMonth(),
      );
      window.setTimeout(() => this.focusActiveMonth(), 0);
    } else if (event.key === 'Escape') {
      this.closePanelFromKeyboard(event);
    }
  }

  protected handleYearKeydown(event: KeyboardEvent): void {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -3,
      ArrowDown: 3,
      PageUp: -CALENDAR_YEAR_PAGE_SIZE,
      PageDown: CALENDAR_YEAR_PAGE_SIZE,
    };

    if (event.key in moves) {
      event.preventDefault();
      this.moveYearFocus(moves[event.key] ?? 0);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const years = this.yearOptions();
      this.moveYearFocus(
        (event.key === 'Home' ? years[0]! : years[years.length - 1]!) - this.visibleYear(),
      );
    } else if (event.key === 'Escape') {
      this.closePanelFromKeyboard(event);
    }
  }

  protected selectDate(date: string): void {
    if (this.isDateDisabled(date)) {
      return;
    }

    this.value.set(date);
    this.activeDate.set(date);
    this.open.set(false);
    this.emitTouch();
    this.focus();
  }

  protected handleDayKeydown(event: KeyboardEvent): void {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (event.key in moves) {
      event.preventDefault();
      this.moveActiveByDays(moves[event.key] ?? 0);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const parts = parseIsoDate(this.activeDate());
      if (parts) {
        const dayOfWeek = new Date(parts.year, parts.month - 1, parts.day, 12).getDay();
        const offset = (dayOfWeek - this.normalizedFirstDayOfWeek() + 7) % 7;
        this.moveActiveByDays(event.key === 'Home' ? -offset : 6 - offset);
      }
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.moveActiveByMonths(event.key === 'PageUp' ? -1 : 1, true);
    } else if (event.key === 'Escape') {
      this.closePanelFromKeyboard(event);
    }
  }

  protected isDateDisabled(date: string): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return Boolean((min && date < min) || (max && date > max) || this.disabledDate()?.(date));
  }

  protected isSelected(date: string): boolean {
    return this.value() === date;
  }

  protected isToday(date: string): boolean {
    return date === this.today;
  }

  protected isActive(date: string): boolean {
    return date === this.activeDate();
  }

  protected isMonthDisabled(month: number): boolean {
    const year = this.visibleYear();
    const monthStart = formatIsoDate({ year, month, day: 1 });
    const monthEnd = formatIsoDate({
      year,
      month,
      day: new Date(year, month, 0, 12).getDate(),
    });
    return this.isRangeOutsideDateLimits(monthStart, monthEnd);
  }

  protected isYearDisabled(year: number): boolean {
    return this.isRangeOutsideDateLimits(
      formatIsoDate({ year, month: 1, day: 1 }),
      formatIsoDate({ year, month: 12, day: 31 }),
    );
  }

  protected dayLabel(date: string): string {
    const parts = parseIsoDate(date);
    return parts
      ? new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' }).format(
          new Date(parts.year, parts.month - 1, parts.day, 12),
        )
      : date;
  }

  protected handlePanelToggle(event: ToggleEvent): void {
    if (event.newState === 'closed' && this.open()) {
      this.open.set(false);
    }
  }

  private commitInput(): void {
    if (this.inputText.parseErrors().length === 0) {
      this.inputText.set(formatDisplayDate(this.value(), this.displayFormat()));
    }
  }

  private parseInputValue(text: string) {
    const normalizedText = text.trim();

    if (!normalizedText) {
      return { value: null };
    }

    const parsed = parseDisplayDate(normalizedText, this.displayFormat());

    if (!parsed) {
      return {
        error: {
          kind: 'parse',
          message: `Enter a valid date in ${this.effectivePlaceholder()} format.`,
        },
      };
    }

    const min = this.minDate();
    const max = this.maxDate();

    if (min && parsed < min) {
      return {
        error: {
          kind: 'min',
          message: `Date must be on or after ${formatDisplayDate(min, this.displayFormat())}.`,
        },
      };
    }

    if (max && parsed > max) {
      return {
        error: {
          kind: 'max',
          message: `Date must be on or before ${formatDisplayDate(max, this.displayFormat())}.`,
        },
      };
    }

    if (this.disabledDate()?.(parsed)) {
      return { error: { kind: 'dateUnavailable', message: 'This date is unavailable.' } };
    }

    this.activeDate.set(parsed);
    return { value: parsed };
  }

  private prepareCalendar(): void {
    const candidate =
      this.value() && !this.isDateDisabled(this.value()!) ? this.value()! : this.today;
    const parts = parseIsoDate(candidate);

    if (parts) {
      this.activeDate.set(candidate);
      this.visibleYear.set(parts.year);
      this.visibleMonth.set(parts.month);
      this.calendarView.set('day');
    }
  }

  private navigateCalendar(direction: -1 | 1): void {
    switch (this.calendarView()) {
      case 'month':
        this.setActivePeriod(this.clampYear(this.visibleYear() + direction), this.visibleMonth());
        break;
      case 'year':
        this.moveYearFocus(direction * CALENDAR_YEAR_PAGE_SIZE, false);
        break;
      default:
        this.moveActiveByMonths(direction, false);
    }
  }

  private moveMonthFocus(amount: number): void {
    const currentMonthIndex =
      (this.visibleYear() - MIN_CALENDAR_YEAR) * 12 + this.visibleMonth() - 1;
    const targetMonthIndex = Math.min(
      Math.max(currentMonthIndex + amount, 0),
      MAX_CALENDAR_YEAR * 12 - 1,
    );
    const year = Math.floor(targetMonthIndex / 12) + MIN_CALENDAR_YEAR;
    const month = (targetMonthIndex % 12) + 1;
    this.setActivePeriod(year, month);
    window.setTimeout(() => this.focusActiveMonth(), 0);
  }

  private moveYearFocus(amount: number, focus = true): void {
    this.setActivePeriod(this.clampYear(this.visibleYear() + amount), this.visibleMonth());

    if (focus) {
      window.setTimeout(() => this.focusActiveYear(), 0);
    }
  }

  private setActivePeriod(year: number, month: number): void {
    const parts = parseIsoDate(this.activeDate());
    const lastDay = new Date(year, month, 0, 12).getDate();
    this.setActiveDate(
      formatIsoDate({ year, month, day: Math.min(parts?.day ?? 1, lastDay) }),
      false,
    );
  }

  private moveActiveByDays(amount: number): void {
    this.setActiveDate(addCalendarDays(this.activeDate(), amount));
  }

  private moveActiveByMonths(amount: number, focus: boolean): void {
    this.setActiveDate(addCalendarMonths(this.activeDate(), amount), focus);
  }

  private setActiveDate(date: string, focus = true): void {
    const parts = parseIsoDate(date);

    if (!parts) {
      return;
    }

    this.activeDate.set(date);
    this.visibleYear.set(parts.year);
    this.visibleMonth.set(parts.month);

    if (focus) {
      window.setTimeout(() => this.focusActiveDay(), 0);
    }
  }

  private focusActiveDay(): void {
    const activeDate = this.activeDate();
    const button = this.dayButtons().find(
      (item) => item.nativeElement.dataset['date'] === activeDate,
    );
    button?.nativeElement.focus();
  }

  private focusActiveMonth(): void {
    const month = this.visibleMonth().toString();
    const button = this.monthButtons().find(
      (item) => item.nativeElement.dataset['month'] === month,
    );
    button?.nativeElement.focus();
  }

  private focusActiveYear(): void {
    const year = this.visibleYear().toString();
    const button = this.yearButtons().find((item) => item.nativeElement.dataset['year'] === year);
    button?.nativeElement.focus();
  }

  private closePanelFromKeyboard(event: KeyboardEvent): void {
    event.preventDefault();
    this.open.set(false);
    this.focus();
  }

  private clampYear(year: number): number {
    return Math.min(Math.max(year, MIN_CALENDAR_YEAR), MAX_CALENDAR_YEAR);
  }

  private isRangeOutsideDateLimits(start: string, end: string): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return Boolean((min && end < min) || (max && start > max));
  }

  private normalizedFirstDayOfWeek(): number {
    return Math.min(Math.max(Math.trunc(this.firstDayOfWeek()), 0), 6);
  }

  private emitTouch(): void {
    this.touch.emit();
  }
}
