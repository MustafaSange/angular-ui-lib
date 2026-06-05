import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-field-actions-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './field-actions.html',
  styleUrl: './field-actions.scss',
  host: { class: 'showcase-pair' },
})
export class FieldActionsShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-field-actions-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="secret">Password</label>
      <button slot="label-action" type="button">Generate</button>
      <input id="secret" type="password" value="lovelace" />
      <button
        class="form-field-suffix form-field-action"
        type="button"
        aria-label="Show password"
      >
        Show
      </button>
    </ms-signal-form-field>
  \`,
})
export class FieldActionsExample {}`;
}
