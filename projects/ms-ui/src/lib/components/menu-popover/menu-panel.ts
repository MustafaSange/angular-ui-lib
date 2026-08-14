import { Component, ElementRef, inject, output, signal } from '@angular/core';

import type { AnchoredPlacement } from './anchored-placement';
import { isPopoverOpen, showAnchoredPopover } from './native-popover';

let nextMenuPanelId = 0;

@Component({
  selector: 'ms-menu-panel',
  templateUrl: './menu-panel.html',
  host: {
    class: 'menu-panel',
    popover: 'auto',
    role: 'menu',
    '[attr.id]': 'id',
    '[attr.data-placement]': 'placement()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    '(toggle)': 'handleToggle($event)',
  },
})
export class MenuPanelComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = `ms-menu-panel-${nextMenuPanelId++}`;
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

  focusFirstEnabledItem(): void {
    this.enabledItems()[0]?.focus();
  }

  protected handleToggle(event: ToggleEvent): void {
    this.toggled.emit(event.newState === 'open');
  }

  protected handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      return;
    }

    const menuItem = event.target.closest<HTMLElement>('[msMenuItem]');

    if (menuItem && this.elementRef.nativeElement.contains(menuItem) && this.isEnabled(menuItem)) {
      this.closeRequested.emit();
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.closeRequested.emit();
      return;
    }

    const items = this.enabledItems();

    if (items.length === 0) {
      return;
    }

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextItem: HTMLElement | undefined;

    switch (event.key) {
      case 'ArrowDown':
        nextItem = items[(currentIndex + 1) % items.length];
        break;
      case 'ArrowUp':
        nextItem = items[(currentIndex - 1 + items.length) % items.length];
        break;
      case 'Home':
        nextItem = items[0];
        break;
      case 'End':
        nextItem = items.at(-1);
        break;
      default:
        return;
    }

    event.preventDefault();
    nextItem?.focus();
  }

  private enabledItems(): HTMLElement[] {
    return Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>('[msMenuItem]'),
    ).filter((item) => this.isEnabled(item));
  }

  private isEnabled(item: HTMLElement): boolean {
    return !item.matches(':disabled, [aria-disabled="true"]');
  }
}
