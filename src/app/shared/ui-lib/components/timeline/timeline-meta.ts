import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msTimelineMeta]',
})
export class TimelineMetaDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
