import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardHeader]',
  host: {
    class: 'card-header',
  },
})
export class CardHeaderDirective {}
