import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

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
}
