import { Observable, Subject } from 'rxjs';

import type {
  ModalCanClose,
  ModalCloseEvent,
  ModalCloseOptions,
  ModalCloseReason,
} from './modal-close-types';

export class ModalRef<TResult = unknown> {
  private readonly closed = new Subject<TResult | undefined>();
  private readonly closedWithReason = new Subject<ModalCloseEvent<TResult>>();
  private closeHandler: ((event: ModalCloseEvent<TResult>) => void) | undefined;
  private canClose: ModalCanClose<TResult> | undefined;
  private isClosed = false;
  private isClosePending = false;

  async close(
    result?: TResult,
    reason: ModalCloseReason = 'programmatic',
    options: ModalCloseOptions = {},
  ): Promise<boolean> {
    if (this.isClosed || (this.isClosePending && !options.force) || !this.closeHandler) {
      return false;
    }

    const event = { result, reason } satisfies ModalCloseEvent<TResult>;

    if (!options.force && this.canClose) {
      this.isClosePending = true;

      try {
        if (!(await this.canClose(event)) || this.isClosed) {
          return false;
        }
      } catch {
        return false;
      } finally {
        this.isClosePending = false;
      }
    }

    this.closeHandler(event);

    return this.isClosed;
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.closed.asObservable();
  }

  afterClosedWithReason(): Observable<ModalCloseEvent<TResult>> {
    return this.closedWithReason.asObservable();
  }

  setCanClose(canClose: ModalCanClose<TResult> | undefined): void {
    this.canClose = canClose;
  }

  setCloseHandler(closeHandler: (event: ModalCloseEvent<TResult>) => void): void {
    this.closeHandler = closeHandler;
  }

  finishClose(event: ModalCloseEvent<TResult>): void {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    this.closed.next(event.result);
    this.closed.complete();
    this.closedWithReason.next(event);
    this.closedWithReason.complete();
    this.closeHandler = undefined;
    this.canClose = undefined;
  }
}
