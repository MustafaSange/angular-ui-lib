import { Component, Service, inject } from '@angular/core';

import { MODAL_DATA, ModalRef, ModalService } from '../modal';
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
  template: `<ms-value-viewer [title]="data.title" [value]="data.value" />`,
})
class ValueViewerModalContentComponent {
  protected readonly data = inject(MODAL_DATA) as ValueViewerData;
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
