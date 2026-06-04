import { DestroyRef, Directive, ElementRef, computed, inject, input, signal } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { SideNavComponent } from './side-nav';

@Directive({
  selector: 'a[msSideNavItem], button[msSideNavItem]',
  host: {
    class: 'side-nav-item',
    '[class.side-nav-item-active]': 'isActive()',
    '[attr.aria-current]': 'ariaCurrent()',
    '(click)': 'handleClick()',
  },
})
export class SideNavItem {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLAnchorElement | HTMLButtonElement>>(ElementRef);
  private readonly routerLinkActive = inject(RouterLinkActive, {
    optional: true,
    self: true,
  });
  private readonly sideNav = inject(SideNavComponent, {
    optional: true,
  });
  private readonly routerActive = signal(false);

  readonly active = input(false);

  protected readonly isActive = computed(() => this.active() || this.routerActive());
  protected readonly ariaCurrent = computed(() => {
    const element = this.elementRef.nativeElement;

    if (element.tagName.toLowerCase() !== 'a' || !this.isActive()) {
      return null;
    }

    return 'page';
  });

  constructor() {
    if (!this.routerLinkActive) {
      return;
    }

    const subscription = this.routerLinkActive.isActiveChange.subscribe((isActive) => {
      this.routerActive.set(isActive);
    });

    queueMicrotask(() => {
      this.routerActive.set(this.routerLinkActive?.isActive === true);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  protected handleClick(): void {
    const element = this.elementRef.nativeElement;

    if (element.matches(':disabled, [aria-disabled="true"]')) {
      return;
    }

    this.sideNav?.requestNavigationClose();
  }
}
