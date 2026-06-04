import { Directive, ElementRef, computed, inject, input } from '@angular/core';

import { BottomSheetComponent } from './bottom-sheet';

@Directive({
  selector: 'button[msBottomSheetTrigger]',
  host: {
    '[attr.aria-controls]': 'sheet()?.panelId',
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'toggle()',
  },
})
export class BottomSheetTrigger {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  readonly sheet = input.required<BottomSheetComponent>({
    alias: 'msBottomSheetTrigger',
  });

  protected readonly expanded = computed(() => this.sheet().open());

  protected toggle(): void {
    const sheet = this.sheet();
    const element = this.elementRef.nativeElement;

    sheet.toggle(element);
  }
}
