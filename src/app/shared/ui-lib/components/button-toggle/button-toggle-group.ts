import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  booleanAttribute,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';

import { ButtonToggleDirective } from './button-toggle';
import {
  BUTTON_TOGGLE_CONTROLLER,
  type ButtonToggleController,
  type ButtonToggleItem,
  type ButtonToggleValue,
} from './button-toggle-types';

@Component({
  selector: 'ms-button-toggle-group',
  template: '<ng-content />',
  providers: [
    {
      provide: BUTTON_TOGGLE_CONTROLLER,
      useExisting: forwardRef(() => ButtonToggleGroup),
    },
  ],
  host: {
    role: 'group',
    class: 'button-toggle-group',
    '[class.is-disabled]': 'disabled()',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class ButtonToggleGroup implements ButtonToggleController {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly toggles = contentChildren(ButtonToggleDirective);

  readonly value = model<ButtonToggleValue | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      const toggles = this.enabledToggles();
      const selectedValue = this.value();

      if (toggles.length === 0) {
        return;
      }

      const selectedToggle = toggles.find((toggle) => toggle.value() === selectedValue);

      if (!selectedToggle) {
        this.value.set(toggles[0].value());
      }
    });
  }

  isGroupDisabled(): boolean {
    return this.disabled();
  }

  isSelected(value: ButtonToggleValue): boolean {
    return this.value() === value;
  }

  selectToggle(toggle: ButtonToggleItem): void {
    if (this.disabled() || toggle.disabled()) {
      return;
    }

    this.value.set(toggle.value());
  }

  moveSelection(toggle: ButtonToggleItem, direction: 'next' | 'previous' | 'first' | 'last'): void {
    if (this.disabled()) {
      return;
    }

    const toggles = this.enabledToggles();

    if (toggles.length === 0) {
      return;
    }

    const currentIndex = toggles.indexOf(toggle as ButtonToggleDirective);
    const fallbackIndex = toggles.findIndex((item) => item.value() === this.value());
    const selectedIndex = currentIndex >= 0 ? currentIndex : Math.max(0, fallbackIndex);
    const target = this.getTargetToggle(toggles, selectedIndex, direction);

    this.value.set(target.value());
    queueMicrotask(() => target.focus());
  }

  private enabledToggles(): ButtonToggleDirective[] {
    return this.toggles().filter((toggle) => !toggle.disabled());
  }

  private getTargetToggle(
    toggles: ButtonToggleDirective[],
    index: number,
    direction: 'next' | 'previous' | 'first' | 'last',
  ): ButtonToggleDirective {
    switch (direction) {
      case 'first':
        return toggles[0];
      case 'last':
        return toggles[toggles.length - 1];
      case 'next':
        return toggles[this.wrapIndex(index + (this.isRtl() ? -1 : 1), toggles.length)];
      case 'previous':
        return toggles[this.wrapIndex(index + (this.isRtl() ? 1 : -1), toggles.length)];
    }
  }

  private wrapIndex(index: number, length: number): number {
    return (index + length) % length;
  }

  private isRtl(): boolean {
    const direction = this.document.defaultView?.getComputedStyle(
      this.host.nativeElement,
    ).direction;

    return direction === 'rtl';
  }
}
