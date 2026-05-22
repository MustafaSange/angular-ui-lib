import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
  RadioControl,
  RadioGroup,
  SwitchControl,
  SwitchGroup,
} from '../../shared/components/choice-controls';
import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from '../../shared/components/signal-form-field';
import { ShowcaseCode } from '../../shared/components/showcase-code';

type SignalFormExample = {
  email: string;
  requiredEmail: string;
};

@Component({
  selector: 'app-form-fields',
  imports: [
    RouterLink,
    FormField,
    SignalFormField,
    SignalFormHint,
    SignalFormError,
    ShowcaseCode,
    CheckboxGroup,
    CheckboxControl,
    RadioGroup,
    RadioControl,
    SwitchGroup,
    SwitchControl,
    ChoiceHint,
    ChoiceError,
  ],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFields {
  private readonly signalFormModel = signal<SignalFormExample>({
    email: 'ada@example.com',
    requiredEmail: '',
  });

  protected readonly signalForm = form(
    this.signalFormModel,
    schema<SignalFormExample>((path) => {
      required(path.email, { message: 'Email is required.' });
      required(path.requiredEmail, { message: 'This field is required.' });
    }),
  );

  protected readonly emailField = this.signalForm.email;
  protected readonly requiredEmailField = this.signalForm.requiredEmail;

  protected readonly snippets = [
    {
      label: 'Basic text field',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-basic-text-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="full-name">Full name</label>
      <input id="full-name" type="text" placeholder="Ada Lovelace" />
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTextFieldExample {}`,
    },
    {
      label: 'Signal form field',
      code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from './shared/components/signal-form-field';

type EmailForm = {
  email: string;
};

@Component({
  selector: 'app-signal-form-field-example',
  imports: [FormField, SignalFormField, SignalFormHint, SignalFormError],
  template: \`
    <ms-signal-form-field>
      <label for="email">Email address</label>
      <input id="email" type="email" [formField]="emailField" />

      <ms-hint>
        Enter your email.
        <span slot="hint-extra">Required</span>
      </ms-hint>
      <ms-error>
        This field is required.
        <span slot="error-extra">Required</span>
      </ms-error>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormFieldExample {
  private readonly model = signal<EmailForm>({
    email: '',
  });

  protected readonly form = form(
    this.model,
    schema<EmailForm>((path) => {
      required(path.email, { message: 'Email is required.' });
    }),
  );

  protected readonly emailField = this.form.email;
}`,
    },
    {
      label: 'Textarea with label extra',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-textarea-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="bio">Bio</label>
      <span slot="label-extra">0 / 280</span>
      <textarea id="bio" placeholder="Tell us a little about yourself"></textarea>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldExample {}`,
    },
    {
      label: 'Prefix and suffix',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-prefix-suffix-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="price">Price</label>
      <span class="form-field-prefix" aria-hidden="true">$</span>
      <input id="price" type="text" placeholder="0.00" />
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="weight">Weight</label>
      <input id="weight" type="text" placeholder="12" />
      <span class="form-field-suffix" aria-hidden="true">kg</span>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefixSuffixFieldExample {}`,
    },
    {
      label: 'Field actions',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldActionsExample {}`,
    },
    {
      label: 'Readonly and disabled',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-readonly-disabled-fields-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="company">Company</label>
      <input id="company" type="text" value="Analytical Engines" disabled />
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="account-id">Account ID</label>
      <input id="account-id" type="text" value="ACC-1843" readonly />
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadonlyDisabledFieldsExample {}`,
    },
  ];

  protected readonly selectionSnippets = [
    {
      label: 'Checkbox group',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
} from './shared/components/choice-controls';

@Component({
  selector: 'app-checkbox-group-example',
  imports: [CheckboxGroup, CheckboxControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-checkbox-group>
      <legend>Notifications</legend>

      <ms-checkbox-control>
        <input type="checkbox" checked />
        <label>Email updates</label>
        <ms-choice-hint>Send product and release notes.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Weekly digest</label>
        <ms-choice-hint>Group activity into one summary.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" disabled />
        <label>Billing alerts</label>
        <ms-choice-hint>Managed by account owners.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Terms agreement</label>
        <ms-choice-error>Accept the terms before continuing.</ms-choice-error>
      </ms-checkbox-control>

      <ms-checkbox-control slot="label-before">
        <input type="checkbox" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the checkbox.</ms-choice-hint>
      </ms-checkbox-control>
    </ms-checkbox-group>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupExample {}`,
    },
    {
      label: 'Radio group',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  RadioControl,
  RadioGroup,
} from './shared/components/choice-controls';

@Component({
  selector: 'app-radio-group-example',
  imports: [RadioGroup, RadioControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-radio-group>
      <legend>Support plan</legend>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="starter" />
        <label>Starter</label>
        <ms-choice-hint>For small teams getting set up.</ms-choice-hint>
      </ms-radio-control>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="growth" checked />
        <label>Growth</label>
        <ms-choice-hint>Priority support for active teams.</ms-choice-hint>
      </ms-radio-control>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="enterprise" disabled />
        <label>Enterprise</label>
        <ms-choice-error>Contact sales to enable this plan.</ms-choice-error>
      </ms-radio-control>

      <ms-radio-control slot="label-before">
        <input type="radio" name="support-plan" value="custom" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the radio.</ms-choice-hint>
      </ms-radio-control>
    </ms-radio-group>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupExample {}`,
    },
    {
      label: 'Switch controls',
      code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from './shared/components/choice-controls';

@Component({
  selector: 'app-switch-controls-example',
  imports: [SwitchGroup, SwitchControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-switch-group>
      <legend>Preferences</legend>

      <ms-switch-control>
        <input type="checkbox" role="switch" checked />
        <label>Notifications</label>
        <ms-choice-hint>Push critical alerts immediately.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" />
        <label>Compact mode</label>
        <ms-choice-hint>Reduce spacing in dense views.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" disabled />
        <label>Audit logging</label>
        <ms-choice-hint>Available on enterprise plans.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" />
        <label>Public profile</label>
        <ms-choice-error>Review visibility settings before enabling.</ms-choice-error>
      </ms-switch-control>

      <ms-switch-control slot="label-before">
        <input type="checkbox" role="switch" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the switch.</ms-choice-hint>
      </ms-switch-control>
    </ms-switch-group>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchControlsExample {}`,
    },
  ];
}
