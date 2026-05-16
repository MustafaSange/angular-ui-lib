import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-fields',
  imports: [RouterLink],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFields {}
