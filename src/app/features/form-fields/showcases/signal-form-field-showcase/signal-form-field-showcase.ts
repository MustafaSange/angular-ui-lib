import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';
import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from '../../../../shared/components/signal-form-field';

type SignalFormExample = {
  email: string;
  requiredEmail: string;
};

@Component({
  selector: 'app-signal-form-field-showcase',
  imports: [FormField, SignalFormField, SignalFormHint, SignalFormError, ShowcaseCode],
  templateUrl: './signal-form-field-showcase.html',
  styleUrl: './signal-form-field-showcase.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormFieldShowcase {
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

  protected readonly snippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
}`;
}
