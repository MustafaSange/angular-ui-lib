import { Component, booleanAttribute, computed, input, output } from '@angular/core';

import { shapeRadiusValue, type ShapeRadius } from '../../shape-types';
import type { ChipAppearance, ChipKind } from './chip-types';

@Component({
  selector: 'ms-chip',
  templateUrl: './chip.html',
  host: {
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class ChipComponent {
  readonly kind = input<ChipKind>('neutral');
  readonly appearance = input<ChipAppearance>('soft');
  readonly radius = input<ShapeRadius>('sm');
  readonly selected = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removed = output<void>();

  protected readonly radiusValue = computed(() => shapeRadiusValue(this.radius()));

  remove(): void {
    if (this.disabled() || !this.removable()) {
      return;
    }

    this.removed.emit();
  }
}
