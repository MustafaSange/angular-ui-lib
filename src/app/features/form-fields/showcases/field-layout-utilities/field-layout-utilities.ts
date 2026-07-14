import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/showcase-code';
import {
  SignalFormField,
  SignalFormHint,
} from '../../../../shared/ui-lib/components/signal-form-field';

type FieldLayoutUtilitiesForm = {
  compactSearch: string;
  referenceCode: string;
  quickFilter: string;
};

@Component({
  selector: 'app-field-layout-utilities-showcase',
  imports: [FormField, SignalFormField, SignalFormHint, ShowcaseCode],
  templateUrl: './field-layout-utilities.html',
  styleUrl: './field-layout-utilities.scss',
  host: { class: 'showcase-pair' },
})
export class FieldLayoutUtilitiesShowcase {
  private readonly model = signal<FieldLayoutUtilitiesForm>({
    compactSearch: '',
    referenceCode: '',
    quickFilter: '',
  });

  protected readonly form = form(
    this.model,
    schema<FieldLayoutUtilitiesForm>(() => {}),
  );

  protected readonly compactSearchField = this.form.compactSearch;
  protected readonly referenceCodeField = this.form.referenceCode;
  protected readonly quickFilterField = this.form.quickFilter;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import {
  SignalFormField,
  SignalFormHint,
} from './shared/ui-lib';

type CompactFieldsForm = {
  compactSearch: string;
  referenceCode: string;
  quickFilter: string;
};

@Component({
  selector: 'app-field-layout-utilities-example',
  imports: [FormField, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field class="no-label">
      <label for="compact-search">Compact search</label>
      <input
        id="compact-search"
        type="search"
        placeholder="Search"
        aria-label="Compact search"
        [formField]="compactSearchField"
      />
    </ms-signal-form-field>

    <ms-signal-form-field class="no-message">
      <label for="reference-code">Reference code</label>
      <input id="reference-code" type="text" placeholder="INV-1042" [formField]="referenceCodeField" />
      <ms-hint>Support text is projected but hidden by the no-message class.</ms-hint>
    </ms-signal-form-field>

    <ms-signal-form-field class="no-label no-message">
      <label for="quick-filter">Quick filter</label>
      <input
        id="quick-filter"
        type="text"
        placeholder="Filter"
        aria-label="Quick filter"
        [formField]="quickFilterField"
      />
      <ms-hint>Both label and message rows are hidden.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class FieldLayoutUtilitiesExample {
  private readonly model = signal<CompactFieldsForm>({
    compactSearch: '',
    referenceCode: '',
    quickFilter: '',
  });

  protected readonly form = form(this.model, schema<CompactFieldsForm>(() => {}));

  protected readonly compactSearchField = this.form.compactSearch;
  protected readonly referenceCodeField = this.form.referenceCode;
  protected readonly quickFilterField = this.form.quickFilter;
}`;
}
