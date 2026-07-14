import { Component, signal } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';
import {
  SignalFormField,
  SignalFormHint,
  SignalReadonlyValue,
} from '../../../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-display-values-showcase',
  imports: [SignalFormField, SignalFormHint, SignalReadonlyValue, ShowcaseCode],
  templateUrl: './display-values.html',
  styleUrl: './display-values.scss',
  host: { class: 'showcase-pair' },
})
export class DisplayValuesShowcase {
  protected readonly displayName = signal('Ada Lovelace');
  protected readonly accountId = signal('ACCT-2048');
  protected readonly archivedStatus = signal('Archived');
  protected readonly permissions = signal(
    'Administrator · Billing manager · User provisioning · Audit log reviewer · Support escalation',
  );

  protected readonly snippet = `import { Component, signal } from '@angular/core';

import { SignalFormField, SignalFormHint, SignalReadonlyValue } from './shared/ui-lib';

@Component({
  selector: 'app-display-values-example',
  imports: [SignalFormField, SignalFormHint, SignalReadonlyValue],
  template: \`
    <ms-signal-form-field>
      <label>Display name</label>
      <ms-readonly-value [value]="displayName()" />
      <ms-hint>Display values can use the default field treatment.</ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label>Account ID</label>
      <ms-readonly-value [value]="accountId()" readonly />
      <ms-hint>This value is displayed with the readonly field treatment.</ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label>Status</label>
      <ms-readonly-value [value]="archivedStatus()" disabled />
      <ms-hint>Disabled display values use the same disabled treatment as inputs.</ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label>Permissions</label>
      <ms-readonly-value
        [value]="permissions()"
        overflowNavigation
        [overflowScrollRatio]="0.6"
      />
      <ms-hint>Overflow navigation keeps long values on one compact line.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class DisplayValuesExample {
  protected readonly displayName = signal('Ada Lovelace');
  protected readonly accountId = signal('ACCT-2048');
  protected readonly archivedStatus = signal('Archived');
  protected readonly permissions = signal(
    'Administrator · Billing manager · User provisioning · Audit log reviewer · Support escalation',
  );
}`;
}
