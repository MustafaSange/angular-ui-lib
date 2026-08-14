import {
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import type { SelectOption } from './select-types';

@Component({
  selector: 'ms-select-option',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #optionTemplate>
      <ng-content />
    </ng-template>
    <span class="select-source-option-label">
      <ng-container [ngTemplateOutlet]="optionTemplate" />
    </span>
  `,
  host: {
    class: 'select-source-option',
    hidden: '',
  },
})
export class SelectOptionComponent<TValue> {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly optionTemplate = viewChild.required<TemplateRef<void>>('optionTemplate');

  readonly value = input.required<TValue>();
  readonly label = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly description = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly group = input<string | null>(null);

  toOption(): SelectOption<TValue> {
    return {
      label: this.label() ?? this.elementRef.nativeElement.textContent?.trim() ?? '',
      value: this.value(),
      disabled: this.disabled(),
      description: this.description() ?? undefined,
      icon: this.icon() ?? undefined,
      group: this.group() ?? undefined,
      template: this.optionTemplate(),
    };
  }
}
