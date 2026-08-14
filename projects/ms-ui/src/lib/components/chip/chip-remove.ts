import {
  AfterViewInit,
  Directive,
  ElementRef,
  Renderer2,
  effect,
  inject,
} from '@angular/core';

import { ChipComponent } from './chip';

@Directive({
  selector: 'button[msChipRemove]',
  host: {
    class: 'chip-remove',
    '(click)': 'handleClick($event)',
  },
})
export class ChipRemoveDirective implements AfterViewInit {
  private readonly chip = inject(ChipComponent);
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const button = this.elementRef.nativeElement;
      const isDisabled = this.chip.disabled();

      button.disabled = isDisabled;

      if (isDisabled) {
        this.renderer.setAttribute(button, 'aria-disabled', 'true');
      } else {
        this.renderer.removeAttribute(button, 'aria-disabled');
      }
    });
  }

  ngAfterViewInit(): void {
    const button = this.elementRef.nativeElement;

    if (!button.getAttribute('type')) {
      this.renderer.setAttribute(button, 'type', 'button');
    }

    if (!button.getAttribute('aria-label')) {
      this.renderer.setAttribute(button, 'aria-label', 'Remove chip');
    }

    if (!button.querySelector('.chip-remove-icon')) {
      const icon = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.addClass(icon, 'ms-icon');
      this.renderer.addClass(icon, 'chip-remove-icon');
      this.renderer.setAttribute(icon, 'aria-hidden', 'true');
      this.renderer.appendChild(icon, this.renderer.createText('close'));
      this.renderer.appendChild(button, icon);
    }
  }

  protected handleClick(event: MouseEvent): void {
    if (this.chip.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.chip.remove();
  }
}
