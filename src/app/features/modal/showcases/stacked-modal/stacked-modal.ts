import { Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/showcase-code';

type StackedChildModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-stacked-child-modal-content',
  imports: [ModalComponent],
  templateUrl: './stacked-child-modal-content.html',
})
class StackedChildModalContent {
  protected readonly data = inject(MODAL_DATA) as StackedChildModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-stacked-modal-content',
  imports: [ModalComponent],
  templateUrl: './stacked-modal-content.html',
})
class StackedModalContent {
  private readonly modalService = inject(ModalService);
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;

  protected openChild(): void {
    this.modalService.open<StackedChildModalContent, StackedChildModalData>(
      StackedChildModalContent,
      {
        data: {
          name: 'Nested workflow',
          owner: 'Product team',
        },
      },
    );
  }
}

@Component({
  selector: 'app-stacked-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './stacked-modal.html',
  styleUrl: './stacked-modal.scss',
  host: {
    class: 'modal-section',
  },
})
export class StackedModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `// stacked-child-modal.ts
import { Component, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef, } from './shared/ui-lib';

export type StackedChildModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-stacked-child-modal-content', imports: [ModalComponent], template: \`
    <ms-modal title="Stacked Child Modal" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>
          <strong>{{ data.name }}</strong> is owned by {{ data.owner }}.
        </p>
        <p>Closing it should preserve the underlying modal state.</p>
      </div>
    </ms-modal>
  \`, })
export class StackedChildModal {
  protected readonly data = inject(MODAL_DATA) as StackedChildModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

// stacked-parent-modal.ts
import { Component, inject } from '@angular/core';

import { MODAL_REF, ModalComponent, ModalRef, ModalService } from './shared/ui-lib';
import type { StackedChildModalData } from './stacked-child-modal';

@Component({
  selector: 'app-stacked-parent-modal', imports: [ModalComponent], template: \`
    <ms-modal title="Parent Modal" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>Open another modal on top of this one to verify stacking and focus behavior.</p>
        <button class="btn btn-primary" type="button" (click)="openChild()">
          Open Stacked Modal
        </button>
      </div>
    </ms-modal>
  \`, })
export class StackedParentModal {
  private readonly modalService = inject(ModalService);
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;

  protected async openChild(): Promise<void> {
    const { StackedChildModal } = await import('./stacked-child-modal');

    this.modalService.open(StackedChildModal, {
      data: {
        name: 'Nested workflow', owner: 'Product team', } satisfies StackedChildModalData, width: '28rem', });
  }
}

// workflows-page.ts
import { Component, inject } from '@angular/core';

import { ModalService } from './shared/ui-lib';

@Component({
  selector: 'app-workflows-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openStackedModal()">
      Open Parent Modal
    </button>
  \`,
})
export class WorkflowsPage {
  private readonly modalService = inject(ModalService);

  protected async openStackedModal(): Promise<void> {
    const { StackedParentModal } = await import('./stacked-parent-modal');

    this.modalService.open(StackedParentModal, {
      width: '34rem',
    });
  }
}`;

  protected openStackedModal(): void {
    this.modalService.open(StackedModalContent);
  }
}
