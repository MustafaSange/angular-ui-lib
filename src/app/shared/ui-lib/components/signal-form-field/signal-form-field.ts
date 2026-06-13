import { Component, computed, contentChild } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { SignalFormError } from './signal-form-error/signal-form-error';
import { SignalFormHint } from './signal-form-hint/signal-form-hint';

@Component({
  selector: 'ms-signal-form-field',
  templateUrl: './signal-form-field.html',
  host: {
    '[class.is-required]': 'isRequired()',
  },
})
export class SignalFormField {
  private readonly field = contentChild<FormField<unknown>>(FormField);
  private readonly hint = contentChild(SignalFormHint);
  private readonly error = contentChild(SignalFormError);

  protected readonly showError = computed(() => {
    const field = this.field();
    const state = field?.state();

    return Boolean(this.error() && state?.invalid() && (state.touched() || state.dirty()));
  });

  protected readonly showHint = computed(() => Boolean(this.hint() && !this.showError()));

  protected readonly isRequired = computed(() => Boolean(this.field()?.state().required()));
}
