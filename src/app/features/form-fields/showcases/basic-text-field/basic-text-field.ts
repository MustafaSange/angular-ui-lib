import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type BasicTextFieldForm = {
  fullName: string;
};

@Component({
  selector: 'app-basic-text-field-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './basic-text-field.html',
  styleUrl: './basic-text-field.scss',
  host: { class: 'showcase-pair' },
})
export class BasicTextFieldShowcase {
  private readonly model = signal<BasicTextFieldForm>({
    fullName: '',
  });

  protected readonly form = form(
    this.model,
    schema<BasicTextFieldForm>(() => {}),
  );
  protected readonly fullNameField = this.form.fullName;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type ProfileForm = {
  fullName: string;
};

@Component({
  selector: 'app-basic-text-field-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="full-name">Full Name</label>
      <input id="full-name" type="text" placeholder="Ada Lovelace" [formField]="fullNameField" />
    </ms-signal-form-field>
  \`,
})
export class BasicTextFieldExample {
  private readonly model = signal<ProfileForm>({
    fullName: '',
  });

  protected readonly form = form(this.model, schema<ProfileForm>(() => {}));
  protected readonly fullNameField = this.form.fullName;
}`;
}
