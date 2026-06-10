import { Component, signal } from '@angular/core';
import { FormField, form, min, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type PrefixFieldForm = {
  price: number | null;
};

@Component({
  selector: 'app-prefix-field-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './prefix-field.html',
  styleUrl: './prefix-field.scss',
  host: { class: 'showcase-pair' },
})
export class PrefixFieldShowcase {
  private readonly model = signal<PrefixFieldForm>({
    price: null,
  });

  protected readonly form = form(
    this.model,
    schema<PrefixFieldForm>((path) => {
      min(path.price, 0);
    }),
  );

  protected readonly priceField = this.form.price;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, min, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type PricingForm = {
  price: number | null;
};

@Component({
  selector: 'app-prefix-field-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="price">Price</label>
      <span class="form-field-prefix" aria-hidden="true">$</span>
      <input id="price" type="number" placeholder="0.00" [formField]="priceField" />
    </ms-signal-form-field>
  \`,
})
export class PrefixFieldExample {
  private readonly model = signal<PricingForm>({
    price: null,
  });

  protected readonly form = form(
    this.model,
    schema<PricingForm>((path) => {
      min(path.price, 0);
    }),
  );

  protected readonly priceField = this.form.price;
}`;
}
