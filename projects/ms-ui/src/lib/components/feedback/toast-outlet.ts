import { Component, computed, inject } from '@angular/core';

import type { FeedbackKind } from './feedback-types';
import { ToastService } from './toast.service';

@Component({
  selector: 'ms-toast-outlet',
  templateUrl: './toast-outlet.html',
})
export class ToastOutletComponent {
  private readonly toastService = inject(ToastService);

  protected readonly entries = this.toastService.entries;
  protected readonly hasToasts = computed(() => this.entries().length > 0);

  protected close(id: string): void {
    this.toastService.close(id);
  }

  protected runAction(id: string): void {
    this.toastService.runAction(id);
  }

  protected pauseHover(id: string): void {
    this.toastService.pause(id, 'hover');
  }

  protected resumeHover(id: string): void {
    this.toastService.resume(id, 'hover');
  }

  protected pauseFocus(id: string): void {
    this.toastService.pause(id, 'focus');
  }

  protected resumeFocus(id: string, event: FocusEvent): void {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (
      currentTarget instanceof HTMLElement &&
      relatedTarget instanceof Node &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    this.toastService.resume(id, 'focus');
  }

  protected getRole(kind: FeedbackKind): 'status' | 'alert' {
    return kind === 'warning' || kind === 'danger' ? 'alert' : 'status';
  }

  protected getAriaLive(kind: FeedbackKind): 'polite' | 'assertive' {
    return kind === 'warning' || kind === 'danger' ? 'assertive' : 'polite';
  }

  protected getIcon(kind: FeedbackKind): string {
    switch (kind) {
      case 'success':
        return 'check';
      case 'warning':
        return 'priority_high';
      case 'danger':
        return 'close';
      case 'info':
      default:
        return 'info_i';
    }
  }
}
