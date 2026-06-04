import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';

import {
  BUTTON_TOGGLE_CONTROLLER,
  type ButtonToggleController,
  type ButtonToggleValue,
} from './button-toggle-types';

@Directive({
  selector: 'button[msButtonToggleValue]',
  host: {
    type: 'button',
    class: 'button-toggle',
    '[class.is-selected]': 'selected()',
    '[attr.aria-pressed]': "selected() ? 'true' : 'false'",
    '[disabled]': 'groupDisabled() || disabledInput()',
    '(click)': 'select()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class ButtonToggleDirective {
  private readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly group = inject<ButtonToggleController>(BUTTON_TOGGLE_CONTROLLER);

  readonly value = input.required<ButtonToggleValue>({ alias: 'msButtonToggleValue' });
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly groupDisabled = computed(() => this.group.isGroupDisabled());
  readonly disabled = computed(() => this.disabledInput());
  readonly selected = computed(() => this.group.isSelected(this.value()));

  select(): void {
    this.group.selectToggle(this);
  }

  focus(): void {
    this.host.nativeElement.focus();
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.group.moveSelection(this, 'next');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.group.moveSelection(this, 'previous');
        break;
      case 'Home':
        event.preventDefault();
        this.group.moveSelection(this, 'first');
        break;
      case 'End':
        event.preventDefault();
        this.group.moveSelection(this, 'last');
        break;
    }
  }
}
