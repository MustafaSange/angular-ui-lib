import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import {
  SignalFormField,
  SignalFormHint,
} from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-field-with-hint-showcase',
  imports: [SignalFormField, SignalFormHint, ShowcaseCode],
  templateUrl: './field-with-hint.html',
  styleUrl: './field-with-hint.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldWithHintShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  SignalFormField,
  SignalFormHint,
} from './shared/ui-lib';

@Component({
  selector: 'app-field-with-hint-example',
  imports: [SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label for="username">Username</label>
      <input id="username" type="text" aria-describedby="username-hint" />
      <ms-hint id="username-hint">
        Use letters, numbers, or underscores.
        <span slot="hint-extra">3 min</span>
      </ms-hint>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldWithHintExample {}`;
}
