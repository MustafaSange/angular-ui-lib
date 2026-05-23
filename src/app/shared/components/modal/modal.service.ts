import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  createComponent,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ModalConfig } from './modal-config';
import { ModalInternalConfig, MODAL_INTERNAL_CONFIG } from './modal-internal-config';
import { ModalComponent } from './modal';
import { ModalRef } from './modal-ref';
import { MODAL_DATA, MODAL_REF } from './modal-tokens';

type ModalEntry = {
  modalRef: ModalRef<unknown>;
  modalRefComponent: ComponentRef<ModalComponent<unknown>>;
  internalConfig: ModalInternalConfig;
  contentRef: ComponentRef<unknown>;
  previouslyFocusedElement: HTMLElement | null;
  closeOnEscape: boolean;
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  private readonly entries: ModalEntry[] = [];
  private keydownListener: ((event: KeyboardEvent) => void) | undefined;

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config: ModalConfig<TData, TResult>,
  ): ModalRef<TResult> {
    const modalRef = new ModalRef<TResult>();
    const previouslyFocusedElement = this.document.activeElement;
    const internalConfig: ModalInternalConfig = {
      showCloseButton: config.showCloseButton ?? true,
      width: config.width,
      maxWidth: config.maxWidth ?? '90%',
      maxHeight: config.maxHeight ?? '90svh',
      closeOnBackdrop: config.closeOnBackdrop ?? true,
      backdropZIndex: signal('var(--z-index-modal)'),
      modalZIndex: signal('calc(var(--z-index-modal) + 1)'),
    };
    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: MODAL_INTERNAL_CONFIG,
          useValue: internalConfig,
        },
      ],
    });

    const modalRefComponent = createComponent<ModalComponent<TResult>>(ModalComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: modalInjector,
    });

    modalRefComponent.setInput('title', config.title);
    this.appRef.attachView(modalRefComponent.hostView);
    this.document.body.append(this.getHostElement(modalRefComponent));
    modalRefComponent.changeDetectorRef.detectChanges();

    const contentInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: MODAL_DATA,
          useValue: config.data,
        },
        {
          provide: MODAL_REF,
          useValue: modalRef,
        },
      ],
    });

    const contentRef = modalRefComponent.instance.getContentHost().createComponent(component, {
      environmentInjector: this.environmentInjector,
      injector: contentInjector,
    });

    const entry: ModalEntry = {
      modalRef: modalRef as ModalRef<unknown>,
      modalRefComponent: modalRefComponent as ComponentRef<ModalComponent<unknown>>,
      internalConfig,
      contentRef,
      previouslyFocusedElement:
        previouslyFocusedElement instanceof HTMLElement ? previouslyFocusedElement : null,
      closeOnEscape: config.closeOnEscape ?? true,
    };

    modalRef.setCloseHandler((result) => this.close(entry, result));
    modalRefComponent.instance.close.subscribe(() => {
      if (this.isTopModal(entry)) {
        modalRef.close();
      }
    });

    this.entries.push(entry);
    this.updateStacking();
    this.ensureKeydownListener();
    this.document.body.classList.add('ms-modal-open');

    queueMicrotask(() => this.focusInitialElement(entry));

    return modalRef;
  }

  private close<TResult>(entry: ModalEntry, result: TResult | undefined): void {
    const entryIndex = this.entries.indexOf(entry);

    if (entryIndex === -1) {
      return;
    }

    this.entries.splice(entryIndex, 1);
    entry.contentRef.destroy();
    const hostElement = this.getHostElement(entry.modalRefComponent);
    this.appRef.detachView(entry.modalRefComponent.hostView);
    entry.modalRefComponent.destroy();
    hostElement.remove();
    entry.modalRef.finishClose(result);
    entry.previouslyFocusedElement?.focus();
    this.updateStacking();

    if (this.entries.length === 0) {
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
    const topEntry = this.entries.at(-1);

    if (!topEntry) {
      return;
    }

    if (event.key === 'Escape' && topEntry.closeOnEscape) {
      event.preventDefault();
      topEntry.modalRef.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(topEntry, event);
    }
  }

  private trapFocus(entry: ModalEntry, event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements(this.getHostElement(entry.modalRefComponent));

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
    const hostElement = this.getHostElement(entry.modalRefComponent);
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
    return this.getHostElement(entry.modalRefComponent).querySelector<HTMLElement>('[role="dialog"]');
  }

  private updateStacking(): void {
    this.entries.forEach((entry, index) => {
      entry.internalConfig.backdropZIndex.set(`calc(var(--z-index-modal) + ${index * 2})`);
      entry.internalConfig.modalZIndex.set(`calc(var(--z-index-modal) + ${index * 2 + 1})`);
    });
  }

  private isTopModal(entry: ModalEntry): boolean {
    return this.entries.at(-1) === entry;
  }

  private getHostElement(componentRef: ComponentRef<unknown>): HTMLElement {
    return componentRef.location.nativeElement as HTMLElement;
  }
}
