import type { DatePickerDisplayFormat } from './date-picker-types';

export interface CalendarDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface CalendarDay extends CalendarDateParts {
  readonly iso: string;
  readonly inCurrentMonth: boolean;
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string | null | undefined): CalendarDateParts | null {
  const match = ISO_DATE_PATTERN.exec(value ?? '');

  if (!match) {
    return null;
  }

  return validDateParts(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function formatIsoDate(parts: CalendarDateParts): string {
  return `${parts.year.toString().padStart(4, '0')}-${parts.month
    .toString()
    .padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}`;
}

export function formatDisplayDate(value: string | null, format: DatePickerDisplayFormat): string {
  const parts = parseIsoDate(value);

  if (!parts) {
    return '';
  }

  const day = parts.day.toString().padStart(2, '0');
  const month = parts.month.toString().padStart(2, '0');
  const year = parts.year.toString().padStart(4, '0');

  switch (format) {
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    case 'MM-dd-yyyy':
      return `${month}-${day}-${year}`;
    default:
      return `${day}-${month}-${year}`;
  }
}

export function parseDisplayDate(value: string, format: DatePickerDisplayFormat): string | null {
  const match = /^(\d{1,4})-(\d{1,2})-(\d{1,4})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const first = Number(match[1]);
  const second = Number(match[2]);
  const third = Number(match[3]);
  const parts =
    format === 'yyyy-MM-dd'
      ? validDateParts(first, second, third)
      : format === 'MM-dd-yyyy'
        ? validDateParts(third, first, second)
        : validDateParts(third, second, first);

  return parts ? formatIsoDate(parts) : null;
}

export function addCalendarDays(value: string, amount: number): string {
  const parts = parseIsoDate(value);

  if (!parts) {
    return value;
  }

  const date = new Date(parts.year, parts.month - 1, parts.day + amount, 12);
  return formatIsoDate({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

export function addCalendarMonths(value: string, amount: number): string {
  const parts = parseIsoDate(value);

  if (!parts) {
    return value;
  }

  const targetMonth = parts.month - 1 + amount;
  const targetYear = parts.year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0, 12).getDate();

  return formatIsoDate({
    year: targetYear,
    month: normalizedMonth + 1,
    day: Math.min(parts.day, lastDay),
  });
}

export function createMonthGrid(
  year: number,
  month: number,
  firstDayOfWeek: number,
): CalendarDay[] {
  const normalizedFirstDay = Math.min(Math.max(Math.trunc(firstDayOfWeek), 0), 6);
  const firstOfMonth = new Date(year, month - 1, 1, 12);
  const leadingDays = (firstOfMonth.getDay() - normalizedFirstDay + 7) % 7;

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month - 1, index - leadingDays + 1, 12);
    const parts = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };

    return {
      ...parts,
      iso: formatIsoDate(parts),
      inCurrentMonth: parts.year === year && parts.month === month,
    };
  });
}

export function todayIsoDate(): string {
  const today = new Date();
  return formatIsoDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
}

function validDateParts(year: number, month: number, day: number): CalendarDateParts | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) {
    return null;
  }

  const candidate = new Date(year, month - 1, day, 12);

  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() + 1 !== month ||
    candidate.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}
