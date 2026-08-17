export type ModalCloseReason = 'action' | 'close-button' | 'backdrop' | 'escape' | 'programmatic';

export type ModalCloseEvent<TResult = unknown> = Readonly<{
  result: TResult | undefined;
  reason: ModalCloseReason;
}>;

export type ModalCanClose<TResult = unknown> = (
  event: ModalCloseEvent<TResult>,
) => boolean | Promise<boolean>;

export type ModalCloseOptions = Readonly<{
  force?: boolean;
}>;
