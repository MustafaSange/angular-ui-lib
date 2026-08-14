import { Directive, ElementRef, computed, inject, input } from '@angular/core';

import { DrawerComponent } from './drawer';

@Directive({
  selector: 'button[msDrawerTrigger]',
  host: {
    '[attr.aria-controls]': 'drawer()?.panelId',
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'toggle()',
  },
})
export class DrawerTrigger {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  readonly drawer = input.required<DrawerComponent>({
    alias: 'msDrawerTrigger',
  });

  protected readonly expanded = computed(() => this.drawer().open());

  protected toggle(): void {
    const drawer = this.drawer();
    const element = this.elementRef.nativeElement;

    drawer.registerTrigger(element);
    drawer.toggle(element);
  }
}
