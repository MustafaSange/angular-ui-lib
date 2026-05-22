import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-error',
  templateUrl: './signal-form-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormError {}
