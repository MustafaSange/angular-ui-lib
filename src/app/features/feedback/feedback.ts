import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlertComponent, ToastService } from '../../shared/components/feedback';
import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-feedback',
  imports: [RouterLink, AlertComponent, ShowcaseCode],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  private readonly toast = inject(ToastService);

  protected readonly dismissibleAlertVisible = signal(true);
  protected readonly actionResult = signal('No toast action has run yet.');

  protected readonly alertVariantsSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AlertComponent } from './shared/components/feedback';

@Component({
  selector: 'app-alert-variants-example',
  imports: [AlertComponent],
  template: \`
    <ms-alert variant="info" title="Heads up">
      Invite links expire after seven days.
    </ms-alert>

    <ms-alert variant="success" title="Saved">
      Your workspace settings were updated.
    </ms-alert>

    <ms-alert variant="warning" title="Review required">
      Two imported rows need attention before publishing.
    </ms-alert>

    <ms-alert variant="danger" title="Sync failed">
      The billing export could not be completed.
    </ms-alert>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertVariantsExample {}`;

  protected readonly alertActionsSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AlertComponent } from './shared/components/feedback';

@Component({
  selector: 'app-alert-actions-example',
  imports: [AlertComponent],
  template: \`
    <ms-alert variant="warning" title="Subscription needs attention">
      Update the payment method before the next renewal.

      <div slot="actions">
        <button class="btn btn-primary btn-sm" type="button">Update payment</button>
        <a href="/billing">View billing</a>
      </div>
    </ms-alert>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertActionsExample {}`;

  protected readonly dismissibleAlertSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AlertComponent } from './shared/components/feedback';

@Component({
  selector: 'app-dismissible-alert-example',
  imports: [AlertComponent],
  template: \`
    @if (isVisible()) {
      <ms-alert
        variant="success"
        title="Invitation sent"
        dismissible
        (dismissed)="isVisible.set(false)"
      >
        The teammate will receive setup instructions by email.
      </ms-alert>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DismissibleAlertExample {
  protected readonly isVisible = signal(true);
}`;

  protected readonly toastVariantsSnippet = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/components/feedback';

@Component({
  selector: 'app-toast-variants-example',
  imports: [ToastOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="showToasts()">
      Show toast variants
    </button>
    <ms-toast-outlet />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastVariantsExample {
  private readonly toast = inject(ToastService);

  protected showToasts(): void {
    this.toast.clear();
    this.toast.info('Import started', { title: 'Queued' });
    this.toast.success('Profile saved', { title: 'Saved' });
    this.toast.warning('Two fields need review', { title: 'Review required' });
    this.toast.danger('Payment could not be processed', { title: 'Payment failed' });
  }
}`;

  protected readonly persistentDangerSnippet = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/components/feedback';

@Component({
  selector: 'app-persistent-danger-toast-example',
  imports: [ToastOutletComponent],
  template: \`
    <button class="btn btn-danger" type="button" (click)="showPersistentToast()">
      Show persistent toast
    </button>
    <ms-toast-outlet />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersistentDangerToastExample {
  private readonly toast = inject(ToastService);

  protected showPersistentToast(): void {
    this.toast.danger('Reconnect the account before running another sync.', {
      title: 'Sync failed',
      duration: false,
    });
  }
}`;

  protected readonly toastActionSnippet = `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/components/feedback';

@Component({
  selector: 'app-toast-action-example',
  imports: [ToastOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="archiveProject()">
      Archive project
    </button>
    <p>{{ result() }}</p>
    <ms-toast-outlet />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastActionExample {
  private readonly toast = inject(ToastService);
  protected readonly result = signal('No action yet.');

  protected archiveProject(): void {
    this.result.set('Project archived.');
    this.toast.success('Project archived', {
      action: {
        label: 'Undo',
        run: () => this.result.set('Archive undone.'),
      },
    });
  }
}`;

  protected readonly stackedToastsSnippet = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/components/feedback';

@Component({
  selector: 'app-stacked-toasts-example',
  imports: [ToastOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="showStack()">
      Show stacked toasts
    </button>
    <ms-toast-outlet />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedToastsExample {
  private readonly toast = inject(ToastService);

  protected showStack(): void {
    this.toast.clear();

    for (let index = 1; index <= 6; index += 1) {
      this.toast.info(\`Background job \${index} queued\`, {
        title: \`Job \${index}\`,
      });
    }
  }
}`;

  protected restoreDismissibleAlert(): void {
    this.dismissibleAlertVisible.set(true);
  }

  protected showToastVariants(): void {
    this.toast.clear();
    this.toast.info('Import started', { title: 'Queued' });
    this.toast.success('Profile saved', { title: 'Saved' });
    this.toast.warning('Two fields need review', { title: 'Review required' });
    this.toast.danger('Payment could not be processed', { title: 'Payment failed' });
  }

  protected showPersistentDangerToast(): void {
    this.toast.danger('Reconnect the account before running another sync.', {
      title: 'Sync failed',
      duration: false,
    });
  }

  protected showActionToast(): void {
    this.actionResult.set('Project archived.');
    this.toast.success('Project archived', {
      action: {
        label: 'Undo',
        run: () => this.actionResult.set('Archive undone.'),
      },
    });
  }

  protected showStackedToasts(): void {
    this.toast.clear();

    for (let index = 1; index <= 6; index += 1) {
      this.toast.info(`Background job ${index} queued`, {
        title: `Job ${index}`,
      });
    }
  }
}
