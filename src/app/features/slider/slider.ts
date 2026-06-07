import { Component, signal } from '@angular/core';
import { FormField, form, max, min, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField, SignalFormHint } from '../../shared/ui-lib/components/signal-form-field';
import { SliderComponent } from '../../shared/ui-lib/components/slider';

@Component({
  selector: 'app-slider',
  imports: [RouterLink, FormField, ShowcaseCode, SignalFormField, SignalFormHint, SliderComponent],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider {
  private readonly sliderFormModel = signal({
    budget: 2500,
  });

  protected readonly sliderForm = form(
    this.sliderFormModel,
    schema<{ budget: number }>((path) => {
      min(path.budget, 500);
      max(path.budget, 5000);
    }),
  );

  protected readonly budgetField = this.sliderForm.budget;
  protected readonly volume = signal(65);
  protected readonly quality = signal(8);
  protected readonly rtlValue = signal(70);

  protected readonly basicSnippet = `import { Component, signal } from '@angular/core';

import { SliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-basic-slider-example', imports: [SliderComponent], template: \`
    <ms-slider
      [(value)]="volume"
      min="0"
      max="100"
      step="5"
      aria-label="Volume"
      showValue
    />
  \`, })
export class BasicSliderExample {
  protected readonly volume = signal(65);
}`;

  protected readonly rangeSnippet = `import { Component, signal } from '@angular/core';

import { SliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-configured-slider-example', imports: [SliderComponent], template: \`
    <ms-slider
      [(value)]="quality"
      min="1"
      max="10"
      step="1"
      aria-label="Render quality"
      showValue
    />
  \`, })
export class ConfiguredSliderExample {
  protected readonly quality = signal(8);
}`;

  protected readonly disabledSnippet = `import { Component } from '@angular/core';

import { SliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-slider-example', imports: [SliderComponent], template: \`
    <ms-slider [value]="40" aria-label="Storage used" disabled showValue />
  \`, })
export class DisabledSliderExample {}`;

  protected readonly signalFormFieldSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, max, min, schema } from '@angular/forms/signals';

import { SignalFormField, SignalFormHint, SliderComponent } from './shared/ui-lib';

type BudgetForm = {
  budget: number;
};

@Component({
  selector: 'app-form-field-slider-example', imports: [FormField, SignalFormField, SignalFormHint, SliderComponent], template: \`
    <ms-signal-form-field>
      <label id="budget-label">Monthly budget</label>

      <ms-slider
        [formField]="budgetField"
        step="250"
        aria-labelledby="budget-label"
        showValue
      />

      <ms-hint>Choose a budget range for the campaign.</ms-hint>
    </ms-signal-form-field>
  \`, })
export class FormFieldSliderExample {
  private readonly model = signal<BudgetForm>({
    budget: 2500, });

  protected readonly form = form(
    this.model, schema<BudgetForm>((path) => {
      min(path.budget, 500);
      max(path.budget, 5000);
    }), );

  protected readonly budgetField = this.form.budget;
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import { SliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-slider-example',
  imports: [SliderComponent],
  template: \`
    <div dir="rtl">
      <ms-slider
        [(value)]="priority"
        min="0"
        max="100"
        step="10"
        aria-label="RTL priority"
        showValue
      />
    </div>
  \`,
})
export class RtlSliderExample {
  protected readonly priority = signal(70);
}`;
}
