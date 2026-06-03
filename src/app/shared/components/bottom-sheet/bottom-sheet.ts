import { DOCUMENT, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

import type { BottomSheetSize } from './bottom-sheet-config';
import { BOTTOM_SHEET_CONFIG } from './bottom-sheet-tokens';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let nextBottomSheetId = 0;
let openBottomSheetCount = 0;

@Component({
  selector: 'ms-bottom-sheet',
  exportAs: 'msBottomSheet',
  imports: [NgClass],
  templateUrl: './bottom-sheet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetComponent {
  private readonly config = inject(BOTTOM_SHEET_CONFIG, {
    optional: true,
  });
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private triggerElement: HTMLButtonElement | null = null;
  private wasOpen = false;

  readonly open = model(this.config ? true : false);
  readonly close = output<void>();
  readonly title = input('');
  readonly closeOnBackdrop = input(this.config?.closeOnBackdrop ?? true);
  readonly closeOnEscape = input(this.config?.closeOnEscape ?? true);
  readonly showCloseButton = input(this.config?.showCloseButton ?? true);
  readonly showHandle = input(this.config?.showHandle ?? false);
  readonly size = input<BottomSheetSize>(this.config?.size ?? 'medium');
  readonly ariaLabel = input<string | null>(null, {
    alias: 'aria-label',
  });
  readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  });
  readonly maxWidth = input(this.config?.maxWidth ?? '40rem');

  readonly panelId = `bottom-sheet-panel-${nextBottomSheetId++}`;
  protected readonly titleId = `bottom-sheet-title-${nextBottomSheetId++}`;
  protected readonly panelClasses = computed(() => ({
    'bottom-sheet-panel-compact': this.size() === 'compact',
    'bottom-sheet-panel-medium': this.size() === 'medium',
    'bottom-sheet-panel-full': this.size() === 'full',
  }));
  protected readonly labelledby = computed(() => this.ariaLabelledby() ?? this.titleId);
  protected readonly backdropZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-bottom-sheet-stack-offset, 0))',
  );
  protected readonly panelZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-bottom-sheet-stack-offset, 0) + 1)',
  );

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

  dismiss(): void {
    this.open.set(false);
    this.close.emit();
  }

  focusPanel(): void {
    this.panelRef()?.nativeElement.focus();
  }

  registerTrigger(triggerElement: HTMLButtonElement): void {
    this.triggerElement = triggerElement;
  }

  toggle(triggerElement?: HTMLButtonElement): void {
    if (triggerElement) {
      this.registerTrigger(triggerElement);
    }

    this.open.update((isOpen) => !isOpen);
  }

  protected handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.dismiss();
    }
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.dismiss();
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
      this.document.defaultView?.setTimeout(() => this.focusPanelIfNeeded(), 0);
      return;
    }

    this.unlockScroll();
    this.triggerElement?.focus();
  }

  private focusPanelIfNeeded(): void {
    const panel = this.panelRef()?.nativeElement;
    const activeElement = this.document.activeElement;

    if (!panel) {
      return;
    }

    if (activeElement instanceof HTMLElement && panel.contains(activeElement)) {
      return;
    }

    panel.focus();
  }

  private lockScroll(): void {
    if (openBottomSheetCount === 0) {
      this.document.body.classList.add('ms-bottom-sheet-open');
    }

    openBottomSheetCount += 1;
  }

  private unlockScroll(): void {
    if (openBottomSheetCount > 0) {
      openBottomSheetCount -= 1;
    }

    if (openBottomSheetCount === 0) {
      this.document.body.classList.remove('ms-bottom-sheet-open');
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

    if (event.shiftKey && (activeElement === firstElement || activeElement === panel)) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (activeElement === lastElement || activeElement === panel)) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private getFocusableElements(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => element.offsetParent !== null || element === this.document.activeElement,
    );
  }
}
