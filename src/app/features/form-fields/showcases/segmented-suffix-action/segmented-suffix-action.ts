import { Component, computed, signal } from '@angular/core';
import { FormField, form, pattern, required, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type SegmentedSuffixActionForm = {
  domain: string;
};

@Component({
  selector: 'app-segmented-suffix-action-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './segmented-suffix-action.html',
  styleUrl: './segmented-suffix-action.scss',
  host: { class: 'showcase-pair' },
})
export class SegmentedSuffixActionShowcase {
  private readonly model = signal<SegmentedSuffixActionForm>({
    domain: '',
  });

  protected readonly form = form(
    this.model,
    schema<SegmentedSuffixActionForm>((path) => {
      required(path.domain);
      pattern(path.domain, /^[a-z0-9-]+$/i);
    }),
  );

  protected readonly domainField = this.form.domain;
  protected readonly suffix = computed(() => '.com');

  protected readonly snippet = `import { Component, computed, signal } from '@angular/core';
import { FormField, form, pattern, required, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type DomainForm = {
  domain: string;
};

@Component({
  selector: 'app-segmented-suffix-action-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="domain">Domain</label>
      <input id="domain" type="text" placeholder="analytical-engines" [formField]="domainField" />
      <button class="form-field-suffix form-field-action is-segmented" type="button">
        {{ suffix() }}
      </button>
    </ms-signal-form-field>
  \`,
})
export class SegmentedSuffixActionExample {
  private readonly model = signal<DomainForm>({
    domain: '',
  });

  protected readonly form = form(
    this.model,
    schema<DomainForm>((path) => {
      required(path.domain);
      pattern(path.domain, /^[a-z0-9-]+$/i);
    }),
  );

  protected readonly domainField = this.form.domain;
  protected readonly suffix = computed(() => '.com');
}`;
}
