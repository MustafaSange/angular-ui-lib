import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';
import { SignalFormField } from '../../../../shared/components/signal-form-field';

@Component({
  selector: 'app-segmented-suffix-action-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './segmented-suffix-action.html',
  styleUrl: './segmented-suffix-action.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedSuffixActionShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-segmented-suffix-action-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="domain">Domain</label>
      <input id="domain" type="text" placeholder="analytical-engines" />
      <button class="form-field-suffix form-field-action is-segmented" type="button">.com</button>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedSuffixActionExample {}`;
}
