import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MODAL_REF, ModalRef, ModalService } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-locked-modal-content',
  templateUrl: './locked-modal-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LockedModalContent {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-locked-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './locked-modal.html',
  styleUrl: './locked-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `this.modalService.open(LockedModalContent, {
  title: 'Explicit close required',
  closeOnBackdrop: false,
  closeOnEscape: false,
});`;

  protected openLockedModal(): void {
    this.modalService.open<LockedModalContent, unknown, void>(LockedModalContent, {
      title: 'Explicit close required',
      closeOnBackdrop: false,
      closeOnEscape: false,
    });
  }
}
