import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './signal-form-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormError {}
