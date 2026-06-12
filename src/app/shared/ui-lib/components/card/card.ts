import { Component, computed, input } from '@angular/core';

import type { CardAppearance, CardPadding } from './card-types';

@Component({
  selector: 'ms-card',
  template: '<ng-content />',
  host: {
    class: 'card',
    '[class.card-outlined]': "appearance() === 'outlined'",
    '[class.card-elevated]': "appearance() === 'elevated'",
    '[class.card-filled]': "appearance() === 'filled'",
    '[style.--_card-padding]': 'paddingValue().padding',
    '[style.--_card-gap]': 'paddingValue().gap',
  },
})
export class CardComponent {
  readonly appearance = input<CardAppearance>('outlined');
  readonly padding = input<CardPadding>('md');

  protected readonly paddingValue = computed(() => {
    switch (this.padding()) {
      case 'none':
        return { padding: 'var(--spacing-0)', gap: 'var(--spacing-0)' };
      case 'sm':
        return { padding: 'var(--spacing-16)', gap: 'var(--spacing-12)' };
      case 'lg':
        return { padding: 'var(--spacing-24)', gap: 'var(--spacing-20)' };
      case 'md':
      default:
        return { padding: 'var(--spacing-20)', gap: 'var(--spacing-16)' };
    }
  });
}
