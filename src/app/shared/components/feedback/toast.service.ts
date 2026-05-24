import { Injectable, signal } from '@angular/core';

import type { FeedbackVariant, ToastConfig, ToastEntry } from './feedback-types';
import { ToastRef } from './toast-ref';

type ToastRecord = ToastEntry & {
  ref: ToastRef;
  remainingDuration: number | false;
  pauseReasons: Set<ToastPauseReason>;
  timerStartedAt: number | undefined;
  timerId: ReturnType<typeof setTimeout> | undefined;
};

type ToastPauseReason = 'focus' | 'hover';

const DEFAULT_TIMED_DURATION = 5000;
const MAX_VISIBLE_TOASTS = 5;

let nextToastId = 0;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly records = new Map<string, ToastRecord>();
  private readonly toastEntries = signal<ToastEntry[]>([]);

  readonly entries = this.toastEntries.asReadonly();

  show(config: ToastConfig): ToastRef {
    const variant = config.variant ?? 'info';
    const duration = config.duration ?? this.getDefaultDuration(variant);
    const id = `toast-${nextToastId++}`;
    const ref = new ToastRef(id);
    const record: ToastRecord = {
      id,
      message: config.message,
      variant,
      title: config.title,
      action: config.action,
      duration,
      dismissible: config.dismissible ?? true,
      showIcon: config.showIcon ?? true,
      ref,
      remainingDuration: duration,
      pauseReasons: new Set<ToastPauseReason>(),
      timerStartedAt: undefined,
      timerId: undefined,
    };

    ref.setCloseHandler(() => this.close(id));
    this.records.set(id, record);
    this.toastEntries.update((entries) => [this.toEntry(record), ...entries]);
    this.trimToVisibleLimit();
    this.startTimer(record);

    return ref;
  }

  info(message: string, options: Omit<ToastConfig, 'message' | 'variant'> = {}): ToastRef {
    return this.show({
      ...options,
      message,
      variant: 'info',
    });
  }

  success(message: string, options: Omit<ToastConfig, 'message' | 'variant'> = {}): ToastRef {
    return this.show({
      ...options,
      message,
      variant: 'success',
    });
  }

  warning(message: string, options: Omit<ToastConfig, 'message' | 'variant'> = {}): ToastRef {
    return this.show({
      ...options,
      message,
      variant: 'warning',
    });
  }

  danger(message: string, options: Omit<ToastConfig, 'message' | 'variant'> = {}): ToastRef {
    return this.show({
      ...options,
      message,
      variant: 'danger',
    });
  }

  clear(): void {
    for (const id of Array.from(this.records.keys())) {
      this.close(id);
    }
  }

  pause(id: string, reason: ToastPauseReason): void {
    const record = this.records.get(id);

    if (!record || record.remainingDuration === false) {
      return;
    }

    record.pauseReasons.add(reason);

    if (!record.timerId) {
      return;
    }

    clearTimeout(record.timerId);
    record.timerId = undefined;

    if (record.timerStartedAt !== undefined) {
      record.remainingDuration = Math.max(0, record.remainingDuration - this.elapsed(record));
      record.timerStartedAt = undefined;
    }
  }

  resume(id: string, reason: ToastPauseReason): void {
    const record = this.records.get(id);

    if (!record || record.remainingDuration === false || record.timerId) {
      return;
    }

    record.pauseReasons.delete(reason);

    if (record.pauseReasons.size > 0) {
      return;
    }

    this.startTimer(record);
  }

  close(id: string): void {
    const record = this.records.get(id);

    if (!record) {
      return;
    }

    if (record.timerId) {
      clearTimeout(record.timerId);
    }

    this.records.delete(id);
    this.toastEntries.update((entries) => entries.filter((entry) => entry.id !== id));
    record.ref.finishClose();
  }

  runAction(id: string): void {
    const record = this.records.get(id);

    if (!record?.action) {
      return;
    }

    try {
      record.action.run();
    } finally {
      this.close(id);
    }
  }

  private trimToVisibleLimit(): void {
    const entries = this.toastEntries();

    if (entries.length <= MAX_VISIBLE_TOASTS) {
      return;
    }

    for (const entry of entries.slice(MAX_VISIBLE_TOASTS)) {
      this.close(entry.id);
    }
  }

  private startTimer(record: ToastRecord): void {
    if (record.remainingDuration === false) {
      return;
    }

    if (record.pauseReasons.size > 0) {
      return;
    }

    if (record.remainingDuration <= 0) {
      this.close(record.id);
      return;
    }

    record.timerStartedAt = Date.now();
    record.timerId = setTimeout(() => {
      this.close(record.id);
    }, record.remainingDuration);
  }

  private getDefaultDuration(variant: FeedbackVariant): number | false {
    return variant === 'info' || variant === 'success' ? DEFAULT_TIMED_DURATION : false;
  }

  private elapsed(record: ToastRecord): number {
    return record.timerStartedAt === undefined ? 0 : Date.now() - record.timerStartedAt;
  }

  private toEntry(record: ToastRecord): ToastEntry {
    const { id, message, variant, title, action, duration, dismissible, showIcon } = record;

    return {
      id,
      message,
      variant,
      title,
      action,
      duration,
      dismissible,
      showIcon,
    };
  }
}
