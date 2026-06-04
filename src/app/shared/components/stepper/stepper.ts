import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  viewChildren,
} from '@angular/core';

import { StepComponent } from './step';
import { StepOrientation } from './stepper-types';

let nextStepperId = 0;

@Component({
  selector: 'ms-stepper',
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('stepButton');
  private readonly id = `ms-stepper-${nextStepperId++}`;

  readonly orientation = input<StepOrientation>('horizontal');
  readonly linear = input(false);
  readonly selectedIndex = model(0);

  readonly steps = contentChildren(StepComponent);
  readonly selectedStep = computed(() => this.steps()[this.selectedIndex()]);

  constructor() {
    effect(() => {
      const steps = this.steps();
      const selectedIndex = this.selectedIndex();

      if (steps.length === 0) {
        return;
      }

      const nextIndex =
        selectedIndex >= 0 && selectedIndex < steps.length && this.isSelectable(selectedIndex)
          ? selectedIndex
          : this.firstSelectableIndex();

      if (nextIndex !== selectedIndex && nextIndex >= 0) {
        this.selectedIndex.set(nextIndex);
      }
    });
  }

  protected select(index: number): void {
    if (!this.isSelectable(index)) {
      return;
    }

    this.selectedIndex.set(index);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowRight':
        if (this.orientation() === 'horizontal') {
          event.preventDefault();
          this.isRtl() ? this.focusPrevious(index) : this.focusNext(index);
        }
        break;
      case 'ArrowLeft':
        if (this.orientation() === 'horizontal') {
          event.preventDefault();
          this.isRtl() ? this.focusNext(index) : this.focusPrevious(index);
        }
        break;
      case 'ArrowDown':
        if (this.orientation() === 'vertical') {
          event.preventDefault();
          this.focusNext(index);
        }
        break;
      case 'ArrowUp':
        if (this.orientation() === 'vertical') {
          event.preventDefault();
          this.focusPrevious(index);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select(index);
        break;
    }
  }

  protected isBlocked(index: number): boolean {
    if (!this.linear()) {
      return false;
    }

    return this.steps()
      .slice(0, index)
      .some((step) => !step.disabled() && !step.completed());
  }

  protected stepId(index: number): string {
    return `${this.id}-step-${index}`;
  }

  protected panelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }

  private focusFirst(): void {
    this.focusSelectable(0, 1);
  }

  private focusLast(): void {
    this.focusSelectable(this.steps().length - 1, -1);
  }

  private focusNext(index: number): void {
    this.focusSelectable(index + 1, 1);
  }

  private focusPrevious(index: number): void {
    this.focusSelectable(index - 1, -1);
  }

  private focusSelectable(startIndex: number, direction: 1 | -1): void {
    const steps = this.steps();

    for (let offset = 0; offset < steps.length; offset++) {
      const index = (startIndex + offset * direction + steps.length) % steps.length;

      if (this.isSelectable(index)) {
        this.stepButtons()[index]?.nativeElement.focus();
        return;
      }
    }
  }

  private firstSelectableIndex(): number {
    return this.steps().findIndex((_, index) => this.isSelectable(index));
  }

  private isSelectable(index: number): boolean {
    const step = this.steps()[index];

    return !!step && !step.disabled() && !this.isBlocked(index);
  }

  private isRtl(): boolean {
    const direction = this.document.defaultView?.getComputedStyle(
      this.host.nativeElement,
    ).direction;

    return direction === 'rtl';
  }
}
