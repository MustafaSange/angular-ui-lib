import { Component, computed, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type FieldActionsForm = {
  password: string;
};

@Component({
  selector: 'app-field-actions-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './field-actions.html',
  styleUrl: './field-actions.scss',
  host: { class: 'showcase-pair' },
})
export class FieldActionsShowcase {
  private readonly model = signal<FieldActionsForm>({
    password: 'lovelace',
  });

  protected readonly form = form(
    this.model,
    schema<FieldActionsForm>((path) => {
      required(path.password);
    }),
  );

  protected readonly passwordField = this.form.password;
  protected readonly passwordVisible = signal(false);
  protected readonly passwordInputType = computed(() =>
    this.passwordVisible() ? 'text' : 'password',
  );

  protected readonly snippet = `import { Component, computed, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type SecurityForm = {
  password: string;
};

@Component({
  selector: 'app-field-actions-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="secret">Password</label>
      <button slot="label-action" type="button">Generate</button>
      <input id="secret" [type]="passwordInputType()" [formField]="passwordField" />
      <button
        class="form-field-suffix form-field-action"
        type="button"
        [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
        (click)="passwordVisible.update((visible) => !visible)"
      >
        {{ passwordVisible() ? 'Hide' : 'Show' }}
      </button>
    </ms-signal-form-field>
  \`,
})
export class FieldActionsExample {
  private readonly model = signal<SecurityForm>({
    password: 'lovelace',
  });

  protected readonly form = form(
    this.model,
    schema<SecurityForm>((path) => {
      required(path.password);
    }),
  );

  protected readonly passwordField = this.form.password;
  protected readonly passwordVisible = signal(false);
  protected readonly passwordInputType = computed(() => (this.passwordVisible() ? 'text' : 'password'));
}`;
}
