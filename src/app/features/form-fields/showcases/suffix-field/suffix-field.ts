import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';
import { SignalFormField } from '../../../../shared/components/signal-form-field';

@Component({
  selector: 'app-suffix-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './suffix-field.html',
  styleUrl: './suffix-field.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuffixFieldShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-suffix-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="weight">Weight</label>
      <input id="weight" type="text" placeholder="12" />
      <span class="form-field-suffix" aria-hidden="true">kg</span>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuffixFieldExample {}`;
}
