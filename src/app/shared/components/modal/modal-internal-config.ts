import { InjectionToken, WritableSignal } from '@angular/core';

export type ModalInternalConfig = {
  showCloseButton: boolean;
  width?: string;
  maxWidth: string;
  maxHeight: string;
  closeOnBackdrop: boolean;
  backdropZIndex: WritableSignal<string>;
  modalZIndex: WritableSignal<string>;
};

export const MODAL_INTERNAL_CONFIG = new InjectionToken<ModalInternalConfig>(
  'MODAL_INTERNAL_CONFIG',
);
