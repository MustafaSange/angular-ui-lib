import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardFooter]',
  host: {
    class: 'card-footer',
  },
})
export class CardFooterDirective {}
