import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import {
  SignalFormError,
  SignalFormField,
  SignalFormHint,
} from '../../shared/components/signal-form-field';

type SignalFormExample = {
  email: string;
  requiredEmail: string;
};

@Component({
  selector: 'app-form-fields',
  imports: [RouterLink, FormField, SignalFormField, SignalFormHint, SignalFormError],
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
}
