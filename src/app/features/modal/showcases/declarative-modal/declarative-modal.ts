import { Component, inject } from '@angular/core';

import {
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-simple-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Hello" (close)="modalRef.close()">
      <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
        Help
      </button>

      <p>Projected modal content.</p>

      <div class="modal-actions" slot="footer">
        <button class="btn btn-secondary" type="button" (click)="modalRef.close()">Cancel</button>
        <button class="btn btn-primary" type="button" (click)="modalRef.close()">Save</button>
      </div>
    </ms-modal>
  `,
  styles: `
    .modal-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-8);
    }
  `,
})
class SimpleModalContent {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-declarative-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './declarative-modal.html',
  styleUrl: './declarative-modal.scss',
  host: {
    class: 'modal-section',
  },
})
export class DeclarativeModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `// simple-modal-content.ts
import { Component, inject } from '@angular/core';

import { MODAL_REF, ModalComponent, ModalRef } from './shared/ui-lib';

@Component({
  selector: 'app-simple-modal-content', imports: [ModalComponent], template: \`
    <ms-modal title="Hello" (close)="modalRef.close()">
      <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
        Help
      </button>

      <p>Projected modal content.</p>

      <div class="modal-actions" slot="footer">
        <button class="btn btn-secondary" type="button" (click)="modalRef.close()">Cancel</button>
        <button class="btn btn-primary" type="button" (click)="modalRef.close()">Save</button>
      </div>
    </ms-modal>
  \`, styles: \`
    .modal-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-8);
    }
  \`, })
export class SimpleModalContent {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

// dashboard-page.ts
import { Component, inject } from '@angular/core';

import { ModalService } from './shared/ui-lib';

@Component({
  selector: 'app-dashboard-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openModal()">
      Open Modal
    </button>
  \`,
})
export class DashboardPage {
  private readonly modalService = inject(ModalService);

  protected async openModal(): Promise<void> {
    const { SimpleModalContent } = await import('./simple-modal-content');

    this.modalService.open(SimpleModalContent, {
      width: '30rem',
    });
  }
}`;

  protected openModal(): void {
    this.modalService.open(SimpleModalContent, {
      width: '30rem',
    });
  }
}
