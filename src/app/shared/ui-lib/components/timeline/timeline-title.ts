import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msTimelineTitle]',
})
export class TimelineTitleDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
