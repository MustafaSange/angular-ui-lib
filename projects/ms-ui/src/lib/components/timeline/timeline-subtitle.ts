import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msTimelineSubtitle]',
})
export class TimelineSubtitleDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
