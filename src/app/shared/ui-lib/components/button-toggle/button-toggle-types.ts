import { InjectionToken } from '@angular/core';

export type ButtonToggleValue = string | number;

export interface ButtonToggleController {
  isGroupDisabled(): boolean;
  isSelected(value: ButtonToggleValue): boolean;
  selectToggle(toggle: ButtonToggleItem): void;
  moveSelection(toggle: ButtonToggleItem, direction: 'next' | 'previous' | 'first' | 'last'): void;
}

export interface ButtonToggleItem {
  readonly value: () => ButtonToggleValue;
  readonly disabled: () => boolean;
  focus(): void;
}

export const BUTTON_TOGGLE_CONTROLLER = new InjectionToken<ButtonToggleController>(
  'BUTTON_TOGGLE_CONTROLLER',
);
