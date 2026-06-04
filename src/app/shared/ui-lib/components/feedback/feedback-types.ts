export type FeedbackVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastAction = {
  label: string;
  run: () => void;
};

export type ToastConfig = {
  message: string;
  variant?: FeedbackVariant;
  title?: string;
  action?: ToastAction;
  duration?: number | false;
  dismissible?: boolean;
  showIcon?: boolean;
};

export type ToastEntry = {
  id: string;
  message: string;
  variant: FeedbackVariant;
  title: string | undefined;
  action: ToastAction | undefined;
  duration: number | false;
  dismissible: boolean;
  showIcon: boolean;
};
