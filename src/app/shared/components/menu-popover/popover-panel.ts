import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
} from '@angular/core';

import type { AnchoredPlacement } from './anchored-placement';
import { isPopoverOpen, showAnchoredPopover } from './native-popover';

let nextPopoverPanelId = 0;

@Component({
  selector: 'ms-popover-panel',
  templateUrl: './popover-panel.html',
  host: {
    class: 'popover-panel',
    popover: 'auto',
    '[attr.id]': 'id',
    '[attr.data-placement]': 'placement()',
    '(click)': 'handleClick($event)',
    '(toggle)': 'handleToggle($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPanelComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = `ms-popover-panel-${nextPopoverPanelId++}`;
  readonly toggled = output<boolean>();
  readonly closeRequested = output<void>();

  protected readonly placement = signal<AnchoredPlacement>('bottom-start');

  setPlacement(placement: AnchoredPlacement): void {
    this.placement.set(placement);
  }

  isOpen(): boolean {
    return isPopoverOpen(this.elementRef.nativeElement);
  }

  show(trigger: HTMLButtonElement): void {
    if (!this.isOpen()) {
      showAnchoredPopover(this.elementRef.nativeElement, trigger);
    }
  }

  hide(): void {
    if (this.isOpen()) {
      this.elementRef.nativeElement.hidePopover();
    }
  }

  protected handleToggle(event: ToggleEvent): void {
    this.toggled.emit(event.newState === 'open');
  }

  protected handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      return;
    }

    const closeButton = event.target.closest<HTMLButtonElement>('button[msPopoverClose]');

    if (closeButton && this.elementRef.nativeElement.contains(closeButton)) {
      this.closeRequested.emit();
    }
  }
}
