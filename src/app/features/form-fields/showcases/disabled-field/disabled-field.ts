import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-disabled-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './disabled-field.html',
  styleUrl: './disabled-field.scss',
  host: { class: 'showcase-pair' },
})
export class DisabledFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="company">Company</label>
      <input id="company" type="text" value="Analytical Engines" disabled />
    </ms-signal-form-field>
  \`,
})
export class DisabledFieldExample {}`;
}
