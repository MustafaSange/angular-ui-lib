import { Component, computed, input } from '@angular/core';

import type { ProgressKind, ProgressSize } from './progress-indicator-types';

@Component({
  selector: 'ms-progress-indicator',
  templateUrl: './progress-indicator.html',
})
export class ProgressIndicatorComponent {
  readonly value = input<number | null>(null);
  readonly max = input(100);
  readonly size = input<ProgressSize>('md');
  readonly kind = input<ProgressKind>('primary');
  readonly ariaLabel = input('Progress');
  readonly ariaLabelledby = input('');
  readonly ariaValueText = input('');

  protected readonly normalizedMax = computed(() => {
    const max = this.max();
    return Number.isFinite(max) && max > 0 ? max : 100;
  });

  protected readonly normalizedValue = computed(() => {
    const value = this.value();

    if (value === null || !Number.isFinite(value)) {
      return null;
    }

    return Math.min(Math.max(value, 0), this.normalizedMax());
  });

  protected readonly percentage = computed(() => {
    const value = this.normalizedValue();
    return value === null ? 0 : (value / this.normalizedMax()) * 100;
  });
}
