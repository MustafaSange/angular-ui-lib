import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-prefix-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './prefix-field.html',
  styleUrl: './prefix-field.scss',
  host: { class: 'showcase-pair' },
})
export class PrefixFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-prefix-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="price">Price</label>
      <span class="form-field-prefix" aria-hidden="true">$</span>
      <input id="price" type="text" placeholder="0.00" />
    </ms-signal-form-field>
  \`,
})
export class PrefixFieldExample {}`;
}
