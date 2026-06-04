import { Directive, ElementRef, inject, output, signal } from '@angular/core';

@Directive({
  selector: '[msTooltipTrigger]',
  host: {
    '[attr.aria-describedby]': 'describedBy()',
    '(pointerenter)': 'handlePointerEnter()',
    '(pointerleave)': 'handlePointerLeave()',
    '(focusin)': 'handleFocusIn()',
    '(focusout)': 'handleFocusOut($event)',
  },
})
export class TooltipTrigger {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly initialDescribedBy = this.element.getAttribute('aria-describedby');

  protected readonly describedBy = signal<string | null>(this.initialDescribedBy);

  readonly pointerEntered = output<void>();
  readonly pointerLeft = output<void>();
  readonly focused = output<void>();
  readonly blurred = output<void>();

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  connectTo(panelId: string): void {
    const ids = new Set((this.initialDescribedBy ?? '').split(/\s+/).filter((id) => id.length > 0));

    ids.add(panelId);
    this.describedBy.set(Array.from(ids).join(' '));
  }

  protected handlePointerEnter(): void {
    this.pointerEntered.emit();
  }

  protected handlePointerLeave(): void {
    this.pointerLeft.emit();
  }

  protected handleFocusIn(): void {
    this.focused.emit();
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (event.relatedTarget instanceof Node && this.element.contains(event.relatedTarget)) {
      return;
    }

    this.blurred.emit();
  }
}
