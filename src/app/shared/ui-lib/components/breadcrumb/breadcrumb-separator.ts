import { Directive } from '@angular/core';

@Directive({
  selector: '[msBreadcrumbSeparator]',
  host: {
    class: 'breadcrumb-separator',
  },
})
export class BreadcrumbSeparatorDirective {}
