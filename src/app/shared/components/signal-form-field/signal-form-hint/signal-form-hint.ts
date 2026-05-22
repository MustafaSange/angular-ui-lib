import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hint',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormHint {}
