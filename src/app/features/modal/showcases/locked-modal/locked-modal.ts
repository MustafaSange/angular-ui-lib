import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-locked-modal-content',
  imports: [ModalComponent],
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

  protected readonly snippet = `// locked-modal-content.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_REF,
  ModalComponent,
  ModalRef,
} from './shared/components/modal';

@Component({
  selector: 'app-locked-modal-content',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Explicit close required" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>Backdrop and Escape closing are disabled for this modal.</p>
        <p>Use the explicit action button to close it.</p>
        <button class="btn btn-primary" type="button" (click)="modalRef.close()">
          Close modal
        </button>
      </div>
    </ms-modal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedModalContent {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

// settings-page.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from './shared/components/modal';

@Component({
  selector: 'app-settings-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openLockedModal()">
      Open locked modal
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly modalService = inject(ModalService);

  protected async openLockedModal(): Promise<void> {
    const { LockedModalContent } = await import('./locked-modal-content');

    this.modalService.open(LockedModalContent, {
      closeOnBackdrop: false,
      closeOnEscape: false,
      width: '30rem',
    });
  }
}`;

  protected openLockedModal(): void {
    this.modalService.open<LockedModalContent, unknown, void>(LockedModalContent, {
      closeOnBackdrop: false,
      closeOnEscape: false,
    });
  }
}
