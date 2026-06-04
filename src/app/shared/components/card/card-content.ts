import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardContent]',
  host: {
    class: 'card-content',
  },
})
export class CardContentDirective {}
