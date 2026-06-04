import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  selector: 'a[msBreadcrumbItem], span[msBreadcrumbItem]',
  host: {
    class: 'breadcrumb-item',
    role: 'listitem',
    '[class.breadcrumb-link]': '!current()',
    '[class.breadcrumb-current]': 'current()',
    '[attr.aria-current]': "current() ? 'page' : null",
  },
})
export class BreadcrumbItemDirective {
  readonly current = input(false, { transform: booleanAttribute });
}
