import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import type { FeedbackVariant } from './feedback-types';
import { ToastService } from './toast.service';

@Component({
  selector: 'ms-toast-outlet',
  templateUrl: './toast-outlet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected getRole(variant: FeedbackVariant): 'status' | 'alert' {
    return variant === 'warning' || variant === 'danger' ? 'alert' : 'status';
  }

  protected getAriaLive(variant: FeedbackVariant): 'polite' | 'assertive' {
    return variant === 'warning' || variant === 'danger' ? 'assertive' : 'polite';
  }

  protected getIcon(variant: FeedbackVariant): string {
    switch (variant) {
      case 'success':
        return '✓';
      case 'warning':
        return '!';
      case 'danger':
        return 'x';
      case 'info':
      default:
        return 'i';
    }
  }
}
