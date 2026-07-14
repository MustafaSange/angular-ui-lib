import type { TimePickerDisplayFormat, TimePickerPrecision } from './time-picker-types';

const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function parseTimeValue(value: string | null | undefined): number | null {
  const match = TIME_PATTERN.exec(value ?? '');

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? 0);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59
    ? hour * 3600 + minute * 60 + second
    : null;
}

export function formatTimeValue(
  totalSeconds: number,
  precision: TimePickerPrecision = 'minute',
): string {
  const normalized = ((Math.trunc(totalSeconds) % 86400) + 86400) % 86400;
  const hour = Math.floor(normalized / 3600);
  const minute = Math.floor((normalized % 3600) / 60);
  const second = normalized % 60;
  const minuteValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  return precision === 'second'
    ? `${minuteValue}:${second.toString().padStart(2, '0')}`
    : minuteValue;
}

export function formatDisplayTime(
  value: string | null,
  format: TimePickerDisplayFormat,
  precision: TimePickerPrecision = 'minute',
): string {
  const totalSeconds = parseTimeValue(value);

  if (totalSeconds === null) {
    return '';
  }

  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;
  const minuteText = minute.toString().padStart(2, '0');
  const secondText = precision === 'second' ? `:${second.toString().padStart(2, '0')}` : '';

  if (format === '24-hour') {
    return `${hour.toString().padStart(2, '0')}:${minuteText}${secondText}`;
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour.toString().padStart(2, '0')}:${minuteText}${secondText} ${period}`;
}

export function parseDisplayTime(
  value: string,
  format: TimePickerDisplayFormat,
  precision: TimePickerPrecision = 'minute',
): string | null {
  const normalized = value.trim();

  if (format === '24-hour') {
    const match =
      precision === 'second'
        ? /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(normalized)
        : /^(\d{1,2}):(\d{2})$/.exec(normalized);

    if (!match) {
      return null;
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] ?? 0);
    return hour <= 23 && minute <= 59 && second <= 59
      ? formatTimeValue(hour * 3600 + minute * 60 + second, precision)
      : null;
  }

  const match =
    precision === 'second'
      ? /^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i.exec(normalized)
      : /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(normalized);

  if (!match) {
    return null;
  }

  const displayHour = Number(match[1]);
  const minute = Number(match[2]);
  const second = precision === 'second' ? Number(match[3]) : 0;
  const period = match[precision === 'second' ? 4 : 3]?.toUpperCase();

  if (displayHour < 1 || displayHour > 12 || minute > 59 || second > 59) {
    return null;
  }

  const hour = (displayHour % 12) + (period === 'PM' ? 12 : 0);
  return formatTimeValue(hour * 3600 + minute * 60 + second, precision);
}
