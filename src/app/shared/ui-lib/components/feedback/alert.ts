import { Component, booleanAttribute, computed, input, output, signal } from '@angular/core';

import type { FeedbackVariant } from './feedback-types';

@Component({
  selector: 'ms-alert',
  templateUrl: './alert.html',
})
export class AlertComponent {
  readonly variant = input<FeedbackVariant>('info');
  readonly title = input<string>();
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly showIcon = input(true, { transform: booleanAttribute });

  readonly dismissed = output<void>();

  protected readonly isVisible = signal(true);
  protected readonly role = computed(() => this.getRole(this.variant()));
  protected readonly ariaLive = computed(() => this.getAriaLive(this.variant()));
  protected readonly icon = computed(() => this.getIcon(this.variant()));

  protected dismiss(): void {
    if (!this.dismissible() || !this.isVisible()) {
      return;
    }

    this.isVisible.set(false);
    this.dismissed.emit();
  }

  private getRole(variant: FeedbackVariant): 'status' | 'alert' {
    return variant === 'warning' || variant === 'danger' ? 'alert' : 'status';
  }

  private getAriaLive(variant: FeedbackVariant): 'polite' | 'assertive' {
    return variant === 'warning' || variant === 'danger' ? 'assertive' : 'polite';
  }

  private getIcon(variant: FeedbackVariant): string {
    switch (variant) {
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
