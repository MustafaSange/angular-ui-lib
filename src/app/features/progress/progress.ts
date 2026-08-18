import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LoadingIndicatorComponent,
  type LoadingIndicatorVariant,
} from '../../shared/ui-lib/components/loading-indicator';
import {
  ProgressIndicatorComponent,
  SpinnerComponent,
} from '../../shared/ui-lib/components/progress-indicator';
import { SKIP_LOADING_INDICATOR } from '../../shared/ui-lib/interceptors/loading-interceptor';
import { LoadingService } from '../../shared/ui-lib/services';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-progress',
  imports: [
    RouterLink,
    LoadingIndicatorComponent,
    ProgressIndicatorComponent,
    SpinnerComponent,
    ShowcaseCode,
  ],
  providers: [LoadingService],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(LoadingService);

  protected readonly uploadedFiles = signal(6);
  protected readonly totalFiles = 10;
  protected readonly loadingVariant = signal<LoadingIndicatorVariant>('top-bar');
  protected readonly activeCount = this.loading.activeCount;
  protected readonly isLoading = this.loading.isLoading;
  protected readonly ignoredRequestStatus = signal('No ignored request has run yet.');

  protected readonly determinateSnippet = `import { Component, signal } from '@angular/core';

import { ProgressIndicatorComponent } from './shared/ui-lib';

@Component({
  selector: 'app-upload-progress-example',
  imports: [ProgressIndicatorComponent],
  template: \`
    <p>{{ uploadedFiles() }} of {{ totalFiles }} files uploaded</p>
    <ms-progress-indicator
      [value]="uploadedFiles()"
      [max]="totalFiles"
      ariaLabel="Files uploaded"
      [ariaValueText]="uploadedFiles() + ' of ' + totalFiles + ' files'"
    />
    <button type="button" (click)="changeProgress(-1)">Previous</button>
    <button type="button" (click)="changeProgress(1)">Next</button>
  \`,
})
export class UploadProgressExample {
  protected readonly uploadedFiles = signal(6);
  protected readonly totalFiles = 10;

  protected changeProgress(delta: number): void {
    this.uploadedFiles.update((value) => Math.min(Math.max(value + delta, 0), this.totalFiles));
  }
}`;

  protected readonly indeterminateSnippet = `import { Component } from '@angular/core';

import { ProgressIndicatorComponent } from './shared/ui-lib';

@Component({
  selector: 'app-indeterminate-progress-example',
  imports: [ProgressIndicatorComponent],
  template: \`
    <p id="report-progress-label">Preparing report…</p>
    <ms-progress-indicator ariaLabelledby="report-progress-label" />
  \`,
})
export class IndeterminateProgressExample {}`;

  protected readonly kindsSnippet = `import { Component } from '@angular/core';

import { ProgressIndicatorComponent } from './shared/ui-lib';

@Component({
  selector: 'app-progress-kinds-example',
  imports: [ProgressIndicatorComponent],
  template: \`
    <ms-progress-indicator size="sm" [value]="30" ariaLabel="Primary progress" />
    <ms-progress-indicator kind="success" [value]="55" ariaLabel="Successful progress" />
    <ms-progress-indicator kind="warning" [value]="75" ariaLabel="Warning progress" />
    <ms-progress-indicator kind="danger" size="lg" [value]="90" ariaLabel="Danger progress" />
  \`,
})
export class ProgressKindsExample {}`;

  protected readonly spinnerSnippet = `import { Component } from '@angular/core';

import { SpinnerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-spinner-example',
  imports: [SpinnerComponent],
  template: \`
    <h2>Variants</h2>
    <div class="spinner-options">
      <div><ms-spinner variant="ring" ariaLabel="Loading ring example" /><span>Ring</span></div>
      <div><ms-spinner variant="dots" ariaLabel="Loading dots example" /><span>Dots</span></div>
      <div><ms-spinner variant="orbit" ariaLabel="Loading orbit example" /><span>Orbit</span></div>
      <div>
        <ms-spinner variant="ring-dot" ariaLabel="Loading ring and dot example" />
        <span>Ring and Dot</span>
      </div>
    </div>

    <h2>Sizes</h2>
    <div class="spinner-options">
      <div><ms-spinner size="sm" ariaLabel="Loading small example" /><span>Small</span></div>
      <div><ms-spinner ariaLabel="Loading medium example" /><span>Medium</span></div>
      <div><ms-spinner size="lg" ariaLabel="Loading large example" /><span>Large</span></div>
    </div>

    <h2>Semantic Context</h2>
    <p>Use a semantic color only when it matches the operation's context.</p>
    <div class="spinner-options">
      <div><ms-spinner ariaLabel="Loading data" /><span>Primary</span></div>
      <div><ms-spinner kind="success" ariaLabel="Completing validation" /><span>Success</span></div>
      <div><ms-spinner kind="warning" ariaLabel="Waiting for approval" /><span>Warning</span></div>
      <div><ms-spinner kind="danger" ariaLabel="Retrying failed operation" /><span>Danger</span></div>
    </div>

    <button class="btn btn-primary" type="button" disabled>
      <ms-spinner size="sm" kind="inherit" ariaLabel="" />
      Saving…
    </button>
  \`,
  styles: \`
    :host { display: grid; gap: 1rem; justify-items: start; }
    .spinner-options { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
    .spinner-options div { display: grid; justify-items: center; gap: 0.5rem; }
  \`,
})
export class SpinnerExample {}`;

  protected readonly rtlSnippet = `import { Component } from '@angular/core';

import { ProgressIndicatorComponent } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-progress-example',
  imports: [ProgressIndicatorComponent],
  template: \`
    <div dir="rtl">
      <p id="rtl-progress-label">اكتمل ٦٠٪</p>
      <ms-progress-indicator
        kind="success"
        [value]="60"
        ariaLabelledby="rtl-progress-label"
      />
    </div>
  \`,
})
export class RtlProgressExample {}`;

  protected readonly globalLoadingSnippet = `import { Component, inject, signal } from '@angular/core';

import {
  LoadingIndicatorComponent,
  LoadingService,
  type LoadingIndicatorVariant,
} from './shared/ui-lib';

@Component({
  selector: 'app-global-loading-example',
  imports: [LoadingIndicatorComponent],
  providers: [LoadingService],
  template: \`
    <div role="group" aria-label="Loading indicator variant">
      <button type="button" (click)="variant.set('top-bar')">Use Top Bar</button>
      <button type="button" (click)="variant.set('overlay-spinner')">
        Use Overlay Spinner
      </button>
    </div>

    <p>Active requests: {{ loading.activeCount() }}</p>
    <button type="button" (click)="loading.begin()">Begin Request</button>
    <button type="button" [disabled]="!loading.isLoading()" (click)="loading.end()">
      Complete Request
    </button>

    <ms-loading-indicator
      [variant]="variant()"
      spinnerVariant="orbit"
      [blocking]="false"
    />
  \`,
})
export class GlobalLoadingExample {
  protected readonly loading = inject(LoadingService);
  protected readonly variant = signal<LoadingIndicatorVariant>('top-bar');
}`;

  protected readonly ignoredLoadingSnippet = `import {
  HttpClient,
  HttpContext,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { type ApplicationConfig, Component, inject, signal } from '@angular/core';

import {
  loadingInterceptor,
  SKIP_LOADING_INDICATOR,
} from './shared/ui-lib';

@Component({
  selector: 'app-silent-refresh-example',
  template: \`
    <button type="button" (click)="refreshSilently()">Refresh Silently</button>
    <p aria-live="polite">{{ status() }}</p>
  \`,
})
export class SilentRefreshExample {
  private readonly http = inject(HttpClient);
  protected readonly status = signal('Ready.');

  protected refreshSilently(): void {
    const context = new HttpContext().set(SKIP_LOADING_INDICATOR, true);

    this.status.set('Silent refresh started.');
    this.http.get('/api/background-refresh', { context }).subscribe({
      next: () => this.status.set('Silent refresh completed.'),
      error: () => this.status.set('Silent refresh failed without showing the loader.'),
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([loadingInterceptor]))],
};`;

  protected changeProgress(delta: number): void {
    this.uploadedFiles.update((value) => Math.min(Math.max(value + delta, 0), this.totalFiles));
  }

  protected setLoadingVariant(variant: LoadingIndicatorVariant): void {
    this.loadingVariant.set(variant);
  }

  protected beginLoading(): void {
    this.loading.begin();
  }

  protected endLoading(): void {
    this.loading.end();
  }

  protected runIgnoredRequest(): void {
    const context = new HttpContext().set(SKIP_LOADING_INDICATOR, true);
    const countBeforeRequest = this.activeCount();

    this.ignoredRequestStatus.set(
      `Ignored request started. Active count remains ${countBeforeRequest}.`,
    );

    this.http.get('favicon.ico', { context, responseType: 'blob' }).subscribe({
      next: () =>
        this.ignoredRequestStatus.set(
          `Ignored request completed. Active count remains ${this.activeCount()}.`,
        ),
      error: () =>
        this.ignoredRequestStatus.set(
          `Ignored request finished without changing the active count (${this.activeCount()}).`,
        ),
    });
  }
}
