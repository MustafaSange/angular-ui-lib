import { Component, inject } from '@angular/core';

import { TranslatePipe } from '../../pipes';
import { DirectionService, LayoutDirection } from '../../services/direction';

@Component({
  selector: 'ms-direction-switcher',
  imports: [TranslatePipe],
  templateUrl: './direction-switcher.html',
  styleUrl: './direction-switcher.scss',
})
export class DirectionSwitcher {
  private readonly directionService = inject(DirectionService);

  protected readonly direction = this.directionService.direction;
  protected readonly options: readonly {
    labelKey: 'direction.ltr' | 'direction.rtl';
    value: LayoutDirection;
  }[] = [
    { labelKey: 'direction.ltr', value: 'ltr' },
    { labelKey: 'direction.rtl', value: 'rtl' },
  ];

  protected setDirection(direction: LayoutDirection): void {
    this.directionService.setDirection(direction);
  }
}
