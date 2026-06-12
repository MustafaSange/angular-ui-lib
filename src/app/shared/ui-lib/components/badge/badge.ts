import { Component, booleanAttribute, computed, input } from '@angular/core';

import { shapeRadiusValue, type ShapeRadius } from '../../shape-types';
import type { BadgeAppearance, BadgeKind } from './badge-types';

@Component({
  selector: 'ms-badge',
  templateUrl: './badge.html',
})
export class BadgeComponent {
  readonly kind = input<BadgeKind>('neutral');
  readonly appearance = input<BadgeAppearance>('soft');
  readonly radius = input<ShapeRadius>('full');
  readonly dot = input(false, { transform: booleanAttribute });

  protected readonly radiusValue = computed(() => shapeRadiusValue(this.radius()));
}
