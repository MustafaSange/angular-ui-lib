import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-error',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormError {}
