import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

type ScrollableModalData = {
  itemCount: number;
};

@Component({
  selector: 'app-scrollable-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Scrollable content" (close)="modalRef.close()">
      <div class="modal-stack">
        @for (item of items; track item) {
          <p>
            {{ item }}. Long content keeps the modal body scrollable while the header and footer
            remain fixed inside the modal container.
          </p>
        }
      </div>

      <div slot="footer">
        <button class="btn btn-primary" type="button" (click)="modalRef.close()">Close</button>
      </div>
    </ms-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ScrollableModalContent {
  private readonly data = inject(MODAL_DATA) as ScrollableModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
  protected readonly items = Array.from({ length: this.data.itemCount }, (_, index) => index + 1);
}

@Component({
  selector: 'app-scrollable-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './scrollable-modal.html',
  styleUrl: './scrollable-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `// activity-log-modal.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef } from './shared/ui-lib';

export type ActivityLogModalData = {
  itemCount: number;
};

@Component({
  selector: 'app-activity-log-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Activity log" (close)="modalRef.close()">
      <div class="modal-stack">
        @for (item of items; track item) {
          <p>
            {{ item }}. Long content keeps the modal body scrollable while the header and footer
            remain fixed inside the modal container.
          </p>
        }
      </div>

      <div slot="footer">
        <button class="btn btn-primary" type="button" (click)="modalRef.close()">Close</button>
      </div>
    </ms-modal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogModal {
  private readonly data = inject(MODAL_DATA) as ActivityLogModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
  protected readonly items = Array.from({ length: this.data.itemCount }, (_, index) => index + 1);
}

// audit-page.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from './shared/ui-lib';
import type { ActivityLogModalData } from './activity-log-modal';

@Component({
  selector: 'app-audit-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openActivityLog()">
      Open activity log
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPage {
  private readonly modalService = inject(ModalService);

  protected async openActivityLog(): Promise<void> {
    const { ActivityLogModal } = await import('./activity-log-modal');

    this.modalService.open(ActivityLogModal, {
      data: {
        itemCount: 18,
      } satisfies ActivityLogModalData,
      width: '42rem',
      maxHeight: '80svh',
    });
  }
}`;

  protected openScrollableModal(): void {
    this.modalService.open(ScrollableModalContent, {
      data: {
        itemCount: 18,
      } satisfies ScrollableModalData,
      width: '42rem',
      maxHeight: '80svh',
    });
  }
}
