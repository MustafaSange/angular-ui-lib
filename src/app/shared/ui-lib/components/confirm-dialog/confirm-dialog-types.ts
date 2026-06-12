export type ConfirmDialogKind = 'info' | 'success' | 'warning' | 'danger';

export type ConfirmDialogConfig = {
  title: string;
  message: string;
  kind?: ConfirmDialogKind;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  maxWidth?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
};
