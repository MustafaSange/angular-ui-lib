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

import type { AutocompleteOption } from './autocomplete-types';

@Component({
  selector: 'ms-autocomplete-option',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #optionTemplate>
      <ng-content />
    </ng-template>
    <span class="autocomplete-source-option-label">
      <ng-container [ngTemplateOutlet]="optionTemplate" />
    </span>
  `,
  host: {
    class: 'autocomplete-source-option',
    hidden: '',
  },
})
export class AutocompleteOptionComponent<TValue> {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly optionTemplate = viewChild.required<TemplateRef<void>>('optionTemplate');

  readonly value = input.required<TValue>();
  readonly label = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly description = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly group = input<string | null>(null);

  toOption(): AutocompleteOption<TValue> {
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
