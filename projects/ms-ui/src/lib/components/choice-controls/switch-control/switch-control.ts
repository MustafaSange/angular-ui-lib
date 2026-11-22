import { AfterContentInit, Component, ElementRef, inject, input } from '@angular/core';

import type { SwitchKind, SwitchVariant } from './switch-types';
import { UI_LIB_CONFIG } from '../../../services/config/ui-lib-config-token';

@Component({
  selector: 'ms-switch-control',
  templateUrl: './switch-control.html',
  host: {
    '[class.is-label-before]': 'isLabelBefore',
    '[class.is-slim-track]': 'variant() === "slim-track"',
    '[attr.data-kind]': 'kind()',
    '[style.--switch-selected-track-color]': 'selectedTrackColor()',
    '[style.--switch-selected-thumb-color]': 'selectedThumbColor()',
  },
})
export class SwitchControl implements AfterContentInit {
  private readonly defaults = inject(UI_LIB_CONFIG).switch;

  /** Slim track uses a 24px thumb centered over a 16px track. */
  readonly variant = input<SwitchVariant>(this.defaults?.variant ?? 'classic');
  readonly kind = input<SwitchKind | undefined>(this.defaults?.kind);
  readonly selectedTrackColor = input<string | undefined>(this.defaults?.selectedTrackColor);
  readonly selectedThumbColor = input<string | undefined>(this.defaults?.selectedThumbColor);

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
