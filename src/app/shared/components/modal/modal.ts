import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { MODAL_INTERNAL_CONFIG } from './modal-internal-config';

let nextModalId = 0;

@Component({
  selector: 'ms-modal',
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent<TResult = unknown> {
  private readonly internalConfig = inject(MODAL_INTERNAL_CONFIG, {
    optional: true,
  });

  readonly title = input.required<string>();

  readonly close = output<void>();

  protected readonly titleId = `modal-title-${nextModalId++}`;
  protected readonly showCloseButton = computed(
    () => this.internalConfig?.showCloseButton ?? true,
  );
  protected readonly width = computed(() => this.internalConfig?.width);
  protected readonly maxWidth = computed(() => this.internalConfig?.maxWidth ?? '90%');
  protected readonly maxHeight = computed(() => this.internalConfig?.maxHeight ?? '90svh');
  protected readonly closeOnBackdrop = computed(
    () => this.internalConfig?.closeOnBackdrop ?? true,
  );
  protected readonly backdropZIndex = computed(
    () => this.internalConfig?.backdropZIndex() ?? 'var(--z-index-modal)',
  );
  protected readonly modalZIndex = computed(
    () => this.internalConfig?.modalZIndex() ?? 'calc(var(--z-index-modal) + 1)',
  );

  private readonly contentHost = viewChild('contentHost', {
    read: ViewContainerRef,
  });

  handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close.emit();
    }
  }

  getContentHost(): ViewContainerRef {
    const contentHost = this.contentHost();

    if (!contentHost) {
      throw new Error('Modal content host is not available.');
    }

    return contentHost;
  }
}
