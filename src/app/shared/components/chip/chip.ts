import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
} from '@angular/core';

export type ChipVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ChipAppearance = 'soft' | 'outline';

@Component({
  selector: 'ms-chip',
  templateUrl: './chip.html',
  host: {
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  readonly variant = input<ChipVariant>('neutral');
  readonly appearance = input<ChipAppearance>('soft');
  readonly selected = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removed = output<void>();

  remove(): void {
    if (this.disabled() || !this.removable()) {
      return;
    }

    this.removed.emit();
  }
}
