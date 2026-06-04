import { Directive } from '@angular/core';

@Directive({
  selector: '[msCardSubtitle]',
  host: {
    class: 'card-subtitle',
  },
})
export class CardSubtitleDirective {}
