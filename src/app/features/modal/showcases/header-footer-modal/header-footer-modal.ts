import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

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
  selector: 'app-header-footer-modal-showcase',
  imports: [ModalComponent, ShowcaseCode],
  templateUrl: './header-footer-modal.html',
  styleUrl: './header-footer-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderFooterModalShowcase {
  protected readonly isOpen = signal(false);
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

  protected readonly snippet = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ModalComponent } from './shared/components/modal';

type ProjectModalResult =
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
      result: ProjectModalResult;
    };

@Component({
  selector: 'app-header-footer-modal-example',
  imports: [ModalComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="isOpen.set(true)">
      Open modal with footer
    </button>
    <span>{{ resultMessage() }}</span>

    @if (isOpen()) {
      <ms-modal title="Review changes" (close)="closeModal()">
        <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
          Skip
        </button>

        <p>Footer actions are projected by the parent component.</p>

        <div slot="footer">
          <button class="btn btn-secondary" type="button" (click)="closeWithResult({ action: 'cancel' })">
            Cancel
          </button>
          <button
            class="btn btn-primary"
            type="button"
            (click)="closeWithResult({ action: 'save', payload: { name: 'Analytics workspace' } })"
          >
            Save
          </button>
        </div>
      </ms-modal>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderFooterModalExample {
  protected readonly isOpen = signal(false);
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
      return \`Last result: save \${state.result.payload.name}\`;
    }

    return 'Last result: cancel';
  });

  protected closeModal(): void {
    this.isOpen.set(false);
    this.modalResult.set({ status: 'closed' });
  }

  protected closeWithResult(result: ProjectModalResult): void {
    this.isOpen.set(false);
    this.modalResult.set({ status: 'result', result });
  }
}`;

  protected closeModal(): void {
    this.isOpen.set(false);
    this.modalResult.set({ status: 'closed' });
  }

  protected closeWithResult(result: TypedModalResult): void {
    this.isOpen.set(false);
    this.modalResult.set({ status: 'result', result });
  }
}
