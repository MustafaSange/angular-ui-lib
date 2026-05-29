import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  signal,
  viewChild,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tabList = viewChild<ElementRef<HTMLDivElement>>('tabList');
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly id = `ms-tabs-${nextTabsId++}`;
  private scrollStateFrame = 0;

  readonly tabs = contentChildren(TabComponent);
  readonly selectedIndex = signal(0);
  readonly selectedTab = computed(() => this.tabs()[this.selectedIndex()]);
  protected readonly hasOverflow = signal(false);
  protected readonly canScrollBackward = signal(false);
  protected readonly canScrollForward = signal(false);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const selectedIndex = this.selectedIndex();

      if (tabs.length > 0 && selectedIndex >= tabs.length) {
        this.selectedIndex.set(0);
      }

      this.scheduleScrollStateUpdate();
    });

    afterNextRender(() => {
      const tabList = this.tabList()?.nativeElement;
      const resizeObserver = this.document.defaultView?.ResizeObserver;

      this.updateScrollState();

      if (!tabList || !resizeObserver) {
        return;
      }

      const observer = new resizeObserver(() => this.updateScrollState());

      observer.observe(tabList);
      tabList.addEventListener('scroll', this.updateScrollState, { passive: true });

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        tabList.removeEventListener('scroll', this.updateScrollState);
        this.cancelScrollStateUpdate();
      });
    });
  }

  protected select(index: number): void {
    this.selectedIndex.set(index);
    this.scrollTabIntoView(index);
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

  protected scrollTabs(direction: 'backward' | 'forward'): void {
    const tabList = this.tabList()?.nativeElement;
    const canScroll = direction === 'backward' ? this.canScrollBackward() : this.canScrollForward();

    if (!tabList || !canScroll) {
      return;
    }

    const isBackward = direction === 'backward';
    const directionMultiplier = this.isRtl() ? -1 : 1;
    const scrollAmount = tabList.clientWidth * 0.75;
    const left = scrollAmount * directionMultiplier * (isBackward ? -1 : 1);

    tabList.scrollBy({ left, behavior: 'smooth' });
  }

  protected readonly updateScrollState = (): void => {
    const tabList = this.tabList()?.nativeElement;

    if (!tabList) {
      this.hasOverflow.set(false);
      this.canScrollBackward.set(false);
      this.canScrollForward.set(false);
      return;
    }

    const maxScroll = Math.max(0, tabList.scrollWidth - tabList.clientWidth);
    const scrollPosition = this.getLogicalScrollPosition(tabList);
    const hasOverflow = maxScroll > 1;

    this.hasOverflow.set(hasOverflow);
    this.canScrollBackward.set(hasOverflow && scrollPosition > 1);
    this.canScrollForward.set(hasOverflow && scrollPosition < maxScroll - 1);
  };

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
    this.scrollTabIntoView(index);
    queueMicrotask(() => this.tabButtons()[index]?.nativeElement.focus());
  }

  private isRtl(): boolean {
    const direction = this.document.defaultView?.getComputedStyle(
      this.host.nativeElement,
    ).direction;

    return direction === 'rtl';
  }

  private getLogicalScrollPosition(tabList: HTMLDivElement): number {
    const maxScroll = Math.max(0, tabList.scrollWidth - tabList.clientWidth);

    if (!this.isRtl()) {
      return tabList.scrollLeft;
    }

    if (tabList.scrollLeft < 0) {
      return Math.abs(tabList.scrollLeft);
    }

    return maxScroll - tabList.scrollLeft;
  }

  private scrollTabIntoView(index: number): void {
    queueMicrotask(() => {
      this.tabButtons()[index]?.nativeElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
      this.scheduleScrollStateUpdate();
    });
  }

  private scheduleScrollStateUpdate(): void {
    this.cancelScrollStateUpdate();

    const window = this.document.defaultView;

    if (!window) {
      queueMicrotask(this.updateScrollState);
      return;
    }

    this.scrollStateFrame = window.requestAnimationFrame(this.updateScrollState);
  }

  private cancelScrollStateUpdate(): void {
    if (!this.scrollStateFrame) {
      return;
    }

    this.document.defaultView?.cancelAnimationFrame(this.scrollStateFrame);
    this.scrollStateFrame = 0;
  }
}
