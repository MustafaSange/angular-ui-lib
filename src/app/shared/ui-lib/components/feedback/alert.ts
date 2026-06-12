import { Component, booleanAttribute, computed, input, output, signal } from '@angular/core';

import type { FeedbackKind } from './feedback-types';

@Component({
  selector: 'ms-alert',
  templateUrl: './alert.html',
})
export class AlertComponent {
  readonly kind = input<FeedbackKind>('info');
  readonly title = input<string>();
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly showIcon = input(true, { transform: booleanAttribute });

  readonly dismissed = output<void>();

  protected readonly isVisible = signal(true);
  protected readonly role = computed(() => this.getRole(this.kind()));
  protected readonly ariaLive = computed(() => this.getAriaLive(this.kind()));
  protected readonly icon = computed(() => this.getIcon(this.kind()));

  protected dismiss(): void {
    if (!this.dismissible() || !this.isVisible()) {
      return;
    }

    this.isVisible.set(false);
    this.dismissed.emit();
  }

  private getRole(kind: FeedbackKind): 'status' | 'alert' {
    return kind === 'warning' || kind === 'danger' ? 'alert' : 'status';
  }

  private getAriaLive(kind: FeedbackKind): 'polite' | 'assertive' {
    return kind === 'warning' || kind === 'danger' ? 'assertive' : 'polite';
  }

  private getIcon(kind: FeedbackKind): string {
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
