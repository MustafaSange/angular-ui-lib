import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-checkbox-group',
  templateUrl: './checkbox-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroup {}
