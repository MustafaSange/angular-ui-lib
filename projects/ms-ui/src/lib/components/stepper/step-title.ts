import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msStepTitle]',
})
export class StepTitleDirective {
  readonly template = inject(TemplateRef<unknown>);
}
