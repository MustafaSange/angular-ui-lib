import { Component, inject, signal } from '@angular/core';
import type { WritableSignal } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/showcase-code';

type GuardedModalData = {
  dirty: WritableSignal<boolean>;
  guardMessage: WritableSignal<string>;
};

type GuardedModalResult = {
  action: 'save' | 'discard';
};

@Component({
  selector: 'app-guarded-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal title="Guarded Editor">
      <div class="guarded-content">
        <p>
          Make an unsaved change, then try the X button, backdrop, Escape key, or a service close
          operation.
        </p>

        <div class="guard-state" aria-live="polite">
          <strong>{{ data.dirty() ? 'Unsaved changes' : 'No unsaved changes' }}</strong>
          <span>{{ data.guardMessage() || 'No close attempt has been blocked.' }}</span>
          <span>
            Open modals: {{ modalService.hasOpenModals() ? 'Yes' : 'No' }} · Top modal:
            {{ modalService.top() ? 'Available' : 'None' }}
          </span>
        </div>

        <div class="guard-actions">
          <button class="btn btn-secondary" type="button" (click)="markDirty()">
            Make Unsaved Change
          </button>
          <button class="btn btn-secondary" type="button" (click)="closeTop()">Close Top</button>
          <button class="btn btn-secondary" type="button" (click)="closeAll()">Close All</button>
        </div>
      </div>

      <div class="guard-actions" slot="footer">
        <button class="btn btn-secondary" type="button" (click)="discard()">Discard</button>
        <button class="btn btn-primary" type="button" (click)="save()">Save</button>
      </div>
    </ms-modal>
  `,
  styles: `
    .guarded-content,
    .guard-state {
      display: grid;
      gap: var(--spacing-12);
    }

    .guard-state {
      padding: var(--spacing-12);
      border: var(--border-width-sm) solid var(--color-border-muted);
      border-radius: var(--radius-md);
      background-color: var(--color-surface-muted);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    .guard-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-8);
    }
  `,
})
class GuardedModalContent {
  protected readonly data = inject(MODAL_DATA) as GuardedModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<GuardedModalResult>;
  protected readonly modalService = inject(ModalService);

  protected markDirty(): void {
    this.data.dirty.set(true);
    this.data.guardMessage.set('Unsaved changes will block dismissal attempts.');
  }

  protected closeTop(): void {
    void this.modalService.top()?.close();
  }

  protected closeAll(): void {
    void this.modalService.closeAll();
  }

  protected discard(): void {
    void this.modalRef.close({ action: 'discard' }, 'action');
  }

  protected save(): void {
    this.data.dirty.set(false);
    void this.modalRef.close({ action: 'save' }, 'action');
  }
}

@Component({
  selector: 'app-guarded-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './guarded-modal.html',
  styleUrl: './guarded-modal.scss',
  host: {
    class: 'modal-section',
  },
})
export class GuardedModalShowcase {
  protected readonly modalService = inject(ModalService);
  protected readonly lastClose = signal('No guarded modal result yet.');

  private readonly dirty = signal(false);
  private readonly guardMessage = signal('');

  protected readonly snippet = `import { Component, inject, signal } from '@angular/core';
import type { WritableSignal } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef, ModalService } from './shared/ui-lib';

type EditorData = {
  dirty: WritableSignal<boolean>;
  guardMessage: WritableSignal<string>;
};

type EditorResult = {
  action: 'save' | 'discard';
};

