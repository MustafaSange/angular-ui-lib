import { Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: 'button[msMenuTrigger]',
  host: {
    '[attr.popovertarget]': 'panelId()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-expanded]': 'expanded()',
    'aria-haspopup': 'menu',
  },
})
export class MenuTrigger {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected readonly panelId = signal<string | null>(null);
  protected readonly expanded = signal(false);

  get element(): HTMLButtonElement {
    return this.elementRef.nativeElement;
  }

  connectTo(panelId: string): void {
    this.panelId.set(panelId);
  }

  setExpanded(expanded: boolean): void {
    this.expanded.set(expanded);
  }

  focus(): void {
    this.element.focus();
  }
}
