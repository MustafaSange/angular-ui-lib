import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';

import type { DrawerPlacement } from './drawer-placement';

let nextDrawerId = 0;
let openDrawerCount = 0;

@Component({
  selector: 'ms-drawer',
  exportAs: 'msDrawer',
  imports: [NgClass],
  templateUrl: './drawer.html',
})
export class DrawerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private triggerElement: HTMLButtonElement | null = null;
  private wasOpen = false;

  readonly open = model(false);
  readonly placement = input<DrawerPlacement>('start');
  readonly closeOnBackdrop = input(true);
  readonly closeOnEscape = input(true);
  readonly ariaLabel = input<string | null>(null, {
    alias: 'aria-label',
  });
  readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  });

  readonly panelId = `drawer-panel-${nextDrawerId++}`;

  protected readonly panelClasses = computed(() => ({
    'drawer-panel-start': this.placement() === 'start',
    'drawer-panel-end': this.placement() === 'end',
  }));

  constructor() {
    effect(() => {
      this.open();
      this.syncOpenState();
    });

    this.destroyRef.onDestroy(() => {
      if (this.wasOpen) {
        this.unlockScroll();
      }
    });
  }

  toggle(triggerElement?: HTMLButtonElement): void {
    if (triggerElement) {
      this.triggerElement = triggerElement;
    }

    this.open.update((isOpen) => !isOpen);
  }

  close(): void {
    this.open.set(false);
  }

  focusPanel(): void {
    this.panelRef()?.nativeElement.focus();
  }

  registerTrigger(triggerElement: HTMLButtonElement): void {
    this.triggerElement = triggerElement;
  }

  protected handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private syncOpenState(): void {
    const isOpen = this.open();

    if (isOpen === this.wasOpen) {
      return;
    }

    this.wasOpen = isOpen;

    if (isOpen) {
      this.lockScroll();
      this.document.defaultView?.setTimeout(() => {
        this.focusPanel();
      }, 0);
      return;
    }

    this.unlockScroll();
    this.triggerElement?.focus();
  }

  private lockScroll(): void {
    if (openDrawerCount === 0) {
      this.document.body.classList.add('ms-drawer-open');
    }

    openDrawerCount += 1;
  }

  private unlockScroll(): void {
    if (openDrawerCount > 0) {
      openDrawerCount -= 1;
    }

    if (openDrawerCount === 0) {
      this.document.body.classList.remove('ms-drawer-open');
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panelRef()?.nativeElement;

    if (!panel) {
      return;
    }

    const focusableElements = this.getFocusableElements(panel);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private getFocusableElements(panel: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(
      (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
    );
  }
}
