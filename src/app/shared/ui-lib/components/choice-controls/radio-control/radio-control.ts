import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'ms-radio-control',
  templateUrl: './radio-control.html',
  host: {
    '[class.is-label-before]': 'isLabelBefore',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioControl implements AfterContentInit {
  private static nextId = 0;

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected get isLabelBefore(): boolean {
    return this.elementRef.nativeElement.getAttribute('slot') === 'label-before';
  }

  ngAfterContentInit(): void {
    this.connectInputAndLabel();
  }

  private connectInputAndLabel(): void {
    const element = this.elementRef.nativeElement;
    const input = element.querySelector<HTMLInputElement>('input[type="radio"]');
    const label = element.querySelector<HTMLLabelElement>('label');

    if (!input || !label) {
      return;
    }

    input.classList.add('choice-input');

    if (!input.id) {
      input.id = `ms-radio-${RadioControl.nextId++}`;
    }

    if (!label.htmlFor) {
      label.htmlFor = input.id;
    }
  }
}
