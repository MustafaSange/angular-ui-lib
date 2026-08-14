import { Directive, computed, inject } from '@angular/core';

import { SideNavComponent } from './side-nav';

@Directive({
  selector: 'button[msSideNavTrigger]',
  host: {
    class: 'side-nav-item side-nav-trigger',
    '[attr.aria-controls]': 'sideNav.id',
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'toggle()',
  },
})
export class SideNavTrigger {
  protected readonly sideNav = inject(SideNavComponent);
  protected readonly expanded = computed(() => !this.sideNav.collapsed());

  protected toggle(): void {
    this.sideNav.toggleCollapsed();
  }
}
