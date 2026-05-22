import { ChangeDetectionStrategy, Component, computed, contentChild } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { SignalFormError } from './signal-form-error/signal-form-error';
import { SignalFormHint } from './signal-form-hint/signal-form-hint';

@Component({
  selector: 'app-signal-form-field',
  templateUrl: './signal-form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormField {
  private readonly field = contentChild<FormField<unknown>>(FormField);
  private readonly hint = contentChild(SignalFormHint);
  private readonly error = contentChild(SignalFormError);

  protected readonly showError = computed(() => {
    const field = this.field();

    return Boolean(this.error() && field?.state().invalid());
  });

  protected readonly showHint = computed(() => Boolean(this.hint() && !this.showError()));
}
