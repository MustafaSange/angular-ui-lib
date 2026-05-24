import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

type StackedChildModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-stacked-child-modal-content',
  imports: [ModalComponent],
  templateUrl: './stacked-child-modal-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StackedChildModalContent {
  protected readonly data = inject(MODAL_DATA) as StackedChildModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-stacked-modal-content',
  imports: [ModalComponent],
  templateUrl: './stacked-modal-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `// stacked-child-modal.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
} from './shared/components/modal';

export type StackedChildModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-stacked-child-modal-content',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Stacked child modal" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>
          <strong>{{ data.name }}</strong> is owned by {{ data.owner }}.
        </p>
        <p>Closing it should preserve the underlying modal state.</p>
      </div>
    </ms-modal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedChildModal {
  protected readonly data = inject(MODAL_DATA) as StackedChildModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

// stacked-parent-modal.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MODAL_REF, ModalComponent, ModalRef, ModalService } from './shared/components/modal';
import type { StackedChildModalData } from './stacked-child-modal';

@Component({
  selector: 'app-stacked-parent-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Parent modal" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>Open another modal on top of this one to verify stacking and focus behavior.</p>
        <button class="btn btn-primary" type="button" (click)="openChild()">
          Open stacked modal
        </button>
      </div>
    </ms-modal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedParentModal {
  private readonly modalService = inject(ModalService);
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;

  protected async openChild(): Promise<void> {
    const { StackedChildModal } = await import('./stacked-child-modal');

    this.modalService.open(StackedChildModal, {
      data: {
        name: 'Nested workflow',
        owner: 'Product team',
      } satisfies StackedChildModalData,
      width: '28rem',
    });
  }
}

// workflows-page.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from './shared/components/modal';

@Component({
  selector: 'app-workflows-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openStackedModal()">
      Open parent modal
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
