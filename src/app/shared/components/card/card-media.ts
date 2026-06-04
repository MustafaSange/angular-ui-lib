import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardMedia]',
  host: {
    class: 'card-media',
  },
})
export class CardMediaDirective {}
