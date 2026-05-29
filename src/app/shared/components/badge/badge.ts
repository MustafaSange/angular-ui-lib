import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeAppearance = 'soft' | 'solid' | 'outline';

@Component({
  selector: 'ms-badge',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly appearance = input<BadgeAppearance>('soft');
  readonly dot = input(false, { transform: booleanAttribute });
}
