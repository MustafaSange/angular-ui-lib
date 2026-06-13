import { Component, computed, signal } from '@angular/core';
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
import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from '../../shared/ui-lib/components/signal-form-field';

type SignalFormExample = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-signal-form-field',
  imports: [RouterLink, FormField, SignalFormField, SignalFormHint, SignalFormError, ShowcaseCode],
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
      required(path.email, { message: 'Email is required.' });
      email(path.email, { message: 'Enter a valid email address.' });
      required(path.username, { message: 'Username is required.' });
      minLength(path.username, 3, { message: 'Use at least 3 characters.' });
      pattern(path.username, /^[a-z0-9_]+$/i, {
        message: 'Use only letters, numbers, or underscores.',
      });
    }),
  );

  protected readonly emailField = this.signalForm.email;
  protected readonly usernameField = this.signalForm.username;
  protected readonly emailError = computed(() => this.emailField().errors()[0]?.message ?? '');
  protected readonly usernameError = computed(
    () => this.usernameField().errors()[0]?.message ?? '',
  );

  protected readonly snippet = `import { Component, computed, signal } from '@angular/core';
import { FormField, email, form, minLength, pattern, required, schema } from '@angular/forms/signals';

import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from './shared/ui-lib';

type EmailForm = {
  email: string;
  username: string;
};

@Component({
  selector: 'app-profile-form-fields-example',
  imports: [FormField, SignalFormField, SignalFormHint, SignalFormError],
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
      <ms-error>{{ emailError() }}</ms-error>
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
      <ms-error>{{ usernameError() }}</ms-error>
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
      required(path.email, { message: 'Email is required.' });
      email(path.email, { message: 'Enter a valid email address.' });
      required(path.username, { message: 'Username is required.' });
      minLength(path.username, 3, { message: 'Use at least 3 characters.' });
      pattern(path.username, /^[a-z0-9_]+$/i, {
        message: 'Use only letters, numbers, or underscores.',
      });
    }),
  );

  protected readonly emailField = this.form.email;
  protected readonly usernameField = this.form.username;
  protected readonly emailError = computed(() => this.emailField().errors()[0]?.message ?? '');
  protected readonly usernameError = computed(() => this.usernameField().errors()[0]?.message ?? '');
}`;
}
