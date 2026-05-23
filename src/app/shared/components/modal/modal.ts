import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { MODAL_CONFIG } from './modal-config';

let nextModalId = 0;

@Component({
  selector: 'ms-modal',
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent<TResult = unknown> {
  private readonly config = inject(MODAL_CONFIG, {
    optional: true,
  });

  readonly title = input.required<string>();

  readonly close = output<void>();

  protected readonly titleId = `modal-title-${nextModalId++}`;
  protected readonly showCloseButton = computed(() => this.config?.showCloseButton ?? true);
  protected readonly width = computed(() => this.config?.width);
  protected readonly maxWidth = computed(() => this.config?.maxWidth ?? '90%');
  protected readonly maxHeight = computed(() => this.config?.maxHeight ?? '90svh');
  protected readonly closeOnBackdrop = computed(() => this.config?.closeOnBackdrop ?? true);
  protected readonly backdropZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-modal-stack-offset, 0))',
  );
  protected readonly modalZIndex = computed(
    () => 'calc(var(--z-index-modal) + var(--ms-modal-stack-offset, 0) + 1)',
  );

  protected handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close.emit();
    }
  }
}
