import { Component, computed, inject, input, output } from '@angular/core';

import { TranslatePipe } from '../../pipes';
import type { ModalCloseReason } from './modal-close-types';
import { MODAL_CONFIG, MODAL_REF } from './modal-tokens';

let nextModalId = 0;

@Component({
  selector: 'ms-modal',
  imports: [TranslatePipe],
  templateUrl: './modal.html',
})
export class ModalComponent<TResult = unknown> {
  private readonly config = inject(MODAL_CONFIG, {
    optional: true,
  });
  private readonly modalRef = inject(MODAL_REF, {
    optional: true,
  });

  readonly title = input.required<string>();

  readonly close = output<void>();

  protected readonly titleId = `modal-title-${nextModalId++}`;
  protected readonly size = computed(() => this.config?.size ?? 'md');
  protected readonly showCloseButton = computed(() => this.config?.showCloseButton ?? true);
  protected readonly width = computed(() => this.config?.width);
  protected readonly maxWidth = computed(() => this.config?.maxWidth);
  protected readonly maxHeight = computed(() => this.config?.maxHeight);
  protected readonly closeOnBackdrop = computed(() => this.config?.closeOnBackdrop ?? true);
  protected readonly backdropZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-modal-stack-offset, 0))',
  );
  protected readonly modalZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-modal-stack-offset, 0) + 1)',
  );

  protected handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.requestClose('backdrop');
    }
  }

  protected requestClose(reason: ModalCloseReason): void {
    if (this.modalRef) {
      void this.modalRef.close(undefined, reason);
      return;
    }

    this.close.emit();
  }
}
