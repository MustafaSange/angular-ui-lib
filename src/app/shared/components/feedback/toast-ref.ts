import { Observable, Subject } from 'rxjs';

export class ToastRef {
  private readonly closed = new Subject<void>();
  private closeHandler: (() => void) | undefined;
  private isClosed = false;

  constructor(readonly id: string) {}

  close(): void {
    if (this.isClosed) {
      return;
    }

    this.closeHandler?.();
  }

  afterClosed(): Observable<void> {
    return this.closed.asObservable();
  }

  setCloseHandler(closeHandler: () => void): void {
    this.closeHandler = closeHandler;
  }

  finishClose(): void {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    this.closed.next();
    this.closed.complete();
    this.closeHandler = undefined;
  }
}
