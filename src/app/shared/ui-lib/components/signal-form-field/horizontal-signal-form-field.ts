import { Component } from '@angular/core';

import { SignalFormError } from './signal-form-error/signal-form-error';
import { SignalFormField } from './signal-form-field';

/** Compact horizontal field; stacks at the shared mobile screen breakpoint. */
@Component({
  selector: 'ms-horizontal-signal-form-field',
  imports: [SignalFormError],
  templateUrl: './signal-form-field.html',
})
export class HorizontalSignalFormField extends SignalFormField {}