@Component({
  selector: 'app-guarded-editor-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal title="Guarded Editor">
      <p>Dirty state blocks dismiss and service close attempts.</p>

      <div aria-live="polite">
        <strong>{{ data.dirty() ? 'Unsaved changes' : 'No unsaved changes' }}</strong>
        <p>{{ data.guardMessage() }}</p>
        <p>
          Open modals: {{ modalService.hasOpenModals() ? 'Yes' : 'No' }} ·
          Top modal: {{ modalService.top() ? 'Available' : 'None' }}
        </p>
      </div>

      <button class="btn btn-secondary" type="button" (click)="markDirty()">
        Make Unsaved Change
      </button>
      <button class="btn btn-secondary" type="button" (click)="closeTop()">Close Top</button>
      <button class="btn btn-secondary" type="button" (click)="closeAll()">Close All</button>

      <div slot="footer">
        <button class="btn btn-secondary" type="button" (click)="discard()">Discard</button>
        <button class="btn btn-primary" type="button" (click)="save()">Save</button>
      </div>
    </ms-modal>
  \`,
})
export class GuardedEditorModal {
  protected readonly data = inject(MODAL_DATA) as EditorData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<EditorResult>;
  protected readonly modalService = inject(ModalService);

  // If dirty state is owned only by this component, setCanClose() can install or replace its guard:
  // this.modalRef.setCanClose(({ reason }) => reason === 'action' || !this.data.dirty());

  protected markDirty(): void {
    this.data.dirty.set(true);
    this.data.guardMessage.set('Unsaved changes will block dismissal attempts.');
  }

  protected closeTop(): void {
    // top() is a signal containing the top ModalRef, or null when the stack is empty.
    void this.modalService.top()?.close();
  }

  protected closeAll(): void {
    // closeAll() closes top-down and stops with false when any modal rejects closing.
    void this.modalService.closeAll();
  }

  protected discard(): void {
    // close() resolves with true only when the guard allows the modal to close.
    void this.modalRef.close({ action: 'discard' }, 'action');
  }

  protected save(): void {
    this.data.dirty.set(false);
    void this.modalRef.close({ action: 'save' }, 'action');
  }
}

@Component({
  selector: 'app-editor-page',
  template: \`
    <button class="btn btn-primary" type="button" (click)="openEditor()">
      Open Guarded Modal
    </button>
    <span>
      Open modals: {{ modalService.hasOpenModals() ? 'Yes' : 'No' }} · {{ lastClose() }}
    </span>
  \`,
})
export class EditorPage {
  // hasOpenModals() is a readonly signal that updates whenever the modal stack changes.
  protected readonly modalService = inject(ModalService);
  protected readonly lastClose = signal('No guarded modal result yet.');

  private readonly dirty = signal(false);
  private readonly guardMessage = signal('');

  protected openEditor(): void {
    this.dirty.set(false);
    this.guardMessage.set('');

    const modalRef = this.modalService.open<GuardedEditorModal, EditorData, EditorResult>(
      GuardedEditorModal,
      {
        data: {
          dirty: this.dirty,
          guardMessage: this.guardMessage,
        },
        width: '38rem',
        // canClose runs before every close attempt; true allows closing and false keeps it open.
        canClose: async ({ reason }) => {
          await Promise.resolve();

          if (reason === 'action' || !this.dirty()) {
            return true;
          }

          this.guardMessage.set(\`Close blocked. Reason: \${reason}.\`);
          return false;
        },
      },
    );

    // This emits only after canClose approves the close attempt.
    modalRef.afterClosedWithReason().subscribe(({ result, reason }) => {
      const action = result?.action ?? 'no action';
      this.lastClose.set(\`Last close: \${action}. Reason: \${reason}.\`);
    });
  }
}`;

  protected openModal(): void {
    this.dirty.set(false);
    this.guardMessage.set('');

    const modalRef = this.modalService.open<
      GuardedModalContent,
      GuardedModalData,
      GuardedModalResult
    >(GuardedModalContent, {
      data: {
        dirty: this.dirty,
        guardMessage: this.guardMessage,
      },
      width: '38rem',
      canClose: async ({ reason }) => {
        await Promise.resolve();

        if (reason === 'action' || !this.dirty()) {
          return true;
        }

        this.guardMessage.set(`Close blocked. Reason: ${reason}.`);
        return false;
      },
    });

    modalRef.afterClosedWithReason().subscribe(({ result, reason }) => {
      const action = result?.action ?? 'no action';
      this.lastClose.set(`Last close: ${action}. Reason: ${reason}.`);
    });
  }
}
