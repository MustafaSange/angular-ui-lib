import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ProgressIndicatorComponent,
  SpinnerComponent,
} from '../../shared/ui-lib/components/progress-indicator';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-progress',
  imports: [RouterLink, ProgressIndicatorComponent, SpinnerComponent, ShowcaseCode],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {
  protected readonly uploadedFiles = signal(6);
  protected readonly totalFiles = 10;

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
    <h2>Sizes</h2>
    <div class="spinner-options">
      <div><ms-spinner size="sm" ariaLabel="Loading small example" /><span>Small</span></div>
      <div><ms-spinner ariaLabel="Loading medium example" /><span>Medium</span></div>
      <div><ms-spinner size="lg" ariaLabel="Loading large example" /><span>Large</span></div>
    </div>

    <h2>Semantic context</h2>
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

  protected changeProgress(delta: number): void {
    this.uploadedFiles.update((value) => Math.min(Math.max(value + delta, 0), this.totalFiles));
  }
}
