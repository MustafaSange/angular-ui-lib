import { Component, signal } from '@angular/core';
import { FormField, form, min, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type SuffixFieldForm = {
  weight: number | null;
};

@Component({
  selector: 'app-suffix-field-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './suffix-field.html',
  styleUrl: './suffix-field.scss',
  host: { class: 'showcase-pair' },
})
export class SuffixFieldShowcase {
  private readonly model = signal<SuffixFieldForm>({
    weight: null,
  });

  protected readonly form = form(
    this.model,
    schema<SuffixFieldForm>((path) => {
      min(path.weight, 0);
    }),
  );

  protected readonly weightField = this.form.weight;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, min, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type PackageForm = {
  weight: number | null;
};

@Component({
  selector: 'app-suffix-field-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="weight">Weight</label>
      <input id="weight" type="number" placeholder="12" [formField]="weightField" />
      <span class="form-field-suffix" aria-hidden="true">kg</span>
    </ms-signal-form-field>
  \`,
})
export class SuffixFieldExample {
  private readonly model = signal<PackageForm>({
    weight: null,
  });

  protected readonly form = form(
    this.model,
    schema<PackageForm>((path) => {
      min(path.weight, 0);
    }),
  );

  protected readonly weightField = this.form.weight;
}`;
}
