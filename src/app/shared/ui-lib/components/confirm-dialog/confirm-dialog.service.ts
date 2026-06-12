import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ModalService } from '../modal';
import {
  ConfirmDialogContentComponent,
  type ConfirmDialogData,
} from './confirm-dialog-content';
import type { ConfirmDialogConfig } from './confirm-dialog-types';

const DEFAULT_WIDTH = '28rem';
const DEFAULT_MAX_WIDTH = 'calc(100vw - (var(--spacing-16) * 2))';

@Service()
export class ConfirmDialogService {
  private readonly modal = inject(ModalService);

  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    const data = this.getDialogData(config);
    const modalRef = this.modal.open<ConfirmDialogContentComponent, ConfirmDialogData, boolean>(
      ConfirmDialogContentComponent,
      {
        data,
        width: config.width ?? DEFAULT_WIDTH,
        maxWidth: config.maxWidth ?? DEFAULT_MAX_WIDTH,
        closeOnBackdrop: config.closeOnBackdrop,
        closeOnEscape: config.closeOnEscape,
        showCloseButton: config.showCloseButton ?? false,
      },
    );

    return modalRef.afterClosed().pipe(map((result) => result === true));
  }

  info(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean> {
    return this.confirm({
      ...config,
      kind: 'info',
    });
  }

  success(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean> {
    return this.confirm({
      ...config,
      kind: 'success',
    });
  }

  warning(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean> {
    return this.confirm({
      ...config,
      kind: 'warning',
    });
  }

  danger(config: Omit<ConfirmDialogConfig, 'kind'>): Observable<boolean> {
    return this.confirm({
      ...config,
      kind: 'danger',
    });
  }

  private getDialogData(config: ConfirmDialogConfig): ConfirmDialogData {
    return {
      title: config.title,
      message: config.message,
      kind: config.kind ?? 'info',
      confirmText: config.confirmText ?? 'Confirm',
      cancelText: config.cancelText ?? 'Cancel',
    };
  }
}
