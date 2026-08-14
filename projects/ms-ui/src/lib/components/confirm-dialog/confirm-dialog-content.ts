import { Component, inject } from '@angular/core';

import { ModalComponent, ModalRef, MODAL_DATA, MODAL_REF } from '../modal';
import type { ConfirmDialogKind } from './confirm-dialog-types';

export type ConfirmDialogData = {
  title: string;
  message: string;
  kind: ConfirmDialogKind;
  confirmText: string;
  cancelText: string;
};

@Component({
  selector: 'ms-confirm-dialog-content',
  imports: [ModalComponent],
  templateUrl: './confirm-dialog-content.html',
})
export class ConfirmDialogContentComponent {
  protected readonly data = inject(MODAL_DATA) as ConfirmDialogData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<boolean>;

  protected get icon(): string {
    switch (this.data.kind) {
      case 'success':
        return 'check';
      case 'warning':
        return 'priority_high';
      case 'danger':
        return 'delete';
      case 'info':
      default:
        return 'info_i';
    }
  }

  protected get confirmButtonClass(): string {
    switch (this.data.kind) {
      case 'danger':
        return 'btn btn-danger';
      case 'success':
        return 'btn btn-success';
      case 'warning':
      case 'info':
      default:
        return 'btn btn-primary';
    }
  }

  protected confirm(): void {
    this.modalRef.close(true);
  }

  protected cancel(): void {
    this.modalRef.close(false);
  }
}
