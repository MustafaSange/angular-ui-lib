import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-required-email-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './required-email-field.html',
  styleUrl: './required-email-field.scss',
  host: { class: 'showcase-pair' },
})
export class RequiredEmailFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-required-email-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="email">Email address</label>
      <input id="email" type="email" placeholder="ada@example.com" required />
    </ms-signal-form-field>
  \`,
})
export class RequiredEmailFieldExample {}`;
}
