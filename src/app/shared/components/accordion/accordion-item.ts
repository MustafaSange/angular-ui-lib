import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
  model,
  viewChild,
} from '@angular/core';

import { AccordionTitleDirective } from './accordion-title';

@Component({
  selector: 'ms-accordion-item',
  templateUrl: './accordion-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  readonly title = input('');
  readonly disabled = input(false);
  readonly expanded = model(false);

  readonly titleTemplate = contentChild(AccordionTitleDirective);
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}
