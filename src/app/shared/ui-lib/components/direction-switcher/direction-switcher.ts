import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DirectionService, LayoutDirection } from '../../services/direction.service';

@Component({
  selector: 'ms-direction-switcher',
  templateUrl: './direction-switcher.html',
  styleUrl: './direction-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectionSwitcher {
  private readonly directionService = inject(DirectionService);

  protected readonly direction = this.directionService.direction;
  protected readonly options: readonly { label: string; value: LayoutDirection }[] = [
    { label: 'LTR', value: 'ltr' },
    { label: 'RTL', value: 'rtl' },
  ];

  protected setDirection(direction: LayoutDirection): void {
    this.directionService.setDirection(direction);
  }
}
