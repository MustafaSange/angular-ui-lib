import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardTitle]',
  host: {
    class: 'card-title',
  },
})
export class CardTitleDirective {}
