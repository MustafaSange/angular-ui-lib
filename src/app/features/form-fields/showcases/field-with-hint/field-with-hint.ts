import { Component, signal } from '@angular/core';
import { FormField, form, minLength, pattern, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/showcase-code';
import {
  SignalFormField,
  SignalFormHint,
} from '../../../../shared/ui-lib/components/signal-form-field';

type FieldWithHintForm = {
  username: string;
};

@Component({
  selector: 'app-field-with-hint-showcase',
  imports: [FormField, SignalFormField, SignalFormHint, ShowcaseCode],
  templateUrl: './field-with-hint.html',
  styleUrl: './field-with-hint.scss',
  host: { class: 'showcase-pair' },
})
export class FieldWithHintShowcase {
  private readonly model = signal<FieldWithHintForm>({
    username: '',
  });

  protected readonly form = form(
    this.model,
    schema<FieldWithHintForm>((path) => {
      minLength(path.username, 3);
      pattern(path.username, /^[a-z0-9_]+$/i);
    }),
  );

  protected readonly usernameField = this.form.username;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, minLength, pattern, schema } from '@angular/forms/signals';

import {
  SignalFormField,
  SignalFormHint,
} from './shared/ui-lib';

type AccountForm = {
  username: string;
};

@Component({
  selector: 'app-field-with-hint-example',
  imports: [FormField, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label for="username">Username</label>
      <input id="username" type="text" [formField]="usernameField" aria-describedby="username-hint" />
      <ms-hint id="username-hint">
        Use letters, numbers, or underscores.
        <span slot="hint-extra">3 min</span>
      </ms-hint>
    </ms-signal-form-field>
  \`,
})
export class FieldWithHintExample {
  private readonly model = signal<AccountForm>({
    username: '',
  });

  protected readonly form = form(
    this.model,
    schema<AccountForm>((path) => {
      minLength(path.username, 3);
      pattern(path.username, /^[a-z0-9_]+$/i);
    }),
  );

  protected readonly usernameField = this.form.username;
}`;
}
