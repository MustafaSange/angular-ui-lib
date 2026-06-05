import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, contentChildren, inject, input, viewChildren } from '@angular/core';

import { AccordionItemComponent } from './accordion-item';

let nextAccordionId = 0;

@Component({
  selector: 'ms-accordion',
  imports: [NgTemplateOutlet],
  templateUrl: './accordion.html',
})
export class AccordionComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('accordionButton');
  private readonly id = `ms-accordion-${nextAccordionId++}`;

  readonly multiple = input(false);
  readonly items = contentChildren(AccordionItemComponent);

  protected toggle(index: number): void {
    const item = this.items()[index];

    if (!item || item.disabled()) {
      return;
    }

    const nextExpanded = !item.expanded();

    if (nextExpanded && !this.multiple()) {
      for (const accordionItem of this.items()) {
        accordionItem.expanded.set(false);
      }
    }

    item.expanded.set(nextExpanded);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext(index);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPrevious(index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.isRtl() ? this.focusPrevious(index) : this.focusNext(index);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.isRtl() ? this.focusNext(index) : this.focusPrevious(index);
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
    }
  }

  protected headerId(index: number): string {
    return `${this.id}-header-${index}`;
  }

  protected panelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }

  private focusFirst(): void {
    this.focusEnabled(0, 1);
  }

  private focusLast(): void {
    this.focusEnabled(this.items().length - 1, -1);
  }

  private focusNext(index: number): void {
    this.focusEnabled(index + 1, 1);
  }

  private focusPrevious(index: number): void {
    this.focusEnabled(index - 1, -1);
  }

  private focusEnabled(startIndex: number, direction: 1 | -1): void {
    const items = this.items();

    for (let offset = 0; offset < items.length; offset++) {
      const index = (startIndex + offset * direction + items.length) % items.length;

      if (!items[index]?.disabled()) {
        this.buttons()[index]?.nativeElement.focus();
        return;
      }
    }
  }

  private isRtl(): boolean {
    const direction = this.document.defaultView?.getComputedStyle(
      this.host.nativeElement,
    ).direction;

    return direction === 'rtl';
  }
}
