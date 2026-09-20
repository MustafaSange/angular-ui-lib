import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, schema } from '@angular/forms/signals';
import { ShowcaseCode } from '../../../../shared/showcase-code';
import {
  AutocompleteComponent,
  HorizontalSignalFormField,
  SignalFormError,
  SignalFormHint,
} from '../../../../shared/ui-lib';

@Component({
  selector: 'app-horizontal-field-showcase',
  imports: [
    FormField,
    AutocompleteComponent,
    HorizontalSignalFormField,
    SignalFormHint,
    SignalFormError,
    ShowcaseCode,
  ],
  templateUrl: './horizontal-field.html',
  styleUrl: './horizontal-field.scss',
  host: { class: 'showcase-pair' },
})
export class HorizontalFieldShowcase {
  private readonly profileModel = signal({ company: 'Analytical Engines', email: '', notes: '' });
  protected readonly profile = form(
    this.profileModel,
    schema<{ company: string; email: string; notes: string }>((path) => {
      required(path.company);
      required(path.email);
      email(path.email);
    }),
  );

  protected readonly profileSnippet = `import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, schema } from '@angular/forms/signals';

import { HorizontalSignalFormField, SignalFormHint } from './shared/ui-lib';

@Component({
  selector: 'app-horizontal-profile-example',
  imports: [FormField, HorizontalSignalFormField, SignalFormHint],
  template: \`
    <ms-horizontal-signal-form-field>
      <label for="horizontal-company">Company Name</label>
      <input id="horizontal-company" type="text" [formField]="profile.company" />
      <ms-hint>Enter the registered company name.</ms-hint>
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field>
      <label for="horizontal-email">Work Email</label>
      <input id="horizontal-email" type="email" [formField]="profile.email" />
      <ms-hint>Blur the empty field or enter an invalid email to see the hint replaced.</ms-hint>
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field>
      <label for="horizontal-notes">Notes</label>
      <textarea id="horizontal-notes" [formField]="profile.notes"></textarea>
      <ms-hint>Add any details that help your team.</ms-hint>
    </ms-horizontal-signal-form-field>
  \`,
  styles: [\`:host { display: grid; gap: var(--spacing-16); }\`],
})
export class HorizontalProfileExample {
  private readonly profileModel = signal({ company: 'Analytical Engines', email: '', notes: '' });
  protected readonly profile = form(this.profileModel, schema<{ company: string; email: string; notes: string }>((path) => {
    required(path.company);
    required(path.email);
    email(path.email);
  }));
}`;

  private readonly choicesModel = signal<{ department: string; city: string | string[] | null }>({
    department: 'engineering',
    city: null,
  });
  protected readonly choices = form(this.choicesModel);
  protected readonly cities = [
    { value: 'doha', label: 'Doha' },
    { value: 'london', label: 'London' },
    { value: 'singapore', label: 'Singapore' },
  ];

  protected readonly choicesSnippet = `import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, schema } from '@angular/forms/signals';

import { HorizontalSignalFormField, SignalFormHint, AutocompleteComponent } from './shared/ui-lib';

@Component({
  selector: 'app-horizontal-choices-example',
  imports: [FormField, HorizontalSignalFormField, SignalFormHint, AutocompleteComponent],
  template: \`
    <ms-horizontal-signal-form-field>
      <label for="horizontal-department">Department</label>
      <select id="horizontal-department" [formField]="choices.department">
        <option value="engineering">Engineering</option>
        <option value="operations">Operations</option>
      </select>
      <ms-hint>Choose the department responsible for this account.</ms-hint>
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field>
      <label for="horizontal-city">Office City</label>
      <ms-autocomplete id="horizontal-city" [options]="cities" [formField]="choices.city" placeholder="Choose a city" />
      <ms-hint>Search for an office city.</ms-hint>
    </ms-horizontal-signal-form-field>
  \`,
  styles: [\`:host { display: grid; gap: var(--spacing-16); }\`],
})
export class HorizontalChoicesExample {
  private readonly choicesModel = signal<{ department: string; city: string | string[] | null }>({ department: 'engineering', city: null });
  protected readonly choices = form(this.choicesModel);
  protected readonly cities = [
    { value: 'doha', label: 'Doha' },
    { value: 'london', label: 'London' },
    { value: 'singapore', label: 'Singapore' },
  ];
}`;

  private readonly referenceModel = signal({ code: '' });
  protected readonly reference = form(
    this.referenceModel,
    schema<{ code: string }>((path) => {
      required(path.code);
      minLength(path.code, 3);
    }),
  );

  protected readonly statesSnippet = `import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, schema } from '@angular/forms/signals';

import { HorizontalSignalFormField, SignalFormHint, SignalFormError } from './shared/ui-lib';

@Component({
  selector: 'app-horizontal-states-example',
  imports: [FormField, HorizontalSignalFormField, SignalFormHint, SignalFormError],
  template: \`
    <ms-horizontal-signal-form-field>
      <label for="horizontal-code">Account Code</label>
      <input id="horizontal-code" type="text" value="AC-1042" readonly />
      <ms-hint>This value is managed by your organization.</ms-hint>
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field>
      <label for="horizontal-status">Status</label>
      <input id="horizontal-status" type="text" value="Pending Approval" disabled />
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field>
      <label for="horizontal-reference">External Reference</label>
      <span class="form-field-prefix">REF</span>
      <input id="horizontal-reference" type="text" [formField]="reference.code" />
      <ms-hint>Enter at least three characters.</ms-hint>
      <ms-error>The external reference must contain at least three characters.</ms-error>
    </ms-horizontal-signal-form-field>
    <ms-horizontal-signal-form-field class="no-label">
      <input type="text" aria-label="Internal reference" value="INT-2048" readonly />
      <ms-hint>A field without a visible label uses the full width.</ms-hint>
    </ms-horizontal-signal-form-field>
  \`,
  styles: [\`:host { display: grid; gap: var(--spacing-16); }\`],
})
export class HorizontalStatesExample {
  private readonly referenceModel = signal({ code: '' });
  protected readonly reference = form(this.referenceModel, schema<{ code: string }>((path) => {
    required(path.code);
    minLength(path.code, 3);
  }));
}`;
}
