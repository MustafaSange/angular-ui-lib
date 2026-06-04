import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { CardAppearance, CardPadding } from './card-types';

@Component({
  selector: 'ms-card',
  template: '<ng-content />',
  host: {
    class: 'card',
    '[class.card-outlined]': "appearance() === 'outlined'",
    '[class.card-elevated]': "appearance() === 'elevated'",
    '[class.card-filled]': "appearance() === 'filled'",
    '[class.card-padding-none]': "padding() === 'none'",
    '[class.card-padding-sm]': "padding() === 'sm'",
    '[class.card-padding-md]': "padding() === 'md'",
    '[class.card-padding-lg]': "padding() === 'lg'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly appearance = input<CardAppearance>('outlined');
  readonly padding = input<CardPadding>('md');
}
