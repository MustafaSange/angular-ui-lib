import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-menu-divider',
  template: '',
  host: {
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDividerComponent {}
