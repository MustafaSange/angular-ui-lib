import { Component, inject } from '@angular/core';

import {
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-no-padding-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal class="custom-modal" title="Custom Modal Styling">
      <div class="edge-banner">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        <div>
          <h3>Custom Content Layout</h3>
          <p>The banner reaches both edges of the modal body.</p>
        </div>
      </div>

      <div class="content-section">
        Add padding only to the sections that need it while keeping full-width content edge to edge.
      </div>

      <div slot="footer">
        <button class="btn btn-primary" type="button" (click)="modalRef.close(undefined, 'action')">
          Close
        </button>
      </div>
    </ms-modal>
  `,
  styles: `
    .custom-modal {
      --ms-modal-header-padding: var(--spacing-12);
      --ms-modal-content-padding: 0;
      --ms-modal-footer-padding: var(--spacing-16);
      --ms-modal-border-radius: var(--radius-lg);
      --ms-modal-background: var(--color-surface-raised);
    }

    .edge-banner {
      display: flex;
      align-items: center;
      gap: var(--spacing-12);
      padding: var(--spacing-20);
      background-color: var(--color-surface-muted);
      border-block-end: var(--border-width-sm) solid var(--color-border-muted);
    }

    .edge-banner h3,
    .edge-banner p {
      margin: 0;
    }

    .edge-banner p {
      margin-block-start: var(--spacing-4);
      color: var(--color-text-secondary);
    }

    .content-section {
      padding: var(--spacing-20);
      color: var(--color-text-secondary);
    }
  `,
})
class NoPaddingModalContent {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-no-padding-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './no-padding-modal.html',
  styleUrl: './no-padding-modal.scss',
  host: {
    class: 'modal-section',
  },
})
export class NoPaddingModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `import { Component, inject } from '@angular/core';

import { MODAL_REF, ModalComponent, ModalRef, ModalService } from './shared/ui-lib';

@Component({
  selector: 'app-edge-to-edge-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal class="custom-modal" title="Custom Modal Styling">
      <div class="edge-banner">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        <div>
          <h3>Custom Content Layout</h3>
          <p>The banner reaches both edges of the modal body.</p>
        </div>
      </div>

      <div class="content-section">
        Add padding only to the sections that need it while keeping full-width content edge to edge.
      </div>

      <div slot="footer">
        <button class="btn btn-primary" type="button" (click)="modalRef.close(undefined, 'action')">Close</button>
      </div>
    </ms-modal>
  \`,
  styles: \`
    .custom-modal {
      --ms-modal-header-padding: var(--spacing-12);
      --ms-modal-content-padding: 0;
      --ms-modal-footer-padding: var(--spacing-16);
      --ms-modal-border-radius: var(--radius-lg);
      --ms-modal-background: var(--color-surface-raised);
    }

    .edge-banner {
      display: flex;
      align-items: center;
      gap: var(--spacing-12);
      padding: var(--spacing-20);
      background-color: var(--color-surface-muted);
      border-block-end: var(--border-width-sm) solid var(--color-border-muted);
    }

    .edge-banner h3,
    .edge-banner p {
      margin: 0;
    }

    .edge-banner p {
      margin-block-start: var(--spacing-4);
      color: var(--color-text-secondary);
    }

    .content-section {
      padding: var(--spacing-20);
      color: var(--color-text-secondary);
    }
  \`,
})
export class EdgeToEdgeModal {
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-modal-example',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openModal()">
      Open Custom-Styled Modal
    </button>
  \`,
})
export class ModalExample {
  private readonly modalService = inject(ModalService);

  protected openModal(): void {
    this.modalService.open(EdgeToEdgeModal, { width: '34rem' });
  }
}`;

  protected openModal(): void {
    this.modalService.open(NoPaddingModalContent, { width: '34rem' });
  }
}
