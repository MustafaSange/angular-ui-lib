import { Directive, inject } from '@angular/core';

import { DrawerComponent } from './drawer';

@Directive({
  selector: 'button[msDrawerClose], a[msDrawerClose]',
  host: {
    '(click)': 'closeDrawer()',
  },
})
export class DrawerClose {
  private readonly drawer = inject(DrawerComponent);

  protected closeDrawer(): void {
    this.drawer.close();
  }
}
