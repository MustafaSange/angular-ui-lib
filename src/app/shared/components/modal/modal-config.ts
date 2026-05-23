export type ModalConfig<TData = unknown, TResult = unknown> = {
  title: string;
  data?: TData;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};
