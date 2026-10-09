import { Component, computed, input } from '@angular/core';
import type { ReadonlyFieldState, ValidationError } from '@angular/forms/signals';

import { HorizontalSignalFormField, SignalFormError } from '../signal-form-field';
import type { SearchQueryFormLayout } from './search-query-form-types';

/** Internal adapter keeps projected controls and their content queries in one view. */
@Component({
  selector: 'ms-search-query-field',
  imports: [SignalFormError],
  templateUrl: '../signal-form-field/signal-form-field.html',
  host: {
    class: 'form-field',
    '[class.is-horizontal]': "layout() === 'horizontal'",
  },
})
export class SearchQueryField extends HorizontalSignalFormField {
  readonly layout = input<SearchQueryFormLayout>('vertical');
  readonly validationState = input<ReadonlyFieldState<unknown> | null>(null);
  readonly required = input<boolean | null>(null);

  protected override readonly isRequired = computed(
    () => this.required() ?? Boolean(this.getFieldState()?.required()),
  );

  protected override getFieldState(): ReadonlyFieldState<unknown> | undefined {
    return this.validationState() ?? super.getFieldState();
  }

  protected override getFieldErrors(): readonly ValidationError[] {
    return this.validationState()?.errors() ?? super.getFieldErrors();
  }
}
