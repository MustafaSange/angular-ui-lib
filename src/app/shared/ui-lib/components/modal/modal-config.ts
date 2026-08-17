import type { ModalCanClose } from './modal-close-types';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export type ModalConfig = {
  size?: ModalSize;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};

export type ModalOpenOptions<TData = unknown, TResult = unknown> = ModalConfig & {
  data?: TData;
  canClose?: ModalCanClose<TResult>;
};
