import { Component, booleanAttribute, input } from '@angular/core';

import type { BadgeAppearance, BadgeVariant } from './badge-types';

@Component({
  selector: 'ms-badge',
  templateUrl: './badge.html',
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly appearance = input<BadgeAppearance>('soft');
  readonly dot = input(false, { transform: booleanAttribute });
}
