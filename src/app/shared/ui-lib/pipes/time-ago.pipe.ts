import { OnDestroy, Pipe, PipeTransform, signal } from '@angular/core';

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const RELATIVE_TIME_UNITS: ReadonlyArray<{
  limit: number;
  size: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { limit: MINUTE, size: SECOND, unit: 'second' },
  { limit: HOUR, size: MINUTE, unit: 'minute' },
  { limit: DAY, size: HOUR, unit: 'hour' },
  { limit: WEEK, size: DAY, unit: 'day' },
  { limit: MONTH, size: WEEK, unit: 'week' },
  { limit: YEAR, size: MONTH, unit: 'month' },
  { limit: Number.POSITIVE_INFINITY, size: YEAR, unit: 'year' },
];

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'always',
  });
  private readonly refreshTick = signal(0);

  private timer: ReturnType<typeof setTimeout> | undefined;
  private timestamp: number | undefined;
  private live = false;

  transform(
    value: Date | string | null | undefined,
    live = false,
  ): string {
    this.refreshTick();

    const timestamp = this.parseTimestamp(value);

    if (timestamp === undefined) {
      this.updateTimer(undefined, false);
      return '';
    }

    this.updateTimer(timestamp, live);

    const difference = timestamp - Date.now();
    const relativeTime = RELATIVE_TIME_UNITS.find(
      ({ limit }) => Math.abs(difference) < limit,
    );

    if (!relativeTime) {
      return '';
    }

    return this.formatter.format(
      Math.round(difference / relativeTime.size),
      relativeTime.unit,
    );
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private parseTimestamp(
    value: Date | string | null | undefined,
  ): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return undefined;
    }

    const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  private updateTimer(timestamp: number | undefined, live: boolean): void {
    const inputChanged = timestamp !== this.timestamp || live !== this.live;

    this.timestamp = timestamp;
    this.live = live;

    if (inputChanged) {
      this.clearTimer();
    }

    if (!live || timestamp === undefined || this.timer !== undefined) {
      return;
    }

    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.refreshTick.update((tick) => tick + 1);
    }, this.getRefreshDelay(Math.abs(timestamp - Date.now())));
  }

  private getRefreshDelay(absoluteDifference: number): number {
    if (absoluteDifference < MINUTE) {
      return SECOND;
    }

    if (absoluteDifference < HOUR) {
      return MINUTE;
    }

    if (absoluteDifference < DAY) {
      return HOUR;
    }

    return DAY;
  }

  private clearTimer(): void {
    if (this.timer === undefined) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = undefined;
  }
}
