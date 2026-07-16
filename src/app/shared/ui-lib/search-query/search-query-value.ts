import type {
  SearchPropertyConfig,
  SearchPropertyOption,
  SearchScalarValue,
} from './search-query-types';

export const DEFAULT_SEARCH_STRING_MAX_LENGTH = 50;
export const DEFAULT_SEARCH_MAX_IN_VALUES = 50;

const GUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function getSearchInputType(property: SearchPropertyConfig | null): string {
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

export function getSearchInputMode(property: SearchPropertyConfig | null): string | null {
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

export function getSearchInputStep(property: SearchPropertyConfig | null): string | null {
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

export function stringifySearchScalar(value: SearchScalarValue | null): string {
  return value === null ? '' : String(value);
}

export function isSearchOptionInputValue(
  options: readonly SearchPropertyOption[],
  value: string,
): boolean {
  return options.length === 0 || options.some((option) => String(option.value) === value);
}

export function parseSearchScalar(
  property: SearchPropertyConfig,
  value: string,
  options: readonly SearchPropertyOption[],
): SearchScalarValue {
  const option = options.find((item) => String(item.value) === value);

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
      return Number(value);
    case 'enum':
      return value;
    default:
      return value;
  }
}

export function parseCustomSearchValue(
  property: SearchPropertyConfig,
  rawValue: string,
): SearchScalarValue | null {
  const value = rawValue.trim();

  if (!value || getSearchScalarError(property, value)) {
    return null;
  }

  switch (property.dataType) {
    case 'int':
    case 'long':
      return Number.parseInt(value, 10);
    case 'decimal':
      return Number(value);
    case 'guid':
    case 'date':
    case 'time':
    case 'dateTime':
    case 'string':
    case 'enum':
      return value;
    default:
      return null;
  }
}

export function getSearchScalarError(property: SearchPropertyConfig, value: string): string {
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
    case 'date':
      return isValidDateValue(value) ? '' : 'Enter a valid date in YYYY-MM-DD format.';
    case 'time':
      return isValidTimeValue(value) ? '' : 'Enter a valid time.';
    case 'dateTime': {
      const [date, time, extra] = value.split('T');
      return !extra && date && time && isValidDateValue(date) && isValidTimeValue(time)
        ? ''
        : 'Enter a valid date and time.';
    }
    case 'string': {
      const maxLength = Math.min(
        property.maxStringLength ?? DEFAULT_SEARCH_STRING_MAX_LENGTH,
        DEFAULT_SEARCH_STRING_MAX_LENGTH,
      );
      return value.length <= maxLength ? '' : `Enter no more than ${maxLength} characters.`;
    }
    default:
      return '';
  }
}

export function isSearchRangeReversed(
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

export function tokenizeSearchValues(value: string): readonly string[] {
  return value
    .split(/[\n,;\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createSearchValueStatus(
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

function isValidDateValue(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isValidTimeValue(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(value);
}
