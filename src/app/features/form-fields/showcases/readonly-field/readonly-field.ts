import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-readonly-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './readonly-field.html',
  styleUrl: './readonly-field.scss',
  host: { class: 'showcase-pair' },
})
export class ReadonlyFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-readonly-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="account-id">Account ID</label>
      <input id="account-id" type="text" value="ACC-1843" readonly />
    </ms-signal-form-field>
  \`,
})
export class ReadonlyFieldExample {}`;
}
