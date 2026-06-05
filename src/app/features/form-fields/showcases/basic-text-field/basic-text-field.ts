import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-basic-text-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './basic-text-field.html',
  styleUrl: './basic-text-field.scss',
  host: { class: 'showcase-pair' },
})
export class BasicTextFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-basic-text-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="full-name">Full name</label>
      <input id="full-name" type="text" placeholder="Ada Lovelace" />
    </ms-signal-form-field>
  \`,
})
export class BasicTextFieldExample {}`;
}
