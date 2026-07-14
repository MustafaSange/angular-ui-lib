import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlertComponent, ToastService } from '../../shared/ui-lib/components/feedback';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-feedback',
  imports: [RouterLink, AlertComponent, ShowcaseCode],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private readonly toast = inject(ToastService);

  protected readonly dismissibleAlertVisible = signal(true);
  protected readonly actionResult = signal('No toast action has run yet.');

  protected readonly alertKindsSnippet = `import { Component } from '@angular/core';

import { AlertComponent } from './shared/ui-lib';

@Component({
  selector: 'app-alert-kinds-example', imports: [AlertComponent], template: \`
    <ms-alert kind="info" title="Heads up">
      Invite links expire after seven days.
    </ms-alert>

    <ms-alert kind="success" title="Saved">
      Your workspace settings were updated.
    </ms-alert>

    <ms-alert kind="warning" title="Review required">
      Two imported rows need attention before publishing.
    </ms-alert>

    <ms-alert kind="danger" title="Sync failed">
      The billing export could not be completed.
    </ms-alert>
  \`, })
export class AlertKindsExample {}`;

  protected readonly alertActionsSnippet = `import { Component } from '@angular/core';

import { AlertComponent } from './shared/ui-lib';

@Component({
  selector: 'app-alert-actions-example', imports: [AlertComponent], template: \`
    <ms-alert kind="warning" title="Subscription needs attention">
      Update the payment method before the next renewal.

      <div slot="actions">
        <button class="btn btn-primary btn-sm" type="button">Update payment</button>
        <a href="/billing">View billing</a>
      </div>
    </ms-alert>
  \`, })
export class AlertActionsExample {}`;

  protected readonly dismissibleAlertSnippet = `import { Component, signal } from '@angular/core';

import { AlertComponent } from './shared/ui-lib';

@Component({
  selector: 'app-dismissible-alert-example', imports: [AlertComponent], template: \`
    @if (isVisible()) {
      <ms-alert
        kind="danger"
        title="Payment failed"
        dismissible
        (dismissed)="isVisible.set(false)"
      >
        Verify your payment method before retrying the renewal.
      </ms-alert>
    }
  \`, })
export class DismissibleAlertExample {
  protected readonly isVisible = signal(true);
}`;

  protected readonly toastKindsSnippet = `import { Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/ui-lib';

@Component({
  selector: 'app-toast-kinds-example', imports: [ToastOutletComponent], template: \`
    <button class="btn btn-primary" type="button" (click)="showToasts()">
      Show toast kinds
    </button>
    <ms-toast-outlet />
  \`, })
export class ToastKindsExample {
  private readonly toast = inject(ToastService);

  protected showToasts(): void {
    this.toast.clear();
    this.toast.info('Import started', { title: 'Queued' });
    this.toast.success('Profile saved', { title: 'Saved' });
    this.toast.warning('Two fields need review', { title: 'Review required' });
    this.toast.danger('Payment could not be processed', { title: 'Payment failed' });
  }
}`;

  protected readonly persistentDangerSnippet = `import { Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/ui-lib';

@Component({
  selector: 'app-persistent-danger-toast-example', imports: [ToastOutletComponent], template: \`
    <button class="btn btn-danger" type="button" (click)="showPersistentToast()">
      Show persistent toast
    </button>
    <ms-toast-outlet />
  \`, })
export class PersistentDangerToastExample {
  private readonly toast = inject(ToastService);

  protected showPersistentToast(): void {
    this.toast.danger('Reconnect the account before running another sync.', {
      title: 'Sync failed', duration: false, });
  }
}`;

  protected readonly toastActionSnippet = `import { Component, inject, signal } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/ui-lib';

@Component({
  selector: 'app-toast-action-example', imports: [ToastOutletComponent], template: \`
    <button class="btn btn-primary" type="button" (click)="archiveProject()">
      Archive project
    </button>
    <p>{{ result() }}</p>
    <ms-toast-outlet />
  \`, })
export class ToastActionExample {
  private readonly toast = inject(ToastService);
  protected readonly result = signal('No action yet.');

  protected archiveProject(): void {
    this.result.set('Project archived.');
    this.toast.success('Project archived', {
      action: {
        label: 'Undo', run: () => this.result.set('Archive undone.'), }, });
  }
}`;

  protected readonly stackedToastsSnippet = `import { Component, inject } from '@angular/core';

import { ToastOutletComponent, ToastService } from './shared/ui-lib';

@Component({
  selector: 'app-stacked-toasts-example',
  imports: [ToastOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="showStack()">
      Show stacked toasts
    </button>
    <ms-toast-outlet />
  \`,
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

  protected showToastKinds(): void {
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
