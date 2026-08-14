export type BottomSheetSize = 'compact' | 'medium' | 'full';

export type BottomSheetConfig = {
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  showHandle?: boolean;
  size?: BottomSheetSize;
  maxWidth?: string;
};

export type BottomSheetOpenOptions<TData = unknown> = BottomSheetConfig & {
  data?: TData;
};
