import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

type TypedModalData = {
  projectName: string;
};

type TypedModalResult =
  | {
      action: 'save';
      payload: {
        name: string;
      };
    }
  | {
      action: 'cancel';
    };

type ModalResultState =
  | {
      status: 'idle';
    }
  | {
      status: 'closed';
    }
  | {
      status: 'result';
      result: TypedModalResult;
    };

@Component({
  selector: 'app-header-footer-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Review changes" (close)="modalRef.close()">
      <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
        Skip
      </button>

      <div class="modal-stack">
        <p>Review changes for {{ data.projectName }} before saving.</p>
        <p>The opener records a typed result when an action is clicked.</p>
      </div>

      <div class="modal-actions" slot="footer">
        <button class="btn btn-secondary" type="button" (click)="modalRef.close({ action: 'cancel' })">
          Cancel
        </button>
        <button
          class="btn btn-primary"
          type="button"
          (click)="modalRef.close({ action: 'save', payload: { name: data.projectName } })"
        >
          Save
        </button>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HeaderFooterModalContent {
  protected readonly data = inject(MODAL_DATA) as TypedModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<TypedModalResult>;
}

@Component({
  selector: 'app-header-footer-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './header-footer-modal.html',
  styleUrl: './header-footer-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderFooterModalShowcase {
  private readonly modalService = inject(ModalService);
  protected readonly modalResult = signal<ModalResultState>({ status: 'idle' });
  protected readonly resultMessage = computed(() => {
    const state = this.modalResult();

    if (state.status === 'idle') {
      return 'No modal result yet.';
    }

    if (state.status === 'closed') {
      return 'Modal closed without a result.';
    }

    if (state.result.action === 'save') {
      return `Last result: save ${state.result.payload.name}`;
    }

    return 'Last result: cancel';
  });

  protected readonly snippet = `// review-changes-modal.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef } from './shared/ui-lib';

export type ReviewChangesData = {
  projectName: string;
};

export type ReviewChangesResult =
  | {
      action: 'save';
      payload: {
        name: string;
      };
    }
  | {
      action: 'cancel';
    };

@Component({
  selector: 'app-review-changes-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Review changes" (close)="modalRef.close()">
      <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
        Skip
      </button>

      <p>Review changes for {{ data.projectName }} before saving.</p>

      <div class="modal-actions" slot="footer">
        <button class="btn btn-secondary" type="button" (click)="modalRef.close({ action: 'cancel' })">
          Cancel
        </button>
        <button
          class="btn btn-primary"
          type="button"
          (click)="modalRef.close({ action: 'save', payload: { name: data.projectName } })"
        >
          Save
        </button>
      </div>
    </ms-modal>
  \`,
  styles: \`
    .modal-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-8);
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewChangesModal {
  protected readonly data = inject(MODAL_DATA) as ReviewChangesData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<ReviewChangesResult>;
}

// project-settings.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ModalService } from './shared/ui-lib';
import type { ReviewChangesData, ReviewChangesResult } from './review-changes-modal';

type SaveState =
  | {
      status: 'idle';
    }
  | {
      status: 'closed';
    }
  | {
      status: 'result';
      result: ReviewChangesResult;
    };

@Component({
  selector: 'app-project-settings',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openReviewChanges()">
      Open modal with footer
    </button>
    <span>{{ resultMessage() }}</span>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettings {
  private readonly modalService = inject(ModalService);
  protected readonly saveState = signal<SaveState>({ status: 'idle' });
  protected readonly resultMessage = computed(() => {
    const state = this.saveState();

    if (state.status === 'idle') {
      return 'No modal result yet.';
    }

    if (state.status === 'closed') {
      return 'Modal closed without a result.';
    }

    if (state.result.action === 'save') {
      return \`Last result: save \${state.result.payload.name}\`;
    }

    return 'Last result: cancel';
  });

  protected async openReviewChanges(): Promise<void> {
    const { ReviewChangesModal } = await import('./review-changes-modal');

    const modalRef = this.modalService.open<unknown, ReviewChangesData, ReviewChangesResult>(
      ReviewChangesModal,
      {
        data: {
          projectName: 'Analytics workspace',
        },
        width: '36rem',
      },
    );

    modalRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.saveState.set({ status: 'closed' });
        return;
      }

      this.saveState.set({ status: 'result', result });
    });
  }
}`;

  protected openTypedModal(): void {
    const modalRef = this.modalService.open<
      HeaderFooterModalContent,
      TypedModalData,
      TypedModalResult
    >(HeaderFooterModalContent, {
      data: {
        projectName: 'Analytics workspace',
      },
      width: '36rem',
    });

    modalRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.modalResult.set({ status: 'closed' });
        return;
      }

      this.modalResult.set({ status: 'result', result });
    });
  }
}
