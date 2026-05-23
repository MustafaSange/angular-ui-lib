import { InjectionToken } from '@angular/core';

export type ModalConfig = {
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};

export type ModalOpenOptions<TData = unknown> = ModalConfig & {
  data?: TData;
};

export const MODAL_CONFIG = new InjectionToken<ModalConfig>('MODAL_CONFIG');
