import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[msTabTitle]',
})
export class TabTitleDirective {
  readonly template = inject(TemplateRef<unknown>);
}
