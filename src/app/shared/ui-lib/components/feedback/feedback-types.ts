import type { SemanticKind } from '../../semantic-types';

export type FeedbackKind = SemanticKind;

export type ToastAction = {
  label: string;
  run: () => void;
};

export type ToastConfig = {
  message: string;
  kind?: FeedbackKind;
  title?: string;
  action?: ToastAction;
  duration?: number | false;
  dismissible?: boolean;
  showIcon?: boolean;
};

export type ToastEntry = {
  id: string;
  message: string;
  kind: FeedbackKind;
  title: string | undefined;
  action: ToastAction | undefined;
  duration: number | false;
  dismissible: boolean;
  showIcon: boolean;
};
