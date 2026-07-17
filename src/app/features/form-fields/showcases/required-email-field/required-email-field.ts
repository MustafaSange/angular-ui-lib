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

import { ShowcaseCode } from '../../../../shared/showcase-code';
import {
  SignalFormField,
  SignalFormHint,
} from '../../../../shared/ui-lib/components/signal-form-field';

type ValidationFieldsForm = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-required-email-field-showcase',
  imports: [FormField, SignalFormField, SignalFormHint, ShowcaseCode],
  templateUrl: './required-email-field.html',
  styleUrl: './required-email-field.scss',
  host: { class: 'showcase-pair' },
})
export class RequiredEmailFieldShowcase {
  private readonly model = signal<ValidationFieldsForm>({
    email: '',
    username: '',
  });

  protected readonly form = form(
    this.model,
    schema<ValidationFieldsForm>((path) => {
      required(path.email);
      email(path.email);
      required(path.username);
      minLength(path.username, 3);
      pattern(path.username, /^[a-z0-9_]+$/i);
    }),
  );

  protected readonly emailField = this.form.email;
  protected readonly usernameField = this.form.username;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, pattern, required, schema } from '@angular/forms/signals';

import { SignalFormField, SignalFormHint } from './shared/ui-lib';

type ProfileForm = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-validation-fields-example',
  imports: [FormField, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label for="email">Email Address</label>
      <input
        id="email"
        type="email"
        placeholder="ada@example.com"
        [formField]="emailField"
      />
      <ms-hint>Blur the empty field to show the required error.</ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="ada_lovelace"
        [formField]="usernameField"
      />
      <ms-hint>Letters, numbers, or underscores. Minimum 3 characters.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class ValidationFieldsExample {
  private readonly model = signal<ProfileForm>({
    email: '',
    username: '',
  });

  protected readonly form = form(
    this.model,
    schema<ProfileForm>((path) => {
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
