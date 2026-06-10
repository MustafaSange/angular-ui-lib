import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type SearchFieldForm = {
  query: string;
};

@Component({
  selector: 'app-search-field-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
  host: { class: 'showcase-pair' },
})
export class SearchFieldShowcase {
  private readonly model = signal<SearchFieldForm>({
    query: '',
  });

  protected readonly form = form(
    this.model,
    schema<SearchFieldForm>(() => {}),
  );
  protected readonly queryField = this.form.query;

  protected readonly snippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type SearchForm = {
  query: string;
};

@Component({
  selector: 'app-search-field-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="search">Search</label>
      <span class="form-field-prefix" aria-hidden="true">
        <span class="ms-icon">search</span>
      </span>
      <input id="search" type="search" placeholder="Search projects" [formField]="queryField" />
    </ms-signal-form-field>
  \`,
})
export class SearchFieldExample {
  private readonly model = signal<SearchForm>({
    query: '',
  });

  protected readonly form = form(this.model, schema<SearchForm>(() => {}));
  protected readonly queryField = this.form.query;
}`;
}
