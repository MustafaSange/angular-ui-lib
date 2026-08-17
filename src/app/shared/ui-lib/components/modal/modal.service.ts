import { DOCUMENT } from '@angular/common';
import { Injector, Service, Type, computed, inject, signal } from '@angular/core';

import type { ModalCloseEvent, ModalCloseOptions } from './modal-close-types';
import type { ModalConfig, ModalOpenOptions } from './modal-config';
import { ModalRef } from './modal-ref';
import { MODAL_CONFIG, MODAL_DATA, MODAL_REF } from './modal-tokens';

export type ModalEntry = {
  id: number;
  component: Type<unknown>;
  injector: Injector;
  modalRef: ModalRef<unknown>;
  closeOnEscape: boolean;
  stackOffset: string;
  previouslyFocusedElement: HTMLElement | null;
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let nextModalEntryId = 0;

@Service()
export class ModalService {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly modalEntries = signal<ModalEntry[]>([]);
  private keydownListener: ((event: KeyboardEvent) => void) | undefined;

  readonly entries = this.modalEntries.asReadonly();
  readonly hasOpenModals = computed(() => this.modalEntries().length > 0);
  readonly top = computed<ModalRef<unknown> | null>(
    () => this.modalEntries().at(-1)?.modalRef ?? null,
  );

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config: ModalOpenOptions<TData, TResult> = {},
  ): ModalRef<TResult> {
    const modalRef = new ModalRef<TResult>();
    const previouslyFocusedElement = this.document.activeElement;
    const modalConfig = this.getModalConfig(config);
    const contentInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: MODAL_DATA,
          useValue: config.data,
        },
        {
          provide: MODAL_CONFIG,
          useValue: modalConfig,
        },
        {
          provide: MODAL_REF,
          useValue: modalRef,
        },
      ],
    });
    const entry: ModalEntry = {
      id: nextModalEntryId++,
      component,
      injector: contentInjector,
      modalRef: modalRef as ModalRef<unknown>,
      closeOnEscape: modalConfig.closeOnEscape ?? true,
      stackOffset: '0',
      previouslyFocusedElement:
        previouslyFocusedElement instanceof HTMLElement ? previouslyFocusedElement : null,
    };

    modalRef.setCanClose(config.canClose);
    modalRef.setCloseHandler((event) => this.close(entry, event));
    this.modalEntries.update((entries) => this.withStacking([...entries, entry]));
    this.ensureKeydownListener();
    this.document.body.classList.add('ms-modal-open');

    queueMicrotask(() => this.focusInitialElement(entry));

    return modalRef;
  }

  async closeAll(options: ModalCloseOptions = {}): Promise<boolean> {
    while (this.modalEntries().length > 0) {
      const topEntry = this.modalEntries().at(-1);

      if (!topEntry) {
        return true;
      }

      const didClose = await topEntry.modalRef.close(undefined, 'programmatic', options);

      if (!didClose) {
        return false;
      }
    }

    return true;
  }

  private close(entry: ModalEntry, event: ModalCloseEvent): void {
    const entries = this.modalEntries();
    const entryIndex = entries.indexOf(entry);

    if (entryIndex === -1) {
      return;
    }

    this.modalEntries.set(this.withStacking(entries.filter((item) => item !== entry)));
    entry.modalRef.finishClose(event);
    entry.previouslyFocusedElement?.focus();

    if (this.modalEntries().length === 0) {
      this.document.body.classList.remove('ms-modal-open');
      this.removeKeydownListener();
    }
  }

  private ensureKeydownListener(): void {
    if (this.keydownListener) {
      return;
    }

    this.keydownListener = (event) => this.handleKeydown(event);
    this.document.addEventListener('keydown', this.keydownListener);
  }

  private removeKeydownListener(): void {
    if (!this.keydownListener) {
      return;
    }

    this.document.removeEventListener('keydown', this.keydownListener);
    this.keydownListener = undefined;
  }

  private handleKeydown(event: KeyboardEvent): void {
    const topEntry = this.modalEntries().at(-1);

    if (!topEntry) {
      return;
    }

    if (event.key === 'Escape' && topEntry.closeOnEscape) {
      event.preventDefault();
      void topEntry.modalRef.close(undefined, 'escape');
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(topEntry, event);
    }
  }

  private trapFocus(entry: ModalEntry, event: KeyboardEvent): void {
    const hostElement = this.getHostElement(entry);

    if (!hostElement) {
      return;
    }

    const focusableElements = this.getFocusableElements(hostElement);

    if (focusableElements.length === 0) {
      event.preventDefault();
      this.getDialogElement(entry)?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private focusInitialElement(entry: ModalEntry): void {
    const hostElement = this.getHostElement(entry);

    if (!hostElement) {
      return;
    }

    const focusableElement = this.getFocusableElements(hostElement)[0];

    if (focusableElement) {
      focusableElement.focus();
      return;
    }

    this.getDialogElement(entry)?.focus();
  }

  private getFocusableElements(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => element.offsetParent !== null || element === this.document.activeElement,
    );
  }

  private getDialogElement(entry: ModalEntry): HTMLElement | null {
    return this.getHostElement(entry)?.querySelector<HTMLElement>('[role="dialog"]') ?? null;
  }

  private getModalConfig<TData, TResult>(config: ModalOpenOptions<TData, TResult>): ModalConfig {
    const { size, closeOnEscape, closeOnBackdrop, showCloseButton, width, maxWidth, maxHeight } =
      config;

    return {
      size,
      closeOnEscape,
      closeOnBackdrop,
      showCloseButton,
      width,
      maxWidth,
      maxHeight,
    };
  }

  private withStacking(entries: ModalEntry[]): ModalEntry[] {
    return entries.map((entry, index) => {
      entry.stackOffset = `${index * 2}`;

      return entry;
    });
  }

  private getHostElement(entry: ModalEntry): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(`[data-modal-entry-id="${entry.id}"]`);
  }
}
