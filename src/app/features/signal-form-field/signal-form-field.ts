import { Component, signal } from '@angular/core';
import {
  FormField,
  email,
  form,
  minLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField, SignalFormHint } from '../../shared/ui-lib/components/signal-form-field';

type SignalFormExample = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-signal-form-field',
  imports: [RouterLink, FormField, SignalFormField, SignalFormHint, ShowcaseCode],
  templateUrl: './signal-form-field.html',
  styleUrl: './signal-form-field.scss',
})
export class SignalFormFieldPage {
  private readonly signalFormModel = signal<SignalFormExample>({
    email: '',
    username: '',
  });

  protected readonly signalForm = form(
    this.signalFormModel,
    schema<SignalFormExample>((path) => {
      required(path.email);
      email(path.email);
      required(path.username);
      minLength(path.username, 3);
      pattern(path.username, /^[a-z0-9_]+$/i);
    }),
  );

  protected readonly emailField = this.signalForm.email;
  protected readonly usernameField = this.signalForm.username;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, pattern, required, schema } from '@angular/forms/signals';

import { SignalFormField, SignalFormHint } from './shared/ui-lib';

type EmailForm = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-profile-form-fields-example',
  imports: [FormField, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label for="email">Email address</label>
      <input
        id="email"
        type="email"
        placeholder="ada@example.com"
        [formField]="emailField"
      />

      <ms-hint>
        Blur this field while it is empty to show the required error.
        <span slot="hint-extra">Required</span>
      </ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="ada_lovelace"
        [formField]="usernameField"
      />

      <ms-hint>Use letters, numbers, or underscores.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class ProfileFormFieldsExample {
  private readonly model = signal<EmailForm>({
    email: '',
    username: '',
  });

  protected readonly form = form(
    this.model,
    schema<EmailForm>((path) => {
      required(path.email);
      email(path.email);
      required(path.username);
      minLength(path.username, 3);
      pattern(path.username, /^[a-z0-9_]+$/i);
    }),
  );

  protected readonly emailField = this.form.email;
  protected readonly usernameField = this.form.username;
}`;
}
