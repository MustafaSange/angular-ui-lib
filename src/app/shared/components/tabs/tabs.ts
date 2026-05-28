import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  signal,
  viewChildren,
} from '@angular/core';

import { TabComponent } from './tab';

let nextTabsId = 0;

@Component({
  selector: 'ms-tabs',
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly id = `ms-tabs-${nextTabsId++}`;

  readonly tabs = contentChildren(TabComponent);
  readonly selectedIndex = signal(0);
  readonly selectedTab = computed(() => this.tabs()[this.selectedIndex()]);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const selectedIndex = this.selectedIndex();

      if (tabs.length > 0 && selectedIndex >= tabs.length) {
        this.selectedIndex.set(0);
      }
    });
  }

  protected select(index: number): void {
    this.selectedIndex.set(index);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs();

    if (tabs.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.selectAndFocus(this.getNextIndex(index));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.selectAndFocus(this.getPreviousIndex(index));
        break;
      case 'Home':
        event.preventDefault();
        this.selectAndFocus(0);
        break;
      case 'End':
        event.preventDefault();
        this.selectAndFocus(tabs.length - 1);
        break;
    }
  }

  protected tabId(index: number): string {
    return `${this.id}-tab-${index}`;
  }

  protected panelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }

  private getNextIndex(index: number): number {
    const offset = this.isRtl() ? -1 : 1;

    return this.wrapIndex(index + offset);
  }

  private getPreviousIndex(index: number): number {
    const offset = this.isRtl() ? 1 : -1;

    return this.wrapIndex(index + offset);
  }

  private wrapIndex(index: number): number {
    const tabCount = this.tabs().length;

    return (index + tabCount) % tabCount;
  }

  private selectAndFocus(index: number): void {
    this.selectedIndex.set(index);
    queueMicrotask(() => this.tabButtons()[index]?.nativeElement.focus());
  }

  private isRtl(): boolean {
    const direction = this.document.defaultView?.getComputedStyle(this.host.nativeElement).direction;

    return direction === 'rtl';
  }
}
