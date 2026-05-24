import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

type BasicModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-basic-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Project details" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>
          <strong>{{ data.name }}</strong> is owned by {{ data.owner }}.
        </p>
      </div>
    </ms-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BasicModalContent {
  protected readonly data = inject(MODAL_DATA) as BasicModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-basic-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './basic-modal.html',
  styleUrl: './basic-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `// project-details-modal.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef } from './shared/components/modal';

export type ProjectDetailsData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-project-details-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Project details" (close)="modalRef.close()">
      <div class="modal-stack">
        <p>
          <strong>{{ data.name }}</strong> is owned by {{ data.owner }}.
        </p>
      </div>
    </ms-modal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsModal {
  protected readonly data = inject(MODAL_DATA) as ProjectDetailsData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

// project-list.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from './shared/components/modal';
import type { ProjectDetailsData } from './project-details-modal';

@Component({
  selector: 'app-project-list',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openProjectDetails()">
      Open modal
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList {
  private readonly modalService = inject(ModalService);

  protected async openProjectDetails(): Promise<void> {
    const { ProjectDetailsModal } = await import('./project-details-modal');

    this.modalService.open(ProjectDetailsModal, {
      data: {
        name: 'Analytics workspace',
        owner: 'Ada Lovelace',
      } satisfies ProjectDetailsData,
      width: '32rem',
    });
  }
}`;

  protected openBasicModal(): void {
    this.modalService.open(BasicModalContent, {
      data: {
        name: 'Analytics workspace',
        owner: 'Ada Lovelace',
      } satisfies BasicModalData,
      width: '32rem',
    });
  }
}
