import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-select-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
  host: { class: 'showcase-pair' },
})
export class SelectFieldShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-select-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="role">Role</label>
      <select id="role">
        <option>Designer</option>
        <option>Developer</option>
        <option>Product manager</option>
      </select>
    </ms-signal-form-field>
  \`,
})
export class SelectFieldExample {}`;
}
