import { Directive } from '@angular/core';

@Directive({
  selector: 'button[msMenuItem], a[msMenuItem]',
  host: {
    class: 'menu-item',
    role: 'menuitem',
    tabindex: '-1',
  },
})
export class MenuItem {}
