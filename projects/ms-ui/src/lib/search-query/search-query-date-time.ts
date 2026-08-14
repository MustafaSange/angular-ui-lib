export interface SearchDateTimeRange {
  readonly from: string;
  readonly to: string;
}

export function createDateOnly(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function createTimeOnly(hours = 0, minutes = 0, seconds = 0): string {
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

export function createTodayDateTimeRange(): SearchDateTimeRange {
  const date = createDateOnly();

  return {
    from: `${date}T${createTimeOnly()}`,
    to: `${date}T${createTimeOnly(23, 59, 59)}`,
  };
}
