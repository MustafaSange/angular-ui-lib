import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CopyButtonComponent,
  CopyRevealComponent,
  copyTextToClipboard,
} from '../../shared/components/copy-button';
import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-clipboard',
  imports: [RouterLink, CopyButtonComponent, CopyRevealComponent, ShowcaseCode],
  templateUrl: './clipboard.html',
  styleUrl: './clipboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clipboard {
  protected readonly helperResult = signal('No helper copy has run yet.');

  protected readonly inputSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CopyButtonComponent } from './shared/components/copy-button';

@Component({
  selector: 'app-copy-input-example',
  imports: [CopyButtonComponent],
  template: \`
    <code>INV-2026-0042</code>
    <ms-copy-button text="INV-2026-0042" ariaLabel="Copy invoice number" />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyInputExample {}`;

  protected readonly projectedSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CopyButtonComponent } from './shared/components/copy-button';

@Component({
  selector: 'app-copy-projected-example',
  imports: [CopyButtonComponent],
  template: \`
    <ms-copy-button ariaLabel="Copy support email">
      support@example.com
    </ms-copy-button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyProjectedExample {}`;

  protected readonly revealSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CopyRevealComponent } from './shared/components/copy-button';

@Component({
  selector: 'app-copy-reveal-example',
  imports: [CopyRevealComponent],
  template: \`
    <ms-copy-reveal text="support@example.com" ariaLabel="Copy support email">
      support@example.com
    </ms-copy-reveal>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyRevealExample {}`;

  protected readonly helperSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { copyTextToClipboard } from './shared/components/copy-button';

@Component({
  selector: 'app-copy-helper-example',
  template: \`
    <button class="btn btn-outline" type="button" (click)="copyReference()">
      Copy reference
    </button>
    <p>{{ result() }}</p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyHelperExample {
  protected readonly result = signal('No copy has run yet.');

  protected async copyReference(): Promise<void> {
    const copyResult = await copyTextToClipboard('REF-7842');
    this.result.set(copyResult === 'copied' ? 'Copied REF-7842.' : 'Copy failed.');
  }
}`;

  protected readonly statesSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CopyButtonComponent } from './shared/components/copy-button';

@Component({
  selector: 'app-copy-states-example',
  imports: [CopyButtonComponent],
  template: \`
    <ms-copy-button text="Primary action" variant="primary" ariaLabel="Copy primary value" />
    <ms-copy-button text="Outline action" variant="outline" ariaLabel="Copy outline value" />
    <ms-copy-button text="Small action" size="sm" ariaLabel="Copy small value" />
    <ms-copy-button text="Unavailable" ariaLabel="Copy unavailable value" disabled />
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyStatesExample {}`;

  protected async copyWithHelper(): Promise<void> {
    const result = await copyTextToClipboard('REF-7842');
    this.helperResult.set(result === 'copied' ? 'Copied REF-7842.' : 'Copy failed.');
  }
}
