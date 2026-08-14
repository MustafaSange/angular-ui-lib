import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

type OverflowDirection = 'backward' | 'forward';

type OverflowState = {
  readonly hasOverflow: boolean;
  readonly canScrollBackward: boolean;
  readonly canScrollForward: boolean;
};

const NO_OVERFLOW: OverflowState = {
  hasOverflow: false,
  canScrollBackward: false,
  canScrollForward: false,
};

@Component({
  selector: 'button[msOverflowNavigationButton]',
  template: `
    <span class="ms-icon" aria-hidden="true">
      {{ direction() === 'backward' ? 'chevron_left' : 'chevron_right' }}
    </span>
  `,
  host: {
    class: 'overflow-navigation-button',
    type: 'button',
    '[class.is-backward]': "direction() === 'backward'",
    '[class.is-forward]': "direction() === 'forward'",
  },
})
export class OverflowNavigationButton {
  readonly direction = input.required<OverflowDirection>({
    alias: 'msOverflowNavigationButton',
  });
}

@Directive({
  selector: '[msOverflowNavigation]',
  exportAs: 'overflowNavigation',
  host: {
    class: 'overflow-navigation-viewport',
    '[class.is-enabled]': 'enabled()',
    '(scroll)': 'update()',
  },
})
export class OverflowNavigation {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private updateFrame = 0;

  readonly enabled = input(false, { alias: 'msOverflowNavigation' });
  readonly scrollRatio = input(0.75, { alias: 'msOverflowScrollRatio' });
  readonly state = signal<OverflowState>(NO_OVERFLOW);

  constructor() {
    effect(() => {
      this.enabled();
      this.scheduleUpdate();
    });

    afterNextRender(() => this.observeViewport());
    this.destroyRef.onDestroy(() => this.cancelUpdate());
  }

  scroll(direction: OverflowDirection): void {
    const state = this.state();
    const canScroll = direction === 'backward' ? state.canScrollBackward : state.canScrollForward;

    if (!canScroll) {
      return;
    }

    const ratio = Math.min(1, Math.max(0.1, this.scrollRatio()));
    const amount = this.element.clientWidth * ratio;
    const physicalDirection = this.isRtl() ? -1 : 1;
    const logicalDirection = direction === 'backward' ? -1 : 1;

    this.element.scrollBy({
      left: amount * physicalDirection * logicalDirection,
      behavior: 'smooth',
    });
  }

  update(): void {
    if (!this.enabled()) {
      this.state.set(NO_OVERFLOW);
      return;
    }

    const maxScroll = Math.max(0, this.element.scrollWidth - this.element.clientWidth);
    const scrollPosition = this.getLogicalScrollPosition(maxScroll);
    const hasOverflow = maxScroll > 1;

    this.state.set({
      hasOverflow,
      canScrollBackward: hasOverflow && scrollPosition > 1,
      canScrollForward: hasOverflow && scrollPosition < maxScroll - 1,
    });
  }

  private observeViewport(): void {
    const window = this.document.defaultView;
    const resizeObserver = window?.ResizeObserver;
    const mutationObserver = window?.MutationObserver;
    const resize = resizeObserver ? new resizeObserver(() => this.update()) : null;
    const mutation = mutationObserver ? new mutationObserver(() => this.update()) : null;

    // Resize handles container changes; mutation handles projected values and chips.
    resize?.observe(this.element);
    mutation?.observe(this.element, { childList: true, characterData: true, subtree: true });
    this.update();

    this.destroyRef.onDestroy(() => {
      resize?.disconnect();
      mutation?.disconnect();
    });
  }

  private isRtl(): boolean {
    return this.document.defaultView?.getComputedStyle(this.element).direction === 'rtl';
  }

  private getLogicalScrollPosition(maxScroll: number): number {
    if (!this.isRtl()) {
      return this.element.scrollLeft;
    }

    return this.element.scrollLeft < 0
      ? Math.abs(this.element.scrollLeft)
      : maxScroll - this.element.scrollLeft;
  }

  private scheduleUpdate(): void {
    this.cancelUpdate();
    const window = this.document.defaultView;

    if (!window) {
      queueMicrotask(() => this.update());
      return;
    }

    this.updateFrame = window.requestAnimationFrame(() => this.update());
  }

  private cancelUpdate(): void {
    if (this.updateFrame) {
      this.document.defaultView?.cancelAnimationFrame(this.updateFrame);
      this.updateFrame = 0;
    }
  }
}
