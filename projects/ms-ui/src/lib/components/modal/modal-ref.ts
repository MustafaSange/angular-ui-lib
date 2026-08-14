import { Observable, Subject } from 'rxjs';

export class ModalRef<TResult = unknown> {
  private readonly closed = new Subject<TResult | undefined>();
  private closeHandler: ((result: TResult | undefined) => void) | undefined;
  private isClosed = false;

  close(result?: TResult): void {
    if (this.isClosed) {
      return;
    }

    this.closeHandler?.(result);
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.closed.asObservable();
  }

  setCloseHandler(closeHandler: (result: TResult | undefined) => void): void {
    this.closeHandler = closeHandler;
  }

  finishClose(result: TResult | undefined): void {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    this.closed.next(result);
    this.closed.complete();
    this.closeHandler = undefined;
  }
}
