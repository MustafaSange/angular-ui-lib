import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-radio-group',
  templateUrl: './radio-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroup {}
