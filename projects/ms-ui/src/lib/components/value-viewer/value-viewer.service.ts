import { Component, Service, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalRef, ModalService } from '../modal';
import { ValueViewerComponent } from './value-viewer';
import type { ValueViewerOpenOptions } from './value-viewer-types';

const DEFAULT_TITLE = 'Value Viewer';

type ValueViewerData = {
  readonly title: string;
  readonly value: unknown;
};

@Component({
  selector: 'ms-value-viewer-modal-content',
  imports: [ValueViewerComponent],
  template: `
    <ms-value-viewer [title]="data.title" [value]="data.value" (close)="modalRef.close()" />
  `,
})
class ValueViewerModalContentComponent {
  protected readonly data = inject(MODAL_DATA) as ValueViewerData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Service()
export class ValueViewerService {
  private readonly modal = inject(ModalService);

  open(value: unknown, options: ValueViewerOpenOptions = {}): ModalRef<void> {
    const { title = DEFAULT_TITLE, ...modalOptions } = options;

    return this.modal.open<ValueViewerModalContentComponent, ValueViewerData, void>(
      ValueViewerModalContentComponent,
      {
        ...modalOptions,
        data: { title, value },
      },
    );
  }
}
