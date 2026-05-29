import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msAccordionTitle]',
})
export class AccordionTitleDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
