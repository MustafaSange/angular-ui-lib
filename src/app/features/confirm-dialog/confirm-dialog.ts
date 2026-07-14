import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ConfirmDialogService } from '../../shared/ui-lib/components/confirm-dialog';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-confirm-dialog',
  imports: [RouterLink, ShowcaseCode],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  private readonly confirmDialog = inject(ConfirmDialogService);

  protected readonly basicResult = signal('No confirmation has run yet.');
  protected readonly dangerResult = signal('No destructive confirmation has run yet.');
  protected readonly kindResult = signal('No kind confirmation has run yet.');
  protected readonly lockedResult = signal('No locked confirmation has run yet.');

  protected readonly basicSnippet = `import { Component, inject, signal } from '@angular/core';

import { ConfirmDialogService, ModalOutletComponent } from './shared/ui-lib';

@Component({
  selector: 'app-basic-confirm-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="confirmPublish()">
      Publish release
    </button>
    <p>{{ result() }}</p>
    <ms-modal-outlet />
  \`,
})
export class BasicConfirmExample {
  private readonly confirmDialog = inject(ConfirmDialogService);
  protected readonly result = signal('No confirmation has run yet.');

  protected confirmPublish(): void {
    this.confirmDialog.confirm({
      title: 'Publish release?',
      message: 'The release will be visible to every workspace member.',
      confirmText: 'Publish',
      cancelText: 'Review again',
    }).subscribe((confirmed) => {
      this.result.set(confirmed ? 'Release confirmed.' : 'Release cancelled.');
    });
  }
}`;

  protected readonly dangerSnippet = `import { Component, inject, signal } from '@angular/core';

import { ConfirmDialogService, ModalOutletComponent } from './shared/ui-lib';

@Component({
  selector: 'app-danger-confirm-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-danger" type="button" (click)="deleteProject()">
      Delete project
    </button>
    <p>{{ result() }}</p>
    <ms-modal-outlet />
  \`,
})
export class DangerConfirmExample {
  private readonly confirmDialog = inject(ConfirmDialogService);
  protected readonly result = signal('No destructive confirmation has run yet.');

  protected deleteProject(): void {
    this.confirmDialog.danger({
      title: 'Delete project?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep project',
    }).subscribe((confirmed) => {
      this.result.set(confirmed ? 'Project deletion confirmed.' : 'Project kept.');
    });
  }
}`;

  protected readonly kindsSnippet = `import { Component, inject, signal } from '@angular/core';

import { ConfirmDialogKind, ConfirmDialogService, ModalOutletComponent } from './shared/ui-lib';

@Component({
  selector: 'app-confirm-kinds-example',
  imports: [ModalOutletComponent],
  template: \`
    @for (kind of kinds; track kind) {
      <button class="btn btn-outline" type="button" (click)="openKind(kind)">
        {{ kind }}
      </button>
    }
    <p>{{ result() }}</p>
    <ms-modal-outlet />
  \`,
})
export class ConfirmKindsExample {
  private readonly confirmDialog = inject(ConfirmDialogService);
  protected readonly kinds: ConfirmDialogKind[] = ['info', 'success', 'warning', 'danger'];
  protected readonly result = signal('No kind confirmation has run yet.');

  protected openKind(kind: ConfirmDialogKind): void {
    this.confirmDialog.confirm({
      kind,
      title: \`\${kind} confirmation\`,
      message: 'Confirmations use kind to set the icon and action tone.',
    }).subscribe((confirmed) => {
      this.result.set(\`\${kind} resolved with \${confirmed}.\`);
    });
  }
}`;

  protected readonly lockedSnippet = `import { Component, inject, signal } from '@angular/core';

import { ConfirmDialogService, ModalOutletComponent } from './shared/ui-lib';

@Component({
  selector: 'app-locked-confirm-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="openLocked()">
      Open locked confirmation
    </button>
    <p>{{ result() }}</p>
    <ms-modal-outlet />
  \`,
})
export class LockedConfirmExample {
  private readonly confirmDialog = inject(ConfirmDialogService);
  protected readonly result = signal('No locked confirmation has run yet.');

  protected openLocked(): void {
    this.confirmDialog.warning({
      title: 'Submit final report?',
      message: 'Use one of the actions to continue.',
      confirmText: 'Submit report',
      cancelText: 'Keep editing',
      closeOnBackdrop: false,
      closeOnEscape: false,
      showCloseButton: false,
    }).subscribe((confirmed) => {
      this.result.set(confirmed ? 'Report submitted.' : 'Report kept as draft.');
    });
  }
}`;

  protected openBasic(): void {
    this.confirmDialog
      .confirm({
        title: 'Publish release?',
        message: 'The release will be visible to every workspace member.',
        confirmText: 'Publish',
        cancelText: 'Review again',
      })
      .subscribe((confirmed) => {
        this.basicResult.set(confirmed ? 'Release confirmed.' : 'Release cancelled.');
      });
  }

  protected openDanger(): void {
    this.confirmDialog
      .danger({
        title: 'Delete project?',
        message: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep project',
      })
      .subscribe((confirmed) => {
        this.dangerResult.set(confirmed ? 'Project deletion confirmed.' : 'Project kept.');
      });
  }

  protected openKind(kind: 'info' | 'success' | 'warning' | 'danger'): void {
    this.confirmDialog
      .confirm({
        kind,
        title: `${kind} confirmation`,
        message: 'Confirmations use kind to set the icon and action tone.',
      })
      .subscribe((confirmed) => {
        this.kindResult.set(`${kind} resolved with ${confirmed}.`);
      });
  }

  protected openLocked(): void {
    this.confirmDialog
      .warning({
        title: 'Submit final report?',
        message: 'Use one of the actions to continue.',
        confirmText: 'Submit report',
        cancelText: 'Keep editing',
        closeOnBackdrop: false,
        closeOnEscape: false,
        showCloseButton: false,
      })
      .subscribe((confirmed) => {
        this.lockedResult.set(confirmed ? 'Report submitted.' : 'Report kept as draft.');
      });
  }
}
