import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[msTreeNodeLabel]',
})
export class TreeNodeLabelDirective {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
}
