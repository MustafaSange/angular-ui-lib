import { Component, computed, contentChild } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import type { ValidationError } from '@angular/forms/signals';

import { SignalFormError } from './signal-form-error/signal-form-error';
import { SignalFormHint } from './signal-form-hint/signal-form-hint';
import { SignalReadonlyValue } from './signal-readonly-value';

type ErrorWithLimit = ValidationError & {
  readonly max?: number;
  readonly maxLength?: number;
  readonly min?: number;
  readonly minLength?: number;
};

@Component({
  selector: 'ms-signal-form-field',
  imports: [SignalFormError],
  templateUrl: './signal-form-field.html',
  host: {
    '[class.is-error]': 'showError()',
    '[class.is-required]': 'isRequired()',
    '[class.is-readonly]': 'isReadonly()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.has-readonly-value]': 'hasReadonlyValue()',
  },
})
export class SignalFormField {
  private readonly field = contentChild<FormField<unknown>>(FormField);
  private readonly hint = contentChild(SignalFormHint);
  private readonly error = contentChild(SignalFormError);
  private readonly readonlyValue = contentChild(SignalReadonlyValue);

  protected readonly showError = computed(() => {
    const field = this.field();
    const state = field?.state();

    return Boolean(state?.invalid() && (state.touched() || state.dirty()) && this.errorMessage());
  });

  protected readonly showHint = computed(() => Boolean(this.hint() && !this.showError()));

  protected readonly isRequired = computed(() => Boolean(this.field()?.state().required()));

  protected readonly hasErrorContent = computed(() => Boolean(this.error()));

  protected readonly hasReadonlyValue = computed(() => Boolean(this.readonlyValue()));

  protected readonly isReadonly = computed(() => Boolean(this.readonlyValue()?.readonly()));

  protected readonly isDisabled = computed(() => Boolean(this.readonlyValue()?.disabled()));

  protected readonly errorMessage = computed(() => {
    const error = this.field()?.errors()[0];

    if (!error) {
      return '';
    }

    return error.message ?? this.getDefaultErrorMessage(error);
  });

  private getDefaultErrorMessage(error: ValidationError): string {
    const errorWithLimit = error as ErrorWithLimit;

    switch (error.kind) {
      case 'required':
        return 'Required';
      case 'min':
        return `Min ${errorWithLimit.min}`;
      case 'max':
        return `Max ${errorWithLimit.max}`;
      case 'minLength':
        return `Min ${errorWithLimit.minLength} chars`;
      case 'maxLength':
        return `Max ${errorWithLimit.maxLength} chars`;
      case 'email':
        return 'Invalid email';
      case 'pattern':
        return 'Invalid format';
      case 'parse':
        return 'Invalid value';
      default:
        return error.kind;
    }
  }
}
