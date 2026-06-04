import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'ms-switch-control',
  templateUrl: './switch-control.html',
  host: {
    '[class.is-label-before]': 'isLabelBefore',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchControl implements AfterContentInit {
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
    const input = element.querySelector<HTMLInputElement>('input[type="checkbox"]');
    const label = element.querySelector<HTMLLabelElement>('.switch-title label');
    const track = element.querySelector<HTMLLabelElement>('.switch-track');

    if (!input || !label || !track) {
      return;
    }

    input.classList.add('switch-input');
    input.setAttribute('role', input.getAttribute('role') || 'switch');

    if (!input.id) {
      input.id = `ms-switch-${SwitchControl.nextId++}`;
    }

    if (!label.htmlFor) {
      label.htmlFor = input.id;
    }

    track.htmlFor = input.id;
  }
}
