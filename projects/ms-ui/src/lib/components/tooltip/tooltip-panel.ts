import { Component, ElementRef, inject, output, signal } from '@angular/core';

import type { TooltipPlacement } from './tooltip-placement';

type NativeHintElement = HTMLElement & {
  showPopover(options?: { source?: HTMLElement }): void;
};

let nextTooltipPanelId = 0;

@Component({
  selector: 'ms-tooltip-panel',
  templateUrl: './tooltip-panel.html',
  host: {
    class: 'tooltip-panel',
    popover: 'hint',
    role: 'tooltip',
    '[attr.id]': 'id',
    '[attr.data-placement]': 'placement()',
    '(pointerenter)': 'handlePointerEnter()',
    '(pointerleave)': 'handlePointerLeave()',
    '(toggle)': 'handleToggle($event)',
  },
})
export class TooltipPanelComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = `ms-tooltip-panel-${nextTooltipPanelId++}`;
  readonly pointerEntered = output<void>();
  readonly pointerLeft = output<void>();
  readonly toggled = output<boolean>();

  protected readonly placement = signal<TooltipPlacement>('top');

  setPlacement(placement: TooltipPlacement): void {
    this.placement.set(placement);
  }

  isOpen(): boolean {
    return this.elementRef.nativeElement.matches(':popover-open');
  }

  show(trigger: HTMLElement): void {
    if (!this.isOpen()) {
      (this.elementRef.nativeElement as NativeHintElement).showPopover({ source: trigger });
    }
  }

  hide(): void {
    if (this.isOpen()) {
      this.elementRef.nativeElement.hidePopover();
    }
  }

  protected handlePointerEnter(): void {
    this.pointerEntered.emit();
  }

  protected handlePointerLeave(): void {
    this.pointerLeft.emit();
  }

  protected handleToggle(event: ToggleEvent): void {
    this.toggled.emit(event.newState === 'open');
  }
}
